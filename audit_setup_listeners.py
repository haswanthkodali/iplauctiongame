with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = None
end = None
for i, l in enumerate(lines):
    if 'function setupEventListeners()' in l:
        start = i
    if start is not None and i > start and l.startswith('  }'):
        end = i
        break

print(f"setupEventListeners is from line {start+1} to {end+1}")
setup_lines = lines[start:end+1]

import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("\n--- Analysing listeners in setupEventListeners ---")
for idx, line in enumerate(setup_lines):
    if '.addEventListener(' in line:
        match = re.search(r'([a-zA-Z0-9_\.\[\]]+)\.addEventListener\(', line)
        if match:
            target = match.group(1)
            # check if it's DOM.xxx
            if target.startswith('DOM.'):
                prop = target.replace('DOM.', '')
                # check if ID is in HTML
                # Find ID from cacheDOMElements
                # We can search cache for DOM.{prop} = document.getElementById('...')
                cached_id_match = re.search(rf'DOM\.{prop}\s*=\s*document\.getElementById\([\'"]([^\'"]+)[\'"]\)', "".join(lines))
                if cached_id_match:
                    elem_id = cached_id_match.group(1)
                    in_html = f'id="{elem_id}"' in html or f"id='{elem_id}'" in html
                    if not in_html:
                        print(f"CRITICAL: Line {start+idx+1}: {target} (id='{elem_id}') is MISSING from HTML! Will crash if unguarded!")
                else:
                    print(f"WARNING: Line {start+idx+1}: {target} not found in cacheDOMElements!")
