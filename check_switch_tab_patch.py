with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('originalSwitchTab')
if idx != -1:
    print(text[max(0, idx-300):min(len(text), idx+500)])
else:
    print("originalSwitchTab not found")
