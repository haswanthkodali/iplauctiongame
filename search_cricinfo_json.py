import json, urllib.request, re

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\sold_players_data.json', 'r', encoding='utf-8') as f:
    sold = json.load(f)

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\unsold_players_data.json', 'r', encoding='utf-8') as f:
    unsold = json.load(f)

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
# look at sold and unsold results
def extract_players(data):
    res = []
    if isinstance(data, dict):
        if 'content' in data and 'players' in data['content']:
            p_obj = data['content']['players']
            if isinstance(p_obj, dict) and 'results' in p_obj:
                res.extend(p_obj['results'])
        for v in data.values():
            if isinstance(v, (dict, list)):
                res.extend(extract_players(v))
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and 'name' in item and ('image' in item or 'headshot' in item or 'imageUrl' in item or 'object' in item):
                res.append(item)
            elif isinstance(item, (dict, list)):
                res.extend(extract_players(item))
    return res

sold_list = extract_players(sold)
unsold_list = extract_players(unsold)
all_results = sold_list + unsold_list
print(f"Total extracted from sold/unsold: {len(all_results)}")

for p in players:
    found = []
    p_lower = p.lower()
    for item in all_results:
        name = item.get('name') or item.get('longName') or item.get('fullName') or ''
        if p_lower in name.lower() or name.lower() in p_lower:
            found.append(item)
    if found:
        print(f"Found for {p}: {len(found)} entries")
        for f in found[:2]:
            print(f"  Name: {f.get('name')}, img: {f.get('image') or f.get('imageUrl') or f.get('headshot') or f.get('photo')}")
    else:
        print(f"NOT found for {p}")
