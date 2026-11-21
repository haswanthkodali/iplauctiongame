from curl_cffi import requests
import re

url = "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players?page=2"
r = requests.get(url, impersonate="chrome124", timeout=15)
print("Page 2 status:", r.status_code)
print("Page 2 length:", len(r.text))

matches = re.findall(r'href="/cricketers/([a-z0-9\-]+)-(\d+)"', r.text)
players = set([m[0] for m in matches])
print(f"Page 2 players ({len(players)}):", list(players)[:10])
