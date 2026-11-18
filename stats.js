// ============================================================
// IPL AUCTION GAME - PLAYER STATS & TEAM DATA
// Real IPL career statistics (approximate through IPL 2025)
// ============================================================

const PLAYER_STATS = {

    // =====================================================
    // MARQUEE BATSMEN
    // =====================================================

    "Virat Kohli": {
        matches: 252, runs: 8004, highScore: 113, battingAvg: 37.25, strikeRate: 131.61,
        fifties: 55, hundreds: 8, fours: 726, sixes: 265,
        wickets: 4, bowlingAvg: 64.50, economy: 8.82,
        catches: 118, stumpings: 0,
        recentForm: "A+",
        auctionHistory: [
            { year: 2024, team: "RCB", price: 0 },
            { year: 2022, team: "RCB", price: 15.00 },
            { year: 2011, team: "RCB", price: 0 }
        ],
        strengths: ["Chase master", "Anchor innings", "Big-match player", "Fitness", "Consistency across seasons"],
        weaknesses: ["Struggles vs left-arm pace early", "Slower starts in powerplay recently"],
        t20iStats: { matches: 125, runs: 4008, avg: 48.69, sr: 139.04 },
        bestPosition: "Top Order (1-3)",
        impactScore: 95
    },

    "Rohit Sharma": {
        matches: 243, runs: 6628, highScore: 109, battingAvg: 29.50, strikeRate: 130.39,
        fifties: 42, hundreds: 2, fours: 548, sixes: 299,
        wickets: 15, bowlingAvg: 34.80, economy: 7.56,
        catches: 68, stumpings: 0,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "MI", price: 16.30 },
            { year: 2018, team: "MI", price: 15.00 },
            { year: 2011, team: "MI", price: 0 }
        ],
        strengths: ["Explosive opener", "Pull shot specialist", "Big-match temperament", "Leadership"],
        weaknesses: ["Vulnerable to swing in first few overs", "Inconsistent form recently"],
        t20iStats: { matches: 159, runs: 4231, avg: 32.05, sr: 140.89 },
        bestPosition: "Top Order (1-2)",
        impactScore: 90
    },

    "KL Rahul": {
        matches: 132, runs: 4683, highScore: 132, battingAvg: 44.60, strikeRate: 134.61,
        fifties: 37, hundreds: 4, fours: 412, sixes: 171,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 52, stumpings: 21,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "LSG", price: 0 },
            { year: 2022, team: "LSG", price: 17.00 },
            { year: 2020, team: "PBKS", price: 11.00 }
        ],
        strengths: ["Technically sound", "Can keep wickets", "Versatile batting", "Consistent run-scorer"],
        weaknesses: ["Strike rate concerns in powerplay", "Slow acceleration at times"],
        t20iStats: { matches: 76, runs: 2265, avg: 37.75, sr: 139.12 },
        bestPosition: "Top Order (1-3)",
        impactScore: 84
    },

    "Shubman Gill": {
        matches: 98, runs: 3272, highScore: 129, battingAvg: 36.36, strikeRate: 131.80,
        fifties: 22, hundreds: 3, fours: 302, sixes: 115,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 42, stumpings: 0,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "GT", price: 0 },
            { year: 2022, team: "GT", price: 8.00 },
            { year: 2018, team: "KKR", price: 1.80 }
        ],
        strengths: ["Elegant stroke play", "360-degree batting", "Young and improving", "Good vs spin"],
        weaknesses: ["Occasional slow innings", "Death bowling vulnerability against pace"],
        t20iStats: { matches: 52, runs: 1452, avg: 33.77, sr: 137.21 },
        bestPosition: "Top Order (1-3)",
        impactScore: 85
    },

    "Suryakumar Yadav": {
        matches: 163, runs: 5326, highScore: 103, battingAvg: 32.68, strikeRate: 150.33,
        fifties: 33, hundreds: 2, fours: 429, sixes: 283,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 62, stumpings: 0,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "MI", price: 0 },
            { year: 2022, team: "MI", price: 8.00 },
            { year: 2018, team: "MI", price: 3.20 }
        ],
        strengths: ["360-degree batting", "Elite strike rate", "Impact in middle overs", "Ramp/scoop shots"],
        weaknesses: ["Inconsistency at No.3", "Struggles on slow pitches sometimes"],
        t20iStats: { matches: 72, runs: 2546, avg: 43.90, sr: 167.67 },
        bestPosition: "Middle Order (3-5)",
        impactScore: 92
    },

    "Faf du Plessis": {
        matches: 145, runs: 4571, highScore: 96, battingAvg: 31.52, strikeRate: 134.53,
        fifties: 37, hundreds: 0, fours: 435, sixes: 160,
        wickets: 1, bowlingAvg: 48.00, economy: 10.29,
        catches: 65, stumpings: 0,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "RCB", price: 0 },
            { year: 2022, team: "RCB", price: 7.00 },
            { year: 2019, team: "CSK", price: 1.60 }
        ],
        strengths: ["Reliable opener", "Leadership", "Fielding", "Big tournament experience"],
        weaknesses: ["Age factor (40+)", "Power-hitting decline", "Pace against short ball"],
        t20iStats: { matches: 50, runs: 1528, avg: 33.21, sr: 132.46 },
        bestPosition: "Top Order (1-2)",
        impactScore: 72
    },

    "David Warner": {
        matches: 184, runs: 6565, highScore: 126, battingAvg: 41.20, strikeRate: 139.96,
        fifties: 44, hundreds: 4, fours: 679, sixes: 231,
        wickets: 2, bowlingAvg: 61.00, economy: 10.50,
        catches: 82, stumpings: 0,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "DC", price: 6.25 },
            { year: 2022, team: "DC", price: 6.25 },
            { year: 2014, team: "SRH", price: 5.50 }
        ],
        strengths: ["Aggressive opener", "Consistent performer", "Big-match experience", "Runs against pace"],
        weaknesses: ["Age factor (38+)", "Struggles vs quality spin", "Fielding declining"],
        t20iStats: { matches: 99, runs: 3005, avg: 33.39, sr: 142.47 },
        bestPosition: "Top Order (1-2)",
        impactScore: 75
    },

    "Jos Buttler": {
        matches: 107, runs: 3597, highScore: 124, battingAvg: 38.68, strikeRate: 150.56,
        fifties: 22, hundreds: 5, fours: 316, sixes: 198,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 48, stumpings: 15,
        recentForm: "A-",
        auctionHistory: [
            { year: 2024, team: "RR", price: 0 },
            { year: 2022, team: "RR", price: 10.00 },
            { year: 2018, team: "RR", price: 4.40 }
        ],
        strengths: ["Match-winning ability", "Elite strike rate", "Can keep wickets", "Power in powerplay"],
        weaknesses: ["Fitness concerns", "Inconsistent patches", "Slow starts on spin-friendly tracks"],
        t20iStats: { matches: 115, runs: 3220, avg: 36.59, sr: 144.27 },
        bestPosition: "Top Order (1-2)",
        impactScore: 88
    },

    "Travis Head": {
        matches: 32, runs: 1092, highScore: 102, battingAvg: 37.66, strikeRate: 160.47,
        fifties: 7, hundreds: 1, fours: 112, sixes: 55,
        wickets: 5, bowlingAvg: 28.40, economy: 7.90,
        catches: 14, stumpings: 0,
        recentForm: "A+",
        auctionHistory: [
            { year: 2024, team: "SRH", price: 0 },
            { year: 2023, team: "SRH", price: 6.80 }
        ],
        strengths: ["Ultra-aggressive opener", "Impact player", "Left-hand option", "Big-match runs"],
        weaknesses: ["Limited IPL track record", "Can get out playing big shots early"],
        t20iStats: { matches: 35, runs: 985, avg: 30.78, sr: 155.60 },
        bestPosition: "Top Order (1-2)",
        impactScore: 83
    },

    "Yashasvi Jaiswal": {
        matches: 55, runs: 1915, highScore: 104, battingAvg: 32.46, strikeRate: 153.72,
        fifties: 12, hundreds: 2, fours: 195, sixes: 93,
        wickets: 2, bowlingAvg: 42.00, economy: 9.10,
        catches: 22, stumpings: 0,
        recentForm: "A+",
        auctionHistory: [
            { year: 2024, team: "RR", price: 0 },
            { year: 2022, team: "RR", price: 4.00 },
            { year: 2020, team: "RR", price: 2.40 }
        ],
        strengths: ["Explosive left-hand opener", "Powerplay dominator", "Young talent", "360-degree game"],
        weaknesses: ["Inexperience in big pressure finals", "Can be reckless vs quality swing"],
        t20iStats: { matches: 28, runs: 882, avg: 35.28, sr: 161.17 },
        bestPosition: "Top Order (1-2)",
        impactScore: 87
    },

    "Sanju Samson": {
        matches: 168, runs: 4505, highScore: 119, battingAvg: 29.64, strikeRate: 136.87,
        fifties: 25, hundreds: 4, fours: 374, sixes: 198,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 78, stumpings: 42,
        recentForm: "A-",
        auctionHistory: [
            { year: 2024, team: "RR", price: 0 },
            { year: 2022, team: "RR", price: 14.00 },
            { year: 2018, team: "RR", price: 8.00 }
        ],
        strengths: ["WK-batsman", "Explosive hitting", "Leadership experience", "Indian player value"],
        weaknesses: ["Inconsistency", "Shot selection issues", "Soft dismissals"],
        t20iStats: { matches: 40, runs: 1200, avg: 36.36, sr: 148.70 },
        bestPosition: "Top Order (1-3) / WK",
        impactScore: 80
    },

    "Ruturaj Gaikwad": {
        matches: 76, runs: 2718, highScore: 108, battingAvg: 39.39, strikeRate: 136.80,
        fifties: 18, hundreds: 2, fours: 268, sixes: 95,
        wickets: 1, bowlingAvg: 36.00, economy: 8.44,
        catches: 25, stumpings: 0,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "CSK", price: 0 },
            { year: 2022, team: "CSK", price: 6.00 },
            { year: 2019, team: "CSK", price: 0.20 }
        ],
        strengths: ["Elegant timing", "Reliable opener", "Orange Cap winner", "CSK's future captain"],
        weaknesses: ["Struggles vs express pace", "Slow starts sometimes", "Limited overseas exposure"],
        t20iStats: { matches: 18, runs: 420, avg: 28.00, sr: 131.25 },
        bestPosition: "Top Order (1-2)",
        impactScore: 81
    },

    "Abhishek Sharma": {
        matches: 65, runs: 1784, highScore: 115, battingAvg: 28.77, strikeRate: 158.72,
        fifties: 7, hundreds: 2, fours: 148, sixes: 112,
        wickets: 18, bowlingAvg: 32.44, economy: 7.95,
        catches: 22, stumpings: 0,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "SRH", price: 0 },
            { year: 2022, team: "SRH", price: 6.50 },
            { year: 2020, team: "SRH", price: 0.20 }
        ],
        strengths: ["Explosive left-hand batting", "Powerplay impact", "Can bowl spin", "Young and powerful"],
        weaknesses: ["Inconsistency", "Bowling not reliable", "Technique against short ball"],
        t20iStats: { matches: 15, runs: 385, avg: 27.50, sr: 165.24 },
        bestPosition: "Top Order (1-3)",
        impactScore: 78
    },

    "Devon Conway": {
        matches: 44, runs: 1362, highScore: 92, battingAvg: 32.43, strikeRate: 130.84,
        fifties: 10, hundreds: 0, fours: 132, sixes: 46,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 18, stumpings: 0,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "CSK", price: 0 },
            { year: 2023, team: "CSK", price: 1.00 },
            { year: 2022, team: "CSK", price: 1.00 }
        ],
        strengths: ["Technically solid", "Left-hand option", "Reliable top order", "Good vs spin"],
        weaknesses: ["Strike rate concerns", "Not ultra-aggressive", "Limited power game at death"],
        t20iStats: { matches: 32, runs: 870, avg: 31.07, sr: 128.70 },
        bestPosition: "Top Order (1-3)",
        impactScore: 72
    },

    "Quinton de Kock": {
        matches: 118, runs: 3157, highScore: 140, battingAvg: 30.36, strikeRate: 137.26,
        fifties: 18, hundreds: 2, fours: 305, sixes: 134,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 48, stumpings: 24,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "LSG", price: 0 },
            { year: 2022, team: "LSG", price: 6.75 },
            { year: 2020, team: "MI", price: 2.80 }
        ],
        strengths: ["WK-batsman", "Aggressive opener", "Powerplay impact", "Left-hand advantage"],
        weaknesses: ["Retired from internationals", "Inconsistent middle phase", "Age factor"],
        t20iStats: { matches: 79, runs: 1991, avg: 28.44, sr: 138.67 },
        bestPosition: "Top Order (1-2) / WK",
        impactScore: 76
    },

    "Heinrich Klaasen": {
        matches: 46, runs: 1672, highScore: 104, battingAvg: 37.16, strikeRate: 171.47,
        fifties: 10, hundreds: 1, fours: 112, sixes: 118,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 18, stumpings: 6,
        recentForm: "A+",
        auctionHistory: [
            { year: 2024, team: "SRH", price: 0 },
            { year: 2023, team: "SRH", price: 0.50 }
        ],
        strengths: ["Elite power-hitter", "Best vs spin in world", "Death overs impact", "WK option"],
        weaknesses: ["Overseas slot", "Limited IPL sample", "Can struggle vs quality pace early"],
        t20iStats: { matches: 38, runs: 1098, avg: 36.60, sr: 164.17 },
        bestPosition: "Middle Order (4-6)",
        impactScore: 89
    },

    "Phil Salt": {
        matches: 32, runs: 1218, highScore: 89, battingAvg: 38.06, strikeRate: 173.86,
        fifties: 10, hundreds: 0, fours: 118, sixes: 82,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 12, stumpings: 5,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "RCB", price: 11.50 },
            { year: 2023, team: "DC", price: 2.00 }
        ],
        strengths: ["Ultra-aggressive opener", "Devastating powerplay", "WK option", "Elite T20 strike rate"],
        weaknesses: ["Overseas slot", "Limited IPL experience", "Can be boom-or-bust"],
        t20iStats: { matches: 42, runs: 1380, avg: 32.86, sr: 165.07 },
        bestPosition: "Top Order (1-2) / WK",
        impactScore: 84
    },

    // =====================================================
    // MARQUEE BOWLERS
    // =====================================================

    "Jasprit Bumrah": {
        matches: 133, runs: 56, highScore: 10, battingAvg: 5.60, strikeRate: 80.00,
        fifties: 0, hundreds: 0, fours: 4, sixes: 2,
        wickets: 165, bowlingAvg: 23.29, economy: 7.39,
        catches: 20, stumpings: 0,
        recentForm: "A+",
        auctionHistory: [
            { year: 2024, team: "MI", price: 0 },
            { year: 2022, team: "MI", price: 12.00 },
            { year: 2013, team: "MI", price: 0 }
        ],
        strengths: ["Best death bowler in IPL", "Yorker specialist", "Economical", "Big-match temperament"],
        weaknesses: ["Injury concerns", "Limited batting", "Workload management needed"],
        t20iStats: { matches: 68, runs: 6, avg: 3.00, sr: 42.86, wickets: 89, bowlAvg: 16.68, bowlSR: 14.20, bowlEcon: 7.05 },
        bestPosition: "Death Bowler / Powerplay Bowler",
        impactScore: 97
    },

    "Mohammed Shami": {
        matches: 110, runs: 52, highScore: 11, battingAvg: 5.78, strikeRate: 100.00,
        fifties: 0, hundreds: 0, fours: 4, sixes: 2,
        wickets: 130, bowlingAvg: 26.92, economy: 8.42,
        catches: 18, stumpings: 0,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "SRH", price: 10.00 },
            { year: 2022, team: "GT", price: 6.25 },
            { year: 2019, team: "PBKS", price: 4.80 }
        ],
        strengths: ["Swing bowling", "Powerplay wickets", "Seam movement", "Experience"],
        weaknesses: ["Injury prone", "Economy at death", "Fitness concerns post-surgery"],
        t20iStats: { matches: 28, runs: 4, avg: 2.00, sr: 50.00, wickets: 32, bowlAvg: 22.00, bowlSR: 16.60, bowlEcon: 7.95 },
        bestPosition: "Powerplay Bowler / New Ball",
        impactScore: 80
    },

    "Yuzvendra Chahal": {
        matches: 160, runs: 69, highScore: 8, battingAvg: 4.60, strikeRate: 76.67,
        fifties: 0, hundreds: 0, fours: 6, sixes: 2,
        wickets: 205, bowlingAvg: 22.28, economy: 7.72,
        catches: 42, stumpings: 0,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "PBKS", price: 18.50 },
            { year: 2022, team: "RR", price: 6.50 },
            { year: 2014, team: "RCB", price: 0.10 }
        ],
        strengths: ["Highest IPL wicket-taker", "Leg-spin mastery", "Middle overs control", "Wicket-taking ability"],
        weaknesses: ["No batting contribution", "Can be expensive on flat tracks", "Fielding liability"],
        t20iStats: { matches: 80, runs: 5, avg: 2.50, sr: 55.56, wickets: 96, bowlAvg: 24.75, bowlSR: 17.50, bowlEcon: 8.49 },
        bestPosition: "Spin Bowler (Middle Overs)",
        impactScore: 82
    },

    "Rashid Khan": {
        matches: 118, runs: 625, highScore: 40, battingAvg: 15.63, strikeRate: 158.23,
        fifties: 0, hundreds: 0, fours: 32, sixes: 46,
        wickets: 136, bowlingAvg: 20.68, economy: 6.56,
        catches: 35, stumpings: 0,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "GT", price: 0 },
            { year: 2022, team: "GT", price: 15.00 },
            { year: 2017, team: "SRH", price: 4.00 }
        ],
        strengths: ["Best T20 spinner globally", "Elite economy", "Lower-order hitting", "Googly deception"],
        weaknesses: ["Overseas slot", "Less effective on flat batting tracks", "Captaincy burden"],
        t20iStats: { matches: 82, runs: 215, avg: 15.36, sr: 155.80, wickets: 131, bowlAvg: 13.72, bowlSR: 12.60, bowlEcon: 6.53 },
        bestPosition: "Spin Bowler (All Phases)",
        impactScore: 93
    },

    "Kagiso Rabada": {
        matches: 76, runs: 61, highScore: 12, battingAvg: 5.08, strikeRate: 101.67,
        fifties: 0, hundreds: 0, fours: 5, sixes: 3,
        wickets: 102, bowlingAvg: 22.84, economy: 8.17,
        catches: 14, stumpings: 0,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "GT", price: 10.75 },
            { year: 2022, team: "PBKS", price: 9.25 },
            { year: 2019, team: "DC", price: 4.20 }
        ],
        strengths: ["Express pace", "Death bowling", "Wicket-taking", "Purple Cap winner"],
        weaknesses: ["Overseas slot", "Can be expensive in middle overs", "Workload management"],
        t20iStats: { matches: 42, runs: 18, avg: 6.00, sr: 90.00, wickets: 48, bowlAvg: 24.17, bowlSR: 16.80, bowlEcon: 8.63 },
        bestPosition: "Death Bowler / Powerplay Bowler",
        impactScore: 86
    },

    "Pat Cummins": {
        matches: 50, runs: 374, highScore: 56, battingAvg: 16.26, strikeRate: 139.55,
        fifties: 1, hundreds: 0, fours: 25, sixes: 24,
        wickets: 56, bowlingAvg: 29.75, economy: 8.76,
        catches: 12, stumpings: 0,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "SRH", price: 0 },
            { year: 2023, team: "SRH", price: 20.50 },
            { year: 2020, team: "KKR", price: 15.50 }
        ],
        strengths: ["All-round ability", "Leadership (SRH captain)", "Death bowling", "Big-match performer"],
        weaknesses: ["Overseas slot", "Economy rate", "Fitness/availability across full season"],
        t20iStats: { matches: 56, runs: 178, avg: 14.83, sr: 142.40, wickets: 61, bowlAvg: 25.80, bowlSR: 18.40, bowlEcon: 8.41 },
        bestPosition: "Pace Bowler / Lower Order",
        impactScore: 82
    },

    "Trent Boult": {
        matches: 95, runs: 56, highScore: 14, battingAvg: 4.31, strikeRate: 93.33,
        fifties: 0, hundreds: 0, fours: 7, sixes: 1,
        wickets: 110, bowlingAvg: 25.45, economy: 8.07,
        catches: 22, stumpings: 0,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "MI", price: 12.00 },
            { year: 2022, team: "RR", price: 8.00 },
            { year: 2020, team: "MI", price: 5.00 }
        ],
        strengths: ["Swing in powerplay", "New ball specialist", "Left-arm angle", "Experience"],
        weaknesses: ["Overseas slot", "Death overs economy", "Age factor (35+)"],
        t20iStats: { matches: 56, runs: 20, avg: 5.00, sr: 71.43, wickets: 62, bowlAvg: 24.90, bowlSR: 17.10, bowlEcon: 8.73 },
        bestPosition: "Powerplay Bowler / New Ball",
        impactScore: 78
    },

    "Mohammed Siraj": {
        matches: 95, runs: 32, highScore: 7, battingAvg: 4.00, strikeRate: 69.57,
        fifties: 0, hundreds: 0, fours: 3, sixes: 1,
        wickets: 95, bowlingAvg: 29.47, economy: 8.68,
        catches: 15, stumpings: 0,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "GT", price: 12.25 },
            { year: 2022, team: "RCB", price: 7.00 },
            { year: 2017, team: "SRH", price: 2.60 }
        ],
        strengths: ["Swing bowling", "Powerplay specialist", "Improving death bowling", "Indian fast bowler premium"],
        weaknesses: ["Economy at death", "Can be expensive on flat pitches", "Prone to bad spells"],
        t20iStats: { matches: 32, runs: 4, avg: 2.00, sr: 44.44, wickets: 36, bowlAvg: 25.44, bowlSR: 16.00, bowlEcon: 9.54 },
        bestPosition: "Powerplay Bowler",
        impactScore: 72
    },

    "Kuldeep Yadav": {
        matches: 80, runs: 48, highScore: 12, battingAvg: 4.80, strikeRate: 80.00,
        fifties: 0, hundreds: 0, fours: 4, sixes: 1,
        wickets: 85, bowlingAvg: 25.65, economy: 8.12,
        catches: 18, stumpings: 0,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "DC", price: 0 },
            { year: 2022, team: "DC", price: 2.00 },
            { year: 2018, team: "KKR", price: 5.80 }
        ],
        strengths: ["Left-arm wrist spin", "Deceptive googly", "Wicket-taker in middle overs", "Improving consistently"],
        weaknesses: ["Can be hit in death overs", "Fielding average", "Confidence can dip"],
        t20iStats: { matches: 42, runs: 12, avg: 4.00, sr: 60.00, wickets: 56, bowlAvg: 18.86, bowlSR: 14.80, bowlEcon: 7.65 },
        bestPosition: "Spin Bowler (Middle Overs)",
        impactScore: 80
    },

    "Arshdeep Singh": {
        matches: 72, runs: 15, highScore: 6, battingAvg: 2.50, strikeRate: 68.18,
        fifties: 0, hundreds: 0, fours: 1, sixes: 0,
        wickets: 86, bowlingAvg: 25.52, economy: 8.86,
        catches: 10, stumpings: 0,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "PBKS", price: 0 },
            { year: 2022, team: "PBKS", price: 4.00 },
            { year: 2019, team: "PBKS", price: 0.20 }
        ],
        strengths: ["Death overs yorker", "Left-arm pace", "T20 World Cup hero", "Young and improving"],
        weaknesses: ["Economy in middle overs", "Can leak runs in powerplay", "Limited batting"],
        t20iStats: { matches: 58, runs: 5, avg: 2.50, sr: 55.56, wickets: 79, bowlAvg: 18.14, bowlSR: 13.60, bowlEcon: 8.00 },
        bestPosition: "Death Bowler / Powerplay Bowler",
        impactScore: 83
    },

    "Bhuvneshwar Kumar": {
        matches: 176, runs: 325, highScore: 36, battingAvg: 10.48, strikeRate: 101.56,
        fifties: 0, hundreds: 0, fours: 28, sixes: 10,
        wickets: 181, bowlingAvg: 27.53, economy: 7.37,
        catches: 32, stumpings: 0,
        recentForm: "C+",
        auctionHistory: [
            { year: 2024, team: "SRH", price: 0 },
            { year: 2022, team: "SRH", price: 4.20 },
            { year: 2011, team: "SRH", price: 0 }
        ],
        strengths: ["Swing bowling master", "Most economical Indian pacer", "Powerplay wickets", "Experience"],
        weaknesses: ["Pace decline", "Injury history", "Death overs less effective now", "Age factor"],
        t20iStats: { matches: 87, runs: 42, avg: 7.00, sr: 93.33, wickets: 90, bowlAvg: 24.33, bowlSR: 18.80, bowlEcon: 7.76 },
        bestPosition: "Powerplay Bowler / New Ball",
        impactScore: 65
    },

    "Noor Ahmad": {
        matches: 24, runs: 12, highScore: 6, battingAvg: 4.00, strikeRate: 85.71,
        fifties: 0, hundreds: 0, fours: 1, sixes: 0,
        wickets: 28, bowlingAvg: 23.57, economy: 7.42,
        catches: 8, stumpings: 0,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "GT", price: 0 },
            { year: 2023, team: "GT", price: 0.30 }
        ],
        strengths: ["Young left-arm wrist spinner", "Deceptive variations", "Economical", "Afghan spin pedigree"],
        weaknesses: ["Overseas slot", "Limited IPL experience", "Young and can be pressured"],
        t20iStats: { matches: 22, runs: 8, avg: 4.00, sr: 72.73, wickets: 30, bowlAvg: 18.67, bowlSR: 13.80, bowlEcon: 8.12 },
        bestPosition: "Spin Bowler (Middle/Death)",
        impactScore: 76
    },

    "Wanindu Hasaranga": {
        matches: 32, runs: 192, highScore: 26, battingAvg: 10.67, strikeRate: 141.18,
        fifties: 0, hundreds: 0, fours: 12, sixes: 14,
        wickets: 38, bowlingAvg: 22.89, economy: 8.08,
        catches: 10, stumpings: 0,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "SRH", price: 1.50 },
            { year: 2022, team: "RCB", price: 10.75 }
        ],
        strengths: ["All-round T20 skills", "Leg-spin + batting", "Wicket-taking threat", "Big Bash/Intl experience"],
        weaknesses: ["Overseas slot", "Inconsistent in IPL", "Can be expensive on flat pitches"],
        t20iStats: { matches: 56, runs: 345, avg: 12.32, sr: 141.80, wickets: 72, bowlAvg: 18.42, bowlSR: 14.20, bowlEcon: 7.78 },
        bestPosition: "Spin All-Rounder",
        impactScore: 74
    },

    "Adam Zampa": {
        matches: 22, runs: 18, highScore: 8, battingAvg: 4.50, strikeRate: 90.00,
        fifties: 0, hundreds: 0, fours: 2, sixes: 0,
        wickets: 24, bowlingAvg: 26.75, economy: 7.68,
        catches: 6, stumpings: 0,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "RR", price: 0 },
            { year: 2023, team: "RR", price: 1.50 }
        ],
        strengths: ["Leg-spin variety", "Big Bash/Intl experience", "Control bowler", "Smart cricketer"],
        weaknesses: ["Overseas slot", "Limited IPL impact", "Not a wicket-taker in IPL"],
        t20iStats: { matches: 72, runs: 12, avg: 4.00, sr: 66.67, wickets: 82, bowlAvg: 22.07, bowlSR: 16.20, bowlEcon: 8.17 },
        bestPosition: "Spin Bowler (Middle Overs)",
        impactScore: 68
    },

    "Mustafizur Rahman": {
        matches: 82, runs: 20, highScore: 7, battingAvg: 2.86, strikeRate: 58.82,
        fifties: 0, hundreds: 0, fours: 2, sixes: 0,
        wickets: 92, bowlingAvg: 25.78, economy: 7.72,
        catches: 12, stumpings: 0,
        recentForm: "A-",
        auctionHistory: [
            { year: 2024, team: "CSK", price: 2.00 },
            { year: 2023, team: "DC", price: 2.00 },
            { year: 2021, team: "RR", price: 1.00 }
        ],
        strengths: ["Cutters specialist", "Death overs variations", "Left-arm pace", "Economical"],
        weaknesses: ["Overseas slot", "Lacks express pace", "Can be hit on good pitches"],
        t20iStats: { matches: 65, runs: 8, avg: 2.67, sr: 44.44, wickets: 85, bowlAvg: 19.18, bowlSR: 14.60, bowlEcon: 7.88 },
        bestPosition: "Death Bowler / Middle Overs",
        impactScore: 74
    },

    "Tushar Deshpande": {
        matches: 55, runs: 18, highScore: 8, battingAvg: 3.00, strikeRate: 69.23,
        fifties: 0, hundreds: 0, fours: 2, sixes: 0,
        wickets: 60, bowlingAvg: 29.83, economy: 9.42,
        catches: 8, stumpings: 0,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "CSK", price: 0 },
            { year: 2023, team: "CSK", price: 0.20 },
            { year: 2020, team: "DC", price: 0.20 }
        ],
        strengths: ["Wicket-taker", "Aggressive bowling", "CSK death overs role", "Indian fast bowler"],
        weaknesses: ["High economy", "Can be expensive", "Erratic line and length"],
        t20iStats: { matches: 5, runs: 2, avg: 1.00, sr: 40.00, wickets: 6, bowlAvg: 24.00, bowlSR: 15.00, bowlEcon: 9.60 },
        bestPosition: "Death Bowler / Powerplay",
        impactScore: 65
    },

    "Avesh Khan": {
        matches: 72, runs: 28, highScore: 10, battingAvg: 3.50, strikeRate: 80.00,
        fifties: 0, hundreds: 0, fours: 3, sixes: 1,
        wickets: 82, bowlingAvg: 26.46, economy: 8.88,
        catches: 12, stumpings: 0,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "RR", price: 0 },
            { year: 2022, team: "LSG", price: 10.00 },
            { year: 2021, team: "DC", price: 0.20 }
        ],
        strengths: ["Pace and bounce", "Wicket-taking ability", "Powerplay threat", "Indian pacer value"],
        weaknesses: ["Economy rate", "Death bowling under pressure", "Fitness concerns"],
        t20iStats: { matches: 8, runs: 2, avg: 1.00, sr: 33.33, wickets: 10, bowlAvg: 22.80, bowlSR: 14.40, bowlEcon: 9.50 },
        bestPosition: "Powerplay Bowler",
        impactScore: 68
    },

    "Harshal Patel": {
        matches: 115, runs: 350, highScore: 34, battingAvg: 10.94, strikeRate: 121.53,
        fifties: 0, hundreds: 0, fours: 22, sixes: 22,
        wickets: 142, bowlingAvg: 23.44, economy: 8.56,
        catches: 22, stumpings: 0,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "PBKS", price: 11.75 },
            { year: 2022, team: "RCB", price: 10.75 },
            { year: 2021, team: "RCB", price: 0.20 }
        ],
        strengths: ["Death overs specialist", "Slower ball variations", "Purple Cap winner", "Lower-order batting"],
        weaknesses: ["Lacks express pace", "Can be predictable", "Not effective in powerplay"],
        t20iStats: { matches: 12, runs: 25, avg: 8.33, sr: 104.17, wickets: 14, bowlAvg: 24.07, bowlSR: 16.70, bowlEcon: 8.65 },
        bestPosition: "Death Bowler",
        impactScore: 73
    },

    // =====================================================
    // MARQUEE ALL-ROUNDERS
    // =====================================================

    "Hardik Pandya": {
        matches: 132, runs: 2525, highScore: 91, battingAvg: 27.72, strikeRate: 148.82,
        fifties: 10, hundreds: 0, fours: 182, sixes: 142,
        wickets: 65, bowlingAvg: 29.23, economy: 8.98,
        catches: 48, stumpings: 0,
        recentForm: "A-",
        auctionHistory: [
            { year: 2024, team: "MI", price: 0 },
            { year: 2022, team: "GT", price: 15.00 },
            { year: 2015, team: "MI", price: 0.10 }
        ],
        strengths: ["Genuine all-rounder", "Finishing ability", "Pace bowling + power hitting", "Leadership"],
        weaknesses: ["Injury prone", "Bowling fitness concerns", "Inconsistent captaincy"],
        t20iStats: { matches: 85, runs: 1148, avg: 24.43, sr: 141.38, wickets: 56, bowlAvg: 25.86, bowlSR: 18.20, bowlEcon: 8.52 },
        bestPosition: "Finisher (5-7) / Pace All-Rounder",
        impactScore: 89
    },

    "Ravindra Jadeja": {
        matches: 232, runs: 2692, highScore: 62, battingAvg: 24.47, strikeRate: 128.00,
        fifties: 5, hundreds: 0, fours: 196, sixes: 128,
        wickets: 155, bowlingAvg: 29.84, economy: 7.60,
        catches: 92, stumpings: 0,
        recentForm: "A-",
        auctionHistory: [
            { year: 2024, team: "CSK", price: 0 },
            { year: 2022, team: "CSK", price: 16.00 },
            { year: 2012, team: "CSK", price: 12.60 }
        ],
        strengths: ["Complete all-rounder", "Best fielder in IPL", "Left-arm spin", "Lower-order finishing"],
        weaknesses: ["Strike rate can be low", "Less effective with bat early in innings", "Age factor"],
        t20iStats: { matches: 74, runs: 515, avg: 17.17, sr: 125.61, wickets: 51, bowlAvg: 27.65, bowlSR: 20.60, bowlEcon: 8.05 },
        bestPosition: "Spin All-Rounder (5-7)",
        impactScore: 85
    },

    "Andre Russell": {
        matches: 118, runs: 2500, highScore: 88, battingAvg: 27.17, strikeRate: 174.83,
        fifties: 10, hundreds: 0, fours: 148, sixes: 196,
        wickets: 72, bowlingAvg: 28.50, economy: 8.95,
        catches: 42, stumpings: 0,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "KKR", price: 0 },
            { year: 2022, team: "KKR", price: 12.00 },
            { year: 2014, team: "KKR", price: 0.60 }
        ],
        strengths: ["T20 legend", "Devastating power", "Pace bowling option", "X-factor match winner"],
        weaknesses: ["Injury prone", "Age factor (36+)", "Fitness declining", "Overseas slot"],
        t20iStats: { matches: 71, runs: 940, avg: 18.80, sr: 165.49, wickets: 25, bowlAvg: 32.00, bowlSR: 22.40, bowlEcon: 8.57 },
        bestPosition: "Finisher (5-7) / Pace All-Rounder",
        impactScore: 82
    },

    "Glenn Maxwell": {
        matches: 130, runs: 2698, highScore: 95, battingAvg: 24.07, strikeRate: 155.74,
        fifties: 10, hundreds: 0, fours: 178, sixes: 170,
        wickets: 28, bowlingAvg: 36.57, economy: 8.14,
        catches: 55, stumpings: 0,
        recentForm: "C+",
        auctionHistory: [
            { year: 2024, team: "PBKS", price: 4.80 },
            { year: 2021, team: "RCB", price: 14.25 },
            { year: 2020, team: "PBKS", price: 10.75 }
        ],
        strengths: ["Explosive batting", "360-degree shots", "Part-time off-spin", "Match-winning innings"],
        weaknesses: ["Inconsistency", "Overseas slot", "Can have prolonged bad patches", "Mental health factors"],
        t20iStats: { matches: 102, runs: 2232, avg: 26.57, sr: 155.44, wickets: 14, bowlAvg: 42.00, bowlSR: 28.60, bowlEcon: 8.81 },
        bestPosition: "Middle Order (3-5) / Off-Spin",
        impactScore: 76
    },

    "Marcus Stoinis": {
        matches: 65, runs: 1507, highScore: 89, battingAvg: 27.40, strikeRate: 141.86,
        fifties: 7, hundreds: 0, fours: 124, sixes: 68,
        wickets: 20, bowlingAvg: 36.90, economy: 9.12,
        catches: 24, stumpings: 0,
        recentForm: "A-",
        auctionHistory: [
            { year: 2024, team: "LSG", price: 0 },
            { year: 2022, team: "LSG", price: 9.20 },
            { year: 2020, team: "DC", price: 4.80 }
        ],
        strengths: ["Power hitting", "Pace bowling option", "Big-match temperament", "Finishing ability"],
        weaknesses: ["Overseas slot", "Bowling inconsistent", "Can be tied down by spin"],
        t20iStats: { matches: 52, runs: 952, avg: 25.73, sr: 143.17, wickets: 15, bowlAvg: 38.40, bowlSR: 24.60, bowlEcon: 9.37 },
        bestPosition: "Middle Order (4-6) / Pace All-Rounder",
        impactScore: 77
    },

    "Axar Patel": {
        matches: 135, runs: 1230, highScore: 65, battingAvg: 18.65, strikeRate: 131.70,
        fifties: 2, hundreds: 0, fours: 85, sixes: 68,
        wickets: 100, bowlingAvg: 28.90, economy: 7.28,
        catches: 32, stumpings: 0,
        recentForm: "A-",
        auctionHistory: [
            { year: 2024, team: "DC", price: 0 },
            { year: 2022, team: "DC", price: 12.00 },
            { year: 2019, team: "DC", price: 5.00 }
        ],
        strengths: ["Economical left-arm spin", "Lower-order hitting", "Accurate bowling", "Indian all-rounder value"],
        weaknesses: ["Limited upper-order batting", "Not a match-winner with bat", "Flat tracks less effective"],
        t20iStats: { matches: 52, runs: 268, avg: 16.75, sr: 141.05, wickets: 42, bowlAvg: 25.57, bowlSR: 18.40, bowlEcon: 8.34 },
        bestPosition: "Spin All-Rounder (6-7)",
        impactScore: 76
    },

    "Liam Livingstone": {
        matches: 42, runs: 925, highScore: 78, battingAvg: 23.72, strikeRate: 158.90,
        fifties: 3, hundreds: 0, fours: 62, sixes: 65,
        wickets: 12, bowlingAvg: 34.33, economy: 8.52,
        catches: 15, stumpings: 0,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "RCB", price: 8.75 },
            { year: 2022, team: "PBKS", price: 11.50 },
            { year: 2021, team: "PBKS", price: 0 }
        ],
        strengths: ["Explosive power hitter", "Can bowl both leg and off spin", "Match-winning ability", "Big six hitter"],
        weaknesses: ["Overseas slot", "Inconsistency", "Injury prone", "Struggles vs quality pace"],
        t20iStats: { matches: 42, runs: 882, avg: 23.84, sr: 148.74, wickets: 8, bowlAvg: 38.75, bowlSR: 26.00, bowlEcon: 8.94 },
        bestPosition: "Middle Order (4-6) / Part-time Spinner",
        impactScore: 74
    },

    "Mitchell Marsh": {
        matches: 32, runs: 672, highScore: 89, battingAvg: 24.00, strikeRate: 142.68,
        fifties: 3, hundreds: 0, fours: 55, sixes: 32,
        wickets: 10, bowlingAvg: 38.40, economy: 9.14,
        catches: 10, stumpings: 0,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "DC", price: 0 },
            { year: 2023, team: "DC", price: 6.50 }
        ],
        strengths: ["T20 World Cup-winning captain", "Power batting", "Medium pace option", "Leadership"],
        weaknesses: ["Overseas slot", "Injury history", "Bowling unreliable", "IPL record inconsistent"],
        t20iStats: { matches: 46, runs: 1024, avg: 28.44, sr: 141.44, wickets: 12, bowlAvg: 36.00, bowlSR: 24.00, bowlEcon: 9.00 },
        bestPosition: "Top/Middle Order (3-5) / Medium Pace",
        impactScore: 70
    },

    "Shardul Thakur": {
        matches: 95, runs: 442, highScore: 36, battingAvg: 10.52, strikeRate: 134.15,
        fifties: 0, hundreds: 0, fours: 32, sixes: 28,
        wickets: 86, bowlingAvg: 29.84, economy: 8.78,
        catches: 22, stumpings: 0,
        recentForm: "B-",
        auctionHistory: [
            { year: 2024, team: "CSK", price: 4.00 },
            { year: 2022, team: "DC", price: 10.75 },
            { year: 2018, team: "CSK", price: 2.60 }
        ],
        strengths: ["Wicket-taking ability", "Lower-order batting", "Indian fast bowling all-rounder", "Swing bowling"],
        weaknesses: ["Expensive at death", "Inconsistent line/length", "Fitness concerns"],
        t20iStats: { matches: 28, runs: 68, avg: 9.71, sr: 125.93, wickets: 30, bowlAvg: 27.33, bowlSR: 17.60, bowlEcon: 9.32 },
        bestPosition: "Pace All-Rounder (7-8)",
        impactScore: 67
    },

    "Washington Sundar": {
        matches: 72, runs: 668, highScore: 50, battingAvg: 16.70, strikeRate: 118.44,
        fifties: 1, hundreds: 0, fours: 55, sixes: 25,
        wickets: 55, bowlingAvg: 28.47, economy: 6.98,
        catches: 18, stumpings: 0,
        recentForm: "A-",
        auctionHistory: [
            { year: 2024, team: "SRH", price: 0 },
            { year: 2022, team: "SRH", price: 8.75 },
            { year: 2017, team: "RCB", price: 3.20 }
        ],
        strengths: ["Powerplay off-spin specialist", "Economy in first 6 overs", "Useful lower-order bat", "Young Indian all-rounder"],
        weaknesses: ["Limited death bowling", "Batting inconsistent", "Not a big wicket-taker"],
        t20iStats: { matches: 32, runs: 198, avg: 12.38, sr: 118.56, wickets: 28, bowlAvg: 24.00, bowlSR: 18.00, bowlEcon: 8.00 },
        bestPosition: "Spin All-Rounder (6-7) / Powerplay Spinner",
        impactScore: 73
    },

    "Venkatesh Iyer": {
        matches: 50, runs: 1044, highScore: 67, battingAvg: 22.70, strikeRate: 131.65,
        fifties: 5, hundreds: 0, fours: 92, sixes: 42,
        wickets: 12, bowlingAvg: 38.50, economy: 9.22,
        catches: 15, stumpings: 0,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "KKR", price: 0 },
            { year: 2022, team: "KKR", price: 8.00 },
            { year: 2021, team: "KKR", price: 0.20 }
        ],
        strengths: ["Left-hand batting", "Pace bowling option", "Opening/finishing versatility", "Indian all-rounder"],
        weaknesses: ["Bowling declining", "Inconsistent form", "Technique concerns vs bounce"],
        t20iStats: { matches: 10, runs: 175, avg: 21.88, sr: 125.00, wickets: 2, bowlAvg: 48.00, bowlSR: 30.00, bowlEcon: 9.60 },
        bestPosition: "Top/Middle Order (1-5) / Medium Pace",
        impactScore: 68
    },

    "Sam Curran": {
        matches: 55, runs: 455, highScore: 55, battingAvg: 15.69, strikeRate: 142.63,
        fifties: 1, hundreds: 0, fours: 38, sixes: 24,
        wickets: 55, bowlingAvg: 29.09, economy: 8.52,
        catches: 18, stumpings: 0,
        recentForm: "B+",
        auctionHistory: [
            { year: 2024, team: "CSK", price: 0 },
            { year: 2023, team: "PBKS", price: 18.50 },
            { year: 2020, team: "CSK", price: 5.50 }
        ],
        strengths: ["Left-arm pace all-rounder", "Death overs bowling", "Lower-order hitting", "T20 WC Player of Tournament"],
        weaknesses: ["Overseas slot", "Lacks express pace", "Can be expensive", "IPL form inconsistent"],
        t20iStats: { matches: 42, runs: 332, avg: 14.43, sr: 148.21, wickets: 48, bowlAvg: 24.17, bowlSR: 16.80, bowlEcon: 8.63 },
        bestPosition: "Pace All-Rounder (6-8)",
        impactScore: 76
    },

    "Cameron Green": {
        matches: 22, runs: 452, highScore: 56, battingAvg: 22.60, strikeRate: 139.51,
        fifties: 2, hundreds: 0, fours: 38, sixes: 22,
        wickets: 8, bowlingAvg: 38.75, economy: 9.30,
        catches: 8, stumpings: 0,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "RCB", price: 17.50 },
            { year: 2023, team: "MI", price: 17.50 }
        ],
        strengths: ["Tall pace all-rounder", "Power batting", "Bounce extract", "Young talent"],
        weaknesses: ["Overseas slot", "Back injury history", "Limited IPL experience", "Bowling fitness concerns"],
        t20iStats: { matches: 22, runs: 384, avg: 21.33, sr: 139.13, wickets: 8, bowlAvg: 35.75, bowlSR: 22.00, bowlEcon: 9.75 },
        bestPosition: "Top/Middle Order (3-5) / Pace All-Rounder",
        impactScore: 72
    },

    // =====================================================
    // WICKET-KEEPERS (additional entries not already above)
    // =====================================================

    "MS Dhoni": {
        matches: 264, runs: 5243, highScore: 84, battingAvg: 39.12, strikeRate: 135.20,
        fifties: 24, hundreds: 0, fours: 349, sixes: 272,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 132, stumpings: 42,
        recentForm: "C",
        auctionHistory: [
            { year: 2024, team: "CSK", price: 0 },
            { year: 2022, team: "CSK", price: 12.00 },
            { year: 2008, team: "CSK", price: 6.00 }
        ],
        strengths: ["IPL's greatest captain", "Finishing legend", "WK skills", "Calm under pressure"],
        weaknesses: ["Age (43+)", "Very limited role now", "Power declining", "May retire any time"],
        t20iStats: { matches: 98, runs: 1617, avg: 37.60, sr: 126.13 },
        bestPosition: "Finisher (5-7) / WK / Captain",
        impactScore: 70
    },

    "Rishabh Pant": {
        matches: 115, runs: 3500, highScore: 128, battingAvg: 35.35, strikeRate: 150.65,
        fifties: 18, hundreds: 2, fours: 288, sixes: 165,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 62, stumpings: 25,
        recentForm: "A",
        auctionHistory: [
            { year: 2024, team: "LSG", price: 27.00 },
            { year: 2022, team: "DC", price: 16.00 },
            { year: 2016, team: "DC", price: 1.90 }
        ],
        strengths: ["Match-winning ability", "Explosive left-hand bat", "WK skills", "Fearless approach"],
        weaknesses: ["Shot selection", "Can throw wicket away", "Keeping consistency"],
        t20iStats: { matches: 72, runs: 1252, avg: 23.15, sr: 127.35 },
        bestPosition: "Top/Middle Order (3-5) / WK",
        impactScore: 90
    },

    "Ishan Kishan": {
        matches: 101, runs: 2778, highScore: 99, battingAvg: 28.35, strikeRate: 137.14,
        fifties: 16, hundreds: 0, fours: 242, sixes: 122,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 42, stumpings: 18,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "MI", price: 0 },
            { year: 2022, team: "MI", price: 15.25 },
            { year: 2018, team: "MI", price: 6.20 }
        ],
        strengths: ["Aggressive WK-bat", "Left-hand option", "Powerplay impact", "Young and explosive"],
        weaknesses: ["Inconsistency", "Shot selection under pressure", "Mental toughness concerns"],
        t20iStats: { matches: 32, runs: 788, avg: 26.27, sr: 133.56 },
        bestPosition: "Top Order (1-3) / WK",
        impactScore: 73
    },

    "Dinesh Karthik": {
        matches: 257, runs: 4842, highScore: 97, battingAvg: 25.88, strikeRate: 134.44,
        fifties: 22, hundreds: 0, fours: 390, sixes: 198,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 118, stumpings: 38,
        recentForm: "C",
        auctionHistory: [
            { year: 2024, team: "RCB", price: 0 },
            { year: 2022, team: "RCB", price: 5.50 },
            { year: 2018, team: "KKR", price: 7.40 }
        ],
        strengths: ["Finishing specialist", "WK experience", "Calm head", "IPL veteran"],
        weaknesses: ["Age (39+)", "Likely retired", "Limited role", "Declining reflexes"],
        t20iStats: { matches: 60, runs: 686, avg: 26.38, sr: 141.57 },
        bestPosition: "Finisher (5-7) / WK",
        impactScore: 55
    },

    "Jonny Bairstow": {
        matches: 42, runs: 1250, highScore: 108, battingAvg: 32.89, strikeRate: 142.05,
        fifties: 7, hundreds: 1, fours: 112, sixes: 55,
        wickets: 0, bowlingAvg: 0, economy: 0,
        catches: 15, stumpings: 5,
        recentForm: "B",
        auctionHistory: [
            { year: 2024, team: "PBKS", price: 6.75 },
            { year: 2023, team: "PBKS", price: 6.75 },
            { year: 2019, team: "SRH", price: 2.20 }
        ],
        strengths: ["Power hitting", "WK option", "England T20 experience", "Top-order impact"],
        weaknesses: ["Overseas slot", "Injury history", "Inconsistent IPL form", "Keeping not primary"],
        t20iStats: { matches: 46, runs: 1178, avg: 28.73, sr: 139.60 },
        bestPosition: "Top Order (1-3) / WK",
        impactScore: 68
    }
};

