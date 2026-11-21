import re
import urllib.request
import ssl
import concurrent.futures

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

with open('player-images.js', 'r', encoding='utf-8') as f:
    content = f.read()

block = content.split('const PLAYER_IMAGES = {')[1].split('};')[0]
pairs = re.findall(r'\"([^\"]+)\"\s*:\s*\"([^\"]+)\"', block)

def check_player(item):
    name, url = item
    req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=3)
        if resp.status == 200:
            return (name, url, int(resp.headers.get('Content-Length', 0)))
    except Exception:
        pass
    return None

with concurrent.futures.ThreadPoolExecutor(max_workers=25) as executor:
    results = list(executor.map(check_player, pairs))

working = [r for r in results if r]
print(f'Working count: {len(working)}')
for w in working:
    print(f'  {w[0]}: {w[1]} ({w[2]} bytes)')
