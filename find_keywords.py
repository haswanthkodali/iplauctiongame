from curl_cffi import requests
import re

url = "https://wassets.hscicdn.com/_next/static/chunks/pages/auction/CiAuctionAllPlayersPage-7e3a5093930c9481.js"
r = requests.get(url, impersonate="chrome124")

text = r.text
print("Keywords:")
for word in ["image", "headshot", "portrait", "photo", "imageUrl", "hscicdn", "player"]:
    matches = [m.start() for m in re.finditer(word, text, re.IGNORECASE)]
    print(f" {word}: {len(matches)} matches")

# Print surrounding of "headshot" or "portrait"
for m in re.finditer(r'(headshot|portrait|imageUrl)', text, re.IGNORECASE):
    idx = m.start()
    print(text[max(0, idx-100):min(len(text), idx+100)])
    print("-" * 50)
