from curl_cffi import requests
import re

url = "https://wassets.hscicdn.com/_next/static/chunks/pages/auction/CiAuctionAllPlayersPage-7e3a5093930c9481.js"
r = requests.get(url, impersonate='chrome124')
# search for URLs or fetch calls
fetches = re.findall(r'https?://[a-zA-Z0-9_\-\./]+', r.text)
print("URLs in chunk:", set(fetches))

# search for query or paths
paths = re.findall(r'["\'](/[a-zA-Z0-9_\-\./]+)["\']', r.text)
for p in set(paths):
    if any(k in p for k in ['auction', 'player', 'content', 'api']):
        print("Path:", p)
