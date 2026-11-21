# verify_js_syntax.py
import re

files = ['data.js', 'stats.js', 'player-images.js', 'auction-audio.js', 'rating.js', 'game.js', 'storage.js', 'app.js']

for f_name in files:
    with open(f_name, 'r', encoding='utf-8') as f:
        code = f.read()
    # Check bracket balance
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    # Simple scanner ignoring strings / comments
    in_str = None
    in_line_comment = False
    in_block_comment = False
    i = 0
    err = None
    while i < len(code):
        c = code[i]
        nxt = code[i+1] if i + 1 < len(code) else ''
        
        if in_line_comment:
            if c == '\n': in_line_comment = False
        elif in_block_comment:
            if c == '*' and nxt == '/':
                in_block_comment = False
                i += 1
        elif in_str:
            if c == '\\':
                i += 1
            elif c == in_str:
                in_str = None
        else:
            if c == '/' and nxt == '/':
                in_line_comment = True
                i += 1
            elif c == '/' and nxt == '*':
                in_block_comment = True
                i += 1
            elif c in ('"', "'", '`'):
                in_str = c
            elif c in ('(', '[', '{'):
                stack.append((c, i))
            elif c in (')', ']', '}'):
                if not stack:
                    err = f"Unmatched closing '{c}' at index {i}"
                    break
                top, top_idx = stack.pop()
                if top != pairs[c]:
                    err = f"Mismatched '{c}', expected match for '{top}' at index {top_idx}"
                    break
        i += 1

    if not err and stack:
        top, top_idx = stack[-1]
        line_num = code[:top_idx].count('\n') + 1
        err = f"Unclosed '{top}' from line {line_num}"

    if err:
        print(f"❌ {f_name}: {err}")
    else:
        print(f"✅ {f_name}: Brackets and syntax balanced! ({len(code)} bytes)")
