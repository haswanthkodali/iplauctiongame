import urllib.request
import json
import urllib.parse

def get_wikidata_image(player_name):
    try:
        # 1. Search entity on Wikidata
        search_url = f"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={urllib.parse.quote(player_name)}&language=en&type=item&format=json&limit=5"
        req = urllib.request.Request(search_url, headers={'User-Agent': 'IPLAuctionGame/2.0'})
        with urllib.request.urlopen(req, timeout=5) as r:
            data = json.loads(r.read())
            results = data.get('search', [])
            
        entity_id = None
        for res in results:
            desc = res.get('description', '').lower()
            if 'cricket' in desc or 'indian' in desc or 'player' in desc or 'athlete' in desc:
                entity_id = res['id']
                break
        if not entity_id and results:
            entity_id = results[0]['id']
            
        if not entity_id:
            return None
            
        # 2. Get P18 (image) claim
        claims_url = f"https://www.wikidata.org/w/api.php?action=wbgetclaims&entity={entity_id}&property=P18&format=json"
        req = urllib.request.Request(claims_url, headers={'User-Agent': 'IPLAuctionGame/2.0'})
        with urllib.request.urlopen(req, timeout=5) as r:
            cdata = json.loads(r.read())
            claims = cdata.get('claims', {}).get('P18', [])
            if claims:
                filename = claims[0]['mainsnak']['datavalue']['value']
                # Convert filename to direct commons thumb URL
                encoded_file = urllib.parse.quote(filename.replace(" ", "_"))
                image_url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{encoded_file}?width=320"
                return image_url
    except Exception as e:
        return None
    return None

test_players = [
    "Shreyas Iyer", "Heinrich Klaasen", "Nicholas Pooran", "David Warner", 
    "David Miller", "Ravi Bishnoi", "Prasidh Krishna", "Shardul Thakur", 
    "Mayank Yadav", "Harshit Rana", "Abhishek Sharma", "Varun Chakravarthy",
    "Sai Sudharsan", "Nitish Rana", "Devdutt Padikkal", "Rahul Tripathi",
    "Rahul Tewatia", "Shahbaz Ahmed", "Vijay Shankar", "Sam Curran"
]

for p in test_players:
    img = get_wikidata_image(p)
    print(f"{p}: {img}")
