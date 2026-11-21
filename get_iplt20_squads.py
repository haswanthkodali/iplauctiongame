from curl_cffi import requests
import re, json

teams = [
    "chennai-super-kings",
    "delhi-capitals",
    "gujarat-titans",
    "kolkata-knight-riders",
    "lucknow-super-giants",
    "mumbai-indians",
    "punjab-kings",
    "rajasthan-royals",
    "royal-challengers-bengaluru",
    "sunrisers-hyderabad"
]

all_iplt20_players = {}

for t in teams:
    url = f"https://www.iplt20.com/teams/{t}/squad"
    try:
        r = requests.get(url, impersonate="chrome124", timeout=15)
        if r.status_code == 200:
            # find player card patterns
            # typically <img ... src="...image?url=..." ... alt="Player Name"
            matches = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']+)["\']', r.text)
            matches += re.findall(r'<img[^>]+alt=["\']([^"\']+)["\'][^>]*src=["\']([^"\']+)["\']', r.text)
            for m in matches:
                # check which is url and which is name
                if 'http' in m[0] or '_next' in m[0] or 'api' in m[0]:
                    img_url, name = m[0], m[1]
                else:
                    name, img_url = m[0], m[1]
                if any(x in img_url for x in ['player', 'headshot', 'IPLHeadshot']):
                    if img_url.startswith('/'):
                        img_url = 'https://www.iplt20.com' + img_url
                    all_iplt20_players[name.strip()] = img_url
                    print(f"[{t}] {name.strip()} => {img_url[:80]}...")
    except Exception as e:
        print(f"Error {t}: {e}")

print(f"Total iplt20 squad players extracted: {len(all_iplt20_players)}")
with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\iplt20_squad_images.json', 'w', encoding='utf-8') as f:
    json.dump(all_iplt20_players, f, indent=2)
