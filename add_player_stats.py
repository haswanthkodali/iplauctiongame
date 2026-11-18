import json

new_player_stats = {
    "Mitchell Starc": {
        "matches": 41, "runs": 124, "highScore": 29, "battingAvg": 11.27, "strikeRate": 105.08,
        "fifties": 0, "hundreds": 0, "fours": 9, "sixes": 4, "wickets": 51, "bowlingAvg": 23.47,
        "economy": 8.21, "bestBowling": "4/15", "catches": 14, "stumpings": 0, "recentForm": "A+",
        "bestPosition": "Strike Opening & Death Bowler",
        "strengths": ["Extreme pace & toe-crushing yorkers", "Clutch playoff match-winner"],
        "weaknesses": ["Occasionally expensive in middle overs"]
    },
    "Sunil Narine": {
        "matches": 177, "runs": 1534, "highScore": 109, "battingAvg": 17.04, "strikeRate": 165.84,
        "fifties": 7, "hundreds": 1, "fours": 178, "sixes": 91, "wickets": 180, "bowlingAvg": 25.39,
        "economy": 6.73, "bestBowling": "5/19", "catches": 32, "stumpings": 0, "recentForm": "A+",
        "bestPosition": "Pinch Hitter & Mystery Spinner",
        "strengths": ["All-time great economy rate", "Devastating powerplay pinch hitter"],
        "weaknesses": ["Susceptible to high bounce pace bowling"]
    },
    "Nicholas Pooran": {
        "matches": 76, "runs": 1769, "highScore": 77, "battingAvg": 32.76, "strikeRate": 162.29,
        "fifties": 9, "hundreds": 0, "fours": 118, "sixes": 113, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 38, "stumpings": 6, "recentForm": "A+",
        "bestPosition": "Explosive Middle-Order Finisher",
        "strengths": ["360-degree boundary hitting", "Highest six-hitting strike rate"],
        "weaknesses": ["High-risk shot selection early in innings"]
    },
    "Shreyas Iyer": {
        "matches": 115, "runs": 3127, "highScore": 96, "battingAvg": 32.24, "strikeRate": 127.48,
        "fifties": 21, "hundreds": 0, "fours": 268, "sixes": 113, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 48, "stumpings": 0, "recentForm": "A",
        "bestPosition": "Top Order Anchor & Captain",
        "strengths": ["Dominant player against spin", "Proven IPL trophy-winning leadership"],
        "weaknesses": ["Vulnerable against express short-pitched deliveries"]
    },
    "Rinku Singh": {
        "matches": 46, "runs": 893, "highScore": 67, "battingAvg": 30.79, "strikeRate": 143.34,
        "fifties": 4, "hundreds": 0, "fours": 68, "sixes": 48, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 28, "stumpings": 0, "recentForm": "A",
        "bestPosition": "Clutch Death-Overs Finisher",
        "strengths": ["World-class match finisher under high pressure", "Phenomenal outfield fielder"],
        "weaknesses": ["Limited exposure against high quality leg-spin"]
    },
    "Tilak Varma": {
        "matches": 38, "runs": 1156, "highScore": 84, "battingAvg": 39.86, "strikeRate": 146.33,
        "fifties": 6, "hundreds": 0, "fours": 88, "sixes": 55, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 18, "stumpings": 0, "recentForm": "A+",
        "bestPosition": "Dynamic Middle-Order Anchor",
        "strengths": ["Maturity beyond age", "Capable of pacing chases effortlessly"],
        "weaknesses": ["Building tempo after long injury lay-offs"]
    },
    "Sai Sudharsan": {
        "matches": 28, "runs": 1034, "highScore": 103, "battingAvg": 47.00, "strikeRate": 139.17,
        "fifties": 6, "hundreds": 1, "fours": 108, "sixes": 28, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 12, "stumpings": 0, "recentForm": "A+",
        "bestPosition": "Prolific Top Order Accumulator",
        "strengths": ["Near 50 career average in IPL", "Classic cricketing technique"],
        "weaknesses": ["Power hitting in the final two overs"]
    },
    "Rajat Patidar": {
        "matches": 27, "runs": 799, "highScore": 112, "battingAvg": 34.74, "strikeRate": 158.85,
        "fifties": 7, "hundreds": 1, "fours": 62, "sixes": 51, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 14, "stumpings": 0, "recentForm": "A",
        "bestPosition": "Aggressive Spin Destroyer",
        "strengths": ["Massive strike rate against both wrist and finger spin", "IPL playoff centurion"],
        "weaknesses": ["Susceptible to wide outside-off yorkers"]
    },
    "Rahul Tripathi": {
        "matches": 95, "runs": 2236, "highScore": 93, "battingAvg": 27.27, "strikeRate": 139.75,
        "fifties": 12, "hundreds": 0, "fours": 234, "sixes": 83, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 34, "stumpings": 0, "recentForm": "B+",
        "bestPosition": "Aggressive No. 3 Bat",
        "strengths": ["High intent from ball one", "Versatile against pace and spin"],
        "weaknesses": ["Inconsistency when converting 30s to 50s"]
    },
    "Nitish Rana": {
        "matches": 107, "runs": 2636, "highScore": 87, "battingAvg": 28.65, "strikeRate": 135.04,
        "fifties": 18, "hundreds": 0, "fours": 242, "sixes": 137, "wickets": 10, "bowlingAvg": 23.4,
        "economy": 8.32, "catches": 31, "stumpings": 0, "recentForm": "B+",
        "bestPosition": "Middle-Order Spin Basher",
        "strengths": ["Power hitter in middle overs", "Handy off-break partnership breaker"],
        "weaknesses": ["Pace bowling on hard, bouncy tracks"]
    },
    "Devdutt Padikkal": {
        "matches": 65, "runs": 1561, "highScore": 101, "battingAvg": 25.18, "strikeRate": 122.91,
        "fifties": 9, "hundreds": 1, "fours": 172, "sixes": 43, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 22, "stumpings": 0, "recentForm": "B",
        "bestPosition": "Top Order Stroke Maker",
        "strengths": ["Graceful left-handed off-side play", "IPL emerging player awardee"],
        "weaknesses": ["Strike rate slows down during middle overs"]
    },
    "Prithvi Shaw": {
        "matches": 79, "runs": 1892, "highScore": 99, "battingAvg": 23.95, "strikeRate": 147.47,
        "fifties": 14, "hundreds": 0, "fours": 238, "sixes": 60, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 21, "stumpings": 0, "recentForm": "B",
        "bestPosition": "Powerplay Attacking Opener",
        "strengths": ["Explosive strike rate in the first 6 overs", "Fearless back-foot cut and pull"],
        "weaknesses": ["Inswinging delivery through the gate"]
    },
    "Ajinkya Rahane": {
        "matches": 185, "runs": 4642, "highScore": 105, "battingAvg": 30.14, "strikeRate": 123.42,
        "fifties": 30, "hundreds": 2, "fours": 482, "sixes": 103, "wickets": 1, "bowlingAvg": 40.0,
        "economy": 8.00, "catches": 68, "stumpings": 0, "recentForm": "B+",
        "bestPosition": "Experienced Top Order Anchor",
        "strengths": ["Immense IPL experience (4600+ runs)", "Impeccable timing and classical technique"],
        "weaknesses": ["Limited power-hitting capabilities at death"]
    },
    "Mayank Agarwal": {
        "matches": 127, "runs": 2661, "highScore": 106, "battingAvg": 22.94, "strikeRate": 133.05,
        "fifties": 13, "hundreds": 1, "fours": 266, "sixes": 97, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 44, "stumpings": 0, "recentForm": "B",
        "bestPosition": "Opening Power Hitter",
        "strengths": ["Strong lofted hitting straight down the ground", "Aggressive counter-puncher"],
        "weaknesses": ["Prone to early dismissal fishing outside off-stump"]
    },
    "Shashank Singh": {
        "matches": 24, "runs": 448, "highScore": 68, "battingAvg": 34.46, "strikeRate": 161.73,
        "fifties": 2, "hundreds": 0, "fours": 36, "sixes": 28, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 9, "stumpings": 0, "recentForm": "A",
        "bestPosition": "Clutch Power Finisher",
        "strengths": ["Sensational strike rate in death overs", "Calm temperament in impossible chases"],
        "weaknesses": ["Small sample size against international spinners"]
    },
    "Ashutosh Sharma": {
        "matches": 11, "runs": 189, "highScore": 61, "battingAvg": 27.00, "strikeRate": 167.26,
        "fifties": 0, "hundreds": 0, "fours": 15, "sixes": 15, "wickets": 0, "bowlingAvg": 0,
        "economy": 0, "catches": 4, "stumpings": 0, "recentForm": "A",
        "bestPosition": "Death-Overs Impactor",
        "strengths": ["Unorthodox sweep shots against fast bowlers", "Tremendous bat speed"],
        "weaknesses": ["Short ball aimed at helmet"]
    },
    "Harshit Rana": {
        "matches": 21, "runs": 40, "highScore": 12, "battingAvg": 10.0, "strikeRate": 100.0,
        "fifties": 0, "hundreds": 0, "fours": 2, "sixes": 2, "wickets": 25, "bowlingAvg": 23.64,
        "economy": 8.92, "bestBowling": "3/24", "catches": 7, "stumpings": 0, "recentForm": "A",
        "bestPosition": "Aggressive Hit-The-Deck Pacer",
        "strengths": ["Heavy ball with awkward steep bounce", "Deceptive slower balls and yorkers"],
        "weaknesses": ["Discipline in high pressure final over situations"]
    },
    "Mayank Yadav": {
        "matches": 4, "runs": 0, "highScore": 0, "battingAvg": 0, "strikeRate": 0,
        "fifties": 0, "hundreds": 0, "fours": 0, "sixes": 0, "wickets": 7, "bowlingAvg": 12.14,
        "economy": 6.99, "bestBowling": "3/14", "catches": 1, "stumpings": 0, "recentForm": "A+",
        "bestPosition": "155+ km/h Express Pacer",
        "strengths": ["Fastest bowler in IPL (156.7 km/h)", "Unplayable high pace and pinpoint accuracy"],
        "weaknesses": ["Injury management and fitness durability"]
    },
    "Varun Chakravarthy": {
        "matches": 71, "runs": 28, "highScore": 9, "battingAvg": 5.60, "strikeRate": 53.85,
        "fifties": 0, "hundreds": 0, "fours": 1, "sixes": 1, "wickets": 83, "bowlingAvg": 25.04,
        "economy": 7.56, "bestBowling": "5/20", "catches": 14, "stumpings": 0, "recentForm": "A+",
        "bestPosition": "Mystery Spin Enforcer",
        "strengths": ["Carrom ball, leg-cutter and googly variations", "Chokes run flow in middle overs"],
        "weaknesses": ["Wet ball with heavy dew conditions"]
    },
    "T Natarajan": {
        "matches": 61, "runs": 18, "highScore": 4, "battingAvg": 4.50, "strikeRate": 60.0,
        "fifties": 0, "hundreds": 0, "fours": 0, "sixes": 0, "wickets": 67, "bowlingAvg": 29.34,
        "economy": 8.65, "bestBowling": "4/19", "catches": 11, "stumpings": 0, "recentForm": "A",
        "bestPosition": "Yorker Specialist & Death Bowler",
        "strengths": ["Laser-guided yorkers at will", "Left-arm angle naturally troubles right-handers"],
        "weaknesses": ["Prone to fitness issues"]
    },
    "Deepak Chahar": {
        "matches": 81, "runs": 82, "highScore": 39, "battingAvg": 11.71, "strikeRate": 138.98,
        "fifties": 0, "hundreds": 0, "fours": 5, "sixes": 5, "wickets": 77, "bowlingAvg": 28.87,
        "economy": 7.97, "bestBowling": "6/7", "catches": 16, "stumpings": 0, "recentForm": "B+",
        "bestPosition": "Powerplay Swing Master",
        "strengths": ["Sensational new-ball swing bowling", "Knack for early powerplay breakthroughs"],
        "weaknesses": ["Effectiveness drops if ball doesn't swing"]
    },
    "Shardul Thakur": {
        "matches": 95, "runs": 307, "highScore": 68, "battingAvg": 11.81, "strikeRate": 140.83,
        "fifties": 1, "hundreds": 0, "fours": 28, "sixes": 15, "wickets": 94, "bowlingAvg": 29.83,
        "economy": 9.24, "bestBowling": "4/36", "catches": 27, "stumpings": 0, "recentForm": "B+",
        "bestPosition": "Partnership Breaker & Finisher",
        "strengths": ["Uncanny golden arm to take crucial wickets", "Useful lower-order counter-attacking cameos"],
        "weaknesses": ["High career economy rate"]
    },
    "Bhuvneshwar Kumar": {
        "matches": 176, "runs": 306, "highScore": 24, "battingAvg": 8.74, "strikeRate": 98.08,
        "fifties": 0, "hundreds": 0, "fours": 25, "sixes": 3, "wickets": 181, "bowlingAvg": 27.23,
        "economy": 7.56, "bestBowling": "5/19", "catches": 38, "stumpings": 0, "recentForm": "A",
        "bestPosition": "Legendary Swing & Control Pacer",
        "strengths": ["Two-time Purple Cap winner", "Elite control and knuckle-ball variations"],
        "weaknesses": ["Loss of outright pace compared to prime years"]
    },
    "Avesh Khan": {
        "matches": 63, "runs": 49, "highScore": 15, "battingAvg": 7.00, "strikeRate": 119.51,
        "fifties": 0, "hundreds": 0, "fours": 3, "sixes": 3, "wickets": 75, "bowlingAvg": 26.56,
        "economy": 8.76, "bestBowling": "4/24", "catches": 15, "stumpings": 0, "recentForm": "A",
        "bestPosition": "Enforcer & Death Specialist",
        "strengths": ["Hard lengths and heavy bouncers", "Reliable execution in the final overs"],
        "weaknesses": ["Vulnerable if line strays down leg side"]
    },
    "Prasidh Krishna": {
        "matches": 51, "runs": 7, "highScore": 4, "battingAvg": 2.33, "strikeRate": 41.18,
        "fifties": 0, "hundreds": 0, "fours": 0, "sixes": 0, "wickets": 49, "bowlingAvg": 34.76,
        "economy": 8.92, "bestBowling": "4/30", "catches": 13, "stumpings": 0, "recentForm": "B+",
        "bestPosition": "Tall Hit-The-Deck Pacer",
        "strengths": ["Steep bounce generated from tall release point", "Hostile middle-overs enforcer"],
        "weaknesses": ["Can concede boundaries when length is missed"]
    }
}

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\stats.js', 'r', encoding='utf-8') as f:
    stats_content = f.read()

# Insert new player stats right after const PLAYER_STATS = {
marker = "const PLAYER_STATS = {"
insert_str = "\n"
for player_name, data in new_player_stats.items():
    json_data = json.dumps(data, indent=8)
    insert_str += f'    "{player_name}": {json_data.strip()},\n'

if marker in stats_content:
    stats_content = stats_content.replace(marker, marker + insert_str)
    with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\stats.js', 'w', encoding='utf-8') as f:
        f.write(stats_content)
    print(f"Added {len(new_player_stats)} new player stats to stats.js successfully.")
else:
    print("Error: marker not found in stats.js")