// ============================================================
// TEAM HISTORY - All 10 IPL Teams
// ============================================================

const TEAM_HISTORY = {

    "CSK": {
        titles: 5,
        finals: 10,
        playoffAppearances: 13,
        winPercentage: 59.6,
        bestSeason: "2023 (Champions)",
        recentSeasons: [
            { year: 2025, position: 5 },
            { year: 2024, position: 5 },
            { year: 2023, position: 1 }
        ],
        historicalStrength: "Spin bowling, experienced squad, calm leadership under Dhoni",
        pastAuctionStrategy: "Target experienced Indian core + specialist overseas players",
        retentionHistory2024: ["MS Dhoni", "Ruturaj Gaikwad", "Ravindra Jadeja", "Shivam Dube"],
        teamRating: 82
    },

    "MI": {
        titles: 5,
        finals: 6,
        playoffAppearances: 13,
        winPercentage: 57.2,
        bestSeason: "2020 (Champions)",
        recentSeasons: [
            { year: 2025, position: 7 },
            { year: 2024, position: 10 },
            { year: 2023, position: 10 }
        ],
        historicalStrength: "Pace bowling, big-match mentality, strong core retention",
        pastAuctionStrategy: "Build around Indian stars, invest heavily in pace bowling",
        retentionHistory2024: ["Rohit Sharma", "Jasprit Bumrah", "Suryakumar Yadav", "Hardik Pandya", "Tilak Varma"],
        teamRating: 78
    },

    "RCB": {
        titles: 0,
        finals: 3,
        playoffAppearances: 8,
        winPercentage: 46.8,
        bestSeason: "2016 (Finalist)",
        recentSeasons: [
            { year: 2025, position: 4 },
            { year: 2024, position: 4 },
            { year: 2023, position: 7 }
        ],
        historicalStrength: "Star power, batting-heavy line-ups, passionate fan base",
        pastAuctionStrategy: "Big spending on marquee players, often unbalanced squads",
        retentionHistory2024: ["Virat Kohli", "Rajat Patidar", "Yash Dayal"],
        teamRating: 75
    },

    "KKR": {
        titles: 3,
        finals: 4,
        playoffAppearances: 10,
        winPercentage: 51.5,
        bestSeason: "2024 (Champions)",
        recentSeasons: [
            { year: 2025, position: 3 },
            { year: 2024, position: 1 },
            { year: 2023, position: 7 }
        ],
        historicalStrength: "Spin bowling, mystery spinners, explosive batting",
        pastAuctionStrategy: "Smart picks, invest in emerging talent, strong spin department",
        retentionHistory2024: ["Rinku Singh", "Varun Chakravarthy", "Sunil Narine", "Andre Russell", "Harshit Rana", "Ramandeep Singh"],
        teamRating: 85
    },

    "DC": {
        titles: 0,
        finals: 1,
        playoffAppearances: 5,
        winPercentage: 44.3,
        bestSeason: "2020 (Finalist)",
        recentSeasons: [
            { year: 2025, position: 9 },
            { year: 2024, position: 6 },
            { year: 2023, position: 9 }
        ],
        historicalStrength: "Young Indian talent development, pace bowling",
        pastAuctionStrategy: "Invest in young Indian core, overseas pace support",
        retentionHistory2024: ["Axar Patel", "Kuldeep Yadav", "Tristan Stubbs", "Abhishek Porel"],
        teamRating: 68
    },

    "PBKS": {
        titles: 0,
        finals: 1,
        playoffAppearances: 3,
        winPercentage: 44.9,
        bestSeason: "2014 (Finalist)",
        recentSeasons: [
            { year: 2025, position: 8 },
            { year: 2024, position: 9 },
            { year: 2023, position: 6 }
        ],
        historicalStrength: "Aggressive auction strategy, underdog spirit",
        pastAuctionStrategy: "Big spending on marquee overseas, inconsistent strategy across seasons",
        retentionHistory2024: ["Shikhar Dhawan", "Prabhsimran Singh"],
        teamRating: 62
    },

    "RR": {
        titles: 1,
        finals: 3,
        playoffAppearances: 7,
        winPercentage: 49.2,
        bestSeason: "2022 (Finalist)",
        recentSeasons: [
            { year: 2025, position: 6 },
            { year: 2024, position: 4 },
            { year: 2023, position: 5 }
        ],
        historicalStrength: "Scouting and analytics-driven approach, smart squad building",
        pastAuctionStrategy: "Data-driven picks, undervalued Indian talent, balanced squad",
        retentionHistory2024: ["Sanju Samson", "Yashasvi Jaiswal", "Riyan Parag", "Dhruv Jurel", "Shimron Hetmyer", "Sandeep Sharma"],
        teamRating: 76
    },

    "SRH": {
        titles: 1,
        finals: 3,
        playoffAppearances: 8,
        winPercentage: 50.5,
        bestSeason: "2016 (Champions)",
        recentSeasons: [
            { year: 2025, position: 2 },
            { year: 2024, position: 2 },
            { year: 2023, position: 8 }
        ],
        historicalStrength: "Pace bowling attack, explosive batting in recent seasons",
        pastAuctionStrategy: "Invest in overseas pace, build around power batting",
        retentionHistory2024: ["Pat Cummins", "Abhishek Sharma", "Travis Head", "Heinrich Klaasen", "Nitish Kumar Reddy"],
        teamRating: 84
    },

    "GT": {
        titles: 1,
        finals: 2,
        playoffAppearances: 2,
        winPercentage: 55.6,
        bestSeason: "2022 (Champions)",
        recentSeasons: [
            { year: 2025, position: 10 },
            { year: 2024, position: 8 },
            { year: 2023, position: 2 }
        ],
        historicalStrength: "Team balance, never-say-die attitude, smart captaincy",
        pastAuctionStrategy: "Value-based picks, strong Indian core, tactical overseas signings",
        retentionHistory2024: ["Rashid Khan", "Shubman Gill", "Sai Sudharsan", "Rahul Tewatia", "Shahrukh Khan"],
        teamRating: 72
    },

    "LSG": {
        titles: 0,
        finals: 0,
        playoffAppearances: 2,
        winPercentage: 50.0,
        bestSeason: "2022 (Eliminator)",
        recentSeasons: [
            { year: 2025, position: 1 },
            { year: 2024, position: 3 },
            { year: 2023, position: 3 }
        ],
        historicalStrength: "Indian batting strength, well-rounded squad composition",
        pastAuctionStrategy: "High investment in star Indian players, balanced overseas picks",
        retentionHistory2024: ["Nicholas Pooran", "Ravi Bishnoi", "Mayank Yadav", "Mohsin Khan", "Ayush Badoni"],
        teamRating: 80
    }
};

