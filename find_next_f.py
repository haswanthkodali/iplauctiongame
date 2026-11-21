import re
import json

with open("C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/cricinfo_full.html", "r", encoding="utf-8") as f:
    html = f.read()

# Search for inline scripts with push
pushes = re.findall(r'self\.__next_f\.push\(\[1,\s*"([^"]+)"\]\)', html)
print(f"self.__next_f.push matches: {len(pushes)}")

# Also search for any large JSON strings
large_scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print(f"Total script tags: {len(large_scripts)}")
for i, s in enumerate(large_scripts):
    if len(s) > 1000:
        print(f"Script {i}: length {len(s)}")
        # Check if contains player names
        if "Kohli" in s or "Hazlewood" in s or "headshot" in s or "hscicdn" in s:
            print(f"   --> Contains player info! Sample: {s[:200]}...")
            with open(f"script_{i}.txt", "w", encoding="utf-8") as out:
                out.write(s)
            print(f"   Saved to script_{i}.txt")
