import urllib.request
import ssl
import concurrent.futures

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def check_id(pid):
    url = f'https://documents.iplt20.com/ipl/IPLHeadshot2024/{pid}.png'
    req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=3)
        if resp.status == 200:
            return (pid, int(resp.headers.get('Content-Length', 0)))
    except Exception:
        pass
    return None

# Check IDs 1 to 100
valid = []
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    results = executor.map(check_id, range(1, 100))
    for res in results:
        if res:
            valid.append(res)

print(f'Valid IDs in 1..100: {len(valid)}')
print(valid[:25])
