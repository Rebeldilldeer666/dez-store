import os, requests, time
from pathlib import Path

TOKEN = os.getenv("THREADS_TOKEN")
if not TOKEN or TOKEN == "PASTE_YOUR_TOKEN_HERE":
    print("❌ No THREADS_TOKEN set. Dry run only.")
    print("Run: export THREADS_TOKEN='your_token'")
    exit()

caption = Path("NEXT_POST.txt").read_text()[:500]
image_name = Path("LAST_IMAGE.txt").read_text().strip().split("/")[-1] if Path("LAST_IMAGE.txt").exists() else "dez-stoic.png"
image_url = f"https://dez-store.vercel.app/{image_name}"

print(f"Posting:\n{caption}\nImage URL: {image_url}")

# 1. Get Threads User ID
r = requests.get(f"https://graph.threads.net/v1.0/me?fields=id&access_token={TOKEN}")
if r.status_code != 200:
    print(f"Token error: {r.text}")
    exit()
user_id = r.json()['id']
print(f"User ID: {user_id} - @lost.soul1515")

# 2. Create media container
payload = {
    "media_type": "IMAGE",
    "image_url": image_url,
    "text": caption,
    "access_token": TOKEN
}
r = requests.post(f"https://graph.threads.net/v1.0/{user_id}/threads", data=payload)
print(f"Container: {r.text}")
if r.status_code != 200:
    exit()
creation_id = r.json()['id']

# 3. Wait for processing
time.sleep(10)

# 4. Publish
r2 = requests.post(f"https://graph.threads.net/v1.0/{user_id}/threads_publish", data={
    "creation_id": creation_id,
    "access_token": TOKEN
})
print(f"Publish: {r2.text}")

if r2.status_code == 200:
    print("✅ POSTED TO THREADS - FULL AUTOPILOT LIVE")
    Path("POSTED.log").write_text(f"POSTED {time.ctime()} - {image_name}\n{caption}\n")
else:
    print("❌ Publish failed, check image URL is public")
