import json
import re

with open("C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/script_32.txt", "r", encoding="utf-8") as f:
    text = f.read()

data = json.loads(text)
print("Data parsed successfully! Top keys:", list(data.keys()))

# Recursively search for all player objects with headshot / image / name
players_found = {}

def walk(obj):
    if isinstance(obj, dict):
        # Check if this dict represents a player
        name = obj.get("name") or obj.get("longName") or obj.get("slug")
        # Check image in obj
        headshot = obj.get("headshot") or obj.get("image") or obj.get("playerImage") or obj.get("imageUrl")
        if name and headshot:
            if isinstance(headshot, dict):
                url = headshot.get("url") or headshot.get("imageUrl")
            elif isinstance(headshot, str):
                url = headshot
            else:
                url = None
            if url:
                players_found[str(name)] = url
        
        for k, v in obj.items():
            walk(v)
    elif isinstance(obj, list):
        for item in obj:
            walk(item)

walk(data)

print(f"Total players found with direct image URLs: {len(players_found)}")
for k, v in list(players_found.items())[:15]:
    print(f"  {k}: {v}")

# Save all
with open("cricinfo_script32_players.json", "w", encoding="utf-8") as out:
    json.dump(players_found, out, indent=2)
print("Saved to cricinfo_script32_players.json")
