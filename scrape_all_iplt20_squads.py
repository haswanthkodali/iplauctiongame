from curl_cffi import requests
import re
import json

teams = [
    "chennai-super-kings",
    "mumbai-indians",
    "royal-challengers-bengaluru",
    "kolkata-knight-riders",
    "delhi-capitals",
    "punjab-kings",
    "rajasthan-royals",
    "sunrisers-hyderabad",
    "gujarat-titans",
    "lucknow-super-giants"
]

all_players = {}

for t in teams:
    url = f"https://www.iplt20.com/teams/{t}/squad"
    try:
        r = requests.get(url, impersonate="chrome124", timeout=15)
        if r.status_code == 200:
            # Matches like: alt="Player Name" src="/_next/image?url=..."
            # Or <div ...>Player Name</div> ... <img ...>
            matches = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']+)["\']', r.text)
            matches += [(src, alt) for alt, src in re.findall(r'<img[^>]+alt=["\']([^"\']+)["\'][^>]*src=["\']([^"\']+)["\']', r.text)]
            
            count = 0
            for src, alt in matches:
                name = alt.strip()
                if len(name) > 3 and not any(skip in name.lower() for skip in ['super-kings', 'capitals', 'titans', 'riders', 'giants', 'indians', 'kings', 'royals', 'bengaluru', 'hyderabad', 'trophy', 'vs', 'dot', 'striker', 'amazing', 'moments', 'light', 'dark', 'logo', 'ipl']):
                    # Clean up src URL
                    if src.startswith('/_next/image'):
                        full_url = f"https://www.iplt20.com{src}"
                    elif src.startswith('http'):
                        full_url = src
                    else:
                        full_url = f"https://www.iplt20.com{src}"
                    
                    if name not in all_players:
                        all_players[name] = full_url
                        count += 1
            print(f"✅ {t}: Found {count} players")
    except Exception as e:
        print(f"❌ {t}: {e}")

print(f"\nTotal official IPL squad players scraped: {len(all_players)}")

with open('iplt20_official_players.json', 'w', encoding='utf-8') as f:
    json.dump(all_players, f, indent=2)

print("Saved iplt20_official_players.json!")
