with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Check for any unexpected tokens or syntax issues
import re
# check for if (...) const or let
matches = re.findall(r'if\s*\([^)]*\)\s*(const|let)\s', text)
print("if (...) const/let matches:", matches)

# Check for unhandled promises or syntax around renderHomeAuctionHistory
matches2 = [m.start() for m in re.finditer(r'renderHomeAuctionHistory', text)]
print(f"renderHomeAuctionHistory matches: {len(matches2)}")
for idx in matches2:
    print(text[max(0, idx-50):min(len(text), idx+100)])
    print("-" * 30)
