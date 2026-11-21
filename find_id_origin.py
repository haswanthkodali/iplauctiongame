import glob, re

img_ids = ["322371", "319839", "340344", "340325", "364145", "380678", "340049", "322627", "322605", "341034"]

files = glob.glob(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\*.py') + glob.glob(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\*.json')

for f in files:
    try:
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            text = fp.read()
        for i_id in img_ids:
            for m in re.finditer(i_id, text):
                start = max(0, m.start() - 60)
                end = min(len(text), m.end() + 60)
                print(f"[{f}] {i_id}: ...{text[start:end]}...")
                break
    except:
        pass
