"""
Directly look up ESPNcricinfo player profile pages for unmatched players.
Uses player slug URLs to find headshot images.
"""
from curl_cffi import requests
import json
import time
import re

CDN_PREFIX = "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320"

# Known player slugs for well-known cricketers
KNOWN_SLUGS = {
    "Glenn Maxwell": "glenn-maxwell-325026",
    "Faf du Plessis": "faf-du-plessis-44828",
    "Adam Zampa": "adam-zampa-690598",
    "Jonny Bairstow": "jonny-bairstow-297433",
    "Moeen Ali": "moeen-ali-8917",
    "Daryl Mitchell": "daryl-mitchell-544936",
    "Alzarri Joseph": "alzarri-joseph-862921",
    "Jake Fraser-McGurk": "jake-fraser-mcgurk-1151287",
    "Gerald Coetzee": "gerald-coetzee-1159858",
    "Spencer Johnson": "spencer-johnson-1127291",
    "Rahmanullah Gurbaz": "rahmanullah-gurbaz-1109875",
    "Fazalhaq Farooqi": "fazalhaq-farooqi-1137231",
    "Maheesh Theekshana": "maheesh-theekshana-1152016",
    "Kyle Mayers": "kyle-mayers-845527",
    "Sikandar Raza": "sikandar-raza-563",
    "Naveen-ul-Haq": "naveen-ul-haq-1138762",
    "Mayank Agarwal": "mayank-agarwal-543488",
    "Vijay Shankar": "vijay-shankar-394926",
    "Wriddhiman Saha": "wriddhiman-saha-279810",
    "Shahrukh Khan": "shahrukh-khan-726195",
    "KS Bharat": "ks-bharat-446748",
    "Krishnappa Gowtham": "krishnappa-gowtham-520488",
    "Sheldon Jackson": "sheldon-jackson-294907",
    "Chetan Sakariya": "chetan-sakariya-1105395",
    "Abhinav Manohar": "abhinav-manohar-1215979",
    "Akash Madhwal": "akash-madhwal-973265",
    "Shai Hope": "shai-hope-671577",
    "Dilshan Madushanka": "dilshan-madushanka-1225523",
    "Vaibhav Suryavanshi": "vaibhav-suryavanshi-1377231",
    "Yash Dhull": "yash-dhull-1267020",
    "Priyam Garg": "priyam-garg-1070186",
    "Suyash Prabhudessai": "suyash-prabhudessai-1131107",
    "Lalit Yadav": "lalit-yadav-949377",
    "Mandeep Singh": "mandeep-singh-516563",
    "Ricky Bhui": "ricky-bhui-972779",
    "Kamlesh Nagarkoti": "kamlesh-nagarkoti-1079608",
    "Kumar Kartikeya": "kumar-kartikeya-1250997",
    "Shams Mulani": "shams-mulani-932571",
    "Tanush Kotian": "tanush-kotian-1070176",
}

resolved = {}
failed = []

for player_name, slug in KNOWN_SLUGS.items():
    url = f"https://www.espncricinfo.com/cricketers/{slug}"
    try:
        r = requests.get(url, impersonate="chrome124", timeout=10)
        if r.status_code == 200:
            # Find __NEXT_DATA__
            match = re.search(r'<script\s+id="__NEXT_DATA__"[^>]*>(.*?)</script>', r.text, re.DOTALL)
            if match:
                data = json.loads(match.group(1))
                # Find imageUrl in the data
                def find_image(obj, depth=0):
                    if depth > 10:
                        return None
                    if isinstance(obj, dict):
                        if obj.get("imageUrl") and "/PICTURES/CMS/" in obj.get("imageUrl", ""):
                            return CDN_PREFIX + obj["imageUrl"]
                        for v in obj.values():
                            if isinstance(v, (dict, list)):
                                result = find_image(v, depth+1)
                                if result:
                                    return result
                    elif isinstance(obj, list):
                        for item in obj:
                            if isinstance(item, (dict, list)):
                                result = find_image(item, depth+1)
                                if result:
                                    return result
                    return None
                
                img = find_image(data)
                if img:
                    resolved[player_name] = img
                    print(f"  OK: {player_name} -> {img[:70]}...")
                else:
                    failed.append(player_name)
                    print(f"  NO IMG: {player_name}")
            else:
                failed.append(player_name)
                print(f"  NO __NEXT_DATA__: {player_name}")
        else:
            failed.append(player_name)
            print(f"  HTTP {r.status_code}: {player_name}")
    except Exception as e:
        failed.append(player_name)
        print(f"  ERROR: {player_name}: {e}")
    
    time.sleep(0.3)

print(f"\nResolved: {len(resolved)}/{len(KNOWN_SLUGS)}")
print(f"Failed: {len(failed)}")
if failed:
    for n in failed:
        print(f"  - {n}")

with open('profile_resolved_images.json', 'w') as f:
    json.dump(resolved, f, indent=2)

print(f"\nSaved to profile_resolved_images.json")
