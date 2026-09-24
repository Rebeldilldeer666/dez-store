#!/bin/bash
echo "Installing Vercel CLI..."
npm i -g vercel
echo "Logging in - browser will open"
vercel login
for proj in "dez-rebel-store-exact-dez-character-ready-to-post" "dez-rebel-ai-666" "rebelai-852u" "rebelai" "downloads" "faceless-automation" "rebelai-tfkc" "rebelai-storefront" "10-videos-scripts" "rebel-sales-dashboard" "ugc-engine-siqw" "ugc-engine" "signal-from-the-void" "rebel-a-i"; do
  echo "Deleting $proj"
  vercel remove $proj --yes 2>&1 || echo "not found $proj"
done
echo "DONE"
