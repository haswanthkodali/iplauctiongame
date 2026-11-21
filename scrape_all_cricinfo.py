"""
Scrape ALL player headshots from ESPNcricinfo IPL 2026 auction pages.
Uses curl_cffi to bypass Akamai WAF.
"""
from curl_cffi import requests
import json
import re
import time

CDN_PREFIX = "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320"

urls = [
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players",
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/sold-players",
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/unsold-players",
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/top-buys",
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016",
]

all_players = {}

def extract_from_html(html, source_name):
    count = 0
    # Find __NEXT_DATA__ script tag
    match = re.search(r'<script\s+id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group(1))
            extract_players(data, source_name)
            return
        except Exception as e:
            print(f"  Failed to parse __NEXT_DATA__: {e}")

    # Fallback: search all large script tags
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    for s in scripts:
        if len(s) > 5000:
            try:
                data = json.loads(s)
                extract_players(data, source_name)
            except Exception:
                pass

def extract_players(data, source_name):
    count = 0
    def walk(obj, depth=0):
        nonlocal count
        if depth > 15:
            return
        if isinstance(obj, dict):
            # Check for player object with longName + imageUrl
            long_name = obj.get("longName", "")
            image_url = obj.get("imageUrl", "")
            if long_name and image_url and "/PICTURES/CMS/" in image_url:
                full_url = CDN_PREFIX + image_url
                if long_name not in all_players:
                    all_players[long_name] = full_url
                    count += 1
            # Also check name field (for some formats)
            name = obj.get("name", "")
            if not long_name and name and image_url and "/PICTURES/CMS/" in image_url:
                # Only use if name looks like a person (has space)
                if " " in name and len(name) < 40:
                    full_url = CDN_PREFIX + image_url
                    if name not in all_players:
                        all_players[name] = full_url
                        count += 1
            # Check headshot/image fields too
            for img_key in ["headshot", "image", "playerImage"]:
                headshot = obj.get(img_key)
                if headshot and long_name:
                    url = None
                    if isinstance(headshot, dict):
                        url = headshot.get("url", "")
                    elif isinstance(headshot, str):
                        url = headshot
                    if url and "/PICTURES/CMS/" in url:
                        full_url = CDN_PREFIX + url
                        if long_name not in all_players:
                            all_players[long_name] = full_url
                            count += 1
            for v in obj.values():
                if isinstance(v, (dict, list)):
                    walk(v, depth + 1)
        elif isinstance(obj, list):
            for item in obj:
                if isinstance(item, (dict, list)):
                    walk(item, depth + 1)
    
    walk(data)
    print(f"  {source_name}: +{count} new players (total: {len(all_players)})")

for url in urls:
    page_name = url.split('/')[-1] or "home"
    print(f"\nFetching {page_name}...")
    try:
        r = requests.get(url, impersonate="chrome124", timeout=20)
        if r.status_code == 200:
            print(f"  Got {len(r.text)} bytes")
            extract_from_html(r.text, page_name)
        else:
            print(f"  HTTP {r.status_code}")
    except Exception as e:
        print(f"  Error: {e}")
    time.sleep(1)

# Filter out non-player entries (countries, teams, etc.)
# Players have names like "Virat Kohli", teams like "Chennai Super Kings"
team_keywords = ["Super Kings", "Capitals", "Titans", "Knight Riders", "Super Giants",
                 "Indians", "Kings", "Royals", "Challengers", "Sunrisers",
                 "Women", "Lions", "Strikers", "Thunder", "Sixers", "Scorchers",
                 "Hurricanes", "Renegades", "Stars", "Heat", "Vipers", "Emirates"]
country_keywords = ["India", "Australia", "England", "South Africa", "West Indies",
                     "New Zealand", "Pakistan", "Sri Lanka", "Bangladesh", "Afghanistan",
                     "Ireland", "Zimbabwe", "Scotland", "Netherlands", "Namibia", "Nepal",
                     "Kenya", "Bermuda", "Canada", "USA", "Hong Kong", "Jersey", "Oman",
                     "Papua New Guinea", "Uganda"]
state_keywords = ["Pradesh", "Karnataka", "Kerala", "Gujarat", "Maharashtra", "Rajasthan",
                  "Haryana", "Delhi", "Mumbai", "Baroda", "Vidarbha", "Saurashtra",
                  "Hyderabad", "Bengal", "Bihar", "Jharkhand", "Odisha", "Tripura",
                  "Manipur", "Mizoram", "Meghalaya", "Nagaland", "Assam", "Sikkim",
                  "Goa", "Chandigarh", "Puducherry", "Services", "Railways",
                  "Jammu", "Tamil Nadu", "Punjab", "Himachal"]

player_images = {}
for name, url in all_players.items():
    is_team = any(kw in name for kw in team_keywords)
    is_country = name in country_keywords or any(name.startswith(c) for c in country_keywords)
    is_state = any(kw in name for kw in state_keywords)
    if not is_team and not is_country and not is_state:
        player_images[name] = url

print(f"\n{'='*60}")
print(f"Total entries extracted: {len(all_players)}")
print(f"Player images (filtered): {len(player_images)}")
print(f"{'='*60}")

with open("cricinfo_all_player_images.json", "w", encoding="utf-8") as f:
    json.dump(player_images, f, indent=2)

print("Saved to cricinfo_all_player_images.json")

# Show first 20
for i, (name, url) in enumerate(list(player_images.items())[:20]):
    print(f"  {name}: {url[:80]}...")
