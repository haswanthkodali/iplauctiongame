import httpx

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Sec-Ch-Ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1"
}

try:
    with httpx.Client(http2=True, headers=headers, follow_redirects=True, timeout=15) as client:
        r = client.get("https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players")
        print("Status:", r.status_code)
        print("Length:", len(r.text))
        if r.status_code == 200:
            with open("cricinfo_httpx.html", "w", encoding="utf-8") as f:
                f.write(r.text)
            print("SUCCESS! Saved cricinfo_httpx.html")
except Exception as e:
    print("Error:", e)
