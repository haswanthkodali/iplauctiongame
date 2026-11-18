with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """    // Image with reliable SVG vector fallback
    DOM.playerPhoto.src = getPlayerImage(player);

    // Career Stats Ribbon
    const stats = getEnhancedPlayerStats(player);
    if (stats) {
      DOM.statMatches.textContent = stats.matches || '--';
      DOM.statRuns.textContent = stats.runs || 0;
      DOM.statSR.textContent = stats.strikeRate || '--';
      DOM.statAvg.textContent = stats.battingAvg || '--';
      DOM.statMilestones.textContent = `${stats.fifties || 0} / ${stats.hundreds || 0}`;
      DOM.statBowling.textContent = `${stats.wickets || 0} (${stats.economy || '--'})`;
      DOM.playerFormBadge.textContent = `Form: ${stats.recentForm || 'A'}`;
      DOM.playerBestPosBadge.textContent = stats.bestPosition || 'Middle Order';
    }"""

new_block = """    // Image with reliable SVG vector fallback
    DOM.playerPhoto.onerror = function() {
      handlePlayerImageError(this, player);
    };
    DOM.playerPhoto.src = getPlayerImage(player);

    // Dynamic Auctioneer Speech for Current Player
    if (DOM.auctioneerCommentary && (state.currentBid === 0 || !state.currentBidder)) {
      DOM.auctioneerCommentary.textContent = `"${player.name} (${player.role}, ${player.country || 'India'}) is up on the auction block! Base price is set at ₹${Number(player.basePrice || 0.20).toFixed(2)} Crore. Opening bids please!"`;
    }

    // Career Stats Ribbon tailored dynamically to player role
    const stats = getEnhancedPlayerStats(player);
    if (stats) {
      const role = player.role || 'Batsman';
      const lblStat1 = document.getElementById('lblStat1');
      const lblStat2 = document.getElementById('lblStat2');
      const lblStat3 = document.getElementById('lblStat3');
      const lblStat4 = document.getElementById('lblStat4');
      const lblStat5 = document.getElementById('lblStat5');
      const lblStat6 = document.getElementById('lblStat6');

      if (role === 'Bowler') {
        if (lblStat1) lblStat1.textContent = 'Matches';
        if (lblStat2) lblStat2.textContent = 'Wickets';
        if (lblStat3) lblStat3.textContent = 'Economy';
        if (lblStat4) lblStat4.textContent = 'Bowling Avg';
        if (lblStat5) lblStat5.textContent = 'Best Bowling';
        if (lblStat6) lblStat6.textContent = 'Runs Scored';

        DOM.statMatches.textContent = stats.matches || '--';
        DOM.statRuns.textContent = stats.wickets || 0;
        DOM.statSR.textContent = stats.economy || '--';
        DOM.statAvg.textContent = stats.bowlingAvg || '--';
        DOM.statMilestones.textContent = stats.bestBowling || `${Math.min(5, Math.floor((stats.wickets || 20) / 20) + 1)}/${Math.floor((stats.economy || 8) * 2.8)}`;
        DOM.statBowling.textContent = stats.runs || 0;
      } else if (role === 'All-Rounder') {
        if (lblStat1) lblStat1.textContent = 'Matches';
        if (lblStat2) lblStat2.textContent = 'Runs';
        if (lblStat3) lblStat3.textContent = 'Batting SR';
        if (lblStat4) lblStat4.textContent = 'Wickets';
        if (lblStat5) lblStat5.textContent = 'Economy';
        if (lblStat6) lblStat6.textContent = '50s / 100s';

        DOM.statMatches.textContent = stats.matches || '--';
        DOM.statRuns.textContent = stats.runs || 0;
        DOM.statSR.textContent = stats.strikeRate || '--';
        DOM.statAvg.textContent = stats.wickets || 0;
        DOM.statMilestones.textContent = stats.economy || '--';
        DOM.statBowling.textContent = `${stats.fifties || 0} / ${stats.hundreds || 0}`;
      } else if (role === 'Wicket-Keeper') {
        if (lblStat1) lblStat1.textContent = 'Matches';
        if (lblStat2) lblStat2.textContent = 'Runs';
        if (lblStat3) lblStat3.textContent = 'Strike Rate';
        if (lblStat4) lblStat4.textContent = 'Average';
        if (lblStat5) lblStat5.textContent = '50s / 100s';
        if (lblStat6) lblStat6.textContent = 'Dismissals';

        DOM.statMatches.textContent = stats.matches || '--';
        DOM.statRuns.textContent = stats.runs || 0;
        DOM.statSR.textContent = stats.strikeRate || '--';
        DOM.statAvg.textContent = stats.battingAvg || '--';
        DOM.statMilestones.textContent = `${stats.fifties || 0} / ${stats.hundreds || 0}`;
        DOM.statBowling.textContent = `${stats.catches || 0}c / ${stats.stumpings || 0}st`;
      } else { // Batsman
        if (lblStat1) lblStat1.textContent = 'Matches';
        if (lblStat2) lblStat2.textContent = 'Runs';
        if (lblStat3) lblStat3.textContent = 'Strike Rate';
        if (lblStat4) lblStat4.textContent = 'Average';
        if (lblStat5) lblStat5.textContent = '50s / 100s';
        if (lblStat6) lblStat6.textContent = 'High Score';

        DOM.statMatches.textContent = stats.matches || '--';
        DOM.statRuns.textContent = stats.runs || 0;
        DOM.statSR.textContent = stats.strikeRate || '--';
        DOM.statAvg.textContent = stats.battingAvg || '--';
        DOM.statMilestones.textContent = `${stats.fifties || 0} / ${stats.hundreds || 0}`;
        DOM.statBowling.textContent = stats.highScore || `${Math.min(130, Math.floor((stats.battingAvg || 30) * 2.8))}`;
      }

      DOM.playerFormBadge.textContent = `Form: ${stats.recentForm || 'A'}`;
      DOM.playerBestPosBadge.textContent = stats.bestPosition || (role === 'Bowler' ? 'Specialist Bowler' : 'Middle Order');
    }"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Replaced stats and image block in app.js successfully.")
else:
    print("Warning: old_block not found in app.js!")

# Also add onerror="handlePlayerImageError(this)" to template img tags
content = content.replace('<img src="${getPlayerImage(player)}" alt="${player.name}" class="w-full h-full object-cover">',
                          '<img src="${getPlayerImage(player)}" alt="${player.name}" class="w-full h-full object-cover" onerror="handlePlayerImageError(this)">')
content = content.replace('<img src="${getPlayerImage(p)}" alt="${p.name}" class="w-full h-full object-cover">',
                          '<img src="${getPlayerImage(p)}" alt="${p.name}" class="w-full h-full object-cover" onerror="handlePlayerImageError(this)">')
content = content.replace('<img src="${getPlayerImage(p)}" alt="${p.name}" class="w-8 h-8 rounded-lg object-cover">',
                          '<img src="${getPlayerImage(p)}" alt="${p.name}" class="w-8 h-8 rounded-lg object-cover" onerror="handlePlayerImageError(this)">')
content = content.replace('<img src="${getPlayerImage(np)}" class="w-4 h-4 rounded-full object-cover">',
                          '<img src="${getPlayerImage(np)}" class="w-4 h-4 rounded-full object-cover" onerror="handlePlayerImageError(this)">')

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished app.js updates.")
