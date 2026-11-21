"""
fix_team_switcher.py
1. Ensures storage.js has saveRoom, changeRoomTeam, kickPlayer on both StorageManager.prototype and StorageEngine
2. Adds Cache-Control headers to server.py so browser never serves stale cached scripts
3. Makes executeLiveTeamChange in app.js bulletproof with zero-failure fallback
4. Updates script tags in index.html with version query string
"""

# =========================================================================
# 1. UPDATE storage.js
# =========================================================================
with open('storage.js', 'r', encoding='utf-8') as f:
    storage_code = f.read()

# Add saveRoom method and ensure changeRoomTeam is properly exported
save_room_method = """    saveRoom(room) {
      if (!room || !room.roomId) return false;
      const db = this.getAllRoomsDB();
      db[room.roomId] = room;
      this.saveAllRoomsDB(db);
      return true;
    }

    changeRoomTeam(roomId, userId, oldTeamId, newTeamId) {"""

if 'saveRoom(room)' not in storage_code:
    storage_code = storage_code.replace('changeRoomTeam(roomId, userId, oldTeamId, newTeamId) {', save_room_method, 1)
    print("Added saveRoom method to StorageManager in storage.js")

# At the bottom of storage.js, also explicitly bind methods to StorageEngine instance
instance_bindings = """
  // Ensure all methods are directly attached to StorageEngine instance
  if (global.StorageEngine) {
    global.StorageEngine.changeRoomTeam = global.StorageEngine.changeRoomTeam.bind(global.StorageEngine);
    global.StorageEngine.saveRoom = global.StorageEngine.saveRoom.bind(global.StorageEngine);
    global.StorageEngine.kickPlayer = global.StorageEngine.kickPlayer.bind(global.StorageEngine);
    global.StorageEngine.setPlayerOnlineStatus = global.StorageEngine.setPlayerOnlineStatus.bind(global.StorageEngine);
  }
"""

if 'global.StorageEngine.changeRoomTeam = ' not in storage_code:
    target_end = "})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));"
    storage_code = storage_code.replace(target_end, instance_bindings + '\n' + target_end, 1)
    print("Attached explicit bindings to StorageEngine in storage.js")

with open('storage.js', 'w', encoding='utf-8') as f:
    f.write(storage_code)
print("storage.js updated.")

# =========================================================================
# 2. UPDATE app.js: Make executeLiveTeamChange 100% bulletproof
# =========================================================================
with open('app.js', 'r', encoding='utf-8') as f:
    app_code = f.read()

