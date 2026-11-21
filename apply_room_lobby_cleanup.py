"""
apply_room_lobby_cleanup.py
1. In index.html:
   - Give hero banner id="homeHeroBanner"
   - Add "Leave Room" button to roomLobbySection header
2. In storage.js:
   - Add kickPlayer(roomId, userId, teamId)
   - Add setPlayerOnlineStatus(roomId, userId, isOnline)
3. In app.js:
   - In openRoomLobbyUI: hide #homeHeroBanner, #homePublicRoomsSection, #homeAuctionHistorySection
   - When leaving room: restore both tabs/sections
   - In renderLobbyPlayersList: add "Kick Player" for offline players to free up team
   - Allow host to toggle online/offline status
"""

import re

# =========================================================================
# 1. UPDATE index.html
# =========================================================================
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add id="homeHeroBanner"
old_hero_div = '<div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">'
new_hero_div = '<div id="homeHeroBanner" class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">'

if old_hero_div in html:
    html = html.replace(old_hero_div, new_hero_div, 1)
    print("Added id='homeHeroBanner' to hero banner in index.html")
else:
    print("WARNING: old_hero_div not found in index.html")

# Add "Leave Room" button in roomLobbySection header next to share buttons
old_share_box = '''            <button id="btnShareLobbyWhatsApp" class="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer">
              <span>📲</span> <span>WhatsApp</span>
            </button>
          </div>'''

new_share_box = '''            <button id="btnShareLobbyWhatsApp" class="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer">
              <span>📲</span> <span>WhatsApp</span>
            </button>
            <button id="btnLeaveRoomLobby" class="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer" title="Leave this auction room and return to public rooms">
              <span>🚪</span> <span>Leave Room</span>
            </button>
          </div>'''

if old_share_box in html:
    html = html.replace(old_share_box, new_share_box, 1)
    print("Added Leave Room button to roomLobbySection in index.html")
else:
    print("WARNING: old_share_box not found in index.html")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html saved.")

# =========================================================================
# 2. UPDATE storage.js
# =========================================================================
with open('storage.js', 'r', encoding='utf-8') as f:
    storage_js = f.read()

# Add kickPlayer and setPlayerOnlineStatus
if 'kickPlayer(roomId' not in storage_js:
    target_pos = "banPlayer(roomId, userId) {"
    kick_methods = '''kickPlayer(roomId, userId, teamId) {
      const room = this.getRoom(roomId);
      if (!room) return { success: false, reason: 'room_not_found' };
      if (!room.players) room.players = {};

      let freedTeam = teamId || null;

      if (teamId && room.players[teamId] && room.players[teamId].userId === userId) {
        delete room.players[teamId];
        freedTeam = teamId;
      } else {
        // Search by userId across players
        for (const t of Object.keys(room.players)) {
          if (room.players[t].userId === userId) {
            freedTeam = t;
            delete room.players[t];
            break;
          }
        }
      }

      // If user was host and kicked, reset host
      if (room.hostId === userId) {
        const remainingKeys = Object.keys(room.players);
        if (remainingKeys.length > 0) {
          room.hostId = room.players[remainingKeys[0]].userId;
          room.hostName = room.players[remainingKeys[0]].userName;
        }
      }

      this.saveRoom(room);
      return { success: true, room, freedTeam };
    },

    setPlayerOnlineStatus(roomId, userId, isOnline) {
      const room = this.getRoom(roomId);
      if (!room || !room.players) return { success: false };

      for (const t of Object.keys(room.players)) {
        if (room.players[t].userId === userId) {
          room.players[t].isOnline = !!isOnline;
          break;
        }
      }

      this.saveRoom(room);
      return { success: true, room };
    },

    banPlayer(roomId, userId) {'''
    storage_js = storage_js.replace(target_pos, kick_methods, 1)

    with open('storage.js', 'w', encoding='utf-8') as f:
        f.write(storage_js)
    print("storage.js updated with kickPlayer and setPlayerOnlineStatus.")
else:
    print("kickPlayer already in storage.js.")

# =========================================================================
# 3. UPDATE app.js
# =========================================================================
with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# A. Update openRoomLobbyUI to hide both hero banner and public rooms section
old_open_lobby = """  function openRoomLobbyUI(room) {
    window.CurrentRoom = room;
    const lobbySec = document.getElementById('roomLobbySection');
    if (!lobbySec) return;

    lobbySec.classList.remove('hidden');
    lobbySec.scrollIntoView({ behavior: 'smooth' });"""