// ============================================================
// AUCTIONEER STRATEGY - AI Bidding Logic & Squad Planning
// ============================================================

const AUCTIONEER_STRATEGY = {

    // Priority scoring for each role position
    positionPriority: {
        "Opener": { importance: 95, minRequired: 2, idealCount: 3 },
        "No.3": { importance: 90, minRequired: 1, idealCount: 2 },
        "Middle Order (4-5)": { importance: 85, minRequired: 2, idealCount: 3 },
        "Finisher (6-7)": { importance: 88, minRequired: 2, idealCount: 3 },
        "Powerplay Bowler": { importance: 85, minRequired: 2, idealCount: 3 },
        "Death Bowler": { importance: 92, minRequired: 2, idealCount: 3 },
        "Spin Bowler": { importance: 80, minRequired: 2, idealCount: 3 },
        "Wicket-Keeper": { importance: 75, minRequired: 1, idealCount: 2 }
    },

    // Value calculation formula weights
    valueWeights: {
        playerRating: 0.30,
        recentForm: 0.25,
        teamNeed: 0.20,
        ageAndLongevity: 0.10,
        matchWinningAbility: 0.15
    },

    // Mini auction specific: 40% past team data, 60% playing XI strength
    miniAuctionWeights: {
        pastTeamData: 0.40,
        playingXIStrength: 0.60
    },

    // Playing XI template
    idealXI: {
        slots: [
            { position: 1, role: "Opener/WK-Bat", batting: "aggressive", overseas: "optional" },
            { position: 2, role: "Opener", batting: "aggressive", overseas: "optional" },
            { position: 3, role: "No.3 Anchor", batting: "anchor", overseas: "optional" },
            { position: 4, role: "Middle Order", batting: "power", overseas: "optional" },
            { position: 5, role: "Middle Order/WK", batting: "power", overseas: "optional" },
            { position: 6, role: "All-Rounder", batting: "finisher", bowling: "medium/spin", overseas: "optional" },
            { position: 7, role: "All-Rounder", batting: "finisher", bowling: "medium/spin", overseas: "optional" },
            { position: 8, role: "Bowler/Lower Order", batting: "tail", bowling: "specialist", overseas: "optional" },
            { position: 9, role: "Bowler", batting: "tail", bowling: "specialist", overseas: "optional" },
            { position: 10, role: "Bowler", batting: "tail", bowling: "specialist", overseas: "optional" },
            { position: 11, role: "Bowler", batting: "tail", bowling: "specialist", overseas: "optional" }
        ],
        maxOverseas: 4,
        composition: "2-3 openers, 1-2 anchors, 2-3 finishers, 2-3 pacers, 1-2 spinners, 1 WK minimum"
    },

    // Form rating conversion
    formRatings: {
        "A+": 1.0,
        "A": 0.9,
        "A-": 0.85,
        "B+": 0.75,
        "B": 0.65,
        "B-": 0.55,
        "C+": 0.45,
        "C": 0.35,
        "C-": 0.25,
        "D": 0.15
    },

    // Budget allocation strategy (out of 120 Cr total purse)
    budgetStrategy: {
        marqueeSlots: { maxSpend: 50, description: "Top 2-3 marquee signings" },
        coreSquad: { maxSpend: 40, description: "4-6 core squad players" },
        depth: { maxSpend: 20, description: "5-7 squad depth players" },
        budget: { maxSpend: 10, description: "3-5 budget/uncapped picks" },
        emergencyReserve: 5
    },

    // Overseas slot management
    overseasStrategy: {
        maxInSquad: 8,
        maxInXI: 4,
        priorityRoles: ["Death Bowler", "Power Hitter", "Spin Bowler"],
        avoidDoubling: "Don't pick 2 overseas players for same role unless elite"
    }
};

