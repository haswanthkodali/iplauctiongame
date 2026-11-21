import re
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\data.js', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'\{\s*id:\s*(\d+|"[^"]+"),\s*name:\s*"([^"]+)",\s*country:\s*"([^"]+)",\s*role:\s*"([^"]+)"'
players = re.findall(pattern, text)
print(f"Total players in PLAYERS: {len(players)}")

# Test a few known IPL IDs
test_ids = [2, 6, 1, 57, 54, 167, 108, 9, 228, 19, 312, 190, 509, 536, 535, 157, 350, 111, 94, 237, 479, 440, 969, 955, 487, 1138, 1024, 254, 177, 140, 116, 538, 434, 354, 1083, 1148, 482, 395, 35, 370, 107, 212, 485, 492, 171, 141, 50, 127, 396, 68, 24, 92, 178, 209, 349, 486, 174, 418, 1052, 1021, 150, 1137, 1127, 1051, 397, 146, 143, 981, 1077, 278, 413, 389, 988, 489, 330, 180, 170, 102, 5430, 2738, 3764, 135, 158, 3838, 1000, 5431, 1004, 954, 980, 967, 594, 156, 437, 506, 1032, 206, 1043, 1060, 1040, 1039, 961, 1037, 1144, 1145, 1147, 1143, 289, 1076, 1107, 59, 1112, 957, 1022, 1023, 960, 1058, 1065, 1014, 494, 380, 376, 1081, 3763, 963, 1025, 176, 76, 98, 523, 115, 17, 88, 493, 182, 1080, 522, 1064, 1062]

valid = 0
for pid in test_ids[:10]:
    url = f"https://documents.iplt20.com/ipl/IPLHeadshot2024/{pid}.png"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=3, context=ctx)
        if res.status == 200:
            valid += 1
    except Exception as e:
        pass

print(f"Sample IPL test valid: {valid}/10")
