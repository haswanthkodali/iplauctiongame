"""
apply_team_change_feature.py
1. Sets default rules in Create Room Modal:
   - Limit Players Above Bid Amount: default NO
   - Accelerated Auction Round: default NO / OFF
2. Implements Live Team Change in Auction:
   - User can change their franchise during the auction if the selected franchise is available
   - Checks if franchise is taken by another human player
   - Updates GameState, AppState, StorageEngine, TopBar, AuctionArena, Playing 11
"""

import re

# =========================================================================
# 1. UPDATE index.html
# =========================================================================
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make backup
with open('index.html.bak2', 'w', encoding='utf-8') as f:
    f.write(html)

# A. Update Limit Players Above Bid Amount in Create Room Modal
# Change Yes (Default) to Yes, and No to No (Default) with active style
old_exceed_buttons = '''            <div class="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button id="btnRuleExceedYes" type="button" class="btn-toggle-rule active px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition">Yes (Default)</button>
              <button id="btnRuleExceedNo" type="button" class="btn-toggle-rule px-3 py-1 rounded-lg text-xs font-bold transition">No</button>
            </div>'''

new_exceed_buttons = '''            <div class="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button id="btnRuleExceedYes" type="button" class="btn-toggle-rule px-3 py-1 rounded-lg text-xs font-bold transition text-slate-400 hover:text-white">Yes</button>
              <button id="btnRuleExceedNo" type="button" class="btn-toggle-rule active px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition">No (Default)</button>
            </div>'''

if old_exceed_buttons in html:
    html = html.replace(old_exceed_buttons, new_exceed_buttons)
    print("Replaced exceed buttons in HTML")
else:
    print("WARNING: old_exceed_buttons not found in HTML")

# Hide ruleExceedSubGroup by default
old_exceed_sub = '<div id="ruleExceedSubGroup" class="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">'
new_exceed_sub = '<div id="ruleExceedSubGroup" class="hidden flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">'
if old_exceed_sub in html:
    html = html.replace(old_exceed_sub, new_exceed_sub)
    print("Hid ruleExceedSubGroup in HTML")
else:
    print("WARNING: old_exceed_sub not found in HTML")

# B. Update Accelerated Auction Round in Create Room Modal
# Change ON to inactive, and OFF to active (Default)
old_accel_buttons = '''          <div class="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button id="btnRuleAcceleratedOn" type="button" class="btn-toggle-rule active px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition">ON</button>
            <button id="btnRuleAcceleratedOff" type="button" class="btn-toggle-rule px-3 py-1 rounded-lg text-xs font-bold transition">OFF</button>
          </div>'''

new_accel_buttons = '''          <div class="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button id="btnRuleAcceleratedOn" type="button" class="btn-toggle-rule px-3 py-1 rounded-lg text-xs font-bold transition text-slate-400 hover:text-white">ON</button>
            <button id="btnRuleAcceleratedOff" type="button" class="btn-toggle-rule active px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition">OFF (Default)</button>
          </div>'''

if old_accel_buttons in html:
    html = html.replace(old_accel_buttons, new_accel_buttons)
    print("Replaced accelerated buttons in HTML")
else:
    print("WARNING: old_accel_buttons not found in HTML")

# C. Add "Change Team" button in Header next to userTeamChip
old_header_chip = '''        <!-- User Franchise Badge -->
        <div id="userTeamChip" class="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div id="userTeamLogo" class="w-8 h-8 rounded-lg flex items-center justify-center text-xl font-bold">
            👑
          </div>
          <div class="text-xs">
            <div class="flex items-center gap-2">
              <span class="font-bold text-white" id="userTeamName">RCB</span>
              <span class="text-slate-400" id="userRoleBadgeText">(Your Team)</span>
            </div>
            <div class="flex items-center gap-3 text-slate-300 font-medium">
              <span>Purse: <strong class="text-amber-400" id="userPurseLeft">₹120.00 Cr</strong></span>
              <span>Squad: <strong class="text-blue-400" id="userSquadCount">0/25</strong></span>
              <span>OS: <strong class="text-purple-400" id="userOverseasCount">0/8</strong></span>
            </div>
          </div>
        </div>'''

