with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract setupEventListeners function
pos = text.find('function setupEventListeners()')
end_pos = text.find('// =========================================================================\n  // TAB NAVIGATION', pos)

setup_code = text[pos:end_pos]
print(f"Length of setupEventListeners: {len(setup_code)} chars")

with open('setup_listeners_code.js', 'w', encoding='utf-8') as f:
    f.write(setup_code)
print("Saved setup_listeners_code.js")
