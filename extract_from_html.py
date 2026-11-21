import re
import json

with open("cricinfo_full.html", "r", encoding="utf-8") as f:
    html = f.read()

# Look for image tags or image URLs
img_matches = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', html)
print(f"Total img tags: {len(img_matches)}")

cricinfo_imgs = [m for m in img_matches if "hscicdn.com" in m]
print(f"hscicdn.com images: {len(cricinfo_imgs)}")

# Let's inspect some sample img tags
sample_imgs = re.findall(r'(<img[^>]+>)', html)[:30]
for s in sample_imgs:
    if "hscicdn" in s or "player" in s or "alt=" in s:
        print(s)

# Also search for player card containers or data attributes
cards = re.findall(r'href=["\'](/cricketers/[^"\']+)["\']', html)
print(f"Player links found: {len(cards)}")
print("Sample player links:", cards[:10])
