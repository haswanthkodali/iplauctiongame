with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\game.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update GameState initialization in initGame
old_init = """    GameState.speed = Math.max(1, Math.min(3, config.speed || 1));
    GameState.auctionMode = (config.auctionMode || 'MEGA').toUpperCase();"""

new_init = """    GameState.speed = Math.max(1, Math.min(3, config.speed || 1));
    GameState.auctionMode = (config.auctionMode || 'MEGA').toUpperCase();
    GameState.aiBiddingEnabled = config.aiBidding === true; // AI bidding removed by default"""

code = code.replace(old_init, new_init)

# 2. Update evaluateAIBidding to exit immediately if aiBiddingEnabled is false
old_eval = """  function evaluateAIBidding() {
    if (GameState.isPaused || GameState.isSold || GameState.isUnsold) return;"""

new_eval = """  function evaluateAIBidding() {
    // AI bidding disabled - only human players place bids
    if (!GameState.aiBiddingEnabled) return;
    if (GameState.isPaused || GameState.isSold || GameState.isUnsold) return;"""

code = code.replace(old_eval, new_eval)

# 3. Add setAiBidding function and exports
old_export = """    rateSquad,"""
new_export = """    rateSquad,
    setAiBidding: (enabled) => { GameState.aiBiddingEnabled = !!enabled; return GameState.aiBiddingEnabled; },"""

code = code.replace(old_export, new_export)

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\game.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated game.js to remove AI bidding.")
