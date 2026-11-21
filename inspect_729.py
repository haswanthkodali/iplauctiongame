with open('storage.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for k in range(715, min(len(lines), 740)):
    print(f"{k+1}: {lines[k].rstrip()}")
