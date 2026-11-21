import urllib.request
import json
import urllib.parse

test_players = [
    "Shreyas Iyer", "Rajat Patidar", "Abhishek Sharma", "Sai Sudharsan",
    "Shardul Thakur", "Ravi Bishnoi", "Prasidh Krishna", "Avesh Khan",
    "Mayank Yadav", "Harshit Rana", "Varun Chakravarthy", "T Natarajan",
    "Heinrich Klaasen", "Nicholas Pooran", "David Warner", "David Miller"
]

for name in test_players:
    for suffix in ["", "_(cricketer)", "_(cricketer,_born_2000)", "_(cricketer,_born_1991)"]:
        title = name.replace(" ", "_") + suffix
        wiki_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=320"
        req = urllib.request.Request(wiki_url, headers={'User-Agent': 'IPLAuctionGame/2.0'})
        try:
            with urllib.request.urlopen(req, timeout=3) as r:
                data = json.loads(r.read())
                pages = data.get('query', {}).get('pages', {})
                for pid, pdata in pages.items():
                    if pid != '-1' and 'thumbnail' in pdata:
                        print(f"✅ {name} ({title}): {pdata['thumbnail']['source'][:80]}")
                        break
                else:
                    continue
                break
        except Exception:
            pass
