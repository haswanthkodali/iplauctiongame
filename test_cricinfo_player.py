from curl_cffi import requests
import json, re

slug = "faf-du-plessis-44828"
url = f"https://www.espncricinfo.com/cricketers/{slug}"

try:
    r = requests.get(url, impersonate="chrome124", timeout=15)
    print("Status:", r.status_code)
    m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
    if m:
        data = json.loads(m.group(1))
        player = data.get('props', {}).get('appPageProps', {}).get('data', {}).get('player', {})
        print("Player Name:", player.get('name') or player.get('longName'))
        img = player.get('image') or player.get('headshotImage') or player.get('imageUrl')
        print("Image:", img)
        if isinstance(img, dict):
            print("Image URL:", img.get('url'))
    else:
        print("NEXT_DATA not found")
except Exception as e:
    print("Error:", e)
