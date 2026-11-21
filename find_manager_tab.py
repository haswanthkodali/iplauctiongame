with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if any(k in l for k in ['managerPage', 'tab-manager', 'btnSaveManager', 'Manager & Team']):
        print(f"{i+1}: {l.strip()}")
