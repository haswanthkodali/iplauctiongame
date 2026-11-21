from curl_cffi import requests
import json

base = "https://www.espncricinfo.com/_next/data/XXhB26hXsDGLPYZfs8fiU/auction/CiAuctionAllPlayersPage.json"
urls = [
    base,
    f"{base}?seriesSlug=ipl-2026-auction-1515016",
    f"{base}?seriesSlug=ipl-2026-auction&seriesId=1515016",
    f"{base}?auctionSlug=ipl-2026-auction-1515016"
]

for u in urls:
    try:
        r = requests.get(u, impersonate="chrome124", timeout=10)
        print(f"URL: {u} -> Status: {r.status_code}, Length: {len(r.text)}")
        if r.status_code == 200:
            with open("cricinfo_auction_page_data.json", "w", encoding="utf-8") as f:
                f.write(r.text)
            print("FOUND! Saved to cricinfo_auction_page_data.json")
            break
    except Exception as e:
        print(f"Error {u}: {e}")
