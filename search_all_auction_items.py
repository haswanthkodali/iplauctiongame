import json

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\sold_players_data.json', 'r', encoding='utf-8') as f:
    sold = json.load(f)

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\unsold_players_data.json', 'r', encoding='utf-8') as f:
    unsold = json.load(f)

all_items = sold['players']['results'] + unsold['players']['results']

keywords = {
    "Daryl Mitchell": ["daryl", "mitchell"],
    "Rassie van der Dussen": ["rassie", "dussen"],
    "Rahmanullah Gurbaz": ["gurbaz", "rahmanullah"],
    "Maheesh Theekshana": ["theekshana", "maheesh"],
    "Lance Morris": ["lance", "morris"],
    "Spencer Johnson": ["spencer", "johnson"],
    "Dilshan Madushanka": ["madushanka", "dilshan"],
    "Krishnappa Gowtham": ["gowtham", "krishnappa"],
    "KS Bharat": ["bharat", "srikar", "kona"],
    "Prerak Mankad": ["mankad", "prerak"],
    "Ricky Bhui": ["bhui", "ricky"]
}

for label, kw_list in keywords.items():
    print(f"\nSearching for {label}:")
    matches = []
    for item in all_items:
        p = item.get('player', {})
        full = f"{p.get('name')} {p.get('longName')} {p.get('slug')}".lower()
        for kw in kw_list:
            if kw in full:
                img = (p.get('image') or {}).get('url') or p.get('imageUrl')
                matches.append((p.get('longName') or p.get('name'), p.get('slug'), img))
                break
    if matches:
        for m in matches:
            print(f"  Match: {m[0]} (slug: {m[1]}) => {m[2]}")
    else:
        print("  NONE")