new_header_chip = '''        <!-- User Franchise Badge with Live Change Team Button -->
        <div class="flex items-center gap-2">
          <div id="userTeamChip" class="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div id="userTeamLogo" class="w-8 h-8 rounded-lg flex items-center justify-center text-xl font-bold">
              👑
            </div>
            <div class="text-xs">
              <div class="flex items-center gap-2">
                <span class="font-bold text-white" id="userTeamName">RCB</span>
                <span class="text-slate-400" id="userRoleBadgeText">(Your Team)</span>
              </div>
              <div class="flex items-center gap-3 text-slate-300 font-medium">
                <span>Purse: <strong class="text-amber-400" id="userPurseLeft">₹120.00 Cr</strong></span>
                <span>Squad: <strong class="text-blue-400" id="userSquadCount">0/25</strong></span>
                <span>OS: <strong class="text-purple-400" id="userOverseasCount">0/8</strong></span>
              </div>
            </div>
          </div>
          <button id="btnHeaderChangeTeam" type="button" class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition cursor-pointer" title="Switch your franchise if available">
            <span>🔄</span> <span>Change Team</span>
          </button>
        </div>'''

if old_header_chip in html:
    html = html.replace(old_header_chip, new_header_chip)
    print("Added Change Team button to header")
else:
    print("WARNING: old_header_chip not found in HTML")

# D. Add "Change Team" button inside Auction Arena Progress Ribbon
old_arena_ribbon = '''          <div class="flex items-center gap-2">
            <button id="btnOpenScoutModal" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-700/40 flex items-center gap-1.5 transition">
              📊 <span>Scout Impact</span>
            </button>
          </div>'''

new_arena_ribbon = '''          <div class="flex items-center gap-2">
            <button id="btnArenaChangeTeam" type="button" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition cursor-pointer" title="Switch to another available franchise during auction">
              <span>🔄</span> <span>Change Team</span>
            </button>
            <button id="btnOpenScoutModal" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-700/40 flex items-center gap-1.5 transition">
              📊 <span>Scout Impact</span>
            </button>
          </div>'''

if old_arena_ribbon in html:
    html = html.replace(old_arena_ribbon, new_arena_ribbon)
    print("Added Change Team button to Arena ribbon")
else:
    print("WARNING: old_arena_ribbon not found in HTML")

# E. Add Change Team Modal before closing </body>
change_team_modal_html = '''
  <!-- CHANGE FRANCHISE MODAL (LIVE IN-AUCTION SWITCHER) -->
  <div id="changeTeamModal" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-5">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            🔄 <span>Change Your Franchise</span>
          </h3>
          <p class="text-xs text-slate-400">Select any available team. Teams taken by other room managers cannot be selected.</p>
        </div>
        <button id="btnCloseChangeTeamModal" class="text-slate-400 hover:text-white text-xl p-1 font-bold cursor-pointer">&times;</button>
      </div>

      <!-- Teams Grid -->
      <div id="changeTeamGrid" class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
        <!-- Dynamically rendered teams with availability badges -->
      </div>

      <div class="border-t border-slate-800 pt-3 flex justify-end">
        <button id="btnCancelChangeTeam" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  </div>
'''

if 'id="changeTeamModal"' not in html:
    html = html.replace('</body>', change_team_modal_html + '\n</body>')
    print("Added changeTeamModal to HTML")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html updated successfully.")

# =========================================================================
# 2. UPDATE game.js
# =========================================================================
with open('game.js', 'r', encoding='utf-8') as f:
    game_js = f.read()

with open('game.js.bak2', 'w', encoding='utf-8') as f:
    f.write(game_js)

