from curl_cffi import requests
import re

url = "https://www.iplt20.com/players"
r = requests.get(url, impersonate="chrome124", timeout=15)
html = r.text

with open("iplt20_players.html", "w", encoding="utf-8") as f:
    f.write(html)

# Find all img tags
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', html)
print("Total img tags:", len(imgs))
for img in imgs[:15]:
    print(" ", img)

# Find player links
plinks = re.findall(r'href=["\'](/players/[^"\']+)["\']', html)
print("Player links:", len(plinks))
for p in plinks[:15]:
    print(" ", p)
