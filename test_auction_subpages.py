from curl_cffi import requests
import json, re

endpoints = [
    "retained-players",
    "marquee-players",
    "teams",
    "squads"
]

base = "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/"

for ep in endpoints:
    url = base + ep
    try:
        r = requests.get(url, impersonate="chrome124", timeout=12)
        print(f"{ep}: status {r.status_code}")
        if r.status_code == 200:
            m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
            if m:
                with open(rf"C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\{ep}.json", "w", encoding="utf-8") as f:
                    f.write(m.group(1))
                print(f"  saved {ep}.json ({len(m.group(1))} bytes)")
    except Exception as e:
        print(f"Error {ep}: {e}")
