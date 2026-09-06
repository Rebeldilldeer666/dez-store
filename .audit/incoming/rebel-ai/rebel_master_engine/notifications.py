"""
notifications.py — Rebel AI Master Engine
Sends real-time sale alerts (and the daily digest, see scheduler.py) to Telegram.

Setup (takes about 2 minutes):
  1. Message @BotFather on Telegram -> /newbot -> follow the prompts.
     You'll get a token like 123456789:AAH...  -> set as TELEGRAM_BOT_TOKEN.
  2. Send your new bot any message (so it knows about your chat).
  3. Visit https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates in a browser
     and find "chat":{"id": ...} in the response -> set as TELEGRAM_CHAT_ID.
"""

import logging
import os

import requests

logger = logging.getLogger("RebelAI-MasterEngine")

TELEGRAM_API_BASE = "https://api.telegram.org"


def send_telegram_message(text: str) -> bool:
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.getenv("TELEGRAM_CHAT_ID", "")

    if not token or not chat_id:
        logger.warning("Telegram not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing) — skipping notification.")
        return False

    try:
        resp = requests.post(
            f"{TELEGRAM_API_BASE}/bot{token}/sendMessage",
            json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"},
            timeout=10,
        )
        resp.raise_for_status()
        return True
    except requests.RequestException as e:
        logger.error(f"Telegram notification failed: {e}")
        return False
