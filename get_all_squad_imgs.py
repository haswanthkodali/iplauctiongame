from curl_cffi import requests
import re
import urllib.parse
import json

teams = [
    "chennai-super-kings",
    "mumbai-indians",
    "royal-challengers-bengaluru",
    "kolkata-knight-riders",
    "delhi-capitals",
    "punjab-kings",
    "rajasthan-royals",
    "sunrisers-hyderabad",
    "gujarat-titans",
    "lucknow-super-giants"
]

all_players = {}

for t in teams:
    url = f"https://www.iplt20.com/teams/{t}/squad"
    r = requests.get(url, impersonate="chrome124", timeout=15)
    html = r.text
    
    # Search for all occurrences of player image URLs
    # Pattern: /api/team-assets?pathname=player%2F... or decoded /api/team-assets?pathname=player/...
    # And surrounding text for player name
    cards = re.findall(r'<div[^>]*class="[^"]*squad-player[^"]*"[^>]*>.*?</div>\s*</div>', html, re.DOTALL)
    # Also search for player name divs followed or preceded by img
    matches = re.findall(r'alt="([^"]+)"[^>]*src="([^"]*player[^"]*)"', html)
    matches += [(alt, src) for src, alt in re.findall(r'src="([^"]*player[^"]*)"[^>]*alt="([^"]+)"', html)]
    
    for name, src in matches:
        name = name.strip()
        if len(name) > 3:
            clean_url = "https://www.iplt20.com" + src.replace("&amp;", "&")
            all_players[name] = clean_url
            
print(f"Total player cards matched: {len(all_players)}")
for k, v in list(all_players.items())[:15]:
    print(f"  {k}: {v[:90]}")
