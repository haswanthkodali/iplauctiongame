with open('storage.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
keys = re.findall(r'localStorage\.(?:getItem|setItem)\([\'"]([^\'"]+)[\'"]', text)
print(sorted(set(keys)))
