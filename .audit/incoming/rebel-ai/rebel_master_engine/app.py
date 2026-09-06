"""
Rebel AI - Unified Master Engine & Revenue Automation Framework
-----------------------------------------------------------------
Flask webhook routing for Stripe, Gumroad, and Digistore24, a SQLite revenue
ledger, Telegram sale alerts + optional daily digest, and an extensible
content-engine hook that fires on every verified sale.

Routes:
  GET  /                          health check
  GET  /api/stats                 revenue summary (for Vercel-hosted frontends to pull)
  GET  /api/transactions          recent transactions (debugging / dashboards)
  POST /webhooks/stripe           Stripe event ingestion (HMAC-verified)
  POST /webhooks/gumroad          Gumroad Ping ingestion (seller_id / API-verified)
  POST /webhooks/digistore24      Digistore24 IPN ingestion (SHA-512 verified)
  GET/POST /cron/daily-digest     for external schedulers (Vercel Cron, cron-job.org)
                                   protected by CRON_SECRET if set

Read README.md before deploying — in particular the note about Vercel
serverless not supporting local file storage or background threads.
"""

import logging
import os

from flask import Flask, jsonify, request

from content_engine import on_sale_event
from ledger import RevenueLedger
from notifications import send_telegram_message
from scheduler import build_digest_text, start_daily_digest_loop
from verification import (
    verify_digistore24_signature,
    verify_gumroad_payload,
    verify_stripe_signature,
)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("RebelAI-MasterEngine")

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024  # 1MB cap on incoming webhook bodies

# --- Configuration ----------------------------------------------------------
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
GUMROAD_SELLER_ID = os.getenv("GUMROAD_SELLER_ID", "")
GUMROAD_ACCESS_TOKEN = os.getenv("GUMROAD_ACCESS_TOKEN", "")
DIGISTORE24_IPN_PASSPHRASE = os.getenv("DIGISTORE24_IPN_PASSPHRASE", "")
LEDGER_DB_PATH = os.getenv("LEDGER_DB_PATH", "revenue_ledger.db")
CORS_ALLOW_ORIGIN = os.getenv("CORS_ALLOW_ORIGIN", "*")
CRON_SECRET = os.getenv("CRON_SECRET", "")
ENABLE_BACKGROUND_DIGEST = os.getenv("ENABLE_BACKGROUND_DIGEST", "false").lower() == "true"

ledger = RevenueLedger(LEDGER_DB_PATH)


@app.after_request
def add_cors_headers(response):
    # Lets Vercel-hosted frontends (SIGNAL_HOOK, dashboards, etc.) fetch /api/stats directly.
    response.headers["Access-Control-Allow-Origin"] = CORS_ALLOW_ORIGIN
    return response


def _notify_and_trigger(gateway, product_name, amount_cents, currency, customer_email):
    amount = amount_cents / 100
    message = f"💰 New sale via {gateway}\n{product_name}\n{amount:.2f} {currency}"
    send_telegram_message(message)
    try:
        on_sale_event(gateway, product_name, amount, currency, customer_email)
    except Exception as e:
        logger.error(f"content_engine.on_sale_event raised: {e}")


# ---------------------------------------------------------------------------
# Health / stats
# ---------------------------------------------------------------------------

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "operational",
        "system": "Rebel AI Master Ecosystem",
        "version": "2.1.0",
    }), 200


@app.route("/api/stats", methods=["GET"])
def stats():
    return jsonify(ledger.get_summary()), 200


@app.route("/api/transactions", methods=["GET"])
def transactions():
    limit = request.args.get("limit", default=50, type=int)
    return jsonify(ledger.get_recent_transactions(limit=min(limit, 200))), 200


# ---------------------------------------------------------------------------
# Stripe
# ---------------------------------------------------------------------------

@app.route("/webhooks/stripe", methods=["POST"])
def stripe_webhook():
    raw_body = request.get_data()
    sig_header = request.headers.get("Stripe-Signature", "")

    ok, result = verify_stripe_signature(raw_body, sig_header, STRIPE_WEBHOOK_SECRET)
    if not ok:
        logger.warning(f"Stripe webhook rejected: {result}")
        return jsonify({"status": "error", "message": result}), 400

    event = result
    event_type = event.get("type", "unknown")
    data_object = event.get("data", {}).get("object", {})
    is_test = not event.get("livemode", True)

    try:
        if event_type in ("checkout.session.completed", "payment_intent.succeeded"):
            amount_cents = data_object.get("amount_total")
            if amount_cents is None:
                amount_cents = data_object.get("amount_received") or data_object.get("amount") or 0
            currency = (data_object.get("currency") or "usd").upper()
            customer_email = (
                (data_object.get("customer_details") or {}).get("email")
                or data_object.get("receipt_email")
            )
            product_name = data_object.get("description") or "Stripe sale"

            outcome = ledger.record_transaction(
                gateway="Stripe", event_type="sale", amount_cents=amount_cents,
                currency=currency, product_name=product_name, customer_email=customer_email,
                external_id=event.get("id"), raw_payload=event,
                status="test_mode" if is_test else "recorded",
            )
            if outcome["recorded"] and not is_test:
                _notify_and_trigger("Stripe", product_name, amount_cents, currency, customer_email)
        else:
            logger.info(f"Stripe event '{event_type}' logged (not a sale-completion event).")
            ledger.record_transaction(
                gateway="Stripe", event_type=event_type, external_id=event.get("id"),
                raw_payload=event, status="logged",
            )
    except Exception as e:
        logger.error(f"Error processing Stripe event: {e}")
        return jsonify({"status": "error", "message": "internal error"}), 500

    return jsonify({"status": "success", "gateway": "Stripe"}), 200


