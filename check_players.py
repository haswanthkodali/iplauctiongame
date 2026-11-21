import re

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\data.js', 'r', encoding='utf-8') as f:
    d = f.read()
players = re.findall(r'name:\s*["\']([^"\']+)["\']', d)
print('Total players in data.js:', len(players))

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\player-images.js', 'r', encoding='utf-8') as f:
    img_code = f.read()

mapped = re.findall(r'"([^"]+)":\s*"https://', img_code)
print('Total mapped in player-images.js:', len(mapped))

missing = [p for p in players if p not in mapped]
print('Missing players count:', len(missing))
print('Sample missing:', missing[:15])
