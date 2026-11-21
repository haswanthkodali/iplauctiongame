import re

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\player-images.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'"([^"]+)":\s*"([^"]+)"', text)
print(f"Total entries in player-images.js: {len(matches)}")
domains = {}
for name, url in matches:
    if '://' in url:
        d = url.split('/')[2]
    else:
        d = 'local/svg'
    domains[d] = domains.get(d, 0) + 1

for d, count in domains.items():
    print(f"  {d}: {count}")

# Print first 10
print("\nFirst 10:")
for name, url in matches[:10]:
    print(f"  {name}: {url}")
