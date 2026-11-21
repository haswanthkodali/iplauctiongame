import json

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\sold_players_data.json', 'r', encoding='utf-8') as f:
    sold = json.load(f)

results = sold.get('players', {}).get('results', [])
print(f"Total results in sold_players_data.json: {len(results)}")

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

for p in players:
    last_name = p.split()[-1].lower()
    matches = []
    for r in results:
        pl = r.get('player', {})
        full = (pl.get('longName') or pl.get('name') or '').lower()
        if last_name in full:
            matches.append((pl.get('longName') or pl.get('name'), pl.get('image', {}).get('url') or pl.get('imageUrl')))
    if matches:
        print(f"Found for {p}: {matches}")
    else:
        print(f"No match for {p}")