# ---------------------------------------------------------------------------
# Gumroad
# ---------------------------------------------------------------------------

@app.route("/webhooks/gumroad", methods=["POST"])
def gumroad_webhook():
    # Gumroad Ping sends application/x-www-form-urlencoded, not JSON.
    data = request.form.to_dict()
    if not data:
        data = request.get_json(silent=True) or {}

    logger.info("Received Gumroad Ping event.")

    ok, reason = verify_gumroad_payload(data, GUMROAD_SELLER_ID, GUMROAD_ACCESS_TOKEN)
    if not ok:
        logger.warning(f"Gumroad webhook rejected: {reason}")
        return jsonify({"status": "error", "message": reason}), 400

    try:
        is_test = data.get("test") == "true"
        amount_cents = int(data.get("price", 0) or 0)  # Gumroad sends price in USD cents
        product_name = data.get("product_name", "Gumroad sale")
        customer_email = data.get("email")
        external_id = data.get("sale_id")

        outcome = ledger.record_transaction(
            gateway="Gumroad", event_type="sale",
            amount_cents=amount_cents, currency="USD", product_name=product_name,
            customer_email=customer_email, external_id=external_id, raw_payload=data,
            status="test_mode" if is_test else "recorded",
        )
        if outcome["recorded"] and not is_test:
            _notify_and_trigger("Gumroad", product_name, amount_cents, "USD", customer_email)
    except Exception as e:
        logger.error(f"Error processing Gumroad event: {e}")
        return jsonify({"status": "error", "message": "internal error"}), 500

    return jsonify({"status": "success", "gateway": "Gumroad"}), 200


# ---------------------------------------------------------------------------
# Digistore24
# ---------------------------------------------------------------------------

@app.route("/webhooks/digistore24", methods=["POST"])
def digistore24_webhook():
    data = request.form.to_dict()
    if not data:
        data = request.get_json(silent=True) or {}

    logger.info("Received Digistore24 IPN event.")

    ok, reason = verify_digistore24_signature(data, DIGISTORE24_IPN_PASSPHRASE)
    if not ok:
        logger.warning(f"Digistore24 IPN rejected: {reason}")
        return jsonify({"status": "error", "message": reason}), 400

    try:
        event_name = data.get("event", "unknown")
        is_test = data.get("test_mode", data.get("testmode", "")) in ("1", "true", "True")
        try:
            amount_cents = int(round(float(data.get("transaction_amount", data.get("amount", 0)) or 0) * 100))
        except ValueError:
            amount_cents = 0
        currency = (data.get("transaction_currency") or data.get("currency") or "USD").upper()
        product_name = data.get("product_name", "Digistore24 sale")
        customer_email = data.get("buyer_email") or data.get("email")
        external_id = data.get("order_id") or data.get("transaction_id")

        outcome = ledger.record_transaction(
            gateway="Digistore24",
            event_type="sale" if event_name == "on_payment" else event_name,
            amount_cents=amount_cents, currency=currency, product_name=product_name,
            customer_email=customer_email, external_id=external_id, raw_payload=data,
            status="test_mode" if is_test else "recorded",
        )
        if outcome["recorded"] and event_name == "on_payment" and not is_test:
            _notify_and_trigger("Digistore24", product_name, amount_cents, currency, customer_email)
    except Exception as e:
        logger.error(f"Error processing Digistore24 event: {e}")
        return jsonify({"status": "error", "message": "internal error"}), 500

    return jsonify({"status": "success", "gateway": "Digistore24"}), 200


# ---------------------------------------------------------------------------
# Cron endpoint (for Vercel Cron / cron-job.org / any external scheduler)
# ---------------------------------------------------------------------------

@app.route("/cron/daily-digest", methods=["GET", "POST"])
def cron_daily_digest():
    if CRON_SECRET:
        provided = request.headers.get("Authorization", "").removeprefix("Bearer ")
        if provided != CRON_SECRET:
            return jsonify({"status": "error", "message": "unauthorized"}), 401
    send_telegram_message(build_digest_text(ledger))
    return jsonify({"status": "success"}), 200


# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if ENABLE_BACKGROUND_DIGEST:
        # Only meaningful on a persistent host — see scheduler.py docstring.
        start_daily_digest_loop(ledger, send_telegram_message)
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
