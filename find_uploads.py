import re

with open("cricinfo_full.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find the full block for virat kohli or josh hazlewood
match = re.search(r'(<a href="/cricketers/virat-kohli-253802"[^>]*>.*?</a>)', html, re.DOTALL)
if match:
    print(match.group(1))

# Also search for "image/upload" in the whole HTML!
uploads = re.findall(r'https?://[^\s"\']*image/upload[^\s"\']*', html)
print(f"\nDirect image/upload URLs in HTML: {len(uploads)}")
for u in uploads[:10]:
    print(u)
