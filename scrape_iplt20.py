import urllib.request
import re

url = 'https://www.iplt20.com/teams/chennai-super-kings/squad-details/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
    # Search for player cards with names and images
    # e.g., <img ... src="...documents.iplt20.com..." ... alt="Player Name"
    matches = re.findall(r'<img[^>]+src=["\']([^"\']*IPLHeadshot[^"\']*)["\'][^>]*alt=["\']([^"\']*)["\']', html)
    print('Pattern 1 matches:', len(matches))
    for m in matches[:10]:
        print(m)
    if not matches:
        matches2 = re.findall(r'alt=["\']([^"\']*)["\'][^>]*src=["\']([^"\']*IPLHeadshot[^"\']*)["\']', html)
        print('Pattern 2 matches:', len(matches2))
        for m in matches2[:10]:
            print(m)
    # Print all IPLHeadshot URLs
    all_headshots = re.findall(r'https?://documents\.iplt20\.com[^\s"\'<>]*IPLHeadshot[^\s"\'<>]*', html)
    print('All headshots count:', len(all_headshots))
    for h in all_headshots[:10]:
        print(h)
except Exception as e:
    print('Error:', e)
