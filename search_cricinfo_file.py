import json

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\cricinfo_all_player_images.json', 'r', encoding='utf-8') as f:
    ci = json.load(f)

print(f"Total entries in cricinfo_all_player_images.json: {len(ci)}")

players = [
    "Faf du Plessis",
    "Jake Fraser-McGurk",
    "David Warner",
    "Daryl Mitchell",
    "Jason Roy",
    "Rassie van der Dussen",
    "Rahmanullah Gurbaz",
    "Wriddhiman Saha",
    "Kyle Mayers",
    "Daniel Sams",
    "Maheesh Theekshana",
    "Lance Morris",
    "Gerald Coetzee",
    "Spencer Johnson",
    "Richard Gleeson",
    "Dilshan Madushanka",
    "Mandeep Singh",
    "Vijay Shankar",
    "Krishnappa Gowtham",
    "KS Bharat",
    "Prerak Mankad",
    "Anmolpreet Singh",
    "Ricky Bhui"
]

for p in players:
    matches = []
    p_lower = p.lower()
    last = p_lower.split()[-1]
    for k, v in ci.items():
        k_lower = k.lower()
        if p_lower == k_lower or p_lower in k_lower or k_lower in p_lower:
            matches.append((k, v))
        elif last in k_lower and len(last) > 3:
            # check first name or initials
            first = p_lower.split()[0]
            if first in k_lower or first[0] == k_lower[0]:
                matches.append((k, v))
    if matches:
        print(f"Found for {p}: {len(matches)} matches")
        for k, v in matches[:3]:
            print(f"  {k} => {v}")
    else:
        print(f"NO match for {p}")
