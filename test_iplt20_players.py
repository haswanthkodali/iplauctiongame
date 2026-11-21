from curl_cffi import requests
import re
import json

url = "https://www.iplt20.com/players"
try:
    r = requests.get(url, impersonate="chrome124", timeout=15)
    print("Status code:", r.status_code)
    print("Length:", len(r.text))
    # Look for headshot or player URLs
    headshots = re.findall(r'https?://[^\s"\']*IPLHeadshot[^\s"\']*', r.text)
    print("IPLHeadshot URLs in HTML:", len(headshots))
    if headshots:
        print("Sample:", headshots[:5])
    
    # Look for API endpoints in the page
    apis = re.findall(r'https?://[^\s"\']*(?:api|stats|feed|data)[^\s"\']*', r.text)
    print("APIs found:", len(apis))
    for a in apis[:10]:
        print(" ", a)
except Exception as e:
    print("Error:", e)
