import json

# Load script_32 data
with open('script_32.txt', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Get the players list - only 20 on main page
players = data['props']['appPageProps']['data']['content']['players']
print(f'Total players in main page script_32: {len(players)}')

CDN_PREFIX = "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320"

# Extract all player info with image URLs
result = {}
for p in players:
    pl = p.get('player', {})
    name = pl.get('longName', '')
    img = pl.get('imageUrl', '')
    if name and img:
        full_url = CDN_PREFIX + img
        result[name] = full_url
        print(f'  {name}: {full_url}')

print(f'\nTotal with images: {len(result)}')

# Also check other data paths in the JSON
def find_all_image_urls(obj, path='', depth=0):
    if depth > 10:
        return
    if isinstance(obj, dict):
        if 'longName' in obj and 'imageUrl' in obj:
            name = obj['longName']
            img = obj['imageUrl']
            if name and img:
                full_url = CDN_PREFIX + img
                if name not in result:
                    result[name] = full_url
                    print(f'  FOUND: {name}: {full_url}')
        for k, v in obj.items():
            if isinstance(v, (dict, list)):
                find_all_image_urls(v, f'{path}.{k}', depth+1)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            if isinstance(item, (dict, list)):
                find_all_image_urls(item, f'{path}[{i}]', depth+1)

print('\nSearching entire JSON for more players...')
find_all_image_urls(data)
print(f'\nTotal unique players with images: {len(result)}')

# Save to file
with open('cricinfo_verified_images.json', 'w') as f:
    json.dump(result, f, indent=2)

print('\nSaved to cricinfo_verified_images.json')
