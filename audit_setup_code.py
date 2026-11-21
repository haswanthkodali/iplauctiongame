import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('setup_exact.js', 'r', encoding='utf-8') as f:
    setup_code = f.read()

html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html))

# Track DOM cache: DOM.foo = document.getElementById('bar')
with open('app.js', 'r', encoding='utf-8') as f:
    app_text = f.read()

dom_cache = {}
for m in re.finditer(r'DOM\.(\w+)\s*=\s*document\.getElementById\([\'"]([^\'"]+)[\'"]\)', app_text):
    prop, elem_id = m.groups()
    dom_cache[prop] = elem_id

lines = setup_code.split('\n')
for idx, line in enumerate(lines, start=442):
    stripped = line.strip()
    
    # Check for DOM.<prop> access
    for m in re.finditer(r'DOM\.(\w+)', stripped):
        prop = m.group(1)
        elem_id = dom_cache.get(prop)
        if elem_id and elem_id not in html_ids:
            # Check if this access is guarded
            # e.g., if (DOM.prop)
            if not stripped.startswith(f"if (DOM.{prop}") and not stripped.startswith(f"if (!DOM.{prop}"):
                # Check lines before
                guarded = False
                for b in range(max(0, idx - 442 - 15), idx - 442):
                    if f"if (DOM.{prop})" in lines[b] or f"if (!DOM.{prop})" in lines[b]:
                        guarded = True
                        break
                if not guarded:
                    print(f"Line {idx}: DOM.{prop} (id='{elem_id}') accessed unguarded!\n  -> {stripped}")

    # Check for direct document.getElementById access
    for m in re.finditer(r'document\.getElementById\([\'"]([^\'"]+)[\'"]\)', stripped):
        elem_id = m.group(1)
        if elem_id not in html_ids:
            if not stripped.startswith(f"if (document.getElementById('{elem_id}')"):
                print(f"Line {idx}: direct getElementById('{elem_id}') accessed unguarded!\n  -> {stripped}")
