from curl_cffi import requests
import json, re

urls = [
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players?pageSize=500",
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players?limit=500",
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players?page=2"
]

for u in urls:
    try:
        r = requests.get(u, impersonate="chrome124", timeout=12)
        m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
        if m:
            data = json.loads(m.group(1))
            pl = data['props']['appPageProps']['data']['content']['players']
            print(u.split('?')[-1], "=> player count:", len(pl), "first player:", pl[0]['player']['longName'])
        else:
            print(u.split('?')[-1], "=> no NEXT_DATA")
    except Exception as e:
        print(u.split('?')[-1], "=> error:", e)
