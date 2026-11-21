from curl_cffi import requests
import json
import re

urls = [
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/sold-players",
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/unsold-players",
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/top-buys",
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016"
]

all_cricinfo_players = {}

def extract_from_html(html, source_name):
    count = 0
    # Search for all script tags
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    for s in scripts:
        if len(s) > 1000 and "appNextJsContext" in s:
            try:
                data = json.loads(s)
                def walk(obj):
                    nonlocal count
                    if isinstance(obj, dict):
                        name = obj.get("name") or obj.get("longName")
                        headshot = obj.get("headshot") or obj.get("image") or obj.get("playerImage")
                        if name and headshot:
                            if isinstance(headshot, dict):
                                url = headshot.get("url")
                            elif isinstance(headshot, str):
                                url = headshot
                            else:
                                url = None
                            if url and "/PICTURES/CMS/" in url:
                                full_url = "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320" + url
                                if name not in all_cricinfo_players:
                                    all_cricinfo_players[name] = full_url
                                    count += 1
                        for k, v in obj.items():
                            walk(v)
                    elif isinstance(obj, list):
                        for item in obj:
                            walk(item)
                walk(data)
            except Exception:
                pass
    print(f"✅ {source_name}: Extracted {count} players")

for u in urls:
    try:
        r = requests.get(u, impersonate="chrome124", timeout=15)
        if r.status_code == 200:
            extract_from_html(r.text, u.split('/')[-1])
        else:
            print(f"❌ {u}: Status {r.status_code}")
    except Exception as e:
        print(f"❌ {u}: {e}")

print(f"\nTotal Cricinfo auction players extracted: {len(all_cricinfo_players)}")
with open("cricinfo_auction_all_extracted.json", "w", encoding="utf-8") as out:
    json.dump(all_cricinfo_players, out, indent=2)
print("Saved to cricinfo_auction_all_extracted.json!")
