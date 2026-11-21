import json

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\sold_players_data.json', 'r', encoding='utf-8') as f:
    sold = json.load(f)

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\unsold_players_data.json', 'r', encoding='utf-8') as f:
    unsold = json.load(f)

img_ids = {
    "322371": "Daryl Mitchell",
    "319839": "Rassie van der Dussen",
    "340344": "Rahmanullah Gurbaz",
    "340325": "Maheesh Theekshana",
    "364145": "Lance Morris",
    "380678": "Spencer Johnson",
    "340049": "Dilshan Madushanka",
    "322627": "Krishnappa Gowtham",
    "322605": "KS Bharat",
    "341034": "Prerak Mankad",
    "358042": "Ricky Bhui"
}

all_results = sold.get('players', {}).get('results', []) + unsold.get('players', {}).get('results', [])

for r in all_results:
    pl = r.get('player', {})
    img_obj = pl.get('image') or {}
    img_url = (img_obj.get('url') if isinstance(img_obj, dict) else None) or pl.get('imageUrl') or ''
    for i_id, p_name in img_ids.items():
        if i_id in img_url:
            print(f"Image {i_id} (used for {p_name}) ACTUALLY BELONGS TO: {pl.get('longName')} / {pl.get('name')}")
