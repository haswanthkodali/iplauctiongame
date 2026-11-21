import urllib.request
import ssl
import json
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://www.iplt20.com/players/b2e76c0b-166c-4d7c-97df-a1503726e55c/ravindra-jadeja'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req, context=ctx, timeout=10).read().decode('utf-8', errors='ignore')
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
    if match:
        data = json.loads(match.group(1))
        # Search for images or player info in data
        data_str = json.dumps(data)
        imgs = re.findall(r'\"([^\"]*(?:image|photo|headshot|assets)[^\"]*)\"', data_str, re.I)
        print('Found images in NEXT_DATA:', imgs[:10])
        # Find player info
        props = data.get('props', {}).get('pageProps', {})
        print('pageProps keys:', list(props.keys()))
        if 'player' in props:
            print('Player data:', json.dumps(props['player'])[:400])
        elif 'playerData' in props:
            print('playerData:', json.dumps(props['playerData'])[:400])
        else:
            # print snippet of data_str
            print('data snippet:', data_str[:500])
    else:
        print('No NEXT_DATA found')
except Exception as e:
    print('Error:', e)
