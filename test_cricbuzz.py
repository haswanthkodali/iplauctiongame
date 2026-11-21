from curl_cffi import requests
import re, json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# Cricbuzz search API
url = "https://www.cricbuzz.com/api/search/results?q=Daryl%20Mitchell"
r = requests.get(url, headers=headers, impersonate="chrome124", timeout=10)
print("Search status:", r.status_code)
print("Text:", r.text[:500])
