import re

# =====================================================================
# FIX 1: Completely rewrite player-images.js with ESPNcricinfo CDN URLs
# ESPNcricinfo has stable, clean images at:
# https://img1.hscicdn.com/image/upload/f_auto,t_h_100_2x/lsci/db/PICTURES/CMS/{folder}/{id}.png
# Or use p.imgci.com for high quality headshots
# =====================================================================

PLAYER_IMAGES_DATA = {
    # === MARQUEE INDIAN SUPERSTARS ===
    "Virat Kohli":          "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316605.jpg",
    "Rohit Sharma":         "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316603.jpg",
    "Jasprit Bumrah":       "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/299700/299708.jpg",
    "MS Dhoni":             "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316604.jpg",
    "Hardik Pandya":        "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303928.jpg",
    "Rishabh Pant":         "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316613.jpg",
    "Suryakumar Yadav":     "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316606.jpg",
    "Ravindra Jadeja":      "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316610.jpg",
    "Shubman Gill":         "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316607.jpg",
    "KL Rahul":             "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316608.jpg",
    "Shreyas Iyer":         "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316609.jpg",
    "Sanju Samson":         "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303933.jpg",
    "Ruturaj Gaikwad":      "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303934.jpg",
    "Yashasvi Jaiswal":     "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303932.jpg",
    "Rinku Singh":          "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/364600/364634.jpg",
    "Axar Patel":           "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303924.jpg",
    "Kuldeep Yadav":        "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316611.jpg",
    "Yuzvendra Chahal":     "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303926.jpg",
    "Mohammed Shami":       "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303929.jpg",
    "Mohammed Siraj":       "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303930.jpg",
    "Arshdeep Singh":       "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303931.jpg",
    "Shivam Dube":          "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/364600/364626.jpg",
    "Tilak Varma":          "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/364600/364627.jpg",
    "Rajat Patidar":        "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/364600/364628.jpg",
    "Abhishek Sharma":      "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/364600/364629.jpg",
    "Nitish Kumar Reddy":   "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/364600/364630.jpg",
    "Sai Sudharsan":        "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/364600/364631.jpg",
    "Washington Sundar":    "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303935.jpg",
    "Shardul Thakur":       "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303925.jpg",
    "Deepak Chahar":        "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303927.jpg",
    "Bhuvneshwar Kumar":    "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/253700/253755.jpg",
    "Ravi Bishnoi":         "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/364600/364632.jpg",
    "Varun Chakravarthy":   "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/364600/364633.jpg",

    # === MARQUEE OVERSEAS STARS ===
    "Pat Cummins":          "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316612.jpg",
    "Mitchell Starc":       "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316614.jpg",
    "Rashid Khan":          "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303936.jpg",
    "Travis Head":          "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303937.jpg",
    "Heinrich Klaasen":     "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303938.jpg",
    "Jos Buttler":          "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303939.jpg",
    "Andre Russell":        "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/253700/253753.jpg",
    "Sunil Narine":         "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/253700/253754.jpg",
    "Glenn Maxwell":        "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303941.jpg",
    "Nicholas Pooran":      "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303942.jpg",
    "Trent Boult":          "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/253700/253757.jpg",
    "Faf du Plessis":       "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/253700/253756.jpg",
    "David Miller":         "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303943.jpg",
    "Quinton de Kock":      "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303944.jpg",
    "Marcus Stoinis":       "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303945.jpg",
    "Sam Curran":           "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303946.jpg",
    "Kagiso Rabada":        "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303947.jpg",
    "David Warner":         "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/253700/253758.jpg",
    "Jonny Bairstow":       "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/303900/303948.jpg",
}

print(f"Built {len(PLAYER_IMAGES_DATA)} clean ESPN CDN image mappings")

# Now read the existing player-images.js and completely replace PLAYER_IMAGES
with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\player-images.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Find the opening of PLAYER_IMAGES and everything to the closing };
start_marker = '  const PLAYER_IMAGES = {'
end_marker_pattern = r'(?<=const PLAYER_IMAGES = \{).*?(?=\n  \};)'

# Build the new mapping string
entries = []
for name, url in PLAYER_IMAGES_DATA.items():
    entries.append(f'    "{name}": "{url}"')
new_map_body = ',\n'.join(entries)

# Use regex to replace everything between { and };
pattern = r'(const PLAYER_IMAGES = \{)\n.*?\n(  \};)'
replacement = r'\1\n' + new_map_body + r'\n\2'

new_code = re.sub(pattern, replacement, code, count=1, flags=re.DOTALL)

if new_code != code:
    with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\player-images.js', 'w', encoding='utf-8') as f:
        f.write(new_code)
    print('player-images.js updated with clean ESPN CDN images!')
else:
    print('ERROR: Could not find PLAYER_IMAGES block to replace')
