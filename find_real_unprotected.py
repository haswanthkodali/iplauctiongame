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

lines = app_text.split('\n')
# We track the block stack to see what `if (DOM.foo)` guards are currently active!
stack = []
unprotected_errors = []

for line_idx, line in enumerate(lines, start=1):
    stripped = line.strip()
    
    # Check for opening braces
    # Simplified tracking of if (DOM.prop)
    m_if = re.search(r'if\s*\(\s*DOM\.(\w+)', stripped)
    if m_if:
        guarded_prop = m_if.group(1)
    else:
        guarded_prop = None

    # Check for accesses to null props:
    for prop, elem_id in null_props.items():
        m_access = re.search(rf'\bDOM\.{prop}\.([a-zA-Z0-9_$]+)', stripped)
        if m_access:
            sub = m_access.group(1)
            # Check if this line itself guards it:
            if f"if (DOM.{prop}" in stripped or f"if (!DOM.{prop}" in stripped or f"DOM.{prop} ?" in stripped or f"DOM.{prop}?" in stripped or f"DOM.{prop} &&" in stripped:
                continue
            # Check if previous lines in the immediate scope had if (DOM.prop):
            # Look backwards up to 15 lines to see if there's an if (DOM.prop)
            found_guard = False
            for back_idx in range(max(0, line_idx - 16), line_idx - 1):
                prev_line = lines[back_idx].strip()
                if f"if (DOM.{prop})" in prev_line or f"if (!DOM.{prop})" in prev_line or f"if (DOM.{prop} " in prev_line:
                    found_guard = True
                    break
            if not found_guard:
                unprotected_errors.append((line_idx, stripped, prop, elem_id, sub))

print(f"Truly unprotected accesses to null DOM elements: {len(unprotected_errors)}")
for idx, l, p, eid, sub in unprotected_errors:
    print(f"Line {idx} [id='{eid}']: DOM.{p}.{sub}")
    print(f"  -> {l}\n")
