import urllib.request
import json

def test_url(name, url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            print(f"✅ {name}: {resp.status}, length: {len(resp.read())}")
    except Exception as e:
        print(f"❌ {name}: {e}")

test_url("Wikipedia API", "https://en.wikipedia.org/w/api.php?action=query&titles=Bhanuka_Rajapaksa&prop=pageimages&format=json&pithumbsize=300")
test_url("IPLT20 Headshot 2", "https://documents.iplt20.com/ipl/IPLHeadshot2024/2.png")
test_url("IPLT20 Headshot 1082", "https://documents.iplt20.com/ipl/IPLHeadshot2024/1082.png")
test_url("IPLT20 Headshot 44", "https://documents.iplt20.com/ipl/IPLHeadshot2024/44.png")
test_url("IPLT20 Headshot 1088", "https://documents.iplt20.com/ipl/IPLHeadshot2024/1088.png")
test_url("IPLT20 Headshot 1255", "https://documents.iplt20.com/ipl/IPLHeadshot2025/1255.png")
