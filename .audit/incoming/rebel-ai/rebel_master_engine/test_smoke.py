"""
test_smoke.py — Rebel AI Master Engine
Run this after `pip install -r requirements.txt` and before pointing real
webhooks at your deployment: `python test_smoke.py`

Exercises all three webhook routes with correctly-signed/formatted fake
payloads and checks: valid signatures are accepted, bad ones are rejected,
the ledger updates, duplicates (retries) don't double-count, and /api/stats
reflects the right totals.
"""

import hashlib
import hmac
import json
import os
import tempfile
import time

# Config must be set BEFORE importing app, since app.py reads env vars at import time.
TEST_STRIPE_SECRET = "whsec_test_secret_123"
TEST_GUMROAD_SELLER_ID = "seller_abc"
TEST_DS24_PASSPHRASE = "test_passphrase_xyz"

_tmp_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ["STRIPE_WEBHOOK_SECRET"] = TEST_STRIPE_SECRET
os.environ["GUMROAD_SELLER_ID"] = TEST_GUMROAD_SELLER_ID
os.environ["GUMROAD_ACCESS_TOKEN"] = ""
os.environ["DIGISTORE24_IPN_PASSPHRASE"] = TEST_DS24_PASSPHRASE
os.environ["LEDGER_DB_PATH"] = _tmp_db.name
os.environ["TELEGRAM_BOT_TOKEN"] = ""  # leave unset so notifications no-op instead of hitting network
os.environ["TELEGRAM_CHAT_ID"] = ""

import app as rebel_app  # noqa: E402


def make_stripe_signature(payload_bytes: bytes, secret: str, timestamp: int) -> str:
    signed_payload = f"{timestamp}.".encode() + payload_bytes
    sig = hmac.new(secret.encode(), signed_payload, hashlib.sha256).hexdigest()
    return f"t={timestamp},v1={sig}"


def make_ds24_signature(params: dict, passphrase: str) -> str:
    sorted_keys = sorted(params.keys(), key=lambda k: k.upper())
    sha_string = ""
    for key in sorted_keys:
        value = params[key]
        if value in (None, "", False):
            continue
        sha_string += f"{key.upper()}={value}{passphrase}"
    return hashlib.sha512(sha_string.encode("utf-8")).hexdigest().upper()


def run():
    client = rebel_app.app.test_client()
    failures = []

    def check(label, condition):
        status = "PASS" if condition else "FAIL"
        print(f"[{status}] {label}")
        if not condition:
            failures.append(label)

    # --- health check ---
    r = client.get("/")
    check("health check returns 200", r.status_code == 200)

    # --- Stripe: valid signature ---
    stripe_event = {
        "id": "evt_test_1",
        "type": "checkout.session.completed",
        "livemode": True,
        "data": {"object": {
            "amount_total": 3900, "currency": "usd",
            "customer_details": {"email": "buyer@example.com"},
            "description": "50 Hook Prompts for Faceless Creators",
        }},
    }
    body = json.dumps(stripe_event).encode()
    ts = int(time.time())
    sig = make_stripe_signature(body, TEST_STRIPE_SECRET, ts)
    r = client.post("/webhooks/stripe", data=body, content_type="application/json",
                     headers={"Stripe-Signature": sig})
    check("Stripe valid signature accepted (200)", r.status_code == 200)

    # --- Stripe: invalid signature rejected ---
    r = client.post("/webhooks/stripe", data=body, content_type="application/json",
                     headers={"Stripe-Signature": "t=123,v1=deadbeef"})
    check("Stripe invalid signature rejected (400)", r.status_code == 400)

    # --- Stripe: duplicate event (retry) doesn't double-count ---
    sig2 = make_stripe_signature(body, TEST_STRIPE_SECRET, int(time.time()))
    client.post("/webhooks/stripe", data=body, content_type="application/json",
                headers={"Stripe-Signature": sig2})
    stats = client.get("/api/stats").get_json()
    stripe_total = next((e["total"] for e in stats["by_gateway"].get("Stripe", []) if e["currency"] == "USD"), 0)
    check("Stripe duplicate event not double-counted ($39.00, not $78.00)", stripe_total == 39.00)

    # --- Gumroad: correct seller_id ---
    gumroad_payload = {
        "seller_id": TEST_GUMROAD_SELLER_ID, "sale_id": "gr_sale_1",
        "product_name": "50 Hook Prompts for Faceless Creators",
        "email": "buyer2@example.com", "price": "1900", "test": "false",
    }
    r = client.post("/webhooks/gumroad", data=gumroad_payload)
    check("Gumroad correct seller_id accepted (200)", r.status_code == 200)

    # --- Gumroad: wrong seller_id rejected ---
    bad_payload = dict(gumroad_payload, seller_id="someone_else", sale_id="gr_sale_2")
    r = client.post("/webhooks/gumroad", data=bad_payload)
    check("Gumroad wrong seller_id rejected (400)", r.status_code == 400)

    # --- Digistore24: correct signature ---
    ds24_params = {
        "event": "on_payment", "order_id": "ds24_order_1",
        "transaction_amount": "29.00", "transaction_currency": "USD",
        "buyer_email": "buyer3@example.com", "product_name": "Rebel AI Codex Access",
    }
    ds24_params["sha_sign"] = make_ds24_signature(ds24_params, TEST_DS24_PASSPHRASE)
    r = client.post("/webhooks/digistore24", data=ds24_params)
    check("Digistore24 valid sha_sign accepted (200)", r.status_code == 200)

    # --- Digistore24: tampered signature rejected ---
    tampered = dict(ds24_params, order_id="ds24_order_2")  # order_id changed, sha_sign now stale
    r = client.post("/webhooks/digistore24", data=tampered)
    check("Digistore24 tampered payload rejected (400)", r.status_code == 400)

    # --- final stats sanity check ---
    stats = client.get("/api/stats").get_json()
    print("\nFinal /api/stats:", json.dumps(stats, indent=2))
    usd_total = stats["totals_by_currency"].get("USD", 0)
    check("Combined USD total is 39.00 + 19.00 + 29.00 = 87.00", usd_total == 87.00)

    print(f"\n{len(failures)} failure(s)." if failures else "\nAll checks passed.")
    os.unlink(_tmp_db.name)
    return len(failures) == 0


if __name__ == "__main__":
    import sys
    sys.exit(0 if run() else 1)
