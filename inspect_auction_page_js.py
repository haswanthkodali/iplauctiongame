from curl_cffi import requests
import re

url = "https://wassets.hscicdn.com/_next/static/chunks/pages/auction/CiAuctionAllPlayersPage-7e3a5093930c9481.js"

r = requests.get(url, impersonate="chrome124")
print("Status:", r.status_code)
print("Length:", len(r.text))

# Search for api or graphql or endpoints
endpoints = re.findall(r'["\'](https?://[^"\']+|/api/[^"\']+|graphql[^"\']*)["\']', r.text)
print("Endpoints found:", len(endpoints))
for ep in endpoints[:20]:
    print(" ", ep)

# Search for query or auction
queries = re.findall(r'(query\s+[a-zA-Z0-9_]+[^{]*\{[^}]+\})', r.text)
print("Queries found:", len(queries))
for q in queries[:5]:
    print(" ", q[:100])
