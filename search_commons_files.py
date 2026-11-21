import urllib.request, urllib.parse, json

missing = [
    "Daryl Mitchell",
    "Rassie van der Dussen",
    "Rahmanullah Gurbaz",
    "Maheesh Theekshana",
    "Lance Morris",
    "Spencer Johnson",
    "Dilshan Madushanka",
    "Krishnappa Gowtham",
    "KS Bharat",
    "Prerak Mankad",
    "Ricky Bhui"
]

headers = {'User-Agent': 'IPLAuctionGameBot/1.0 (haswanthkodali@gmail.com)'}

for p in missing:
    # search commons without quotes or with variations
    q = urllib.parse.quote(p)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={q}&srnamespace=6&srlimit=5&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            hits = data.get('query', {}).get('search', [])
            print(f"\nSearch for '{p}': {len(hits)} results")
            for h in hits:
                title = h.get('title')
                print(f"  {title}")
    except Exception as e:
        print(f"Error for {p}: {e}")
