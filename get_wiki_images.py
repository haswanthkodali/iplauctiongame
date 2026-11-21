import urllib.request, urllib.parse, json, time

players = [
    ("Faf du Plessis", "Faf_du_Plessis"),
    ("Jake Fraser-McGurk", "Jake_Fraser-McGurk"),
    ("David Warner", "David_Warner_(cricketer)"),
    ("Daryl Mitchell", "Daryl_Mitchell_(cricketer)"),
    ("Jason Roy", "Jason_Roy"),
    ("Rassie van der Dussen", "Rassie_van_der_Dussen"),
    ("Rahmanullah Gurbaz", "Rahmanullah_Gurbaz"),
    ("Wriddhiman Saha", "Wriddhiman_Saha"),
    ("Kyle Mayers", "Kyle_Mayers"),
    ("Daniel Sams", "Daniel_Sams_(cricketer)"),
    ("Maheesh Theekshana", "Maheesh_Theekshana"),
    ("Lance Morris", "Lance_Morris_(cricketer)"),
    ("Gerald Coetzee", "Gerald_Coetzee"),
    ("Spencer Johnson", "Spencer_Johnson_(cricketer)"),
    ("Richard Gleeson", "Richard_Gleeson"),
    ("Dilshan Madushanka", "Dilshan_Madushanka"),
    ("Mandeep Singh", "Mandeep_Singh"),
    ("Vijay Shankar", "Vijay_Shankar_(cricketer)"),
    ("Krishnappa Gowtham", "Krishnappa_Gowtham"),
    ("KS Bharat", "K._S._Bharat"),
    ("Prerak Mankad", "Prerak_Mankad"),
    ("Anmolpreet Singh", "Anmolpreet_Singh"),
    ("Ricky Bhui", "Ricky_Bhui")
]

headers = {'User-Agent': 'IPLAuctionGameBot/1.0 (haswanthkodali@gmail.com) Python/urllib'}

results = {}
for name, title in players:
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(title)}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            thumb = data.get('thumbnail', {}).get('source')
            orig = data.get('originalimage', {}).get('source')
            desc = data.get('description', '')
            results[name] = {
                'title': data.get('title'),
                'description': desc,
                'thumbnail': thumb,
                'original': orig
            }
            print(f"OK: {name} => {desc} | {thumb}")
    except Exception as e:
        print(f"FAILED: {name} ({title}) => {e}")
    time.sleep(0.5)

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\wiki_23_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
