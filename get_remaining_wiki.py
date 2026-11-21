import urllib.request, urllib.parse, json

remaining = [
    ("Daryl Mitchell", "Daryl_Mitchell_(New_Zealand_cricketer)"),
    ("Daryl Mitchell 2", "Daryl_Mitchell"),
    ("Lance Morris", "Lance_Morris"),
    ("KS Bharat", "Kona_Srikar_Bharat"),
    ("KS Bharat 2", "Srikar_Bharat"),
    ("Rassie van der Dussen", "Rassie_van_der_Dussen"),
    ("Rahmanullah Gurbaz", "Rahmanullah_Gurbaz"),
    ("Maheesh Theekshana", "Maheesh_Theekshana"),
    ("Spencer Johnson", "Spencer_Johnson_(cricketer)"),
    ("Spencer Johnson 2", "Spencer_Johnson"),
    ("Dilshan Madushanka", "Dilshan_Madushanka"),
    ("Krishnappa Gowtham", "Krishnappa_Gowtham"),
    ("Prerak Mankad", "Prerak_Mankad"),
    ("Ricky Bhui", "Ricky_Bhui")
]

headers = {'User-Agent': 'IPLAuctionGameBot/1.0 (haswanthkodali@gmail.com) Python/urllib'}

for label, title in remaining:
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=440"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                thumb = pdata.get('thumbnail', {}).get('source')
                print(f"{label} ({title}) => {thumb}")
    except Exception as e:
        print(f"FAILED {label} => {e}")
