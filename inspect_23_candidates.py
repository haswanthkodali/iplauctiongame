import urllib.request, json

players = [
    ("Faf du Plessis", "faf du plessis"),
    ("Jake Fraser-McGurk", "jake fraser-mcgurk"),
    ("David Warner", "david warner"),
    ("Daryl Mitchell", "daryl mitchell"),
    ("Jason Roy", "jason roy"),
    ("Rassie van der Dussen", "rassie van der dussen"),
    ("Rahmanullah Gurbaz", "rahmanullah gurbaz"),
    ("Wriddhiman Saha", "wriddhiman saha"),
    ("Kyle Mayers", "kyle mayers"),
    ("Daniel Sams", "daniel sams"),
    ("Maheesh Theekshana", "maheesh theekshana"),
    ("Lance Morris", "lance morris"),
    ("Gerald Coetzee", "gerald coetzee"),
    ("Spencer Johnson", "spencer johnson"),
    ("Richard Gleeson", "richard gleeson"),
    ("Dilshan Madushanka", "dilshan madushanka"),
    ("Mandeep Singh", "mandeep singh"),
    ("Vijay Shankar", "vijay shankar"),
    ("Krishnappa Gowtham", "krishnappa gowtham"),
    ("KS Bharat", "ks bharat"),
    ("Prerak Mankad", "prerak mankad"),
    ("Anmolpreet Singh", "anmolpreet singh"),
    ("Ricky Bhui", "ricky bhui")
]

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\all_candidates.json', 'r', encoding='utf-8') as f:
    candidates = json.load(f)

for disp_name, key in players:
    print(f"\n=== {disp_name} ===")
    c_list = candidates.get(key, [])
    if not c_list:
        for k, v in candidates.items():
            if key in k or k in key:
                c_list = v
                print(f"  found under '{k}'")
                break
    for url, src in c_list:
        print(f"  [{src}]: {url}")
