import requests, os, base64, sys
TOKEN = open('.printify_token').read().strip()
HEAD = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
r = requests.get("https://api.printify.com/v1/shops.json", headers=HEAD)
print("SHOPS:", r.text[:1200])
shops = r.json()
if not shops:
    print("\n>>> No shop yet! Go to printify.com -> My Stores -> Create Pop-Up Store named DEZ (free) then re-run")
    sys.exit(1)
shop_id = shops[0]['id']
print(f"Using shop {shop_id}")

def upload(p,name):
    print(f"Upload {name}...")
    with open(p,"rb") as f: b64=base64.b64encode(f.read()).decode()
    resp=requests.post("https://api.printify.com/v1/uploads/images.json",headers=HEAD,json={"file_name":name,"contents":b64})
    print(resp.status_code, resp.text[:800])
    resp.raise_for_status()
    return resp.json()['id']

fid=upload("always_prevail_transparent.png","always_prevail.png")
bid=upload("never_surrender_transparent.png","never_surrender.png")

product={
"title":"DEZ - ALWAYS PREVAIL / NEVER SURRENDER Hoodie",
"description":"DEZ Drop 001. Front ALWAYS PREVAIL. Back NEVER SURRENDER.",
"blueprint_id":77,"print_provider_id":99,
"variants":[
{"id":17887,"price":5499,"is_enabled":True},
{"id":17888,"price":5499,"is_enabled":True},
{"id":17889,"price":5499,"is_enabled":True},
{"id":17890,"price":5499,"is_enabled":True},
{"id":17891,"price":5499,"is_enabled":True},
{"id":17892,"price":5499,"is_enabled":True}],
"print_areas":[{"variant_ids":[17887,17888,17889,17890,17891,17892],"placeholders":[
{"position":"front","images":[{"id":fid,"x":0.5,"y":0.5,"scale":0.8,"angle":0}]},
{"position":"back","images":[{"id":bid,"x":0.5,"y":0.5,"scale":0.9,"angle":0}]}]}]}

cr=requests.post(f"https://api.printify.com/v1/shops/{shop_id}/products.json",headers=HEAD,json=product)
print("\nCREATE:",cr.status_code)
print(cr.text[:3000])
print("\nDone! Go to printify.com/app/products")
