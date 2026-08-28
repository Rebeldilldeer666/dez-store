import random, datetime
from pathlib import Path
CAPTIONS = [
 "REBEL GREMLIN EMPIRE. 415 TOOLS ONE VAULT. dez-store.vercel.app - $497.50 🔥",
 "Built on Termux 5G. No laptop. Just execution. dez-store.vercel.app",
 "LIMITED DROP 001 - EST. 415. Grab vault before $997. dez-store.vercel.app"
]
public = Path("public")
assets = list(public.glob("*.jpg")) + list(public.glob("*.webp")) + list(public.glob("*.png"))
assets = [a for a in assets if a.stat().st_size > 20000]
choice = random.choice(assets) if assets else None
if not choice:
 print("NO IMAGES >20KB in public/")
 exit()
caption = random.choice(CAPTIONS)
post = f"REBEL DROP - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}\nImage: {choice.name}\nCaption: {caption}\nSTORE: https://dez-store.vercel.app\nGUMROAD: https://rebeldilldeer666.gumroad.com/l/dez-415-vault-all-access"
Path("NEXT_POST.txt").write_text(post)
print(post)
print(f"--- {len(assets)} assets found")
