import re, glob, os

files = glob.glob(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\*.js')
for filepath in files:
    fname = os.path.basename(filepath)
    if fname.endswith(('.bak', '.bak2', '.bak3')) or fname.startswith(('setup', 'test', 'audit')):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    scope_stack = []
    current_scope = {'name': 'global', 'vars': {}, 'line': 1}
    scope_stack.append(current_scope)
    duplicates = []

    for line_num, line in enumerate(lines, 1):
        cleaned = re.sub(r'//.*', '', line)
        in_str = False
        str_char = None
        i = 0
        while i < len(cleaned):
            c = cleaned[i]
            if in_str:
                if c == '\\':
                    i += 2
                    continue
                elif c == str_char:
                    in_str = False
            else:
                if c in ('"', "'", '`'):
                    in_str = True
                    str_char = c
                elif c == '{':
                    new_scope = {'name': f'scope_{line_num}', 'vars': {}, 'line': line_num}
                    current_scope = new_scope
                    scope_stack.append(current_scope)
                elif c == '}':
                    if len(scope_stack) > 1:
                        scope_stack.pop()
                        current_scope = scope_stack[-1]
            i += 1

        for m in re.finditer(r'\b(const|let)\s+([a-zA-Z0-9_$]+)\b', cleaned):
            var_name = m.group(2)
            if var_name in current_scope['vars']:
                prev_line = current_scope['vars'][var_name]
                duplicates.append((line_num, var_name, prev_line))
            else:
                current_scope['vars'][var_name] = line_num

    if duplicates:
        print(f'{fname}: {len(duplicates)} duplicates:')
        for line_num, var_name, prev_line in duplicates:
            print(f'  Line {line_num}: {var_name} (first at {prev_line})')
    else:
        print(f'{fname}: OK')
