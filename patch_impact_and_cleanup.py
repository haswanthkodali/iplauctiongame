with open('app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's add the lock/submit hook that cleans data and stores top 5 bids + buys + ratings into history
target_lock = "AppState.userTeamRatings[team.id] = evaluation;\n        saveAppState();"

replacement_lock = """AppState.userTeamRatings[team.id] = evaluation;
        saveAppState();

        // Save cleaned auction history (top 5 bids, buys, ratings, auctioneer name) & cleanup scratch data
        try {
          const allTeams = (typeof Game !== 'undefined' && Game.getTeams) ? Game.getTeams() : [];
          const userTeamObj = (typeof Game !== 'undefined' && Game.getTeam) ? Game.getTeam(team.id) : team;
          
          // Collect top 5 bids from log
          const logs = (typeof Game !== 'undefined' && Game.getLogs) ? Game.getLogs() : [];
          const bidLogs = logs.filter(l => l.type === 'bid' && l.bid > 0);
          bidLogs.sort((a, b) => (b.bid || 0) - (a.bid || 0));
          const top5 = bidLogs.slice(0, 5).map(l => ({
            name: l.player?.name || 'Player',
            teamId: l.teamId || l.team?.shortName || 'Team',
            price: l.bid || 0
          }));

          // All auctioneer buys
          const allBuys = (userTeamObj.players || []).map(p => ({
            name: p.name,
            role: p.role,
            overseas: !!p.overseas,
            price: p.soldPrice || p.price || 0
          }));

          const auctioneerName = localStorage.getItem('ipl_user_name') || 'Manager';
          StorageEngine.saveCleanedAuctionHistory({
            roomId: window.CurrentRoom?.roomId || 'IPL-2027',
            auctioneerName,
            mode: AppState.auctionMode || 'Mini',
            userTeam: team.id,
            totalSpent: userTeamObj.spent || 0,
            squadCount: (userTeamObj.players || []).length,
            aiRating: evaluation.finalRating || 92,
            userRating: evaluation.tier || 'A-Tier',
            top5Bids: top5,
            allBuys
          });

          // Refresh history list on home page
          renderHomeAuctionHistory();
        } catch (e) {
          console.warn('History save warning:', e);
        }"""

if target_lock in code:
    code = code.replace(target_lock, replacement_lock)
    print("Locked submit Playing XI hooked to cleaned history!")
else:
    print("Warning: target_lock not found exactly, check syntax")

# Bind PDF and PNG download buttons in Ratings view
download_bindings = """
    // PDF & PNG Download Buttons in Ratings
    const btnPdf = document.getElementById('btnDownloadPdfReport');
    const btnPng = document.getElementById('btnDownloadPngCard');
    if (btnPdf) btnPdf.onclick = () => downloadAuctionReportPDF();
    if (btnPng) btnPng.onclick = () => downloadAuctionReportPNG();

    // Impact Player Picker Button
    const btnImpact = document.getElementById('btnPickImpactPlayer');
    if (btnImpact) {
      btnImpact.onclick = () => {
        const team = Game.getTeam(AppState.selectedPlaying11TeamId) || Game.getUserTeam();
        if (!team || !team.players || team.players.length === 0) {
          alert('No players in squad to select as Impact Player.');
          return;
        }
        const userXI = getUserXIForTeam(team.id);
        const xiNames = userXI.filter(Boolean).map(p => p.name);
        const bench = team.players.filter(p => !xiNames.includes(p.name));

        if (bench.length === 0) {
          alert('All squad players are already assigned to the starting XI. Add more bench players to select an Impact Player.');
          return;
        }

        const promptList = bench.map((p, i) => `${i + 1}. ${p.name} (${p.role || 'Player'}) - ₹${Number(p.soldPrice || p.price || 0).toFixed(2)} Cr`).join('\\n');
        const choice = prompt(`Select Impact Player from Bench:\\n\\n${promptList}\\n\\nEnter player number (1-${bench.length}):`);
        const num = parseInt(choice, 10);
        if (num >= 1 && num <= bench.length) {
          const selected = bench[num - 1];
          AppState.impactPlayer = selected;
          const nameEl = document.getElementById('impactPlayerName');
          if (nameEl) nameEl.innerHTML = `<span class="text-amber-300 font-extrabold">${selected.name}</span> (${selected.role || 'Player'}) • Selected from Bench`;
          AuctionAudio.playBidPaddle();
        }
      };
    }
"""

# Append to DOMContentLoaded setup in app.js
code += "\n" + download_bindings

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("app.js updated with cleanup history hook and Impact Player picker!")
