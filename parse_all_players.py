import re

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\data.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Parse all player objects in PLAYERS array
# Find PLAYERS = [ ... ]
start = code.find('const PLAYERS = [')
end = code.find('];', start)
players_text = code[start:end+2]

# Extract each player block
blocks = re.findall(r'\{\s*id:\s*(\d+|"[^"]+"),\s*name:\s*"([^"]+)",\s*country:\s*"([^"]+)",\s*role:\s*"([^"]+)"[^\}]*\}', players_text)
print(f"Parsed {len(blocks)} players.")
for b in blocks[:15]:
    print(f"ID: {b[0]}, Name: {b[1]}, Country: {b[2]}, Role: {b[3]}")
