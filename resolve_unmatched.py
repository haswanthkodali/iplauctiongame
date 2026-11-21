"""
Resolve remaining unmatched players by searching ESPNcricinfo player profiles.
Uses the ESPNcricinfo search API to find player pages and extract headshot URLs.
"""
from curl_cffi import requests
import json
import time
import re

CDN_PREFIX = "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320"

with open('unmatched_players.json', 'r') as f:
    unmatched = json.load(f)

print(f"Resolving {len(unmatched)} unmatched players...")

resolved = {}
still_missing = []

for name in unmatched:
    # Use ESPNcricinfo search API
    slug = name.lower().replace(' ', '-').replace("'", "").replace('.', '')
    search_url = f"https://www.espncricinfo.com/search?q={name.replace(' ', '+')}&type=player"
    
    try:
        r = requests.get(search_url, impersonate="chrome124", timeout=10)
        if r.status_code == 200:
            # Try to find __NEXT_DATA__ with player results
            match = re.search(r'<script\s+id="__NEXT_DATA__"[^>]*>(.*?)</script>', r.text, re.DOTALL)
            if match:
                data = json.loads(match.group(1))
                # Walk to find players with imageUrl
                def find_player(obj, target_name, depth=0):
                    if depth > 10:
                        return None
                    if isinstance(obj, dict):
                        long_name = obj.get("longName", "") or obj.get("name", "")
                        image_url = obj.get("imageUrl", "") or obj.get("image", "")
                        if long_name and image_url and "/PICTURES/CMS/" in image_url:
                            # Check if this is our player
                            ln = long_name.lower()
                            tn = target_name.lower()
                            if ln == tn or tn in ln or ln in tn:
                                return CDN_PREFIX + image_url
                            # Check last name match
                            tparts = tn.split()
                            lparts = ln.split()
                            if tparts[-1] == lparts[-1]:
                                return CDN_PREFIX + image_url
                        for v in obj.values():
                            if isinstance(v, (dict, list)):
                                result = find_player(v, target_name, depth+1)
                                if result:
                                    return result
                    elif isinstance(obj, list):
                        for item in obj:
                            if isinstance(item, (dict, list)):
                                result = find_player(item, target_name, depth+1)
                                if result:
                                    return result
                    return None
                
                url = find_player(data, name)
                if url:
                    resolved[name] = url
                    print(f"  FOUND: {name} -> {url[:70]}...")
                else:
                    still_missing.append(name)
                    print(f"  MISS: {name}")
            else:
                still_missing.append(name)
                print(f"  NO DATA: {name}")
        else:
            still_missing.append(name)
            print(f"  HTTP {r.status_code}: {name}")
    except Exception as e:
        still_missing.append(name)
        print(f"  ERROR: {name}: {e}")
    
    time.sleep(0.5)  # Be nice to the server

print(f"\n{'='*60}")
print(f"Resolved: {len(resolved)}/{len(unmatched)}")
print(f"Still missing: {len(still_missing)}")
print(f"{'='*60}")

if still_missing:
    print("\nStill missing:")
    for name in still_missing:
        print(f"  - {name}")

# Save
with open('resolved_unmatched.json', 'w') as f:
    json.dump(resolved, f, indent=2)

with open('still_missing_players.json', 'w') as f:
    json.dump(still_missing, f, indent=2)

print(f"\nSaved {len(resolved)} resolved to resolved_unmatched.json")
