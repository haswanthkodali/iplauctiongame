import json

with open("cricinfo_next_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Inspect keys
print("Top keys:", list(data.keys()))
props = data.get("props", {}).get("pageProps", {})
print("pageProps keys:", list(props.keys()))

# Look for auction / players data in pageProps
def find_players(obj, path=""):
    if isinstance(obj, dict):
        if "playerName" in obj or "player" in obj or "name" in obj and ("image" in obj or "imageUrl" in obj or "slug" in obj):
            print(f"Candidate player object at {path}: {list(obj.keys())[:10]}")
        for k, v in obj.items():
            find_players(v, f"{path}.{k}")
    elif isinstance(obj, list):
        if len(obj) > 0 and isinstance(obj[0], dict) and ("name" in obj[0] or "playerName" in obj[0]):
            print(f"List of player-like dicts at {path} (length {len(obj)}): sample keys {list(obj[0].keys())}")
        for i, item in enumerate(obj[:3]): # only check first few
            find_players(item, f"{path}[{i}]")

find_players(props, "props.pageProps")
