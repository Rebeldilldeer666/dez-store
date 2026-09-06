"""
verification.py — Rebel AI Master Engine
Webhook authenticity checks for all three gateways.

Each gateway proves a webhook is real in a different way, and none of them
are optional to skip — an unverified endpoint means anyone who finds the URL
can POST a fake "sale" and pollute your ledger, trigger fake sale
notifications, or (worse) trigger fulfillment logic you add later.

  Stripe        -> HMAC-SHA256 over "timestamp.raw_body", from Stripe-Signature
                   header. Implemented manually here (no `stripe` package
                   needed) using stdlib hmac/hashlib. This is Stripe's
                   documented algorithm for manual verification.

  Gumroad       -> Gumroad's Ping webhooks are NOT cryptographically signed.
                   There's no HMAC/secret to check. The two real defenses are:
                     (a) confirm the `seller_id` in the payload matches your
                         account (cheap, catches accidents/randos), and
                     (b) optionally confirm the sale_id is real by calling
                         Gumroad's API back (GET /v2/sales/:id) — this is the
                         only real proof, since seller_id alone is guessable.
                   Both are implemented below; (b) only runs if you set
                   GUMROAD_ACCESS_TOKEN.

  Digistore24   -> SHA-512 signature sent as `sha_sign`. Verified against
                   Digistore24's own published algorithm (sourced from their
                   developer docs / example PHP script): sort all other
                   parameters case-insensitively by key, and for each
                   non-empty value append "KEY=value<passphrase>" (the
                   passphrase is appended after every single field, not once
                   at the end), then SHA-512 the whole string and compare
                   uppercase hex digests.
"""

import hashlib
import hmac
import json
import time

import requests


# ---------------------------------------------------------------------------
# Stripe
# ---------------------------------------------------------------------------

def verify_stripe_signature(payload: bytes, sig_header: str, secret: str, tolerance_seconds: int = 300):
    """
    payload must be the RAW request body bytes (request.get_data() in Flask),
    not the parsed JSON — the signature is computed over the exact bytes sent.
    Returns (True, parsed_event_dict) or (False, reason_string).
    """
    if not secret:
        return False, "STRIPE_WEBHOOK_SECRET not configured"
    if not sig_header:
        return False, "Missing Stripe-Signature header"

    try:
        parts = dict(p.split("=", 1) for p in sig_header.split(",") if "=" in p)
    except ValueError:
        return False, "Malformed Stripe-Signature header"

    timestamp = parts.get("t")
    signature = parts.get("v1")
    if not timestamp or not signature:
        return False, "Malformed Stripe-Signature header"

    try:
        if abs(time.time() - int(timestamp)) > tolerance_seconds:
            return False, "Timestamp outside tolerance (possible replay)"
    except ValueError:
        return False, "Invalid timestamp in signature header"

    signed_payload = f"{timestamp}.".encode() + payload
    expected_sig = hmac.new(secret.encode(), signed_payload, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected_sig, signature):
        return False, "Signature mismatch"

    try:
        event = json.loads(payload)
    except json.JSONDecodeError:
        return False, "Invalid JSON payload"

    return True, event


# ---------------------------------------------------------------------------
# Gumroad
# ---------------------------------------------------------------------------

def verify_gumroad_payload(data: dict, expected_seller_id: str = "", access_token: str = ""):
    """
    Gumroad Ping has no signature. This does the two checks that are
    actually available:
      1. seller_id match (cheap, skipped if you haven't set GUMROAD_SELLER_ID)
      2. optional API callback to confirm the sale_id is real (only if you
         set GUMROAD_ACCESS_TOKEN — this is the meaningful check)
    Returns (True, reason) or (False, reason).
    """
    if expected_seller_id and data.get("seller_id") != expected_seller_id:
        return False, "seller_id does not match configured GUMROAD_SELLER_ID"

    if access_token:
        sale_id = data.get("sale_id")
        if not sale_id:
            return False, "No sale_id present to verify against Gumroad API"
        try:
            resp = requests.get(
                f"https://api.gumroad.com/v2/sales/{sale_id}",
                params={"access_token": access_token},
                timeout=10,
            )
            body = resp.json()
            if not body.get("success"):
                return False, "Gumroad API could not confirm this sale_id"
        except requests.RequestException as e:
            # Network hiccup shouldn't silently drop a real sale — accept but flag it.
            return True, f"Gumroad API check skipped (network error: {e})"

    return True, "ok"


# ---------------------------------------------------------------------------
# Digistore24
# ---------------------------------------------------------------------------

def verify_digistore24_signature(data: dict, passphrase: str):
    """
    Recomputes Digistore24's sha_sign and compares it to the one they sent.
    `data` should be the full form payload including sha_sign.
    """
    if not passphrase:
        return False, "DIGISTORE24_IPN_PASSPHRASE not configured"

    received_sign = data.get("sha_sign", "")
    if not received_sign:
        return False, "Missing sha_sign parameter"

    params = {k: v for k, v in data.items() if k.lower() != "sha_sign"}
    sorted_keys = sorted(params.keys(), key=lambda k: k.upper())

    sha_string = ""
    for key in sorted_keys:
        value = params[key]
        if value is None or value == "" or value is False:
            continue
        sha_string += f"{key.upper()}={value}{passphrase}"

    computed_sign = hashlib.sha512(sha_string.encode("utf-8")).hexdigest().upper()

    if not hmac.compare_digest(computed_sign, received_sign.upper()):
        return False, "Signature mismatch"

    return True, "ok"
