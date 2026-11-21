import re

with open('data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract player names
names = re.findall(r'name:\s*"([^"]*)"', text)
print(f'Total player names in data.js: {len(names)}')

# Read existing image keys
with open('player-images.js', 'r', encoding='utf-8') as f:
    img_text = f.read()

img_names = re.findall(r'"([^"]+)":\s*"https?://', img_text)
img_set = set(img_names)
print(f'Total image entries in player-images.js: {len(img_set)}')

# Find missing
missing = []
for n in names:
    if n not in img_set and n not in ['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bengaluru', 
                                       'Kolkata Knight Riders', 'Delhi Capitals', 'Punjab Kings',
                                       'Rajasthan Royals', 'Sunrisers Hyderabad', 'Gujarat Titans', 'Lucknow Super Giants']:
        missing.append(n)

print(f'\nMissing images ({len(missing)} players):')
for n in missing:
    print(f'  - {n}')
