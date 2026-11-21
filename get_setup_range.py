with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = None
end = None
brace_depth = 0

for i, line in enumerate(lines):
    if 'function setupEventListeners()' in line:
        start = i
        brace_depth = 0
    if start is not None:
        brace_depth += line.count('{') - line.count('}')
        if brace_depth == 0 and i > start:
            end = i
            break

print(f"setupEventListeners is from line {start+1} to line {end+1} ({end - start} lines)")
with open('setup_exact.js', 'w', encoding='utf-8') as f:
    f.writelines(lines[start:end+1])
