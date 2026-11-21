import re

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# find all players in PLAYERS = [ ... ]
pattern = r'\{\s*id:\s*(\d+|"[^"]+"),\s*name:\s*"([^"]+)",\s*country:\s*"([^"]+)",\s*role:\s*"([^"]+)"'
players = re.findall(pattern, text)
print(f"Total players in PLAYERS array: {len(players)}")

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\player-images.js', 'r', encoding='utf-8') as f:
    pi_text = f.read()

mapped_names = set(re.findall(r'"([^"]+)":\s*"https://', pi_text))
print(f"Mapped in player-images.js: {len(mapped_names)}")

unmapped = [p for p in players if p[1] not in mapped_names]
print(f"Unmapped players: {len(unmapped)}")
print("Sample unmapped:", [p[1] for p in unmapped[:20]])
