import json, os, re

targets = [
    "Daniel Sams", "Shaik Rasheed", "Manoj Bhandage", "Sanvir Singh",
    "Shashank Singh", "Vaibhav Suryavanshi", "Vansh Bedi", "Rasikh Salam",
    "Alzarri Joseph", "Ashutosh Sharma"
]
files = [
    "cricinfo_all_player_images.json",
    "cricinfo_verified_images.json",
    "cricinfo_direct_working.json",
    "final_master_player_images.json",
    "final_player_images.json",
    "final_verified_working_images.json",
    "extra_found.json",
    "extra_11_found.json",
    "resolved_images.json",
    "valid_images.json",
    "cricinfo_script32_players.json",
    "sold_players_data.json",
    "unsold_players_data.json",
    "all_players_fresh.json",
    "iplt20_official_players.json",
]

def walk(obj, path=""):
    if isinstance(obj, dict):
        name = obj.get("name") or obj.get("playerName") or obj.get("fullName")
        img = obj.get("image") or obj.get("img") or obj.get("headshot") or obj.get("imageUrl") or obj.get("photo")
        if name and any(t.lower() in str(name).lower() for t in targets):
            print("OBJ", name, img, path)
        for k, v in obj.items():
            if isinstance(k, str) and any(t.lower() == k.lower() or t.lower() in k.lower() for t in targets):
                if isinstance(v, str) and v.startswith("http"):
                    print("KEY", k, v)
                else:
                    print("KEYNEST", k, type(v).__name__, str(v)[:180])
            if isinstance(v, (dict, list)):
                walk(v, path + "/" + str(k)[:40])
    elif isinstance(obj, list):
        for i, v in enumerate(obj[:]):
            if isinstance(v, (dict, list)):
                walk(v, path)

for f in files:
    if not os.path.exists(f):
        continue
    try:
        data = json.load(open(f, encoding="utf-8"))
    except Exception as e:
        print("FAIL", f, e)
        continue
    print("====", f, type(data).__name__)
    walk(data)
