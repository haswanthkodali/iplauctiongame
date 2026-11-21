import urllib.request
import json
import urllib.parse

def debug_player(name):
    url = f"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={urllib.parse.quote(name)}&language=en&type=item&format=json&limit=5"
    req = urllib.request.Request(url, headers={'User-Agent': 'IPLAuction/2.0'})
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
        for res in data.get('search', []):
            print(f"  ID: {res['id']}, label: {res['label']}, desc: {res.get('description')}")
            # check P18
            claims_url = f"https://www.wikidata.org/w/api.php?action=wbgetclaims&entity={res['id']}&property=P18&format=json"
            req2 = urllib.request.Request(claims_url, headers={'User-Agent': 'IPLAuction/2.0'})
            with urllib.request.urlopen(req2) as r2:
                cdata = json.loads(r2.read())
                claims = cdata.get('claims', {}).get('P18', [])
                if claims:
                    print(f"    HAS P18 IMAGE: {claims[0]['mainsnak']['datavalue']['value']}")
                else:
                    print("    No P18 image")

for p in ["Heinrich Klaasen", "Nicholas Pooran", "David Miller", "Ravi Bishnoi"]:
    print(f"=== {p} ===")
    debug_player(p)
