from curl_cffi import requests
import re, json

url = "https://www.iplt20.com/players"
r = requests.get(url, impersonate="chrome124", timeout=15)
print("Status:", r.status_code)
# Search for player names and images in __NEXT_DATA__
m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
if m:
    data = json.loads(m.group(1))
    print("NEXT_DATA found! Keys in props:", list(data.get('props', {}).keys()))
    with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\iplt20_players_page.json', 'w', encoding='utf-8') as f:
        json.dump(data, f)
    print("Saved to iplt20_players_page.json")
else:
    print("No NEXT_DATA")
