import urllib.request, json

ipl_candidates = {
    "Faf du Plessis": "https://documents.iplt20.com/ipl/IPLHeadshot2024/24.png",
    "Jake Fraser-McGurk": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1137.png",
    "David Warner": "https://documents.iplt20.com/ipl/IPLHeadshot2024/170.png",
    "Daryl Mitchell": "https://documents.iplt20.com/ipl/IPLHeadshot2024/330.png",
    "Rahmanullah Gurbaz": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1032.png",
    "Wriddhiman Saha": "https://documents.iplt20.com/ipl/IPLHeadshot2024/134.png",
    "Kyle Mayers": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1034.png",
    "Maheesh Theekshana": "https://documents.iplt20.com/ipl/IPLHeadshot2024/961.png",
    "Gerald Coetzee": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1077.png",
    "Spencer Johnson": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1144.png",
    "Dilshan Madushanka": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1143.png",
    "Mandeep Singh": "https://documents.iplt20.com/ipl/IPLHeadshot2024/72.png",
    "Vijay Shankar": "https://documents.iplt20.com/ipl/IPLHeadshot2024/115.png",
    "Krishnappa Gowtham": "https://documents.iplt20.com/ipl/IPLHeadshot2024/275.png",
    "KS Bharat": "https://documents.iplt20.com/ipl/IPLHeadshot2024/965.png",
    "Prerak Mankad": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1091.png",
    "Anmolpreet Singh": "https://documents.iplt20.com/ipl/IPLHeadshot2024/497.png",
    "Ricky Bhui": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1072.png"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
results = {}
for name, url in ipl_candidates.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            status = resp.status
            size = len(resp.read())
            results[name] = (status, size, url)
            print(f"OK: {name} -> {status} ({size} bytes)")
    except Exception as e:
        results[name] = (f"ERR: {e}", 0, url)
        print(f"FAILED: {name} -> {e}")
