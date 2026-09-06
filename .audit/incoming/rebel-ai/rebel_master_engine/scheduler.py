"""
scheduler.py — Rebel AI Master Engine
Optional background loop: sends a daily revenue digest to Telegram.

This is a real background thread — it only works on a host with a persistent,
always-on process (Render, Railway, Fly.io, a VPS, PythonAnywhere, your own
machine). It will NOT run on Vercel/Netlify serverless functions: those spin
up per-request and shut down, so a thread started inside one never survives
past that single request. If you're deploying there, replace this with
Vercel Cron Jobs hitting the /cron/daily-digest route in app.py instead
(free on the Hobby plan, capped at one run per day — which is exactly what
this needs). See README.md.

No external scheduling library required — this uses a plain background
thread with a sleep loop, which is all a single daily job needs.
"""

import logging
import threading
import time
from datetime import datetime, timezone

logger = logging.getLogger("RebelAI-MasterEngine")


def _seconds_until_next_run(hour: int, minute: int) -> float:
    now = datetime.now(timezone.utc)
    target = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    if target <= now:
        target = target.replace(day=target.day + 1) if target.day < 28 else None
        if target is None:
            # Roll over month-safely
            from datetime import timedelta
            target = now.replace(hour=hour, minute=minute, second=0, microsecond=0) + timedelta(days=1)
    return max((target - now).total_seconds(), 1)


def build_digest_text(ledger) -> str:
    summary = ledger.get_summary()
    totals = summary.get("totals_by_currency", {})
    if not totals:
        return "📊 Rebel AI daily digest: no recorded sales yet."

    lines = ["📊 *Rebel AI daily digest*"]
    for gateway, entries in summary.get("by_gateway", {}).items():
        for entry in entries:
            lines.append(f"• {gateway}: {entry['total']} {entry['currency']} ({entry['sales']} sales)")
    lines.append("")
    lines.append("Total: " + ", ".join(f"{v} {c}" for c, v in totals.items()))
    return "\n".join(lines)


def start_daily_digest_loop(ledger, send_message_fn, hour_utc: int = 9, minute_utc: int = 0):
    """
    Starts a daemon background thread that sends one Telegram digest per day
    at hour_utc:minute_utc. Call this once, after the Flask app is created,
    only when running on a persistent host (see module docstring).
    """

    def _loop():
        while True:
            sleep_seconds = _seconds_until_next_run(hour_utc, minute_utc)
            logger.info(f"Digest loop sleeping {sleep_seconds:.0f}s until next run.")
            time.sleep(sleep_seconds)
            try:
                send_message_fn(build_digest_text(ledger))
                logger.info("Daily digest sent.")
            except Exception as e:
                logger.error(f"Daily digest failed: {e}")

    thread = threading.Thread(target=_loop, daemon=True, name="daily-digest-loop")
    thread.start()
    return thread
