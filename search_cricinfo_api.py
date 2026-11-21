import json, re, urllib.request, urllib.parse

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

# Let's inspect Cricinfo search
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

def find_cricinfo_player(name):
    # Try searching ESPNcricinfo consumer API
    query = urllib.parse.quote(name)
    url = f"https://hs-consumer-api.espncricinfo.com/v1/pages/search?q={query}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = data.get('results', [])
            for r in results:
                if r.get('type') == 'PLAYER':
                    p = r.get('player', {})
                    img = p.get('image', {})
                    img_url = img.get('url') if isinstance(img, dict) else None
                    if not img_url:
                        img_url = p.get('imageUrl') or p.get('headshotImageUrl')
                    if img_url:
                        if not img_url.startswith('http'):
                            img_url = "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320" + img_url
                        return {
                            'name': p.get('name') or p.get('longName'),
                            'id': p.get('id'),
                            'objectId': p.get('objectId'),
                            'url': img_url
                        }
    except Exception as e:
        pass
    return None

results = {}
for p in players:
    res = find_cricinfo_player(p)
    if res:
        print(f"Cricinfo API MATCH: {p} => {res['name']} ({res['url']})")
        results[p] = res
    else:
        print(f"Cricinfo API NO MATCH: {p}")

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\cricinfo_api_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