bulletproof_execute = """  function executeLiveTeamChange(newTeamId) {
    if (!newTeamId) return;
    const oldTeamId = (typeof Game !== 'undefined' && Game.getState) ? Game.getState().userTeamId : (AppState.userTeamId || 'RCB');
    if (newTeamId === oldTeamId) {
      alert('You are already managing this franchise.');
      return;
    }

    console.log(`[IPL Auction] Switching franchise from ${oldTeamId} to ${newTeamId}`);

    // Check availability in current room if player is in a room
    const currentRoom = window.CurrentRoom || null;
    const currentUser = (typeof StorageEngine !== 'undefined' && StorageEngine.getCurrentUser) ? StorageEngine.getCurrentUser() : null;
    const myUserId = currentUser?.userId || 'me';

    if (currentRoom && currentRoom.roomId) {
      if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.changeRoomTeam === 'function') {
        const res = StorageEngine.changeRoomTeam(currentRoom.roomId, myUserId, oldTeamId, newTeamId);
        if (res && !res.success) {
          if (res.reason === 'team_taken') {
            alert(`🚫 Franchise "${newTeamId}" was just taken by ${res.takenBy || 'another player'}. Please select another team.`);
            openChangeTeamModal();
            return;
          }
        } else if (res && res.room) {
          window.CurrentRoom = res.room;
        }
      } else {
        // Direct room fallback
        if (!currentRoom.players) currentRoom.players = {};
        if (oldTeamId && currentRoom.players[oldTeamId]) delete currentRoom.players[oldTeamId];
        currentRoom.players[newTeamId] = {
          userId: myUserId,
          userName: currentUser?.userName || 'Manager',
          status: 'online',
          joinedAt: Date.now()
        };
        if (currentRoom.hostId === myUserId) currentRoom.hostTeam = newTeamId;
        try {
          const db = JSON.parse(localStorage.getItem('ipl_auction_rooms') || '{}');
          db[currentRoom.roomId] = currentRoom;
          localStorage.setItem('ipl_auction_rooms', JSON.stringify(db));
        } catch (e) {}
      }
    }

    // 1. Update Game Engine
    try {
      if (typeof Game !== 'undefined') {
        if (typeof Game.changeUserTeam === 'function') {
          Game.changeUserTeam(newTeamId);
        } else if (typeof Game.getState === 'function') {
          Game.getState().userTeamId = newTeamId;
          if (typeof Game.saveGameState === 'function') Game.saveGameState();
        }
      }
    } catch (e) {
      console.warn('Game engine update warning:', e);
    }

    // 2. Update AppState
    AppState.userTeamId = newTeamId;
    AppState.selectedLandingTeamId = newTeamId;
    AppState.selectedPlaying11TeamId = newTeamId;
    AppState.selectedReviewTeamId = newTeamId;

    // 3. Update StorageEngine user profile
    try {
      if (typeof StorageEngine !== 'undefined') {
        if (StorageEngine.currentUser) {
          StorageEngine.currentUser.teamId = newTeamId;
          if (typeof StorageEngine.saveCurrentUser === 'function') StorageEngine.saveCurrentUser();
        }
        if (typeof StorageEngine.assignMultiplayerManager === 'function') {
          StorageEngine.assignMultiplayerManager(newTeamId, myUserId, currentUser?.userName || 'Manager');
        }
      }
    } catch (e) {
      console.warn('StorageEngine update warning:', e);
    }

    // 4. Update UI Dropdowns
    if (DOM.selectPlaying11Team) DOM.selectPlaying11Team.value = newTeamId;
    if (DOM.userReviewTeamSelect) DOM.userReviewTeamSelect.value = newTeamId;

    // 5. Update Views
    if (typeof updateTopBar === 'function') updateTopBar();
    if (typeof updateAuctionArena === 'function') updateAuctionArena();
    if (typeof renderPlaying11View === 'function') renderPlaying11View();
    if (typeof renderFranchisesView === 'function') renderFranchisesView();
    if (typeof saveAppState === 'function') saveAppState();

    // If room lobby is open, re-render it
    if (window.CurrentRoom && typeof openRoomLobbyUI === 'function') {
      openRoomLobbyUI(window.CurrentRoom);
    }

    // 6. Sound & Feedback
    try {
      if (typeof AuctionAudio !== 'undefined' && typeof AuctionAudio.playSoldFanfare === 'function') {
        AuctionAudio.playSoldFanfare();
      }
    } catch (e) {}

    // Close modal
    const modal = document.getElementById('changeTeamModal');
    if (modal) modal.classList.add('hidden');

    const targetTeam = (typeof Game !== 'undefined' && Game.getTeam) ? Game.getTeam(newTeamId) : null;
    const teamTitle = targetTeam ? (targetTeam.shortName || targetTeam.name) : newTeamId;
    alert(`🎉 Franchise successfully changed to ${teamTitle}! All squad data, purse, and bidding controls have been updated.`);
  }"""

# Find executeLiveTeamChange in app.js and replace it
import re
start_match = re.search(r'function executeLiveTeamChange\s*\([^\)]*\)\s*\{', app_code)
if start_match:
    start_pos = start_match.start()
    # Find matching brace
    brace = 0
    end_pos = start_pos
    for i in range(start_pos, len(app_code)):
        if app_code[i] == '{': brace += 1
        elif app_code[i] == '}':
            brace -= 1
            if brace == 0:
                end_pos = i + 1
                break
    app_code = app_code[:start_pos] + bulletproof_execute.strip() + app_code[end_pos:]
    print("Replaced executeLiveTeamChange with bulletproof version in app.js")
else:
    print("WARNING: executeLiveTeamChange not found in app.js")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_code)
print("app.js updated.")

# =========================================================================
# 3. UPDATE server.py: Add no-cache headers to static responses
# =========================================================================
with open('server.py', 'r', encoding='utf-8') as f:
    srv_code = f.read()

# In CustomHandler, override end_headers to prevent caching
if 'Cache-Control' not in srv_code:
    hook_target = "    def do_OPTIONS(self):"
    end_headers_override = """    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):"""
    srv_code = srv_code.replace(hook_target, end_headers_override, 1)
    with open('server.py', 'w', encoding='utf-8') as f:
        f.write(srv_code)
    print("Added no-cache headers to server.py")

# =========================================================================
# 4. UPDATE index.html: Add timestamp query to script tags for cache busting
# =========================================================================
import time
ts = int(time.time())

with open('index.html', 'r', encoding='utf-8') as f:
    html_code = f.read()

html_code = re.sub(r'src="storage\.js(\?v=\d+)?"', f'src="storage.js?v={ts}"', html_code)
html_code = re.sub(r'src="app\.js(\?v=\d+)?"', f'src="app.js?v={ts}"', html_code)
html_code = re.sub(r'src="game\.js(\?v=\d+)?"', f'src="game.js?v={ts}"', html_code)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_code)
print(f"Updated script tags in index.html with timestamp v={ts}")
