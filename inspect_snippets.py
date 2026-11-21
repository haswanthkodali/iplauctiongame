import re

with open("cricinfo_full.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find all blocks containing cricketers links
matches = re.finditer(r'href="(/cricketers/[^"]+)"', html)
found = set()
for m in matches:
    link = m.group(1)
    if link not in found:
        found.add(link)
        # Extract surrounding 500 characters
        start = max(0, m.start() - 200)
        end = min(len(html), m.end() + 300)
        snippet = html[start:end]
        print("LINK:", link)
        print("SNIPPET:", snippet)
        print("-" * 60)
        if len(found) >= 5:
            break
