# Dez Store catalog bug report

## Status

Generated during the catalog accuracy audit on September 6, 2026.

## Findings

- **Resolved: incomplete pagination risk.** The catalog route now reads all active Stripe products, not only the first page.
- **Resolved: silent product loss.** The API now reports `total`, `purchasable`, and `missingDefaultPrice` so products without a default one-time price are distinguishable from missing products.
- **Resolved: account ambiguity.** The API reports the authenticated Stripe account ID and live/test mode diagnostic without exposing credentials.
- **Confirmed limitation: Printify is not a catalog source yet.** Its products are not merged into the storefront because no verified Printify runtime connection is available.
- **Confirmed limitation: Stripe dashboard and app credentials may differ.** If the app reports a different account ID or count than the dashboard, the project is using different Stripe credentials or mode. This cannot be corrected by code alone.

## Verification procedure

1. Open `/api/products` in production.
2. Compare `stripeAccount`, `livemode`, and `total` with the Stripe dashboard account and mode.
3. Compare `purchasable` with products that have an active default price.
4. Products counted in Stripe but absent from `purchasable` need an active default price before checkout can be enabled.

## Safety

The storefront never invents products, prices, or Printify data. Checkout remains limited to server-validated Stripe product IDs.
