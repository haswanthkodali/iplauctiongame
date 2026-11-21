import urllib.request
import json
import urllib.parse

def get_player_wiki_image(player_name):
    query = f"{player_name} cricketer"
    url = f"https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit=1&prop=pageimages&pithumbsize=320&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'IPLAuctionGameBot/2.0'})
    try:
        with urllib.request.urlopen(req, timeout=4) as r:
            data = json.loads(r.read())
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                if 'thumbnail' in pdata:
                    return pdata['thumbnail']['source']
    except Exception as e:
        pass
    return None

test_names = ["Shreyas Iyer", "David Warner", "Heinrich Klaasen", "David Miller", "Nicholas Pooran", "Ravi Bishnoi", "Prasidh Krishna", "Shardul Thakur", "Mayank Yadav", "Harshit Rana", "Abhishek Sharma", "Varun Chakravarthy"]
for name in test_names:
    img = get_player_wiki_image(name)
    print(f"{name}: {img}")
