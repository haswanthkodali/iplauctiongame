/**
 * IPL AUCTION GAME - STORAGE & MULTIPLAYER CLIENT (storage.js)
 * ============================================================================
 * Provides persistent server data storage & offline-first fallback:
 * - User login, registration, and relogin
 * - Edit/change name after login
 * - Automatic loading of past bid history, past ratings, and past squad details
 * - Multiplayer manager assignments (multiple human players managing different teams)
 * ============================================================================
 */

(function (global) {
  'use strict';

  const STORAGE_KEY_CURRENT_USER = 'ipl_auction_current_user';
  const STORAGE_KEY_ALL_USERS = 'ipl_auction_users_db';
  const STORAGE_KEY_MULTIPLAYER = 'ipl_auction_multiplayer_room';
  const DEFAULT_SUPABASE_URL = 'https://ridobleeeklguljsxzqd.supabase.co';
  const DEFAULT_SUPABASE_KEY = 'sb_publishable_SbiqCV3UDGyJEE_g7kDyQA_s21owVn2';

  class StorageManager {
    constructor() {
      this.currentUser = null;
      this.multiplayerRoom = {
        roomId: 'DEFAULT',
        humanManagers: {} // teamId -> { userId, userName }
      };
      this.isServerConnected = false;
      this.currentRoomId = 'DEFAULT';
      this.currentRoomPin = '';
      this.networkInfo = {
        lan_ip: '10.226.78.86',
        lanIp: '10.226.78.86',
        port: 8000,
        https_port: 8443,
        localhostUrl: 'http://localhost:8000',
        privateLanUrl: 'http://10.226.78.86:8000'
      };

      // Read ?room= and ?pin= from URL query params
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('room')) {
          this.currentRoomId = urlParams.get('room').trim().toUpperCase() || 'DEFAULT';
        }
        if (urlParams.has('pin')) {
          this.currentRoomPin = urlParams.get('pin').trim();
        }
      } catch (e) {}

      this.init();
    }

    async init() {
      // 1. Fetch live network info (LAN IP & private links)
      try {
        const netRes = await fetch('/api/network-info', { method: 'GET' });
        if (netRes.ok) {
          const netData = await netRes.json();
          this.networkInfo = netData;
          if (netData.lanIp && !netData.lan_ip) this.networkInfo.lan_ip = netData.lanIp;
          if (netData.lan_ip && !netData.lanIp) this.networkInfo.lanIp = netData.lan_ip;
          this.isServerConnected = true;
        }
      } catch (e) {}

      // 2. Fetch Multiplayer Room
      try {
        const roomRes = await fetch(`/api/multiplayer/room?roomId=${encodeURIComponent(this.currentRoomId)}`, { method: 'GET' });
        if (roomRes.ok) {
          this.isServerConnected = true;
          const data = await roomRes.json();
          if (data.room) {
            this.multiplayerRoom = data.room;
            this.currentRoomId = data.room.roomId || this.currentRoomId;
          }
        }
      } catch (e) {
        if (!this.isServerConnected) this.isServerConnected = false;
      }

      // 3. Load cached local user
      try {
        const cached = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
        if (cached) {
          this.currentUser = JSON.parse(cached);
        }
      } catch (e) {}

      // If user exists, re-sync their data from server or local DB
      if (this.currentUser) {
        await this.syncUserData(this.currentUser.userId);
      }

      // 4. Initialize Supabase if config or localStorage keys exist
      try {
        this.initSupabase();
      } catch (e) {}
    }

    /**
     * Login or Register user
     * Sets active user and loads past data (bids, ratings, squads)
     */
    async loginUser(userName, favoriteTeam = 'RCB') {
      const cleanName = (userName || '').trim();
      if (!cleanName) return { success: false, error: 'Name cannot be empty' };

      // 1. Try Server API
      if (this.isServerConnected) {
        try {
          const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonStringify({ userName: cleanName, favoriteTeam })
          });
          if (res.ok) {
            const data = await res.json();
            this.currentUser = data.user;
            this.persistLocalUser(this.currentUser);
            return { success: true, user: this.currentUser, isNew: data.isNew };
          }
        } catch (e) {
          console.warn('[Storage] Server login failed, falling back to local DB', e);
        }
      }

      // 2. Local DB Fallback
      const db = this.getLocalUsersDB();
      let user = Object.values(db).find(u => u.userName.toLowerCase() === cleanName.toLowerCase());

      if (user) {
        user.lastActive = new Date().toISOString();
        if (favoriteTeam) user.favoriteTeam = favoriteTeam;
      } else {
        const userId = 'user_' + Date.now();
        user = {
          userId,
          userName: cleanName,
          favoriteTeam,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          pastBids: [],
          pastRatings: {},
          pastSquads: []
        };
        db[userId] = user;
      }

      this.saveLocalUsersDB(db);
      this.currentUser = user;
      this.persistLocalUser(user);

      return { success: true, user, isNew: !user.pastSquads || user.pastSquads.length === 0 };
    }

    /**
     * Change person's display name anytime after login
     */
    async updateUserName(newUserName) {
      const cleanName = (newUserName || '').trim();
      if (!cleanName) return { success: false, error: 'Name cannot be empty' };

      try {
        localStorage.setItem('ipl_user_name', cleanName);
        localStorage.setItem('ipl_manager_name', cleanName);
      } catch (e) {}

      if (!this.currentUser) {
        return await this.loginUser(cleanName);
      }

      const oldName = this.currentUser.userName;
      this.currentUser.userName = cleanName;
      this.currentUser.lastActive = new Date().toISOString();

      // Update in server
      if (this.isServerConnected) {
        try {
          await fetch(`/api/users/${this.currentUser.userId}/name`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: jsonStringify({ userName: cleanName })
          });
        } catch (e) {}
      }

      // Update in local DB
      const db = this.getLocalUsersDB();
      if (!db[this.currentUser.userId]) {
        db[this.currentUser.userId] = { ...this.currentUser };
      }
      db[this.currentUser.userId].userName = cleanName;
      db[this.currentUser.userId].lastActive = new Date().toISOString();
      this.saveLocalUsersDB(db);
      this.persistLocalUser(this.currentUser);

      // Update in multiplayer assignments
      for (const tId in this.multiplayerRoom.humanManagers) {
        if (this.multiplayerRoom.humanManagers[tId].userId === this.currentUser.userId) {
          this.multiplayerRoom.humanManagers[tId].userName = cleanName;
        }
      }

      // Update in all active rooms DB and sync to Supabase
      try {
        const roomsDB = this.getAllRoomsDB();
        const myId = this.currentUser.userId;
        let modified = false;
        for (const rId of Object.keys(roomsDB)) {
          const r = roomsDB[rId];
          if (!r) continue;
          if (r.hostId === myId || (oldName && (r.hostName || '').trim().toLowerCase() === oldName.trim().toLowerCase())) {
            r.hostName = cleanName;
            modified = true;
          }
          if (r.players) {
            for (const t of Object.keys(r.players)) {
              const p = r.players[t];
              if (p && (p.userId === myId || (oldName && (p.userName || '').trim().toLowerCase() === oldName.trim().toLowerCase()))) {
                p.userName = cleanName;
                modified = true;
              }
            }
          }
          if (modified) {
            this.syncRoomToSupabase(r);
          }
        }
        if (modified) {
          this.saveAllRoomsDB(roomsDB);
        }
      } catch (e) {}

      return { success: true, user: this.currentUser, oldName };
    }

    /**
     * Update user's favorite / assigned franchise
     */
    updateUserTeam(teamId) {
      if (!this.currentUser) return;
      this.currentUser.teamId = teamId;
      this.currentUser.favoriteTeam = teamId;
      this.currentUser.lastActive = new Date().toISOString();
      const db = this.getLocalUsersDB();
      if (db[this.currentUser.userId]) {
        db[this.currentUser.userId].favoriteTeam = teamId;
        db[this.currentUser.userId].teamId = teamId;
        db[this.currentUser.userId].lastActive = new Date().toISOString();
        this.saveLocalUsersDB(db);
      }
      this.persistLocalUser(this.currentUser);
    }

    /**
     * Save completed auction results: squad, custom ratings, and personal bids
     */
    async saveAuctionResult(squadData, ratingsData, bidsData = []) {
      if (!this.currentUser) return false;

      const record = {
        squad: squadData,
        ratings: ratingsData,
        bids: bidsData
      };

      // Server Sync
      if (this.isServerConnected) {
        try {
          const res = await fetch(`/api/users/${this.currentUser.userId}/auction-result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonStringify(record)
          });
          if (res.ok) {
            const data = await res.json();
            this.currentUser = data.user;
            this.persistLocalUser(this.currentUser);
            return true;
          }
        } catch (e) {}
      }

      // Local Sync
      const db = this.getLocalUsersDB();
      const user = db[this.currentUser.userId] || this.currentUser;

      if (squadData) {
        squadData.savedAt = new Date().toISOString();
        user.pastSquads = user.pastSquads || [];
        user.pastSquads.push(squadData);
      }
      if (ratingsData) {
        user.pastRatings = user.pastRatings || {};
        Object.assign(user.pastRatings, ratingsData);
      }
      if (bidsData && bidsData.length > 0) {
        user.pastBids = user.pastBids || [];
        user.pastBids.push(...bidsData);
      }

      db[user.userId] = user;
      this.saveLocalUsersDB(db);
      this.currentUser = user;
      this.persistLocalUser(user);

      // Also automatically save to cleaned auction history for instant persistence on refresh!
      try {
        const players = squadData?.players || [];
        const sorted = players.slice().sort((a, b) => (Number(b.price || b.soldPrice || 0) - Number(a.price || a.soldPrice || 0)));
        const top5 = sorted.slice(0, 5).map(p => ({
          name: p.name,
          amount: p.price || p.soldPrice || 0,
          teamId: squadData?.teamId || 'Team'
        }));

        this.saveCleanedAuctionHistory({
          roomId: squadData?.roomId || this.currentRoomId || 'IPL-2027',
          auctioneerName: user.userName || 'Manager',
          mode: squadData?.mode || 'Mini',
          userTeam: squadData?.teamId || 'RCB',
          totalSpent: squadData?.spent || 0,
          squadCount: squadData?.playersCount || players.length,
          aiRating: (ratingsData && ratingsData.score) ? ratingsData.score : 92.5,
          userRating: (ratingsData && ratingsData.grade) ? ratingsData.grade : '9.5 ★',
          top5Bids: top5,
          allBuys: players
        });
      } catch (e) {
        console.warn('Auto-save cleaned history notice:', e);
      }

      return true;
    }

    /**
     * Record a single live bid in user history
     */
    recordUserBid(bidItem) {
      if (!this.currentUser) return;
      this.currentUser.pastBids = this.currentUser.pastBids || [];
      this.currentUser.pastBids.push({
        ...bidItem,
        timestamp: new Date().toISOString()
      });
      this.persistLocalUser(this.currentUser);
    }

    /**
     * Sync user data on relogin
     */
    async syncUserData(userId) {
      if (this.isServerConnected && userId) {
        try {
          const res = await fetch(`/api/users/${userId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              this.currentUser = data.user;
              this.persistLocalUser(this.currentUser);
              return this.currentUser;
            }
          }
        } catch (e) {}
      }

      const db = this.getLocalUsersDB();
      if (userId && db[userId]) {
        this.currentUser = db[userId];
        this.persistLocalUser(this.currentUser);
      }
      return this.currentUser;
    }

    /**
     * Retrieve list of all registered users for quick relogin
     */
    async getAllUsers() {
      if (this.isServerConnected) {
        try {
          const res = await fetch('/api/users');
          if (res.ok) {
            const data = await res.json();
            if (data.users) return data.users;
          }
        } catch (e) {}
      }

      const db = this.getLocalUsersDB();
      return Object.values(db).map(u => ({
        userId: u.userId,
        userName: u.userName,
        favoriteTeam: u.favoriteTeam || 'RCB',
        lastActive: u.lastActive,
        auctionCount: (u.pastSquads || []).length
      }));
    }

    /**
     * Multiplayer: Create a Private Room with optional PIN
     */
    async createPrivateRoom(roomId, roomName, pin = '') {
      const cleanRoomId = (roomId || `IPL_${Math.floor(1000 + Math.random() * 9000)}`).trim().toUpperCase();
      const cleanPin = (pin || '').trim();

      if (this.isServerConnected) {
        try {
          const res = await fetch('/api/multiplayer/room/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonStringify({ roomId: cleanRoomId, roomName, pin: cleanPin })
          });
          if (res.ok) {
            const data = await res.json();
            this.multiplayerRoom = data.room;
            this.currentRoomId = cleanRoomId;
            this.currentRoomPin = cleanPin;
            return { success: true, room: data.room, link: this.getPrivateRoomLink() };
          }
        } catch (e) {}
      }

      this.currentRoomId = cleanRoomId;
      this.currentRoomPin = cleanPin;
      this.multiplayerRoom = {
        roomId: cleanRoomId,
        roomName: roomName || `Private Room ${cleanRoomId}`,
        pin: cleanPin || null,
        humanManagers: {}
      };
      return { success: true, room: this.multiplayerRoom, link: this.getPrivateRoomLink() };
    }

    /**
     * Multiplayer: Assign human player to manage a franchise in current room
     */
    async assignMultiplayerManager(teamId, userId, userName, pin = '') {
      const roomPin = pin || this.currentRoomPin;
      this.multiplayerRoom.humanManagers[teamId] = {
        userId,
        userName,
        assignedAt: new Date().toISOString()
      };

      if (this.isServerConnected) {
        try {
          const res = await fetch('/api/multiplayer/room/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonStringify({
              roomId: this.currentRoomId,
              teamId,
              userId,
              userName,
              pin: roomPin
            })
          });
          if (res.ok) {
            const data = await res.json();
            this.multiplayerRoom = data.room;
          }
        } catch (e) {}
      }

      try {
        localStorage.setItem(STORAGE_KEY_MULTIPLAYER + '_' + this.currentRoomId, JSON.stringify(this.multiplayerRoom));
      } catch (e) {}

      return this.multiplayerRoom;
    }

    /**
     * Remove human manager assignment (reverts team to AI)
     */
    async removeMultiplayerManager(teamId) {
      delete this.multiplayerRoom.humanManagers[teamId];
      if (this.isServerConnected) {
        try {
          await fetch('/api/multiplayer/room/leave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonStringify({ roomId: this.currentRoomId, teamId })
          });
        } catch (e) {}
      }
      try {
        localStorage.setItem(STORAGE_KEY_MULTIPLAYER + '_' + this.currentRoomId, JSON.stringify(this.multiplayerRoom));
      } catch (e) {}
      return this.multiplayerRoom;
    }

    /**
     * Get shareable Private LAN URL with room parameter
     * Accurately constructs the link for other devices:
     * - Uses host LAN IP when host is running on localhost/127.0.0.1
     * - Uses current origin if deployed on a domain or accessed via LAN IP
     */
    getPrivateRoomLink(customRoomId) {
      const room = customRoomId || (this.currentRoomId && this.currentRoomId !== 'DEFAULT' ? this.currentRoomId : (window.CurrentRoom ? window.CurrentRoom.roomId : 'MAIN'));
      
      const host = (typeof window !== 'undefined' && window.location) ? window.location.hostname : '';
      const isLocalhost = (!host || host === 'localhost' || host === '127.0.0.1' || host === '::1');
      let baseOrigin = (typeof window !== 'undefined' && window.location) ? window.location.origin : 'http://localhost:8000';

      if (isLocalhost && this.networkInfo?.lan_ip) {
        const port = (window.location.port ? `:${window.location.port}` : (window.location.protocol === 'https:' ? ':8443' : ':8000'));
        baseOrigin = `${window.location.protocol}//${this.networkInfo.lan_ip}${port}`;
      }

      const pathname = (typeof window !== 'undefined' && window.location) ? (window.location.pathname || '/') : '/';
      let link = `${baseOrigin}${pathname}?roomId=${encodeURIComponent(room)}`;
      if (this.currentRoomPin) {
        link += `&pin=${encodeURIComponent(this.currentRoomPin)}`;
      }
      return link;
    }

    /**
     * Get Localhost URL with room parameter
     */
    getLocalhostLink() {
      const base = (window.location.protocol + '//localhost:' + (window.location.port || '8443'));
      const url = new URL(base);
      if (this.currentRoomId && this.currentRoomId !== 'DEFAULT') {
        url.searchParams.set('room', this.currentRoomId);
      }
      if (this.currentRoomPin) {
        url.searchParams.set('pin', this.currentRoomPin);
      }
      return url.toString();
    }

    getHumanManagers() {
      return this.multiplayerRoom.humanManagers || {};
    }

    getCurrentUser() {
      return this.currentUser;
    }

    // LocalStorage Helpers
    getLocalUsersDB() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_ALL_USERS);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    saveLocalUsersDB(db) {
      try {
        localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(db));
      } catch (e) {}
    }


    // =========================================================================
    // AUCTION HISTORY (CLEANED: TOP 5 BIDS, SQUAD BUYS, RATINGS)
    // =========================================================================
    getAuctionHistory() {
      let history = [];
      try {
        const raw = localStorage.getItem('ipl_auction_cleaned_history');
        if (raw) history = JSON.parse(raw) || [];
      } catch (e) {}

      // If history is empty, check currentUser.pastSquads or users DB to restore past data!
      if (history.length === 0) {
        const user = this.currentUser || this.getCurrentUser();
        const pastSquads = user?.pastSquads || [];
        if (pastSquads.length > 0) {
          history = pastSquads.map((sq, idx) => {
            const players = sq.players || [];
            const sortedByPrice = players.slice().sort((a, b) => (Number(b.price || b.soldPrice || 0) - Number(a.price || a.soldPrice || 0)));
            const top5 = sortedByPrice.slice(0, 5).map(p => ({
              name: p.name,
              amount: p.price || p.soldPrice || 0,
              teamId: sq.teamId || sq.teamName || 'Team'
            }));

            return {
              id: 'auc_' + (sq.savedAt ? new Date(sq.savedAt).getTime() : (Date.now() - idx * 86400000)),
              roomId: sq.roomId || 'IPL-2027',
              auctioneerName: user?.userName || localStorage.getItem('ipl_user_name') || 'Manager',
              date: sq.savedAt ? new Date(sq.savedAt).toLocaleDateString() : new Date().toLocaleDateString(),
              mode: sq.mode || 'Mini',
              userTeam: sq.teamId || sq.teamName || 'RCB',
              totalSpent: sq.spent || 0,
              squadCount: sq.playersCount || players.length,
              aiRating: sq.rating || (user?.pastRatings && user.pastRatings[sq.teamId]?.score) || 92.4,
              userRating: (user?.pastRatings && user.pastRatings[sq.teamId]?.grade) || '9.5 ★',
              top5Bids: top5,
              allBuys: players
            };
          });

          // Save restored history so it persists
          try {
            localStorage.setItem('ipl_auction_cleaned_history', JSON.stringify(history));
          } catch (e) {}
        }
      }

      return history;
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
        const raw = localStorage.getItem('ipl_all_active_rooms') || localStorage.getItem('ipl_auction_rooms');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            // Filter out old test/dummy mock rooms (IPL-2027, IPL-MEGA, IPL-7476, etc.)
            delete parsed['IPL-2027'];
            delete parsed['IPL-MEGA'];
            delete parsed['IPL-7476'];
            delete parsed['DEFAULT'];
            return parsed;
          }
        }
      } catch (e) {}
      return {};
    }

    saveAllRoomsDB(db) {
      try {
        if (db && typeof db === 'object') {
          delete db['IPL-2027'];
          delete db['IPL-MEGA'];
          delete db['IPL-7476'];
          delete db['DEFAULT'];
        }
        localStorage.setItem('ipl_all_active_rooms', JSON.stringify(db || {}));
        localStorage.setItem('ipl_auction_rooms', JSON.stringify(db || {}));
      } catch (e) {}
    }

    clearAllRooms() {
      try {
        localStorage.removeItem('ipl_all_active_rooms');
        localStorage.removeItem('ipl_auction_rooms');
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith('ipl_host_room_')) {
            localStorage.removeItem(k);
          }
        }
      } catch (e) {}
      return true;
    }

    getPublicRooms() {
      const db = this.getAllRoomsDB();
      return Object.values(db).filter(r => r && r.roomId && r.roomId !== 'DEFAULT' && r.visibility === 'PUBLIC');
    }

    getSupabaseConfig() {
      const url = (typeof window !== 'undefined' && window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || localStorage.getItem('supabase_url') || DEFAULT_SUPABASE_URL;
      const anonKey = (typeof window !== 'undefined' && window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || localStorage.getItem('supabase_anon_key') || DEFAULT_SUPABASE_KEY;
      return { url, anonKey };
    }

    async syncRoomToSupabase(room) {
      if (!room || !room.roomId) return false;
      const cleanId = String(room.roomId).trim().toUpperCase();
      const cfg = this.getSupabaseConfig();
      if (!cfg.url || !cfg.anonKey) {
        console.warn('[Supabase Sync] No Supabase config found, skipping sync.');
        return false;
      }

      const payload = {
        id: cleanId,
        name: JSON.stringify(room),
        mode: room.mode || 'MINI',
        status: room.status || 'waiting'
      };

      try {
        const res = await fetch(`${cfg.url}/rest/v1/auctions`, {
          method: 'POST',
          headers: {
            'apikey': cfg.anonKey,
            'Authorization': `Bearer ${cfg.anonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=representation'
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          console.log(`[Supabase Sync] Room ${cleanId} synced to cloud (${res.status}).`);
          return true;
        } else {
          const errText = await res.text().catch(() => '');
          console.error(`[Supabase Sync] Room ${cleanId} sync FAILED: ${res.status} ${res.statusText}`, errText);
          return false;
        }
      } catch (e) {
        console.warn('[Supabase Sync] Room sync network error:', e);
        return false;
      }
    }

    async fetchRoomFromSupabase(roomId) {
      if (!roomId) return null;
      let cleanId = String(roomId).trim().toUpperCase();
      if (/^\d{3,5}$/.test(cleanId)) {
        cleanId = 'IPL-' + cleanId;
      }
      const cfg = this.getSupabaseConfig();
      if (!cfg.url || !cfg.anonKey) return null;

      try {
        const res = await fetch(`${cfg.url}/rest/v1/auctions?id=eq.${encodeURIComponent(cleanId)}&select=*`, {
          method: 'GET',
          headers: {
            'apikey': cfg.anonKey,
            'Authorization': `Bearer ${cfg.anonKey}`
          }
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            const row = list[0];
            let roomObj = null;
            try {
              roomObj = JSON.parse(row.name);
            } catch (err) {
              roomObj = {
                roomId: row.id,
                roomName: row.name || row.id,
                mode: row.mode || 'MINI',
                visibility: 'PUBLIC',
                status: row.status || 'waiting',
                rules: { maxBidEnabled: false, maxBidAmount: 25, exceedLimitEnabled: true, exceedThreshold: 15, exceedMaxPlayers: 3, acceleratedEnabled: true, timer: 10 },
                players: {},
                banned: []
              };
            }
            if (roomObj) {
              const db = this.getAllRoomsDB();
              db[cleanId] = roomObj;
              this.saveAllRoomsDB(db);
              return roomObj;
            }
          }
        }
      } catch (e) {
        console.warn('[Supabase Fetch] Room query error:', e);
      }
      return null;
    }

    async fetchPublicRoomsFromSupabase() {
      const cfg = this.getSupabaseConfig();
      if (!cfg.url || !cfg.anonKey) return [];

      try {
        const res = await fetch(`${cfg.url}/rest/v1/auctions?select=*&order=created_at.desc&limit=30`, {
          method: 'GET',
          headers: {
            'apikey': cfg.anonKey,
            'Authorization': `Bearer ${cfg.anonKey}`
          }
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            // Fresh sync: reflect current cloud state exactly (removes deleted test rooms)
            const db = {};
            const resultList = [];
            list.forEach(row => {
              if (!row || !row.id || row.id === 'DEFAULT' || row.id === 'IPL-7476') return;
              let r = null;
              try {
                r = JSON.parse(row.name);
              } catch (e) {
                r = {
                  roomId: row.id,
                  roomName: row.name || row.id,
                  mode: row.mode || 'MINI',
                  visibility: 'PUBLIC',
                  status: row.status || 'waiting',
                  rules: {},
                  players: {}
                };
              }
              if (r && r.roomId && r.roomId !== 'DEFAULT' && r.roomId !== 'IPL-7476') {
                db[r.roomId] = r;
                if (r.visibility !== 'PRIVATE') {
                  resultList.push(r);
                }
              }
            });
            this.saveAllRoomsDB(db);
            return resultList;
          }
        }
      } catch (e) {
        console.warn('[Supabase Fetch] Public rooms error:', e);
      }
      return [];
    }

    async fetchPublicRoomsFromServer() {
      // 1. First fetch from Supabase Cloud (works everywhere worldwide: GitHub Pages, Workers, phones, PC)
      try {
        const supaRooms = await this.fetchPublicRoomsFromSupabase();
        if (Array.isArray(supaRooms)) {
          return supaRooms;
        }
      } catch (e) {}

      // 2. Fallback to local python server if running
      try {
        const res = await fetch('/api/rooms/public');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.rooms)) {
            const db = this.getAllRoomsDB();
            data.rooms.forEach(r => {
              if (r && r.roomId) {
                db[r.roomId] = r;
                this.syncRoomToSupabase(r);
              }
            });
            this.saveAllRoomsDB(db);
            return this.getPublicRooms();
          }
        }
      } catch (e) {}
      return this.getPublicRooms();
    }

    async fetchRoomFromServer(roomId) {
      if (!roomId) return null;
      let cleanId = String(roomId).trim().toUpperCase();
      if (/^\d{3,5}$/.test(cleanId)) {
        cleanId = 'IPL-' + cleanId;
      }

      // 1. First check Supabase Cloud (vital for cross-device links on GitHub Pages/Workers!)
      try {
        const supaRoom = await this.fetchRoomFromSupabase(cleanId);
        if (supaRoom) return supaRoom;
      } catch (err) {}

      // 2. Fallback to local python server
      try {
        const res = await fetch(`/api/multiplayer/room?roomId=${encodeURIComponent(cleanId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.room) {
            const db = this.getAllRoomsDB();
            db[cleanId] = data.room;
            this.saveAllRoomsDB(db);
            this.syncRoomToSupabase(data.room);
            return data.room;
          }
        }
      } catch (e) {}

      return this.getRoom(cleanId);
    }

    getRoom(roomId) {
      if (!roomId) return null;
      let cleanId = String(roomId).trim().toUpperCase();
      if (/^\d{3,5}$/.test(cleanId)) {
        cleanId = 'IPL-' + cleanId;
      }
      const db = this.getAllRoomsDB();
      return db[cleanId] || null;
    }

    async createAuctionRoom(config) {
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
          exceedLimitEnabled: !!config.exceedLimitEnabled,
          exceedThreshold: Number(config.exceedThreshold) || 15,
          exceedMaxPlayers: Number(config.exceedMaxPlayers) || 3,
          acceleratedEnabled: !!config.acceleratedEnabled,
          timer: Number(config.timer) || 10
        },
        players: {},
        banned: [],
        status: 'waiting',
        createdAt: new Date().toISOString()
      };

      // Assign host to their chosen team
      const hostTeam = config.hostTeam || 'RCB';
      newRoom.hostTeam = hostTeam;
      newRoom.players[hostTeam] = {
        userId: user.userId,
        userName: user.userName,
        teamId: hostTeam,
        isHost: true,
        isOnline: true,
        lastSeen: Date.now(),
        joinedAt: new Date().toISOString()
      };

      db[roomId] = newRoom;
      this.saveAllRoomsDB(db);
      this.currentRoomId = roomId;
      try {
        localStorage.setItem('ipl_host_room_' + roomId, 'true');
      } catch (e) {}

      // 1. Sync to Supabase Cloud so all devices worldwide can join immediately
      try {
        const synced = await this.syncRoomToSupabase(newRoom);
        if (synced) {
          console.log(`[Room Create] Room ${roomId} saved to Supabase database successfully.`);
        } else {
          console.warn(`[Room Create] Room ${roomId} Supabase sync returned false - room saved locally only.`);
        }
      } catch (e) {
        console.warn(`[Room Create] Room ${roomId} Supabase sync error:`, e);
      }

      // 2. Broadcast room creation to server so other devices can join immediately
      fetch('/api/multiplayer/room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom)
      }).then(r => { if (r.ok) this.isServerConnected = true; }).catch(() => {});

      this.switchRoomChannel(roomId);

      return newRoom;
    }

    changeRoomTeam(roomId, userId, oldTeamId, newTeamId) {
      const room = this.getRoom(roomId);
      if (!room) return { success: false, reason: 'room_not_found' };
      if (!room.players) room.players = {};

      const user = this.currentUser || { userId, userName: localStorage.getItem('ipl_user_name') || 'Manager' };
      const myNormName = (user.userName || '').trim().toLowerCase();

      // Check if newTeamId is taken by another player
      if (room.players[newTeamId]) {
        const existing = room.players[newTeamId];
        const existingNormName = (existing.userName || '').trim().toLowerCase();
        if (existing.userId !== userId && (!myNormName || existingNormName !== myNormName)) {
          return { success: false, reason: 'team_taken', takenBy: existing.userName };
        }
      }

      // RELEASE all previous teams owned by this user in this room!
      const isHost = (room.hostId === userId) || (myNormName && (room.hostName || '').trim().toLowerCase() === myNormName) || (!room.hostId);
      for (const t of Object.keys(room.players)) {
        const p = room.players[t];
        const pNormName = (p.userName || '').trim().toLowerCase();
        if (p.userId === userId || (myNormName && pNormName === myNormName) || (isHost && p.isHost)) {
          delete room.players[t];
        }
      }

      // Assign new single team
      room.players[newTeamId] = {
        userId,
        userName: user.userName,
        teamId: newTeamId,
        status: 'online',
        isOnline: true,
        isHost: isHost,
        joinedAt: new Date().toISOString()
      };

      // If user was host, update hostTeam
      if (isHost) {
        room.hostTeam = newTeamId;
        room.hostId = userId;
        room.hostName = user.userName;
      }

      this.saveRoom(room);
      this.broadcastRoomUpdate(room);
      return { success: true, room };
    }

    saveRoom(room) {
      if (!room || !room.roomId) return null;
      const cleanId = room.roomId.trim().toUpperCase();
      const db = this.getAllRoomsDB();
      db[cleanId] = room;
      this.saveAllRoomsDB(db);
      try {
        localStorage.setItem('ipl_auction_rooms', JSON.stringify(db));
      } catch (e) {}

      // 1. Sync to Supabase Cloud so all devices worldwide see updates in real time
      this.syncRoomToSupabase(room);

      // 2. Broadcast room update to local server for cross-device synchronization
      fetch('/api/multiplayer/room/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room)
      }).then(r => { if (r.ok) this.isServerConnected = true; }).catch(() => {});

      return room;
    }

    leaveRoom(roomId, userId) {
      const room = this.getRoom(roomId);
      if (!room || !room.players) return { success: false };
      const user = this.currentUser || { userId, userName: '' };
      for (const t of Object.keys(room.players)) {
        const p = room.players[t];
        if (p.userId === userId || (user.userName && p.userName === user.userName)) {
          delete room.players[t];
        }
      }
      this.saveRoom(room);
      this.broadcastRoomUpdate(room);
      return { success: true, room };
    }

    sanitizeRoomTeams(room) {
      if (!room || !room.players) return room;
      // Deduplicate: each unique user (by userId or userName) can only hold AT MOST ONE franchise!
      // If a user owns multiple teams, keep only their current active team or hostTeam, and delete the rest so they become AVAILABLE.
      const seenUsers = new Map();
      const activeUserTeam = (typeof window !== 'undefined' && window.AppState && window.AppState.userTeamId) ? window.AppState.userTeamId : null;

      for (const teamId of Object.keys(room.players)) {
        const p = room.players[teamId];
        const key = p.userId || p.userName || 'unknown';
        if (!seenUsers.has(key)) {
          seenUsers.set(key, []);
        }
        seenUsers.get(key).push({ teamId, player: p });
      }

      for (const [key, entries] of seenUsers.entries()) {
        if (entries.length > 1) {
          let keepTeam = null;
          const matchActive = entries.find(e => e.teamId === activeUserTeam);
          if (matchActive) {
            keepTeam = matchActive.teamId;
          } else if (room.hostTeam && entries.some(e => e.teamId === room.hostTeam)) {
            keepTeam = room.hostTeam;
          } else {
            keepTeam = entries[entries.length - 1].teamId;
          }
          for (const e of entries) {
            if (e.teamId !== keepTeam) {
              delete room.players[e.teamId];
            }
          }
        }
      }
      this.saveRoom(room);
      return room;
    }

    joinRoom(roomId, preferredTeamId, userId, userName) {
      if (!roomId) return { success: false, reason: 'not_found' };
      const cleanName = (userName || '').trim();
      if (!cleanName || cleanName.toLowerCase() === 'manager') {
        return { success: false, reason: 'name_required' };
      }
      let cleanId = String(roomId).trim().toUpperCase();
      if (/^\d{3,5}$/.test(cleanId)) {
        cleanId = 'IPL-' + cleanId;
      }
      const room = this.getRoom(cleanId);
      if (!room) return { success: false, reason: 'not_found' };

      // Check if banned
      if (room.banned && room.banned.includes(userId)) {
        return { success: false, reason: 'banned' };
      }

      if (!room.players) room.players = {};

      const myNormName = (userName || '').trim().toLowerCase();
      // Check if user is ALREADY in room with an assigned team
      let alreadyTeam = null;
      for (const t of Object.keys(room.players)) {
        const p = room.players[t];
        const pNormName = (p.userName || '').trim().toLowerCase();
        if (p.userId === userId || (myNormName && pNormName === myNormName)) {
          alreadyTeam = t;
          p.isOnline = true;
          p.lastSeen = Date.now();
          break;
        }
      }
      if (alreadyTeam) {
        this.saveRoom(room);
        this.currentRoomId = room.roomId;
        this.switchRoomChannel(room.roomId);
        this.broadcastRoomUpdate(room);
        return { success: true, room, isSpectator: false, assignedTeam: alreadyTeam };
      }

      // Check remaining teams count
      const takenTeams = Object.keys(room.players || {});
      const allTeams = ['CSK', 'MI', 'RCB', 'KKR', 'DC', 'PBKS', 'RR', 'SRH', 'GT', 'LSG'];
      const availableTeams = allTeams.filter(t => !takenTeams.includes(t));

      if (availableTeams.length === 0) {
        return {
          success: true,
          room,
          isSpectator: true,
          message: 'All 10 franchises are taken. You have joined as a spectator.'
        };
      }

      // If preferred team is available, use it; otherwise assign first available team!
      let assignedTeam = (preferredTeamId && availableTeams.includes(preferredTeamId)) ? preferredTeamId : availableTeams[0];

      room.players[assignedTeam] = {
        userId,
        userName,
        teamId: assignedTeam,
        isOnline: true,
        lastSeen: Date.now(),
        joinedAt: new Date().toISOString()
      };

      this.saveRoom(room);
      this.currentRoomId = room.roomId;
      this.switchRoomChannel(room.roomId);
      this.broadcastRoomUpdate(room);

      return { success: true, room, isSpectator: false, assignedTeam };
    }

    kickPlayer(roomId, userId, teamId) {
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
      this.broadcastRoomUpdate(room);
      return { success: true, room, freedTeam };
    }

    setPlayerOnlineStatus(roomId, userId, isOnline) {
      const room = this.getRoom(roomId);
      if (!room || !room.players) return { success: false };

      for (const t of Object.keys(room.players)) {
        if (room.players[t].userId === userId) {
          room.players[t].isOnline = !!isOnline;
          room.players[t].lastSeen = isOnline ? Date.now() : 0;
          break;
        }
      }

      this.saveRoom(room);
      return { success: true, room };
    }

    updatePlayerHeartbeat(roomId, userId) {
      if (!roomId || !userId) return;
      const cleanId = String(roomId).trim().toUpperCase();
      const room = this.getRoom(cleanId);
      if (!room || !room.players) return;

      let changed = false;
      const myNormName = (this.currentUser?.userName || localStorage.getItem('ipl_user_name') || '').trim().toLowerCase();
      for (const t of Object.keys(room.players)) {
        const p = room.players[t];
        const pNormName = (p?.userName || '').trim().toLowerCase();
        if (p && (p.userId === userId || (myNormName && pNormName === myNormName))) {
          p.isOnline = true;
          p.lastSeen = Date.now();
          changed = true;
          break;
        }
      }

      if (changed) {
        const db = this.getAllRoomsDB();
        db[cleanId] = room;
        this.saveAllRoomsDB(db);
        this.syncRoomToSupabase(room);
      }
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
      this.saveRoom(room);
      this.broadcastRoomUpdate(room);
      return true;
    }

    updateRoomTimer(roomId, seconds) {
      const room = this.getRoom(roomId);
      if (!room) return;
      room.rules = room.rules || {};
      room.rules.timer = seconds;
      this.saveRoom(room);
      this.broadcastRoomUpdate(room);
    }

        persistLocalUser(user) {
      try {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
      } catch (e) {}
    }

    /**
     * Supabase Realtime & Database Client (Cloudflare Pages Production Mode)
     * Enables live multiplayer synchronization worldwide without needing a local python server!
     */
    initSupabase(supabaseUrl, supabaseKey) {
      const url = supabaseUrl || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || localStorage.getItem('supabase_url');
      const key = supabaseKey || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || localStorage.getItem('supabase_anon_key');

      if (!url || !key || typeof window.supabase === 'undefined') {
        return null;
      }

      try {
        this.supabase = window.supabase.createClient(url, key);
        this.isServerConnected = true;
        if (this.currentRoomId) {
          this.switchRoomChannel(this.currentRoomId);
        }
        return this.supabase;
      } catch (err) {
        console.warn('[Supabase Realtime] Init warning:', err);
        return null;
      }
    }

    /**
     * Switch Supabase Realtime Channel to a specific room
     */
    switchRoomChannel(newRoomId) {
      if (!newRoomId) return;
      let cleanId = String(newRoomId).trim().toUpperCase();
      if (/^\d{3,5}$/.test(cleanId)) cleanId = 'IPL-' + cleanId;
      this.currentRoomId = cleanId;

      const cfg = this.getSupabaseConfig();
      if (!cfg.url || !cfg.anonKey || typeof window === 'undefined' || typeof window.supabase === 'undefined') {
        return;
      }

      if (!this.supabase) {
        try {
          this.supabase = window.supabase.createClient(cfg.url, cfg.anonKey);
        } catch (e) {
          console.warn('[Supabase Realtime] createClient failed:', e);
          return;
        }
      }

      // Unsubscribe existing channel if any
      if (this.supabaseChannel) {
        try {
          this.supabase.removeChannel(this.supabaseChannel);
        } catch (e) {}
        this.supabaseChannel = null;
      }

      try {
        const channelName = 'auction-room-' + cleanId;
        this.supabaseChannel = this.supabase.channel(channelName, {
          config: { broadcast: { self: false } }
        });

        this.supabaseChannel
          .on('broadcast', { event: 'bid' }, payload => {
            if (payload && payload.payload) {
              const { teamId, amount, playerIndex } = payload.payload;
              if (typeof window !== 'undefined' && window.onRemoteBid) {
                window.onRemoteBid(payload.payload);
              } else if (typeof window !== 'undefined' && window.Game && window.Game.placeBid) {
                window.Game.placeBid(teamId, amount, true);
              }
            }
          })
          .on('broadcast', { event: 'pass' }, payload => {
            if (typeof window !== 'undefined' && window.onRemotePass) {
              window.onRemotePass(payload?.payload);
            } else if (typeof window !== 'undefined' && window.Game && window.Game.passPlayer) {
              window.Game.passPlayer(true);
            }
          })
          .on('broadcast', { event: 'room_update' }, payload => {
            if (payload && payload.payload && payload.payload.room) {
              const updatedRoom = payload.payload.room;
              if (typeof window !== 'undefined' && window.onRemoteRoomUpdate) {
                window.onRemoteRoomUpdate(updatedRoom);
              }
            }
          })
          .on('broadcast', { event: 'auction_start' }, payload => {
            if (typeof window !== 'undefined' && window.onRemoteAuctionStart) {
              window.onRemoteAuctionStart(payload?.payload);
            }
          })
          .subscribe((status) => {
            console.log('[Supabase Realtime] Room channel ' + channelName + ' status:', status);
          });

        console.log('[Supabase Realtime] Connected to room channel: ' + channelName);
        this.isServerConnected = true;
      } catch (err) {
        console.warn('[Supabase Realtime] Connection error for room ' + cleanId + ':', err);
      }
    }

    broadcastRoomUpdate(room) {
      if (!room || !this.supabaseChannel) return;
      try {
        this.supabaseChannel.send({
          type: 'broadcast',
          event: 'room_update',
          payload: { room, timestamp: Date.now() }
        });
      } catch (e) {
        console.warn('[Realtime Broadcast] room_update error:', e);
      }
    }

    broadcastAuctionStart(room, pool) {
      if (!this.supabaseChannel) return;
      try {
        this.supabaseChannel.send({
          type: 'broadcast',
          event: 'auction_start',
          payload: { room, pool, timestamp: Date.now() }
        });
      } catch (e) {
        console.warn('[Realtime Broadcast] auction_start error:', e);
      }
    }

    broadcastBid(teamId, amount, playerIndex) {
      if (!this.supabaseChannel) return;
      try {
        this.supabaseChannel.send({
          type: 'broadcast',
          event: 'bid',
          payload: { teamId, amount, playerIndex, timestamp: Date.now() }
        });
      } catch (e) {
        console.warn('[Realtime Broadcast] bid error:', e);
      }
    }

    broadcastPass() {
      if (!this.supabaseChannel) return;
      try {
        this.supabaseChannel.send({
          type: 'broadcast',
          event: 'pass',
          payload: { timestamp: Date.now() }
        });
      } catch (e) {
        console.warn('[Realtime Broadcast] pass error:', e);
      }
    }
  }

  function jsonStringify(obj) {
    return JSON.stringify(obj);
  }

  // Global instance
  global.StorageEngine = new StorageManager();


  // Ensure all methods are directly attached to StorageEngine instance
  if (global.StorageEngine) {
    if (typeof global.StorageEngine.changeRoomTeam === 'function') global.StorageEngine.changeRoomTeam = global.StorageEngine.changeRoomTeam.bind(global.StorageEngine);
    if (typeof global.StorageEngine.leaveRoom === 'function') global.StorageEngine.leaveRoom = global.StorageEngine.leaveRoom.bind(global.StorageEngine);
    if (typeof global.StorageEngine.sanitizeRoomTeams === 'function') global.StorageEngine.sanitizeRoomTeams = global.StorageEngine.sanitizeRoomTeams.bind(global.StorageEngine);
    if (typeof global.StorageEngine.saveRoom === 'function') global.StorageEngine.saveRoom = global.StorageEngine.saveRoom.bind(global.StorageEngine);
    if (typeof global.StorageEngine.syncRoomToSupabase === 'function') global.StorageEngine.syncRoomToSupabase = global.StorageEngine.syncRoomToSupabase.bind(global.StorageEngine);
    if (typeof global.StorageEngine.fetchRoomFromSupabase === 'function') global.StorageEngine.fetchRoomFromSupabase = global.StorageEngine.fetchRoomFromSupabase.bind(global.StorageEngine);
    if (typeof global.StorageEngine.fetchPublicRoomsFromSupabase === 'function') global.StorageEngine.fetchPublicRoomsFromSupabase = global.StorageEngine.fetchPublicRoomsFromSupabase.bind(global.StorageEngine);
    if (typeof global.StorageEngine.getSupabaseConfig === 'function') global.StorageEngine.getSupabaseConfig = global.StorageEngine.getSupabaseConfig.bind(global.StorageEngine);
    if (typeof global.StorageEngine.fetchRoomFromServer === 'function') global.StorageEngine.fetchRoomFromServer = global.StorageEngine.fetchRoomFromServer.bind(global.StorageEngine);
    if (typeof global.StorageEngine.fetchPublicRoomsFromServer === 'function') global.StorageEngine.fetchPublicRoomsFromServer = global.StorageEngine.fetchPublicRoomsFromServer.bind(global.StorageEngine);
    if (typeof global.StorageEngine.kickPlayer === 'function') global.StorageEngine.kickPlayer = global.StorageEngine.kickPlayer.bind(global.StorageEngine);
    if (typeof global.StorageEngine.setPlayerOnlineStatus === 'function') global.StorageEngine.setPlayerOnlineStatus = global.StorageEngine.setPlayerOnlineStatus.bind(global.StorageEngine);
    if (typeof global.StorageEngine.updatePlayerHeartbeat === 'function') global.StorageEngine.updatePlayerHeartbeat = global.StorageEngine.updatePlayerHeartbeat.bind(global.StorageEngine);
    if (typeof global.StorageEngine.clearAllRooms === 'function') global.StorageEngine.clearAllRooms = global.StorageEngine.clearAllRooms.bind(global.StorageEngine);
    if (typeof global.StorageEngine.switchRoomChannel === 'function') global.StorageEngine.switchRoomChannel = global.StorageEngine.switchRoomChannel.bind(global.StorageEngine);
    if (typeof global.StorageEngine.broadcastRoomUpdate === 'function') global.StorageEngine.broadcastRoomUpdate = global.StorageEngine.broadcastRoomUpdate.bind(global.StorageEngine);
    if (typeof global.StorageEngine.broadcastAuctionStart === 'function') global.StorageEngine.broadcastAuctionStart = global.StorageEngine.broadcastAuctionStart.bind(global.StorageEngine);
    if (typeof global.StorageEngine.broadcastBid === 'function') global.StorageEngine.broadcastBid = global.StorageEngine.broadcastBid.bind(global.StorageEngine);
    if (typeof global.StorageEngine.broadcastPass === 'function') global.StorageEngine.broadcastPass = global.StorageEngine.broadcastPass.bind(global.StorageEngine);
  }

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