# Add changeUserTeam function if not present
if 'changeUserTeam' not in game_js:
    # Find a good place, e.g. after selectTeam
    target_st = "function selectTeam(teamId) {"
    replacement_cut = '''function changeUserTeam(newTeamId) {
    const team = getTeam(newTeamId);
    if (!team) return false;
    GameState.userTeamId = newTeamId;
    saveGameState();
    emit('stateChange', { state: getState() });
    return true;
  }

  function selectTeam(teamId) {'''
    game_js = game_js.replace(target_st, replacement_cut, 1)

    # Export changeUserTeam in Game object
    game_js = game_js.replace('selectTeam,\n', 'selectTeam,\n    changeUserTeam,\n', 1)
    game_js = game_js.replace('window.selectTeam = selectTeam;\n', 'window.selectTeam = selectTeam;\n    window.changeUserTeam = changeUserTeam;\n', 1)
    game_js = game_js.replace('globalThis.selectTeam = selectTeam;\n', 'globalThis.selectTeam = selectTeam;\n    globalThis.changeUserTeam = changeUserTeam;\n', 1)

    with open('game.js', 'w', encoding='utf-8') as f:
        f.write(game_js)
    print("game.js updated with changeUserTeam.")
else:
    print("changeUserTeam already in game.js.")

# =========================================================================
# 3. UPDATE storage.js
# =========================================================================
with open('storage.js', 'r', encoding='utf-8') as f:
    storage_js = f.read()

with open('storage.js.bak2', 'w', encoding='utf-8') as f:
    f.write(storage_js)

if 'changeRoomTeam' not in storage_js:
    target_join = "joinRoom(roomId, teamId, userId, userName) {"
    method_change = '''changeRoomTeam(roomId, userId, oldTeamId, newTeamId) {
      const room = this.getRoom(roomId);
      if (!room) return { success: false, reason: 'room_not_found' };
      if (!room.players) room.players = {};

      // Check if newTeamId is taken by another player
      if (room.players[newTeamId] && room.players[newTeamId].userId !== userId) {
        return { success: false, reason: 'team_taken', takenBy: room.players[newTeamId].userName };
      }

      // Remove old team assignment
      if (oldTeamId && room.players[oldTeamId] && room.players[oldTeamId].userId === userId) {
        delete room.players[oldTeamId];
      }

      // Assign new team
      const user = this.currentUser || { userId, userName: 'Manager' };
      room.players[newTeamId] = {
        userId,
        userName: user.userName,
        status: 'online',
        joinedAt: Date.now()
      };

      // If user was host, update hostTeam
      if (room.hostId === userId) {
        room.hostTeam = newTeamId;
      }

      this.saveRoom(room);
      return { success: true, room };
    },

    joinRoom(roomId, teamId, userId, userName) {'''
    storage_js = storage_js.replace(target_join, method_change, 1)

    with open('storage.js', 'w', encoding='utf-8') as f:
        f.write(storage_js)
    print("storage.js updated with changeRoomTeam.")
else:
    print("changeRoomTeam already in storage.js.")

# =========================================================================
# 4. UPDATE app.js
# =========================================================================
with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

with open('app.js.bak3', 'w', encoding='utf-8') as f:
    f.write(app_js)

# A. Update RoomRules defaults in app.js
app_js = re.sub(r'exceedLimitEnabled:\s*true', 'exceedLimitEnabled: false', app_js)
app_js = re.sub(r'acceleratedEnabled:\s*true', 'acceleratedEnabled: false', app_js)

# B. Update createConfig defaults in initRoomActionListeners
# Replace createConfig in initRoomActionListeners
old_create_cfg = """    let createConfig = {
      mode: 'MINI',
      visibility: 'PUBLIC',
      maxBidEnabled: false,
      maxBidAmount: 25,
      exceedLimitEnabled: true,
      exceedThreshold: 15,
      exceedMaxPlayers: 3,
      acceleratedEnabled: true,
      timer: 10
    };"""

new_create_cfg = """    let createConfig = {
      mode: 'MINI',
      visibility: 'PUBLIC',
      maxBidEnabled: false,
      maxBidAmount: 25,
      exceedLimitEnabled: false,
      exceedThreshold: 15,
      exceedMaxPlayers: 3,
      acceleratedEnabled: false,
      timer: 10
    };"""

