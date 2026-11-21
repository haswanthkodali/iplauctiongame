import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('app.js', 'r', encoding='utf-8') as f:
    app_lines = f.readlines()

html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html))

# Track DOM cache assignments: DOM.foo = document.getElementById('bar')
dom_cache = {}
for i, line in enumerate(app_lines):
    m = re.search(r'DOM\.(\w+)\s*=\s*document\.getElementById\([\'"]([^\'"]+)[\'"]\)', line)
    if m:
        prop, elem_id = m.groups()
        dom_cache[prop] = elem_id

print(f"Total DOM cache mappings: {len(dom_cache)}")

# Now find all unsafe operations on missing elements or DOM properties
unsafe_operations = []

for line_num, line in enumerate(app_lines, start=1):
    # Pattern 1: document.getElementById('foo').something without check
    m1 = re.search(r'document\.getElementById\([\'"]([^\'"]+)[\'"]\)\.(\w+)', line)
    if m1:
        elem_id, prop = m1.groups()
        if elem_id not in html_ids:
            # Check if there is an 'if (document.getElementById...' guard on the same line
            if not line.strip().startswith(f"if (document.getElementById('{elem_id}')") and not line.strip().startswith(f'if (document.getElementById("{elem_id}")'):
                unsafe_operations.append((line_num, line.strip(), f"getElementById('{elem_id}') is null, accessing .{prop}"))

    # Pattern 2: DOM.foo.something without guard
    m2 = re.search(r'DOM\.(\w+)\.(\w+)', line)
    if m2:
        prop_name, sub_prop = m2.groups()
        elem_id = dom_cache.get(prop_name)
        if elem_id and elem_id not in html_ids:
            # Check if line is guarded by if (DOM.prop_name)
            if not line.strip().startswith(f"if (DOM.{prop_name})") and not line.strip().startswith(f"if (!DOM.{prop_name})"):
                unsafe_operations.append((line_num, line.strip(), f"DOM.{prop_name} (id='{elem_id}') is null, accessing .{sub_prop}"))

print(f"\nTotal potential unsafe operations: {len(unsafe_operations)}")
for num, line, reason in unsafe_operations[:40]:
    print(f"Line {num}: {reason}\n  -> {line}\n")
