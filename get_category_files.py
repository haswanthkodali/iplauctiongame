import urllib.request, urllib.parse, json

cats = [
    ("Daryl Mitchell", "Category:Daryl Mitchell (cricketer)"),
    ("Rassie van der Dussen", "Category:Rassie van der Dussen"),
    ("Rahmanullah Gurbaz", "Category:Rahmanullah Gurbaz"),
    ("Maheesh Theekshana", "Category:Maheesh Theekshana"),
    ("Lance Morris", "Category:Lance Morris (cricketer)"),
    ("Spencer Johnson", "Category:Spencer Johnson (cricketer)"),
    ("Dilshan Madushanka", "Category:Dilshan Madushanka"),
    ("Krishnappa Gowtham", "Category:Krishnappa Gowtham"),
    ("KS Bharat", "Category:K. S. Bharat"),
    ("Prerak Mankad", "Category:Prerak Mankad"),
    ("Ricky Bhui", "Category:Ricky Bhui")
]

headers = {'User-Agent': 'IPLAuctionGameBot/1.0 (haswanthkodali@gmail.com)'}

for name, cat in cats:
    q = urllib.parse.quote(cat)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle={q}&cmtype=file&cmlimit=10&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            mems = data.get('query', {}).get('categorymembers', [])
            print(f"\n{name} ({cat}) => {len(mems)} files")
            for m in mems:
                print(f"  {m.get('title')}")
    except Exception as e:
        print(f"Error {name}: {e}")
