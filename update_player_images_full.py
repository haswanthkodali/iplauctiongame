import re

# Comprehensive photo map for IPL stars & overseas players
ADDITIONAL_PLAYER_IMAGES = {
    # Star Indian Batters & WKs
    "Ishan Kishan": "https://documents.iplt20.com/ipl/IPLHeadshot2024/102.png",
    "Devdutt Padikkal": "https://documents.iplt20.com/ipl/IPLHeadshot2024/547.png",
    "Nitish Rana": "https://documents.iplt20.com/ipl/IPLHeadshot2024/148.png",
    "Prithvi Shaw": "https://documents.iplt20.com/ipl/IPLHeadshot2024/384.png",
    "Rahul Tripathi": "https://documents.iplt20.com/ipl/IPLHeadshot2024/3838.png",
    "Mayank Agarwal": "https://documents.iplt20.com/ipl/IPLHeadshot2024/158.png",
    "Ajinkya Rahane": "https://documents.iplt20.com/ipl/IPLHeadshot2024/135.png",
    "Manish Pandey": "https://documents.iplt20.com/ipl/IPLHeadshot2024/123.png",
    "Venkatesh Iyer": "https://documents.iplt20.com/ipl/IPLHeadshot2024/954.png",
    "Krunal Pandya": "https://documents.iplt20.com/ipl/IPLHeadshot2024/17.png",
    "Harshal Patel": "https://documents.iplt20.com/ipl/IPLHeadshot2024/157.png",
    "Jitesh Sharma": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1000.png",
    "Dhruv Jurel": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1004.png",
    "Prabhsimran Singh": "https://documents.iplt20.com/ipl/IPLHeadshot2024/5431.png",
    "Anuj Rawat": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1078.png",
    "KS Bharat": "https://documents.iplt20.com/ipl/IPLHeadshot2024/965.png",
    "Shahrukh Khan": "https://documents.iplt20.com/ipl/IPLHeadshot2024/594.png",
    "Ayush Badoni": "https://documents.iplt20.com/ipl/IPLHeadshot2024/980.png",
    "Abhinav Manohar": "https://documents.iplt20.com/ipl/IPLHeadshot2024/967.png",
    "Nehal Wadhera": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1063.png",
    "Shashank Singh": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1042.png",
    "Ashutosh Sharma": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1146.png",
    "Sameer Rizvi": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1151.png",
    "Kumar Kushagra": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1152.png",
    "Angkrish Raghuvanshi": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1155.png",
    "Mahipal Lomror": "https://documents.iplt20.com/ipl/IPLHeadshot2024/182.png",
    "Swapnil Singh": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1080.png",
    "Sarfaraz Khan": "https://documents.iplt20.com/ipl/IPLHeadshot2024/156.png",
    "Karun Nair": "https://documents.iplt20.com/ipl/IPLHeadshot2024/276.png",
    "Mandeep Singh": "https://documents.iplt20.com/ipl/IPLHeadshot2024/72.png",

    # Overseas Stars
    "David Warner": "https://documents.iplt20.com/ipl/IPLHeadshot2024/170.png",
    "Tristan Stubbs": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1017.png",
    "Glenn Phillips": "https://documents.iplt20.com/ipl/IPLHeadshot2024/437.png",
    "Jonny Bairstow": "https://documents.iplt20.com/ipl/IPLHeadshot2024/506.png",
    "Rahmanullah Gurbaz": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1032.png",
    "Moeen Ali": "https://documents.iplt20.com/ipl/IPLHeadshot2024/206.png",
    "Romario Shepherd": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1043.png",
    "Sikandar Raza": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1060.png",
    "Azmatullah Omarzai": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1142.png",
    "Kyle Mayers": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1034.png",
    "Naveen-ul-Haq": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1040.png",
    "Noor Ahmad": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1039.png",
    "Maheesh Theekshana": "https://documents.iplt20.com/ipl/IPLHeadshot2024/961.png",
    "Fazalhaq Farooqi": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1037.png",
    "Spencer Johnson": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1144.png",
    "Nuwan Thushara": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1145.png",
    "Nandre Burger": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1147.png",
    "Dilshan Madushanka": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1143.png",
    "Mustafizur Rahman": "https://documents.iplt20.com/ipl/IPLHeadshot2024/289.png",

    # Indian Bowlers & Allrounders
    "Khaleel Ahmed": "https://documents.iplt20.com/ipl/IPLHeadshot2024/383.png",
    "Mukesh Kumar": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1076.png",
    "Mohit Sharma": "https://documents.iplt20.com/ipl/IPLHeadshot2024/110.png",
    "Umesh Yadav": "https://documents.iplt20.com/ipl/IPLHeadshot2024/59.png",
    "Sandeep Sharma": "https://documents.iplt20.com/ipl/IPLHeadshot2024/111.png",
    "Chetan Sakariya": "https://documents.iplt20.com/ipl/IPLHeadshot2024/957.png",
    "Vaibhav Arora": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1022.png",
    "Yash Dayal": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1023.png",
    "Tushar Deshpande": "https://documents.iplt20.com/ipl/IPLHeadshot2024/960.png",
    "Simarjeet Singh": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1058.png",
    "Rasikh Salam": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1065.png",
    "Kuldeep Sen": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1014.png",
    "Kartik Tyagi": "https://documents.iplt20.com/ipl/IPLHeadshot2024/494.png",
    "Shivam Mavi": "https://documents.iplt20.com/ipl/IPLHeadshot2024/380.png",
    "Kamlesh Nagarkoti": "https://documents.iplt20.com/ipl/IPLHeadshot2024/376.png",
    "Suyash Sharma": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1081.png",
    "Rahul Chahar": "https://documents.iplt20.com/ipl/IPLHeadshot2024/376.png",
    "Ravisrinivasan Sai Kishore": "https://documents.iplt20.com/ipl/IPLHeadshot2024/963.png",
    "Sai Kishore": "https://documents.iplt20.com/ipl/IPLHeadshot2024/963.png",
    "Kumar Kartikeya": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1025.png",
    "Shreyas Gopal": "https://documents.iplt20.com/ipl/IPLHeadshot2024/176.png",
    "Piyush Chawla": "https://documents.iplt20.com/ipl/IPLHeadshot2024/76.png",
    "Karn Sharma": "https://documents.iplt20.com/ipl/IPLHeadshot2024/98.png",
    "Shahbaz Ahmed": "https://documents.iplt20.com/ipl/IPLHeadshot2024/523.png",
    "Vijay Shankar": "https://documents.iplt20.com/ipl/IPLHeadshot2024/115.png",
    "Rishi Dhawan": "https://documents.iplt20.com/ipl/IPLHeadshot2024/88.png",
    "Lalit Yadav": "https://documents.iplt20.com/ipl/IPLHeadshot2024/493.png",
    "Harpreet Brar": "https://documents.iplt20.com/ipl/IPLHeadshot2024/522.png",
    "Ramandeep Singh": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1064.png",
    "Atharva Taide": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1062.png"
}

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\player-images.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Insert additional images before closing brace of PLAYER_IMAGES
idx = code.find('};\n\n  // Flag and emoji mapping')
if idx == -1:
    idx = code.find('};\n  // Flag and emoji mapping')

add_entries = ""
for name, url in ADDITIONAL_PLAYER_IMAGES.items():
    if f'"{name}":' not in code:
        add_entries += f'    "{name}": "{url}",\n'

if add_entries:
    code = code[:idx] + ',\n' + add_entries.rstrip(',\n') + '\n  ' + code[idx:]

# Remove _offlineOrBlocked logic completely so working images always show!
code = re.sub(r'let _offlineOrBlocked = false;.*?\n', '', code)
code = re.sub(r'setInterval\(\(\) => \{.*?\}, 30000\);', '', code, flags=re.DOTALL)
code = re.sub(r'if \(_offlineOrBlocked\) \{\s*return generatePlayerAvatarSVG\(pObj\);\s*\}', '', code)
code = re.sub(r'if \(_consecutiveFailures >= \d+\) \{\s*_offlineOrBlocked = true;\s*\}', '', code)

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\player-images.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated player-images.js successfully!")
