import re

def check_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    print(f"Checking {filename} ({len(lines)} lines)...")
    
    # 1. Check for single statement if/for/while with let/const
    bad_const = re.compile(r'^\s*(?:if|else|for|while)\s*\(.*?\)\s*(?:const|let)\s+')
    for i, line in enumerate(lines):
        if bad_const.search(line):
            print(f"  [ERROR] Lexical declaration in single-statement at line {i+1}: {line.strip()}")
            
    # 2. Check for class methods followed by comma
    # Look for class definition and tracking brace depth inside class
    in_class = False
    class_brace_depth = 0
    for i, line in enumerate(lines):
        if re.search(r'\bclass\s+\w+', line):
            in_class = True
        if in_class:
            class_brace_depth += line.count('{') - line.count('}')
            if class_brace_depth == 1:
                # Top level of class body. A line ending with '},' is invalid JS!
                if re.search(r'\}\s*,', line):
                    print(f"  [ERROR] Trailing comma after class method at line {i+1}: {line.strip()}")
            elif class_brace_depth <= 0:
                in_class = False

    # 3. Check for any unexpected tokens or unclosed template literals
    # We can check backtick count parity per logical token
    full_text = "".join(lines)
    # Check for unescaped template literals
    # Find all backticks not preceded by backslash
    backticks = re.findall(r'(?<!\\)`', full_text)
    if len(backticks) % 2 != 0:
        print(f"  [ERROR] Odd number of backticks ({len(backticks)}) in {filename}!")
        
    print(f"Done checking {filename}.\n")

for f in ['storage.js', 'game.js', 'app.js', 'stats.js', 'player-images.js', 'auction-audio.js', 'rating.js']:
    check_file(f)
