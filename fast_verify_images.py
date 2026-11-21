import urllib.request
import re
import json
from concurrent.futures import ThreadPoolExecutor

with open('player-images.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract all "Player Name": "URL"
pattern = re.compile(r'"([^"]+)":\s*"(https?://[^"]+)"')
matches = pattern.findall(text)
print(f"Total entries in player-images.js: {len(matches)}")

def check_one(item):
    name, url = item
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                length = len(resp.read())
                if length > 500:
                    return (name, url, True, length, "")
                else:
                    return (name, url, False, length, "Too short / error body")
            else:
                return (name, url, False, 0, f"Status {resp.status}")
    except Exception as e:
        return (name, url, False, 0, str(e))

with ThreadPoolExecutor(max_workers=30) as executor:
    results = list(executor.map(check_one, matches))

valid = {}
broken = {}

for name, url, ok, length, err in results:
    if ok:
        valid[name] = url
    else:
        broken[name] = {"url": url, "error": err}

print(f"DONE! Valid: {len(valid)}, Broken: {len(broken)}")

with open('valid_images.json', 'w', encoding='utf-8') as f:
    json.dump(valid, f, indent=2)

with open('broken_images.json', 'w', encoding='utf-8') as f:
    json.dump(broken, f, indent=2)
