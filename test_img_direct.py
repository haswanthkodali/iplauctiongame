import urllib.request
import urllib.parse

url = "https://www.iplt20.com/_next/image?url=%2Fapi%2Fteam-assets%3Fpathname%3Dplayer%252F8903%252F1622%252F43272.png&w=750&q=75"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        print("Status:", resp.status)
        data = resp.read()
        print("Length:", len(data))
        print("Content-Type:", resp.headers.get("Content-Type"))
except Exception as e:
    print("Error:", e)
