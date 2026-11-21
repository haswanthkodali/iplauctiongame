with open('storage.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for k in range(810, min(len(lines), 840)):
    print(f"{k+1}: {lines[k].rstrip()}")
