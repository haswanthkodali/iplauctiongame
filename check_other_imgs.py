import re

with open('player-images.js', 'r', encoding='utf-8') as f:
    content = f.read()

pairs = re.findall(r'\"([^\"]+)\"\s*:\s*\"([^\"]+)\"', content)
for p, u in pairs:
    if 'documents.iplt20.com' not in u:
        print(f'{p}: {u}')
