import requests, json
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.your_token_here"  # <-- paste your Printify API token
SHOP_ID="26935615"

# 1. List your products
h={"Authorization": f"Bearer {TOKEN}"}
r=requests.get(f"https://api.printify.com/v1/shops/{SHOP_ID}/products.json", headers=h)
print(r.text[:2000])

# Find your hoodie ID from that output, then order it
# After you see ID, run the order part
