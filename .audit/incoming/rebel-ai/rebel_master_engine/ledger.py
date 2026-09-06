"""
ledger.py — Rebel AI Master Engine
Revenue ledger backed by SQLite.

Why SQLite instead of the flat JSON file from the original draft:
  1. The original script read-modified-wrote a single JSON file on every webhook.
     Two webhooks landing close together (very possible — Stripe retries, or a
     Gumroad + Stripe sale seconds apart) can race: both read the old file, both
     append, one write clobbers the other, and a real sale silently vanishes.
  2. SQLite handles concurrent writes safely on its own and ships in Python's
     standard library — no new service, no new cost, no new account.
  3. It gives you real querying later (revenue by gateway, by day, by product)
     instead of having to parse a growing JSON array by hand.

IMPORTANT DEPLOYMENT NOTE (read this before you deploy):
  SQLite writes to a file on local disk. That's fine on a normal server
  (Render, Railway, Fly.io, a VPS, PythonAnywhere, your own machine) where the
  disk persists between requests. It is NOT fine on Vercel/Netlify serverless
  functions — their filesystem is ephemeral and often not even shared between
  concurrent invocations, so the ledger can silently reset or lose rows. If you
  deploy this on Vercel, swap this module's storage for an external database
  (e.g. Supabase Postgres — see README.md) instead of pointing it at a local
  .db file. The public interface below (record_transaction / get_summary /
  get_recent_transactions) is the same either way, so the rest of the app
  doesn't need to change.
"""

import json
import sqlite3
import threading
import os
from contextlib import contextmanager
from datetime import datetime, timezone


class RevenueLedger:
    def __init__(self, db_path: str = "revenue_ledger.db"):
        self.db_path = db_path
        dirname = os.path.dirname(db_path)
        if dirname:
            os.makedirs(dirname, exist_ok=True)
        self._lock = threading.Lock()
        self._init_db()

    @contextmanager
    def _connect(self):
        conn = sqlite3.connect(self.db_path, timeout=10)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    def _init_db(self):
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    gateway TEXT NOT NULL,
                    external_id TEXT,
                    event_type TEXT NOT NULL,
                    product_name TEXT,
                    amount_cents INTEGER NOT NULL DEFAULT 0,
                    currency TEXT NOT NULL DEFAULT 'USD',
                    customer_email TEXT,
                    status TEXT NOT NULL DEFAULT 'recorded',
                    raw_payload TEXT,
                    created_at TEXT NOT NULL
                )
                """
            )
            # Partial unique index: prevents double-counting the same sale when
            # a gateway retries a webhook (Gumroad retries hourly for 3 hours on
            # non-200 responses; Stripe retries on failure too).
            conn.execute(
                """
                CREATE UNIQUE INDEX IF NOT EXISTS idx_gateway_external_id
                ON transactions(gateway, external_id)
                WHERE external_id IS NOT NULL
                """
            )

    def record_transaction(
        self,
        gateway: str,
        event_type: str,
        amount_cents: int = 0,
        currency: str = "USD",
        product_name: str = None,
        customer_email: str = None,
        external_id: str = None,
        raw_payload=None,
        status: str = "recorded",
    ) -> dict:
        """
        Insert a transaction. Returns {"recorded": bool, "duplicate": bool}.
        If external_id was already recorded for this gateway, the insert is
        skipped and duplicate=True is returned — call sites should still
        respond 200 to the webhook so the gateway stops retrying.
        """
        created_at = datetime.now(timezone.utc).isoformat()
        payload_json = None
        if raw_payload is not None:
            try:
                payload_json = json.dumps(raw_payload)[:20000]  # cap payload size stored
            except (TypeError, ValueError):
                payload_json = str(raw_payload)[:20000]

        with self._lock:
            with self._connect() as conn:
                try:
                    conn.execute(
                        """
                        INSERT INTO transactions
                            (gateway, external_id, event_type, product_name, amount_cents,
                             currency, customer_email, status, raw_payload, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            gateway, external_id, event_type, product_name, amount_cents,
                            currency, customer_email, status, payload_json, created_at,
                        ),
                    )
                    return {"recorded": True, "duplicate": False}
                except sqlite3.IntegrityError:
                    return {"recorded": False, "duplicate": True}

    def get_summary(self) -> dict:
        """Revenue totals grouped by gateway and currency, plus overall counts."""
        with self._connect() as conn:
            rows = conn.execute(
                """
                SELECT gateway, currency,
                       SUM(CASE WHEN event_type = 'sale' AND status = 'recorded'
                                THEN amount_cents ELSE 0 END) AS total_cents,
                       COUNT(CASE WHEN event_type = 'sale' AND status = 'recorded'
                                  THEN 1 END) AS sale_count
                FROM transactions
                GROUP BY gateway, currency
                """
            ).fetchall()

        by_gateway = {}
        totals_by_currency = {}
        for row in rows:
            gw, currency, total_cents, sale_count = (
                row["gateway"], row["currency"], row["total_cents"], row["sale_count"]
            )
            if total_cents == 0 and sale_count == 0:
                continue
            by_gateway.setdefault(gw, []).append(
                {"currency": currency, "total": round(total_cents / 100, 2), "sales": sale_count}
            )
            totals_by_currency[currency] = round(totals_by_currency.get(currency, 0) + total_cents / 100, 2)

        return {
            "by_gateway": by_gateway,
            "totals_by_currency": totals_by_currency,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

    def get_recent_transactions(self, limit: int = 50) -> list:
        with self._connect() as conn:
            rows = conn.execute(
                """
                SELECT gateway, event_type, product_name, amount_cents, currency,
                       customer_email, status, created_at
                FROM transactions
                ORDER BY id DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
        return [dict(row) for row in rows]