app_js = app_js.replace(old_create_cfg, new_create_cfg)

# C. Add Live Team Switcher functions in app.js
team_change_code = """
  // =========================================================================
  // LIVE IN-AUCTION TEAM CHANGER
  // =========================================================================

  function openChangeTeamModal() {
    const modal = document.getElementById('changeTeamModal');
    const grid = document.getElementById('changeTeamGrid');
    if (!modal || !grid) return;

    const allTeams = (typeof TEAMS !== 'undefined') ? TEAMS : (Game.getTeams ? Game.getTeams() : []);
    const currentTeamId = (typeof Game !== 'undefined' && Game.getState) ? Game.getState().userTeamId : (AppState.userTeamId || 'RCB');
    const currentRoom = window.CurrentRoom || null;
    const roomPlayers = (currentRoom && currentRoom.players) ? currentRoom.players : {};
    const currentUser = (typeof StorageEngine !== 'undefined' && StorageEngine.getCurrentUser) ? StorageEngine.getCurrentUser() : null;
    const myUserId = currentUser?.userId || 'me';

    grid.innerHTML = allTeams.map(t => {
      const isCurrent = t.id === currentTeamId;
      const takenByPlayer = roomPlayers[t.id];
      const isTakenByOther = takenByPlayer && takenByPlayer.userId !== myUserId;
      const purseLeft = t.purse || (t.budget ? (t.budget - (t.spent || 0)) : 120);
      const squadCount = (t.players || []).length;

      let badgeHtml = '';
      let actionBtn = '';

      if (isCurrent) {
        badgeHtml = '<span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wider">Current Team</span>';
        actionBtn = '<span class="text-xs text-amber-400 font-bold">Selected ✓</span>';
      } else if (isTakenByOther) {
        badgeHtml = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">Taken by ${takenByPlayer.userName || 'Player'}</span>`;
        actionBtn = '<button disabled class="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-600 text-xs font-bold cursor-not-allowed">Unavailable</button>';
      } else {
        badgeHtml = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">Available</span>';
        actionBtn = `<button class="btn-select-switch-team px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold text-xs transition cursor-pointer active:scale-95 shadow-md shadow-amber-500/20" data-team="${t.id}">Select Team →</button>`;
      }

      return `
        <div class="p-3.5 rounded-2xl ${isCurrent ? 'bg-amber-500/10 border-2 border-amber-400/80' : 'bg-slate-950/80 border border-slate-800 hover:border-slate-700'} flex items-center justify-between gap-3 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl font-bold border border-slate-700">
              ${t.logo || '🏏'}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <strong class="text-white text-sm">${t.shortName || t.name}</strong>
                ${badgeHtml}
              </div>
              <div class="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Purse: <strong class="text-amber-400">₹${Number(purseLeft).toFixed(2)} Cr</strong></span>
                <span>•</span>
                <span>Squad: <strong class="text-blue-400">${squadCount}</strong></span>
              </div>
            </div>
          </div>
          <div>
            ${actionBtn}
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to available team buttons
    grid.querySelectorAll('.btn-select-switch-team').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedTeamId = btn.dataset.team;
        executeLiveTeamChange(selectedTeamId);
      });
    });

    modal.classList.remove('hidden');
  }

  function executeLiveTeamChange(newTeamId) {
    if (!newTeamId) return;
    const oldTeamId = (typeof Game !== 'undefined' && Game.getState) ? Game.getState().userTeamId : (AppState.userTeamId || 'RCB');
    if (newTeamId === oldTeamId) {
      alert('You are already managing this franchise.');
      return;
    }

    // Check availability in current room
    const currentRoom = window.CurrentRoom || null;
    const currentUser = (typeof StorageEngine !== 'undefined' && StorageEngine.getCurrentUser) ? StorageEngine.getCurrentUser() : null;
    const myUserId = currentUser?.userId || 'me';

    if (currentRoom && currentRoom.roomId) {
      const res = StorageEngine.changeRoomTeam(currentRoom.roomId, myUserId, oldTeamId, newTeamId);
      if (!res.success) {
        if (res.reason === 'team_taken') {
          alert(`🚫 Franchise "${newTeamId}" was just taken by ${res.takenBy || 'another player'}. Please select another team.`);
          openChangeTeamModal();
          return;
        }
      } else {
        window.CurrentRoom = res.room;
      }
    }

    // 1. Update Game Engine
    if (typeof Game !== 'undefined' && Game.changeUserTeam) {
      Game.changeUserTeam(newTeamId);
    } else if (typeof Game !== 'undefined' && Game.getState) {
      Game.getState().userTeamId = newTeamId;
      if (typeof Game.saveGameState === 'function') Game.saveGameState();
    }

    // 2. Update AppState
    AppState.userTeamId = newTeamId;
    AppState.selectedLandingTeamId = newTeamId;
    AppState.selectedPlaying11TeamId = newTeamId;
    AppState.selectedReviewTeamId = newTeamId;

    // 3. Update StorageEngine
    if (typeof StorageEngine !== 'undefined') {
      if (StorageEngine.currentUser) {
        StorageEngine.currentUser.teamId = newTeamId;
        StorageEngine.saveCurrentUser();
      }
      if (StorageEngine.assignMultiplayerManager) {
        StorageEngine.assignMultiplayerManager(newTeamId, myUserId, currentUser?.userName || 'Manager');
      }
    }

    // 4. Update UI
    if (DOM.selectPlaying11Team) DOM.selectPlaying11Team.value = newTeamId;
    if (DOM.userReviewTeamSelect) DOM.userReviewTeamSelect.value = newTeamId;

    updateTopBar();
    updateAuctionArena();
    renderPlaying11View();
    renderFranchisesView();
    saveAppState();

    // 5. Sound & feedback
    if (typeof AuctionAudio !== 'undefined' && AuctionAudio.playSoldFanfare) {
      AuctionAudio.playSoldFanfare();
    }

    // Close modal
    const modal = document.getElementById('changeTeamModal');
    if (modal) modal.classList.add('hidden');

    const targetTeam = (typeof Game !== 'undefined' && Game.getTeam) ? Game.getTeam(newTeamId) : null;
    const teamTitle = targetTeam ? (targetTeam.shortName || targetTeam.name) : newTeamId;
    alert(`🎉 Team successfully changed to ${teamTitle}! All squad data, purse, and paddle controls have been updated.`);
  }

  window.openChangeTeamModal = openChangeTeamModal;
  window.executeLiveTeamChange = executeLiveTeamChange;
"""

