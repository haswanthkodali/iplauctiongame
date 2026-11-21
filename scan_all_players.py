import json

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\all_players_raw.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

players = [
    "Faf du Plessis",
    "Jake Fraser-McGurk",
    "David Warner",
    "Daryl Mitchell",
    "Jason Roy",
    "Rassie van der Dussen",
    "Rahmanullah Gurbaz",
    "Wriddhiman Saha",
    "Kyle Mayers",
    "Daniel Sams",
    "Maheesh Theekshana",
    "Lance Morris",
    "Gerald Coetzee",
    "Spencer Johnson",
    "Richard Gleeson",
    "Dilshan Madushanka",
    "Mandeep Singh",
    "Vijay Shankar",
    "Krishnappa Gowtham",
    "KS Bharat",
    "Prerak Mankad",
    "Anmolpreet Singh",
    "Ricky Bhui",
    "Bhuvneshwar Kumar"
]

all_found = {}

def scan(obj):
    if isinstance(obj, dict):
        # check if it represents a player
        name = obj.get('name') or obj.get('longName') or ''
        img = obj.get('imageUrl') or (obj.get('image') or {}).get('url') or obj.get('headshotImageUrl')
        if name and img:
            name_lower = name.lower()
            for p in players:
                if p.lower() in name_lower or name_lower in p.lower():
                    if not img.startswith('http'):
                        img_full = 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320' + img
                    else:
                        img_full = img
                    all_found[p] = (name, img_full)
        for v in obj.values():
            scan(v)
    elif isinstance(obj, list):
        for item in obj:
            scan(item)

scan(raw)
print(f"Total matching players found in all_players_raw.json: {len(all_found)}")
for p, (n, img) in all_found.items():
    print(f"MATCH: {p} => {n} ({img})")

missing = [p for p in players if p not in all_found]
print(f"Missing from raw: {missing}")
