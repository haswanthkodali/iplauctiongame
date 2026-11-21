import urllib.request, urllib.parse, json

players = [
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

headers = {'User-Agent': 'IPLAuctionGameBot/1.0 (haswanthkodali@gmail.com) Python/urllib'}

results = {}
for p in players:
    # 1. Search Wikidata
    search_q = f"{p} cricketer"
    url = f"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={urllib.parse.quote(search_q)}&language=en&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            hits = data.get('search', [])
            if not hits:
                # search without 'cricketer'
                url2 = f"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={urllib.parse.quote(p)}&language=en&format=json"
                req2 = urllib.request.Request(url2, headers=headers)
                with urllib.request.urlopen(req2, timeout=10) as resp2:
                    hits = json.loads(resp2.read().decode('utf-8')).get('search', [])
            
            p18_img = None
            for hit in hits:
                desc = hit.get('description', '').lower()
                qid = hit.get('id')
                if 'cricket' in desc or len(hits) == 1:
                    # fetch P18 claims
                    claim_url = f"https://www.wikidata.org/w/api.php?action=wbgetclaims&entity={qid}&property=P18&format=json"
                    req_c = urllib.request.Request(claim_url, headers=headers)
                    with urllib.request.urlopen(req_c, timeout=10) as resp_c:
                        c_data = json.loads(resp_c.read().decode('utf-8'))
                        claims = c_data.get('claims', {}).get('P18', [])
                        if claims:
                            filename = claims[0].get('mainsnak', {}).get('datavalue', {}).get('value')
                            if filename:
                                clean_fn = urllib.parse.quote(filename.replace(' ', '_'))
                                p18_img = f"https://commons.wikimedia.org/wiki/Special:FilePath/{clean_fn}?width=440"
                                print(f"WIKIDATA P18 MATCH: {p} ({qid}) -> {filename} => {p18_img}")
                                break
            results[p] = p18_img
            if not p18_img:
                print(f"NO P18 for {p}")
    except Exception as e:
        print(f"FAILED {p} => {e}")

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\wikidata_11_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
