import re

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\data.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update existing breakout players to be in Set 9, basePrice: 0.30, uncapped: true
breakout_stars = [
    "Ashutosh Sharma", "Shashank Singh", "Ayush Badoni", "Ramandeep Singh",
    "Abishek Porel", "Harshit Rana", "Mayank Yadav", "Sameer Rizvi",
    "Angkrish Raghuvanshi", "Naman Dhir", "Suyash Sharma"
]

def update_player_block(match):
    block = match.group(0)
    for name in breakout_stars:
        if f'name: "{name}"' in block or f"name: '{name}'" in block:
            # Change set to 9
            block = re.sub(r'set:\s*\d+', 'set: 9', block)
            # Change basePrice to 0.30
            block = re.sub(r'basePrice:\s*[\d\.]+', 'basePrice: 0.30', block)
            # Ensure uncapped: true
            if 'uncapped:' in block:
                block = re.sub(r'uncapped:\s*(true|false)', 'uncapped: true', block)
            else:
                block = block.replace('overseas: false,', 'overseas: false,\n    uncapped: true,')
            print(f"Updated {name} to Set 9 (0.30 Cr uncapped)")
            break
    return block

pattern = re.compile(r'\{\s*id:[^\}]+?\}', re.DOTALL)
code = pattern.sub(update_player_block, code)

# Find max ID
ids = [int(m.group(1)) for m in re.finditer(r'id:\s*(\d+)', code)]
max_id = max(ids) if ids else 202
print(f"Current max player ID: {max_id}")

