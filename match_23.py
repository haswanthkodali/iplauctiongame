import json, os

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\sold_players_data.json', 'r', encoding='utf-8') as f:
    sold = json.load(f)

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\unsold_players_data.json', 'r', encoding='utf-8') as f:
    unsold = json.load(f)

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\all_candidates.json', 'r', encoding='utf-8') as f:
    candidates = json.load(f)

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
    "Ricky Bhui"
]

all_cricinfo = []
for src in [sold, unsold]:
    if 'players' in src and 'results' in src['players']:
        for item in src['players']['results']:
            p = item.get('player')
            if p:
                all_cricinfo.append(p)

print(f"Total Cricinfo players in auction data: {len(all_cricinfo)}")

# Find for each of the 23 players
found_map = {}
for name in players:
    n_lower = name.lower()
    matches = []
    for p in all_cricinfo:
        p_name = (p.get('name') or '').lower()
        p_long = (p.get('longName') or '').lower()
        p_slug = (p.get('slug') or '').lower().replace('-', ' ')
        if n_lower == p_long or n_lower == p_name or n_lower == p_slug or (len(n_lower) > 5 and n_lower in p_long):
            matches.append(p)
    if not matches:
        # try candidates
        if n_lower in candidates:
            matches.append({'longName': name, 'imageUrl': candidates[n_lower].get('imageUrl') or candidates[n_lower].get('url')})
        else:
            # try partial in candidates
            for ck, cv in candidates.items():
                if n_lower in ck or ck in n_lower:
                    matches.append({'longName': ck, 'imageUrl': cv.get('imageUrl') or cv.get('url')})
    found_map[name] = matches

for name, matches in found_map.items():
    if matches:
        p = matches[0]
        img = p.get('imageUrl') or (p.get('image') or {}).get('url') or p.get('headshotImageUrl')
        print(f"MATCH: {name} -> {p.get('longName') or p.get('name')}: {img}")
    else:
        print(f"MISSING: {name}")
