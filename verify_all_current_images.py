import urllib.request
import re
import json

with open('player-images.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract all "Player Name": "URL"
pattern = re.compile(r'"([^"]+)":\s*"(https?://[^"]+)"')
matches = pattern.findall(text)
print(f"Total entries in player-images.js: {len(matches)}")

valid = []
broken = []

for name, url in matches:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                length = len(resp.read())
                if length > 500: # Not an empty or error stub
                    valid.append((name, url, length))
                else:
                    broken.append((name, url, f"Empty length {length}"))
            else:
                broken.append((name, url, f"Status {resp.status}"))
    except Exception as e:
        broken.append((name, url, str(e)))

print(f"\n--- RESULTS ---")
print(f"Valid URLs: {len(valid)}")
print(f"Broken URLs: {len(broken)}")

with open('valid_images.json', 'w', encoding='utf-8') as f:
    json.dump({name: url for name, url, _ in valid}, f, indent=2)

with open('broken_images.json', 'w', encoding='utf-8') as f:
    json.dump({name: (url, err) for name, url, err in broken}, f, indent=2)

print("\nSaved valid_images.json and broken_images.json")