new_open_lobby = """  function openRoomLobbyUI(room) {
    window.CurrentRoom = room;
    const lobbySec = document.getElementById('roomLobbySection');
    if (!lobbySec) return;

    // HIDE BOTH Hero Banner & Browse Public Rooms when player is already in room!
    const heroBanner = document.getElementById('homeHeroBanner');
    const publicRoomsSec = document.getElementById('homePublicRoomsSection');
    const historySec = document.getElementById('homeAuctionHistorySection');

    if (heroBanner) heroBanner.classList.add('hidden');
    if (publicRoomsSec) publicRoomsSec.classList.add('hidden');
    if (historySec) historySec.classList.add('hidden');

    lobbySec.classList.remove('hidden');
    lobbySec.scrollIntoView({ behavior: 'smooth' });

    // Wire Leave Room Button
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

if old_open_lobby in app_js:
    app_js = app_js.replace(old_open_lobby, new_open_lobby, 1)
    print("Updated openRoomLobbyUI in app.js")
else:
    print("WARNING: old_open_lobby not found in app.js")

# B. Update renderLobbyPlayersList to support Kick Offline Player and toggle online/offline
old_render_players = """    playerKeys.forEach(tId => {
      const p = players[tId];
      const isOnline = p.isOnline !== false;
      const isHost = p.isHost || p.userId === room.hostId;

      const card = document.createElement('div');
      card.className = 'p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs';
      card.innerHTML = `
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-500'}" title="${isOnline ? 'Online' : 'Offline'}"></span>
          <div>
            <div class="flex items-center gap-1.5 font-bold text-white">
              <span>${p.userName || 'Manager'}</span>
              ${isHost ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40">HOST</span>' : ''}
            </div>
            <div class="text-[10px] text-slate-400">Team: <strong class="text-amber-400">${tId}</strong> • <span class="${isOnline ? 'text-emerald-400' : 'text-red-400'}">${isOnline ? '🟢 Online' : '🔴 Offline'}</span></div>
          </div>
        </div>
        ${isCurrentUserHost && !isHost ? `
          <button class="btn-ban-player px-2 py-1 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 text-[10px] font-bold transition cursor-pointer" data-userid="${p.userId}">
            🚫 Ban
          </button>
        ` : ''}
      `;

      const banBtn = card.querySelector('.btn-ban-player');
      if (banBtn) {
        banBtn.onclick = () => {
          if (confirm(`Are you sure you want to ban ${p.userName} from this room?`)) {
            StorageEngine.banPlayer(room.roomId, p.userId);
            alert(`${p.userName} has been banned and removed.`);
            openRoomLobbyUI(room);
          }
        };
      }

      list.appendChild(card);
    });"""

new_render_players = """    playerKeys.forEach(tId => {
      const p = players[tId];
      const isOnline = p.isOnline !== false;
      const isHost = p.isHost || p.userId === room.hostId;

      const card = document.createElement('div');
      card.className = 'p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs';
      card.innerHTML = `
        <div class="flex items-center gap-2.5 flex-1 min-w-0">
          <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 ${isOnline ? 'bg-emerald-400' : 'bg-red-500'}" title="${isOnline ? 'Online' : 'Offline'}"></span>
          <div class="truncate">
            <div class="flex items-center gap-1.5 font-bold text-white truncate">
              <span>${p.userName || 'Manager'}</span>
              ${isHost ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40">HOST</span>' : ''}
            </div>
            <div class="text-[10px] text-slate-400">Team: <strong class="text-amber-400">${tId}</strong> • 
              <button class="btn-toggle-online cursor-pointer underline hover:text-white" title="Click to toggle Online/Offline status">
                <span class="${isOnline ? 'text-emerald-400' : 'text-red-400'}">${isOnline ? '🟢 Online' : '🔴 Offline'}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1.5 flex-shrink-0">
          ${isCurrentUserHost && !isHost && !isOnline ? `
            <button class="btn-kick-offline px-2.5 py-1 rounded-lg bg-orange-950 hover:bg-orange-900 border border-orange-700 text-orange-300 text-[10px] font-bold transition cursor-pointer flex items-center gap-1" data-userid="${p.userId}" data-team="${tId}" title="Kick offline player out of room. Franchise ${tId} will become available again.">
              <span>👢 Kick</span>
            </button>
          ` : ''}
          ${isCurrentUserHost && !isHost ? `
            <button class="btn-ban-player px-2 py-1 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 text-[10px] font-bold transition cursor-pointer" data-userid="${p.userId}">
              🚫 Ban
            </button>
          ` : ''}
        </div>
      `;

      // Allow clicking the status to toggle online/offline for testing
      const toggleBtn = card.querySelector('.btn-toggle-online');
      if (toggleBtn) {
        toggleBtn.onclick = () => {
          const newStatus = !isOnline;
          if (typeof StorageEngine.setPlayerOnlineStatus === 'function') {
            const res = StorageEngine.setPlayerOnlineStatus(room.roomId, p.userId, newStatus);
            if (res.success) {
              window.CurrentRoom = res.room;
              renderLobbyPlayersList(res.room);
            }
          }
        };
      }

      // Kick offline player handler -> frees up team back to available
      const kickBtn = card.querySelector('.btn-kick-offline');
      if (kickBtn) {
        kickBtn.onclick = () => {
          if (confirm(`Kick offline player ${p.userName} from this room? Franchise "${tId}" will immediately become available again for other players.`)) {
            const res = StorageEngine.kickPlayer(room.roomId, p.userId, tId);
            if (res.success) {
              window.CurrentRoom = res.room;
              alert(`👢 ${p.userName} has been removed from the room. Franchise "${tId}" is now available again!`);
              openRoomLobbyUI(res.room);
            }
          }
        };
      }

      // Ban button handler
      const banBtn = card.querySelector('.btn-ban-player');
      if (banBtn) {
        banBtn.onclick = () => {
          if (confirm(`Are you sure you want to ban ${p.userName} from this room? Their team "${tId}" will also become available again.`)) {
            StorageEngine.banPlayer(room.roomId, p.userId);
            StorageEngine.kickPlayer(room.roomId, p.userId, tId);
            alert(`${p.userName} has been banned and removed.`);
            openRoomLobbyUI(room);
          }
        };
      }

      list.appendChild(card);
    });"""

if old_render_players in app_js:
    app_js = app_js.replace(old_render_players, new_render_players, 1)
    print("Updated renderLobbyPlayersList in app.js with Kick Offline Player support")
else:
    print("WARNING: old_render_players not found in app.js")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)
print("app.js saved successfully.")
