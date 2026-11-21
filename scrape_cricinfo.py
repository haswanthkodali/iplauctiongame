import urllib.request
import json
import re

url = "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5"
}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Fetched {len(html)} bytes from {url}")
        
        # Look for __NEXT_DATA__
        next_data_match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
        if next_data_match:
            print("Found __NEXT_DATA__!")
            data = json.loads(next_data_match.group(1))
            with open("cricinfo_data.json", "w", encoding="utf-8") as out_f:
                json.dump(data, out_f, indent=2)
            print("Saved cricinfo_data.json")
        else:
            print("No __NEXT_DATA__, searching for player image URLs...")
            # Look for img tags with hscicdn
            imgs = re.findall(r'<img[^>]+src=["\'](https?://[^"\']*hscicdn[^"\']*)["\'][^>]*alt=["\']([^"\']*)["\']', html)
            print(f"Found {len(imgs)} images with alt text")
            with open("cricinfo_raw.html", "w", encoding="utf-8") as out_f:
                out_f.write(html)
except Exception as e:
    print(f"Error: {e}")
