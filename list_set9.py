import re

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\data.js', 'r', encoding='utf-8') as f:
    code = f.read()

pattern = re.compile(r'\{\s*id:\s*(\d+|"[^"]+"),\s*name:\s*"([^"]+)",\s*country:\s*"([^"]+)",\s*role:\s*"([^"]+)",\s*basePrice:\s*([\d\.]+),\s*rating:\s*(\d+).*?set:\s*(\d+)', re.DOTALL)
players = pattern.findall(code)

print("Set 9 players:")
for p in players:
    if int(p[6]) == 9:
        print(f"  {p[1]} (rating {p[5]}, current basePrice: {p[4]} Cr)")
