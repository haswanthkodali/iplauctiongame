from curl_cffi import requests
import re

url = "https://wassets.hscicdn.com/_next/static/XXhB26hXsDGLPYZfs8fiU/_buildManifest.js"
r = requests.get(url, impersonate="chrome124")
print("Status:", r.status_code)

matches = re.findall(r'"(/[^"]*auction[^"]*)"', r.text)
print("Auction routes in manifest:")
for m in matches:
    print(" ", m)