// ============================================================
// HELPER: Get player stat by name
// ============================================================

function getPlayerStats(playerName) {
    return PLAYER_STATS[playerName] || null;
}

function getTeamHistory(teamCode) {
    return TEAM_HISTORY[teamCode] || null;
}

function calculatePlayerValue(playerName, teamNeeds) {
    const stats = PLAYER_STATS[playerName];
    if (!stats) return 0;

    const weights = AUCTIONEER_STRATEGY.valueWeights;
    const formValue = AUCTIONEER_STRATEGY.formRatings[stats.recentForm] || 0.5;

    let value = 0;
    value += (stats.impactScore / 100) * weights.playerRating;
    value += formValue * weights.recentForm;
    value += (teamNeeds || 0.5) * weights.teamNeed;
    value += (stats.impactScore > 80 ? 0.8 : 0.5) * weights.matchWinningAbility;
    value += 0.6 * weights.ageAndLongevity; // default age factor

    return Math.round(value * 100) / 100;
}

/**
 * Enhanced Player Stats Generator
 * Returns rich authentic stats for all 200+ players.
 * If in PLAYER_STATS, returns that. Otherwise procedurally synthesizes realistic
 * IPL/T20 stats matching their rating, role, and speciality.
 */
function getEnhancedPlayerStats(player) {
    if (!player) return null;
    const name = typeof player === 'string' ? player : player.name;
    if (PLAYER_STATS[name]) {
        return { ...PLAYER_STATS[name], name };
    }

    const p = typeof player === 'object' ? player : { name, role: 'Batsman', rating: 75, overseas: false };
    const role = p.role || 'Batsman';
    const rating = p.rating || 75;
    const batRating = p.battingRating || (role === 'Batsman' ? rating : Math.max(30, rating - 25));
    const bowlRating = p.bowlingRating || (role === 'Bowler' ? rating : Math.max(25, rating - 30));

    // Realistic procedural stats based on ratings
    const matches = Math.floor(18 + (rating - 70) * 3.5);
    const runs = role === 'Bowler' ? Math.floor(matches * 6.5) : Math.floor(matches * (batRating * 0.32));
    const battingAvg = role === 'Bowler' ? 12.4 : +(batRating * 0.36).toFixed(2);
    const strikeRate = +(115 + (batRating - 50) * 0.65).toFixed(2);
    const fifties = role === 'Bowler' ? 0 : Math.max(0, Math.floor((runs / 320)));
    const hundreds = (batRating > 90 && role !== 'Bowler') ? 1 : 0;
    const fours = Math.floor(runs * 0.09);
    const sixes = Math.floor(runs * 0.04);

    const wickets = (role === 'Batsman' && !role.includes('All-Rounder')) ? Math.floor(matches * 0.05) : Math.floor(matches * (bowlRating * 0.015));
    const economy = +(9.8 - (bowlRating - 50) * 0.045).toFixed(2);
    const bowlingAvg = wickets > 0 ? +(22 + (100 - bowlRating) * 0.25).toFixed(2) : 0;

    const formScore = rating > 88 ? "A+" : rating > 82 ? "A" : rating > 76 ? "B+" : "B";

    return {
        name: p.name,
        matches,
        runs,
        highScore: role === 'Bowler' ? 34 : Math.min(124, Math.floor(batRating * 1.05)),
        battingAvg,
        strikeRate,
        fifties,
        hundreds,
        fours,
        sixes,
        wickets,
        bowlingAvg,
        economy,
        catches: Math.floor(matches * 0.45),
        stumpings: role === 'Wicket-Keeper' ? Math.floor(matches * 0.22) : 0,
        recentForm: formScore,
        auctionHistory: [
            { year: 2024, team: p.overseas ? "Overseas Star" : "Domestic Talent", price: p.basePrice || 0.5 }
        ],
        strengths: [
            p.speciality || (role === 'Batsman' ? "Power hitter & boundary finder" : role === 'Bowler' ? "Wicket taking strike bowler" : "Dynamic dual-threat all-rounder"),
            p.overseas ? "International franchise experience" : "Domestic Indian circuit performer"
        ],
        weaknesses: ["Adaptability under extreme pressure"],
        t20iStats: { matches: Math.floor(matches * 0.4), runs: Math.floor(runs * 0.35), avg: battingAvg, sr: strikeRate },
        bestPosition: role === 'Batsman' ? "Top Order (1-3)" : role === 'All-Rounder' ? "Middle Order (5-7)" : "Specialist Bowler (8-11)",
        impactScore: rating
    };
}

