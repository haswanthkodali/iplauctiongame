import re

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\data.js', 'r', encoding='utf-8') as f:
    data_code = f.read()

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\stats.js', 'r', encoding='utf-8') as f:
    stats_code = f.read()

data_players = re.findall(r'name:\s*["\']([^"\']+)["\']', data_code)
# filter out team names (first 10)
data_players = data_players[10:]

stats_keys = set(re.findall(r'^\s*["\']([^"\']+)["\']:\s*\{', stats_code, re.MULTILINE))

missing = []
exact = []
for p in data_players:
    if p in stats_keys:
        exact.append(p)
    else:
        # Check if case or trimmed mismatch
        close = [k for k in stats_keys if k.lower().strip() == p.lower().strip()]
        missing.append((p, close))

print(f"Total players in data.js: {len(data_players)}")
print(f"Exact match in stats.js: {len(exact)}")
print(f"Missing in stats.js: {len(missing)}")
print("Sample missing from stats.js:")
for p, close in missing[:20]:
    print(f"  '{p}' -> close match in stats: {close}")
