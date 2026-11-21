import urllib.request
import json
import urllib.parse
import re
from concurrent.futures import ThreadPoolExecutor

with open('C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract names from PLAYERS
blocks = re.findall(r'id:\s*(\d+),\s*name:\s*"([^"]+)",\s*country:\s*"([^"]+)",\s*role:\s*"([^"]+)"', text)
print(f"Matched player blocks: {len(blocks)}")

# Load already verified valid images
with open('C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/valid_images.json', 'r', encoding='utf-8') as f:
    valid_map = json.load(f)

print(f"Already valid from CDNs: {len(valid_map)}")

def fetch_wiki_image(item):
    pid, name, country, role = item
    if name in valid_map:
        return (name, valid_map[name], "already_valid")
    
    # Try different search variants on Wikipedia
    queries = [
        name.replace(" ", "_"),
        f"{name.replace(' ', '_')}_(cricketer)",
        f"{name.replace(' ', '_')}_(Indian_cricketer)",
        f"{name.replace(' ', '_')}_(cricketer,_born_2000)",
        f"{name.replace(' ', '_')}_(cricketer,_born_1991)",
        f"{name.replace(' ', '_')}_(cricketer,_born_1994)"
    ]
    
    for q in queries:
        try:
            url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(q)}&prop=pageimages&format=json&pithumbsize=320"
            req = urllib.request.Request(url, headers={'User-Agent': 'IPLAuctionApp/2.0 (contact: cricket@ipl.game)'})
            with urllib.request.urlopen(req, timeout=4) as resp:
                data = json.loads(resp.read())
                pages = data.get('query', {}).get('pages', {})
                for p_id, p_info in pages.items():
                    if p_id != '-1' and 'thumbnail' in p_info:
                        thumb = p_info['thumbnail']['source']
                        return (name, thumb, "wikipedia")
        except Exception:
            continue
            
    return (name, None, "not_found")

with ThreadPoolExecutor(max_workers=20) as executor:
    results = list(executor.map(fetch_wiki_image, blocks))

resolved = {}
missing = []

for name, url, source in results:
    if url:
        resolved[name] = url
    else:
        missing.append(name)

print(f"\nRESULTS:")
print(f"Total resolved: {len(resolved)} / {len(blocks)}")
print(f"Total missing: {len(missing)}")

with open('C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/resolved_images.json', 'w', encoding='utf-8') as f:
    json.dump(resolved, f, indent=2)

with open('C:/Users/haswa/.gemini/antigravity/scratch/ipl-auction-game/missing_after_wiki.json', 'w', encoding='utf-8') as f:
    json.dump(missing, f, indent=2)

print("\nSaved resolved_images.json and missing_after_wiki.json")
