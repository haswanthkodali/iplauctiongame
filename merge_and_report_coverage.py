import json
import re

with open('C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# All players in data.js
names = re.findall(r'name:\s*"([^"]+)"', text)
teams_names = ['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bengaluru', 
               'Kolkata Knight Riders', 'Delhi Capitals', 'Punjab Kings',
               'Rajasthan Royals', 'Sunrisers Hyderabad', 'Gujarat Titans', 'Lucknow Super Giants']
all_players = [n for n in names if n not in teams_names]
print(f"Total auction players: {len(all_players)}")

# Load sources
with open('C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/valid_images.json', 'r', encoding='utf-8') as f:
    valid_map = json.load(f)

with open('C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/resolved_images.json', 'r', encoding='utf-8') as f:
    wiki_map = json.load(f)

with open('C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/iplt20_official_players.json', 'r', encoding='utf-8') as f:
    iplt20_map = json.load(f)

merged = {}

# 1. First priority: valid CDN images from valid_map
for p, u in valid_map.items():
    merged[p] = u

# 2. Second priority: wiki_map
for p, u in wiki_map.items():
    if p not in merged:
        merged[p] = u

# 3. Third priority: iplt20_map (clean URL)
for p, u in iplt20_map.items():
    if p not in merged:
        if u.startswith('https://www.iplt20.comhttps://'):
            u = u.replace('https://www.iplt20.comhttps://', 'https://')
        merged[p] = u

covered = [p for p in all_players if p in merged]
missing = [p for p in all_players if p not in merged]

print(f"\nCOVERAGE:")
print(f"Covered: {len(covered)} / {len(all_players)} ({len(covered)/len(all_players)*100:.1f}%)")
print(f"Missing: {len(missing)}")

print("\nMissing player list:")
for m in missing[:30]:
    print(f"  - {m}")
