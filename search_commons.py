import urllib.request, urllib.parse, json

missing_players = [
    "Daryl Mitchell",
    "Lance Morris",
    "KS Bharat",
    "Rassie van der Dussen",
    "Rahmanullah Gurbaz",
    "Maheesh Theekshana",
    "Spencer Johnson",
    "Dilshan Madushanka",
    "Krishnappa Gowtham",
    "Prerak Mankad",
    "Ricky Bhui"
]

headers = {'User-Agent': 'IPLAuctionGameBot/1.0 (haswanthkodali@gmail.com) Python/urllib'}

results = {}
for p in missing_players:
    q = urllib.parse.quote(f'"{p}" cricket')
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={q}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|thumburl|mime&pithumbsize=440&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            hits = []
            for pid, pdata in pages.items():
                title = pdata.get('title')
                info = pdata.get('imageinfo', [{}])[0]
                hits.append((title, info.get('thumburl') or info.get('url')))
            results[p] = hits
            print(f"{p} => {hits}")
    except Exception as e:
        print(f"FAILED {p} => {e}")

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\commons_hits.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
