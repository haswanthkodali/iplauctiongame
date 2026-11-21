from curl_cffi import requests
import re

url = 'https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players'
r = requests.get(url, impersonate='chrome124')
scripts = re.findall(r'src="([^"]+chunks[^"]+)"', r.text)
print(f"Chunks count: {len(scripts)}")
for s in scripts:
    if 'auction' in s:
        print("Auction chunk:", s)
        # Fetch chunk and search for api url
        r2 = requests.get(s, impersonate='chrome124')
        apis = re.findall(r'["\'](/api/[^"\']+)["\']', r2.text)
        print("  apis:", apis[:10])
        hs_apis = re.findall(r'https://hs-consumer-api\.espncricinfo\.com[^\s"\'`)]+', r2.text)
        print("  hs_apis:", hs_apis[:10])
