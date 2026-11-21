import re
for f_name in ['app.js', 'game.js']:
    with open(f_name, 'r', encoding='utf-8') as f:
        text = f.read()
    keys = re.findall(r'localStorage\.(?:getItem|setItem)\([\'"]([^\'"]+)[\'"]', text)
    print(f_name, sorted(set(keys)))
