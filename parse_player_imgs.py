import re

with open("cricinfo_full.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find all <a><img ...></a>
pattern = re.compile(r'<a href="(/cricketers/[^"]+)"[^>]*>.*?<img([^>]+)>', re.DOTALL)
matches = pattern.findall(html)
print(f"Total player matches: {len(matches)}")

for href, img_attrs in matches[:20]:
    print("HREF:", href)
    src_m = re.search(r'src="([^"]+)"', img_attrs)
    alt_m = re.search(r'alt="([^"]+)"', img_attrs)
    print("  SRC:", src_m.group(1) if src_m else "None")
    print("  ALT:", alt_m.group(1) if alt_m else "None")
