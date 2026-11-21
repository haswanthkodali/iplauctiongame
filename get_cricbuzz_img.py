from curl_cffi import requests
import re

url = 'https://www.cricbuzz.com/profiles/10713/daryl-mitchell'
r = requests.get(url, impersonate='chrome124', timeout=12)
print('Status:', r.status_code)
imgs = re.findall(r'https?://[^\s"\'<>]+(?:jpg|png|webp)', r.text)
for img in set(imgs):
    if 'static.cricbuzz.com' in img:
        print('Cricbuzz img:', img)
