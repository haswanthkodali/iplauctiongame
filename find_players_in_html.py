from curl_cffi import requests
import re

url = "https://www.iplt20.com/teams/chennai-super-kings/squad"
r = requests.get(url, impersonate="chrome124", timeout=15)
matches = re.findall(r'pathname[=:][^"\'&>]+player[^"\'&>]+', r.text)
print("Matches with pathname=player:", len(matches))
for m in set(matches):
    print(" ", m)
