import requests
TOKEN=open('.printify_token').read().strip()
HEAD={"Authorization": f"Bearer {TOKEN}","Content-Type":"application/json"}
shop_id=26935615

# IDs from your successful uploads (screenshot 7:49)
fid="6a92295ae64bf73492d63dc3"  # always_prevail
bid="6a9229b95a04ff42d4ac9230"  # never_surrender

black_ids=[32918,32919,32920,32921,32922,32923,32924,32925]
print(f"Using variants {black_ids}")
print(f"Front {fid} Back {bid}")

product={
"title":"DEZ - ALWAYS PREVAIL / NEVER SURRENDER Hoodie - Black",
"description":"DEZ Drop 001. Front ALWAYS PREVAIL. Back NEVER SURRENDER. Heavy blend 50/50. Rebel mindset. Men's S-3XL.",
"blueprint_id":77,
"print_provider_id":99,
"variants":[{"id":vid,"price":5499,"is_enabled":True} for vid in black_ids],
"print_areas":[{
"variant_ids":black_ids,
"placeholders":[
{"position":"front","images":[{"id":fid,"x":0.5,"y":0.5,"scale":0.8,"angle":0}]},
{"position":"back","images":[{"id":bid,"x":0.5,"y":0.5,"scale":0.9,"angle":0}]}
]}]
}

cr=requests.post(f"https://api.printify.com/v1/shops/{shop_id}/products.json",headers=HEAD,json=product)
print("\nCREATE:",cr.status_code)
print(cr.text[:4000])
if cr.status_code in [200,201]:
    print("\n🔥🔥🔥 SUCCESS!")
    print("Go to https://printify.com/app/products - your hoodie is LIVE")
