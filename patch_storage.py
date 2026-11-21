with open('storage.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We will inject the new methods into StorageManager class right before the end of the class (before broadcastBid or at line 460)
new_methods = '''
    // =========================================================================
    // AUCTION HISTORY (CLEANED: TOP 5 BIDS, SQUAD BUYS, RATINGS)
    // =========================================================================
    getAuctionHistory() {
      try {
        const raw = localStorage.getItem('ipl_auction_cleaned_history');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return [];
    }

    saveCleanedAuctionHistory(entry) {
      try {
        const history = this.getAuctionHistory();
        // Ensure entry has top 5 bids, team buys, rating, auctioneer name
        const cleanEntry = {
          id: entry.id || ('auc_' + Date.now()),
          roomId: entry.roomId || this.currentRoomId || 'IPL-2027',
          auctioneerName: entry.auctioneerName || (this.currentUser ? this.currentUser.userName : 'Manager'),
          date: entry.date || new Date().toLocaleString(),
          mode: entry.mode || 'MINI',
          userTeam: entry.userTeam || 'RCB',
          top5Bids: (entry.top5Bids || []).slice(0, 5),
          allBuys: entry.allBuys || [],
          ratings: entry.ratings || {},
          aiRating: entry.aiRating || null,
          userRating: entry.userRating || null,
          totalSpent: entry.totalSpent || 0,
          squadCount: entry.squadCount || 0
        };

        history.unshift(cleanEntry);
        // Keep maximum 20 past auctions
        const trimmed = history.slice(0, 20);
        localStorage.setItem('ipl_auction_cleaned_history', JSON.stringify(trimmed));
        return cleanEntry;
      } catch (e) {
        console.error('Failed to save cleaned auction history:', e);
        return null;
      }
    }

    // =========================================================================
    // ROOM MANAGEMENT (PUBLIC / PRIVATE ROOMS, BANS, RULES & SPECTATORS)
    // =========================================================================
    getAllRoomsDB() {
      try {
        const raw = localStorage.getItem('ipl_all_active_rooms');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return {
        'IPL-2027': {
          roomId: 'IPL-2027',
          roomName: 'TATA IPL 2027 Official Mini Auction',
          mode: 'MINI',
          visibility: 'PUBLIC',
          hostId: 'host_system',
          hostName: 'BCCI Official',
          rules: {
            maxBidEnabled: false,
            maxBidAmount: 25,
            exceedLimitEnabled: true,
            exceedThreshold: 15,
            exceedMaxPlayers: 3,
            acceleratedEnabled: true,
            timer: 10
          },
          players: {
            'CSK': { userId: 'player_dhoni', userName: 'MS Dhoni', teamId: 'CSK', isOnline: true },
            'MI': { userId: 'player_rohit', userName: 'Rohit Sharma', teamId: 'MI', isOnline: true }
          },
          banned: [],
          status: 'waiting',
          createdAt: new Date().toISOString()
        },
        'IPL-MEGA': {
          roomId: 'IPL-MEGA',
          roomName: 'Grand Mega Rebuild 2027',
          mode: 'MEGA',
          visibility: 'PUBLIC',
          hostId: 'host_mega',
          hostName: 'Franchise Board',
          rules: {
            maxBidEnabled: true,
            maxBidAmount: 25,
            exceedLimitEnabled: false,
            exceedThreshold: 15,
            exceedMaxPlayers: 3,
            acceleratedEnabled: true,
            timer: 10
          },
          players: {
            'KKR': { userId: 'player_srk', userName: 'King Khan', teamId: 'KKR', isOnline: true }
          },
          banned: [],
          status: 'waiting',
          createdAt: new Date().toISOString()
        }
      };
    }

    saveAllRoomsDB(db) {
      try {
        localStorage.setItem('ipl_all_active_rooms', JSON.stringify(db));
      } catch (e) {}
    }

    getPublicRooms() {
      const db = this.getAllRoomsDB();
      return Object.values(db).filter(r => r.visibility === 'PUBLIC');
    }

    getRoom(roomId) {
      if (!roomId) return null;
      const cleanId = roomId.trim().toUpperCase();
      const db = this.getAllRoomsDB();
      return db[cleanId] || null;
    }

    createAuctionRoom(config) {
      const db = this.getAllRoomsDB();
      const roomId = 'IPL-' + Math.floor(1000 + Math.random() * 9000);
      const user = this.currentUser || { userId: 'user_' + Date.now(), userName: 'Manager' };

      const newRoom = {
        roomId,
        roomName: config.roomName || (`${config.mode || 'Mini'} Auction Room ${roomId}`),
        mode: config.mode || 'MINI',
        visibility: config.visibility || 'PUBLIC',
        hostId: user.userId,
        hostName: user.userName,
        rules: {
          maxBidEnabled: !!config.maxBidEnabled,
          maxBidAmount: Number(config.maxBidAmount) || 25,
          exceedLimitEnabled: config.exceedLimitEnabled !== false,
          exceedThreshold: Number(config.exceedThreshold) || 15,
          exceedMaxPlayers: Number(config.exceedMaxPlayers) || 3,
          acceleratedEnabled: config.acceleratedEnabled !== false,
          timer: Number(config.timer) || 10
        },
        players: {},
        banned: [],
        status: 'waiting',
        createdAt: new Date().toISOString()
      };

      // Assign host to their chosen team
      const hostTeam = config.hostTeam || 'RCB';
      newRoom.players[hostTeam] = {
        userId: user.userId,
        userName: user.userName,
        teamId: hostTeam,
        isHost: true,
        isOnline: true,
        joinedAt: new Date().toISOString()
      };

      db[roomId] = newRoom;
      this.saveAllRoomsDB(db);
      this.currentRoomId = roomId;

      // Broadcast room creation to server if online
      if (this.isServerConnected) {
        fetch('/api/multiplayer/room/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRoom)
        }).catch(() => {});
      }

      return newRoom;
    }

    joinRoom(roomId, teamId, userId, userName) {
      const room = this.getRoom(roomId);
      if (!room) return { success: false, reason: 'not_found' };

      // Check if banned
      if (room.banned && room.banned.includes(userId)) {
        return { success: false, reason: 'banned' };
      }

      // Check remaining teams count
      const takenTeams = Object.keys(room.players || {});
      const allTeams = ['CSK', 'MI', 'RCB', 'KKR', 'DC', 'PBKS', 'RR', 'SRH', 'GT', 'LSG'];
      const availableTeams = allTeams.filter(t => !takenTeams.includes(t));

      // If no teams left, join as spectator!
      if (availableTeams.length === 0 || !teamId || !availableTeams.includes(teamId)) {
        if (!teamId && availableTeams.length > 0) {
          // Player needs to pick from available teams
          return { success: true, room, availableTeams, needTeamSelection: true };
        }
        // Spectator mode
        return {
          success: true,
          room,
          isSpectator: true,
          message: 'All 10 franchises are taken. You have joined as a spectator.'
        };
      }

      // Assign player
      room.players[teamId] = {
        userId,
        userName,
        teamId,
        isOnline: true,
        joinedAt: new Date().toISOString()
      };

      const db = this.getAllRoomsDB();
      db[room.roomId] = room;
      this.saveAllRoomsDB(db);
      this.currentRoomId = room.roomId;

      return { success: true, room, isSpectator: false, assignedTeam: teamId };
    }

    banPlayer(roomId, userId) {
      const room = this.getRoom(roomId);
      if (!room) return false;
      room.banned = room.banned || [];
      if (!room.banned.includes(userId)) {
        room.banned.push(userId);
      }
      // Unassign team
      for (const tId in room.players) {
        if (room.players[tId].userId === userId) {
          delete room.players[tId];
        }
      }
      const db = this.getAllRoomsDB();
      db[room.roomId] = room;
      this.saveAllRoomsDB(db);
      return true;
    }

    updateRoomTimer(roomId, seconds) {
      const room = this.getRoom(roomId);
      if (!room) return;
      room.rules = room.rules || {};
      room.rules.timer = seconds;
      const db = this.getAllRoomsDB();
      db[room.roomId] = room;
      this.saveAllRoomsDB(db);
    }
'''

# Find where to insert in class StorageManager
target = '    persistLocalUser(user) {'
idx = content.find(target)
if idx != -1:
    updated = content[:idx] + new_methods + '\n    ' + content[idx:]
    with open('storage.js', 'w', encoding='utf-8') as f:
        f.write(updated)
    print("storage.js updated successfully!")
else:
    print("Could not find insertion target in storage.js!")
