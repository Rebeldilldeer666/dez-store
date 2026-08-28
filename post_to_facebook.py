import os
import requests
from datetime import datetime

PAGE_ID = "103638205931888"
PAGE_ACCESS_TOKEN = os.getenv("FB_PAGE_TOKEN")
SITE_URL = "https://dez-store.vercel.app"
VAULT_DIR = "./public"

def post_to_facebook(image_path, caption):
    url = f"https://graph.facebook.com/{PAGE_ID}/photos"
    data = {
        "message": caption + f"\n\nShop: {SITE_URL}",
        "access_token": PAGE_ACCESS_TOKEN
    }
    files = {"source": open(image_path, "rb")}
    r = requests.post(url, data=data, files=files)
    print(f"FB Post: {r.status_code} - {r.text}")
    return r.json()

def get_next_drop():
    images = [f for f in os.listdir(VAULT_DIR) if f.endswith('.png')]
    images.sort()
    return os.path.join(VAULT_DIR, images[-1]) if images else None

if __name__ == "__main__":
    img = get_next_drop()
    caption = f"NEW DROP: Rebel Gremlin {datetime.now().strftime('%m/%d')} 🔥 #DEZSTORE"
    if img and PAGE_ACCESS_TOKEN:
        post_to_facebook(img, caption)
    else:
        print(f"Ready: {img}")
