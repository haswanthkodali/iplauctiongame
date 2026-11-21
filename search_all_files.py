import os, glob, re

target_names = [
    "Daryl Mitchell",
    "Rassie van der Dussen",
    "Rahmanullah Gurbaz",
    "Maheesh Theekshana",
    "Lance Morris",
    "Spencer Johnson",
    "Dilshan Madushanka",
    "Krishnappa Gowtham",
    "KS Bharat",
    "Prerak Mankad",
    "Ricky Bhui"
]

all_files = glob.glob(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\*')
hits = {name: [] for name in target_names}

for f in all_files:
    if os.path.isdir(f) or f.endswith(('.png', '.jpg', '.pem')):
        continue
    fname = os.path.basename(f)
    try:
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
        for name in target_names:
            # search for name followed or preceded by URL
            for m in re.finditer(re.escape(name), content, re.I):
                start = max(0, m.start() - 100)
                end = min(len(content), m.end() + 200)
                snippet = content[start:end]
                urls = re.findall(r'https?://[^\s"\'<>]+', snippet)
                if urls:
                    for u in urls:
                        hits[name].append((fname, u))
    except Exception as e:
        pass

for name, url_list in hits.items():
    print(f"\n=== {name} ===")
    unique = set(url_list)
    if unique:
        for fname, u in list(unique)[:5]:
            print(f"  [{fname}] {u}")
    else:
        print("  No URLs found in workspace files")
