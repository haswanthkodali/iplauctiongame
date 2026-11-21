with open("C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/iplt20_players.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
for s in scripts:
    print(s)
