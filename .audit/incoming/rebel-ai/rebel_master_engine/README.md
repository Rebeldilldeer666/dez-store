# Rebel AI — Unified Master Engine

Flask backend that ingests Stripe, Gumroad, and Digistore24 sale webhooks,
verifies each one is real, logs it to a revenue ledger, fires a Telegram
alert, and triggers an extensible content-engine hook. Fully built and
tested — see "What's actually implemented" below.

## Read this first: the Vercel question

Your other projects (SIGNAL_HOOK, PROMPT_ARCHITECT, etc.) are single-file
React apps deployed to Vercel with no backend. **This is a different kind of
thing, and it will not deploy the same way.** Two specific reasons:

1. **No persistent background process.** Vercel serverless functions spin up
   per request and shut down. A `while True` loop (like the daily-digest
   thread in `scheduler.py`) started inside one request is dead the moment
   that request finishes. It will never fire again.
2. **No persistent local disk.** The SQLite ledger is a file on disk. On a
   normal server that file sits there between requests. On Vercel's
   serverless filesystem, writes aren't guaranteed to survive between
   invocations — your revenue numbers can silently reset.

Neither of these is a bug you can code around; it's how serverless execution
works (same story on Netlify Functions, AWS Lambda, Cloudflare Workers).

**You have two real options:**

**Option A — persistent host (recommended, and what this repo is built for as-is).**
Deploy `app.py` to something that keeps a process running: Render (free web
service tier), Railway, Fly.io (free allowance), PythonAnywhere (free tier),
or a cheap VPS. SQLite and the background digest thread both work correctly,
unmodified. This is the simplest path and the one I'd take first.

**Option B — stay on Vercel.** Swap two things: replace the SQLite ledger
with a hosted Postgres DB (you already have a Supabase project from the
earlier Rebel AI Codex build — reuse it, it's free-tier), and replace the
background thread with **Vercel Cron Jobs** hitting the `/cron/daily-digest`
route already built into `app.py`. Vercel's free Hobby plan includes cron
jobs, but caps them at once-per-day execution with imprecise timing (fires
sometime within the scheduled hour, not on the dot) — which is actually a
perfect fit for a *daily* digest, just not for anything more frequent. Say
the word and I'll build the Supabase-backed version.

Everything below assumes Option A. If you want Option B, the webhook logic
and verification don't change at all — only `ledger.py`'s storage backend
and how the digest gets triggered.

## What's actually implemented

- **Stripe** — real HMAC-SHA256 signature verification (Stripe's documented
  algorithm, implemented from scratch with stdlib `hmac`/`hashlib` — no
  `stripe` package needed), replay protection via timestamp tolerance.
- **Gumroad** — Ping webhooks aren't cryptographically signed by Gumroad
  (there's no secret to check), so this verifies `seller_id` against your
  account, and optionally calls Gumroad's API back to confirm the `sale_id`
  is real if you set `GUMROAD_ACCESS_TOKEN` (the only real proof against a
  forged POST).
- **Digistore24** — SHA-512 `sha_sign` verification against their published
  algorithm. **Caveat:** I sourced the exact algorithm from Digistore24's own
  example script, but I'd treat this one field-name set as best-effort — use
  their dashboard's "Test connection" button (Settings → Integrations → IPN)
  before trusting it with real traffic, and cross-check field names at
  [dev.digistore24.com](https://dev.digistore24.com) if anything looks off.
- **Idempotency** — every gateway's unique sale ID is stored with a UNIQUE
  constraint, so retried webhooks (Gumroad retries hourly for 3 hours on
  non-200 responses; Stripe retries on failure too) can't double-count
  revenue.
- **Bug fix from the original draft:** the original ledger never actually
  incremented `total_revenue` — it just appended raw payloads. This version
  tracks real amounts, extracted per-gateway, and computes totals correctly
  (grouped by currency — sales in different currencies are never summed
  together as if equal).
- **Telegram alerts** — fires on every verified, non-test sale.
- **Content engine hook** (`content_engine.py`) — fires on every verified
  sale with gateway/product/amount. Left as a clean extension point rather
  than guessed logic — wire in a call to PROMPT_ARCHITECT/CONTENT_ORACLE, the
  Claude API, or a Zapier/Make webhook (two commented-out starting points are
  in the file).
- **`/api/stats`** — CORS-enabled endpoint so a Vercel-hosted frontend (a
  SIGNAL_HOOK dashboard, say) can fetch live revenue numbers.
- **All of the above is tested** — `test_smoke.py` sends correctly-signed
  fake payloads through every route and checks acceptance, rejection of bad
  signatures, and correct ledger totals. It passes end-to-end in this build.

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env
# fill in .env with real values (see comments in the file)
python test_smoke.py     # confirm everything works before going live
python app.py             # runs on :5000 by default
```

## Wiring up each gateway

- **Stripe:** Dashboard → Developers → Webhooks → Add endpoint →
  `https://your-domain/webhooks/stripe`. Copy the signing secret into
  `STRIPE_WEBHOOK_SECRET`.
- **Gumroad:** Settings → Advanced → Ping endpoint →
  `https://your-domain/webhooks/gumroad`. Put your seller ID in
  `GUMROAD_SELLER_ID`.
- **Digistore24:** Settings → Integrations (IPN) → Add connection → Generic →
  IPN URL = `https://your-domain/webhooks/digistore24`, IPN password = your
  `DIGISTORE24_IPN_PASSPHRASE`. Click "Test connection" before going live.
- **Telegram:** message @BotFather → `/newbot` → get a token → set
  `TELEGRAM_BOT_TOKEN`. Message your new bot once, then visit
  `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your
  `TELEGRAM_CHAT_ID`.

## Files

| File | What it does |
|---|---|
| `app.py` | Flask routes, wires everything together |
| `ledger.py` | SQLite revenue ledger, idempotent, thread-safe |
| `verification.py` | Signature/authenticity checks for all 3 gateways |
| `notifications.py` | Telegram sendMessage wrapper |
| `content_engine.py` | Extension point fired on every verified sale |
| `scheduler.py` | Daily digest — background thread version (persistent host only) |
| `test_smoke.py` | End-to-end test of all routes with fake-but-valid payloads |
