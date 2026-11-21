from curl_cffi import requests
import re

url = 'https://www.iplt20.com/players'
r = requests.get(url, impersonate='chrome124', timeout=15)
apis = set(re.findall(r'/[a-zA-Z0-9_\-\./]*(?:api|player|team-asset)[a-zA-Z0-9_\-\./]*', r.text))
print(f"Endpoints found: {len(apis)}")
for a in sorted(apis):
    if any(k in a for k in ['api', 'feed', 'asset', 'json', 'data']):
        print(" ", a)
