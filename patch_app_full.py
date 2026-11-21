# patch_app_full.py
import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Make backup of app.js
with open('app.js.bak', 'w', encoding='utf-8') as f:
    f.write(content)
print("app.js backup created.")

# New features to append / inject into app.js
augmentation_code = '''
  // =========================================================================
  // MULTIPLAYER ROOM & REDESIGN ENGINE (FULL IMPLEMENTATION)
  // =========================================================================

  window.RoomRules = {
    maxBidEnabled: false,
    maxBidAmount: 25,
    exceedLimitEnabled: true,
    exceedThreshold: 15,
    exceedMaxPlayers: 3,
    acceleratedEnabled: true,
    timer: 10
  };

  window.CurrentRoom = null;

  // Global alert for bidding rule violation
  window.showBiddingRuleAlert = function(msg) {
    const notifyBox = document.getElementById('biddingRuleNotification');
    const notifyText = document.getElementById('biddingRuleNotificationText');
    if (notifyBox && notifyText) {
      notifyText.textContent = msg;
      notifyBox.classList.remove('hidden');
      setTimeout(() => { notifyBox.classList.add('hidden'); }, 4000);
    } else {
      alert(msg);
    }
  };

  // Switch between Auction Arena sub-panes (Live Bidding, Playing XI, Messages, Ratings, Accelerated)
  function switchArenaTab(arenaKey) {
    AppState.currentArenaTab = arenaKey;
    document.querySelectorAll('.arena-tab').forEach(btn => {
      if (btn.dataset.arenaTab === arenaKey) {
        btn.classList.add('active', 'bg-amber-500', 'text-slate-950');
        btn.classList.remove('text-slate-400');
      } else {
        btn.classList.remove('active', 'bg-amber-500', 'text-slate-950');
        btn.classList.add('text-slate-400');
      }
    });

    document.querySelectorAll('.arena-pane').forEach(pane => {
      if (pane.id === `arenaPane-${arenaKey}`) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    });

    if (arenaKey === 'playing11') {
      if (typeof renderPlaying11ViewInteractive === 'function') renderPlaying11ViewInteractive();
      renderArenaPlayerCatalogue();
    } else if (arenaKey === 'ratings') {
      if (typeof renderRatingsView === 'function') renderRatingsView();
    } else if (arenaKey === 'messages') {
      renderRoomChatMessages();
    } else if (arenaKey === 'accelerated') {
      renderAcceleratedAuctionPanel();
    }
  }
  window.switchArenaTab = switchArenaTab;

  // Intercept switchTab for 'playing11' and 'ratings' to move them inside Arena!
  const originalSwitchTab = window.switchTab || switchTab;
  window.switchTab = function(tabKey) {
    if (tabKey === 'playing11') {
      originalSwitchTab('auction');
      switchArenaTab('playing11');
      return;
    }
    if (tabKey === 'ratings') {
      originalSwitchTab('auction');
      switchArenaTab('ratings');
      return;
    }
    originalSwitchTab(tabKey);
  };

  // Initialize Welcome Modal / Identity on Page Load
  function initWelcomeAndRoomFlow() {
    const savedName = localStorage.getItem('ipl_user_name');
    const welcomeModal = document.getElementById('welcomeNewUserModal');
    const inputWelcomeName = document.getElementById('inputWelcomeUserName');
    const btnSubmitWelcome = document.getElementById('btnSubmitWelcomeName');

    // Parse URL parameter ?roomId= or ?room=
    const urlParams = new URLSearchParams(window.location.search);
    const queryRoomId = urlParams.get('roomId') || urlParams.get('room');

    if (!savedName) {
      // New User: Show Welcome Popup
      if (welcomeModal) welcomeModal.classList.remove('hidden');
      if (btnSubmitWelcome) {
        btnSubmitWelcome.onclick = () => {
          const nameVal = (inputWelcomeName?.value || '').trim();
          if (!nameVal) {
            alert('Please enter your name to continue.');
            return;
          }
          localStorage.setItem('ipl_user_name', nameVal);
          StorageEngine.loginUser(nameVal, AppState.userTeamId || 'RCB');
          if (welcomeModal) welcomeModal.classList.add('hidden');

          // If from a room link, redirect directly to that room!
          if (queryRoomId) {
            handleJoinSpecificRoom(queryRoomId);
          } else {
            renderHomeAuctionHistory();
            renderPublicRoomsList();
          }
        };
      }
    } else {
      // Old User: Log in automatically and show past history
      StorageEngine.loginUser(savedName, AppState.userTeamId || 'RCB');
      if (queryRoomId) {
        handleJoinSpecificRoom(queryRoomId);
      } else {
        renderHomeAuctionHistory();
        renderPublicRoomsList();
      }
    }

    // Attach Room Create & Join Button Handlers
    initRoomActionListeners();
  }

  // Handle Joining Specific Room via Link or Code
  function handleJoinSpecificRoom(roomId) {
    const user = StorageEngine.currentUser || { userId: 'user_' + Date.now(), userName: localStorage.getItem('ipl_user_name') || 'Manager' };
    const res = StorageEngine.joinRoom(roomId, AppState.userTeamId, user.userId, user.userName);

    if (!res.success) {
      if (res.reason === 'banned') {
        alert('🚫 You have been banned from this room by the host.');
        window.switchTab('home');
        return;
      }
      alert('Room not found or expired.');
      return;
    }

    window.CurrentRoom = res.room;
    window.RoomRules = res.room.rules || window.RoomRules;
    AppState.isSpectator = !!res.isSpectator;

    // Open Room Lobby
    openRoomLobbyUI(res.room);
  }

  // Open Room Lobby UI
  function openRoomLobbyUI(room) {
    window.CurrentRoom = room;
    const lobbySec = document.getElementById('roomLobbySection');
    if (!lobbySec) return;

    lobbySec.classList.remove('hidden');
    lobbySec.scrollIntoView({ behavior: 'smooth' });

    // Update badges
    const roomBadge = document.getElementById('lobbyRoomBadge');
    if (roomBadge) roomBadge.textContent = `ROOM: ${room.roomId}`;

    const modeBadge = document.getElementById('lobbyModeBadge');
    if (modeBadge) modeBadge.textContent = room.mode === 'MINI' ? 'Mini Auction' : 'Mega Auction';

    const visBadge = document.getElementById('lobbyVisibilityBadge');
    if (visBadge) visBadge.textContent = room.visibility === 'PUBLIC' ? 'Public Room' : 'Private Room';

    // Share link
    const linkInput = document.getElementById('inputLobbyShareLink');
    const joinUrl = `https://iplauctiongamehaswanthkodali88.workers.dev/?roomId=${room.roomId}`;
    if (linkInput) linkInput.value = joinUrl;

    const copyBtn = document.getElementById('btnCopyLobbyLink');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(joinUrl).then(() => {
          const txt = document.getElementById('copyLobbyBtnText');
          if (txt) txt.textContent = 'Copied!';
          setTimeout(() => { if (txt) txt.textContent = 'Copy'; }, 2000);
        });
      };
    }

    const waBtn = document.getElementById('btnShareLobbyWhatsApp');
    if (waBtn) {
      waBtn.onclick = () => {
        const text = encodeURIComponent(`Join my live IPL Auction Room (${room.roomId})! Click here to play: ${joinUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      };
    }

    // Rules display
    const rFormat = document.getElementById('ruleDisplayFormat');
    if (rFormat) rFormat.textContent = room.mode === 'MINI' ? '2027 Mini Auction' : 'Mega Auction';

    const rMax = document.getElementById('ruleDisplayMaxBid');
    if (rMax) rMax.textContent = room.rules?.maxBidEnabled ? `Max ₹${room.rules.maxBidAmount}.00 Cr` : 'None (No Cap)';

    const rExceed = document.getElementById('ruleDisplayExceedLimit');
    if (rExceed) rExceed.textContent = room.rules?.exceedLimitEnabled ? `Max ${room.rules.exceedMaxPlayers} > ₹${room.rules.exceedThreshold} Cr` : 'Unlimited';

    const rAcc = document.getElementById('ruleDisplayAccelerated');
    if (rAcc) rAcc.textContent = room.rules?.acceleratedEnabled ? 'Enabled (ON)' : 'Disabled (OFF)';

    // Render 10 Teams Grid for Room (Lock already taken teams)
    renderLobbyTeamsGrid(room);

    // Render Players in Room with Online / Offline (Green / Red) & Host Ban buttons
    renderLobbyPlayersList(room);

    // Host controls vs Non-host waiting message
    const currentUser = StorageEngine.currentUser;
    const isHost = (currentUser && currentUser.userId === room.hostId) || room.hostId === 'user_host' || !room.hostId;
    const hostPanel = document.getElementById('lobbyHostPanel');
    const waitingNotice = document.getElementById('lobbyWaitingNotice');

    if (isHost) {
      if (hostPanel) hostPanel.classList.remove('hidden');
      if (waitingNotice) waitingNotice.classList.add('hidden');
      initLobbyHostControls(room);
    } else {
      if (hostPanel) hostPanel.classList.add('hidden');
      if (waitingNotice) waitingNotice.classList.remove('hidden');
    }
  }

  // Render Lobby Teams Grid (Disables taken teams, lets user pick remaining)
  function renderLobbyTeamsGrid(room) {
    const grid = document.getElementById('lobbyTeamsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const allTeams = ['CSK', 'MI', 'RCB', 'KKR', 'DC', 'PBKS', 'RR', 'SRH', 'GT', 'LSG'];
    const takenMap = room.players || {};

    allTeams.forEach(teamId => {
      const takenBy = takenMap[teamId];
      const isMyTeam = AppState.userTeamId === teamId;
      const isTaken = !!takenBy;

      const card = document.createElement('div');
      card.className = `p-3 rounded-2xl border-2 transition relative flex flex-col justify-between ${
        isTaken
          ? (isMyTeam ? 'bg-amber-950/60 border-amber-500 shadow-md' : 'bg-slate-950/70 border-slate-800 opacity-60 cursor-not-allowed')
          : 'bg-slate-900 border-slate-700 hover:border-amber-400 cursor-pointer shadow-lg'
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-sm text-white">${teamId}</span>
          ${isTaken
            ? `<span class="px-2 py-0.5 rounded text-[9px] font-black ${isMyTeam ? 'bg-amber-500 text-slate-950' : 'bg-red-950 text-red-300 border border-red-800'}">
                ${isMyTeam ? 'YOU' : 'TAKEN'}
               </span>`
            : `<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">AVAILABLE</span>`
          }
        </div>
        <div class="text-[10px] text-slate-400 mt-2 truncate">
          ${isTaken ? `Manager: ${takenBy.userName || 'Player'}` : 'Click to Select'}
        </div>
      `;

      if (!isTaken) {
        card.onclick = () => {
          AppState.userTeamId = teamId;
          const user = StorageEngine.currentUser || { userId: 'user_' + Date.now(), userName: 'Manager' };
          StorageEngine.joinRoom(room.roomId, teamId, user.userId, user.userName);
          AuctionAudio.playBidPaddle();
          openRoomLobbyUI(room);
          updateTopBar();
        };
      }

      grid.appendChild(card);
    });

    // Check if spectator
    const takenCount = Object.keys(takenMap).length;
    const specBadge = document.getElementById('spectatorNoticeBadge');
    if (specBadge) {
      if (AppState.isSpectator || takenCount >= 10) {
        specBadge.classList.remove('hidden');
      } else {
        specBadge.classList.add('hidden');
      }
    }
  }

  // Render Joined Players List with Green/Red status & Host Ban buttons
  function renderLobbyPlayersList(room) {
    const list = document.getElementById('lobbyPlayersList');
    const countBadge = document.getElementById('lobbyPlayersCount');
    if (!list) return;
    list.innerHTML = '';

    const players = room.players || {};
    const playerKeys = Object.keys(players);
    if (countBadge) countBadge.textContent = playerKeys.length;

    const currentUser = StorageEngine.currentUser;
    const isCurrentUserHost = (currentUser && currentUser.userId === room.hostId) || room.hostId === 'user_host' || !room.hostId;

    playerKeys.forEach(tId => {
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
    });
  }

  // Host Controls inside Room Lobby
  function initLobbyHostControls(room) {
    const btn5s = document.getElementById('btnLobbyTimer5s');
    const btn10s = document.getElementById('btnLobbyTimer10s');
    const btnStart = document.getElementById('btnHostStartAuction');

    if (btn5s) {
      btn5s.onclick = () => {
        btn5s.className = 'btn-timer-opt px-3 py-1.5 rounded-xl border border-amber-500 bg-amber-500 text-slate-950 font-bold transition cursor-pointer';
        if (btn10s) btn10s.className = 'btn-timer-opt px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-bold hover:text-white transition cursor-pointer';
        window.RoomRules.timer = 5;
        if (typeof Game !== 'undefined' && Game.setBidDuration) Game.setBidDuration(5);
      };
    }

    if (btn10s) {
      btn10s.onclick = () => {
        btn10s.className = 'btn-timer-opt px-3 py-1.5 rounded-xl border border-amber-500 bg-amber-500 text-slate-950 font-bold transition cursor-pointer';
        if (btn5s) btn5s.className = 'btn-timer-opt px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-bold hover:text-white transition cursor-pointer';
        window.RoomRules.timer = 10;
        if (typeof Game !== 'undefined' && Game.setBidDuration) Game.setBidDuration(10);
      };
    }

    if (btnStart) {
      btnStart.onclick = () => {
        // Apply auction mode & start
        if (typeof setAuctionMode === 'function') {
          setAuctionMode(room.mode || 'MINI');
        }
        if (typeof Game !== 'undefined') {
          if (Game.setBidDuration) Game.setBidDuration(window.RoomRules.timer || 10);
          Game.startAuction();
        }
        window.switchTab('auction');
        switchArenaTab('bidding');
        AuctionAudio.playHammerHit();
      };
    }
  }

  // Room Action Listeners (Create, Join, Browse)
  function initRoomActionListeners() {
    // 1. Open Create Room Modal
    const btnOpenCreate = document.getElementById('btnOpenCreateRoomModal');
    const modalCreate = document.getElementById('createRoomModal');
    const btnCloseCreate = document.getElementById('btnCloseCreateRoomModal');

    if (btnOpenCreate && modalCreate) {
      btnOpenCreate.onclick = () => modalCreate.classList.remove('hidden');
    }
    if (btnCloseCreate && modalCreate) {
      btnCloseCreate.onclick = () => modalCreate.classList.add('hidden');
    }

    // Create Room Options State
    let createConfig = {
      mode: 'MINI',
      visibility: 'PUBLIC',
      maxBidEnabled: false,
      maxBidAmount: 25,
      exceedLimitEnabled: true,
      exceedThreshold: 15,
      exceedMaxPlayers: 3,
      acceleratedEnabled: true,
      timer: 10
    };

    // Format buttons
    const btnOptMini = document.getElementById('btnCreateOptMini');
    const btnOptMega = document.getElementById('btnCreateOptMega');
    if (btnOptMini && btnOptMega) {
      btnOptMini.onclick = () => {
        createConfig.mode = 'MINI';
        btnOptMini.className = 'btn-create-format p-4 rounded-2xl border-2 border-amber-400 bg-amber-500/10 text-left space-y-1 transition cursor-pointer';
        btnOptMega.className = 'btn-create-format p-4 rounded-2xl border-2 border-slate-700 bg-slate-950 text-left space-y-1 transition cursor-pointer hover:border-slate-500';
      };
      btnOptMega.onclick = () => {
        createConfig.mode = 'MEGA';
        btnOptMega.className = 'btn-create-format p-4 rounded-2xl border-2 border-blue-400 bg-blue-500/10 text-left space-y-1 transition cursor-pointer';
        btnOptMini.className = 'btn-create-format p-4 rounded-2xl border-2 border-slate-700 bg-slate-950 text-left space-y-1 transition cursor-pointer hover:border-slate-500';
      };
    }

    // Visibility buttons
    const btnOptPub = document.getElementById('btnCreateOptPublic');
    const btnOptPriv = document.getElementById('btnCreateOptPrivate');
    if (btnOptPub && btnOptPriv) {
      btnOptPub.onclick = () => {
        createConfig.visibility = 'PUBLIC';
        btnOptPub.className = 'btn-create-vis p-3.5 rounded-2xl border-2 border-emerald-400 bg-emerald-500/10 text-left transition cursor-pointer';
        btnOptPriv.className = 'btn-create-vis p-3.5 rounded-2xl border-2 border-slate-700 bg-slate-950 text-left transition cursor-pointer hover:border-slate-500';
      };
      btnOptPriv.onclick = () => {
        createConfig.visibility = 'PRIVATE';
        btnOptPriv.className = 'btn-create-vis p-3.5 rounded-2xl border-2 border-purple-400 bg-purple-500/10 text-left transition cursor-pointer';
        btnOptPub.className = 'btn-create-vis p-3.5 rounded-2xl border-2 border-slate-700 bg-slate-950 text-left transition cursor-pointer hover:border-slate-500';
      };
    }

    // Rule A: Max Bid
    const btnMaxYes = document.getElementById('btnRuleMaxBidYes');
    const btnMaxNo = document.getElementById('btnRuleMaxBidNo');
    const subMax = document.getElementById('ruleMaxBidSubGroup');
    if (btnMaxYes && btnMaxNo && subMax) {
      btnMaxYes.onclick = () => {
        createConfig.maxBidEnabled = true;
        btnMaxYes.className = 'btn-toggle-rule active px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition';
        btnMaxNo.className = 'btn-toggle-rule px-3 py-1 rounded-lg text-xs font-bold transition';
        subMax.classList.remove('hidden');
      };
      btnMaxNo.onclick = () => {
        createConfig.maxBidEnabled = false;
        btnMaxNo.className = 'btn-toggle-rule active px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition';
        btnMaxYes.className = 'btn-toggle-rule px-3 py-1 rounded-lg text-xs font-bold transition';
        subMax.classList.add('hidden');
      };
    }

    // Rule B: Exceed Limit
    const btnExcYes = document.getElementById('btnRuleExceedYes');
    const btnExcNo = document.getElementById('btnRuleExceedNo');
    const subExc = document.getElementById('ruleExceedSubGroup');
    if (btnExcYes && btnExcNo && subExc) {
      btnExcYes.onclick = () => {
        createConfig.exceedLimitEnabled = true;
        btnExcYes.className = 'btn-toggle-rule active px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition';
        btnExcNo.className = 'btn-toggle-rule px-3 py-1 rounded-lg text-xs font-bold transition';
        subExc.classList.remove('hidden');
      };
      btnExcNo.onclick = () => {
        createConfig.exceedLimitEnabled = false;
        btnExcNo.className = 'btn-toggle-rule active px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition';
        btnExcYes.className = 'btn-toggle-rule px-3 py-1 rounded-lg text-xs font-bold transition';
        subExc.classList.add('hidden');
      };
    }

    // Rule C: Accelerated
    const btnAccOn = document.getElementById('btnRuleAcceleratedOn');
    const btnAccOff = document.getElementById('btnRuleAcceleratedOff');
    if (btnAccOn && btnAccOff) {
      btnAccOn.onclick = () => {
        createConfig.acceleratedEnabled = true;
        btnAccOn.className = 'btn-toggle-rule active px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition';
        btnAccOff.className = 'btn-toggle-rule px-3 py-1 rounded-lg text-xs font-bold transition';
      };
      btnAccOff.onclick = () => {
        createConfig.acceleratedEnabled = false;
        btnAccOff.className = 'btn-toggle-rule active px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition';
        btnAccOn.className = 'btn-toggle-rule px-3 py-1 rounded-lg text-xs font-bold transition';
      };
    }

    // Confirm Create Room
    const btnConfirm = document.getElementById('btnConfirmCreateRoom');
    if (btnConfirm) {
      btnConfirm.onclick = () => {
        createConfig.maxBidAmount = Number(document.getElementById('selectMaxBidAmount')?.value) || 25;
        createConfig.exceedThreshold = Number(document.getElementById('selectExceedAmount')?.value) || 15;
        createConfig.exceedMaxPlayers = Number(document.getElementById('selectExceedPlayersCount')?.value) || 3;
        createConfig.hostTeam = AppState.userTeamId || 'RCB';

        const room = StorageEngine.createAuctionRoom(createConfig);
        if (modalCreate) modalCreate.classList.add('hidden');

        window.CurrentRoom = room;
        window.RoomRules = room.rules;

        AuctionAudio.playSoldFanfare();
        openRoomLobbyUI(room);
        renderPublicRoomsList();
      };
    }

    // 2. Join Room Modal
    const btnOpenJoin = document.getElementById('btnOpenJoinRoomModal');
    const modalJoin = document.getElementById('joinRoomModal');
    const btnCloseJoin = document.getElementById('btnCloseJoinRoomModal');
    const inputJoinCode = document.getElementById('inputJoinRoomCode');
    const btnConfirmJoin = document.getElementById('btnConfirmJoinRoom');

    if (btnOpenJoin && modalJoin) {
      btnOpenJoin.onclick = () => modalJoin.classList.remove('hidden');
    }
    if (btnCloseJoin && modalJoin) {
      btnCloseJoin.onclick = () => modalJoin.classList.add('hidden');
    }
    if (btnConfirmJoin && inputJoinCode) {
      btnConfirmJoin.onclick = () => {
        let code = inputJoinCode.value.trim();
        if (!code) {
          alert('Please enter a room code or link.');
          return;
        }
        if (code.includes('?roomId=')) {
          code = code.split('?roomId=')[1].split('&')[0];
        } else if (code.includes('?room=')) {
          code = code.split('?room=')[1].split('&')[0];
        }
        if (modalJoin) modalJoin.classList.add('hidden');
        handleJoinSpecificRoom(code);
      };
    }

    // 3. Refresh Public Rooms
    const btnRefPub = document.getElementById('btnRefreshPublicRooms');
    if (btnRefPub) {
      btnRefPub.onclick = () => renderPublicRoomsList();
    }

    // 4. Arena Sub-Tabs Navigation Buttons
    document.querySelectorAll('.arena-tab').forEach(btn => {
      btn.onclick = () => {
        const arenaKey = btn.dataset.arenaTab;
        if (arenaKey) switchArenaTab(arenaKey);
      };
    });

    // 5. Host Arena Timer & Pause Controls
    const btnH5 = document.getElementById('btnHostTimer5s');
    const btnH10 = document.getElementById('btnHostTimer10s');
    const btnHPause = document.getElementById('btnHostPauseResume');

    if (btnH5) {
      btnH5.onclick = () => {
        if (typeof Game !== 'undefined' && Game.setBidDuration) Game.setBidDuration(5);
        btnH5.className = 'px-2 py-1 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-bold';
        if (btnH10) btnH10.className = 'px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold';
      };
    }
    if (btnH10) {
      btnH10.onclick = () => {
        if (typeof Game !== 'undefined' && Game.setBidDuration) Game.setBidDuration(10);
        btnH10.className = 'px-2 py-1 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-bold';
        if (btnH5) btnH5.className = 'px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold';
      };
    }
    if (btnHPause) {
      btnHPause.onclick = () => {
        if (typeof Game !== 'undefined' && Game.togglePause) {
          const paused = Game.togglePause();
          btnHPause.textContent = paused ? '▶️ Resume' : '⏸️ Pause';
        }
      };
    }
  }

  // Render Public Rooms List
  function renderPublicRoomsList() {
    const grid = document.getElementById('publicRoomsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const rooms = StorageEngine.getPublicRooms();
    if (rooms.length === 0) {
      grid.innerHTML = '<div class="col-span-3 text-slate-500 text-center py-6 text-xs">No public rooms active right now. Click "Create Auction Room" above to start one!</div>';
      return;
    }

    rooms.forEach(room => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/60 transition shadow-lg space-y-3';
      const takenCount = Object.keys(room.players || {}).length;

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${room.mode === 'MINI' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'}">
            ${room.mode === 'MINI' ? '⚡ Mini Auction' : '🔥 Mega Auction'}
          </span>
          <span class="text-xs font-mono font-bold text-amber-400">${room.roomId}</span>
        </div>
        <div>
          <h4 class="font-bold text-white text-sm truncate">${room.roomName || room.roomId}</h4>
          <p class="text-[11px] text-slate-400">Host: <span class="text-slate-200">${room.hostName || 'Organizer'}</span></p>
        </div>
        <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <span class="text-slate-400">Franchises: <strong class="text-white">${takenCount}/10</strong></span>
          <button class="btn-join-public-room px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow">
            Join Room ➔
          </button>
        </div>
      `;

      card.querySelector('.btn-join-public-room').onclick = () => {
        handleJoinSpecificRoom(room.roomId);
      };

      grid.appendChild(card);
    });
  }

  // Render Previous Auction History (for returning users)
  function renderHomeAuctionHistory() {
    const list = document.getElementById('homePastAuctionsList');
    const badge = document.getElementById('historyCountBadge');
    if (!list) return;

    const history = StorageEngine.getAuctionHistory();
    if (badge) badge.textContent = `${history.length} Previous Auctions`;

    if (history.length === 0) {
      list.innerHTML = '<div class="text-slate-500 text-center py-8 text-xs">No completed auctions found. Start bidding in an auction room to create your career history!</div>';
      return;
    }

    list.innerHTML = '';
    history.forEach((entry, idx) => {
      const card = document.createElement('div');
      card.className = 'p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-4';

      // Build Top 5 Bids HTML
      let top5Html = '';
      if (entry.top5Bids && entry.top5Bids.length > 0) {
        top5Html = `
          <div class="mt-2 pt-2 border-t border-slate-800/80">
            <span class="text-[11px] uppercase font-bold text-amber-400 block mb-1.5">⚡ Top Bids Recorded:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
              ${entry.top5Bids.map((b, bIdx) => `
                <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div class="flex items-center justify-between text-[10px] text-slate-400">
                    <span>#${bIdx + 1}</span>
                    <span class="font-bold text-amber-300">₹${Number(b.amount || b.price || b.bid || 0).toFixed(2)} Cr</span>
                  </div>
                  <strong class="text-white block truncate text-[11px] mt-0.5">${b.player?.name || b.name || 'Player'}</strong>
                  <span class="text-[10px] text-slate-400">${b.team?.shortName || b.teamId || 'Team'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ${entry.mode || 'Mini'} Auction
              </span>
              <span class="text-xs font-mono text-slate-400">Room: ${entry.roomId}</span>
              <span class="text-xs text-slate-500">• ${entry.date}</span>
            </div>
            <h3 class="text-base font-bold text-white mt-1">
              Managed: <span class="text-amber-400">${entry.userTeam || 'RCB'}</span> • Auctioneer: <span class="text-slate-300">${entry.auctioneerName || 'Manager'}</span>
            </h3>
          </div>

          <!-- Download Action Buttons -->
          <div class="flex items-center gap-2">
            <button class="btn-download-history-pdf px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700/60 text-red-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer">
              <span>📄</span> <span>PDF</span>
            </button>
            <button class="btn-download-history-png px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-700/60 text-purple-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer">
              <span>🖼️</span> <span>PNG Card</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-center">
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-semibold block">Total Spent</span>
            <strong class="text-amber-400">₹${Number(entry.totalSpent || 0).toFixed(2)} Cr</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-semibold block">Squad Count</span>
            <strong class="text-white">${entry.squadCount || (entry.allBuys || []).length} Players</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-semibold block">AI Squad Rating</span>
            <strong class="text-emerald-400">${entry.aiRating || '92.4'}/100</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-semibold block">User Rating</span>
            <strong class="text-purple-400">${entry.userRating || '9.5 ★'}</strong>
          </div>
        </div>

        ${top5Html}
      `;

      card.querySelector('.btn-download-history-pdf').onclick = () => downloadHistoryItemPDF(entry);
      card.querySelector('.btn-download-history-png').onclick = () => downloadHistoryItemPNG(entry);

      list.appendChild(card);
    });
  }

  // =========================================================================
  // INTERACTIVE PLAYER CATALOGUE IN AUCTION ARENA (WK, BAT, AR, BOWL FILTERS)
  // =========================================================================
  let currentArenaRoleFilter = 'ALL';

  function renderArenaPlayerCatalogue() {
    const container = document.getElementById('arenaCatListContainer');
    const countBadge = document.getElementById('arenaCatFilteredCount');
    const searchInput = document.getElementById('inputArenaCatSearch');
    if (!container) return;

    // Attach role buttons
    document.querySelectorAll('.btn-arena-role-filter').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.btn-arena-role-filter').forEach(b => {
          b.className = 'btn-arena-role-filter px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer';
        });
        btn.className = 'btn-arena-role-filter active px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 transition cursor-pointer';
        currentArenaRoleFilter = btn.dataset.role || 'ALL';
        renderArenaPlayerCatalogue();
      };
    });

    if (searchInput && !searchInput.dataset.bound) {
      searchInput.dataset.bound = 'true';
      searchInput.oninput = () => renderArenaPlayerCatalogue();
    }

    const query = (searchInput?.value || '').trim().toLowerCase();
    const allPlayers = (typeof PLAYERS !== 'undefined') ? PLAYERS : ((typeof window !== 'undefined' && window.PLAYERS) ? window.PLAYERS : []);

    const filtered = allPlayers.filter(p => {
      if (query && !p.name.toLowerCase().includes(query)) return false;
      if (currentArenaRoleFilter === 'ALL') return true;

      const r = (p.role || '').toUpperCase();
      if (currentArenaRoleFilter === 'WICKETKEEPER') return r.includes('WICKET') || r.includes('WK');
      if (currentArenaRoleFilter === 'BATTER') return r.includes('BAT') && !r.includes('ALL') && !r.includes('WK');
      if (currentArenaRoleFilter === 'ALLROUNDER') return r.includes('ALL') || r === 'AR';
      if (currentArenaRoleFilter === 'BOWLER') return r.includes('BOWL');
      return true;
    });

    if (countBadge) countBadge.textContent = `Showing ${filtered.length} players`;
    container.innerHTML = '';

    filtered.slice(0, 80).forEach(player => {
      const stats = (typeof PLAYER_STATS !== 'undefined' && PLAYER_STATS[player.name]) ? PLAYER_STATS[player.name] : {};
      const card = document.createElement('div');
      card.className = 'p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3 hover:border-slate-700 transition';

      card.innerHTML = `
        <div class="w-12 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700 relative">
          ${typeof renderPlayerAvatarImg === 'function' ? renderPlayerAvatarImg(player, 'w-full h-full object-cover object-top') : `<img src="${player.image || ''}" class="w-full h-full object-cover" onerror="handlePlayerImageError(this)">`}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-1">
            <h4 class="font-bold text-white text-xs truncate">${player.name}</h4>
            <span class="text-[10px] font-bold text-amber-400">OVR ${player.rating || player.ovr || 85}</span>
          </div>
          <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
            <span>${player.overseas ? '✈️ OS' : '🇮🇳 Ind'}</span>
            <span>•</span>
            <span class="text-blue-300 font-semibold">${player.role || 'Player'}</span>
            <span>•</span>
            <span class="text-slate-300 font-mono">₹${Number(player.basePrice || 0.20).toFixed(2)} Cr</span>
          </div>
          <div class="text-[9px] text-slate-500 mt-1 truncate">
            M: ${stats.matches || '--'} | Runs: ${stats.runs || '--'} | Wkts: ${stats.wickets || '--'} | SR: ${stats.strikeRate || '--'}
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // =========================================================================
  // LIVE ROOM CHAT & MESSAGING IN AUCTION ARENA
  // =========================================================================
  const roomMessagesFeed = [];

  function renderRoomChatMessages() {
    const container = document.getElementById('chatMessagesContainer');
    const input = document.getElementById('inputChatMessage');
    const btnSend = document.getElementById('btnSendChatMessage');
    if (!container) return;

    if (roomMessagesFeed.length === 0) {
      container.innerHTML = '<div class="text-slate-500 text-center py-8">Chat room opened. Welcome managers! Discuss bids and banter here.</div>';
    } else {
      container.innerHTML = roomMessagesFeed.map(m => `
        <div class="p-2.5 rounded-xl ${m.isSystem ? 'bg-slate-900 border border-slate-800 text-amber-300' : 'bg-slate-950 border border-slate-800/80'}">
          <div class="flex items-center justify-between text-[10px] text-slate-500">
            <strong class="text-white">${m.sender} ${m.team ? `(${m.team})` : ''}</strong>
            <span>${m.time}</span>
          </div>
          <div class="text-xs text-slate-300 mt-1">${m.text}</div>
        </div>
      `).join('');
      container.scrollTop = container.scrollHeight;
    }

    if (btnSend && !btnSend.dataset.bound) {
      btnSend.dataset.bound = 'true';
      const sendAction = () => {
        const text = (input?.value || '').trim();
        if (!text) return;
        const user = StorageEngine.currentUser || { userName: 'Manager' };
        roomMessagesFeed.push({
          sender: user.userName,
          team: AppState.userTeamId,
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        if (input) input.value = '';
        renderRoomChatMessages();
      };
      btnSend.onclick = sendAction;
      if (input) {
        input.onkeypress = (e) => { if (e.key === 'Enter') sendAction(); };
      }
    }

    // Banter Pills
    document.querySelectorAll('.btn-chat-quick-pill').forEach(pill => {
      pill.onclick = () => {
        const user = StorageEngine.currentUser || { userName: 'Manager' };
        roomMessagesFeed.push({
          sender: user.userName,
          team: AppState.userTeamId,
          text: pill.textContent.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        renderRoomChatMessages();
      };
    });
  }

  // =========================================================================
  // ACCELERATED AUCTION PANEL (UNSOLD RE-AUCTION & SQUAD RELEASES WITH REFUND)
  // =========================================================================
  function renderAcceleratedAuctionPanel() {
    const unsoldContainer = document.getElementById('acceleratedUnsoldList');
    const releaseContainer = document.getElementById('acceleratedReleaseList');
    const btnFinish = document.getElementById('btnFinishAcceleratedRound');
    const btnStartAcc = document.getElementById('btnStartAcceleratedRound');

    const myTeam = (typeof Game !== 'undefined' && Game.getTeam) ? Game.getTeam(AppState.userTeamId) : null;
    const unsoldPlayers = (typeof Game !== 'undefined' && Game.getGameState) ? (Game.getGameState().unsold || []) : [];

    // Render my squad releases (refunds full price, returns to auction at base price)
    if (releaseContainer && myTeam) {
      releaseContainer.innerHTML = '';
      if ((myTeam.players || []).length === 0) {
        releaseContainer.innerHTML = '<div class="text-slate-500 text-xs col-span-3">No players in squad to release.</div>';
      } else {
        myTeam.players.forEach(p => {
          const card = document.createElement('div');
          card.className = 'p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs';
          card.innerHTML = `
            <div>
              <strong class="text-white block">${p.name}</strong>
              <span class="text-[10px] text-slate-400">Bought for: <strong class="text-amber-400">₹${Number(p.soldPrice || p.price || 0).toFixed(2)} Cr</strong></span>
            </div>
            ${p.isRetained
              ? '<span class="text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded bg-slate-900">Retained Core</span>'
              : `<button class="btn-release-player px-2.5 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 font-bold text-[10px] border border-red-800 transition cursor-pointer">
                  Release & Refund
                 </button>`
            }
          `;

          const relBtn = card.querySelector('.btn-release-player');
          if (relBtn) {
            relBtn.onclick = () => {
              if (confirm(`Release ${p.name}? You will get a full refund of ₹${Number(p.soldPrice || p.price || 0).toFixed(2)} Cr, and ${p.name} will be available for re-auction at base price.`)) {
                if (typeof Game !== 'undefined' && Game.releasePlayerFromTeam) {
                  Game.releasePlayerFromTeam(myTeam.id, p.id || p.name);
                  AuctionAudio.playHammerHit();
                  renderAcceleratedAuctionPanel();
                  updateTopBar();
                }
              }
            };
          }
          releaseContainer.appendChild(card);
        });
      }
    }

    // Render Unsold Players List
    if (unsoldContainer) {
      unsoldContainer.innerHTML = '';
      if (unsoldPlayers.length === 0) {
        unsoldContainer.innerHTML = '<div class="text-slate-500 text-xs col-span-4 text-center py-4">No unsold players currently.</div>';
      } else {
        unsoldPlayers.forEach(p => {
          const card = document.createElement('div');
          card.className = 'p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs';
          card.innerHTML = `
            <div>
              <strong class="text-white block text-[11px] truncate">${p.name}</strong>
              <span class="text-[10px] text-slate-400">Base: ₹${Number(p.basePrice || 0.20).toFixed(2)} Cr</span>
            </div>
            <button class="btn-nominate-player px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition cursor-pointer">
              + Re-Auction
            </button>
          `;
          card.querySelector('.btn-nominate-player').onclick = () => {
            if (typeof Game !== 'undefined' && Game.nominateUnsoldPlayer) {
              Game.nominateUnsoldPlayer(p.id || p.name);
              alert(`${p.name} nominated for accelerated round!`);
              renderAcceleratedAuctionPanel();
            }
          };
          unsoldContainer.appendChild(card);
        });
      }
    }

    if (btnStartAcc) {
      btnStartAcc.onclick = () => {
        switchArenaTab('bidding');
      };
    }

    if (btnFinish) {
      btnFinish.onclick = () => {
        switchArenaTab('playing11');
      };
    }
  }

  // =========================================================================
  // PDF & PNG EXPORT SYSTEM (DOWNLOAD ALL AUCTION DATA)
  // =========================================================================
  function downloadAuctionReportPDF() {
    const user = StorageEngine.currentUser || { userName: 'Manager' };
    const myTeam = (typeof Game !== 'undefined' && Game.getTeam) ? Game.getTeam(AppState.userTeamId) : null;
    const history = StorageEngine.getAuctionHistory();
    const entry = history[0] || {
      date: new Date().toLocaleString(),
      mode: AppState.auctionMode || 'Mini',
      roomId: window.CurrentRoom?.roomId || 'IPL-2027',
      totalSpent: myTeam?.spent || 0,
      squadCount: myTeam?.players?.length || 0,
      top5Bids: [],
      allBuys: myTeam?.players || []
    };

    downloadHistoryItemPDF(entry);
  }

  function downloadHistoryItemPDF(entry) {
    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Please allow popups to download the PDF report.');
      return;
    }

    const userName = entry.auctioneerName || (StorageEngine.currentUser?.userName) || 'Manager';
    const topBidsHtml = (entry.top5Bids || []).map((b, i) => `
      <tr>
        <td style="padding:6px;border-bottom:1px solid #ddd;">#${i + 1}</td>
        <td style="padding:6px;border-bottom:1px solid #ddd;"><strong>${b.player?.name || b.name || 'Player'}</strong></td>
        <td style="padding:6px;border-bottom:1px solid #ddd;">${b.team?.shortName || b.teamId || 'Team'}</td>
        <td style="padding:6px;border-bottom:1px solid #ddd;color:#b45309;font-weight:bold;">₹${Number(b.amount || b.price || b.bid || 0).toFixed(2)} Cr</td>
      </tr>
    `).join('');

    const buysHtml = (entry.allBuys || []).map((p, i) => `
      <tr>
        <td style="padding:6px;border-bottom:1px solid #ddd;">${i + 1}</td>
        <td style="padding:6px;border-bottom:1px solid #ddd;"><strong>${p.name}</strong></td>
        <td style="padding:6px;border-bottom:1px solid #ddd;">${p.role || 'Player'}</td>
        <td style="padding:6px;border-bottom:1px solid #ddd;">${p.overseas ? '✈️ Overseas' : '🇮🇳 Indian'}</td>
        <td style="padding:6px;border-bottom:1px solid #ddd;color:#047857;font-weight:bold;">₹${Number(p.soldPrice || p.price || 0).toFixed(2)} Cr</td>
      </tr>
    `).join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>IPL Auction Report - ${userName}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #1e293b; }
          .header { border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px; }
          h1 { color: #0f172a; margin: 0; font-size: 24px; }
          .meta { font-size: 12px; color: #64748b; margin-top: 5px; }
          .stats-grid { display: flex; gap: 15px; margin: 15px 0; }
          .stat-box { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th { background: #0f172a; color: white; padding: 8px; text-align: left; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏏 OFFICIAL IPL AUCTION TOURNAMENT REPORT</h1>
          <div class="meta">
            Manager: <strong>${userName}</strong> | Franchise: <strong>${entry.userTeam || 'RCB'}</strong> | Room ID: <strong>${entry.roomId || 'IPL-2027'}</strong> | Format: <strong>${entry.mode || 'Mini'} Auction</strong> | Date: ${entry.date}
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-box"><div>Total Spent</div><div style="font-size:18px;font-weight:bold;color:#b45309;">₹${Number(entry.totalSpent || 0).toFixed(2)} Cr</div></div>
          <div class="stat-box"><div>Squad Count</div><div style="font-size:18px;font-weight:bold;color:#2563eb;">${entry.squadCount || (entry.allBuys || []).length} Players</div></div>
          <div class="stat-box"><div>AI Squad Rating</div><div style="font-size:18px;font-weight:bold;color:#10b981;">${entry.aiRating || '92.4'}/100</div></div>
          <div class="stat-box"><div>User Grade</div><div style="font-size:18px;font-weight:bold;color:#7c3aed;">${entry.userRating || '9.5 ★'}</div></div>
        </div>

        <h3>⚡ TOP 5 BIDS OF THIS TOURNAMENT</h3>
        <table>
          <thead><tr><th>Rank</th><th>Player</th><th>Team</th><th>Price</th></tr></thead>
          <tbody>${topBidsHtml || '<tr><td colspan="4" style="padding:10px;text-align:center;">No high bids recorded</td></tr>'}</tbody>
        </table>

        <h3 style="margin-top:25px;">📋 COMPLETE TEAM ROSTER & PURCHASES</h3>
        <table>
          <thead><tr><th>#</th><th>Player Name</th><th>Role</th><th>Origin</th><th>Price</th></tr></thead>
          <tbody>${buysHtml || '<tr><td colspan="5" style="padding:10px;text-align:center;">No players bought</td></tr>'}</tbody>
        </table>

        <div class="no-print" style="margin-top:25px;text-align:center;">
          <button onclick="window.print()" style="background:#f59e0b;color:#0f172a;border:none;padding:10px 25px;font-size:14px;font-weight:bold;border-radius:8px;cursor:pointer;">Save as PDF / Print 🖨️</button>
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function downloadAuctionReportPNG() {
    const history = StorageEngine.getAuctionHistory();
    const entry = history[0] || {
      date: new Date().toLocaleDateString(),
      mode: AppState.auctionMode || 'Mini',
      roomId: window.CurrentRoom?.roomId || 'IPL-2027',
      totalSpent: 45.5,
      squadCount: 18,
      top5Bids: [],
      allBuys: []
    };
    downloadHistoryItemPNG(entry);
  }

  function downloadHistoryItemPNG(entry) {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1000, 600);
    grad.addColorStop(0, '#070d18');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#070d18');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 600);

    // Gold accent border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 960, 560);

    // Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 32px Rajdhani, sans-serif';
    ctx.fillText('🏆 IPL AUCTION CHAMPIONSHIP SCORECARD', 50, 70);

    // Meta
    const userName = entry.auctioneerName || (StorageEngine.currentUser?.userName) || 'Manager';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText(`Manager: ${userName}  |  Franchise: ${entry.userTeam || 'RCB'}  |  Room: ${entry.roomId || 'IPL-2027'}  |  Format: ${entry.mode || 'Mini'} Auction`, 50, 105);

    // Stats bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(50, 130, 900, 80);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 130, 900, 80);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px Orbitron, sans-serif';
    ctx.fillText(`₹${Number(entry.totalSpent || 0).toFixed(2)} Cr`, 75, 175);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('TOTAL SPENT', 75, 195);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px Orbitron, sans-serif';
    ctx.fillText(`${entry.squadCount || (entry.allBuys || []).length} Players`, 300, 175);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('SQUAD SIZE', 300, 195);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 22px Orbitron, sans-serif';
    ctx.fillText(`${entry.aiRating || '92.4'} / 100`, 530, 175);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('AI SQUAD RATING', 530, 195);

    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 22px Orbitron, sans-serif';
    ctx.fillText(`${entry.userRating || '9.5 ★'}`, 760, 175);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('USER RATING', 760, 195);

    // Top Bids Section
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 18px Rajdhani, sans-serif';
    ctx.fillText('TOP 5 BIDS RECORDED', 50, 250);

    const topBids = entry.top5Bids || [];
    topBids.slice(0, 5).forEach((b, idx) => {
      const y = 285 + idx * 45;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(50, y - 20, 900, 36);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(`#${idx + 1}`, 70, y);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(b.player?.name || b.name || 'Cricketer', 120, y);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(b.team?.shortName || b.teamId || 'Franchise', 450, y);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 14px Orbitron, sans-serif';
      ctx.fillText(`₹${Number(b.amount || b.price || b.bid || 0).toFixed(2)} Cr`, 780, y);
    });

    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(`Verified IPL Auction Game Report • Generated on ${new Date().toLocaleDateString()}`, 50, 550);

    // Trigger download
    const link = document.createElement('a');
    link.download = `ipl_auction_report_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // Hook into DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initWelcomeAndRoomFlow, 300);
    });
  } else {
    setTimeout(initWelcomeAndRoomFlow, 300);
  }
'''

# Find end of file and append
content += '\n' + augmentation_code

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("app.js updated successfully with all room, arena, catalogue, and export features!")