# 2. Add new 2024-2026 uncapped stars to Set 9
new_uncapped_players = [
    {
        "name": "Vaibhav Suryavanshi",
        "country": "India",
        "role": "Batsman",
        "basePrice": 0.30,
        "rating": 80,
        "battingRating": 82,
        "bowlingRating": 15,
        "fieldingRating": 80,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Historic 13-Year-Old Prodigy & Fearless Opener",
        "initials": "VS"
    },
    {
        "name": "Rasikh Salam Dar",
        "country": "India",
        "role": "Bowler",
        "basePrice": 0.30,
        "rating": 83,
        "battingRating": 25,
        "bowlingRating": 85,
        "fieldingRating": 80,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Death-Overs Yorker Specialist & Seam Bowler",
        "initials": "RS"
    },
    {
        "name": "Anshul Kamboj",
        "country": "India",
        "role": "Bowler",
        "basePrice": 0.30,
        "rating": 83,
        "battingRating": 35,
        "bowlingRating": 85,
        "fieldingRating": 82,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Historic 10-Wicket Ranji Sensation & Hit-the-Deck Pacer",
        "initials": "AK"
    },
    {
        "name": "Mohsin Khan",
        "country": "India",
        "role": "Bowler",
        "basePrice": 0.30,
        "rating": 84,
        "battingRating": 20,
        "bowlingRating": 86,
        "fieldingRating": 81,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Tall Left-Arm Express Pacer & Hard-Length Enforcer",
        "initials": "MK"
    },
    {
        "name": "C Andre Siddarth",
        "country": "India",
        "role": "Batsman",
        "basePrice": 0.30,
        "rating": 79,
        "battingRating": 81,
        "bowlingRating": 20,
        "fieldingRating": 82,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Crisp Stroke-Maker & High-Impact Middle Order Talent",
        "initials": "AS"
    },
    {
        "name": "Avanish Rao Aravelly",
        "country": "India",
        "role": "Wicket-Keeper",
        "basePrice": 0.30,
        "rating": 79,
        "battingRating": 80,
        "bowlingRating": 10,
        "fieldingRating": 84,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "India U19 Wicketkeeper & Agile Left-Hand Finisher",
        "initials": "AR"
    },
    {
        "name": "Vipraj Nigam",
        "country": "India",
        "role": "Bowler",
        "basePrice": 0.30,
        "rating": 78,
        "battingRating": 30,
        "bowlingRating": 80,
        "fieldingRating": 78,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Clever Mystery Leg-Spinner & Powerplay Weapon",
        "initials": "VN"
    },
    {
        "name": "Gurjapneet Singh",
        "country": "India",
        "role": "Bowler",
        "basePrice": 0.30,
        "rating": 80,
        "battingRating": 15,
        "bowlingRating": 82,
        "fieldingRating": 79,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Towering 6ft 3in Left-Arm Fast Bowler",
        "initials": "GS"
    },
    {
        "name": "Digvesh Rathi",
        "country": "India",
        "role": "Bowler",
        "basePrice": 0.30,
        "rating": 78,
        "battingRating": 20,
        "bowlingRating": 80,
        "fieldingRating": 78,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Deceptive Wrist Spinner with Sharp Turn",
        "initials": "DR"
    },
    {
        "name": "Saurav Chuahan",
        "country": "India",
        "role": "Batsman",
        "basePrice": 0.30,
        "rating": 79,
        "battingRating": 81,
        "bowlingRating": 10,
        "fieldingRating": 80,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Aggressive Powerplay Slogger & Rapid Run-Scorer",
        "initials": "SC"
    },
    {
        "name": "Manoj Bhandage",
        "country": "India",
        "role": "All-Rounder",
        "basePrice": 0.30,
        "rating": 80,
        "battingRating": 80,
        "bowlingRating": 76,
        "fieldingRating": 82,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Explosive Left-Hand Finisher & Seam All-Rounder",
        "initials": "MB"
    },
    {
        "name": "Sushant Mishra",
        "country": "India",
        "role": "Bowler",
        "basePrice": 0.30,
        "rating": 79,
        "battingRating": 15,
        "bowlingRating": 81,
        "fieldingRating": 79,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Rapid Left-Arm Fast Bowler with Bouncer Threat",
        "initials": "SM"
    },
    {
        "name": "Hardik Tamore",
        "country": "India",
        "role": "Wicket-Keeper",
        "basePrice": 0.30,
        "rating": 78,
        "battingRating": 79,
        "bowlingRating": 10,
        "fieldingRating": 82,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Reliable Mumbai Keeper-Batter & Crisis Anchor",
        "initials": "HT"
    },
    {
        "name": "Vansh Bedi",
        "country": "India",
        "role": "Batsman",
        "basePrice": 0.30,
        "rating": 78,
        "battingRating": 80,
        "bowlingRating": 15,
        "fieldingRating": 78,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "High-Strike-Rate Middle Order Finisher",
        "initials": "VB"
    },
    {
        "name": "Kamlesh Nagarkoti",
        "country": "India",
        "role": "Bowler",
        "basePrice": 0.30,
        "rating": 81,
        "battingRating": 35,
        "bowlingRating": 83,
        "fieldingRating": 88,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "145+ km/h Out-and-Out Pacer & Elite Fielder",
        "initials": "KN"
    },
    {
        "name": "Kartik Tyagi",
        "country": "India",
        "role": "Bowler",
        "basePrice": 0.30,
        "rating": 82,
        "battingRating": 20,
        "bowlingRating": 84,
        "fieldingRating": 82,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "150 km/h Fast Bowler with Searing Yorkers",
        "initials": "KT"
    },
    {
        "name": "Gurnoor Brar",
        "country": "India",
        "role": "Bowler",
        "basePrice": 0.30,
        "rating": 79,
        "battingRating": 25,
        "bowlingRating": 81,
        "fieldingRating": 78,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Tall 6ft 5in Fast Bowler with Steep Bounce",
        "initials": "GB"
    },
    {
        "name": "Harpreet Singh Bhatia",
        "country": "India",
        "role": "Batsman",
        "basePrice": 0.30,
        "rating": 80,
        "battingRating": 82,
        "bowlingRating": 25,
        "fieldingRating": 80,
        "overseas": False,
        "uncapped": True,
        "set": 9,
        "speciality": "Experienced Left-Hand Top-Order Anchor",
        "initials": "HB"
    }
]

# Format entries to insert before PLAYERS array closing `];`
new_entries = []
cur_id = max_id
for p in new_uncapped_players:
    cur_id += 1
    p["id"] = cur_id
    entry = f"""  {{
    id: {p['id']},
    name: "{p['name']}",
    country: "{p['country']}",
    role: "{p['role']}",
    basePrice: 0.30,
    rating: {p['rating']},
    battingRating: {p['battingRating']},
    bowlingRating: {p['bowlingRating']},
    fieldingRating: {p['fieldingRating']},
    overseas: false,
    uncapped: true,
    set: 9,
    speciality: "{p['speciality']}",
    initials: "{p['initials']}"
  }}"""
    new_entries.append(entry)

entries_text = ",\n" + ",\n".join(new_entries)

# Insert before `];\n\n// Exports`
closing_idx = code.rfind("];")
if closing_idx != -1:
    code = code[:closing_idx].rstrip() + entries_text + "\n];" + code[closing_idx+2:]
    print(f"Successfully added {len(new_uncapped_players)} new uncapped players!")
else:
    print("Error: Could not find closing ]; of PLAYERS array")

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\data.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("data.js successfully written!")
