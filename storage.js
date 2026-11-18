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
        lanIp: '10.33.5.86',
        port: 8443,
        localhostUrl: 'https://localhost:8443',
        privateLanUrl: 'https://10.33.5.86:8443'
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
      if (!this.currentUser) return { success: false, error: 'No user logged in' };

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
      if (db[this.currentUser.userId]) {
        db[this.currentUser.userId].userName = cleanName;
        db[this.currentUser.userId].lastActive = new Date().toISOString();
        this.saveLocalUsersDB(db);
      }
      this.persistLocalUser(this.currentUser);

      // Update in multiplayer assignments
      for (const tId in this.multiplayerRoom.humanManagers) {
        if (this.multiplayerRoom.humanManagers[tId].userId === this.currentUser.userId) {
          this.multiplayerRoom.humanManagers[tId].userName = cleanName;
        }
      }

      return { success: true, user: this.currentUser, oldName };
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
     */
    getPrivateRoomLink() {
      const base = (this.networkInfo && this.networkInfo.privateLanUrl) 
        ? this.networkInfo.privateLanUrl 
        : (window.location.protocol + '//' + (window.location.hostname || 'localhost') + ':' + (window.location.port || '8443'));
      const url = new URL(base);
      if (this.currentRoomId && this.currentRoomId !== 'DEFAULT') {
        url.searchParams.set('room', this.currentRoomId);
      }
      if (this.currentRoomPin) {
        url.searchParams.set('pin', this.currentRoomPin);
      }
      return url.toString();
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
        this.supabaseChannel = this.supabase.channel(`auction-room-${this.currentRoomId}`, {
          config: { broadcast: { self: false } }
        });

        this.supabaseChannel
          .on('broadcast', { event: 'bid' }, payload => {
            if (payload && payload.payload && window.Game) {
              const { teamId, amount } = payload.payload;
              window.Game.placeBid(teamId, amount);
            }
          })
          .on('broadcast', { event: 'pass' }, () => {
            if (window.Game) window.Game.passPlayer();
          })
          .subscribe();

        console.log(`[Supabase Realtime] Connected to room channel: auction-room-${this.currentRoomId}`);
        this.isServerConnected = true;
        return this.supabase;
      } catch (err) {
        console.warn('[Supabase Realtime] Connection warning:', err);
        return null;
      }
    }

    broadcastBid(teamId, amount) {
      if (this.supabaseChannel) {
        this.supabaseChannel.send({
          type: 'broadcast',
          event: 'bid',
          payload: { teamId, amount, timestamp: Date.now() }
        });
      }
    }
  }

  function jsonStringify(obj) {
    return JSON.stringify(obj);
  }

  // Global instance
  global.StorageEngine = new StorageManager();

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
