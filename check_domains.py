import re

with open('player-images.js', 'r', encoding='utf-8') as f:
    content = f.read()

pairs = re.findall(r'\"([^\"]+)\"\s*:\s*\"([^\"]+)\"', content)
domains = {}
for p, u in pairs:
    domain = u.split('/')[2] if '/' in u else 'other'
    domains.setdefault(domain, 0)
    domains[domain] += 1

print('Image source domains:', domains)
