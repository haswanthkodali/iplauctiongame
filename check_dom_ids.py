import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Extract all getElementById in app.js
by_ids = set(re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", app_js))
print(f"Total getElementById in app.js: {len(by_ids)}")

# Extract all IDs in index.html
html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html))
print(f"Total IDs in index.html: {len(html_ids)}")

missing = [i for i in by_ids if i not in html_ids]
print(f"IDs in app.js missing in index.html ({len(missing)}):")
for m in sorted(missing):
    print(f"  - {m}")
