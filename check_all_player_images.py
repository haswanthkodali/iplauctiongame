with open('data.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
players = re.findall(r'name:\s*["\']([^"\']+)["\']', text)
print(f"Total players in data.js: {len(players)}")

# Compare with player-images.js
with open('player-images.js', 'r', encoding='utf-8') as f:
    img_text = f.read()

mapped = set(re.findall(r'["\']([^"\']+)["\']:\s*["\']https?://', img_text))
print(f"Total mapped in PLAYER_IMAGES: {len(mapped)}")

missing = [p for p in players if p not in mapped]
print(f"Players without photo mapping ({len(missing)}):")
for p in missing[:20]:
    print(" ", p)
