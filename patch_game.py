with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add bidDuration to GameState initialization
content = content.replace("speed: 1,", "speed: 1,\n    bidDuration: 10,")

# 2. Update line 627: startTimer(15) -> startTimer(GameState.bidDuration || 10)
content = content.replace("startTimer(15);", "startTimer(GameState.bidDuration || 10);")

# 3. Update line 687: GameState.timeLeft = 15 -> GameState.timeLeft = GameState.bidDuration || 10
content = content.replace("GameState.timeLeft = 15;", "GameState.timeLeft = GameState.bidDuration || 10;")

# 4. In placeBid, add rule checks & reset countdown to bidDuration
old_place_bid_check = """    if (nextBid > roundCr(remainingPurse - reserveNeeded)) {
      return false;
    }

    // Update auction state
    GameState.currentBid = nextBid;
    GameState.currentBidder = bidderId;

    // Reset countdown to allow counter-bids
    GameState.timeLeft = 10;"""

new_place_bid_check = """    if (nextBid > roundCr(remainingPurse - reserveNeeded)) {
      return false;
    }

    // Spectator Check (Spectators cannot place bids)
    if (typeof window !== 'undefined' && window.AppState && window.AppState.isSpectator) {
      if (typeof window.showBiddingRuleAlert === 'function') {
        window.showBiddingRuleAlert('Spectators cannot place bids in the auction.');
      }
      return false;
    }

    // Room Rule 1: Maximum Bid Amount Limit
    if (typeof window !== 'undefined' && window.RoomRules && window.RoomRules.maxBidEnabled && window.RoomRules.maxBidAmount) {
      if (nextBid > window.RoomRules.maxBidAmount) {
        if (typeof window.showBiddingRuleAlert === 'function') {
          window.showBiddingRuleAlert(`Bid ₹${Number(nextBid).toFixed(2)} Cr exceeds room maximum ceiling of ₹${window.RoomRules.maxBidAmount}.00 Cr!`);
        }
        return false;
      }
    }

    // Room Rule 2: Limit on number of players exceeding threshold amount
    if (typeof window !== 'undefined' && window.RoomRules && window.RoomRules.exceedLimitEnabled && window.RoomRules.exceedThreshold && window.RoomRules.exceedMaxPlayers) {
      if (nextBid > window.RoomRules.exceedThreshold) {
        const countExceed = (team.players || []).filter(p => (p.soldPrice || p.price || 0) > window.RoomRules.exceedThreshold).length;
        if (countExceed >= window.RoomRules.exceedMaxPlayers) {
          if (typeof window.showBiddingRuleAlert === 'function') {
            window.showBiddingRuleAlert(`${team.shortName || team.name} reached max limit of ${window.RoomRules.exceedMaxPlayers} players above ₹${window.RoomRules.exceedThreshold}.00 Cr!`);
          }
          return false;
        }
      }
    }

    // Update auction state
    GameState.currentBid = nextBid;
    GameState.currentBidder = bidderId;

    // Reset countdown to allow counter-bids based on host timer
    GameState.timeLeft = GameState.bidDuration || 10;"""

if old_place_bid_check in content:
    content = content.replace(old_place_bid_check, new_place_bid_check)
    print("placeBid updated with room rules and dynamic timer!")
else:
    print("Warning: old_place_bid_check not found exactly, will use regex or search")

# 5. Add setBidDuration, releasePlayerFromTeam, nominateUnsoldPlayer helpers
helpers = """
  function setBidDuration(seconds) {
    GameState.bidDuration = Math.max(5, Math.min(60, Number(seconds) || 10));
    GameState.timeLeft = GameState.bidDuration;
    emit('bidDurationChange', { duration: GameState.bidDuration });
  }

  function getBidDuration() {
    return GameState.bidDuration || 10;
  }

  /**
   * Release player from a team squad (refunds amount to team purse)
   * Note: Pre-retained players in Mini Auction cannot be released!
   */
  function releasePlayerFromTeam(teamId, playerId) {
    const team = getTeam(teamId);
    if (!team) return { success: false, error: 'Team not found' };

    const pIdx = team.players.findIndex(p => (p.id === playerId || p.name === playerId));
    if (pIdx === -1) return { success: false, error: 'Player not in team' };

    const player = team.players[pIdx];
    // Check if retained player
    if (player.isRetained) {
      return { success: false, error: 'Pre-retained core players cannot be released.' };
    }

    const refundAmount = player.soldPrice || player.price || 0;
    team.spent = roundCr(Math.max(0, (team.spent || 0) - refundAmount));
    if (player.overseas) {
      team.overseas = Math.max(0, (team.overseas || 0) - 1);
    }
    team.players.splice(pIdx, 1);

    // Return player to unsold pool at base price
    player.status = 'unsold';
    player.soldPrice = 0;
    delete player.soldTo;

    if (!GameState.unsold.find(p => p.id === player.id)) {
      GameState.unsold.push(player);
    }

    addLog({
      type: 'release',
      message: `💸 ${team.shortName || team.name} released ${player.name} (₹${refundAmount.toFixed(2)} Cr refunded to purse)`
    });

    emit('playerReleased', { team, player, refundAmount });
    emit('stateChange', GameState);
    return { success: true, refundAmount, team, player };
  }

  function nominateUnsoldPlayer(playerId) {
    const uIdx = GameState.unsold.findIndex(p => (p.id === playerId || p.name === playerId));
    if (uIdx === -1) return false;
    const player = GameState.unsold.splice(uIdx, 1)[0];
    player.status = 'pool';
    GameState.pool.push(player);
    emit('stateChange', GameState);
    return true;
  }
"""

# Insert helpers before exports
idx_exp = content.find("const Game = {")
if idx_exp != -1:
    content = content[:idx_exp] + helpers + "\n  " + content[idx_exp:]

# Add to Game object
exp_target = "getAuctionMode,"
if exp_target in content:
    content = content.replace(exp_target, exp_target + "\n    setBidDuration,\n    getBidDuration,\n    releasePlayerFromTeam,\n    nominateUnsoldPlayer,")

# Also add to window/globalThis exports
win_target = "window.setAuctionMode = setAuctionMode;"
if win_target in content:
    content = content.replace(win_target, win_target + "\n  window.setBidDuration = setBidDuration;\n  window.releasePlayerFromTeam = releasePlayerFromTeam;\n  window.nominateUnsoldPlayer = nominateUnsoldPlayer;")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("game.js updated successfully!")
