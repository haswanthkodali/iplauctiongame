from curl_cffi import requests
import re

url = "https://www.iplt20.com/teams/chennai-super-kings/squad"
r = requests.get(url, impersonate="chrome124", timeout=15)
print("CSK squad status:", r.status_code)
print("CSK squad length:", len(r.text))

# Search for player images and names
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']+)["\']', r.text)
print("Player images with alt:", len(imgs))
for src, alt in imgs:
    if "player" in src.lower() or "headshot" in src.lower() or "ih.constantcontact" in src.lower() or len(alt) > 2:
        print(f"  {alt}: {src}")

# Search for any image URLs
all_imgs = re.findall(r'https?://[^\s"\']+(?:\.png|\.jpg|\.webp)', r.text)
print("All image URLs:", len(all_imgs))
for img in all_imgs[:10]:
    print(" ", img)
