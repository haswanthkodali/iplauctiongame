from curl_cffi import requests
import json
import re

url = "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players"

try:
    r = requests.get(url, impersonate="chrome124", timeout=15)
    print("Status code:", r.status_code)
    print("HTML length:", len(r.text))
    if r.status_code == 200:
        with open("cricinfo_full.html", "w", encoding="utf-8") as f:
            f.write(r.text)
        print("Successfully saved cricinfo_full.html!")
        
        # Check __NEXT_DATA__
        m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
        if m:
            print("Found __NEXT_DATA__!")
            data = json.loads(m.group(1))
            with open("cricinfo_next_data.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            print("Saved cricinfo_next_data.json!")
except Exception as e:
    print("Error:", e)
