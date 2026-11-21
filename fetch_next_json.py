from curl_cffi import requests
import json

url = "https://www.espncricinfo.com/_next/data/XXhB26hXsDGLPYZfs8fiU/auction/ipl-2026-auction-1515016/all-players.json"

try:
    r = requests.get(url, impersonate="chrome124", timeout=15)
    print("Status code:", r.status_code)
    print("Length:", len(r.text))
    if r.status_code == 200:
        with open("cricinfo_auction_data.json", "w", encoding="utf-8") as f:
            f.write(r.text)
        print("BINGO! Saved cricinfo_auction_data.json!")
        data = r.json()
        print("Top keys:", list(data.keys()))
        props = data.get("pageProps", {})
        print("pageProps keys:", list(props.keys()))
except Exception as e:
    print("Error:", e)
