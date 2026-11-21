from curl_cffi import requests
import re

url = "https://wassets.hscicdn.com/_next/static/chunks/pages/auction/CiAuctionAllPlayersPage-7e3a5093930c9481.js"
r = requests.get(url, impersonate="chrome124")
text = r.text

# Look for graphql queries or operations
ops = re.findall(r'operationName["\']?\s*:\s*["\']([^"\']+)["\']', text)
print("GraphQL Operations:", set(ops))

# Look for any URL or path
urls = re.findall(r'["\'](/[^"\']+)["\']', text)
print("Relative paths:", set([u for u in urls if 'auction' in u or 'player' in u or 'api' in u]))
