import re
import json

with open("cricinfo_full.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's find player names in HTML like "Virat Kohli", "Cameron Green", etc.
for name in ["Virat Kohli", "Josh Hazlewood", "Cameron Green", "Matheesha Pathirana", "Rishabh Pant"]:
    idx = html.find(name)
    print(f"'{name}' at index: {idx}")
    if idx != -1:
        snippet = html[max(0, idx-200):min(len(html), idx+300)]
        print("SNIPPET:", snippet)
        print("="*60)
