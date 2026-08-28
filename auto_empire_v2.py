import random, datetime
from pathlib import Path

SCIENCE_DROPS = [
    {"topic": "Wool to Bone", "hook": "Sheep wool = new bones?!", "fact": "Scientists turn wool keratin into a scaffold. Your body grows bone over it, then it dissolves. No metal plates.", "tag": "BIOFAB"},
    {"topic": "Mushroom Computers", "hook": "Mushrooms are making computers?!", "fact": "Mycelium chips run on 1000x less power. They grow, not built. Nature is the processor.", "tag": "BIOTECH"},
    {"topic": "Light as Solid", "hook": "Light just became SOLID?!", "fact": "Physicists froze light into a super-solid. Light you can hold. Universe code broken.", "tag": "QUANTUM"},
    {"topic": "Blood to Plastic", "hook": "Your blood can become PLASTIC?!", "fact": "Human blood proteins spun into biodegradable plastic. Stronger than regular, dissolves in ocean.", "tag": "BIOMATERIAL"},
    {"topic": "Spider Silk Heart", "hook": "Spider silk = beating heart?!", "fact": "Spider silk scaffold grows human heart tissue. Your heart can rebuild on spider webs.", "tag": "MEDTECH"},
    {"topic": "Sand Battery", "hook": "Sand holds electricity for MONTHS?!", "fact": "Finland heats sand to 500C with solar, stores energy all winter. Dirt = battery.", "tag": "ENERGY"},
    {"topic": "DNA Hard Drive", "hook": "All of Netflix fits in a drop of DNA?!", "fact": "1 gram of DNA stores 215 petabytes. Your body is the ultimate hard drive.", "tag": "STORAGE"},
    {"topic": "Algae Brick", "hook": "Bricks that BREATHE?!", "fact": "Living algae bricks pull CO2 from air and grow stronger. Buildings that clean the sky.", "tag": "FUTURE"},
    {"topic": "Brain in Dish Learns Pong", "hook": "Brain cells learned PONG in 5 minutes?!", "fact": "80k neurons in a dish taught themselves to play. No code. Just electricity and will.", "tag": "NEURO"},
    {"topic": "Sound Levitation", "hook": "Sound can LIFT objects?!", "fact": "Acoustic levitation freezes objects mid-air with sound waves. No magnets. Just frequency.", "tag": "PHYSICS"},
    {"topic": "Sea Urchin Teeth Armor", "hook": "Sea urchin teeth = unbreakable armor?!", "fact": "Teeth self-sharpen forever. Copied for spacecraft armor that never dulls.", "tag": "BIOMIMICRY"},
    {"topic": "Trees Talking Internet", "hook": "Trees have their own INTERNET?!", "fact": "Wood Wide Web: trees send nutrients and warnings via fungus. Forest = social network.", "tag": "NATURE"},
    {"topic": "Water From Air", "hook": "Making water from THIN AIR?!", "fact": "New hydrogel pulls 6 liters a day from desert air. No power needed.", "tag": "SURVIVAL"},
    {"topic": "Liquid Metal Muscle", "hook": "Metal that flexes like MUSCLE?!", "fact": "Gallium liquid metal artificial muscles lift 1000x their weight. Terminator tech is here.", "tag": "ROBOTICS"},
]

VAULT_CAPTIONS = [
    "REBEL GREMLIN EMPIRE. 415 TOOLS. ONE VAULT. dez-store.vercel.app - $497.50 instant delivery 🔥",
    "Built on Termux 5G. No laptop. Just execution. dez-store.vercel.app",
    "From blank screen to $497 store on a phone. This is REBEL EMPIRE. dez-store.vercel.app",
]

public = Path("public")
assets = list(public.glob("*.jpg")) + list(public.glob("*.webp")) + list(public.glob("*.png"))
assets = [a for a in assets if a.stat().st_size > 20000]
choice = random.choice(assets) if assets else Path("dez-gumroad-cover-1280x720.jpg")
is_science = random.choice([True, True, False])

if is_science:
    drop = random.choice(SCIENCE_DROPS)
    post = f"""DEZ UNIVERSAL BREAKDOWN: {drop['topic'].upper()} 🧬💀

{drop['hook']}

{drop['fact']}

Nature is the original tech. I'm just decoding it.

Follow for daily universal knowledge. Vault: dez-store.vercel.app

#{drop['tag']} #science #dezknows
Image: {choice.name}
"""
else:
    caption = random.choice(VAULT_CAPTIONS)
    post = f"""REBEL DROP - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}

{caption}

GUMROAD: https://rebeldilldeer666.gumroad.com/l/dez-415-vault-all-access
Image: {choice.name}
"""

Path("NEXT_POST.txt").write_text(post)
Path("LAST_IMAGE.txt").write_text(str(choice))
print(post)
print(f"--- {len(assets)} assets | {len(SCIENCE_DROPS)} science drops | Mode: {'SCIENCE' if is_science else 'VAULT'}")
