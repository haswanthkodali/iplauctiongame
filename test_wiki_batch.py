import urllib.request
import json
import urllib.parse

players = [
    "Rishabh Pant", "Suryakumar Yadav", "Shubman Gill", "KL Rahul", 
    "Shreyas Iyer", "Sanju Samson", "Ruturaj Gaikwad", "Axar Patel", 
    "Kuldeep Yadav", "Yuzvendra Chahal", "Mohammed Shami", "Mohammed Siraj",
    "Arshdeep Singh", "Shivam Dube", "Tilak Varma", "Rajat Patidar",
    "Abhishek Sharma", "Nitish Kumar Reddy", "Sai Sudharsan", "Washington Sundar",
    "Shardul Thakur", "Ravi Bishnoi", "Prasidh Krishna", "Avesh Khan",
    "Mayank Yadav", "Harshit Rana", "Varun Chakravarthy", "T Natarajan",
    "Pat Cummins", "Mitchell Starc", "Travis Head", "Heinrich Klaasen",
    "Cameron Green", "Glenn Maxwell", "Nicholas Pooran", "Trent Boult",
    "Faf du Plessis", "David Warner", "David Miller", "Quinton de Kock"
]

results = {}

for name in players:
    url_name = urllib.parse.quote(name.replace(" ", "_"))
    wiki_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={url_name}&prop=pageimages&format=json&pithumbsize=320"
    req = urllib.request.Request(wiki_url, headers={'User-Agent': 'IPLAuctionGame/2.0 (contact: test@example.com)'})
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            data = json.loads(r.read())
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                if 'thumbnail' in pdata:
                    thumb = pdata['thumbnail']['source']
                    results[name] = thumb
                    print(f"✅ {name}: {thumb[:80]}...")
                else:
                    print(f"⚠️ {name}: No thumbnail found on Wikipedia")
    except Exception as e:
        print(f"❌ {name}: {e}")

print(f"\nTotal resolved from Wikipedia: {len(results)} / {len(players)}")
