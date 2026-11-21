from curl_cffi import requests
import re

url = "https://www.espncricinfo.com/cricketers/suryakumar-yadav-446507"
r = requests.get(url, impersonate="chrome124", timeout=15)
print("Status:", r.status_code)
print("Length:", len(r.text))

# Search for hscicdn images
imgs = re.findall(r'https?://img1\.hscicdn\.com/image/upload/[^\s"\']+', r.text)
print(f"hscicdn upload images found: {len(imgs)}")
for img in imgs[:10]:
    print(" ", img)
