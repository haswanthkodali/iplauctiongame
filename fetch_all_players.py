from curl_cffi import requests
import json, re

url = "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players"
try:
    r = requests.get(url, impersonate="chrome124", timeout=15)
    print("Status:", r.status_code)
    m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
    if m:
        raw = json.loads(m.group(1))
        with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\all_players_raw.json', 'w', encoding='utf-8') as f:
            json.dump(raw, f)
        print("Successfully saved all_players_raw.json! File size:", len(m.group(1)))
except Exception as e:
    print("Error:", e)
