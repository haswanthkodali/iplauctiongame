import re

with open("cricinfo_full.html", "r", encoding="utf-8") as f:
    html = f.read()

scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
print(f"Scripts count: {len(scripts)}")
for s in scripts:
    print(" ", s)
