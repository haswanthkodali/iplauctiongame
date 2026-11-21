import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF_eUzKkEnOV8ZUNENo99oM5X62qGEBV7V8W7mfASSU7_CDLIJs84BgiRwjXLt4ULj3lNViHZks1qFHGWTvwHarjMThnqUQ1PeUmUghc9FiFWH1QFFgLlH-329DU17ByzvVwzz12KvoCbXmP4pfJiFgDB-rNIexoFH3T9X9bGi5Nuq1V0oKbZcd5sAtOFA='
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req, context=ctx, timeout=8)
    print('URL:', resp.geturl())
except Exception as e:
    print(e)
