import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all ids in index.html
all_ids = sorted(re.findall(r'id=["\']([^"\']+)["\']', html))
print(f"Total IDs in index.html: {len(all_ids)}")

print("\nIDs matching 'room' or 'Room':")
for i in all_ids:
    if 'room' in i.lower():
        print(" ", i)

print("\nIDs matching 'arena' or 'Arena':")
for i in all_ids:
    if 'arena' in i.lower():
        print(" ", i)

print("\nIDs matching 'tab' or 'Tab':")
for i in all_ids:
    if 'tab' in i.lower():
        print(" ", i)

print("\nIDs matching 'modal' or 'Modal':")
for i in all_ids:
    if 'modal' in i.lower():
        print(" ", i)
