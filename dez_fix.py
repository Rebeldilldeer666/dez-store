import requests, json
TOKEN=open('.printify_token').read().strip()
HEAD={"Authorization": f"Bearer {TOKEN}","Content-Type":"application/json"}
shop_id=26935615

# 1. get correct variant IDs for Gildan 18500 Black
r=requests.get("https://api.printify.com/v1/catalog/blueprints/77/print_providers/99/variants.json",headers=HEAD)
data=r.json()
variants=data['variants'] if 'variants' in data else data
black=[v for v in variants if 'Black' in v['title']]
print(f"Found {len(black)} Black variants: {[v['id'] for v in black]}")

# 2. get last 2 uploaded image IDs (the ones you just uploaded)
up=requests.get("https://api.printify.com/v1/uploads/images.json",headers=HEAD,params={"limit":2}).json()
# most recent first
bid=up['data'][0]['id'] # never_surrender (last uploaded)
fid=up['data'][1]['id'] # always_prevail
print(f"Using front {fid} back {bid}")

product={
"title":"DEZ - ALWAYS PREVAIL / NEVER SURRENDER Hoodie - Black",
"description":"DEZ Drop 001. Front: ALWAYS PREVAIL. Back: NEVER SURRENDER. Heavy blend 50/50. Rebel mindset.",
"blueprint_id":77,
"print_provider_id":99,
"variants":[{"id":v['id'],"price":5499,"is_enabled":True} for v in black],
"print_areas":[{
"variant_ids":[v['id'] for v in black],
"placeholders":[
{"position":"front","images":[{"id":fid,"x":0.5,"y":0.5,"scale":0.8,"angle":0}]},
{"position":"back","images":[{"id":bid,"x":0.5,"y":0.5,"scale":0.9,"angle":0}]}
]}]
}

cr=requests.post(f"https://api.printify.com/v1/shops/{shop_id}/products.json",headers=HEAD,json=product)
print("\nCREATE:",cr.status_code)
print(cr.text[:4000])
if cr.status_code in [200,201]:
    print("\n🔥🔥🔥 SUCCESS - Hoodie created!")
    print("Go to: https://printify.com/app/products")
else:
    print("\nCheck error above")
