import json

for fname in ['cricinfo_direct_working.json', 'final_master_player_images.json', 'final_verified_working_images.json', 'resolved_images.json']:
    try:
        with open(rf'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\{fname}', 'r', encoding='utf-8') as f:
            d = json.load(f)
        print(f"\n=== {fname} ({len(d)} items) ===")
        for p in [
            "Daryl Mitchell", "Rassie van der Dussen", "Rahmanullah Gurbaz",
            "Maheesh Theekshana", "Lance Morris", "Spencer Johnson",
            "Dilshan Madushanka", "Krishnappa Gowtham", "KS Bharat",
            "Prerak Mankad", "Ricky Bhui"
        ]:
            if p in d:
                print(f"  {p} => {d[p]}")
    except Exception as e:
        print(f"Could not load {fname}: {e}")
