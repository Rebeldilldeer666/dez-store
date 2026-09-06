"""
content_engine.py — Rebel AI Master Engine
Fires once per verified, successfully-recorded sale.

This is deliberately a clean extension point rather than a guess at logic
you haven't specified. "Background content engine" could mean a lot of
different things — auto-drafting a hook/caption for the next TikTok, pinging
PROMPT_ARCHITECT / CONTENT_ORACLE to generate a post, queueing a Zapier/Make
webhook, logging milestones for a highlight reel — and wiring in the wrong
one would just be dead code you'd have to rip out. Wire your real logic into
on_sale_event() below; everything upstream (webhooks -> verification ->
ledger) already calls it correctly on every real sale.

Two ready-to-uncomment starting points are included: calling the Claude API
directly, and forwarding to an external automation webhook (Zapier/Make/n8n).
"""

import logging
import os

logger = logging.getLogger("RebelAI-MasterEngine")


def on_sale_event(gateway: str, product_name: str, amount: float, currency: str, customer_email: str = None) -> dict:
    trigger_event = {
        "type": "sale_content_trigger",
        "gateway": gateway,
        "product": product_name,
        "amount": amount,
        "currency": currency,
    }
    logger.info(f"Content engine triggered: {trigger_event}")

    # --- Option A: generate a post idea with the Claude API -----------------
    # import anthropic
    # client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    # msg = client.messages.create(
    #     model="claude-sonnet-4-6",
    #     max_tokens=300,
    #     messages=[{
    #         "role": "user",
    #         "content": f"Write a 2-line hook for a TikTok celebrating a sale of "
    #                    f"'{product_name}' for {amount} {currency}. Rebel AI Codex "
    #                    f"voice: glitch/signal, no fluff.",
    #     }],
    # )
    # trigger_event["generated_hook"] = msg.content[0].text

    # --- Option B: forward to an external automation tool --------------------
    # zap_url = os.getenv("CONTENT_AUTOMATION_WEBHOOK_URL")
    # if zap_url:
    #     import requests
    #     requests.post(zap_url, json=trigger_event, timeout=10)

    return trigger_event
