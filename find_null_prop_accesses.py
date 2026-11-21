import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('app.js', 'r', encoding='utf-8') as f:
    app_text = f.read()

html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html))

# Map DOM.<prop> -> id
dom_cache = {}
for m in re.finditer(r'DOM\.(\w+)\s*=\s*document\.getElementById\([\'"]([^\'"]+)[\'"]\)', app_text):
    prop, elem_id = m.groups()
    dom_cache[prop] = elem_id

null_props = {prop: elem_id for prop, elem_id in dom_cache.items() if elem_id not in html_ids}
print(f"Total DOM properties that are NULL (ID missing in HTML): {len(null_props)}")

# Now let's trace every function in app.js and check where these null props are accessed
lines = app_text.split('\n')
unsafe_lines = []

for line_idx, line in enumerate(lines, start=1):
    stripped = line.strip()
    for prop, elem_id in null_props.items():
        # Match DOM.prop.something
        pattern = rf'\bDOM\.{prop}\.([a-zA-Z0-9_$]+)'
        m = re.search(pattern, stripped)
        if m:
            sub = m.group(1)
            # Check if this line has a guard: if (DOM.prop) or ternary DOM.prop ? DOM.prop... : ...
            if f"if (DOM.{prop})" in stripped or f"if (!DOM.{prop})" in stripped:
                continue
            if f"DOM.{prop} ?" in stripped or f"DOM.{prop}?" in stripped or f"DOM.{prop} &&" in stripped:
                continue
            unsafe_lines.append((line_idx, stripped, prop, elem_id, sub))

print(f"\nUnsafe lines accessing null DOM property ({len(unsafe_lines)}):")
for idx, line, prop, elem_id, sub in unsafe_lines:
    print(f"Line {idx}: DOM.{prop} (id='{elem_id}') is accessed with .{sub}")
    print(f"  -> {line}\n")
