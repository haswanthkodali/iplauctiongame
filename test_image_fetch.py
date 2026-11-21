import urllib.request

urls = [
    ("Virat Kohli iplt20", "https://documents.iplt20.com/ipl/IPLHeadshot2024/2.png"),
    ("Devon Conway cricinfo", "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321539.jpg"),
    ("Hardik Pandya iplt20", "https://documents.iplt20.com/ipl/IPLHeadshot2024/54.png"),
]

for label, url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            print(f"✅ {label}: Status {resp.status}, Content-Type: {resp.headers.get('Content-Type')}, Length: {len(resp.read())}")
    except Exception as e:
        print(f"❌ {label}: Failed with {e}")
