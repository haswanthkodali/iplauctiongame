"""
fix_duplicate_team_ownership.py
1. Enforces strict single-team ownership per player in storage.js:
   - In joinRoom: releases any previously owned teams by the user before assigning new team
   - In changeRoomTeam: releases any previously owned teams by the user
   - Adds leaveRoom method to release player's team when they leave room
   - Adds sanitizeRoomTeams to clean up any past duplicate ownership
2. In app.js:
   - renderLobbyTeamsGrid uses executeLiveTeamChange so it cleanly switches team
   - btnLeaveRoomLobby calls StorageEngine.leaveRoom so leaving a room frees up the team
   - On page load / room open, sanitizes room teams so duplicates are immediately cleaned
"""

# =========================================================================
# 1. UPDATE storage.js
# =========================================================================
with open('storage.js', 'r', encoding='utf-8') as f:
    storage_code = f.read()

# Update sanitizeRoomTeams and leaveRoom
sanitizer_and_leave = """    sanitizeRoomTeams(room) {
      if (!room || !room.players) return room;
      const seenUsers = new Set();
      // Keep only the most recently assigned or active team per user
      const keys = Object.keys(room.players);
      for (const t of keys) {
        const p = room.players[t];
        const uid = p.userId || p.userName;
        if (uid) {
          if (seenUsers.has(uid)) {
            // Duplicate team owned by same user - release it!
            delete room.players[t];
          } else {
            seenUsers.add(uid);
          }
        }
      }
      return room;
    }

    leaveRoom(roomId, userId) {
      const room = this.getRoom(roomId);
      if (!room || !room.players) return { success: true };
      const curUser = this.currentUser;

      for (const t of Object.keys(room.players)) {
        const p = room.players[t];
        if (p.userId === userId || (curUser && p.userName === curUser.userName)) {
          delete room.players[t];
        }
      }

      this.saveRoom(room);
      return { success: true, room };
    }

    saveRoom(room) {"""

if 'sanitizeRoomTeams(room)' not in storage_code:
    storage_code = storage_code.replace('saveRoom(room) {', sanitizer_and_leave, 1)
    print("Added sanitizeRoomTeams and leaveRoom to StorageManager")

# Clean up joinRoom so it deletes all existing teams owned by this user
old_join_assign = """      // Assign player
      room.players[teamId] = {
        userId,
        userName,
        teamId,
        isOnline: true,
        joinedAt: new Date().toISOString()
      };"""

new_join_assign = """      // RELEASE any previous teams owned by this user in this room!
      for (const t of Object.keys(room.players)) {
        const p = room.players[t];
        if (p.userId === userId || (userName && p.userName === userName)) {
          delete room.players[t];
        }
      }

      // Assign player to their single chosen team
      room.players[teamId] = {
        userId,
        userName,
        teamId,
        isOnline: true,
        joinedAt: new Date().toISOString()
      };"""

if old_join_assign in storage_code:
    storage_code = storage_code.replace(old_join_assign, new_join_assign, 1)
    print("Updated joinRoom to release previous teams in storage.js")
else:
    print("WARNING: old_join_assign not found in storage.js")

# Clean up changeRoomTeam so it deletes all existing teams owned by this user
old_change_assign = """      // Remove old team assignment
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
      };"""

new_change_assign = """      // RELEASE all previous teams owned by this user in this room!
      const user = this.currentUser || { userId, userName: 'Manager' };
      for (const t of Object.keys(room.players)) {
        const p = room.players[t];
        if (p.userId === userId || (user.userName && p.userName === user.userName)) {
          delete room.players[t];
        }
      }

      // Assign new single team
      room.players[newTeamId] = {
        userId,
        userName: user.userName,
        status: 'online',
        isOnline: true,
        joinedAt: Date.now()
      };"""

if old_change_assign in storage_code:
    storage_code = storage_code.replace(old_change_assign, new_change_assign, 1)
    print("Updated changeRoomTeam to release previous teams in storage.js")
else:
    print("WARNING: old_change_assign not found in storage.js")

# Bind leaveRoom and sanitizeRoomTeams on instance
if 'global.StorageEngine.leaveRoom = ' not in storage_code:
    target_bind = "global.StorageEngine.changeRoomTeam = global.StorageEngine.changeRoomTeam.bind(global.StorageEngine);"
    new_binds = """global.StorageEngine.changeRoomTeam = global.StorageEngine.changeRoomTeam.bind(global.StorageEngine);
    global.StorageEngine.leaveRoom = global.StorageEngine.leaveRoom.bind(global.StorageEngine);
    global.StorageEngine.sanitizeRoomTeams = global.StorageEngine.sanitizeRoomTeams.bind(global.StorageEngine);"""
    storage_code = storage_code.replace(target_bind, new_binds, 1)

with open('storage.js', 'w', encoding='utf-8') as f:
    f.write(storage_code)
print("storage.js updated.")

# =========================================================================
# 2. UPDATE app.js
# =========================================================================
with open('app.js', 'r', encoding='utf-8') as f:
    app_code = f.read()

