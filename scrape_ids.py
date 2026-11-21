import urllib.request
import re
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# Let's test a search or player list on IPL website
url = 'https://www.iplt20.com/players/men'
req = urllib.request.Request(url, headers=headers)
try:
    html = urllib.request.urlopen(req, context=ctx, timeout=10).read().decode('utf-8', errors='ignore')
    # look for player links or images
    links = re.findall(r'/players/(\d+)/([a-zA-Z0-9-]+)', html)
    print(f'Found {len(links)} player links on players/men:')
    for pid, name in links[:15]:
        print(f'{name} -> ID {pid}')
except Exception as e:
    print('Error on players/men:', e)
