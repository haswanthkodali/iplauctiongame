import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('app.js', 'r', encoding='utf-8') as f:
    app_text = f.read()

html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html))

# Track DOM cache: DOM.foo = document.getElementById('bar')
dom_cache = {}
for m in re.finditer(r'DOM\.(\w+)\s*=\s*document\.getElementById\([\'"]([^\'"]+)[\'"]\)', app_text):
    prop, elem_id = m.groups()
    dom_cache[prop] = elem_id

# Find all occurrences of DOM.foo or document.getElementById('bar') followed by .method or .property
# We want to check if the block enclosing it has an `if` check.
lines = app_text.split('\n')

# Simple line-by-line check with bracket/indentation context
guarded_vars = set()
real_errors = []

for line_idx, line in enumerate(lines, start=1):
    stripped = line.strip()
    
    # Check if this line is an if statement
    m_if_dom = re.search(r'if\s*\(\s*DOM\.(\w+)\s*\)', stripped)
    if m_if_dom:
        guarded_vars.add(m_if_dom.group(1))
        
    m_if_get = re.search(r'if\s*\(\s*document\.getElementById\([\'"]([^\'"]+)[\'"]\)\s*\)', stripped)
    if m_if_get:
        guarded_vars.add(m_if_get.group(1))

    # Check for direct calls on document.getElementById('foo').bar
    for m in re.finditer(r'document\.getElementById\([\'"]([^\'"]+)[\'"]\)\.([\w$]+)', stripped):
        elem_id, method = m.groups()
        if elem_id not in html_ids:
            # Check if line has a ternary or null-safe check (e.g. document.getElementById('foo')?.bar)
            if '?.' not in stripped and not stripped.startswith(f"if (document.getElementById('{elem_id}')"):
                # Also check if it's assigned to a variable that was checked
                real_errors.append((line_idx, line.strip(), f"document.getElementById('{elem_id}') is NULL in index.html, calling .{method}"))

print(f"Total unguarded direct getElementById calls on missing IDs: {len(real_errors)}")
for idx, l, err in real_errors:
    print(f"Line {idx}: {err}\n  -> {l}\n")
