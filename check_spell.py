import re
with open('data.js', 'r', encoding='utf-8') as f:
    c = f.read()

for target in ['Dhawan', 'Parag', 'Porel']:
    matches = re.findall(r'name:\s*["\']([^"\']*' + target + r'[^"\']*)["\']', c, re.IGNORECASE)
    print(target, matches)
