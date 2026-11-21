with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

import re

for i, line in enumerate(lines):
    if re.search(r'\bawait\b', line):
        print(f"Line {i+1}: {line.strip()}")
