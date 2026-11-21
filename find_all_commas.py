with open('storage.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if l.strip() == '},':
        print(f"Line {i+1}: {l.rstrip()}")
