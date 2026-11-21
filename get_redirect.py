import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

# Let's search on duckduckgo or bing or fetch the redirected URL
url = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHNP9cGtV4iLP_yxmWoSBVTUe_oPpZj-s82grn5rvs5vm1BeSXf6fCe86fJ85SoroP8jfIIeKznX43Y5JAyrWYc3igbbjgOZrEzvTYJ16gzJQhKzpFFU_5h8c1mvR4OxdENT5f3QTLI3lCwpAgnbgzch4DEGO41535nGMRTYW_uaDzakdVpXAYUq2e90f1f'

req = urllib.request.Request(url, headers=headers)
try:
    resp = urllib.request.urlopen(req, context=ctx, timeout=10)
    print('Resolved URL:', resp.geturl())
except Exception as e:
    print('Redirect error:', e)
