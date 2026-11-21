import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
url = 'https://www.iplt20.com/players/b2e76c0b-166c-4d7c-97df-a1503726e55c/ravindra-jadeja'
req = urllib.request.Request(url, headers=headers)
try:
    html = urllib.request.urlopen(req, context=ctx, timeout=10).read().decode('utf-8', errors='ignore')
    pngs = re.findall(r'https://[^\s"\'<>]+\.png', html)
    jpgs = re.findall(r'https://[^\s"\'<>]+\.jpg', html)
    print('PNGs found:')
    for p in set(pngs):
        if 'headshot' in p.lower() or 'player' in p.lower() or 'ipl' in p.lower():
            print(' ', p)
    print('JPGs found:')
    for j in set(jpgs):
        if 'headshot' in j.lower() or 'player' in j.lower() or 'ipl' in j.lower():
            print(' ', j)
except Exception as e:
    print('Error:', e)
