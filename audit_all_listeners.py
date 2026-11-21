import re

with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Collect all getElementById cached in app.js
cached_ids = {}
for m in re.finditer(r'DOM\.([a-zA-Z0-9_]+)\s*=\s*document\.getElementById\([\'"]([^\'"]+)[\'"]\)', "".join(lines)):
    cached_ids[m.group(1)] = m.group(2)

print(f"Total cached IDs: {len(cached_ids)}")

# Scan every line with .addEventListener
unguarded_listeners = []
for i, line in enumerate(lines):
    if '.addEventListener(' in line:
        m = re.search(r'([a-zA-Z0-9_\.\[\]]+)\.addEventListener\(', line)
        if m:
            target = m.group(1)
            # check previous 3 lines for an if statement
            has_if = False
            for k in range(max(0, i-4), i):
                if 'if (' in lines[k] and (target in lines[k] or target.replace('DOM.', '') in lines[k]):
                    has_if = True
                    break
            # also check if the line itself has ?.addEventListener or if
            if '?' in target or 'if (' in line or 'if(' in line:
                has_if = True

            if not has_if:
                unguarded_listeners.append((i+1, target, line.strip()))

print(f"\nTotal unguarded addEventListener calls in entire app.js: {len(unguarded_listeners)}")
for line_no, target, text in unguarded_listeners:
    elem_id = cached_ids.get(target.replace('DOM.', ''), 'unknown')
    in_html = f'id="{elem_id}"' in html or f"id='{elem_id}'" in html
    print(f"Line {line_no}: target={target} (id='{elem_id}') in_html={in_html}")
