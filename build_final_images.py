"""
Final comprehensive player image resolver.
Uses multiple matching strategies including partial name matching,
removing initials, and checking for alternate spellings.
"""
import json
import re

# Load all data
with open('cricinfo_all_player_images.json', 'r') as f:
    cricinfo = json.load(f)

with open('data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()

try:
    with open('valid_images.json', 'r') as f:
        valid_existing = json.load(f)
except:
    valid_existing = {}

# Extract player names from data.js
player_names = []
for m in re.finditer(r'name:\s*"([^"]+)"', data_js):
    name = m.group(1)
    if any(kw in name for kw in ['Super Kings', 'Indians', 'Challengers', 'Capitals',
                                   'Titans', 'Knight Riders', 'Super Giants', 'Royals',
                                   'Kings', 'Sunrisers']):
        continue
    player_names.append(name)

print(f"Players in data.js: {len(player_names)}")
print(f"Cricinfo entries: {len(cricinfo)}")

# Build comprehensive lookup
def norm(n):
    return n.lower().strip().replace('.','').replace("'","").replace('-',' ')

# Index cricinfo by multiple keys
ci_exact = {}  # normalized full name
ci_last_first = {}  # (last_name, first_initial)
ci_contains = {}  # last name -> list of (name, url)

for cname, curl in cricinfo.items():
    cn = norm(cname)
    ci_exact[cn] = (cname, curl)
    
    parts = cn.split()
    if len(parts) >= 2:
        last = parts[-1]
        first_initial = parts[0][0]
        key = (last, first_initial)
        if key not in ci_last_first:
            ci_last_first[key] = []
        ci_last_first[key].append((cname, curl, cn))
        
        if last not in ci_contains:
            ci_contains[last] = []
        ci_contains[last].append((cname, curl, cn))

# Manual mappings for known mismatches
MANUAL_MAP = {
    "M Shahrukh Khan": "Shahrukh Khan",
    "GJ Maxwell": "Glenn Maxwell",
    "F du Plessis": "Faf du Plessis",
    "A Zampa": "Adam Zampa",
    "JM Bairstow": "Jonny Bairstow",
    "MM Ali": "Moeen Ali",
    "DJ Mitchell": "Daryl Mitchell",
    "AS Joseph": "Alzarri Joseph",
    "J Fraser-McGurk": "Jake Fraser-McGurk",
    "G Coetzee": "Gerald Coetzee",
    "SA Johnson": "Spencer Johnson",
    "Gurbaz": "Rahmanullah Gurbaz",
    "Farooqi": "Fazalhaq Farooqi",
    "M Theekshana": "Maheesh Theekshana",
    "KR Mayers": "Kyle Mayers",
    "Sikandar Raza Butt": "Sikandar Raza",
    "Naveen ul Haq": "Naveen-ul-Haq",
    "MA Agarwal": "Mayank Agarwal",
    "V Shankar": "Vijay Shankar",
    "WP Saha": "Wriddhiman Saha",
    "KS Bharat": "KS Bharat",
    "K Gowtham": "Krishnappa Gowtham",
    "SS Jackson": "Sheldon Jackson",
    "C Sakariya": "Chetan Sakariya",
    "A Manohar": "Abhinav Manohar",
    "A Madhwal": "Akash Madhwal",
    "SD Hope": "Shai Hope",
    "PBB Rajapaksa": "Bhanuka Rajapaksa",
    "D Madushanka": "Dilshan Madushanka",
    "V Suryavanshi": "Vaibhav Suryavanshi",
    "Y Dhull": "Yash Dhull",
    "P Garg": "Priyam Garg",
    "S Prabhudessai": "Suyash Prabhudessai",
    "L Yadav": "Lalit Yadav",
    "M Singh": "Mandeep Singh",
    "R Bhui": "Ricky Bhui",
    "K Nagarkoti": "Kamlesh Nagarkoti",
    "K Kartikeya": "Kumar Kartikeya",
    "S Mulani": "Shams Mulani",
    "T Kotian": "Tanush Kotian",
    "R Minz": "Robin Minz",
    "S Raza": "Sikandar Raza",
}

# Build reverse manual map: data.js name -> cricinfo name variations to search
REVERSE_MANUAL = {}
for ci_short, dj_name in MANUAL_MAP.items():
    if dj_name not in REVERSE_MANUAL:
        REVERSE_MANUAL[dj_name] = []
    REVERSE_MANUAL[dj_name].append(ci_short)

final_images = {}
unmatched = []

for player_name in player_names:
    pn = norm(player_name)
    
    # Strategy 1: Direct exact match
    if pn in ci_exact:
        final_images[player_name] = ci_exact[pn][1]
        continue
    
    # Strategy 2: Check manual mapping variants
    found = False
    if player_name in REVERSE_MANUAL:
        for variant in REVERSE_MANUAL[player_name]:
            vn = norm(variant)
            if vn in ci_exact:
                final_images[player_name] = ci_exact[vn][1]
                found = True
                print(f"  Manual: '{player_name}' via '{variant}' -> '{ci_exact[vn][0]}'")
                break
    if found:
        continue
    
    # Strategy 3: Search cricinfo for entries containing the player's last name
    parts = pn.split()
    if len(parts) >= 2:
        last = parts[-1]
        first = parts[0]
        
        # Check (last, first_initial) index
        key = (last, first[0])
        candidates = ci_last_first.get(key, [])
        
        if len(candidates) == 1:
            # Only one match - good enough if last name matches
            final_images[player_name] = candidates[0][1]
            print(f"  UniqueLastFirst: '{player_name}' -> '{candidates[0][0]}'")
            continue
        elif len(candidates) > 1:
            # Multiple matches - try to find best
            best = None
            for cname, curl, cn in candidates:
                if first in cn:
                    best = (cname, curl)
                    break
            if best:
                final_images[player_name] = best[1]
                print(f"  BestLastFirst: '{player_name}' -> '{best[0]}'")
                continue
        
        # Strategy 4: Check all entries with same last name
        all_last = ci_contains.get(last, [])
        for cname, curl, cn in all_last:
            # Check if the cricinfo name contains significant part of data.js first name
            cparts = cn.split()
            if len(cparts) >= 2:
                # e.g., "M Shahrukh Khan" contains "shahrukh"
                if any(first in cp for cp in cparts) or any(cp in first for cp in cparts if len(cp) > 2):
                    final_images[player_name] = curl
                    print(f"  ContainsFirst: '{player_name}' -> '{cname}'")
                    found = True
                    break
        if found:
            continue
    
    # Strategy 5: Check valid existing images
    if player_name in valid_existing:
        final_images[player_name] = valid_existing[player_name]
        print(f"  Existing: '{player_name}'")
        continue
    
    # Strategy 6: Substring matching - check if any cricinfo name contains all parts
    for cname, curl in cricinfo.items():
        cn = norm(cname)
        if all(p in cn for p in pn.split()):
            final_images[player_name] = curl
            print(f"  SubstringAll: '{player_name}' -> '{cname}'")
            found = True
            break
    if found:
        continue
    
    unmatched.append(player_name)

print(f"\n{'='*60}")
print(f"Matched: {len(final_images)}/{len(player_names)}")
print(f"Unmatched: {len(unmatched)}")
print(f"{'='*60}")

if unmatched:
    print("\nStill unmatched:")
    for name in sorted(unmatched):
        print(f"  - {name}")

# Save
with open('final_player_images.json', 'w', encoding='utf-8') as f:
    json.dump(final_images, f, indent=2)

with open('still_unmatched.json', 'w', encoding='utf-8') as f:
    json.dump(unmatched, f, indent=2)

print(f"\nSaved {len(final_images)} verified player images to final_player_images.json")
