import time
import re

ts = int(time.time())
with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

h = re.sub(r'src="storage\.js(\?v=\d+)?"', f'src="storage.js?v={ts}"', h)
h = re.sub(r'src="app\.js(\?v=\d+)?"', f'src="app.js?v={ts}"', h)
h = re.sub(r'src="player-images\.js(\?v=\d+)?"', f'src="player-images.js?v={ts}"', h)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h)

print(f"Bumped index.html cache buster to v={ts}")
