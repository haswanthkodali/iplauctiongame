import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Find all DOM.xxx
dom_props = set(re.findall(r'DOM\.([a-zA-Z0-9_]+)', js))

# Find cacheDOMElements assignments: DOM.xxx = document.getElementById('yyy')
matches = re.findall(r'DOM\.([a-zA-Z0-9_]+)\s*=\s*document\.getElementById\([\'"]([^\'"]+)[\'"]\)', js)
dom_to_id = {k: v for k, v in matches}

print(f"Total DOM properties found in app.js: {len(dom_props)}")
print(f"Total getElementById mappings cached: {len(dom_to_id)}")

missing_in_html = []
for prop, id_name in dom_to_id.items():
    pattern = rf'id=[\'"]{re.escape(id_name)}[\'"]'
    if not re.search(pattern, html):
        missing_in_html.append((prop, id_name))

print(f"Missing in HTML ({len(missing_in_html)}):")
for prop, id_name in missing_in_html:
    print(f"  DOM.{prop} -> id=\"{id_name}\"")
