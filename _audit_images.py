import re
from collections import defaultdict

text = open("data.js", encoding="utf-8").read()
names = re.findall(r"name:\s*'([^']+)'", text)
if len(names) < 20:
    names = re.findall(r'name:\s*"([^"]+)"', text)
print("data names", len(names), "unique", len(set(names)))

imgs = open("player-images.js", encoding="utf-8").read()
pairs = re.findall(r'"([^"]+)":\s*"(https:[^"]+)"', imgs)
print("image entries", len(pairs))
imap = dict(pairs)
byurl = defaultdict(list)
for n, u in pairs:
    byurl[u].append(n)
dups = [(u, ns) for u, ns in byurl.items() if len(ns) > 1]
print("duplicate urls", len(dups))
for u, ns in dups:
    print("---", ns)

missing = sorted(n for n in set(names) if n not in imap)
print("missing images", len(missing))
for n in missing:
    print("MISS", n)