# Inject before wireAdditionalButtons
if 'openChangeTeamModal' not in app_js:
    target_ins = "function wireAdditionalButtons() {"
    app_js = app_js.replace(target_ins, team_change_code + '\n  ' + target_ins, 1)

    # Wire buttons in wireAdditionalButtons
    wire_change_btns = """
    // Live Change Team Buttons
    const btnHdrChange = document.getElementById('btnHeaderChangeTeam');
    const btnArChange = document.getElementById('btnArenaChangeTeam');
    const modalChange = document.getElementById('changeTeamModal');
    const btnCloseChange = document.getElementById('btnCloseChangeTeamModal');
    const btnCancelChange = document.getElementById('btnCancelChangeTeam');

    if (btnHdrChange) btnHdrChange.onclick = () => openChangeTeamModal();
    if (btnArChange) btnArChange.onclick = () => openChangeTeamModal();
    if (btnCloseChange && modalChange) btnCloseChange.onclick = () => modalChange.classList.add('hidden');
    if (btnCancelChange && modalChange) btnCancelChange.onclick = () => modalChange.classList.add('hidden');
"""
    app_js = app_js.replace("wireAdditionalButtons() {", "wireAdditionalButtons() {" + wire_change_btns, 1)
    print("Injected Change Team feature into app.js")
else:
    print("Change Team feature already present in app.js")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("app.js updated successfully.")
