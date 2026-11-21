with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

iife_end = text.find('})();')
print("iife_end position:", iife_end)

outer_code = text[iife_end+5:]
print("Length of outer code:", len(outer_code))

# Check for variables used in outer code that were defined in IIFE
iife_code = text[:iife_end]

outer_lines = outer_code.split('\n')
print("First 40 lines of outer code:")
for idx, l in enumerate(outer_lines[:40]):
    print(f"{idx+1}: {l}")
