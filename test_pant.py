import urllib.request

test_urls = [
    # Rishabh Pant tests
    "https://documents.iplt20.com/ipl/IPLHeadshot2024/167.png",
    "https://documents.iplt20.com/ipl/IPLHeadshot2023/167.png",
    "https://documents.iplt20.com/ipl/IPLHeadshot2024/2972.png",
    "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321538.jpg",
    "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321535.jpg",
    "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319800/319840.jpg",
    "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316631.jpg",
    # Wikipedia test
    "https://en.wikipedia.org/w/api.php?action=query&titles=Rishabh_Pant&prop=pageimages&format=json&pithumbsize=320"
]

for u in test_urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=3) as r:
            data = r.read()
            print(f"✅ {u}: Status {r.status}, length {len(data)}")
            if "wikipedia" in u:
                import json
                print("   ", json.loads(data))
    except Exception as e:
        print(f"❌ {u}: {e}")
