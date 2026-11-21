import re

with open("cricinfo_full.html", "r", encoding="utf-8") as f:
    html = f.read()

# Pattern for cricketer links
# Format: href="/cricketers/{slug}-{id}"
matches = re.findall(r'href="/cricketers/([a-z0-9\-]+)-(\d+)"', html)
print(f"Total cricketer links in HTML: {len(matches)}")
unique_players = {}
for slug, pid in matches:
    name = " ".join([w.capitalize() for w in slug.split("-")])
    unique_players[name] = {"slug": slug, "id": pid}

print(f"Unique players: {len(unique_players)}")
for k, v in list(unique_players.items()):
    print(f"  {k} (ID: {v['id']}, slug: {v['slug']})")