// Global Exports
if (typeof window !== 'undefined') {
    window.PLAYER_STATS = PLAYER_STATS;
    window.TEAM_HISTORY = TEAM_HISTORY;
    window.AUCTIONEER_STRATEGY = AUCTIONEER_STRATEGY;
    window.getPlayerStats = getPlayerStats;
    window.getTeamHistory = getTeamHistory;
    window.calculatePlayerValue = calculatePlayerValue;
    window.getEnhancedPlayerStats = getEnhancedPlayerStats;
}
if (typeof globalThis !== 'undefined') {
    globalThis.PLAYER_STATS = PLAYER_STATS;
    globalThis.TEAM_HISTORY = TEAM_HISTORY;
    globalThis.AUCTIONEER_STRATEGY = AUCTIONEER_STRATEGY;
    globalThis.getPlayerStats = getPlayerStats;
    globalThis.getTeamHistory = getTeamHistory;
    globalThis.calculatePlayerValue = calculatePlayerValue;
    globalThis.getEnhancedPlayerStats = getEnhancedPlayerStats;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PLAYER_STATS,
        TEAM_HISTORY,
        AUCTIONEER_STRATEGY,
        getPlayerStats,
        getTeamHistory,
        calculatePlayerValue,
        getEnhancedPlayerStats
    };
}
