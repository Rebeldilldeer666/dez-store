#!/bin/bash
if [ -z "$VERCEL_TOKEN" ]; then
  echo "Set token first: export VERCEL_TOKEN=vercel_..."
  echo "Get at https://vercel.com/account/tokens"
  exit 1
fi
echo "Deleting duplicates..."
for proj in "dez-rebel-store-exa" "dez-rebel-ai-666" "faceless-automation" "downloads" "rebelai-storefront" "rebelai-tfkc" "rebelai-852u" "rebelai" "ugc-engine-siqw"; do
  ID=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v9/projects?search=$proj" | python3 -c "import json,sys; d=json.load(sys.stdin); 
for p in d.get('projects',[]):
 if p['name'].startswith('$proj') or '$proj' in p['name']:
  print(p['id']); break" 2>/dev/null)
  if [ ! -z "$ID" ]; then
    echo "Deleting $proj..."
    curl -s -X DELETE -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v9/projects/$ID" > /dev/null
    echo "deleted $proj"
  fi
done
echo "Fixing dez-store..."
DEZ=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v9/projects?search=dez-store" | python3 -c "import json,sys;d=json.load(sys.stdin);
for p in d.get('projects',[]):
 if p['name']=='dez-store': print(p['id']); break")
if [ ! -z "$DEZ" ]; then
  curl -s -X PATCH -H "Authorization: Bearer $VERCEL_TOKEN" -H "Content-Type: application/json" -d '{"framework":null,"buildCommand":null,"outputDirectory":null,"installCommand":null}' "https://api.vercel.com/v9/projects/$DEZ" > /dev/null
  echo "dez-store set to static"
fi
echo "DONE - only dez-store should remain"