# Update renderLobbyTeamsGrid to sanitize room teams and use executeLiveTeamChange
old_grid_click = """      if (!isTaken) {
        card.onclick = () => {
          AppState.userTeamId = teamId;
          const user = StorageEngine.currentUser || { userId: 'user_' + Date.now(), userName: 'Manager' };
          StorageEngine.joinRoom(room.roomId, teamId, user.userId, user.userName);
          AuctionAudio.playBidPaddle();
          openRoomLobbyUI(room);
          updateTopBar();
        };
      }"""

new_grid_click = """      if (!isTaken) {
        card.onclick = () => {
          executeLiveTeamChange(teamId);
        };
      }"""

if old_grid_click in app_code:
    app_code = app_code.replace(old_grid_click, new_grid_click, 1)
    print("Updated renderLobbyTeamsGrid click handler to executeLiveTeamChange in app.js")
else:
    print("WARNING: old_grid_click not found in app.js")

# In openRoomLobbyUI, sanitize room teams first so past duplicates vanish
old_open_lobby_head = """  function openRoomLobbyUI(room) {
    window.CurrentRoom = room;
    const lobbySec = document.getElementById('roomLobbySection');
    if (!lobbySec) return;"""

new_open_lobby_head = """  function openRoomLobbyUI(room) {
    if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.sanitizeRoomTeams === 'function') {
      room = StorageEngine.sanitizeRoomTeams(room);
    }
    window.CurrentRoom = room;
    const lobbySec = document.getElementById('roomLobbySection');
    if (!lobbySec) return;"""

if old_open_lobby_head in app_code:
    app_code = app_code.replace(old_open_lobby_head, new_open_lobby_head, 1)
    print("Added room team sanitization to openRoomLobbyUI in app.js")
else:
    print("WARNING: old_open_lobby_head not found in app.js")

# In openRoomLobbyUI, ensure Leave Room button releases the team in storage!
old_leave_btn = """    // Wire Leave Room Button
    const btnLeave = document.getElementById('btnLeaveRoomLobby');
    if (btnLeave) {
      btnLeave.onclick = () => {
        if (confirm('Are you sure you want to leave this auction room?')) {
          window.CurrentRoom = null;
          lobbySec.classList.add('hidden');
          if (heroBanner) heroBanner.classList.remove('hidden');
          if (publicRoomsSec) publicRoomsSec.classList.remove('hidden');
          if (historySec) historySec.classList.remove('hidden');
          renderPublicRoomsList();
          renderHomeAuctionHistory();
        }
      };
    }"""

new_leave_btn = """    // Wire Leave Room Button (releases team back to available!)
    const btnLeave = document.getElementById('btnLeaveRoomLobby');
    if (btnLeave) {
      btnLeave.onclick = () => {
        if (confirm('Are you sure you want to leave this auction room? Your franchise will be freed up for other players.')) {
          const myId = StorageEngine?.currentUser?.userId || 'me';
          if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.leaveRoom === 'function') {
            StorageEngine.leaveRoom(room.roomId, myId);
          }
          window.CurrentRoom = null;
          lobbySec.classList.add('hidden');
          if (heroBanner) heroBanner.classList.remove('hidden');
          if (publicRoomsSec) publicRoomsSec.classList.remove('hidden');
          if (historySec) historySec.classList.remove('hidden');
          renderPublicRoomsList();
          renderHomeAuctionHistory();
        }
      };
    }"""

if old_leave_btn in app_code:
    app_code = app_code.replace(old_leave_btn, new_leave_btn, 1)
    print("Updated Leave Room button to call StorageEngine.leaveRoom in app.js")
else:
    print("WARNING: old_leave_btn not found in app.js")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_code)
print("app.js updated.")

# =========================================================================
# 3. Clean up server_data.json if rooms have duplicates
# =========================================================================
import json
try:
    with open('server_data.json', 'r', encoding='utf-8') as f:
        sdata = json.load(f)
    rooms = sdata.get('rooms', {})
    changed = False
    for r_id, r in rooms.items():
        players = r.get('players', {})
        seen = set()
        to_del = []
        for t, p in players.items():
            u = p.get('userId') or p.get('userName')
            if u:
                if u in seen:
                    to_del.append(t)
                else:
                    seen.add(u)
        for t in to_del:
            del players[t]
            changed = True
    if changed:
        with open('server_data.json', 'w', encoding='utf-8') as f:
            json.dump(sdata, f, indent=2)
        print("Cleaned duplicate team ownership in server_data.json")
except Exception as e:
    print("server_data.json cleanup:", e)

# Also update timestamp in index.html
import time
ts = int(time.time())
with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()
import re
h = re.sub(r'src="storage\.js(\?v=\d+)?"', f'src="storage.js?v={ts}"', h)
h = re.sub(r'src="app\.js(\?v=\d+)?"', f'src="app.js?v={ts}"', h)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h)
print(f"Updated index.html cache buster v={ts}")
