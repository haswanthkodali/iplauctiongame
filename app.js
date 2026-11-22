/**
 * IPL AUCTION GAME - APPLICATION CONTROLLER (app.js)
 * ============================================================================
 * Coordinates the UI, sound effects, animations, hammer strikes, Playing XI visualizer,
 * post-auction ratings (Normal vs User Mode), and flawless Pause & Scout modal.
 * ============================================================================
 */

(function () {
  'use strict';

  // Application State
  const AppState = {
    currentTab: 'home', // Start on lobby/mode selector
    ratingMode: 'normal', // 'normal' | 'user'
    selectedPlaying11TeamId: 'RCB',
    selectedReviewTeamId: 'RCB',
    selectedLandingTeamId: 'RCB',
    poolSize: 'quick', // 'quick' (~8 min top stars) | 'full' (all 200+ players)
    userTeamRatings: {}, // Stores user-customized ratings for each team
    auctionMode: 'MINI',  // 'MINI' (default 40/60) | 'MEGA'
    isHammerStriking: false,
    seasonSimulation: null
  };

  // DOM Elements Cache
  const DOM = {};

  function cacheDOMElements() {
    DOM.btnPauseResume = document.getElementById('btnPauseResume');
    DOM.pauseIcon = document.getElementById('pauseIcon');
    DOM.pauseLabel = document.getElementById('pauseLabel');
    DOM.btnAudioToggle = document.getElementById('btnAudioToggle');
    DOM.audioIcon = document.getElementById('audioIcon');
    DOM.btnModeToggle = document.getElementById('btnModeToggle');
    DOM.modeLabel = document.getElementById('modeLabel');
    DOM.auctionModeBadge = document.getElementById('auctionModeBadge');
    DOM.speedButtons = document.querySelectorAll('.btn-speed');
    DOM.navTabs = document.querySelectorAll('.nav-tab');
    DOM.tabPanes = document.querySelectorAll('.tab-pane');

    // Header User Chip
    DOM.userTeamChip = document.getElementById('userTeamChip');
    DOM.userTeamLogo = document.getElementById('userTeamLogo');
    DOM.userTeamName = document.getElementById('userTeamName');
    DOM.userPurseLeft = document.getElementById('userPurseLeft');
    DOM.userSquadCount = document.getElementById('userSquadCount');
    DOM.userOverseasCount = document.getElementById('userOverseasCount');

    // Auction Arena
    DOM.currentSetName = document.getElementById('currentSetName');
    DOM.playerProgressIndex = document.getElementById('playerProgressIndex');
    DOM.playerProgressTotal = document.getElementById('playerProgressTotal');
    DOM.btnShufflePool = document.getElementById('btnShufflePool');
    DOM.onDeckPreviewContainer = document.getElementById('onDeckPreviewContainer');
    DOM.btnOpenScoutModal = document.getElementById('btnOpenScoutModal');
    DOM.activePlayerCard = document.getElementById('activePlayerCard');
    DOM.stampOverlay = document.getElementById('stampOverlay');
    DOM.stampBadge = document.getElementById('stampBadge');

    // Set Swap Banner
    DOM.setSwapBanner = document.getElementById('setSwapBanner');
    DOM.setSwapTitle = document.getElementById('setSwapTitle');
    DOM.setSwapSubtitle = document.getElementById('setSwapSubtitle');

    DOM.playerPhoto = document.getElementById('playerPhoto');
    DOM.playerCountryFlag = document.getElementById('playerCountryFlag');
    DOM.playerCountryName = document.getElementById('playerCountryName');
    DOM.playerOverseasTag = document.getElementById('playerOverseasTag');
    DOM.playerName = document.getElementById('playerName');
    DOM.playerSpeciality = document.getElementById('playerSpeciality');
    DOM.playerOverallRating = document.getElementById('playerOverallRating');
    DOM.playerRoleBadge = document.getElementById('playerRoleBadge');
    DOM.playerFormBadge = document.getElementById('playerFormBadge');
    DOM.playerBestPosBadge = document.getElementById('playerBestPosBadge');
    DOM.playerBattingRating = document.getElementById('playerBattingRating');
    DOM.playerBowlingRating = document.getElementById('playerBowlingRating');
    DOM.playerFieldingRating = document.getElementById('playerFieldingRating');

    // Stats Grid
    DOM.statMatches = document.getElementById('statMatches');
    DOM.statRuns = document.getElementById('statRuns');
    DOM.statSR = document.getElementById('statSR');
    DOM.statAvg = document.getElementById('statAvg');
    DOM.statMilestones = document.getElementById('statMilestones');
    DOM.statBowling = document.getElementById('statBowling');
    DOM.impactTeamName = document.getElementById('impactTeamName');
    DOM.impactSlotFit = document.getElementById('impactSlotFit');
    DOM.impactRatingDelta = document.getElementById('impactRatingDelta');

    // Bidding Controls
    DOM.currentBidDisplay = document.getElementById('currentBidDisplay');
    DOM.basePriceDisplay = document.getElementById('basePriceDisplay');
    DOM.leaderLogo = document.getElementById('leaderLogo');
    DOM.leaderName = document.getElementById('leaderName');
    DOM.nextIncrementDisplay = document.getElementById('nextIncrementDisplay');
    DOM.btnUserBid = document.getElementById('btnUserBid');
    DOM.userNextBidAmount = document.getElementById('userNextBidAmount');
    DOM.btnPassPlayer = document.getElementById('btnPassPlayer');
    DOM.quickRaiseButtons = document.querySelectorAll('.btn-quick-raise');
    DOM.chkAutoBid = document.getElementById('chkAutoBid');

    // Gavel & Timer
    DOM.timerSeconds = document.getElementById('timerSeconds');
    DOM.timerProgressRing = document.getElementById('timerProgressRing');
    DOM.gavelGraphic = document.getElementById('gavelGraphic');
    DOM.auctioneerCallout = document.getElementById('auctioneerCallout');
    DOM.auctioneerName = document.getElementById('auctioneerName');
    DOM.auctioneerCommentary = document.getElementById('auctioneerCommentary');
    DOM.biddingLogList = document.getElementById('biddingLogList');
    DOM.logCount = document.getElementById('logCount');

    // Playing 11 Tab
    DOM.selectPlaying11Team = document.getElementById('selectPlaying11Team');
    DOM.xiScoreVal = document.getElementById('xiScoreVal');
    DOM.xiOverseasCount = document.getElementById('xiOverseasCount');
    DOM.xiBowlingOptions = document.getElementById('xiBowlingOptions');
    DOM.xiWkStatus = document.getElementById('xiWkStatus');
    DOM.xiBenchDepthScore = document.getElementById('xiBenchDepthScore');
    DOM.playing11FieldGrid = document.getElementById('playing11FieldGrid');
    DOM.benchBackupsContainer = document.getElementById('benchBackupsContainer');

    // Franchises Tab
    DOM.franchisesGrid = document.getElementById('franchisesGrid');

    // Catalog Tab
    DOM.catalogSearchInput = document.getElementById('catalogSearchInput');
    DOM.catalogSetFilter = document.getElementById('catalogSetFilter');
    DOM.catalogRoleFilter = document.getElementById('catalogRoleFilter');
    DOM.catalogOverseasFilter = document.getElementById('catalogOverseasFilter');
    DOM.catalogPlayersGrid = document.getElementById('catalogPlayersGrid');

    // Ratings Tab
    DOM.btnRatingModeNormal = document.getElementById('btnRatingModeNormal');
    DOM.btnRatingModeUser = document.getElementById('btnRatingModeUser');
    DOM.ratingFormulaDescription = document.getElementById('ratingFormulaDescription');
    DOM.miniAuctionFormulaBanner = document.getElementById('miniAuctionFormulaBanner');
    DOM.leaderboardTableBody = document.getElementById('leaderboardTableBody');
    DOM.userReviewSection = document.getElementById('userReviewSection');
    DOM.userReviewTeamSelect = document.getElementById('userReviewTeamSelect');
    DOM.userReviewTeamCard = document.getElementById('userReviewTeamCard');

    // Modals
    DOM.scoutModal = document.getElementById('scoutModal');
    DOM.btnCloseScoutModal = document.getElementById('btnCloseScoutModal');
    DOM.btnModalResumeAuction = document.getElementById('btnModalResumeAuction');
    DOM.modalPlayerBio = document.getElementById('modalPlayerBio');
    DOM.modalTeamNeedsList = document.getElementById('modalTeamNeedsList');

    DOM.modeSelectModal = document.getElementById('modeSelectModal');
    DOM.btnChooseMega = document.getElementById('btnChooseMega');
    DOM.btnChooseMini = document.getElementById('btnChooseMini');
    DOM.btnCloseModeModal = document.getElementById('btnCloseModeModal');

    // User Profile, Relogin & Multiplayer Elements
    DOM.btnUserProfile = document.getElementById('btnUserProfile');
    DOM.userAvatarLetter = document.getElementById('userAvatarLetter');
    DOM.headerUserName = document.getElementById('headerUserName');
    DOM.btnMultiplayerLobby = document.getElementById('btnMultiplayerLobby');
    DOM.multiplayerCountBadge = document.getElementById('multiplayerCountBadge');
    DOM.multiplayerPaddlesSection = document.getElementById('multiplayerPaddlesSection');
    DOM.multiplayerPaddlesList = document.getElementById('multiplayerPaddlesList');

    DOM.userProfileModal = document.getElementById('userProfileModal');
    DOM.modalUserAvatar = document.getElementById('modalUserAvatar');
    DOM.modalUserName = document.getElementById('modalUserName');
    DOM.serverSyncBadge = document.getElementById('serverSyncBadge');
    DOM.inputEditUserName = document.getElementById('inputEditUserName');
    DOM.btnSaveUserName = document.getElementById('btnSaveUserName');
    DOM.btnCloseProfileModal = document.getElementById('btnCloseProfileModal');
    DOM.profileTabs = document.querySelectorAll('.profile-tab');
    DOM.profilePanes = document.querySelectorAll('.profile-pane');
    DOM.pastBidsCountBadge = document.getElementById('pastBidsCountBadge');
    DOM.pastBidsList = document.getElementById('pastBidsList');
    DOM.pastSquadsList = document.getElementById('pastSquadsList');
    DOM.pastRatingsList = document.getElementById('pastRatingsList');
    DOM.inputReloginName = document.getElementById('inputReloginName');
    DOM.btnExecuteRelogin = document.getElementById('btnExecuteRelogin');
    DOM.registeredProfilesList = document.getElementById('registeredProfilesList');

    DOM.multiplayerModal = document.getElementById('multiplayerModal');
    DOM.btnCloseMultiplayerModal = document.getElementById('btnCloseMultiplayerModal');
    DOM.multiplayerTeamsList = document.getElementById('multiplayerTeamsList');
    DOM.btnSaveMultiplayerRoom = document.getElementById('btnSaveMultiplayerRoom');

    // Private Link & Room Controls
    DOM.btnPrivateLinkHeader = document.getElementById('btnPrivateLinkHeader');
    DOM.btnCopyPrivateLink = document.getElementById('btnCopyPrivateLink');
    DOM.inputPrivateShareLink = document.getElementById('inputPrivateShareLink');
    DOM.btnCreateNewRoom = document.getElementById('btnCreateNewRoom');
    DOM.currentRoomBadge = document.getElementById('currentRoomBadge');
    DOM.copyLinkBtnText = document.getElementById('copyLinkBtnText');

    // Landing Page Elements
    DOM.cardModeMini = document.getElementById('cardModeMini');
    DOM.cardModeMega = document.getElementById('cardModeMega');
    DOM.radioCheckMini = document.getElementById('radioCheckMini');
    DOM.radioCheckMega = document.getElementById('radioCheckMega');
    DOM.btnPoolQuick = document.getElementById('btnPoolQuick');
    DOM.btnPoolFull = document.getElementById('btnPoolFull');
    DOM.badgePoolQuick = document.getElementById('badgePoolQuick');
    DOM.badgePoolFull = document.getElementById('badgePoolFull');
    DOM.landingTeamsGrid = document.getElementById('landingTeamsGrid');
    DOM.btnRandomTeamLanding = document.getElementById('btnRandomTeamLanding');
    DOM.landingSelectedLogo = document.getElementById('landingSelectedLogo');
    DOM.landingSelectedTeamName = document.getElementById('landingSelectedTeamName');
    DOM.landingSelectedModeBadge = document.getElementById('landingSelectedModeBadge');
    DOM.landingSelectedPurse = document.getElementById('landingSelectedPurse');
    DOM.btnEnterAuctionRoom = document.getElementById('btnEnterAuctionRoom');
    DOM.btnStartAuctionHero = document.getElementById('btnStartAuctionHero');
    DOM.btnViewRetainedModalHero = document.getElementById('btnViewRetainedModalHero');

    // Bidding Power Actions
    DOM.btnPowerJump = document.getElementById('btnPowerJump');
    DOM.btnFinishFast = document.getElementById('btnFinishFast');

    // Retained Squads Modal
    DOM.retainedSquadsModal = document.getElementById('retainedSquadsModal');
    DOM.btnCloseRetainedModal = document.getElementById('btnCloseRetainedModal');
    DOM.retainedModalTeamTabs = document.getElementById('retainedModalTeamTabs');
    DOM.retainedModalTeamContent = document.getElementById('retainedModalTeamContent');

    // 2027 Season Tournament Simulation
    DOM.seasonSimContainer = document.getElementById('seasonSimContainer');
    DOM.btnSimulateSeason = document.getElementById('btnSimulateSeason');
    DOM.seasonStandingsBody = document.getElementById('seasonStandingsBody');
    DOM.championDisplay = document.getElementById('championDisplay');
    DOM.playoffsResultsContainer = document.getElementById('playoffsResultsContainer');

    // Supabase Cloud Modal Elements
    DOM.btnOpenSupabaseModal = document.getElementById('btnOpenSupabaseModal');
    DOM.supabaseConfigModal = document.getElementById('supabaseConfigModal');
    DOM.btnCloseSupabaseModal = document.getElementById('btnCloseSupabaseModal');
    DOM.btnCloseSupabaseModal2 = document.getElementById('btnCloseSupabaseModal2');
    DOM.inputSupabaseUrl = document.getElementById('inputSupabaseUrl');
    DOM.inputSupabaseKey = document.getElementById('inputSupabaseKey');
    DOM.btnSaveSupabaseConfig = document.getElementById('btnSaveSupabaseConfig');
    DOM.btnClearSupabaseConfig = document.getElementById('btnClearSupabaseConfig');
    DOM.supabaseStatusBadge = document.getElementById('supabaseStatusBadge');
    DOM.supabaseStatusDetail = document.getElementById('supabaseStatusDetail');

    // End Auction & Manager Entry Elements
    DOM.btnEndAuctionArena = document.getElementById('btnEndAuctionArena');
    DOM.managerEntryModal = document.getElementById('managerEntryModal');
    DOM.inputManagerName = document.getElementById('inputManagerName');
    DOM.entryTeamSelectGrid = document.getElementById('entryTeamSelectGrid');
    DOM.btnSubmitManagerEntry = document.getElementById('btnSubmitManagerEntry');
    DOM.endAuctionModal = document.getElementById('endAuctionModal');
    DOM.btnCloseEndAuctionModal = document.getElementById('btnCloseEndAuctionModal');
    DOM.endAuctionEvaluationCard = document.getElementById('endAuctionEvaluationCard');
    DOM.btnProceedToPlaying11Turf = document.getElementById('btnProceedToPlaying11Turf');
    DOM.btnViewFinalLeaderboard = document.getElementById('btnViewFinalLeaderboard');

    // Manager & Team Page Elements
    DOM.inputManagerPageName = document.getElementById('inputManagerPageName');
    DOM.btnSaveManagerPageNameOnly = document.getElementById('btnSaveManagerPageNameOnly');
    DOM.managerPageTeamsGrid = document.getElementById('managerPageTeamsGrid');
    DOM.managerPageSelectedLogo = document.getElementById('managerPageSelectedLogo');
    DOM.managerPageSelectedTeamName = document.getElementById('managerPageSelectedTeamName');
    DOM.managerPageSelectedPurse = document.getElementById('managerPageSelectedPurse');
    DOM.btnSaveManagerSetupAll = document.getElementById('btnSaveManagerSetupAll');
    DOM.btnSaveAndEnterAuction = document.getElementById('btnSaveAndEnterAuction');

    // Interactive Playing 11 Builder Elements
    DOM.btnAutoFillXI = document.getElementById('btnAutoFillXI');
    DOM.btnClearUserXI = document.getElementById('btnClearUserXI');
    DOM.btnLockSubmitXI = document.getElementById('btnLockSubmitXI');
    DOM.pickupSlotHint = document.getElementById('pickupSlotHint');
    DOM.squadBenchSubtitle = document.getElementById('squadBenchSubtitle');
    DOM.squadBenchCountBadge = document.getElementById('squadBenchCountBadge');
    DOM.squadPlayerPickerTray = document.getElementById('squadPlayerPickerTray');

    // Multiplayer Live Chat & Purchased Players Dashboard
    DOM.btnToggleChatDrawer = document.getElementById('btnToggleChatDrawer');
    DOM.btnFloatingChat = document.getElementById('btnFloatingChat');
    DOM.multiplayerChatDrawer = document.getElementById('multiplayerChatDrawer');
    DOM.btnCloseChatDrawer = document.getElementById('btnCloseChatDrawer');
    DOM.btnTabChatMessages = document.getElementById('btnTabChatMessages');
    DOM.btnTabPurchasedShortcut = document.getElementById('btnTabPurchasedShortcut');
    DOM.chatMessagesView = document.getElementById('chatMessagesView');
    DOM.chatMessagesContainer = document.getElementById('chatMessagesContainer');
    DOM.inputChatMessage = document.getElementById('inputChatMessage');
    DOM.btnSendChatMessage = document.getElementById('btnSendChatMessage');
    DOM.btnChatShortcutSoldToggle = document.getElementById('btnChatShortcutSoldToggle');
    DOM.purchasedPlayersShortcutView = document.getElementById('purchasedPlayersShortcutView');
    DOM.inputSearchPurchased = document.getElementById('inputSearchPurchased');
    DOM.btnRefreshPurchasedList = document.getElementById('btnRefreshPurchasedList');
    DOM.shortcutTotalSoldCount = document.getElementById('shortcutTotalSoldCount');
    DOM.shortcutTotalPurseSpent = document.getElementById('shortcutTotalPurseSpent');
    DOM.shortcutPurchasedListContainer = document.getElementById('shortcutPurchasedListContainer');
    DOM.chatBadgeCount = document.getElementById('chatBadgeCount');
    DOM.chatTabBadge = document.getElementById('chatTabBadge');
    DOM.purchasedTabBadge = document.getElementById('purchasedTabBadge');
        DOM.floatingChatBadge = document.getElementById('floatingChatBadge');

    // AI Bidding Select & Team Squad Export Elements
    DOM.selectAiBiddingMode = document.getElementById('selectAiBiddingMode');
    DOM.aiBiddingModeHint = document.getElementById('aiBiddingModeHint');
    DOM.btnOpenExportRoster = document.getElementById('btnOpenExportRoster');
    DOM.btnShareRoomWhatsApp = document.getElementById('btnShareRoomWhatsApp');
    DOM.btnShareRoomNative = document.getElementById('btnShareRoomNative');

    DOM.teamSquadExportModal = document.getElementById('teamSquadExportModal');
    DOM.exportModalTeamLogo = document.getElementById('exportModalTeamLogo');
    DOM.exportModalTeamName = document.getElementById('exportModalTeamName');
    DOM.exportModalManagerBadge = document.getElementById('exportModalManagerBadge');
    DOM.btnCloseExportModal = document.getElementById('btnCloseExportModal');
    DOM.exportModalTeamTabs = document.getElementById('exportModalTeamTabs');
    DOM.exportModalTotalSpent = document.getElementById('exportModalTotalSpent');
    DOM.exportModalRemainingPurse = document.getElementById('exportModalRemainingPurse');
    DOM.exportModalSquadCount = document.getElementById('exportModalSquadCount');
    DOM.exportModalOverseasCount = document.getElementById('exportModalOverseasCount');
    DOM.exportModalCategoriesContainer = document.getElementById('exportModalCategoriesContainer');

    DOM.btnDownloadSquadCSV = document.getElementById('btnDownloadSquadCSV');
    DOM.btnDownloadSquadTXT = document.getElementById('btnDownloadSquadTXT');
    DOM.btnShareSquadWhatsApp = document.getElementById('btnShareSquadWhatsApp');
    DOM.btnCopySquadText = document.getElementById('btnCopySquadText');
    DOM.btnShareSquadNative = document.getElementById('btnShareSquadNative');
  }

  // =========================================================================
  // PERSISTENCE HELPERS (Full App State & Chat Sync)
  // =========================================================================
  function saveAppState() {
    try {
      const snap = {
        currentTab: AppState.currentTab || 'home',
        ratingMode: AppState.ratingMode || 'normal',
        selectedPlaying11TeamId: AppState.selectedPlaying11TeamId || (typeof Game !== 'undefined' && Game.getState ? Game.getState().userTeamId : 'RCB'),
        selectedReviewTeamId: AppState.selectedReviewTeamId || (typeof Game !== 'undefined' && Game.getState ? Game.getState().userTeamId : 'RCB'),
        selectedLandingTeamId: AppState.selectedLandingTeamId || 'RCB',
        auctionMode: AppState.auctionMode || 'MINI',
        poolSize: AppState.poolSize || 'quick',
        userTeamRatings: AppState.userTeamRatings || {},
        userPlayingXI: AppState.userPlayingXI || {},
        savedAt: Date.now()
      };
      localStorage.setItem('ipl_auction_app_state', JSON.stringify(snap));
    } catch (e) {}
  }

  function saveChatMessages() {
    try {
      if (typeof ChatState !== 'undefined' && Array.isArray(ChatState.messages)) {
        const recent = ChatState.messages.slice(-50);
        localStorage.setItem('ipl_auction_chat_msgs', JSON.stringify(recent));
      }
    } catch (e) {}
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  function initApp() {
    cacheDOMElements();
    setupEventListeners();

    // Check if user is opening a room link (?roomId= or ?room=)
    const urlParams = new URLSearchParams(window.location.search);
    const hasRoomLink = !!(urlParams.get('roomId') || urlParams.get('room'));

    // ---- TRY RESTORE SAVED AUCTION SESSION (Only for solo player returning to their solo session) ----
    const savedState = Game.getSavedState();
    if (!hasRoomLink && savedState && savedState.phase && savedState.phase !== 'home') {
      const restored = Game.restoreGameState();
      if (restored) {
        // Restore AppState from localStorage
        try {
          const savedAppState = localStorage.getItem('ipl_auction_app_state');
          if (savedAppState) {
            const snap = JSON.parse(savedAppState);
            AppState.currentTab = snap.currentTab || 'auction';
            AppState.ratingMode = snap.ratingMode || 'normal';
            AppState.selectedPlaying11TeamId = snap.selectedPlaying11TeamId || Game.getState().userTeamId || 'RCB';
            AppState.selectedReviewTeamId = snap.selectedReviewTeamId || Game.getState().userTeamId || 'RCB';
            AppState.selectedLandingTeamId = snap.selectedLandingTeamId || Game.getState().userTeamId || 'RCB';
            AppState.auctionMode = snap.auctionMode || Game.getState().auctionMode || 'MINI';
            AppState.poolSize = snap.poolSize || 'quick';
            AppState.userTeamRatings = snap.userTeamRatings || {};
            if (snap.userPlayingXI) AppState.userPlayingXI = snap.userPlayingXI;
          }
        } catch (e) {}

        // Restore chat messages
        try {
          const savedChat = localStorage.getItem('ipl_auction_chat_msgs');
          if (savedChat && typeof ChatState !== 'undefined') {
            ChatState.messages = JSON.parse(savedChat) || [];
          }
        } catch (e) {}

        populateTeamSelects();
        populateCatalogSetFilter();
        initUserSession();
        renderLandingPage();
        renderAllViews();
        wireNewFeatures();
        renderMultiplayerPaddles();
        if (typeof renderManagerPageView === 'function') renderManagerPageView();

        // Switch to saved tab (auction or results)
        switchTab(AppState.currentTab);

        // Show restore banner
        if (DOM.auctioneerCommentary) {
          DOM.auctioneerCommentary.textContent = '🔄 Session restored! Click Resume ▶️ to continue your auction.';
        }
        console.log('[IPL Auction] ✅ Session restored from save');
        return;
      }
    }

    // ---- FRESH START (no saved session) ----
    // Initialize game with default MINI mode and RCB
    Game.initGame({
      auctionMode: AppState.auctionMode,
      userTeamId: AppState.selectedLandingTeamId,
      poolSize: AppState.poolSize
    });

    // Populate UI Dropdowns
    populateTeamSelects();
    populateCatalogSetFilter();

    // Initialize user session & persistent server data
    initUserSession();

    // Initial render & restore past history
    renderLandingPage();
    renderAllViews();
    wireNewFeatures();
    renderMultiplayerPaddles();
    if (typeof renderHomeAuctionHistory === 'function') renderHomeAuctionHistory();
    if (typeof renderPublicRoomsList === 'function') renderPublicRoomsList();
    if (typeof renderManagerPageView === 'function') renderManagerPageView();

    // Ensure mode badge reflects Mini mode initially
    if (DOM.auctionModeBadge) {
      DOM.auctionModeBadge.textContent = 'MINI AUCTION (40/60)';
      DOM.auctionModeBadge.className = 'text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-purple-900/60 text-purple-300 border border-purple-700/50';
    }

    // Auto-init Supabase if config is present
    const sbUrl = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || localStorage.getItem('supabase_url');
    const sbKey = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || localStorage.getItem('supabase_anon_key');
    if (sbUrl && sbKey && typeof StorageEngine !== 'undefined' && StorageEngine.initSupabase) {
      StorageEngine.initSupabase(sbUrl, sbKey);
      updateSupabaseStatusDisplay(sbUrl, sbKey);
    }
  }

  // =========================================================================
  // EVENT LISTENERS & NAVIGATION
  // =========================================================================

  function setupEventListeners() {
    // Tab Navigation
    DOM.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabKey = tab.dataset.tab;
        switchTab(tabKey);
      });
    });

    // Speed Controls
    DOM.speedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseInt(btn.dataset.speed, 10);
        Game.setSpeed(speed);
        DOM.speedButtons.forEach(b => {
          b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
          b.classList.add('text-slate-400');
        });
        btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
        btn.classList.remove('text-slate-400');
        AuctionAudio.playBidPaddle();
      });
    });

    // Audio Toggle
    if (DOM.btnAudioToggle) {
      DOM.btnAudioToggle.addEventListener('click', () => {
        const isMuted = AuctionAudio.toggleMute();
        DOM.audioIcon.textContent = isMuted ? '🔇' : '🔊';
        if (!isMuted) AuctionAudio.playBidPaddle();
      });
    }

    // Pause / Resume Toggle
    if (DOM.btnPauseResume) {
      DOM.btnPauseResume.addEventListener('click', () => {
        const state = Game.getState();
        if (state.isPaused) {
          Game.resumeGame();
          AuctionAudio.playBidPaddle();
        } else {
          Game.pauseGame();
          AuctionAudio.playHammerStrike(0.6);
          openScoutModal();
        }
      });
    }

    // Open Scout Modal Button
    if (DOM.btnOpenScoutModal) {
      DOM.btnOpenScoutModal.addEventListener('click', () => {
        Game.pauseGame();
        openScoutModal();
      });
    }

    if (DOM.btnCloseScoutModal) {
      DOM.btnCloseScoutModal.addEventListener('click', () => {
        DOM.scoutModal.classList.add('hidden');
      });
    }

    if (DOM.btnModalResumeAuction) {
      DOM.btnModalResumeAuction.addEventListener('click', () => {
        DOM.scoutModal.classList.add('hidden');
        Game.resumeGame();
      });
    }

    // Mode Toggle Button
    if (DOM.btnModeToggle) {
      DOM.btnModeToggle.addEventListener('click', () => {
        Game.pauseGame();
        if (DOM.modeSelectModal) DOM.modeSelectModal.classList.remove('hidden');
      });
    }

    if (DOM.btnCloseModeModal) {
      DOM.btnCloseModeModal.addEventListener('click', () => {
        if (DOM.modeSelectModal) DOM.modeSelectModal.classList.add('hidden');
        Game.resumeGame();
      });
    }

    if (DOM.btnChooseMega) {
      DOM.btnChooseMega.addEventListener('click', () => {
        switchAuctionMode('MEGA');
      });
    }

    if (DOM.btnChooseMini) {
      DOM.btnChooseMini.addEventListener('click', () => {
        switchAuctionMode('MINI');
      });
    }

    // Bidding Action Buttons
    if (DOM.btnUserBid) {
      DOM.btnUserBid.addEventListener('click', () => {
        const state = Game.getState();
        if (state.phase !== 'auction' || state.isPaused) return;

        const userTeam = Game.getUserTeam();
        if (userTeam) {
          const success = Game.placeBid(userTeam.id);
          if (success) {
            triggerBidEffects(userTeam.id);
            updateTopBar();
            updateAuctionArena();
          }
        }
      });
    }

    if (DOM.btnPassPlayer) {
      DOM.btnPassPlayer.addEventListener('click', () => {
        AuctionAudio.playHammerStrike(0.5);
        Game.passPlayer();
      });
    }

    // Quick Raise Buttons (+1 Cr, +0.5 Cr, etc.)
    DOM.quickRaiseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const addCr = parseFloat(btn.dataset.add) || 1.0;
        const state = Game.getState();
        const userTeam = Game.getUserTeam();
        const player = Game.getCurrentPlayer();
        if (userTeam && !state.isPaused && player) {
          const currentAmount = state.currentBid > 0 ? state.currentBid : (player.basePrice || 0.20);
          const customRaise = Math.round((currentAmount + addCr) * 100) / 100;
          const success = Game.placeBid(userTeam.id, customRaise);
          if (success) {
            triggerBidEffects(userTeam.id);
            updateTopBar();
            updateAuctionArena();
          }
        }
      });
    });

    // Auto-Bid Toggle (Guarded)
    if (DOM.chkAutoBid) {
      if (DOM.chkAutoBid) {
        DOM.chkAutoBid.addEventListener('change', (e) => {
          if (e.target.checked) {
            AuctionAudio.playBidPaddle();
          }
        });
      }
    }

    // Playing 11 Team Select
    if (DOM.selectPlaying11Team) {
      DOM.selectPlaying11Team.addEventListener('change', (e) => {
        AppState.selectedPlaying11TeamId = e.target.value;
        renderPlaying11View();
      });
    }

    // User Review Team Select
    if (DOM.userReviewTeamSelect) {
      DOM.userReviewTeamSelect.addEventListener('change', (e) => {
        AppState.selectedReviewTeamId = e.target.value;
        renderUserReviewCard();
      });
    }

    // Ratings Mode Switcher
    if (DOM.btnRatingModeNormal) {
      DOM.btnRatingModeNormal.addEventListener('click', () => {
        setRatingMode('normal');
      });
    }
    if (DOM.btnRatingModeUser) {
      DOM.btnRatingModeUser.addEventListener('click', () => {
        setRatingMode('user');
      });
    }

    // Catalog Filters
    if (DOM.catalogSearchInput) DOM.catalogSearchInput.addEventListener('input', renderCatalogGrid);
    if (DOM.catalogSetFilter) DOM.catalogSetFilter.addEventListener('change', renderCatalogGrid);
    if (DOM.catalogRoleFilter) DOM.catalogRoleFilter.addEventListener('change', renderCatalogGrid);
    if (DOM.catalogOverseasFilter) DOM.catalogOverseasFilter.addEventListener('change', renderCatalogGrid);

    // Reshuffle Pool Button
    if (DOM.btnShufflePool) {
      DOM.btnShufflePool.addEventListener('click', () => {
        handleManualShuffle();
      });
    }

    // Landing Page Mode Selectors
    if (DOM.cardModeMini && DOM.cardModeMega) {
      if (DOM.cardModeMini) {
        DOM.cardModeMini.addEventListener('click', () => {
          setAuctionMode('MINI');
        });
      }
      if (DOM.cardModeMega) {
        DOM.cardModeMega.addEventListener('click', () => {
          setAuctionMode('MEGA');
        });
      }
    }

    // Landing Pool Size Selectors
    if (DOM.btnPoolQuick && DOM.btnPoolFull) {
      if (DOM.btnPoolQuick) {
        DOM.btnPoolQuick.addEventListener('click', () => {
          setPoolSize('quick');
        });
      }
      if (DOM.btnPoolFull) {
        DOM.btnPoolFull.addEventListener('click', () => {
          setPoolSize('full');
        });
      }
    }

    // Random Team Pick
    if (DOM.btnRandomTeamLanding) {
      if (DOM.btnRandomTeamLanding) {
        DOM.btnRandomTeamLanding.addEventListener('click', () => {
          pickRandomLandingTeam();
        });
      }
    }

    // Launch Auction from Landing Page
    if (DOM.btnEnterAuctionRoom) {
      if (DOM.btnEnterAuctionRoom) {
        DOM.btnEnterAuctionRoom.addEventListener('click', () => {
          startAuctionFromLanding();
        });
      }
    }
    if (DOM.btnStartAuctionHero) {
      if (DOM.btnStartAuctionHero) {
        DOM.btnStartAuctionHero.addEventListener('click', () => {
          startAuctionFromLanding();
        });
      }
    }

    // Power Jump Button (+1.0 Cr jump bid)
    if (DOM.btnPowerJump) {
      DOM.btnPowerJump.addEventListener('click', () => {
        const userTeam = Game.getUserTeam();
        if (!userTeam) return;
        // BLOCK: Cannot power jump if already highest bidder
        const st = Game.getState();
        if (st.currentBidder === userTeam.id) return;
        if (st.phase !== 'auction' || st.isPaused) return;
        const success = Game.powerJump(userTeam.id);
        if (success) {
          triggerBidEffects(userTeam.id);
          if (DOM.auctioneerCallout) {
            DOM.auctioneerCallout.textContent = `⚡ POWER JUMP! +₹1.00 Cr RAISE BY ${userTeam.shortName || userTeam.name}!`;
          }
        }
      });
    }

    // Finish Fast AI Simulation
    if (DOM.btnFinishFast) {
      DOM.btnFinishFast.addEventListener('click', () => {
        if (confirm('Fast-forward remaining auction lots with AI Coach and proceed straight to squad ratings & tournament simulation?')) {
          Game.finishFast(true);
          switchTab('ratings');
          if (window.confetti) window.confetti({ particleCount: 70, spread: 80 });
        }
      });
    }

    // 2027 Retained Squads Modal Trigger
    if (DOM.btnViewRetainedModalHero) {
      DOM.btnViewRetainedModalHero.addEventListener('click', () => {
        openRetainedModal(AppState.selectedLandingTeamId || 'RCB');
      });
    }
    if (DOM.btnCloseRetainedModal) {
      DOM.btnCloseRetainedModal.addEventListener('click', () => {
        DOM.retainedSquadsModal.classList.add('hidden');
      });
    }

    // Quick Franchise Bar at Top Header
    document.querySelectorAll('.btn-franchise-quick').forEach(btn => {
      btn.addEventListener('click', () => {
        const teamId = btn.dataset.team;
        openRetainedModal(teamId);
      });
    });

    // 2027 Season Tournament Simulator Trigger
    if (DOM.btnSimulateSeason) {
      DOM.btnSimulateSeason.addEventListener('click', () => {
        AppState.seasonSimulation = null;
        renderSeasonSimulation();
        if (window.confetti) window.confetti({ particleCount: 60, spread: 70 });
      });
    }

    // Supabase Cloud Configuration Modal
    if (DOM.btnOpenSupabaseModal) {
      if (DOM.btnOpenSupabaseModal) {
        DOM.btnOpenSupabaseModal.addEventListener('click', () => {
          openSupabaseConfigModal();
        });
      }
    }
    if (DOM.btnCloseSupabaseModal) {
      if (DOM.btnCloseSupabaseModal) {
        DOM.btnCloseSupabaseModal.addEventListener('click', () => {
          if (DOM.supabaseConfigModal) DOM.supabaseConfigModal.classList.add('hidden');
        });
      }
    }
    if (DOM.btnCloseSupabaseModal2) {
      if (DOM.btnCloseSupabaseModal2) {
        DOM.btnCloseSupabaseModal2.addEventListener('click', () => {
          if (DOM.supabaseConfigModal) DOM.supabaseConfigModal.classList.add('hidden');
        });
      }
    }
    if (DOM.btnSaveSupabaseConfig) {
      if (DOM.btnSaveSupabaseConfig) {
        DOM.btnSaveSupabaseConfig.addEventListener('click', () => {
          saveSupabaseConfig();
        });
      }
    }
    if (DOM.btnClearSupabaseConfig) {
      if (DOM.btnClearSupabaseConfig) {
        DOM.btnClearSupabaseConfig.addEventListener('click', () => {
          clearSupabaseConfig();
        });
      }
    }

    // User Profile & Relogin Modal Controls
    if (DOM.btnUserProfile) {
      DOM.btnUserProfile.addEventListener('click', () => {
        openUserProfileModal();
      });
    }

    if (DOM.btnSaveUserName) {
      DOM.btnSaveUserName.addEventListener('click', () => {
        handleRename();
      });
    }

    if (DOM.btnExecuteRelogin) {
      if (DOM.btnExecuteRelogin) {
        DOM.btnExecuteRelogin.addEventListener('click', () => {
          handleRelogin();
        });
      }
    }

    if (DOM.btnCloseProfileModal) {
      DOM.btnCloseProfileModal.addEventListener('click', () => {
        DOM.userProfileModal.classList.add('hidden');
      });
    }

    // Profile Sub-Tabs
    DOM.profileTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const paneKey = tab.dataset.profileTab;
        DOM.profileTabs.forEach(t => {
          t.classList.remove('active', 'border-amber-400', 'text-amber-400');
          t.classList.add('border-transparent', 'text-slate-400');
        });
        tab.classList.add('active', 'border-amber-400', 'text-amber-400');
        tab.classList.remove('border-transparent', 'text-slate-400');

        DOM.profilePanes.forEach(pane => {
          if (pane.id === `profileTab-${paneKey}`) {
            pane.classList.remove('hidden');
          } else {
            pane.classList.add('hidden');
          }
        });
      });
    });

    // Multiplayer Lobby Modal Controls
    if (DOM.btnMultiplayerLobby) {
      if (DOM.btnMultiplayerLobby) {
        DOM.btnMultiplayerLobby.addEventListener('click', () => {
          openMultiplayerModal();
        });
      }
    }

    if (DOM.btnPrivateLinkHeader) {
      if (DOM.btnPrivateLinkHeader) {
        DOM.btnPrivateLinkHeader.addEventListener('click', () => {
          openMultiplayerModal();
        });
      }
    }

    if (DOM.btnCopyPrivateLink) {
      if (DOM.btnCopyPrivateLink) {
        DOM.btnCopyPrivateLink.addEventListener('click', () => {
          copyPrivateLinkToClipboard();
        });
      }
    }

    if (DOM.btnCreateNewRoom) {
      if (DOM.btnCreateNewRoom) {
        DOM.btnCreateNewRoom.addEventListener('click', () => {
          handleCreateNewRoom();
        });
      }
    }

    if (DOM.btnCloseMultiplayerModal) {
      if (DOM.btnCloseMultiplayerModal) {
        DOM.btnCloseMultiplayerModal.addEventListener('click', () => {
          if (DOM.multiplayerModal) DOM.multiplayerModal.classList.add('hidden');
        });
      }
    }

    if (DOM.btnSaveMultiplayerRoom) {
      if (DOM.btnSaveMultiplayerRoom) {
        DOM.btnSaveMultiplayerRoom.addEventListener('click', () => {
          saveMultiplayerRoom();
        });
      }
    }

    // GAME ENGINE REACTIVE EVENT SUBSCRIPTIONS
    Game.on('stateChange', () => {
      updateTopBar();
      updateAuctionArena();
      saveAppState();
    });

    Game.on('timerTick', ({ timeLeft }) => {
      updateTimerUI(timeLeft);
    });

    Game.on('setSwap', ({ oldSet, newSet, setName, totalInSet }) => {
      triggerSetSwapCelebration(oldSet, newSet, setName, totalInSet);
    });

    Game.on('bidPlaced', ({ team, amount, player }) => {
      triggerBidEffects(team.id);
      updateBiddingTicker(team, amount, player);

      // Record bid under human user if placed by user franchise
      const currentUser = StorageEngine.getCurrentUser();
      const humanManagers = StorageEngine.getHumanManagers();
      const isHumanTeam = (team.id === Game.getState().userTeamId) || (humanManagers[team.id]);
      if (isHumanTeam && currentUser) {
        StorageEngine.recordUserBid({
          player: player.name,
          team: team.shortName || team.name,
          amount: amount,
          role: player.role,
          rating: player.rating
        });
      }
    });

    Game.on('playerSold', ({ player, team, amount }) => {
      triggerSoldCelebration(player, team, amount);
    });

    Game.on('playerUnsold', ({ player }) => {
      triggerUnsoldEffect(player);
      const btnAcc = document.getElementById('btnTabAccelerated');
      if (btnAcc && (window.RoomRules?.acceleratedEnabled !== false)) {
        btnAcc.classList.remove('hidden');
      }
    });

    Game.on('acceleratedPhaseTriggered', ({ unsold }) => {
      const btnAcc = document.getElementById('btnTabAccelerated');
      if (btnAcc) btnAcc.classList.remove('hidden');
      if (typeof switchArenaTab === 'function') switchArenaTab('accelerated');
      AuctionAudio.playHammerHit();
      alert(`⚡ REGULAR SETS COMPLETE!\n\nAccelerated Auction Round is now open. Franchises can nominate unsold cricketers or release squad players for a full refund to re-enter bidding!`);
    });

    Game.on('auctionEnd', ({ results }) => {
      // Auto-save completed squad, ratings, and career records to server
      const userTeam = Game.getUserTeam();
      if (userTeam) {
        StorageEngine.saveAuctionResult(
          {
            teamId: userTeam.id,
            teamName: userTeam.name,
            spent: userTeam.spent,
            playersCount: userTeam.players.length,
            players: userTeam.players.map(p => ({ name: p.name, price: p.soldPrice || p.price, role: p.role, rating: p.rating })),
            mode: AppState.auctionMode
          },
          AppState.userTeamRatings[userTeam.id] || null
        );

        AppState.selectedPlaying11TeamId = userTeam.id;
        AppState.selectedReviewTeamId = userTeam.id;
        if (DOM.selectPlaying11Team) DOM.selectPlaying11Team.value = userTeam.id;
        if (DOM.userReviewTeamSelect) DOM.userReviewTeamSelect.value = userTeam.id;

        // Auto-fill XI if empty
        const xi = getUserXIForTeam(userTeam.id);
        if (xi.every(slot => slot === null) && userTeam.players && userTeam.players.length > 0) {
          const playerStatsDB = window.PLAYER_STATS || {};
          const bestXI = RatingEngine.selectBestXI(userTeam.players, playerStatsDB);
          if (bestXI && bestXI.xi) {
            bestXI.xi.forEach((slot, idx) => {
              if (slot.player) xi[idx] = slot.player;
            });
          }
        }
      }

      saveAppState();

      // Switch to playing 11 and open evaluation modal so user can pick players
      switchTab('playing11');
      if (DOM.endAuctionModal) {
        renderEndAuctionEvaluation();
        DOM.endAuctionModal.classList.remove('hidden');
      }
    });

    // Manager & Team Page Listeners
    setupManagerPageEventListeners();
  }

  // =========================================================================
  // VIEW SWITCHING
  // =========================================================================

  function switchTab(tabKey) {
    AppState.currentTab = tabKey;
    DOM.navTabs.forEach(tab => {
      if (tab.dataset.tab === tabKey) {
        tab.classList.add('active', 'border-amber-400', 'text-amber-400', 'bg-slate-800/40');
        tab.classList.remove('border-transparent', 'text-slate-400');
      } else {
        tab.classList.remove('active', 'border-amber-400', 'text-amber-400', 'bg-slate-800/40');
        tab.classList.add('border-transparent', 'text-slate-400');
      }
    });

    DOM.tabPanes.forEach(pane => {
      if (pane.id === `tabContent-${tabKey}`) {
        pane.classList.remove('hidden');
        pane.classList.add('active');
      } else {
        pane.classList.add('hidden');
        pane.classList.remove('active');
      }
    });

    // Render corresponding view
    if (tabKey === 'manager') renderManagerPageView();
    if (tabKey === 'playing11') renderPlaying11View();
    if (tabKey === 'franchises') renderFranchisesView();
    if (tabKey === 'catalog') renderCatalogGrid();
    if (tabKey === 'ratings') renderRatingsView();
    saveAppState();
  }

  function switchAuctionMode(mode) {
    AppState.auctionMode = mode;
    if (DOM.modeSelectModal) if (DOM.modeSelectModal) DOM.modeSelectModal.classList.add('hidden');

    if (DOM.auctionModeBadge) DOM.auctionModeBadge.textContent = mode === 'MINI' ? 'MINI AUCTION (40/60)' : 'MEGA AUCTION';
    DOM.auctionModeBadge.className = mode === 'MINI'
      ? 'text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-purple-900/60 text-purple-300 border border-purple-700/50'
      : 'text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50';

    if (DOM.modeLabel) if (DOM.modeLabel) DOM.modeLabel.textContent = `Mode: ${mode === 'MINI' ? 'Mini' : 'Mega'}`;

    // Reset Game with new mode
    Game.initGame({
      auctionMode: mode,
      userTeamId: 'RCB'
    });
    Game.startAuction();

    AuctionAudio.playSoldFanfare();
    renderAllViews();
  }

  function setRatingMode(mode) {
    AppState.ratingMode = mode;
    if (mode === 'normal') {
      DOM.btnRatingModeNormal.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      DOM.btnRatingModeNormal.classList.remove('text-slate-400');
      DOM.btnRatingModeUser.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
      DOM.btnRatingModeUser.classList.add('text-slate-400');
      DOM.userReviewSection.classList.add('hidden');
    } else {
      DOM.btnRatingModeUser.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      DOM.btnRatingModeUser.classList.remove('text-slate-400');
      DOM.btnRatingModeNormal.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
      DOM.btnRatingModeNormal.classList.add('text-slate-400');
      DOM.userReviewSection.classList.remove('hidden');
      renderUserReviewCard();
    }
    renderLeaderboard();
  }

  // =========================================================================
  // TOP BAR & HEADER UPDATES
  // =========================================================================

  function updateTopBar() {
    const userTeam = Game.getUserTeam();
    if (userTeam) {
      DOM.userTeamChip.classList.remove('hidden');
      DOM.userTeamLogo.textContent = userTeam.logo || '🏏';
      DOM.userTeamLogo.style.backgroundColor = userTeam.primaryColor || '#1e293b';
      DOM.userTeamName.textContent = userTeam.shortName || userTeam.name;

      const purseLeft = Math.max(0, (userTeam.purse || 120) - (userTeam.spent || 0));
      DOM.userPurseLeft.textContent = `₹${purseLeft.toFixed(2)} Cr`;
      DOM.userSquadCount.textContent = `${userTeam.players.length}/${userTeam.maxPlayers || 25}`;
      DOM.userOverseasCount.textContent = `${userTeam.overseas || 0}/${userTeam.maxOverseas || 8}`;
    }

    const state = Game.getState();
    if (state.isPaused) {
      DOM.pauseIcon.textContent = '▶️';
      DOM.pauseLabel.textContent = 'Resume';
      DOM.btnPauseResume.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/40');
      DOM.btnPauseResume.classList.remove('bg-amber-500/10', 'text-amber-400', 'border-amber-500/30');
    } else {
      DOM.pauseIcon.textContent = '⏸️';
      DOM.pauseLabel.textContent = 'Pause';
      DOM.btnPauseResume.classList.remove('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/40');
      DOM.btnPauseResume.classList.add('bg-amber-500/10', 'text-amber-400', 'border-amber-500/30');
    }
  }

  // =========================================================================
  // AUCTION ARENA RENDERING
  // =========================================================================

  function updateAuctionArena() {
    const player = Game.getCurrentPlayer();
    if (!player) return;

    const state = Game.getState();

    // Set & Progress
    DOM.currentSetName.textContent = Game.getSetName(player.set || 1);
    DOM.playerProgressIndex.textContent = (state.currentPlayerIndex + 1);
    DOM.playerProgressTotal.textContent = state.auctionPool.length;

    // Player Bio & Portrait
    DOM.playerName.textContent = player.name;
    DOM.playerSpeciality.textContent = player.speciality || 'Star Performer';
    DOM.playerOverallRating.textContent = player.rating || 75;

    DOM.playerCountryFlag.textContent = COUNTRY_FLAGS[player.country] || '🏏';
    DOM.playerCountryName.textContent = player.country || 'India';
    DOM.playerOverseasTag.textContent = player.overseas ? '✈️ Overseas Player' : '🇮🇳 Indian Player';
    DOM.playerOverseasTag.className = player.overseas
      ? 'absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-purple-950 border border-purple-700 text-purple-300 rounded-full px-3 py-0.5 text-[11px] font-bold shadow-md'
      : 'absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-950 border border-blue-700 text-blue-300 rounded-full px-3 py-0.5 text-[11px] font-bold shadow-md';

    DOM.playerRoleBadge.textContent = `${ROLE_THEMES[player.role]?.icon || '🏏'} ${player.role}`;
    DOM.playerBattingRating.textContent = player.battingRating || player.rating || 50;
    DOM.playerBowlingRating.textContent = player.bowlingRating || 30;
    DOM.playerFieldingRating.textContent = player.fieldingRating || 75;

    // Image with reliable error fallback & dataset
    DOM.playerPhoto.dataset.playerName = player.name;
    DOM.playerPhoto.dataset.playerRole = player.role || 'Batsman';
    DOM.playerPhoto.dataset.playerRating = player.rating || 80;
    DOM.playerPhoto.dataset.playerCountry = player.country || 'India';
    DOM.playerPhoto.dataset.playerInitials = player.initials || '';
    DOM.playerPhoto.setAttribute('referrerpolicy', 'no-referrer');
    DOM.playerPhoto.onerror = function() {
      handlePlayerImageError(this, player);
    };
    DOM.playerPhoto.src = getPlayerImage(player);

    // Dynamic Commentary for Active Player
    if (DOM.auctioneerCommentary && (!state.currentBidder || state.currentBid === 0)) {
      DOM.auctioneerCommentary.textContent = `"${player.name} (${player.role}, ${player.country || 'India'}) is up on the auction block! Base price is set at ₹${Number(player.basePrice || 0.20).toFixed(2)} Crore. Opening bids please!"`;
    }

    // Career Stats Ribbon tailored to player role
    const stats = getEnhancedPlayerStats(player);
    if (stats) {
      const role = player.role || 'Batsman';
      const lblStat1 = document.getElementById('lblStat1');
      const lblStat2 = document.getElementById('lblStat2');
      const lblStat3 = document.getElementById('lblStat3');
      const lblStat4 = document.getElementById('lblStat4');
      const lblStat5 = document.getElementById('lblStat5');
      const lblStat6 = document.getElementById('lblStat6');

      if (role === 'Bowler') {
        if (lblStat1) lblStat1.textContent = 'Matches';
        if (lblStat2) lblStat2.textContent = 'Wickets';
        if (lblStat3) lblStat3.textContent = 'Economy';
        if (lblStat4) lblStat4.textContent = 'Bowling Avg';
        if (lblStat5) lblStat5.textContent = 'Best Bowling';
        if (lblStat6) lblStat6.textContent = 'Runs Scored';

        DOM.statMatches.textContent = stats.matches || '--';
        DOM.statRuns.textContent = stats.wickets || 0;
        DOM.statSR.textContent = stats.economy || '--';
        DOM.statAvg.textContent = stats.bowlingAvg || '--';
        DOM.statMilestones.textContent = stats.bestBowling || `${Math.min(5, Math.floor((stats.wickets || 20) / 20) + 1)}/${Math.floor((stats.economy || 8) * 2.8)}`;
        DOM.statBowling.textContent = stats.runs || 0;
      } else if (role === 'All-Rounder') {
        if (lblStat1) lblStat1.textContent = 'Matches';
        if (lblStat2) lblStat2.textContent = 'Runs';
        if (lblStat3) lblStat3.textContent = 'Batting SR';
        if (lblStat4) lblStat4.textContent = 'Wickets';
        if (lblStat5) lblStat5.textContent = 'Economy';
        if (lblStat6) lblStat6.textContent = '50s / 100s';

        DOM.statMatches.textContent = stats.matches || '--';
        DOM.statRuns.textContent = stats.runs || 0;
        DOM.statSR.textContent = stats.strikeRate || '--';
        DOM.statAvg.textContent = stats.wickets || 0;
        DOM.statMilestones.textContent = stats.economy || '--';
        DOM.statBowling.textContent = `${stats.fifties || 0} / ${stats.hundreds || 0}`;
      } else if (role === 'Wicket-Keeper') {
        if (lblStat1) lblStat1.textContent = 'Matches';
        if (lblStat2) lblStat2.textContent = 'Runs';
        if (lblStat3) lblStat3.textContent = 'Strike Rate';
        if (lblStat4) lblStat4.textContent = 'Average';
        if (lblStat5) lblStat5.textContent = '50s / 100s';
        if (lblStat6) lblStat6.textContent = 'Dismissals';

        DOM.statMatches.textContent = stats.matches || '--';
        DOM.statRuns.textContent = stats.runs || 0;
        DOM.statSR.textContent = stats.strikeRate || '--';
        DOM.statAvg.textContent = stats.battingAvg || '--';
        DOM.statMilestones.textContent = `${stats.fifties || 0} / ${stats.hundreds || 0}`;
        DOM.statBowling.textContent = `${stats.catches || 0}c / ${stats.stumpings || 0}st`;
      } else { // Batsman
        if (lblStat1) lblStat1.textContent = 'Matches';
        if (lblStat2) lblStat2.textContent = 'Runs';
        if (lblStat3) lblStat3.textContent = 'Strike Rate';
        if (lblStat4) lblStat4.textContent = 'Average';
        if (lblStat5) lblStat5.textContent = '50s / 100s';
        if (lblStat6) lblStat6.textContent = 'High Score';

        DOM.statMatches.textContent = stats.matches || '--';
        DOM.statRuns.textContent = stats.runs || 0;
        DOM.statSR.textContent = stats.strikeRate || '--';
        DOM.statAvg.textContent = stats.battingAvg || '--';
        DOM.statMilestones.textContent = `${stats.fifties || 0} / ${stats.hundreds || 0}`;
        DOM.statBowling.textContent = stats.highScore || `${Math.min(130, Math.floor((stats.battingAvg || 30) * 2.8))}`;
      }

      DOM.playerFormBadge.textContent = `Form: ${stats.recentForm || 'A'}`;
      DOM.playerBestPosBadge.textContent = stats.bestPosition || (role === 'Bowler' ? 'Specialist Bowler' : 'Middle Order');
    }

    // Tactical Playing XI Impact Preview
    const userTeam = Game.getUserTeam();
    if (userTeam) {
      DOM.impactTeamName.textContent = userTeam.shortName || userTeam.name;
      const currentXI = RatingEngine.selectBestXI(userTeam.players, window.PLAYER_STATS);
      const hypotheticalXI = RatingEngine.selectBestXI([...userTeam.players, player], window.PLAYER_STATS);
      const ratingGain = +(hypotheticalXI.totalRating - currentXI.totalRating).toFixed(1);

      if (ratingGain > 0) {
        DOM.impactRatingDelta.textContent = `+${ratingGain} XI Rating Upgrade`;
        DOM.impactRatingDelta.className = 'text-emerald-400 font-bold';
        DOM.impactSlotFit.textContent = `Guaranteed Starter in Playing XI`;
      } else {
        DOM.impactRatingDelta.textContent = `Squad Depth / Reserve`;
        DOM.impactRatingDelta.className = 'text-amber-400 font-semibold';
        DOM.impactSlotFit.textContent = `Vital Tactical Backup Option`;
      }
    }

    // Bidding Controls Ribbon
    if (state.currentBidder && state.currentBid > 0) {
      DOM.currentBidDisplay.textContent = `₹ ${Number(state.currentBid).toFixed(2)} Cr`;
    } else {
      DOM.currentBidDisplay.textContent = `₹ 0.00 Cr (No Bids)`;
    }
    DOM.basePriceDisplay.textContent = `₹ ${Number(player.basePrice || 0.20).toFixed(2)} Cr`;

    const inc = Game.getBidIncrement(state.currentBid || player.basePrice);
    DOM.nextIncrementDisplay.textContent = `+₹ ${inc.toFixed(2)} Cr`;

    const nextBid = Game.getNextBidAmount();
    DOM.userNextBidAmount.textContent = `₹ ${nextBid.toFixed(2)} Cr`;

    // Leader Franchise
    if (state.currentBidder && state.currentBid > 0) {
      const leaderTeam = Game.getTeam(state.currentBidder);
      if (leaderTeam) {
        DOM.leaderLogo.textContent = leaderTeam.logo || '🏏';
        DOM.leaderLogo.style.backgroundColor = leaderTeam.primaryColor || '#1e293b';
        DOM.leaderName.textContent = leaderTeam.name;
      }
    } else {
      DOM.leaderLogo.textContent = '⚪';
      DOM.leaderLogo.style.backgroundColor = '#1e293b';
      DOM.leaderName.textContent = `No Bids Yet (Opening: ₹${Number(player.basePrice || 0.20).toFixed(2)} Cr)`;
    }

    renderMultiplayerPaddles();

    // Check if user can bid & prevent self-bidding
    const isUserLeader = userTeam && state.currentBidder === userTeam.id;
    const userBidStatus = Game.canUserBid();

    if (isUserLeader) {
      // You hold highest bid: cannot bid against yourself!
      DOM.btnUserBid.disabled = true;
      DOM.btnUserBid.classList.add('opacity-75', 'cursor-not-allowed');
      DOM.btnUserBid.innerHTML = `<span>✋ YOU HOLD HIGHEST BID</span><span id="userNextBidAmount" class="font-sans text-2xl font-extrabold">₹ ${Number(state.currentBid).toFixed(2)} Cr</span>`;
      if (DOM.btnPowerJump) {
        DOM.btnPowerJump.disabled = true;
        DOM.btnPowerJump.classList.add('opacity-50', 'cursor-not-allowed');
      }
    } else if (userBidStatus.canBid) {
      DOM.btnUserBid.disabled = false;
      DOM.btnUserBid.classList.remove('opacity-50', 'opacity-75', 'cursor-not-allowed');
      DOM.btnUserBid.innerHTML = `<span>✋ RAISE PADDLE: BID</span><span id="userNextBidAmount" class="font-sans text-2xl font-extrabold">₹ ${nextBid.toFixed(2)} Cr</span>`;
      if (DOM.btnPowerJump) {
        DOM.btnPowerJump.disabled = false;
        DOM.btnPowerJump.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    } else {
      DOM.btnUserBid.disabled = true;
      DOM.btnUserBid.classList.add('opacity-50', 'cursor-not-allowed');
      DOM.btnUserBid.innerHTML = `<span>✋ BID UNAVAILABLE</span><span id="userNextBidAmount" class="font-sans text-2xl font-extrabold">₹ ${nextBid.toFixed(2)} Cr</span>`;
      if (DOM.btnPowerJump) {
        DOM.btnPowerJump.disabled = true;
        DOM.btnPowerJump.classList.add('opacity-50', 'cursor-not-allowed');
      }
    }
  }

  // =========================================================================
  // TIMER & GAVEL ANIMATION ENGINE
  // =========================================================================

  function updateTimerUI(timeLeft) {
    DOM.timerSeconds.textContent = timeLeft;

    // Radial Progress Calculation (Perimeter = 2 * PI * 42 ≈ 264)
    const maxTime = 15;
    const progressFraction = Math.max(0, Math.min(1, timeLeft / maxTime));
    const offset = 264 - (264 * progressFraction);
    DOM.timerProgressRing.style.strokeDashoffset = offset;

    // Gavel Stages & Tension Color
    if (timeLeft > 7) {
      DOM.timerProgressRing.style.stroke = '#22c55e'; // Green
      DOM.auctioneerCallout.textContent = 'Bidding Active';
      DOM.auctioneerCallout.className = 'font-cricket text-lg font-bold uppercase tracking-wider text-emerald-400';
      DOM.gavelGraphic.className = 'gavel';
    } else if (timeLeft > 3) {
      DOM.timerProgressRing.style.stroke = '#f59e0b'; // Amber
      DOM.auctioneerCallout.textContent = 'Going ONCE!';
      DOM.auctioneerCallout.className = 'font-cricket text-lg font-bold uppercase tracking-wider text-amber-400';
      DOM.gavelGraphic.className = 'gavel stage-1';
      AuctionAudio.playCountdownTick(false);
    } else {
      DOM.timerProgressRing.style.stroke = '#ef4444'; // Red
      DOM.auctioneerCallout.textContent = 'Going TWICE! Fair Warning...';
      DOM.auctioneerCallout.className = 'font-cricket text-lg font-bold uppercase tracking-wider text-red-500 animate-pulse';
      DOM.gavelGraphic.className = 'gavel stage-2';
      AuctionAudio.playCountdownTick(true);
    }
  }

  // =========================================================================
  // SOUND & ANIMATION CELEBRATIONS
  // =========================================================================

  function triggerBidEffects(teamId) {
    AuctionAudio.playBidPaddle();

    // Pulse Active Card Glow
    DOM.activePlayerCard.classList.remove('glow-active-bid');
    void DOM.activePlayerCard.offsetWidth; // Trigger reflow
    DOM.activePlayerCard.classList.add('glow-active-bid');

    // Reset Gavel to ready position
    DOM.gavelGraphic.className = 'gavel';
  }

  function triggerSoldCelebration(player, team, amount) {
    // Gavel Slam
    DOM.gavelGraphic.className = 'gavel strike';
    AuctionAudio.playSoldFanfare();

    // SOLD Stamp
    DOM.stampBadge.textContent = `SOLD TO ${team.shortName || team.name}!`;
    DOM.stampBadge.className = 'border-4 border-amber-400 bg-amber-500/20 text-amber-400 px-8 py-3 rounded-2xl text-3xl font-cricket font-black tracking-widest uppercase stamp-sold shadow-2xl';
    DOM.stampOverlay.classList.remove('hidden');

    // Confetti Fireworks Burst
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: [team.primaryColor || '#F59E0B', '#FBBF24', '#3B82F6', '#10B981']
      });
    }

    // Commentary call
    DOM.auctioneerCommentary.textContent = `Hammer comes down! ${player.name} is SOLD to ${team.name} for a handsome sum of ₹${Number(amount || 0).toFixed(2)} Crore! Sensational addition!`;

    setTimeout(() => {
      DOM.stampOverlay.classList.add('hidden');
    }, 2400);
  }

  function triggerUnsoldEffect(player) {
    DOM.gavelGraphic.className = 'gavel strike';
    AuctionAudio.playUnsoldDrop();

    DOM.stampBadge.textContent = 'UNSOLD';
    DOM.stampBadge.className = 'border-4 border-red-500 bg-red-950/80 text-red-500 px-8 py-3 rounded-2xl text-4xl font-cricket font-black tracking-widest uppercase stamp-sold shadow-2xl';
    DOM.stampOverlay.classList.remove('hidden');

    DOM.auctioneerCommentary.textContent = `No bids forthcoming. ${player.name} passes through UNSOLD for now, returning in the accelerated round later.`;

    setTimeout(() => {
      DOM.stampOverlay.classList.add('hidden');
    }, 2200);
  }

  function updateBiddingTicker(team, amount, player) {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 transition';
    item.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded flex items-center justify-center text-xs" style="background-color: ${team.primaryColor || '#1e293b'}">${team.logo || '🏏'}</span>
        <span class="font-bold text-white">${team.shortName || team.name}</span>
      </div>
      <span class="font-cricket font-bold text-amber-400 text-sm">₹${Number(amount || 0).toFixed(2)} Cr</span>
    `;

    DOM.biddingLogList.prepend(item);
    DOM.logCount.textContent = `${DOM.biddingLogList.children.length} bids`;

    // Dynamic Auctioneer Speech
    DOM.auctioneerCommentary.textContent = `"${team.name} raises the paddle to ₹${Number(amount || 0).toFixed(2)} Cr! Any counters from other tables?"`;
  }

  // =========================================================================
  // SCOUT MODAL: PLAYING 11 IMPACT & TEAM NEEDS (PAUSE FIX)
  // =========================================================================

  function openScoutModal() {
    const player = Game.getCurrentPlayer();
    if (!player) return;

    // Render Player Bio
    DOM.modalPlayerBio.innerHTML = `
      <div class="w-16 h-20 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
        ${renderPlayerAvatarImg(player, 'w-full h-full object-cover')}
      </div>
      <div class="flex-1 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-white text-base">${player.name}</h4>
          <span class="px-2 py-0.5 rounded font-cricket font-bold bg-amber-500 text-slate-950 text-sm">OVR ${player.rating}</span>
        </div>
        <p class="text-amber-400">${player.speciality || player.role}</p>
        <p class="text-slate-400 mt-1">Country: ${player.country} | Role: ${player.role} | Base: ₹${player.basePrice} Cr</p>
      </div>
    `;

    // Render Needs for all 10 Franchises
    const state = Game.getState();
    const playerStatsDB = window.PLAYER_STATS || {};
    DOM.modalTeamNeedsList.innerHTML = '';

    state.teams.forEach(team => {
      const bestXI = RatingEngine.selectBestXI(team.players, playerStatsDB);
      const hypotheticalXI = RatingEngine.selectBestXI([...team.players, player], playerStatsDB);
      const delta = +(hypotheticalXI.totalRating - bestXI.totalRating).toFixed(1);
      const decision = Game.aiDecision(team, player);

      const item = document.createElement('div');
      item.className = 'p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs';
      item.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm" style="background-color: ${team.primaryColor || '#1e293b'}">${team.logo || '🏏'}</span>
          <div>
            <div class="flex items-center gap-2">
              <strong class="text-white">${team.name}</strong>
              <span class="text-[10px] text-slate-400">(Purse: ₹${Math.max(0, (team.purse||120)-team.spent).toFixed(1)} Cr)</span>
            </div>
            <span class="text-slate-400 text-[11px]">
              ${delta > 0 ? `<span class="text-emerald-400 font-semibold">+${delta} Playing XI Upgrade</span>` : `<span class="text-slate-500">Bench Reserve / Depth</span>`}
            </span>
          </div>
        </div>
        <div class="text-right">
          <span class="px-2 py-1 rounded text-[10px] font-bold ${decision.shouldBid ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'}">
            ${decision.shouldBid ? `ACTIVE INTEREST (Up to ₹${decision.maxBid} Cr)` : `PASS: ${decision.reason || 'Saturated'}`}
          </span>
        </div>
      `;
      DOM.modalTeamNeedsList.appendChild(item);
    });

    DOM.scoutModal.classList.remove('hidden');
  }

  // =========================================================================
  // TAB 1: MANAGER & TEAM REGISTRATION VIEW
  // =========================================================================
  let managerPageSelectedTeam = null;

  function renderManagerPageView() {
    // Current user name
    const currentName = localStorage.getItem('ipl_user_name') || localStorage.getItem('ipl_manager_name') || (StorageEngine && StorageEngine.currentUser ? StorageEngine.currentUser.userName : '') || 'Manager';
    if (DOM.inputManagerPageName && (!DOM.inputManagerPageName.value || DOM.inputManagerPageName.value === 'Manager')) {
      DOM.inputManagerPageName.value = currentName;
    }

    // Current user team
    const currentTeamId = managerPageSelectedTeam || AppState.userTeamId || (typeof Game !== 'undefined' && Game.getState ? Game.getState().userTeamId : 'RCB') || 'RCB';
    managerPageSelectedTeam = currentTeamId;

    const allTeams = (typeof TEAMS !== 'undefined' ? TEAMS : (typeof Game !== 'undefined' && Game.getTeams ? Game.getTeams() : []));

    // Render 10 Franchise Selection Cards
    if (DOM.managerPageTeamsGrid) {
      DOM.managerPageTeamsGrid.innerHTML = '';
      allTeams.forEach(t => {
        const isSelected = (t.id === managerPageSelectedTeam);
        const card = document.createElement('div');
        card.className = `p-4 rounded-2xl border-2 transition relative flex flex-col justify-between cursor-pointer ${
          isSelected
            ? 'bg-amber-950/60 border-amber-400 shadow-xl ring-2 ring-amber-400/40 scale-102'
            : 'bg-slate-950/90 border-slate-800 hover:border-slate-600 hover:bg-slate-900 shadow-md'
        }`;
        card.innerHTML = `
          <div class="flex items-start justify-between">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold border" style="background-color: ${t.primaryColor}22; border-color: ${t.primaryColor}88;">
              ${t.logo || '🏏'}
            </div>
            ${isSelected ? '<span class="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">SELECTED</span>' : '<span class="px-2 py-0.5 rounded text-[9px] font-bold text-slate-500 bg-slate-900">SELECT</span>'}
          </div>
          <div class="mt-3">
            <h4 class="font-extrabold text-sm text-white">${t.shortName || t.id}</h4>
            <p class="text-[11px] text-slate-400 truncate">${t.name}</p>
          </div>
          <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span class="text-slate-400">Purse</span>
            <span class="font-bold text-amber-300">₹${(t.purse || 120).toFixed(2)} Cr</span>
          </div>
        `;
        card.onclick = () => {
          managerPageSelectedTeam = t.id;
          updateManagerPageFooter(t);
          renderManagerPageView();
          try { AuctionAudio.playBidPaddle(); } catch(e) {}
        };
        DOM.managerPageTeamsGrid.appendChild(card);
      });
    }

    // Update bottom sticky bar preview
    const selectedTeamObj = allTeams.find(t => t.id === managerPageSelectedTeam) || allTeams[0];
    updateManagerPageFooter(selectedTeamObj);
  }

  function updateManagerPageFooter(team) {
    if (!team) return;
    if (DOM.managerPageSelectedLogo) {
      DOM.managerPageSelectedLogo.textContent = team.logo || '👑';
      DOM.managerPageSelectedLogo.style.backgroundColor = team.primaryColor || '#991b1b';
      DOM.managerPageSelectedLogo.style.borderColor = team.secondaryColor || '#dc2626';
    }
    if (DOM.managerPageSelectedTeamName) {
      DOM.managerPageSelectedTeamName.textContent = `${team.name} (${team.shortName || team.id})`;
    }
    if (DOM.managerPageSelectedPurse) {
      DOM.managerPageSelectedPurse.textContent = `Purse: ₹${(team.purse || 120).toFixed(2)} Cr`;
    }
  }

  function setupManagerPageEventListeners() {
    // 1. Button: Save Name Only
    if (DOM.btnSaveManagerPageNameOnly) {
      DOM.btnSaveManagerPageNameOnly.onclick = async () => {
        const inp = DOM.inputManagerPageName || document.getElementById('inputManagerPageName');
        const btn = DOM.btnSaveManagerPageNameOnly;
        const newName = (inp ? inp.value.trim() : '');
        if (!newName) {
          alert('Please enter a valid manager name.');
          return;
        }

        const oldName = localStorage.getItem('ipl_user_name') || (StorageEngine?.currentUser?.userName) || '';

        // Save to localStorage
        localStorage.setItem('ipl_user_name', newName);
        localStorage.setItem('ipl_manager_name', newName);

        // Update StorageEngine
        if (typeof StorageEngine !== 'undefined') {
          if (StorageEngine.currentUser) {
            StorageEngine.currentUser.userName = newName;
            if (typeof StorageEngine.persistLocalUser === 'function') {
              StorageEngine.persistLocalUser(StorageEngine.currentUser);
            }
          }
          if (typeof StorageEngine.updateUserName === 'function') {
            await StorageEngine.updateUserName(newName);
          }
        }

        // Update active CurrentRoom if present
        if (window.CurrentRoom) {
          const myUserId = StorageEngine?.currentUser?.userId;
          if (window.CurrentRoom.hostId === myUserId || !window.CurrentRoom.hostId || (oldName && window.CurrentRoom.hostName === oldName)) {
            window.CurrentRoom.hostName = newName;
          }
          if (window.CurrentRoom.players) {
            for (const t of Object.keys(window.CurrentRoom.players)) {
              const p = window.CurrentRoom.players[t];
              if (p && (p.userId === myUserId || p.isHost || (oldName && p.userName === oldName) || t === AppState.userTeamId)) {
                p.userName = newName;
              }
            }
          }
          if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.saveRoom === 'function') {
            StorageEngine.saveRoom(window.CurrentRoom);
          }
          if (typeof renderLobbyTeamsGrid === 'function') renderLobbyTeamsGrid(window.CurrentRoom);
          if (typeof renderLobbyPlayersList === 'function') renderLobbyPlayersList(window.CurrentRoom);
        }

        // Update all UI displays
        const curUser = (StorageEngine && StorageEngine.currentUser) || { userName: newName };
        curUser.userName = newName;
        updateUserDisplay(curUser);
        const headerName = document.getElementById('headerUserName');
        if (headerName) headerName.textContent = newName;
        const headerAvatar = document.getElementById('userAvatarLetter');
        if (headerAvatar) headerAvatar.textContent = newName.charAt(0).toUpperCase();

        if (typeof updateTopBar === 'function') updateTopBar();

        // Sound & Visual Button Feedback
        try { AuctionAudio.playBidPaddle(); } catch(e) {}
        if (btn) {
          const oldHtml = btn.innerHTML;
          btn.innerHTML = '<span>✅</span> <span>Saved!</span>';
          btn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-500');
          btn.classList.remove('bg-slate-800', 'text-amber-300');
          setTimeout(() => {
            btn.innerHTML = oldHtml;
            btn.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-500');
            btn.classList.add('bg-slate-800', 'text-amber-300');
          }, 2000);
        }

        alert(`✅ Manager name updated to "${newName}"!`);
      };
    }

    // Helper: Save full setup (Name + Franchise)
    const saveManagerFullSetup = async () => {
      const inp = DOM.inputManagerPageName || document.getElementById('inputManagerPageName');
      const newName = (inp ? inp.value.trim() : '') || localStorage.getItem('ipl_user_name') || 'Manager';
      if (newName) {
        localStorage.setItem('ipl_user_name', newName);
        localStorage.setItem('ipl_manager_name', newName);
        if (typeof StorageEngine !== 'undefined') {
          if (StorageEngine.currentUser) {
            StorageEngine.currentUser.userName = newName;
          }
          if (typeof StorageEngine.updateUserName === 'function') {
            await StorageEngine.updateUserName(newName);
          }
        }
      }

      const chosenTeam = managerPageSelectedTeam || AppState.userTeamId || 'MI';
      if (typeof executeLiveTeamChange === 'function') {
        executeLiveTeamChange(chosenTeam);
      } else {
        AppState.userTeamId = chosenTeam;
        if (typeof Game !== 'undefined' && Game.changeUserTeam) Game.changeUserTeam(chosenTeam);
        if (typeof StorageEngine !== 'undefined' && StorageEngine.updateUserTeam) StorageEngine.updateUserTeam(chosenTeam);
      }

      const curUser = (StorageEngine && StorageEngine.currentUser) || { userName: newName };
      curUser.userName = newName;
      updateUserDisplay(curUser);
      if (typeof updateTopBar === 'function') updateTopBar();
      renderManagerPageView();
    };

    // 2. Button: Save Manager Setup All
    if (DOM.btnSaveManagerSetupAll) {
      DOM.btnSaveManagerSetupAll.onclick = async () => {
        await saveManagerFullSetup();
        try { AuctionAudio.playSoldFanfare(); } catch(e) {}
        const btn = DOM.btnSaveManagerSetupAll;
        const oldHtml = btn.innerHTML;
        btn.innerHTML = '<span>✅ Setup Saved!</span>';
        btn.classList.add('bg-emerald-600', 'text-white');
        setTimeout(() => {
          btn.innerHTML = oldHtml;
          btn.classList.remove('bg-emerald-600', 'text-white');
        }, 2000);
      };
    }

    // 3. Button: Save & Enter Auction
    if (DOM.btnSaveAndEnterAuction) {
      DOM.btnSaveAndEnterAuction.onclick = async () => {
        await saveManagerFullSetup();
        switchTab('auction');
      };
    }
  }

  // =========================================================================
  // TAB 2: PLAYING XI & BACKUPS VIEW
  // =========================================================================

  function renderPlaying11View() {
    // Use interactive player pickup builder instead of auto-assign
    renderPlaying11ViewInteractive();
  }

  // TAB 3: ALL 10 FRANCHISES VIEW
  // =========================================================================

  function renderFranchisesView() {
    const state = Game.getState();
    DOM.franchisesGrid.innerHTML = '';

    state.teams.forEach(team => {
      const spent = team.spent || 0;
      const purseLeft = Math.max(0, (team.purse || 120) - spent);
      const isUser = team.id === state.userTeamId;

      const card = document.createElement('div');
      card.className = `p-5 rounded-2xl bg-slate-900 border transition shadow-lg cursor-pointer hover:border-amber-400/80 ${isUser ? 'border-amber-400 shadow-amber-500/10' : 'border-slate-800'}`;
      card.onclick = () => openTeamRosterModal(team.id);

      card.innerHTML = `
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-md" style="background-color: ${team.primaryColor || '#1e293b'}">
              ${team.logo || '🏏'}
            </div>
            <div>
              <h4 class="font-bold text-white text-base leading-tight">${team.name}</h4>
              <span class="text-xs text-slate-400">${isUser ? '⭐ Your Franchise' : 'AI Managed'}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs uppercase text-slate-500 block font-semibold">Remaining</span>
            <span class="font-cricket font-bold text-amber-400 text-lg">₹${purseLeft.toFixed(2)} Cr</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 my-3 text-xs text-center">
          <div class="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span class="text-slate-400 block text-[10px] uppercase">Players</span>
            <strong class="text-white">${team.players.length} / ${team.maxPlayers || 25}</strong>
          </div>
          <div class="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span class="text-slate-400 block text-[10px] uppercase">Overseas</span>
            <strong class="text-purple-400">${team.overseas || 0} / ${team.maxOverseas || 8}</strong>
          </div>
        </div>

        <div class="space-y-1.5 pt-2 max-h-48 overflow-y-auto pr-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Squad Roster:</span>
          ${team.players.length === 0 ? '<div class="text-xs text-slate-600 italic py-2">No players acquired yet.</div>' : ''}
          ${team.players.map(p => `
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
              <div class="flex items-center gap-1.5 truncate">
                ${p.retained ? '<span class="text-[10px] text-amber-400 font-bold" title="Retained Player">🔒</span>' : ''}
                <span class="text-white font-medium truncate">${p.name}</span>
                ${p.overseas ? '<span class="text-[10px]">✈️</span>' : ''}
              </div>
              <span class="text-slate-400 font-cricket font-bold">₹${Number(p.soldPrice || p.price || 0).toFixed(2)} Cr</span>
            </div>
          `).join('')}
        </div>
      `;

      DOM.franchisesGrid.appendChild(card);
    });
  }

  // =========================================================================
  // TAB 4: PLAYER CATALOG VIEW
  // =========================================================================

  function renderCatalogGrid() {
    const rawPlayers = (typeof PLAYERS !== 'undefined') ? PLAYERS : [];
    const search = (DOM.catalogSearchInput.value || '').toLowerCase();
    const setVal = DOM.catalogSetFilter.value;
    const roleVal = DOM.catalogRoleFilter.value;
    const overseasVal = DOM.catalogOverseasFilter.value;

    const filtered = rawPlayers.filter(p => {
      if (search && !p.name.toLowerCase().includes(search)) return false;
      if (setVal !== 'ALL' && String(p.set) !== String(setVal)) return false;
      if (roleVal !== 'ALL' && p.role !== roleVal) return false;
      if (overseasVal === 'INDIAN' && p.overseas) return false;
      if (overseasVal === 'OVERSEAS' && !p.overseas) return false;
      return true;
    });

    DOM.catalogPlayersGrid.innerHTML = '';

    filtered.slice(0, 48).forEach(player => {
      const card = document.createElement('div');
      card.className = 'p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center gap-3 text-xs';

      card.innerHTML = `
        <div class="w-12 h-14 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
          ${renderPlayerAvatarImg(player, 'w-full h-full object-cover')}
        </div>
        <div class="flex-1 truncate">
          <div class="flex items-center justify-between">
            <h5 class="font-bold text-white truncate">${player.name}</h5>
            <span class="font-cricket font-bold text-amber-400">${player.rating}</span>
          </div>
          <p class="text-slate-400 text-[11px]">${player.role} (${player.country})</p>
          <div class="flex items-center justify-between mt-1 text-[11px]">
            <span class="text-slate-500">Base: ₹${player.basePrice} Cr</span>
            ${player.overseas ? '<span class="text-purple-400 font-bold">✈️ Overseas</span>' : '<span class="text-blue-400 font-bold">🇮🇳 Domestic</span>'}
          </div>
        </div>
      `;

      DOM.catalogPlayersGrid.appendChild(card);
    });
  }

  // =========================================================================
  // TAB 5: RATINGS & POST-AUCTION RANKINGS
  // =========================================================================

  function renderRatingsView() {
    renderLeaderboard();
    if (AppState.ratingMode === 'user') {
      renderUserReviewCard();
    }
    renderSeasonSimulation();
  }

  function renderLeaderboard() {
    const state = Game.getState();
    const playerStatsDB = window.PLAYER_STATS || {};
    const rankedResults = RatingEngine.rankTeams(state.teams, playerStatsDB, state.auctionMode || 'MEGA');

    // Mini Auction 40/60 Banner visibility
    if (state.auctionMode === 'MINI') {
      DOM.miniAuctionFormulaBanner.classList.remove('hidden');
      DOM.ratingFormulaDescription.textContent = 'Mini Auction Mode Active: 40% Past Team Core Data + 60% (Strongest Playing XI & Spot Backups)';
    } else {
      DOM.miniAuctionFormulaBanner.classList.add('hidden');
      DOM.ratingFormulaDescription.textContent = 'Mega Auction Mode: Complete Playing 11 Strength, Bench Depth, Balance, and Value-for-Money';
    }

    DOM.leaderboardTableBody.innerHTML = '';

    rankedResults.forEach((item, idx) => {
      const team = item.team;
      const rank = idx + 1;
      const rankBadge = rank === 1 ? '🥇 1st' : rank === 2 ? '🥈 2nd' : rank === 3 ? '🥉 3rd' : `#${rank}`;

      // In User Rating mode, allow score override
      const userRating = AppState.userTeamRatings[team.id];
      const displayScore = (AppState.ratingMode === 'user' && userRating?.score) ? userRating.score : item.overallScore;
      const displayGrade = (AppState.ratingMode === 'user' && userRating?.grade) ? userRating.grade : item.grade;

      const row = document.createElement('tr');
      row.className = 'hover:bg-slate-950/40 transition';

      row.innerHTML = `
        <td class="py-3 px-3 font-cricket font-bold text-sm ${rank === 1 ? 'text-amber-400' : 'text-slate-300'}">${rankBadge}</td>
        <td class="py-3 px-3">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded flex items-center justify-center text-xs" style="background-color: ${team.primaryColor || '#1e293b'}">${team.logo || '🏏'}</span>
            <strong class="text-white">${team.name}</strong>
          </div>
        </td>
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded font-bold text-xs ${displayScore >= 80 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300'}">
            ${displayScore}/100 (${displayGrade})
          </span>
        </td>
        <td class="py-3 px-3 font-bold text-white">${item.bestXIRating || item.squadRating?.playingXI?.score || 75}/100</td>
        <td class="py-3 px-3 text-slate-300">${item.squadRating?.squadDepth?.score || 70}/100</td>
        <td class="py-3 px-3">
          <span class="text-white font-bold">₹${item.moneySpent.toFixed(1)} Cr</span>
          <span class="text-slate-500 text-[10px] block">Left: ₹${item.moneyRemaining.toFixed(1)} Cr</span>
        </td>
        <td class="py-3 px-3 text-amber-400 font-medium">${item.mvpPurchase?.player || 'N/A'}</td>
        <td class="py-3 px-3">
          <button class="btn-inspect-team px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold" data-team="${team.id}">
            Inspect
          </button>
        </td>
      `;

      DOM.leaderboardTableBody.appendChild(row);
    });

    // Bind inspect buttons
    document.querySelectorAll('.btn-inspect-team').forEach(btn => {
      btn.addEventListener('click', () => {
        const teamId = btn.dataset.team;
        AppState.selectedPlaying11TeamId = teamId;
        DOM.selectPlaying11Team.value = teamId;
        switchTab('playing11');
      });
    });
  }

  function renderUserReviewCard() {
    const team = Game.getTeam(AppState.selectedReviewTeamId);
    if (!team) return;

    if (!AppState.userTeamRatings[team.id]) {
      AppState.userTeamRatings[team.id] = {
        score: 85,
        grade: 'A',
        notes: '',
        playerTags: {}
      };
    }
    const userRating = AppState.userTeamRatings[team.id];

    DOM.userReviewTeamCard.innerHTML = `
      <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
        
        <!-- Team Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold" style="background-color: ${team.primaryColor}">${team.logo || '🏏'}</span>
            <div>
              <h4 class="font-bold text-white text-base">${team.name}</h4>
              <p class="text-xs text-slate-400">${team.players.length} Total Players Acquired | Spent: ₹${team.spent.toFixed(2)} Cr</p>
            </div>
          </div>

          <!-- User Score Adjustment Controls -->
          <div class="flex items-center gap-3">
            <div>
              <label class="text-[10px] text-slate-400 uppercase font-semibold block">Your Rating (0-100)</label>
              <input type="number" min="0" max="100" value="${userRating.score}" class="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-amber-400 text-sm" id="inputUserTeamScore">
            </div>
            <div>
              <label class="text-[10px] text-slate-400 uppercase font-semibold block">Grade</label>
              <select class="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs font-bold" id="selectUserTeamGrade">
                <option value="A+" ${userRating.grade === 'A+' ? 'selected' : ''}>A+</option>
                <option value="A" ${userRating.grade === 'A' ? 'selected' : ''}>A</option>
                <option value="B+" ${userRating.grade === 'B+' ? 'selected' : ''}>B+</option>
                <option value="B" ${userRating.grade === 'B' ? 'selected' : ''}>B</option>
                <option value="C" ${userRating.grade === 'C' ? 'selected' : ''}>C</option>
                <option value="D" ${userRating.grade === 'D' ? 'selected' : ''}>D</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Purchase List with User Tagging -->
        <div class="space-y-2">
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-400">Player Purchases: Tag Each Buy</h5>
          ${team.players.length === 0 ? '<div class="text-xs text-slate-500 italic py-2">No purchases yet.</div>' : ''}
          <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
            ${team.players.map(p => {
              const currentTag = userRating.playerTags[p.name] || 'Fair';
              return `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs gap-2">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                      ${renderPlayerAvatarImg(p, 'w-full h-full object-cover')}
                    </div>
                    <div>
                      <strong class="text-white">${p.name}</strong>
                      <span class="text-slate-400 block text-[11px]">${p.role} | Bought for ₹${Number(p.soldPrice || p.price || 0).toFixed(2)} Cr</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <button class="btn-player-tag px-2 py-1 rounded text-[10px] font-bold ${currentTag === 'Steal' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}" data-player="${p.name}" data-tag="Steal">🌟 Steal</button>
                    <button class="btn-player-tag px-2 py-1 rounded text-[10px] font-bold ${currentTag === 'Fair' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}" data-player="${p.name}" data-tag="Fair">👍 Fair</button>
                    <button class="btn-player-tag px-2 py-1 rounded text-[10px] font-bold ${currentTag === 'Overpaid' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}" data-player="${p.name}" data-tag="Overpaid">💸 Overpaid</button>
                    <button class="btn-player-tag px-2 py-1 rounded text-[10px] font-bold ${currentTag === 'Flop' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}" data-player="${p.name}" data-tag="Flop">❌ Flop Risk</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Notes / Verdict -->
        <div>
          <label class="text-xs font-bold text-slate-400 block mb-1">Your Expert Verdict / Notes:</label>
          <textarea id="txtUserReviewNotes" placeholder="Write your assessment of this squad's tournament prospects..." class="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 h-20">${userRating.notes || ''}</textarea>
        </div>

      </div>
    `;

    // Bind User Review Inputs
    const inputScore = document.getElementById('inputUserTeamScore');
    const selectGrade = document.getElementById('selectUserTeamGrade');
    const txtNotes = document.getElementById('txtUserReviewNotes');

    if (inputScore) {
      inputScore.addEventListener('change', () => {
        userRating.score = parseInt(inputScore.value, 10);
        renderLeaderboard();
      });
    }
    if (selectGrade) {
      selectGrade.addEventListener('change', () => {
        userRating.grade = selectGrade.value;
        renderLeaderboard();
      });
    }
    if (txtNotes) {
      txtNotes.addEventListener('input', () => {
        userRating.notes = txtNotes.value;
      });
    }

    // Bind Player Tags
    document.querySelectorAll('.btn-player-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        const playerName = btn.dataset.player;
        const tag = btn.dataset.tag;
        userRating.playerTags[playerName] = tag;
        renderUserReviewCard();
      });
    });
  }

  // =========================================================================
  // DROPDOWNS & HELPERS
  // =========================================================================

  // =========================================================================
  // USER PROFILE, RELOGIN & MULTIPLAYER IMPLEMENTATIONS
  // =========================================================================

  async function initUserSession() {
    let user = StorageEngine.getCurrentUser();
    if (!user) {
      const stored = localStorage.getItem('ipl_user_name') || localStorage.getItem('ipl_manager_name');
      if (stored && stored.trim() && stored.trim().toLowerCase() !== 'manager') {
        const res = await StorageEngine.loginUser(stored.trim(), AppState.userTeamId || 'RCB');
        user = res.user;
      }
    }
    if (user) {
      updateUserDisplay(user);

      // If user has past ratings, load them
      if (user && user.pastRatings) {
        Object.assign(AppState.userTeamRatings, user.pastRatings);
      }
    }
  }

  function updateUserDisplay(user) {
    if (!user) return;
    const name = user.userName || 'Manager';
    const firstLetter = name.charAt(0).toUpperCase() || 'M';

    if (DOM.headerUserName) DOM.headerUserName.textContent = name;
    const directHeader = document.getElementById('headerUserName');
    if (directHeader) directHeader.textContent = name;

    if (DOM.userAvatarLetter) DOM.userAvatarLetter.textContent = firstLetter;
    const directAvatar = document.getElementById('userAvatarLetter');
    if (directAvatar) directAvatar.textContent = firstLetter;

    if (DOM.modalUserName) DOM.modalUserName.textContent = name;
    if (DOM.modalUserAvatar) DOM.modalUserAvatar.textContent = firstLetter;
    if (DOM.inputEditUserName) DOM.inputEditUserName.value = name;
    if (DOM.inputManagerPageName) DOM.inputManagerPageName.value = name;
  }

  async function handleRename() {
    const newName = DOM.inputEditUserName ? DOM.inputEditUserName.value.trim() : '';
    if (!newName) return;
    const res = await StorageEngine.updateUserName(newName);
    if (res.success) {
      localStorage.setItem('ipl_user_name', newName);
      localStorage.setItem('ipl_manager_name', newName);
      updateUserDisplay(res.user);
      if (window.CurrentRoom) {
        if (typeof renderLobbyTeamsGrid === 'function') renderLobbyTeamsGrid(window.CurrentRoom);
        if (typeof renderLobbyPlayersList === 'function') renderLobbyPlayersList(window.CurrentRoom);
      }
      AuctionAudio.playBidPaddle();
      alert(`Name successfully updated to "${newName}"!`);
      renderLeaderboard();
      renderMultiplayerPaddles();
    }
  }

  async function handleRelogin() {
    const name = DOM.inputReloginName ? DOM.inputReloginName.value.trim() : '';
    if (!name) return;
    const res = await StorageEngine.loginUser(name);
    if (res.success) {
      updateUserDisplay(res.user);
      if (res.user.pastRatings) {
        Object.assign(AppState.userTeamRatings, res.user.pastRatings);
      }
      AuctionAudio.playSoldFanfare();
      alert(`Welcome back, ${res.user.userName}! Your past bid history (${(res.user.pastBids||[]).length} bids), past squad details, and custom ratings have been loaded from the server.`);
      openUserProfileModal();
      renderLeaderboard();
      updateTopBar();
    }
  }

  async function openUserProfileModal() {
    if (!DOM.userProfileModal) return;
    const user = StorageEngine.getCurrentUser();
    if (user) updateUserDisplay(user);

    // Update connection badge
    if (DOM.serverSyncBadge) {
      DOM.serverSyncBadge.textContent = StorageEngine.isServerConnected ? '🟢 Connected to Secure Server' : '🟡 Local Storage Active';
      if (DOM.serverSyncBadge) DOM.serverSyncBadge.className = StorageEngine.isServerConnected
        ? 'text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800'
        : 'text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-950 text-amber-300 border border-amber-800';
    }

    // Render Past Bids
    const pastBids = (user && user.pastBids) ? user.pastBids : [];
    if (DOM.pastBidsCountBadge) DOM.pastBidsCountBadge.textContent = `${pastBids.length} Total Bids`;
    if (DOM.pastBidsList) {
      DOM.pastBidsList.innerHTML = pastBids.length === 0
        ? '<div class="text-xs text-slate-500 italic py-4 text-center">No bids recorded yet. Bids you place during the auction will be archived here.</div>'
        : pastBids.slice().reverse().map(b => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div>
              <strong class="text-white">${b.player || 'Player'}</strong>
              <span class="text-slate-400 block text-[11px]">${b.team || 'Franchise'} | ${b.role || 'Player'} (OVR ${b.rating || '--'})</span>
            </div>
            <div class="text-right">
              <span class="font-cricket font-bold text-amber-400 text-sm">₹${Number(b.amount||0).toFixed(2)} Cr</span>
              <span class="text-[10px] text-slate-500 block">${b.timestamp ? new Date(b.timestamp).toLocaleTimeString() : ''}</span>
            </div>
          </div>
        `).join('');
    }

    // Render Past Squads
    const pastSquads = (user && user.pastSquads) ? user.pastSquads : [];
    if (DOM.pastSquadsList) {
      DOM.pastSquadsList.innerHTML = pastSquads.length === 0
        ? '<div class="text-xs text-slate-500 italic py-4 text-center">No completed tournament squads saved yet. Complete an auction to archive your full squad here.</div>'
        : pastSquads.slice().reverse().map((sq, idx) => `
          <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <strong class="text-white text-sm">🏆 ${sq.teamName || 'Franchise Squad'} (${sq.mode || 'MEGA'})</strong>
              <span class="text-slate-400">${sq.savedAt ? new Date(sq.savedAt).toLocaleDateString() : ''}</span>
            </div>
            <p class="text-slate-400">Total Spent: <strong class="text-amber-400">₹${Number(sq.spent||0).toFixed(1)} Cr</strong> | Players: <strong class="text-blue-400">${sq.playersCount || (sq.players||[]).length}</strong></p>
            <div class="flex flex-wrap gap-1 pt-1">
              ${(sq.players||[]).map(p => `<span class="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">${p.name} (₹${p.price}Cr)</span>`).join('')}
            </div>
          </div>
        `).join('');
    }

    // Render Past Ratings
    const pastRatings = (user && user.pastRatings) ? user.pastRatings : {};
    const ratingKeys = Object.keys(pastRatings);
    if (DOM.pastRatingsList) {
      DOM.pastRatingsList.innerHTML = ratingKeys.length === 0
        ? '<div class="text-xs text-slate-500 italic py-4 text-center">No squad evaluations saved yet. Use the "User Rating" mode in the Ratings tab to tag buys and review squads.</div>'
        : ratingKeys.map(k => `
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <strong class="text-white">${k} Review</strong>
              <span class="text-slate-400 block text-[11px]">${pastRatings[k].notes || 'Custom squad evaluation'}</span>
            </div>
            <span class="px-2.5 py-1 rounded font-bold bg-amber-500 text-slate-950 text-xs">Score: ${pastRatings[k].score || '--'} (${pastRatings[k].grade || '--'})</span>
          </div>
        `).join('');
    }

    // Render Registered Profiles on Server
    const allUsers = await StorageEngine.getAllUsers();
    if (DOM.registeredProfilesList) {
      DOM.registeredProfilesList.innerHTML = allUsers.map(u => `
        <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <strong class="text-white">${u.userName}</strong>
            <span class="text-slate-500 block text-[10px]">${u.auctionCount || 0} Auctions</span>
          </div>
          <button class="btn-quick-login px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold" data-username="${u.userName}">
            Load Profile
          </button>
        </div>
      `).join('');

      document.querySelectorAll('.btn-quick-login').forEach(btn => {
        btn.addEventListener('click', async () => {
          const un = btn.dataset.username;
          if (DOM.inputReloginName) DOM.inputReloginName.value = un;
          await handleRelogin();
        });
      });
    }

    DOM.userProfileModal.classList.remove('hidden');
  }

  // Multiplayer Manager Modal
  async function openMultiplayerModal() {
    if (!DOM.multiplayerModal) return;

    // Refresh Private Link & Room Badge
    if (DOM.inputPrivateShareLink) {
      DOM.inputPrivateShareLink.value = StorageEngine.getPrivateRoomLink();
    }
    if (DOM.currentRoomBadge) {
      DOM.currentRoomBadge.textContent = `ROOM: ${StorageEngine.currentRoomId || 'DEFAULT'}`;
    }

    const rawTeams = (typeof TEAMS !== 'undefined') ? TEAMS : [];
    const humanManagers = StorageEngine.getHumanManagers();
    const allUsers = await StorageEngine.getAllUsers();
    const currentUser = StorageEngine.getCurrentUser();

    if (DOM.multiplayerTeamsList) DOM.multiplayerTeamsList.innerHTML = '';

    rawTeams.forEach(t => {
      const assigned = humanManagers[t.id];
      const isAssigned = Boolean(assigned);

      const row = document.createElement('div');
      row.className = 'p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs';

      row.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm" style="background-color: ${t.primaryColor}">${t.logo || '🏏'}</span>
          <div>
            <strong class="text-white text-sm">${t.name} (${t.id})</strong>
            <span class="text-slate-400 block text-[11px]">${isAssigned ? `👤 Human Manager: <strong class="text-amber-400">${assigned.userName}</strong>` : '🤖 Franchise AI Personality'}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <select class="select-team-manager bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none" data-team="${t.id}">
            <option value="AI" ${!isAssigned ? 'selected' : ''}>🤖 Franchise AI</option>
            ${currentUser ? `<option value="${currentUser.userId}" ${isAssigned && assigned.userId === currentUser.userId ? 'selected' : ''}>👤 ${currentUser.userName} (You)</option>` : ''}
            ${allUsers.filter(u => !currentUser || u.userId !== currentUser.userId).map(u => `
              <option value="${u.userId}" ${isAssigned && assigned.userId === u.userId ? 'selected' : ''}>👤 ${u.userName}</option>
            `).join('')}
            <option value="NEW_HUMAN">+ Add Another Player...</option>
          </select>
        </div>
      `;

      if (DOM.multiplayerTeamsList) DOM.multiplayerTeamsList.appendChild(row);
    });

    if (DOM.multiplayerModal) DOM.multiplayerModal.classList.remove('hidden');
  }

  async function saveMultiplayerRoom() {
    try {
      const selects = document.querySelectorAll('.select-team-manager');
      const allUsers = (typeof StorageEngine !== 'undefined' && StorageEngine.getAllUsers) ? await StorageEngine.getAllUsers() : [];
      const currentUser = (typeof StorageEngine !== 'undefined' && StorageEngine.getCurrentUser) ? StorageEngine.getCurrentUser() : null;

      for (const sel of selects) {
        const teamId = sel.dataset.team;
        const val = sel.value;

        if (val === 'AI') {
          if (typeof StorageEngine !== 'undefined' && StorageEngine.removeMultiplayerManager) {
            StorageEngine.removeMultiplayerManager(teamId);
          }
          if (typeof Game !== 'undefined' && Game.setHumanTeam) {
            Game.setHumanTeam(teamId, null);
          }
        } else if (val === 'NEW_HUMAN') {
          const pName = prompt(`Enter manager name for ${teamId}:`);
          if (pName && pName.trim()) {
            let uId = 'user_' + Date.now();
            let uName = pName.trim();
            if (typeof StorageEngine !== 'undefined' && StorageEngine.loginUser) {
              const res = await StorageEngine.loginUser(uName, teamId);
              if (res && res.user) {
                uId = res.user.userId;
                uName = res.user.userName;
              }
            }
            if (typeof StorageEngine !== 'undefined' && StorageEngine.assignMultiplayerManager) {
              await StorageEngine.assignMultiplayerManager(teamId, uId, uName);
            }
            if (typeof Game !== 'undefined' && Game.setHumanTeam) {
              Game.setHumanTeam(teamId, { userId: uId, userName: uName });
            }
          }
        } else {
          const matched = allUsers.find(u => u.userId === val) || (currentUser && currentUser.userId === val ? currentUser : null);
          if (matched) {
            if (typeof StorageEngine !== 'undefined' && StorageEngine.assignMultiplayerManager) {
              await StorageEngine.assignMultiplayerManager(teamId, matched.userId, matched.userName);
            }
            if (typeof Game !== 'undefined' && Game.setHumanTeam) {
              Game.setHumanTeam(teamId, { userId: matched.userId, userName: matched.userName });
            }
          }
        }
      }

      if (typeof renderMultiplayerPaddles === 'function') renderMultiplayerPaddles();
      if (typeof updateTopBar === 'function') updateTopBar();
      if (typeof saveAppState === 'function') saveAppState();
      if (DOM.multiplayerModal) DOM.multiplayerModal.classList.add('hidden');
      if (typeof AuctionAudio !== 'undefined' && AuctionAudio.playSoldFanfare) AuctionAudio.playSoldFanfare();

      // Launch or switch to auction arena to start playing
      const state = (typeof Game !== 'undefined' && Game.getState) ? Game.getState() : {};
      if (state.phase === 'home' || !state.phase) {
        startAuctionFromLanding();
      } else {
        switchTab('auction');
        if (state.isPaused && typeof Game.resumeGame === 'function') {
          Game.resumeGame();
        }
      }
    } catch (err) {
      console.error('[Multiplayer] Error in saveMultiplayerRoom:', err);
      if (DOM.multiplayerModal) DOM.multiplayerModal.classList.add('hidden');
      switchTab('auction');
    }
  }

  async function copyPrivateLinkToClipboard() {
    const link = StorageEngine.getPrivateRoomLink();
    if (DOM.inputPrivateShareLink) {
      DOM.inputPrivateShareLink.value = link;
      DOM.inputPrivateShareLink.select();
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        throw new Error('Clipboard API not available');
      }
      if (DOM.copyLinkBtnText) DOM.copyLinkBtnText.textContent = 'Copied! ✓';
      AuctionAudio.playBidPaddle();
      setTimeout(() => {
        if (DOM.copyLinkBtnText) DOM.copyLinkBtnText.textContent = 'Copy Link';
      }, 2500);
    } catch (e) {
      if (DOM.inputPrivateShareLink) {
        DOM.inputPrivateShareLink.focus();
        DOM.inputPrivateShareLink.select();
        document.execCommand('copy');
        if (DOM.copyLinkBtnText) DOM.copyLinkBtnText.textContent = 'Copied! ✓';
        setTimeout(() => {
          if (DOM.copyLinkBtnText) DOM.copyLinkBtnText.textContent = 'Copy Link';
        }, 2500);
      }
    }
  }

  async function handleCreateNewRoom() {
    const newCode = `IPL-${Math.floor(1000 + Math.random() * 9000)}`;
    const pin = prompt(`Enter an optional PIN for Private Room "${newCode}" (or leave empty for none):`) || '';
    const res = await StorageEngine.createPrivateRoom(newCode, `Private Room ${newCode}`, pin);
    if (res.success) {
      if (DOM.currentRoomBadge) DOM.currentRoomBadge.textContent = `ROOM: ${newCode}`;
      if (DOM.inputPrivateShareLink) DOM.inputPrivateShareLink.value = res.link;
      AuctionAudio.playSoldFanfare();
      alert(`🎉 Private Room "${newCode}" created!\n\nPrivate Link:\n${res.link}\n\nShare this private link with other players to play together!`);
    }
  }

  function renderMultiplayerPaddles() {
    if (DOM.multiplayerPaddlesSection) {
      DOM.multiplayerPaddlesSection.classList.add('hidden');
      if (DOM.multiplayerPaddlesList) {
        DOM.multiplayerPaddlesList.innerHTML = '';
      }
    }
  }

  // Set Swap & Shuffle Notification
  function handleManualShuffle() {
    const success = Game.shuffleUpcomingPool();
    if (success) {
      AuctionAudio.playShuffleSound();
      showSetSwapNotification('Manual Pool Shuffle', 'All upcoming players across all remaining auction sets have been thoroughly re-shuffled!');
      updateAuctionArena();
      renderCatalogGrid();
    }
  }

  function triggerSetSwapCelebration(oldSet, newSet, setName, totalInSet) {
    AuctionAudio.playShuffleSound();
    showSetSwapNotification(`Entering Set ${newSet}: ${setName}`, `Lot order for all ${totalInSet} players in this set has been clearly randomized & shuffled!`);
    DOM.auctioneerCommentary.textContent = `Attention Franchisees! Set ${oldSet} has concluded. We are now swapping to Set ${newSet} (${setName})! The order of players has been clearly randomized and shuffled!`;
    updateOnDeckPreview();
  }

  function showSetSwapNotification(title, subtitle) {
    if (!DOM.setSwapBanner) return;
    if (DOM.setSwapTitle) DOM.setSwapTitle.textContent = title;
    if (DOM.setSwapSubtitle) DOM.setSwapSubtitle.textContent = subtitle;

    if (DOM.setSwapBanner) DOM.setSwapBanner.classList.remove('opacity-0', '-translate-y-6', 'scale-95', 'pointer-events-none');
    DOM.setSwapBanner.classList.add('opacity-100', 'translate-y-0', 'scale-100');

    setTimeout(() => {
      if (DOM.setSwapBanner) DOM.setSwapBanner.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
      DOM.setSwapBanner.classList.add('opacity-0', '-translate-y-6', 'scale-95', 'pointer-events-none');
    }, 3800);
  }

  function updateOnDeckPreview() {
    if (!DOM.onDeckPreviewContainer) return;
    const state = Game.getState();
    const nextThree = state.auctionPool.slice(state.currentPlayerIndex + 1, state.currentPlayerIndex + 4);

    if (DOM.onDeckPreviewContainer) DOM.onDeckPreviewContainer.innerHTML = '';
    if (nextThree.length === 0) {
      if (DOM.onDeckPreviewContainer) DOM.onDeckPreviewContainer.innerHTML = '<span class="text-slate-500 italic">Final Lot</span>';
    } else {
      nextThree.forEach(np => {
        const chip = document.createElement('div');
        chip.className = 'flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300';
        chip.innerHTML = `
          <div class="w-4 h-4 rounded-full overflow-hidden shrink-0">
            ${renderPlayerAvatarImg(np, 'w-full h-full object-cover')}
          </div>
          <span class="font-medium text-white truncate max-w-[75px]">${np.name}</span>
          <span class="text-amber-400 font-bold">${np.rating}</span>
        `;
        if (DOM.onDeckPreviewContainer) DOM.onDeckPreviewContainer.appendChild(chip);
      });
    }
  }

  function populateTeamSelects() {
    const rawTeams = (typeof TEAMS !== 'undefined') ? TEAMS : [];
    if (!DOM.selectPlaying11Team || !DOM.userReviewTeamSelect) return;
    DOM.selectPlaying11Team.innerHTML = '';
    DOM.userReviewTeamSelect.innerHTML = '';

    rawTeams.forEach(t => {
      const opt1 = document.createElement('option');
      opt1.value = t.id;
      opt1.textContent = `${t.shortName || t.name} (${t.id})`;
      DOM.selectPlaying11Team.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = t.id;
      opt2.textContent = `${t.shortName || t.name} (${t.id})`;
      DOM.userReviewTeamSelect.appendChild(opt2);
    });

    DOM.selectPlaying11Team.value = AppState.selectedPlaying11TeamId;
    DOM.userReviewTeamSelect.value = AppState.selectedReviewTeamId;
  }

  function populateCatalogSetFilter() {
    const sets = (typeof AUCTION_SETS !== 'undefined') ? AUCTION_SETS : [];
    if (!DOM.catalogSetFilter) return;
    DOM.catalogSetFilter.innerHTML = '<option value="ALL">All Auction Sets</option>';
    sets.forEach((setName, idx) => {
      const opt = document.createElement('option');
      opt.value = String(idx + 1);
      opt.textContent = `Set ${idx + 1}: ${setName}`;
      DOM.catalogSetFilter.appendChild(opt);
    });
  }

  function renderAllViews() {
    updateTopBar();
    updateAuctionArena();
    renderPlaying11View();
    renderFranchisesView();
    renderCatalogGrid();
    renderRatingsView();
  }

  // Self-start once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }


  // =========================================================================
  // LANDING PAGE & 2027 MINI AUCTION CONTROLLER
  // =========================================================================

  function renderLandingPage() {
    if (!DOM.landingTeamsGrid) return;
    const { teams } = (typeof getGlobalData !== 'undefined') ? getGlobalData() : { teams: (window.TEAMS || []) };
    const teamHistoryDB = window.TEAM_HISTORY || {};
    const aiOwnersDB = window.TEAM_AI_OWNERS || {};

    if (DOM.landingTeamsGrid) DOM.landingTeamsGrid.innerHTML = '';

    teams.forEach(t => {
      const isSelected = t.id === AppState.selectedLandingTeamId;
      const history = teamHistoryDB[t.id] || {};
      const aiOwner = aiOwnersDB[t.id] || { archetype: 'Strategic Franchise Owner', owner: 'Corporate Board' };
      const retainedList = history.retentionHistory2024 || [];

      // Calculate starting purse in Mini vs Mega
      const miniPurse = AppState.auctionMode === 'MINI'
        ? Math.max(15, 120 - (retainedList.length * 15))
        : 120;

      const card = document.createElement('div');
      card.className = `cursor-pointer relative p-4 rounded-2xl border-2 transition-all space-y-2 select-none group ${
        isSelected
          ? 'bg-slate-800/90 border-amber-400 shadow-xl shadow-amber-500/20'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold shadow-md" style="background-color: ${t.primaryColor || '#1e293b'}">
              ${t.logo || '🏏'}
            </span>
            <div>
              <h4 class="font-bold text-white text-sm group-hover:text-amber-400 transition">${t.name}</h4>
              <span class="text-[10px] text-slate-400">${t.city || 'India'}</span>
            </div>
          </div>
          <span class="text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-slate-600'}">
            ${isSelected ? '● SELECTED' : '○'}
          </span>
        </div>

        <div class="pt-1 text-[11px] space-y-1">
          <div class="flex items-center justify-between text-slate-300">
            <span class="text-slate-500">Purse:</span>
            <strong class="text-amber-400">₹${miniPurse.toFixed(1)} Cr</strong>
          </div>
          <div class="flex items-center justify-between text-slate-300">
            <span class="text-slate-500">Owner:</span>
            <span class="truncate max-w-[130px] text-slate-300" title="${aiOwner.archetype}">${aiOwner.archetype}</span>
          </div>
          <div class="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 truncate">
            <span class="text-amber-400/80 font-semibold">Core:</span> ${retainedList.slice(0, 3).join(', ') || 'Fresh Squad'}
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        selectLandingTeam(t.id);
      });

      if (DOM.landingTeamsGrid) DOM.landingTeamsGrid.appendChild(card);
    });

    updateLandingSummary();
  }

  function selectLandingTeam(teamId) {
    AppState.selectedLandingTeamId = teamId;
    AppState.userTeamId = teamId;
    AppState.selectedPlaying11TeamId = teamId;
    AppState.selectedReviewTeamId = teamId;
    if (typeof Game !== 'undefined') {
      if (typeof Game.changeUserTeam === 'function') Game.changeUserTeam(teamId);
      else if (typeof Game.selectTeam === 'function') Game.selectTeam(teamId);
      else if (Game.getState) Game.getState().userTeamId = teamId;
    }
    if (typeof StorageEngine !== 'undefined' && StorageEngine.currentUser) {
      StorageEngine.currentUser.teamId = teamId;
      StorageEngine.currentUser.favoriteTeam = teamId;
      if (typeof StorageEngine.saveCurrentUser === 'function') StorageEngine.saveCurrentUser();
    }
    AuctionAudio.playBidPaddle();
    renderLandingPage();
    updateTopBar();
  }

  function setAuctionMode(mode) {
    AppState.auctionMode = mode;
    AuctionAudio.playBidPaddle();

    if (mode === 'MINI') {
      if (DOM.cardModeMini) DOM.cardModeMini.classList.add('border-amber-400', 'shadow-amber-500/10');
      DOM.cardModeMini.classList.remove('border-slate-800');
      if (DOM.radioCheckMini) DOM.radioCheckMini.textContent = '✓';
      DOM.radioCheckMini.className = 'w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black';

      if (DOM.cardModeMega) DOM.cardModeMega.classList.remove('border-amber-400', 'shadow-amber-500/10');
      DOM.cardModeMega.classList.add('border-slate-800');
      if (DOM.radioCheckMega) DOM.radioCheckMega.textContent = '○';
      DOM.radioCheckMega.className = 'w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-black';
      
      DOM.auctionModeBadge.textContent = 'MINI AUCTION (40/60)';
      DOM.auctionModeBadge.className = 'text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-purple-900/60 text-purple-300 border border-purple-700/50';
    } else {
      if (DOM.cardModeMega) DOM.cardModeMega.classList.add('border-amber-400', 'shadow-amber-500/10');
      DOM.cardModeMega.classList.remove('border-slate-800');
      if (DOM.radioCheckMega) DOM.radioCheckMega.textContent = '✓';
      DOM.radioCheckMega.className = 'w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black';

      if (DOM.cardModeMini) DOM.cardModeMini.classList.remove('border-amber-400', 'shadow-amber-500/10');
      DOM.cardModeMini.classList.add('border-slate-800');
      if (DOM.radioCheckMini) DOM.radioCheckMini.textContent = '○';
      DOM.radioCheckMini.className = 'w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-black';

      DOM.auctionModeBadge.textContent = 'MEGA AUCTION';
      DOM.auctionModeBadge.className = 'text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50';
    }

    renderLandingPage();
  }

  function setPoolSize(size) {
    AppState.poolSize = size;
    AuctionAudio.playBidPaddle();
    if (size === 'quick') {
      if (DOM.btnPoolQuick) DOM.btnPoolQuick.classList.add('border-amber-400');
      DOM.btnPoolQuick.classList.remove('border-slate-800');
      if (DOM.badgePoolQuick) DOM.badgePoolQuick.textContent = 'SELECTED';
      DOM.badgePoolQuick.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700';

      if (DOM.btnPoolFull) DOM.btnPoolFull.classList.remove('border-amber-400');
      DOM.btnPoolFull.classList.add('border-slate-800');
      if (DOM.badgePoolFull) DOM.badgePoolFull.textContent = 'FULL';
      DOM.badgePoolFull.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700';
    } else {
      if (DOM.btnPoolFull) DOM.btnPoolFull.classList.add('border-amber-400');
      DOM.btnPoolFull.classList.remove('border-slate-800');
      if (DOM.badgePoolFull) DOM.badgePoolFull.textContent = 'SELECTED';
      DOM.badgePoolFull.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700';

      if (DOM.btnPoolQuick) DOM.btnPoolQuick.classList.remove('border-amber-400');
      DOM.btnPoolQuick.classList.add('border-slate-800');
      if (DOM.badgePoolQuick) DOM.badgePoolQuick.textContent = 'QUICK';
      DOM.badgePoolQuick.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700';
    }
  }

  function pickRandomLandingTeam() {
    const { teams } = (typeof getGlobalData !== 'undefined') ? getGlobalData() : { teams: (window.TEAMS || []) };
    if (!teams || teams.length === 0) return;
    const randomTeam = teams[Math.floor(Math.random() * teams.length)];
    selectLandingTeam(randomTeam.id);
  }

  function updateLandingSummary() {
    const { teams } = (typeof getGlobalData !== 'undefined') ? getGlobalData() : { teams: (window.TEAMS || []) };
    const teamHistoryDB = window.TEAM_HISTORY || {};
    const selectedTeam = teams.find(t => t.id === AppState.selectedLandingTeamId) || teams[0];
    if (!selectedTeam) return;

    if (DOM.landingSelectedLogo) DOM.landingSelectedLogo.textContent = selectedTeam.logo || '🏏';
    if (DOM.landingSelectedTeamName) DOM.landingSelectedTeamName.textContent = `${selectedTeam.name} (${selectedTeam.id})`;
    if (DOM.landingSelectedModeBadge) {
      DOM.landingSelectedModeBadge.textContent = AppState.auctionMode === 'MINI' ? '2027 Mini Auction' : 'Mega Auction';
    }

    const history = teamHistoryDB[selectedTeam.id] || {};
    const retainedList = history.retentionHistory2024 || [];
    const purse = AppState.auctionMode === 'MINI' ? Math.max(15, 120 - (retainedList.length * 15)) : 120;

    if (DOM.landingSelectedPurse) {
      DOM.landingSelectedPurse.textContent = `Starting Purse: ₹${purse.toFixed(1)} Cr • Retained: ${retainedList.slice(0, 4).join(', ') || 'Fresh Squad'}`;
    }
  }

  function startAuctionFromLanding() {
    // 0. Clear previous session state for a fresh start
    if (typeof Game !== 'undefined' && Game.clearSavedState) {
      Game.clearSavedState();
    }
    try {
      localStorage.removeItem('ipl_auction_app_state');
      localStorage.removeItem('ipl_auction_chat_msgs');
    } catch (e) {}
    AppState.userPlayingXI = {};
    AppState.activePickupSlot = null;

    // 1. Initialize Game Engine with chosen format, team, and pool
    Game.initGame({
      auctionMode: AppState.auctionMode,
      userTeamId: AppState.selectedLandingTeamId,
      poolSize: AppState.poolSize
    });

    // 2. Select Playing 11 and review team to user's team
    AppState.selectedPlaying11TeamId = AppState.selectedLandingTeamId;
    AppState.selectedReviewTeamId = AppState.selectedLandingTeamId;
    if (DOM.selectPlaying11Team) DOM.selectPlaying11Team.value = AppState.selectedLandingTeamId;

    // 3. Switch to Auction Arena tab
    switchTab('auction');

    // 4. Start Auction
    Game.startAuction();

    // Clear chat from previous auction and post fresh welcome
    if (typeof clearChat === 'function') clearChat();
    if (typeof addSystemChatMessage === 'function') {
      addSystemChatMessage('⚡ Auction is now LIVE! Managers may now message and track all purchases.');
    }

    // 5. Audio & Celebration FX
    AuctionAudio.playSoldFanfare();
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
    }

    // 6. Update user chip in header
    updateTopBar();
    renderAllViews();
    saveAppState();
  }

  
  // =========================================================================
  // INTERACTIVE TEAM SQUAD MODAL (Click on any franchise to view full roster)
  // =========================================================================
  function openTeamRosterModal(teamId) {
    openRetainedModal(teamId);
  }
  window.openTeamRosterModal = openTeamRosterModal;

  function openRetainedModal(initialTeamId) {
    if (!DOM.retainedSquadsModal) return;
    const { teams } = (typeof getGlobalData !== 'undefined') ? getGlobalData() : { teams: (window.TEAMS || []) };
    const teamHistoryDB = window.TEAM_HISTORY || {};

    let activeTeam = initialTeamId || AppState.selectedLandingTeamId || 'RCB';

    const renderRetainedContent = (tId) => {
      activeTeam = tId;
      const team = teams.find(t => t.id === tId) || teams[0];
      const history = teamHistoryDB[tId] || {};
      const retained = history.retentionHistory2024 || [];

      // Render Tabs
      DOM.retainedModalTeamTabs.innerHTML = '';
      teams.forEach(t => {
        const btn = document.createElement('button');
        btn.className = `px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition ${
          t.id === activeTeam
            ? 'bg-amber-500 text-slate-950 shadow-md'
            : 'bg-slate-800 text-slate-400 hover:text-white'
        }`;
        btn.textContent = `${t.logo || '🏏'} ${t.id}`;
        btn.addEventListener('click', () => renderRetainedContent(t.id));
        DOM.retainedModalTeamTabs.appendChild(btn);
      });

      // Fetch live team state from Game engine if available
      const liveTeam = (typeof Game !== 'undefined' && Game.getTeam) ? Game.getTeam(tId) : null;
      const purseLeft = liveTeam ? Math.max(0, (liveTeam.purse || 120) - (liveTeam.spent || 0)) : (120 - (retained.length * 15));
      const squadPlayers = liveTeam ? (liveTeam.players || []) : [];
      const auctionBought = squadPlayers.filter(p => !p.retained);
      const allRetained = squadPlayers.filter(p => p.retained);
      const displayRetained = allRetained.length > 0 ? allRetained.map(p => p.name) : retained;

      DOM.retainedModalTeamContent.innerHTML = `
        <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div class="flex items-center gap-3">
            <span class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold shadow-md" style="background-color: ${team.primaryColor || '#1e293b'}">
              ${team.logo || '🏏'}
            </span>
            <div>
              <h4 class="text-base font-bold text-white">${team.name} (${tId})</h4>
              <p class="text-xs text-slate-400">${team.homeGround || team.city || 'India'}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[10px] uppercase text-slate-400 font-semibold block">Remaining Purse</span>
            <span class="text-xl font-cricket font-extrabold text-amber-400">₹${purseLeft.toFixed(2)} Cr</span>
            <span class="text-[10px] text-slate-500 block">Squad: ${squadPlayers.length}/25 (OS: ${liveTeam?.overseas || 0}/8)</span>
          </div>
        </div>

        <!-- Live Auction Purchases -->
        <div class="space-y-2 mt-3">
          <div class="flex items-center justify-between">
            <h5 class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>⚡</span> <span>Auction Bought Squad (${auctionBought.length} Players)</span>
            </h5>
            <span class="text-[11px] text-slate-400">Spent: ₹${(liveTeam?.spent || 0).toFixed(2)} Cr</span>
          </div>
          ${auctionBought.length === 0 ? '<div class="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-500 italic">No players acquired from the auction block yet. Place bids in the arena to add players!</div>' : ''}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            ${auctionBought.map(p => `
              <div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                    ${renderPlayerAvatarImg(p, 'w-full h-full object-cover')}
                  </div>
                  <div>
                    <strong class="text-white block">${p.name}</strong>
                    <span class="text-slate-400 text-[10px]">${p.role} ${p.overseas ? '✈️' : ''} • Rating ${p.rating || 80}</span>
                  </div>
                </div>
                <span class="font-cricket font-bold text-amber-400">₹${Number(p.soldPrice || p.price || 0).toFixed(2)} Cr</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Official Retained Core (for Mini Auction) -->
        ${displayRetained.length > 0 ? `
        <div class="space-y-2 mt-3 pt-3 border-t border-slate-800">
          <h5 class="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <span>🔒</span> <span>Pre-Retained Core (${displayRetained.length} Players)</span>
          </h5>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${displayRetained.map((name, i) => `
              <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[10px]">${i + 1}</span>
                  <strong class="text-white">${name}</strong>
                </div>
                <span class="text-emerald-400 font-semibold text-[11px]">RETAINED</span>
              </div>
            `).join('')}
          </div>
        </div>` : ''}
      `;
    };

    renderRetainedContent(activeTeam);
    DOM.retainedSquadsModal.classList.remove('hidden');
  }

  // =========================================================================
  // 2027 IPL SEASON TOURNAMENT SIMULATION RENDERER
  // =========================================================================

  function renderSeasonSimulation() {
    if (!DOM.seasonStandingsBody) return;
    const teams = Game.getTeams();
    if (!teams || teams.length === 0) return;

    if (!AppState.seasonSimulation) {
      AppState.seasonSimulation = RatingEngine.simulateSeason(teams, window.PLAYER_STATS);
    }
    const sim = AppState.seasonSimulation;
    if (!sim) return;

    // Render Standings
    DOM.seasonStandingsBody.innerHTML = '';
    const standingsList = sim.standings || sim.sortedStandings || [];
    standingsList.forEach((s) => {
      const tr = document.createElement('tr');
      tr.className = `hover:bg-slate-900/60 transition ${s.isQualifier ? 'bg-emerald-950/20' : ''}`;
      tr.innerHTML = `
        <td class="py-2.5 px-2 font-cricket font-bold ${s.rank <= 4 ? 'text-emerald-400' : 'text-slate-500'}">#${s.rank}</td>
        <td class="py-2.5 px-2">
          <div class="flex items-center gap-1.5">
            <span>${s.logo}</span>
            <strong class="text-white">${s.teamName}</strong>
          </div>
        </td>
        <td class="py-2.5 px-2 font-bold text-slate-300">${s.played}</td>
        <td class="py-2.5 px-2 font-bold text-emerald-400">${s.won}</td>
        <td class="py-2.5 px-2 font-bold text-red-400">${s.lost}</td>
        <td class="py-2.5 px-2 font-cricket font-extrabold text-white text-sm">${s.points}</td>
        <td class="py-2.5 px-2 font-mono text-[11px] ${s.nrr >= 0 ? 'text-emerald-400' : 'text-slate-400'}">${s.nrr >= 0 ? '+' : ''}${s.nrr.toFixed(3)}</td>
        <td class="py-2.5 px-2">
          ${s.isQualifier
            ? '<span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-slate-950">QUALIFIED (TOP 4)</span>'
            : '<span class="px-1.5 py-0.5 rounded text-[10px] text-slate-500 bg-slate-900">ELIMINATED</span>'
          }
        </td>
      `;
      DOM.seasonStandingsBody.appendChild(tr);
    });

    // Render Champion Display
    if (DOM.championDisplay && sim.playoffs && sim.playoffs.champion) {
      const champ = sim.playoffs.champion;
      DOM.championDisplay.innerHTML = `
        <div class="flex items-center justify-center gap-3">
          <span class="text-4xl animate-bounce">🏆</span>
          <div>
            <div class="text-[10px] uppercase font-bold tracking-widest text-amber-400">TATA IPL 2027 WINNER</div>
            <div class="text-2xl font-cricket font-black text-white">${champ.logo} ${champ.teamName}</div>
          </div>
        </div>
        <p class="text-[11px] text-slate-300 italic pt-1">${sim.playoffs.final ? sim.playoffs.final.summary : 'Champion crowned in thrilling Grand Final!'}</p>
      `;
    }

    // Render Playoff Fixtures
    if (DOM.playoffsResultsContainer && sim.playoffs) {
      const p = sim.playoffs;
      DOM.playoffsResultsContainer.innerHTML = `
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
          <div class="flex items-center justify-between text-[11px] font-bold text-amber-400">
            <span>QUALIFIER 1</span>
            <span class="text-emerald-400">Winner to Final</span>
          </div>
          <div class="text-white">${p.qualifier1 ? p.qualifier1.summary : 'Simulating...'}</div>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
          <div class="flex items-center justify-between text-[11px] font-bold text-amber-400">
            <span>ELIMINATOR</span>
            <span class="text-blue-400">Winner to Q2</span>
          </div>
          <div class="text-white">${p.eliminator ? p.eliminator.summary : 'Simulating...'}</div>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
          <div class="flex items-center justify-between text-[11px] font-bold text-amber-400">
            <span>QUALIFIER 2</span>
            <span class="text-emerald-400">Winner to Final</span>
          </div>
          <div class="text-white">${p.qualifier2 ? p.qualifier2.summary : 'Simulating...'}</div>
        </div>
        <div class="p-2.5 rounded-lg bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border border-amber-500/40 space-y-1">
          <div class="flex items-center justify-between text-[11px] font-extrabold text-amber-300">
            <span>👑 THE GRAND FINAL</span>
            <span class="text-yellow-400">CHAMPIONSHIP</span>
          </div>
          <div class="text-white font-bold">${p.final ? p.final.summary : 'Simulating...'}</div>
        </div>
      `;
    }
  }

  // =========================================================================
  // SUPABASE CLOUD SETUP MODAL CONTROLLER
  // =========================================================================

  function openSupabaseConfigModal() {
    const modal = DOM.supabaseConfigModal || document.getElementById('supabaseConfigModal');
    if (!modal) return;

    const savedUrl = localStorage.getItem('supabase_url') || (window.SUPABASE_CONFIG?.url || '');
    const savedKey = localStorage.getItem('supabase_anon_key') || (window.SUPABASE_CONFIG?.anonKey || '');

    const inputUrl = DOM.inputSupabaseUrl || document.getElementById('inputSupabaseUrl');
    const inputKey = DOM.inputSupabaseKey || document.getElementById('inputSupabaseKey');

    if (inputUrl) inputUrl.value = savedUrl;
    if (inputKey) inputKey.value = savedKey;

    updateSupabaseStatusDisplay(savedUrl, savedKey);
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  function closeSupabaseConfigModal() {
    const modal = DOM.supabaseConfigModal || document.getElementById('supabaseConfigModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  }

  function updateSupabaseStatusDisplay(url, key) {
    const badge = DOM.supabaseStatusBadge || document.getElementById('supabaseStatusBadge');
    const detail = DOM.supabaseStatusDetail || document.getElementById('supabaseStatusDetail');
    const btnHeader = document.getElementById('btnHeaderSupabase');
    const btnHero = document.getElementById('btnHeroSupabase');
    if (badge) {
      if (url && key) {
        badge.textContent = 'CONNECTED';
        badge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800';
        if (detail) detail.textContent = 'Active cross-device Realtime synchronization.';
      } else {
        badge.textContent = 'NOT CONFIGURED';
        badge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800';
        if (detail) detail.textContent = 'Connect your free Supabase project for cross-device multiplayer.';
      }
    }
    if (btnHeader) {
      if (url && key) {
        btnHeader.innerHTML = '<span>⚡</span><span>Connected</span>';
        btnHeader.className = 'px-3 py-1.5 rounded-xl bg-emerald-700/90 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5 transition shadow-lg cursor-pointer';
      } else {
        btnHeader.innerHTML = '<span>⚡</span><span>Enter API Keys</span>';
        btnHeader.className = 'px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 cursor-pointer';
      }
    }
    if (btnHero) {
      if (url && key) {
        btnHero.innerHTML = '<span>⚡</span><span>Supabase Connected</span>';
      } else {
        btnHero.innerHTML = '<span>⚡</span><span>Connect Supabase API Keys</span>';
      }
    }
  }

  function saveSupabaseConfig() {
    const inputUrl = DOM.inputSupabaseUrl || document.getElementById('inputSupabaseUrl');
    const inputKey = DOM.inputSupabaseKey || document.getElementById('inputSupabaseKey');

    const url = (inputUrl?.value || '').trim();
    const key = (inputKey?.value || '').trim();

    if (!url || !key) {
      alert('Please enter both Supabase Project URL and Anon API Key.');
      return;
    }

    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_anon_key', key);

    if (typeof StorageEngine !== 'undefined' && StorageEngine.initSupabase) {
      const client = StorageEngine.initSupabase(url, key);
      if (client) {
        updateSupabaseStatusDisplay(url, key);
        alert('🎉 Supabase connected successfully! Realtime multiplayer bids will now sync across all devices.');
      } else {
        alert('Connected and credentials saved to localStorage!');
        updateSupabaseStatusDisplay(url, key);
      }
    } else {
      alert('Credentials saved! Bids will sync once connected.');
    }
  }

  function clearSupabaseConfig() {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
    const inputUrl = DOM.inputSupabaseUrl || document.getElementById('inputSupabaseUrl');
    const inputKey = DOM.inputSupabaseKey || document.getElementById('inputSupabaseKey');
    if (inputUrl) inputUrl.value = '';
    if (inputKey) inputKey.value = '';
    updateSupabaseStatusDisplay('', '');
    alert('Supabase configuration removed. App will run in offline/local mode.');
  }

  // Global exposure for onclick handlers
  
  // =========================================================================
  // DIRECT USER BID & CONTROL ACTIONS (Instant Response)
  // =========================================================================
  function handleUserPaddleBid() {
    const userTeam = Game.getUserTeam();
    if (!userTeam) return;
    const success = Game.placeBid(userTeam.id);
    if (success) {
      triggerBidEffects(userTeam.id);
      updateTopBar();
      updateAuctionArena();
    }
  }

  function handlePassPlayer() {
    AuctionAudio.playHammerStrike(0.5);
    Game.passPlayer();
  }

  function handlePowerJump() {
    const userTeam = Game.getUserTeam();
    if (!userTeam) return;
    // BLOCK: Cannot power jump if already highest bidder
    const pjState = Game.getState();
    if (pjState.currentBidder === userTeam.id) return;
    if (pjState.phase !== 'auction' || pjState.isPaused) return;
    const success = Game.powerJump(userTeam.id);
    if (success) {
      triggerBidEffects(userTeam.id);
      updateTopBar();
      updateAuctionArena();
    }
  }

  function handleFinishFast() {
    AuctionAudio.playHammerStrike(0.7);
    Game.finishFast();
  }

  window.handleUserPaddleBid = handleUserPaddleBid;
  window.handlePassPlayer = handlePassPlayer;
  window.handlePowerJump = handlePowerJump;
  window.handleFinishFast = handleFinishFast;

  window.openSupabaseConfigModal = openSupabaseConfigModal;
  window.closeSupabaseConfigModal = closeSupabaseConfigModal;
  window.saveSupabaseConfig = saveSupabaseConfig;
  window.clearSupabaseConfig = clearSupabaseConfig;


  // =========================================================================
  // MANAGER ENTRY POPUP (First Arrival / Page Load)
  // =========================================================================
  function showManagerEntryModal() {
    if (!DOM.managerEntryModal) return;
    const { teams } = Game.getState();

    // Default to current team
    let selectedEntryTeamId = AppState.selectedLandingTeamId || (teams && teams[0] ? teams[0].id : 'RCB');

    // Populate franchise selector grid
    if (DOM.entryTeamSelectGrid) {
      DOM.entryTeamSelectGrid.innerHTML = '';
      teams.forEach(team => {
        const isDefault = team.id === selectedEntryTeamId;
        const card = document.createElement('div');
        card.className = 'cursor-pointer p-3 rounded-xl border-2 transition-all text-center space-y-1 select-none hover:scale-105';
        card.style.borderColor = isDefault ? (team.primaryColor || '#f59e0b') : '#334155';
        card.style.backgroundColor = isDefault ? ((team.primaryColor || '#f59e0b') + '25') : '#0f172a';
        card.innerHTML = `
          <div class="text-2xl">${team.logo || '🏏'}</div>
          <div class="text-xs font-bold text-white truncate">${team.shortName || team.name}</div>
          <div class="text-[10px] text-slate-400">${team.name}</div>
        `;
        card.addEventListener('click', () => {
          selectedEntryTeamId = team.id;
          DOM.entryTeamSelectGrid.querySelectorAll('div[data-entry-team]').forEach(c => {
            c.style.borderColor = '#334155';
            c.style.backgroundColor = '#0f172a';
          });
          card.style.borderColor = team.primaryColor || '#f59e0b';
          card.style.backgroundColor = (team.primaryColor || '#f59e0b') + '25';
        });
        card.setAttribute('data-entry-team', team.id);
        if (DOM.entryTeamSelectGrid) DOM.entryTeamSelectGrid.appendChild(card);
      });

      // Submit handler
      const submitEntry = () => {
        const rawName = (DOM.inputManagerName?.value || '').trim();
        const managerName = rawName || 'Auction Boss';
        const teamId = selectedEntryTeamId || 'RCB';

        // Save to localStorage & update state
        localStorage.setItem('ipl_manager_name', managerName);
        localStorage.setItem('ipl_manager_team', teamId);
        localStorage.setItem('ipl_user_name', managerName);
        AppState.managerName = managerName;
        AppState.userTeamId = teamId;
        AppState.selectedPlaying11TeamId = teamId;
        AppState.selectedReviewTeamId = teamId;
        AppState.selectedLandingTeamId = teamId;

        // Set team in game
        Game.selectTeam(teamId);
        if (typeof StorageEngine !== 'undefined' && StorageEngine.currentUser) {
          StorageEngine.currentUser.teamId = teamId;
          StorageEngine.currentUser.favoriteTeam = teamId;
          if (typeof StorageEngine.saveCurrentUser === 'function') StorageEngine.saveCurrentUser();
        }

        // Update header
        if (DOM.headerUserName) DOM.headerUserName.textContent = managerName;
        if (DOM.userAvatarLetter) DOM.userAvatarLetter.textContent = managerName.charAt(0).toUpperCase();

        const selectedTeam = Game.getTeam(teamId);
        if (selectedTeam) {
          if (DOM.userTeamLogo) DOM.userTeamLogo.textContent = selectedTeam.logo || '🏏';
          if (DOM.userTeamName) DOM.userTeamName.textContent = selectedTeam.shortName || selectedTeam.name;
        }

        if (DOM.managerEntryModal) DOM.managerEntryModal.classList.add('hidden');
        updateTopBar();
        renderAllViews();
      };

      // Wire submit button
      if (DOM.btnSubmitManagerEntry) {
        DOM.btnSubmitManagerEntry.onclick = submitEntry;
      }
      if (DOM.inputManagerName) {
        DOM.inputManagerName.onkeydown = (e) => {
          if (e.key === 'Enter') submitEntry();
        };
      }

      // Wire close button if present
      const btnCloseMgr = document.getElementById('btnCloseManagerEntryModal');
      if (btnCloseMgr) {
        btnCloseMgr.onclick = () => {
          if (DOM.managerEntryModal) DOM.managerEntryModal.classList.add('hidden');
        };
      }
    }

    if (DOM.managerEntryModal) DOM.managerEntryModal.classList.remove('hidden');
  }

  // =========================================================================
  // END AUCTION BUTTON HANDLER
  // =========================================================================
  function handleEndAuction() {
    if (!confirm('🏁 Are you sure you want to END the auction?\n\nAll remaining players will go UNSOLD.\nYou will be taken to build your strongest Playing 11.')) return;

    Game.endAuction();

    // Clear chat after close auction
    clearChat();

    // Ensure user team is selected for Playing 11 and review
    const userTeam = Game.getUserTeam();
    if (userTeam) {
      AppState.selectedPlaying11TeamId = userTeam.id;
      AppState.selectedReviewTeamId = userTeam.id;
      if (DOM.selectPlaying11Team) DOM.selectPlaying11Team.value = userTeam.id;
      if (DOM.userReviewTeamSelect) DOM.userReviewTeamSelect.value = userTeam.id;

      // Auto-fill XI if empty
      const xi = getUserXIForTeam(userTeam.id);
      if (xi.every(slot => slot === null) && userTeam.players && userTeam.players.length > 0) {
        const playerStatsDB = window.PLAYER_STATS || {};
        const bestXI = RatingEngine.selectBestXI(userTeam.players, playerStatsDB);
        if (bestXI && bestXI.xi) {
          bestXI.xi.forEach((slot, idx) => {
            if (slot.player) xi[idx] = slot.player;
          });
        }
      }
    }

    saveAppState();

    // Switch to Playing 11 tab
    switchTab('playing11');

    // Show end auction modal
    if (DOM.endAuctionModal) {
      renderEndAuctionEvaluation();
      DOM.endAuctionModal.classList.remove('hidden');
    }
  }

  function renderEndAuctionEvaluation() {
    if (!DOM.endAuctionEvaluationCard) return;
    const team = Game.getUserTeam();
    if (!team) return;

    const playerStatsDB = window.PLAYER_STATS || {};
    const squadRating = typeof RatingEngine !== 'undefined'
      ? RatingEngine.rateSquad(team, team.players, playerStatsDB, AppState.auctionMode)
      : null;

    const spent = team.spent || 0;
    const remaining = Math.round(((team.purse || 120) - spent) * 100) / 100;
    const managerName = localStorage.getItem('ipl_manager_name') || 'Manager';

    DOM.endAuctionEvaluationCard.innerHTML = `
      <div class="text-center space-y-3">
        <div class="text-6xl">${team.logo || '🏏'}</div>
        <h3 class="text-2xl font-cricket font-black text-white">${team.name}</h3>
        <p class="text-sm text-slate-400">Manager: <strong class="text-amber-400">${managerName}</strong></p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div class="p-3 rounded-xl bg-slate-800 border border-slate-700">
          <div class="text-slate-400">Players Bought</div>
          <div class="text-xl font-black text-white">${team.players.length}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-800 border border-slate-700">
          <div class="text-slate-400">Purse Spent</div>
          <div class="text-xl font-black text-amber-400">₹${spent.toFixed(2)} Cr</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-800 border border-slate-700">
          <div class="text-slate-400">Remaining</div>
          <div class="text-xl font-black text-emerald-400">₹${remaining.toFixed(2)} Cr</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-800 border border-slate-700">
          <div class="text-slate-400">Overseas</div>
          <div class="text-xl font-black text-purple-400">${team.overseas || 0} / ${team.maxOverseas || 8}</div>
        </div>
      </div>

      ${squadRating ? `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-400/5 to-amber-500/10 border border-amber-500/30 text-center space-y-2">
        <div class="text-xs uppercase tracking-wider text-amber-400 font-bold">Overall Squad Rating</div>
        <div class="text-5xl font-cricket font-black text-amber-300">${squadRating.overallScore || 0}<span class="text-xl text-slate-400">/100</span></div>
        <div class="text-sm font-bold text-white">${squadRating.grade || 'B'}</div>
      </div>` : ''}

      <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
        <p class="text-sm text-emerald-300 font-semibold">🏏 Now customize your strongest Playing 11 from your squad to get the final championship evaluation!</p>
      </div>
    `;
  }

  // =========================================================================
  // INTERACTIVE PLAYING 11 BUILDER (Player Pickup System)
  // =========================================================================

  // userPlayingXI[teamId] = Array(11).fill(null) — each slot holds a player object or null
  if (!AppState.userPlayingXI) AppState.userPlayingXI = {};
  if (!AppState.activePickupSlot) AppState.activePickupSlot = null;

  function getUserXIForTeam(teamId) {
    if (!AppState.userPlayingXI[teamId]) {
      AppState.userPlayingXI[teamId] = new Array(11).fill(null);
    }
    return AppState.userPlayingXI[teamId];
  }

  function renderPlaying11ViewInteractive() {
    const team = Game.getTeam(AppState.selectedPlaying11TeamId) || Game.getUserTeam();
    if (!team) return;

    const playerStatsDB = window.PLAYER_STATS || {};
    const userXI = getUserXIForTeam(team.id);
    const templates = RatingEngine.XI_TEMPLATE;

    // Count filled slots
    const filledCount = userXI.filter(p => p !== null).length;
    const overseasInXI = userXI.filter(p => p && p.overseas).length;
    const hasWK = userXI.some(p => p && (p.role || '').toLowerCase().includes('wicket'));

    // Update summary badges
    if (DOM.xiScoreVal) DOM.xiScoreVal.textContent = filledCount < 11 ? `${filledCount}/11 filled` : 'Complete!';
    if (DOM.xiOverseasCount) DOM.xiOverseasCount.textContent = `${overseasInXI} / 4`;
    if (DOM.xiBowlingOptions) {
      const bowlOpts = userXI.filter(p => {
        if (!p) return false;
        const role = (p.role || '').toUpperCase();
        return role.includes('BOWL') || role.includes('ALL');
      }).length;
      DOM.xiBowlingOptions.textContent = `${bowlOpts} Options`;
    }
    if (DOM.xiWkStatus) {
      DOM.xiWkStatus.textContent = hasWK ? 'Guaranteed (🧤)' : 'Missing WK';
      DOM.xiWkStatus.className = hasWK ? 'text-lg font-bold text-emerald-400' : 'text-lg font-bold text-red-400';
    }
    if (DOM.xiBenchDepthScore) DOM.xiBenchDepthScore.textContent = `${filledCount}/11`;

    // Render 11 Slot Cards on Cricket Turf
    if (DOM.playing11FieldGrid) {
      DOM.playing11FieldGrid.innerHTML = '';

      templates.forEach((template, idx) => {
        const p = userXI[idx];
        const isActiveSlot = AppState.activePickupSlot === idx;

        const card = document.createElement('div');
        card.className = `bg-slate-950/85 backdrop-blur-md rounded-xl sm:rounded-2xl border-2 p-1.5 sm:p-2.5 flex flex-col justify-between shadow-lg text-center transition cursor-pointer ${isActiveSlot ? 'ring-2 ring-amber-400 scale-102 bg-amber-950/40 border-amber-400' : 'hover:scale-102'}`;
        card.style.borderColor = isActiveSlot ? '#f59e0b' : (p ? (p.overseas ? '#8B5CF6' : '#3B82F6') : '#334155');

        if (p) {
          card.innerHTML = `
            <div class="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">${template.label}</div>
            <div class="w-11 h-14 sm:w-14 sm:h-16 mx-auto my-1 rounded-lg sm:rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative">
              ${renderPlayerAvatarImg(p, 'w-full h-full object-cover')}
              ${p.overseas ? '<span class="absolute top-0.5 right-0.5 text-[8px] sm:text-[10px]" title="Overseas">✈️</span>' : ''}
            </div>
            <div class="font-bold text-white text-[11px] sm:text-xs truncate" title="${p.name}">${p.name}</div>
            <div class="text-[9px] sm:text-[10px] text-amber-400 font-semibold truncate">${p.role}</div>
            <div class="mt-0.5 pt-0.5 border-t border-slate-800/80 flex items-center justify-between text-[8px] sm:text-[10px]">
              <span class="text-slate-400">OVR</span>
              <span class="font-bold text-amber-300">${p.rating || 75}</span>
            </div>
            <button class="mt-1 px-1.5 py-0.5 rounded-md sm:rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 text-[8px] sm:text-[9px] font-bold border border-red-800/40 cursor-pointer w-full transition" data-remove-slot="${idx}">✕ Remove</button>
          `;
        } else {
          card.innerHTML = `
            <div class="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-500 truncate">${template.label}</div>
            <div class="w-11 h-14 sm:w-14 sm:h-16 mx-auto my-1 rounded-lg sm:rounded-xl border border-dashed ${isActiveSlot ? 'border-amber-400 bg-amber-500/10' : 'border-slate-700'} flex items-center justify-center text-slate-500 text-base sm:text-xl">
              ${isActiveSlot ? '👆' : '+'}
            </div>
            <div class="text-[10px] sm:text-xs ${isActiveSlot ? 'text-amber-300 font-bold' : 'text-slate-500 italic'} truncate">${isActiveSlot ? 'Selected!' : 'Empty Slot'}</div>
            <div class="text-[8px] sm:text-[9px] text-slate-500 truncate">${template.idealRoles.join('/')}</div>
          `;
        }

        // Click on turf slot card: select slot, swap slots, or remove
        card.addEventListener('click', (e) => {
          // If remove button was clicked
          if (e.target.dataset.removeSlot !== undefined || e.target.closest('[data-remove-slot]')) {
            const btn = e.target.dataset.removeSlot !== undefined ? e.target : e.target.closest('[data-remove-slot]');
            const slotIdx = parseInt(btn.dataset.removeSlot);
            userXI[slotIdx] = null;
            AppState.activePickupSlot = null;
            saveAppState();
            renderPlaying11ViewInteractive();
            return;
          }

          // If another slot was already selected, swap the two slots!
          if (AppState.activePickupSlot !== null && AppState.activePickupSlot !== idx) {
            const prevIdx = AppState.activePickupSlot;
            const temp = userXI[prevIdx];
            userXI[prevIdx] = userXI[idx];
            userXI[idx] = temp;
            AppState.activePickupSlot = null;
            saveAppState();
            renderPlaying11ViewInteractive();
            return;
          }

          // Toggle selection on this slot
          AppState.activePickupSlot = (AppState.activePickupSlot === idx) ? null : idx;
          renderPlaying11ViewInteractive();
        });

        DOM.playing11FieldGrid.appendChild(card);
      });
    }

    // Render Squad Bench (players NOT in the XI)
    renderSquadBenchTray(team, userXI);

    // Render bench backups
    if (DOM.benchBackupsContainer) {
      DOM.benchBackupsContainer.innerHTML = '';
    }
  }

  function renderSquadBenchTray(team, userXI) {
    if (!DOM.squadPlayerPickerTray) return;
    DOM.squadPlayerPickerTray.innerHTML = '';

    const usedNames = new Set(userXI.filter(p => p !== null).map(p => p.name));
    const availablePlayers = team.players.filter(p => !usedNames.has(p.name));
    const overseasInXI = userXI.filter(p => p && p.overseas).length;

    if (DOM.squadBenchCountBadge) {
      DOM.squadBenchCountBadge.textContent = `${availablePlayers.length} Players Available`;
    }

    availablePlayers.forEach(p => {
      const wouldExceedOverseas = p.overseas && overseasInXI >= 4;
      const card = document.createElement('div');
      card.className = `p-3 rounded-xl border ${wouldExceedOverseas ? 'opacity-40 border-red-800/40 bg-red-950/20' : 'border-slate-700 bg-slate-800/60 hover:bg-slate-700/80'} flex items-center gap-3 transition text-xs`;

      card.innerHTML = `
        <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
          ${renderPlayerAvatarImg(p, 'w-full h-full object-cover')}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-white truncate">${p.name}</div>
          <div class="text-[10px] text-slate-400">${p.role} ${p.overseas ? '✈️' : '🇮🇳'} | OVR ${p.rating || 75} | ₹${(p.soldPrice || p.price || p.basePrice || 0).toFixed(2)} Cr</div>
        </div>
        <button class="shrink-0 px-2.5 py-1.5 rounded-lg ${wouldExceedOverseas ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 cursor-pointer'} font-black text-[10px] transition" ${wouldExceedOverseas ? 'disabled title="Max 4 overseas in XI"' : ''}>
          ${wouldExceedOverseas ? '🚫 OS Limit' : '+ Pick'}
        </button>
      `;

      if (!wouldExceedOverseas) {
        const handlePickPlayer = () => {
          const teamId = team.id;
          const xi = getUserXIForTeam(teamId);

          if (AppState.activePickupSlot !== null) {
            // Place in active slot (replaces previous player in slot, returning them to bench)
            xi[AppState.activePickupSlot] = p;
            AppState.activePickupSlot = null;
          } else {
            // Find first empty slot
            const emptyIdx = xi.findIndex(slot => slot === null);
            if (emptyIdx === -1) {
              alert('All 11 slots are currently filled! Click a slot on the turf above to select it for replacement, or remove a player.');
              return;
            }
            xi[emptyIdx] = p;
          }
          saveAppState();
          renderPlaying11ViewInteractive();
        };

        card.style.cursor = 'pointer';
        card.addEventListener('click', handlePickPlayer);
      }

      DOM.squadPlayerPickerTray.appendChild(card);
    });
  }

  // =========================================================================
  // MULTIPLAYER CHAT & PURCHASED PLAYERS DASHBOARD
  // =========================================================================
  const ChatState = {
    messages: [],
    isDrawerOpen: false,
    activeTab: 'chat', // 'chat' | 'purchased'
    unreadCount: 0
  };

  function clearChat() {
    ChatState.messages = [];
    ChatState.unreadCount = 0;
    try {
      localStorage.removeItem('ipl_auction_chat_msgs');
    } catch (e) {}
    updateChatBadges();
    renderChatMessages();
    renderPurchasedPlayersShortcut();
  }

  function toggleChatDrawer(open) {
    if (!DOM.multiplayerChatDrawer) return;
    const shouldOpen = open !== undefined ? open : !ChatState.isDrawerOpen;
    ChatState.isDrawerOpen = shouldOpen;

    if (shouldOpen) {
      if (DOM.multiplayerChatDrawer) DOM.multiplayerChatDrawer.classList.remove('translate-x-full');
      ChatState.unreadCount = 0;
      updateChatBadges();
    } else {
      if (DOM.multiplayerChatDrawer) DOM.multiplayerChatDrawer.classList.add('translate-x-full');
    }
  }

  function switchChatTab(tab) {
    ChatState.activeTab = tab;
    if (DOM.chatMessagesView && DOM.purchasedPlayersShortcutView) {
      if (tab === 'chat') {
        if (DOM.chatMessagesView) DOM.chatMessagesView.classList.remove('hidden');
        if (DOM.purchasedPlayersShortcutView) DOM.purchasedPlayersShortcutView.classList.add('hidden');
        if (DOM.btnTabChatMessages) {
          DOM.btnTabChatMessages.className = 'py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition';
        }
        if (DOM.btnTabPurchasedShortcut) {
          DOM.btnTabPurchasedShortcut.className = 'py-2 rounded-lg text-slate-400 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition';
        }
      } else {
        if (DOM.chatMessagesView) DOM.chatMessagesView.classList.add('hidden');
        if (DOM.purchasedPlayersShortcutView) DOM.purchasedPlayersShortcutView.classList.remove('hidden');
        if (DOM.btnTabPurchasedShortcut) {
          DOM.btnTabPurchasedShortcut.className = 'py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition';
        }
        if (DOM.btnTabChatMessages) {
          DOM.btnTabChatMessages.className = 'py-2 rounded-lg text-slate-400 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition';
        }
        renderPurchasedPlayersShortcut();
      }
    }
  }

  function sendChatMessage(text) {
    if (!text || !text.trim()) return;
    const state = typeof Game !== 'undefined' && Game.getState ? Game.getState() : null;
    if (!state || state.phase !== 'auction') {
      alert('⚠️ Messages are only active when the auction is running! Start the auction first.');
      return;
    }
    const managerName = localStorage.getItem('ipl_manager_name') || 'Manager';
    const teamId = localStorage.getItem('ipl_manager_team') || (Game.getUserTeam()?.id || 'RCB');
    const team = Game.getTeam(teamId);

    const msg = {
      id: Date.now(),
      sender: managerName,
      teamId: teamId,
      teamName: team?.shortName || teamId,
      teamLogo: team?.logo || '🏏',
      teamColor: team?.primaryColor || '#3B82F6',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'user'
    };

    ChatState.messages.push(msg);
    saveChatMessages();

    // Broadcast to StorageEngine for multiplayer sync if available
    if (typeof StorageEngine !== 'undefined' && StorageEngine.broadcastChatMessage) {
      StorageEngine.broadcastChatMessage(msg);
    }

    renderChatMessages();

    if (DOM.inputChatMessage) DOM.inputChatMessage.value = '';
  }

  function addSystemChatMessage(text) {
    ChatState.messages.push({
      id: Date.now(),
      sender: 'AUCTIONEER',
      teamId: null,
      teamName: 'System',
      teamLogo: '🔨',
      teamColor: '#f59e0b',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system'
    });
    saveChatMessages();

    if (!ChatState.isDrawerOpen) {
      ChatState.unreadCount++;
      updateChatBadges();
    }

    renderChatMessages();
  }

  function renderChatMessages() {
    if (!DOM.chatMessagesContainer) return;

    DOM.chatMessagesContainer.innerHTML = '';

    const state = typeof Game !== 'undefined' && Game.getState ? Game.getState() : null;
    const isAuctionActive = state && state.phase === 'auction';

    // If auction has not started, show waiting state and lock chat
    if (!isAuctionActive) {
      DOM.chatMessagesContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center space-y-3 p-6 text-slate-400">
          <div class="text-5xl animate-bounce">⏳</div>
          <div class="text-sm font-bold text-white uppercase tracking-wider">WAITING FOR AUCTION TO START</div>
          <div class="text-xs text-slate-400 max-w-xs leading-relaxed">
            Messages and live dashboard are active <strong class="text-amber-400">only when the auction starts</strong>. Please wait for the auctioneer to begin!
          </div>
        </div>
      `;
      if (DOM.inputChatMessage) {
        DOM.inputChatMessage.disabled = true;
        DOM.inputChatMessage.placeholder = 'Chat available when auction starts...';
      }
      if (DOM.btnSendChatMessage) {
        DOM.btnSendChatMessage.disabled = true;
        DOM.btnSendChatMessage.classList.add('opacity-50', 'cursor-not-allowed');
      }
      return;
    } else {
      if (DOM.inputChatMessage) {
        DOM.inputChatMessage.disabled = false;
        DOM.inputChatMessage.placeholder = 'Type message to all franchise managers...';
      }
      if (DOM.btnSendChatMessage) {
        DOM.btnSendChatMessage.disabled = false;
        DOM.btnSendChatMessage.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }

    if (ChatState.messages.length === 0) {
      DOM.chatMessagesContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center space-y-3 text-slate-500">
          <div class="text-4xl">💬</div>
          <div class="text-xs font-semibold text-white">Live Room Connected</div>
          <div class="text-[11px] text-slate-400">Send a message to other franchise managers or see purchases!</div>
        </div>
      `;
      return;
    }

    const managerName = localStorage.getItem('ipl_manager_name') || 'Manager';

    ChatState.messages.forEach(msg => {
      const isMine = msg.sender === managerName && msg.type === 'user';
      const isSystem = msg.type === 'system';

      const bubble = document.createElement('div');

      if (isSystem) {
        bubble.className = 'flex items-center gap-2 px-3 py-1.5 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 max-w-[90%]';
        bubble.innerHTML = `<span>${msg.teamLogo}</span><span class="font-semibold">${msg.text}</span><span class="text-[10px] text-slate-500 ml-1">${msg.timestamp}</span>`;
      } else {
        bubble.className = `flex ${isMine ? 'justify-end' : 'justify-start'}`;
        bubble.innerHTML = `
          <div class="max-w-[80%] ${isMine ? 'bg-emerald-600/20 border-emerald-500/30' : 'bg-slate-800 border-slate-700'} border rounded-2xl ${isMine ? 'rounded-br-md' : 'rounded-bl-md'} p-2.5 space-y-1">
            <div class="flex items-center gap-1.5">
              <span class="text-[12px]">${msg.teamLogo}</span>
              <span class="text-[10px] font-bold ${isMine ? 'text-emerald-300' : 'text-white'}">${msg.sender}</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style="background: ${msg.teamColor}20; color: ${msg.teamColor}">${msg.teamName}</span>
              <span class="text-[9px] text-slate-500 ml-auto">${msg.timestamp}</span>
            </div>
            <div class="text-xs text-slate-200">${msg.text}</div>
          </div>
        `;
      }

      DOM.chatMessagesContainer.appendChild(bubble);
    });

    // Auto-scroll to bottom
    DOM.chatMessagesContainer.scrollTop = DOM.chatMessagesContainer.scrollHeight;
  }

  function updateChatBadges() {
    const count = ChatState.unreadCount;
    if (DOM.chatBadgeCount) DOM.chatBadgeCount.textContent = count;
    if (DOM.chatTabBadge) DOM.chatTabBadge.textContent = ChatState.messages.length;
    if (DOM.floatingChatBadge) {
      DOM.floatingChatBadge.style.display = count > 0 ? 'block' : 'none';
    }
  }

  // =========================================================================
  // PURCHASED PLAYERS SHORTCUT VIEW (Name, Team, Price)
  // =========================================================================
  function renderPurchasedPlayersShortcut(searchFilter) {
    if (!DOM.shortcutPurchasedListContainer) return;

    let purchased = [];
    if (typeof Game.getAllPurchasedPlayers === 'function') {
      purchased = Game.getAllPurchasedPlayers();
    } else {
      const state = Game.getState();
      (state.teams || []).forEach(team => {
        (team.players || []).forEach(p => {
          purchased.push({
            name: p.name,
            teamName: team.name,
            teamShort: team.shortName || team.id,
            teamLogo: team.logo || '🏏',
            teamColor: team.primaryColor || '#1e293b',
            price: p.soldPrice || p.price || p.basePrice || 0,
            role: p.role || 'Batsman',
            rating: p.rating || 80,
            overseas: !!p.overseas
          });
        });
      });
    }

    // Apply search filter
    const filter = (searchFilter || '').toLowerCase().trim();
    if (filter) {
      purchased = purchased.filter(p =>
        p.name.toLowerCase().includes(filter) ||
        (p.teamName || '').toLowerCase().includes(filter) ||
        (p.teamShort || '').toLowerCase().includes(filter)
      );
    }

    // Update summary stats
    if (DOM.shortcutTotalSoldCount) DOM.shortcutTotalSoldCount.textContent = purchased.length;
    const totalSpent = purchased.reduce((sum, p) => sum + (p.price || 0), 0);
    if (DOM.shortcutTotalPurseSpent) DOM.shortcutTotalPurseSpent.textContent = `₹${totalSpent.toFixed(2)} Cr`;
    if (DOM.purchasedTabBadge) DOM.purchasedTabBadge.textContent = purchased.length;

    if (DOM.shortcutPurchasedListContainer) DOM.shortcutPurchasedListContainer.innerHTML = '';

    if (purchased.length === 0) {
      if (DOM.shortcutPurchasedListContainer) DOM.shortcutPurchasedListContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-32 text-center space-y-2 text-slate-500">
          <div class="text-3xl">📋</div>
          <div class="text-xs font-semibold">No players purchased yet</div>
          <div class="text-[11px]">Sold players will appear here with name, team & price.</div>
        </div>
      `;
      return;
    }

    purchased.forEach(p => {
      const row = document.createElement('div');
      row.className = 'flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-700/50 transition text-xs';

      row.innerHTML = `
        <div class="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
          ${renderPlayerAvatarImg({ name: p.name, role: p.role, rating: p.rating }, 'w-full h-full object-cover')}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-white truncate">${p.name}</div>
          <div class="text-[10px] text-slate-400">${p.role} ${p.overseas ? '✈️' : '🇮🇳'}</div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="text-[12px]">${p.teamLogo}</span>
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style="background: ${p.teamColor}20; color: ${p.teamColor}">${p.teamShort}</span>
        </div>
        <div class="text-amber-400 font-black text-[11px] shrink-0">₹${Number(p.price).toFixed(2)} Cr</div>
      `;

      if (DOM.shortcutPurchasedListContainer) DOM.shortcutPurchasedListContainer.appendChild(row);
    });
  }

  // =========================================================================
  // WIRE ALL NEW EVENT LISTENERS
  // =========================================================================
  function wireNewFeatures() {
    // Manager Entry Modal: show on page load if no manager name saved
    if (!localStorage.getItem('ipl_manager_name') && DOM.managerEntryModal) {
      setTimeout(() => showManagerEntryModal(), 500);
    }

    // End Auction Button
    if (DOM.btnEndAuctionArena) {
      DOM.btnEndAuctionArena.addEventListener('click', handleEndAuction);
    }

    // End Auction Modal close / proceed buttons
    if (DOM.btnCloseEndAuctionModal) {
      DOM.btnCloseEndAuctionModal.addEventListener('click', () => {
        if (DOM.endAuctionModal) DOM.endAuctionModal.classList.add('hidden');
      });
    }
    if (DOM.btnProceedToPlaying11Turf) {
      DOM.btnProceedToPlaying11Turf.addEventListener('click', () => {
        if (DOM.endAuctionModal) DOM.endAuctionModal.classList.add('hidden');
        switchTab('playing11');
      });
    }
    if (DOM.btnViewFinalLeaderboard) {
      DOM.btnViewFinalLeaderboard.addEventListener('click', () => {
        if (DOM.endAuctionModal) DOM.endAuctionModal.classList.add('hidden');
        switchTab('ratings');
      });
    }

    // Interactive XI Builder controls
    if (DOM.btnAutoFillXI) {
      DOM.btnAutoFillXI.addEventListener('click', () => {
        const team = Game.getTeam(AppState.selectedPlaying11TeamId) || Game.getUserTeam();
        if (!team) return;
        const playerStatsDB = window.PLAYER_STATS || {};
        const bestXI = RatingEngine.selectBestXI(team.players, playerStatsDB);
        const xi = getUserXIForTeam(team.id);
        bestXI.xi.forEach((slot, idx) => {
          if (slot.player) xi[idx] = slot.player;
        });
        AppState.activePickupSlot = null;
        saveAppState();
        renderPlaying11ViewInteractive();
      });
    }

    if (DOM.btnClearUserXI) {
      DOM.btnClearUserXI.addEventListener('click', () => {
        const team = Game.getTeam(AppState.selectedPlaying11TeamId) || Game.getUserTeam();
        if (!team) return;
        AppState.userPlayingXI[team.id] = new Array(11).fill(null);
        AppState.activePickupSlot = null;
        saveAppState();
        renderPlaying11ViewInteractive();
      });
    }

    if (DOM.btnLockSubmitXI) {
      DOM.btnLockSubmitXI.addEventListener('click', () => {
        const team = Game.getTeam(AppState.selectedPlaying11TeamId) || Game.getUserTeam();
        if (!team) return;
        const userXI = getUserXIForTeam(team.id);
        const filledCount = userXI.filter(p => p !== null).length;
        const totalSquadCount = team.players ? team.players.length : 0;

        if (filledCount === 0) {
          alert('Please pick at least 1 player into your Playing 11 before evaluating!');
          return;
        }

        if (filledCount < 11 && totalSquadCount >= 11) {
          if (!confirm(`You have only filled ${filledCount}/11 slots on the turf, but your squad has ${totalSquadCount} players available.\n\nDo you want to evaluate with this partial lineup?`)) {
            return;
          }
        }

        const playerStatsDB = window.PLAYER_STATS || {};
        const evaluation = RatingEngine.evaluateUserXI(userXI, team.players, playerStatsDB);
        AppState.userTeamRatings[team.id] = evaluation;
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
        }

        // Show result in end auction modal
        if (DOM.endAuctionEvaluationCard) {
          const managerName = localStorage.getItem('ipl_manager_name') || 'Manager';
          DOM.endAuctionEvaluationCard.innerHTML = `
            <div class="text-center space-y-2">
              <div class="text-5xl">${team.logo || '🏏'}</div>
              <h3 class="text-xl font-cricket font-black text-white">${team.name} — Championship XI</h3>
              <p class="text-xs text-slate-400">Manager: <strong class="text-amber-400">${managerName}</strong></p>
            </div>

            <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-400/5 to-amber-500/10 border border-amber-500/30 text-center space-y-3">
              <div class="text-xs uppercase tracking-wider text-amber-400 font-bold">🏆 FINAL CHAMPIONSHIP RATING 🏆</div>
              <div class="text-6xl font-cricket font-black text-amber-300">${evaluation.finalRating || 0}<span class="text-2xl text-slate-400">/100</span></div>
              <div class="text-base font-black text-white">${evaluation.tier || 'B-Tier Contender'}</div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div class="p-3 rounded-xl bg-blue-950/40 border border-blue-700/40">
                <div class="text-blue-400 font-bold text-[10px]">Batting Depth</div>
                <div class="text-xl font-black text-white">${evaluation.battingDepthScore || 0}<span class="text-slate-500">/100</span></div>
              </div>
              <div class="p-3 rounded-xl bg-green-950/40 border border-green-700/40">
                <div class="text-green-400 font-bold text-[10px]">Bowling Depth</div>
                <div class="text-xl font-black text-white">${evaluation.bowlingDepthScore || 0}<span class="text-slate-500">/100</span></div>
              </div>
              <div class="p-3 rounded-xl bg-purple-950/40 border border-purple-700/40">
                <div class="text-purple-400 font-bold text-[10px]">Skill Rating</div>
                <div class="text-xl font-black text-white">${evaluation.skillScore || 0}<span class="text-slate-500">/100</span></div>
              </div>
              <div class="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40">
                <div class="text-amber-400 font-bold text-[10px]">Role Balance</div>
                <div class="text-xl font-black text-white">${evaluation.balanceScore || 0}<span class="text-slate-500">/100</span></div>
              </div>
            </div>

            ${evaluation.overseasUsed > 4 ? '<div class="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center font-bold">⚠️ ILLEGAL: ' + evaluation.overseasUsed + ' overseas players (max 4 allowed)</div>' : ''}
            ${!evaluation.hasWK ? '<div class="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center font-bold">⚠️ No Wicket-Keeper in XI</div>' : ''}

            ${evaluation.strengths && evaluation.strengths.length > 0 ? `
            <div class="space-y-1.5">
              <div class="text-[10px] uppercase font-bold text-emerald-400">💪 Strengths</div>
              ${evaluation.strengths.map(s => `<div class="text-xs text-slate-300 flex items-start gap-1.5"><span class="text-emerald-400">✓</span> ${s}</div>`).join('')}
            </div>` : ''}

            ${evaluation.weaknesses && evaluation.weaknesses.length > 0 ? `
            <div class="space-y-1.5">
              <div class="text-[10px] uppercase font-bold text-red-400">⚠️ Weaknesses</div>
              ${evaluation.weaknesses.map(w => `<div class="text-xs text-slate-300 flex items-start gap-1.5"><span class="text-red-400">✗</span> ${w}</div>`).join('')}
            </div>` : ''}
          `;
        }

        if (DOM.endAuctionModal) DOM.endAuctionModal.classList.remove('hidden');
      });
    }

    // Chat Drawer toggles
    if (DOM.btnToggleChatDrawer) {
      if (DOM.btnToggleChatDrawer) {
        DOM.btnToggleChatDrawer.addEventListener('click', () => toggleChatDrawer());
      }
    }
    if (DOM.btnFloatingChat) {
      if (DOM.btnFloatingChat) {
        DOM.btnFloatingChat.addEventListener('click', () => toggleChatDrawer(true));
      }
    }
    if (DOM.btnCloseChatDrawer) {
      if (DOM.btnCloseChatDrawer) {
        DOM.btnCloseChatDrawer.addEventListener('click', () => toggleChatDrawer(false));
      }
    }

    // Chat tab switchers
    if (DOM.btnTabChatMessages) {
      if (DOM.btnTabChatMessages) {
        DOM.btnTabChatMessages.addEventListener('click', () => switchChatTab('chat'));
      }
    }
    if (DOM.btnTabPurchasedShortcut) {
      if (DOM.btnTabPurchasedShortcut) {
        DOM.btnTabPurchasedShortcut.addEventListener('click', () => switchChatTab('purchased'));
      }
    }
    if (DOM.btnChatShortcutSoldToggle) {
      if (DOM.btnChatShortcutSoldToggle) {
        DOM.btnChatShortcutSoldToggle.addEventListener('click', () => switchChatTab('purchased'));
      }
    }

    // Send Chat Message
    if (DOM.btnSendChatMessage) {
      DOM.btnSendChatMessage.addEventListener('click', () => {
        sendChatMessage(DOM.inputChatMessage?.value);
      });
    }
    if (DOM.inputChatMessage) {
      DOM.inputChatMessage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendChatMessage(DOM.inputChatMessage.value);
        }
      });
    }

    // Quick Chat Pills
    document.querySelectorAll('.btn-chat-quick-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        sendChatMessage(pill.textContent.trim());
      });
    });

    // Search Purchased Players
    if (DOM.inputSearchPurchased) {
      if (DOM.inputSearchPurchased) {
        DOM.inputSearchPurchased.addEventListener('input', () => {
          if (DOM.inputSearchPurchased) renderPurchasedPlayersShortcut(DOM.inputSearchPurchased.value);
        });
      }
    }
    if (DOM.btnRefreshPurchasedList) {
      if (DOM.btnRefreshPurchasedList) {
        DOM.btnRefreshPurchasedList.addEventListener('click', () => {
          renderPurchasedPlayersShortcut();
        });
      }
    }

        // AI Bidding Mode Selector for each player
    if (DOM.selectAiBiddingMode) {
      if (DOM.selectAiBiddingMode) {
        DOM.selectAiBiddingMode.addEventListener('change', (e) => {
          const mode = e.target.value;
          Game.setAiBiddingMode(mode);
          if (DOM.aiBiddingModeHint) {
            const hints = {
              all: 'All AI franchises actively bid based on squad budgets & needs',
              aggressive: 'Fierce bidding war: AI maximum valuation ceilings boosted +30%',
              conservative: 'Bargain mode: AI will only bid if price is under -30% valuation',
              rivals_only: 'Exclusive battle: Only top 2 highest interested rival AI teams will bid',
              human_only: 'Human & multiplayer paddles only. AI will not place bids.'
            };
            if (DOM.aiBiddingModeHint) DOM.aiBiddingModeHint.textContent = hints[mode] || 'Active for every AI franchise';
          }
          if (DOM.auctioneerCallout) {
            DOM.auctioneerCallout.textContent = `⚡ AI BIDDING MODE: ${mode.toUpperCase().replace('_', ' ')}`;
          }
        });
      }
    }

    // Open Team Squad Export Modal from Tab 2
    if (DOM.btnOpenExportRoster) {
      DOM.btnOpenExportRoster.addEventListener('click', () => {
        const team = Game.getTeam(AppState.selectedPlaying11TeamId) || Game.getUserTeam();
        openTeamSquadExportModal(team?.id || 'CSK');
      });
    }

    // Team Squad Export Modal action buttons
    if (DOM.btnCloseExportModal) {
      DOM.btnCloseExportModal.addEventListener('click', () => {
        if (DOM.teamSquadExportModal) DOM.teamSquadExportModal.classList.add('hidden');
      });
    }
    if (DOM.btnDownloadSquadCSV) {
      DOM.btnDownloadSquadCSV.addEventListener('click', () => {
        downloadSquadCSV(AppState.exportModalSelectedTeamId);
      });
    }
    if (DOM.btnDownloadSquadTXT) {
      DOM.btnDownloadSquadTXT.addEventListener('click', () => {
        downloadSquadTXT(AppState.exportModalSelectedTeamId);
      });
    }
    if (DOM.btnShareSquadWhatsApp) {
      DOM.btnShareSquadWhatsApp.addEventListener('click', () => {
        shareSquadWhatsApp(AppState.exportModalSelectedTeamId);
      });
    }
    if (DOM.btnCopySquadText) {
      DOM.btnCopySquadText.addEventListener('click', () => {
        copySquadText(AppState.exportModalSelectedTeamId);
      });
    }
    if (DOM.btnShareSquadNative) {
      if (DOM.btnShareSquadNative) {
        DOM.btnShareSquadNative.addEventListener('click', () => {
          shareSquadNative(AppState.exportModalSelectedTeamId);
        });
      }
    }

    // Room WhatsApp & Native Share Shortcuts
    if (DOM.btnShareRoomWhatsApp) {
      if (DOM.btnShareRoomWhatsApp) {
        DOM.btnShareRoomWhatsApp.addEventListener('click', () => {
          const link = DOM.inputPrivateShareLink?.value || window.location.href;
          const msg = "🏏 Join my IPL Mega Auction Room (HTTPS SSL Certified)!\n👉 Click link to enter: " + link;
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        });
      }
    }
    if (DOM.btnShareRoomNative) {
      if (DOM.btnShareRoomNative) {
        DOM.btnShareRoomNative.addEventListener('click', () => {
          const link = DOM.inputPrivateShareLink?.value || window.location.href;
          if (navigator.share) {
            navigator.share({
              title: 'IPL Mega Auction Room',
              text: 'Join my IPL Mega Auction Room live!',
              url: link
            }).catch(() => {});
          } else {
            DOM.btnShareRoomWhatsApp?.click();
          }
        });
      }
    }

    // Auto-feed sold players into chat
    Game.on('playerSold', (data) => {
      if (data && data.player && data.team) {
        addSystemChatMessage(`🔨 ${data.player.name} SOLD to ${data.team.shortName || data.team.name} for ₹${Number(data.amount || 0).toFixed(2)} Cr`);
      }
      // Refresh purchased list if visible
      if (ChatState.activeTab === 'purchased' && ChatState.isDrawerOpen) {
        renderPurchasedPlayersShortcut();
      }
    });
  }

  // Override renderPlaying11View to use interactive version
  const _origRenderPlaying11View = typeof renderPlaying11View === 'function' ? renderPlaying11View : null;



  // =========================================================================
  // TEAM SQUAD CATEGORIZED EXPORT, DOWNLOAD & SHARE CONTROLLER
  // Categorizes squad into Wicketkeepers, Batters, All-Rounders, Bowlers
  // =========================================================================
  AppState.exportModalSelectedTeamId = 'CSK';

  function getCategorizedSquad(teamId) {
    const team = Game.getTeam(teamId) || Game.getUserTeam();
    if (!team) return null;

    const squad = team.players || [];
    const categorized = {
      team: team,
      spent: team.spent || squad.reduce((sum, p) => sum + (p.soldPrice || p.price || 0), 0),
      remaining: Math.max(0, (team.purse || 120) - (team.spent || 0)),
      wicketKeepers: [],
      batters: [],
      allRounders: [],
      bowlers: []
    };

    squad.forEach(p => {
      const role = (p.role || '').toUpperCase();
      const item = {
        name: p.name,
        role: p.role || 'Batsman',
        price: Number(p.soldPrice !== undefined ? p.soldPrice : (p.price !== undefined ? p.price : p.basePrice || 0.5)),
        rating: p.rating || 80,
        overseas: !!p.overseas,
        country: p.country || (p.overseas ? 'Overseas' : 'India')
      };

      if (role.includes('WK') || role.includes('WICKET') || role === 'WK-BAT') {
        categorized.wicketKeepers.push(item);
      } else if (role.includes('ALL') || role === 'AR') {
        categorized.allRounders.push(item);
      } else if (role.includes('BOWL')) {
        categorized.bowlers.push(item);
      } else {
        categorized.batters.push(item);
      }
    });

    return categorized;
  }

  function openTeamSquadExportModal(teamId) {
    if (!DOM.teamSquadExportModal) return;
    const targetTeamId = teamId || Game.getUserTeam()?.id || 'CSK';
    AppState.exportModalSelectedTeamId = targetTeamId;

    renderTeamSquadExportModal();
    DOM.teamSquadExportModal.classList.remove('hidden');
  }

  function renderTeamSquadExportModal() {
    const teamId = AppState.exportModalSelectedTeamId;
    const data = getCategorizedSquad(teamId);
    if (!data) return;

    const { team, wicketKeepers, batters, allRounders, bowlers } = data;
    const isUser = team.id === Game.getUserTeam()?.id;

    // Render franchise tabs
    if (DOM.exportModalTeamTabs) {
      DOM.exportModalTeamTabs.innerHTML = '';
      const state = Game.getState();
      state.teams.forEach(t => {
        const isCurrent = t.id === teamId;
        const btn = document.createElement('button');
        btn.className = `px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
          isCurrent 
            ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold' 
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`;
        btn.innerHTML = `<span>${t.logo}</span><span>${t.shortName || t.name}</span>`;
        btn.addEventListener('click', () => {
          AppState.exportModalSelectedTeamId = t.id;
          renderTeamSquadExportModal();
        });
        DOM.exportModalTeamTabs.appendChild(btn);
      });
    }

    // Header info
    if (DOM.exportModalTeamLogo) {
      DOM.exportModalTeamLogo.textContent = team.logo || '🏏';
      DOM.exportModalTeamLogo.style.backgroundColor = team.primaryColor || '#1e293b';
    }
    if (DOM.exportModalTeamName) {
      DOM.exportModalTeamName.textContent = team.name.toUpperCase();
    }
    if (DOM.exportModalManagerBadge) {
      const managerName = localStorage.getItem('ipl_manager_name') || 'Manager';
      if (DOM.exportModalManagerBadge) DOM.exportModalManagerBadge.textContent = isUser ? `👑 ${managerName} (You)` : '🤖 AI Managed';
    }

    // Stats banner
    if (DOM.exportModalTotalSpent) DOM.exportModalTotalSpent.textContent = `₹${data.spent.toFixed(2)} Cr`;
    if (DOM.exportModalRemainingPurse) DOM.exportModalRemainingPurse.textContent = `₹${data.remaining.toFixed(2)} Cr`;
    if (DOM.exportModalSquadCount) DOM.exportModalSquadCount.textContent = `${(team.players || []).length} / 25`;
    if (DOM.exportModalOverseasCount) DOM.exportModalOverseasCount.textContent = `${team.overseas || 0} / 8`;

    // Render categorized sections
    if (DOM.exportModalCategoriesContainer) {
      DOM.exportModalCategoriesContainer.innerHTML = '';

      const categories = [
        { title: '🧤 WICKET-KEEPERS', list: wicketKeepers, color: 'text-amber-400', border: 'border-amber-500/30' },
        { title: '🏏 BATTERS', list: batters, color: 'text-blue-400', border: 'border-blue-500/30' },
        { title: '⚡ ALL-ROUNDERS', list: allRounders, color: 'text-purple-400', border: 'border-purple-500/30' },
        { title: '🎯 BOWLERS', list: bowlers, color: 'text-emerald-400', border: 'border-emerald-500/30' },
      ];

      categories.forEach(cat => {
        const sec = document.createElement('div');
        sec.className = `p-4 rounded-2xl bg-slate-950/70 border ${cat.border} space-y-2.5`;

        sec.innerHTML = `
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 class="text-xs font-black uppercase tracking-wider ${cat.color} flex items-center gap-1.5">
              <span>${cat.title}</span>
              <span class="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-white">${cat.list.length}</span>
            </h4>
            <span class="text-[10px] text-slate-500 font-semibold">Subtotal: ₹${cat.list.reduce((s, p) => s + p.price, 0).toFixed(2)} Cr</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            ${cat.list.length === 0 ? `
              <div class="col-span-full py-2 text-center text-slate-500 text-xs italic">No players acquired in this category.</div>
            ` : cat.list.map(p => `
              <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition">
                <div class="min-w-0 pr-2">
                  <div class="font-bold text-white truncate" title="${p.name}">${p.name}</div>
                  <div class="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>${p.role}</span>
                    <span>•</span>
                    <span class="text-amber-300">OVR ${p.rating}</span>
                    <span>${p.overseas ? '✈️' : '🇮🇳'}</span>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <span class="font-black text-amber-400 text-xs">₹${p.price.toFixed(2)} Cr</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;

        DOM.exportModalCategoriesContainer.appendChild(sec);
      });
    }
  }

  // 1. Download Squad as CSV
  function downloadSquadCSV(teamId) {
    const data = getCategorizedSquad(teamId);
    if (!data) return;

    let csv = `Category,Player Name,Role,Price (₹ Cr),Overseas,Rating,Country\n`;

    const sections = [
      { name: 'WICKET-KEEPER', list: data.wicketKeepers },
      { name: 'BATTER', list: data.batters },
      { name: 'ALL-ROUNDER', list: data.allRounders },
      { name: 'BOWLER', list: data.bowlers }
    ];

    sections.forEach(sec => {
      sec.list.forEach(p => {
        csv += `"${sec.name}","${p.name.replace(/"/g, '""')}","${p.role}","${p.price.toFixed(2)}","${p.overseas ? 'Yes' : 'No'}","${p.rating}","${p.country}"\n`;
      });
    });

    csv += `\nSUMMARY,,,\n`;
    csv += `Total Spent,"₹${data.spent.toFixed(2)} Cr",,\n`;
    csv += `Remaining Purse,"₹${data.remaining.toFixed(2)} Cr",,\n`;
    csv += `Total Squad Size,"${(data.team.players || []).length} / 25",,\n`;
    csv += `Overseas Players,"${data.team.overseas || 0} / 8",,\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.team.shortName || data.team.name}_Squad_IPL2027.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // 2. Download Squad as Formatted Report TXT
  function downloadSquadTXT(teamId) {
    const textData = generateSquadTextReport(teamId);
    if (!textData) return;

    const blob = new Blob([textData.text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${textData.team.shortName || textData.team.name}_Official_Roster.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function generateSquadTextReport(teamId) {
    const data = getCategorizedSquad(teamId);
    if (!data) return null;

    const t = data.team;
    let txt = `========================================================================\n`;
    txt += `🏆 ${t.name.toUpperCase()} (${t.shortName || t.id}) - OFFICIAL IPL AUCTION ROSTER\n`;
    txt += `========================================================================\n`;
    txt += `Total Purse Spent: ₹${data.spent.toFixed(2)} Cr | Remaining: ₹${data.remaining.toFixed(2)} Cr\n`;
    txt += `Squad Size: ${(t.players || []).length} / 25 | Overseas: ${t.overseas || 0} / 8\n`;
    txt += `------------------------------------------------------------------------\n\n`;

    const categories = [
      { label: '🧤 WICKET-KEEPERS', list: data.wicketKeepers },
      { label: '🏏 BATTERS', list: data.batters },
      { label: '⚡ ALL-ROUNDERS', list: data.allRounders },
      { label: '🎯 BOWLERS', list: data.bowlers }
    ];

    categories.forEach(cat => {
      txt += `${cat.label} (${cat.list.length}):\n`;
      if (cat.list.length === 0) {
        txt += `  (None acquired)\n\n`;
      } else {
        cat.list.forEach((p, i) => {
          const num = String(i + 1).padStart(2, ' ');
          const name = p.name.padEnd(24, ' ');
          const price = `₹${p.price.toFixed(2)} Cr`.padStart(11, ' ');
          const ovr = `OVR: ${p.rating}`.padEnd(8, ' ');
          const flag = p.overseas ? '✈️ OS' : '🇮🇳 Ind';
          txt += `  ${num}. ${name} | ${price} | ${ovr} | ${flag}\n`;
        });
        txt += `\n`;
      }
    });

    txt += `========================================================================\n`;
    txt += `Generated via IPL Mega Auction Game Simulator 2027\n`;
    txt += `========================================================================\n`;

    return { text: txt, team: t };
  }

  // 3. Share Squad on WhatsApp
  function shareSquadWhatsApp(teamId) {
    const data = getCategorizedSquad(teamId);
    if (!data) return;

    const t = data.team;
    let msg = `*🏏 ${t.name.toUpperCase()} - IPL 2027 AUCTION ROSTER*\n`;
    msg += `💰 Spent: ₹${data.spent.toFixed(2)} Cr | Remaining: ₹${data.remaining.toFixed(2)} Cr\n`;
    msg += `👥 Squad: ${(t.players || []).length} players (Overseas: ${t.overseas || 0}/8)\n\n`;

    if (data.wicketKeepers.length > 0) {
      msg += `*🧤 Wicket-Keepers:* \n`;
      data.wicketKeepers.forEach(p => msg += `• ${p.name} (₹${p.price.toFixed(2)} Cr)\n`);
      msg += `\n`;
    }
    if (data.batters.length > 0) {
      msg += `*🏏 Batters:* \n`;
      data.batters.forEach(p => msg += `• ${p.name} (₹${p.price.toFixed(2)} Cr)\n`);
      msg += `\n`;
    }
    if (data.allRounders.length > 0) {
      msg += `*⚡ All-Rounders:* \n`;
      data.allRounders.forEach(p => msg += `• ${p.name} (₹${p.price.toFixed(2)} Cr)\n`);
      msg += `\n`;
    }
    if (data.bowlers.length > 0) {
      msg += `*🎯 Bowlers:* \n`;
      data.bowlers.forEach(p => msg += `• ${p.name} (₹${p.price.toFixed(2)} Cr)\n`);
      msg += `\n`;
    }

    msg += `_Play IPL Mega Auction Live at http://localhost:8000_`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  // 4. Copy Formatted Squad to Clipboard
  function copySquadText(teamId) {
    const report = generateSquadTextReport(teamId);
    if (!report) return;

    navigator.clipboard.writeText(report.text).then(() => {
      alert(`📋 ${report.team.name} full categorized roster copied to clipboard!`);
    }).catch(() => {
      alert('Copied roster data!');
    });
  }

  // 5. Native Web Share API
  function shareSquadNative(teamId) {
    const report = generateSquadTextReport(teamId);
    if (!report) return;

    if (navigator.share) {
      navigator.share({
        title: `${report.team.name} IPL Auction Roster`,
        text: report.text
      }).catch(() => {});
    } else {
      shareSquadWhatsApp(teamId);
    }
  }

  // Overwrite window.openTeamRosterModal so all franchise buttons open this categorized modal
  window.openTeamRosterModal = function(teamId) {
    openTeamSquadExportModal(teamId);
  };





  // =========================================================================
  // MULTIPLAYER ROOM & REDESIGN ENGINE (FULL IMPLEMENTATION)
  // =========================================================================

  window.RoomRules = {
    maxBidEnabled: false,
    maxBidAmount: 25,
    exceedLimitEnabled: false,
    exceedThreshold: 15,
    exceedMaxPlayers: 3,
    acceleratedEnabled: false,
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
    // Unify all storage keys for user identity so refresh never loses past data!
    const rawSaved = localStorage.getItem('ipl_user_name') || localStorage.getItem('ipl_manager_name');
    const isRealUser = rawSaved && rawSaved.trim() && rawSaved.trim().toLowerCase() !== 'manager';
    const welcomeModal = document.getElementById('welcomeNewUserModal');
    const inputWelcomeName = document.getElementById('inputWelcomeUserName');
    const btnSubmitWelcome = document.getElementById('btnSubmitWelcomeName');

    // Parse URL parameter ?roomId= or ?room=
    const urlParams = new URLSearchParams(window.location.search);
    const queryRoomId = urlParams.get('roomId') || urlParams.get('room');

    if (!isRealUser) {
      // New User or un-named user: ALWAYS Show Welcome Popup to collect their real name!
      if (welcomeModal) {
        welcomeModal.classList.remove('hidden');
        if (inputWelcomeName) {
          inputWelcomeName.value = '';
          inputWelcomeName.placeholder = 'Enter your name (e.g. Haswanth Kodali)';
          setTimeout(() => inputWelcomeName.focus(), 150);
          inputWelcomeName.onkeydown = (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (btnSubmitWelcome) btnSubmitWelcome.click();
            }
          };
        }
      }
      if (btnSubmitWelcome) {
        btnSubmitWelcome.onclick = async () => {
          const nameVal = (inputWelcomeName?.value || '').trim();
          if (!nameVal || nameVal.toLowerCase() === 'manager') {
            alert('Please enter your name to continue.');
            return;
          }
          localStorage.setItem('ipl_user_name', nameVal);
          localStorage.setItem('ipl_manager_name', nameVal);
          if (typeof StorageEngine !== 'undefined') {
            await StorageEngine.loginUser(nameVal, AppState.userTeamId || 'RCB');
          }
          if (welcomeModal) welcomeModal.classList.add('hidden');

          // If from a room link, redirect directly to that room!
          if (queryRoomId) {
            await handleJoinSpecificRoom(queryRoomId);
          } else {
            renderHomeAuctionHistory();
            renderPublicRoomsList();
          }
        };
      }
    } else {
      // Existing User: ensure both keys are set and restore past data immediately
      localStorage.setItem('ipl_user_name', rawSaved);
      localStorage.setItem('ipl_manager_name', rawSaved);
      if (welcomeModal) welcomeModal.classList.add('hidden');

      if (typeof StorageEngine !== 'undefined') {
        StorageEngine.loginUser(rawSaved, AppState.userTeamId || 'RCB').then(res => {
          if (res && res.user) updateUserDisplay(res.user);
          if (typeof renderHomeAuctionHistory === 'function') renderHomeAuctionHistory();
        });
      }

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
  async function handleJoinSpecificRoom(roomId) {
    if (!roomId) return;
    let cleanId = decodeURIComponent(String(roomId)).trim().toUpperCase();
    if (cleanId.includes('ROOMID=')) {
      cleanId = cleanId.split('ROOMID=')[1];
    } else if (cleanId.includes('ROOM=')) {
      cleanId = cleanId.split('ROOM=')[1];
    }
    cleanId = cleanId.split('&')[0].split('/')[0].split('#')[0].trim();
    if (/^\d{3,5}$/.test(cleanId)) {
      cleanId = 'IPL-' + cleanId;
    }

    // 1. Fetch latest room state from cloud / server (vital for cross-device links!)
    if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.fetchRoomFromServer === 'function') {
      try {
        await StorageEngine.fetchRoomFromServer(cleanId);
      } catch (err) {
        console.warn('Could not fetch room from server:', err);
      }
    }

    const user = StorageEngine.currentUser || { userId: 'user_' + Date.now(), userName: localStorage.getItem('ipl_user_name') || 'Manager' };
    const res = StorageEngine.joinRoom(cleanId, AppState.userTeamId, user.userId, user.userName);

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

  // Helper to determine if current viewer is the room host
  function isCurrentUserRoomHost(targetRoom) {
    if (!targetRoom) return false;
    const roomId = targetRoom.roomId;
    if (roomId && localStorage.getItem('ipl_host_room_' + roomId) === 'true') {
      return true;
    }
    const cUser = StorageEngine?.currentUser;
    const myId = cUser?.userId;
    const myName = (cUser?.userName || localStorage.getItem('ipl_user_name') || localStorage.getItem('ipl_manager_name') || '').trim();
    const myNorm = myName.toLowerCase();
    const hostNorm = (targetRoom.hostName || '').trim().toLowerCase();

    if (myId && targetRoom.hostId && myId === targetRoom.hostId) return true;
    if (myNorm && hostNorm && myNorm === hostNorm) return true;
    if (targetRoom.hostId === 'user_host' || !targetRoom.hostId) return true;

    if (targetRoom.players) {
      for (const t of Object.keys(targetRoom.players)) {
        const p = targetRoom.players[t];
        if (!p) continue;
        const pNorm = (p.userName || '').trim().toLowerCase();
        const matches = (myId && p.userId === myId) || (myNorm && pNorm && myNorm === pNorm);
        if (matches && (p.isHost === true || t === targetRoom.hostTeam)) {
          return true;
        }
      }
    }
    return false;
  }

  // Update Host Panel vs Guest Waiting Notice
  function updateLobbyHostControlsUI(targetRoom) {
    if (!targetRoom) return;
    const isHost = isCurrentUserRoomHost(targetRoom);
    const hostPanel = document.getElementById('lobbyHostPanel');
    const waitingNotice = document.getElementById('lobbyWaitingNotice');
    const editSettingsBtn = document.getElementById('lobbyEditSettingsBtn');

    if (isHost) {
      // Synchronize hostId with current user's userId if re-joining
      const cUser = StorageEngine?.currentUser;
      const myId = cUser?.userId;
      if (myId && targetRoom.hostId !== myId) {
        targetRoom.hostId = myId;
        if (targetRoom.hostTeam && targetRoom.players && targetRoom.players[targetRoom.hostTeam]) {
          targetRoom.players[targetRoom.hostTeam].userId = myId;
          targetRoom.players[targetRoom.hostTeam].isHost = true;
        }
        if (typeof StorageEngine !== 'undefined' && StorageEngine.saveRoom) {
          StorageEngine.saveRoom(targetRoom);
        }
      }

      if (hostPanel) hostPanel.classList.remove('hidden');
      if (waitingNotice) waitingNotice.classList.add('hidden');
      if (editSettingsBtn) {
        const isAuctionLive = window.AuctionStarted || targetRoom.status === 'started' || (typeof Game !== 'undefined' && Game.getState && Game.getState().phase !== 'home');
        if (isAuctionLive) {
          editSettingsBtn.classList.add('hidden');
          const editor = document.getElementById('lobbySettingsEditor');
          if (editor) editor.classList.add('hidden');
        } else {
          editSettingsBtn.classList.remove('hidden');
        }
      }
      initLobbyHostControls(targetRoom);
      initLobbySettingsEditor(targetRoom);
    } else {
      if (hostPanel) hostPanel.classList.add('hidden');
      if (waitingNotice) waitingNotice.classList.remove('hidden');
      if (editSettingsBtn) editSettingsBtn.classList.add('hidden');
    }
  }

  // Open Room Lobby UI
  function openRoomLobbyUI(room) {
    if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.sanitizeRoomTeams === 'function') {
      room = StorageEngine.sanitizeRoomTeams(room);
    }
    window.CurrentRoom = room;

    // 1. Ensure user is viewing the 'home' tab where the room lobby is located!
    if (typeof window.switchTab === 'function') {
      window.switchTab('home');
    }

    // Synchronize user team from room if user already has an assigned team in room
    const currentUser = StorageEngine?.currentUser;
    const myUserId = currentUser?.userId;
    const myUserName = (currentUser?.userName || localStorage.getItem('ipl_user_name') || '').trim();
    const myNormName = myUserName.toLowerCase();
    let userTeamInRoom = null;
    if (room && room.players) {
      for (const tId of Object.keys(room.players)) {
        const p = room.players[tId];
        const pNormName = (p && p.userName ? p.userName.trim().toLowerCase() : '');
        if (p && ((myUserId && p.userId === myUserId) || (myNormName && pNormName && pNormName === myNormName) || (room.hostId === myUserId && room.hostTeam === tId) || (myNormName && room.hostName && room.hostName.trim().toLowerCase() === myNormName && room.hostTeam === tId))) {
          userTeamInRoom = tId;
          break;
        }
      }
    }
    if (userTeamInRoom) {
      AppState.userTeamId = userTeamInRoom;
      AppState.selectedLandingTeamId = userTeamInRoom;
      AppState.selectedPlaying11TeamId = userTeamInRoom;
      AppState.selectedReviewTeamId = userTeamInRoom;
      if (typeof Game !== 'undefined') {
        if (typeof Game.changeUserTeam === 'function') Game.changeUserTeam(userTeamInRoom);
        else if (typeof Game.selectTeam === 'function') Game.selectTeam(userTeamInRoom);
        else if (Game.getState) Game.getState().userTeamId = userTeamInRoom;
      }
      if (typeof updateTopBar === 'function') updateTopBar();
    }

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

    // Wire Leave Room Button (releases team back to available!)
    const btnLeave = document.getElementById('btnLeaveRoomLobby');
    if (btnLeave) {
      btnLeave.onclick = () => {
        if (confirm('Are you sure you want to leave this auction room? Your franchise will be freed up for other players.')) {
          if (window._lobbySyncInterval) {
            clearInterval(window._lobbySyncInterval);
            window._lobbySyncInterval = null;
          }
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
    }

    // Update badges
    const roomBadge = document.getElementById('lobbyRoomBadge');
    if (roomBadge) roomBadge.textContent = `ROOM: ${room.roomId}`;

    const modeBadge = document.getElementById('lobbyModeBadge');
    if (modeBadge) modeBadge.textContent = room.mode === 'MINI' ? 'Mini Auction' : 'Mega Auction';

    const visBadge = document.getElementById('lobbyVisibilityBadge');
    if (visBadge) visBadge.textContent = room.visibility === 'PUBLIC' ? 'Public Room' : 'Private Room';

    // Share link (dynamic for both local Wi-Fi and online devices)
    const linkInput = document.getElementById('inputLobbyShareLink');
    let joinUrl = '';
    if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.getPrivateRoomLink === 'function') {
      joinUrl = StorageEngine.getPrivateRoomLink(room.roomId);
    } else {
      const host = window.location.hostname;
      const isLocalhost = (!host || host === 'localhost' || host === '127.0.0.1' || host === '::1');
      let baseOrigin = window.location.origin;
      if (isLocalhost && StorageEngine?.networkInfo?.lan_ip) {
        const port = window.location.port ? `:${window.location.port}` : (window.location.protocol === 'https:' ? ':8443' : ':8000');
        baseOrigin = `${window.location.protocol}//${StorageEngine.networkInfo.lan_ip}${port}`;
      }
      joinUrl = `${baseOrigin}${window.location.pathname || '/'}?roomId=${encodeURIComponent(room.roomId)}`;
    }
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
    updateLobbyHostControlsUI(room);

    // Real-time synchronization interval for lobby (syncs players and detects auction start)
    if (window._lobbySyncInterval) {
      clearInterval(window._lobbySyncInterval);
      window._lobbySyncInterval = null;
    }

    window._lobbySyncInterval = setInterval(async () => {
      if (!window.CurrentRoom || !window.CurrentRoom.roomId) {
        if (window._lobbySyncInterval) { clearInterval(window._lobbySyncInterval); window._lobbySyncInterval = null; }
        return;
      }
      const curLobby = document.getElementById('roomLobbySection');
      if (!curLobby || curLobby.classList.contains('hidden')) {
        if (window._lobbySyncInterval) { clearInterval(window._lobbySyncInterval); window._lobbySyncInterval = null; }
        return;
      }

      if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.fetchRoomFromServer === 'function') {
        try {
          const freshRoom = await StorageEngine.fetchRoomFromServer(window.CurrentRoom.roomId);
          if (freshRoom) {
            // Check if user was banned by host
            const myUserId = StorageEngine?.currentUser?.userId;
            if (freshRoom.banned && myUserId && freshRoom.banned.includes(myUserId)) {
              if (window._lobbySyncInterval) { clearInterval(window._lobbySyncInterval); window._lobbySyncInterval = null; }
              alert('🚫 You have been banned from this room by the host.');
              window.CurrentRoom = null;
              curLobby.classList.add('hidden');
              window.switchTab('home');
              return;
            }

            // Check if auction started by host
            if (freshRoom.status === 'started' && !window.AuctionStarted) {
              window.AuctionStarted = true;
              window.CurrentRoom = freshRoom;
              window.RoomRules = freshRoom.rules || window.RoomRules;
              if (window._lobbySyncInterval) { clearInterval(window._lobbySyncInterval); window._lobbySyncInterval = null; }
              window._lobbySyncInterval = null;

              // Synchronize user team
              const currentUser = StorageEngine?.currentUser;
              const myId = currentUser?.userId;
              const myUserName = (currentUser?.userName || localStorage.getItem('ipl_user_name') || '').trim().toLowerCase();
              let myAssignedTeam = AppState.userTeamId;
              if (freshRoom.players) {
                for (const t of Object.keys(freshRoom.players)) {
                  const p = freshRoom.players[t];
                  const pName = (p && p.userName ? p.userName.trim().toLowerCase() : '');
                  if (p && ((myId && p.userId === myId) || (myUserName && pName === myUserName))) {
                    myAssignedTeam = t;
                    break;
                  }
                }
              }
              AppState.userTeamId = myAssignedTeam;
              AppState.selectedLandingTeamId = myAssignedTeam;
              AppState.selectedPlaying11TeamId = myAssignedTeam;
              AppState.selectedReviewTeamId = myAssignedTeam;
              if (typeof Game !== 'undefined') {
                if (typeof setAuctionMode === 'function') setAuctionMode(freshRoom.mode || 'MINI');
                if (typeof Game.changeUserTeam === 'function') Game.changeUserTeam(myAssignedTeam);
                else if (typeof Game.selectTeam === 'function') Game.selectTeam(myAssignedTeam);
                if (Game.setBidDuration) Game.setBidDuration(window.RoomRules.timer || 10);
                Game.startAuction();
              }
              if (typeof updateTopBar === 'function') updateTopBar();
              window.switchTab('auction');
              switchArenaTab('bidding');
              AuctionAudio.playHammerHit();
              return;
            }

            // Update local room reference & re-render lobby teams and players
            window.CurrentRoom = freshRoom;
            renderLobbyTeamsGrid(freshRoom);
            renderLobbyPlayersList(freshRoom);
            updateLobbyHostControlsUI(freshRoom);

            // Automatic Heartbeat: Keep current player active in cloud room every 7 seconds
            if (!window._lastHeartbeat || (Date.now() - window._lastHeartbeat > 7000)) {
              window._lastHeartbeat = Date.now();
              const myUserId = StorageEngine?.currentUser?.userId;
              if (myUserId && typeof StorageEngine.updatePlayerHeartbeat === 'function') {
                StorageEngine.updatePlayerHeartbeat(freshRoom.roomId, myUserId);
              }
            }
          }
        } catch (e) {
          console.warn('[Lobby Sync] Fetch error:', e);
        }
      }
    }, 2500);
  }

  // =========================================================================
  // HOST INLINE SETTINGS EDITOR
  // Allows host to change Max Bid Ceiling, Exceed Limit, Accelerated Auction
  // Format (Mini/Mega) is NOT changeable after room creation
  // =========================================================================
  function initLobbySettingsEditor(room) {
    const toggleBtn = document.getElementById('btnToggleLobbySettings');
    const editor = document.getElementById('lobbySettingsEditor');
    const saveBtn = document.getElementById('btnSaveLobbySettings');
    const cancelBtn = document.getElementById('btnCancelLobbySettings');
    const statusMsg = document.getElementById('settingsSaveStatus');
    if (!toggleBtn || !editor) return;

    // ── LOCK CHECK: If auction already started, hide settings editor completely ──
    const isAuctionLive = window.AuctionStarted || room.status === 'started' || (typeof Game !== 'undefined' && Game.getState && Game.getState().phase !== 'home');
    if (isAuctionLive) {
      const editBtn = document.getElementById('lobbyEditSettingsBtn');
      if (editBtn) editBtn.classList.add('hidden');
      editor.classList.add('hidden');
      return; // Strictly lock out any editing once auction starts
    }
    // ── END LOCK CHECK ──

    // Populate editor fields from current room rules
    const rules = room.rules || {};
    const chkMaxBid = document.getElementById('editMaxBidEnabled');
    const inpMaxBid = document.getElementById('editMaxBidAmount');
    const chkExceed = document.getElementById('editExceedLimitEnabled');
    const inpExceedMax = document.getElementById('editExceedMaxPlayers');
    const inpExceedThreshold = document.getElementById('editExceedThreshold');
    const chkAccelerated = document.getElementById('editAcceleratedEnabled');

    if (chkMaxBid) chkMaxBid.checked = !!rules.maxBidEnabled;
    if (inpMaxBid) inpMaxBid.value = rules.maxBidAmount || 25;
    if (chkExceed) chkExceed.checked = !!rules.exceedLimitEnabled;
    if (inpExceedMax) inpExceedMax.value = rules.exceedMaxPlayers || 3;
    if (inpExceedThreshold) inpExceedThreshold.value = rules.exceedThreshold || 15;
    if (chkAccelerated) chkAccelerated.checked = !!rules.acceleratedEnabled;

    // Toggle editor visibility
    toggleBtn.onclick = () => {
      if (editor.classList.contains('hidden')) {
        editor.classList.remove('hidden');
        toggleBtn.querySelector('span:last-child').textContent = 'Close Settings Editor';
      } else {
        editor.classList.add('hidden');
        toggleBtn.querySelector('span:last-child').textContent = 'Edit Room Settings (Host Only)';
      }
    };

    // Cancel button
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        editor.classList.add('hidden');
        toggleBtn.querySelector('span:last-child').textContent = 'Edit Room Settings (Host Only)';
      };
    }

    // Save button
    if (saveBtn) {
      saveBtn.onclick = () => {
        const isLive = window.AuctionStarted || room.status === 'started' || (typeof Game !== 'undefined' && Game.getState && Game.getState().phase !== 'home');
        if (isLive) {
          alert('⚠️ Room settings can only be changed before the auction starts. Modifying rules is locked once bidding begins.');
          editor.classList.add('hidden');
          const editBtn = document.getElementById('lobbyEditSettingsBtn');
          if (editBtn) editBtn.classList.add('hidden');
          return;
        }

        // Read values from editor
        const newRules = {
          maxBidEnabled: chkMaxBid ? chkMaxBid.checked : false,
          maxBidAmount: inpMaxBid ? Number(inpMaxBid.value) || 25 : 25,
          exceedLimitEnabled: chkExceed ? chkExceed.checked : false,
          exceedThreshold: inpExceedThreshold ? Number(inpExceedThreshold.value) || 15 : 15,
          exceedMaxPlayers: inpExceedMax ? Number(inpExceedMax.value) || 3 : 3,
          acceleratedEnabled: chkAccelerated ? chkAccelerated.checked : false,
          timer: rules.timer || 10
        };

        // Update room object
        room.rules = newRules;
        if (window.CurrentRoom) window.CurrentRoom.rules = newRules;

        // Persist to storage
        if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.saveRoom === 'function') {
          StorageEngine.saveRoom(room);
        } else {
          try {
            const db = JSON.parse(localStorage.getItem('ipl_auction_rooms') || localStorage.getItem('ipl_all_active_rooms') || '{}');
            db[room.roomId] = room;
            localStorage.setItem('ipl_all_active_rooms', JSON.stringify(db));
            localStorage.setItem('ipl_auction_rooms', JSON.stringify(db));
          } catch (e) {}
        }

        // Update display badges immediately
        const rMax = document.getElementById('ruleDisplayMaxBid');
        if (rMax) rMax.textContent = newRules.maxBidEnabled ? 'Max ₹' + newRules.maxBidAmount + '.00 Cr' : 'None (No Cap)';

        const rExceed = document.getElementById('ruleDisplayExceedLimit');
        if (rExceed) rExceed.textContent = newRules.exceedLimitEnabled ? 'Max ' + newRules.exceedMaxPlayers + ' > ₹' + newRules.exceedThreshold + ' Cr' : 'Unlimited';

        const rAcc = document.getElementById('ruleDisplayAccelerated');
        if (rAcc) rAcc.textContent = newRules.acceleratedEnabled ? 'Enabled (ON)' : 'Disabled (OFF)';

        // Also update live Game engine rules if auction is running
        try {
          if (typeof Game !== 'undefined' && Game.getState) {
            const gs = Game.getState();
            if (gs) {
              gs.maxBidEnabled = newRules.maxBidEnabled;
              gs.maxBidAmount = newRules.maxBidAmount;
              gs.exceedLimitEnabled = newRules.exceedLimitEnabled;
              gs.exceedThreshold = newRules.exceedThreshold;
              gs.exceedMaxPlayers = newRules.exceedMaxPlayers;
              gs.acceleratedEnabled = newRules.acceleratedEnabled;
            }
          }
        } catch (e) {}

        // Show success feedback
        if (statusMsg) {
          statusMsg.classList.remove('hidden');
          statusMsg.textContent = '✅ Settings updated!';
          setTimeout(() => {
            if (statusMsg) statusMsg.classList.add('hidden');
          }, 3000);
        }

        // Close editor
        editor.classList.add('hidden');
        toggleBtn.querySelector('span:last-child').textContent = 'Edit Room Settings (Host Only)';

        console.log('[IPL Auction] Room rules updated:', newRules);
      };
    }
  }

  // Render Lobby Teams Grid (Disables taken teams, lets user pick remaining)
  function renderLobbyTeamsGrid(room) {
    const grid = document.getElementById('lobbyTeamsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const allTeams = ['CSK', 'MI', 'RCB', 'KKR', 'DC', 'PBKS', 'RR', 'SRH', 'GT', 'LSG'];
    const takenMap = room.players || {};
    const currentUser = StorageEngine?.currentUser;
    const myUserId = currentUser?.userId;
    const myUserName = (currentUser?.userName || localStorage.getItem('ipl_user_name') || '').trim();
    const myNormName = myUserName.toLowerCase();
    const myTeamId = AppState.userTeamId || (typeof Game !== 'undefined' && Game.getState && Game.getState().userTeamId);

    allTeams.forEach(teamId => {
      const takenBy = takenMap[teamId];
      const isTaken = !!takenBy;
      const takenNormName = (takenBy && takenBy.userName ? takenBy.userName.trim().toLowerCase() : '');
      const takenUserId = (takenBy ? takenBy.userId : '');

      // Accurate check: User is this team if registered in room (by userId, normalized userName, or host assignment), or if AppState/Game matches and it's not taken by someone else
      const isMyTeamInRoom = isTaken && (
        (myUserId && takenUserId === myUserId) ||
        (myNormName && takenNormName && myNormName === takenNormName) ||
        (room.hostId === myUserId && room.hostTeam === teamId) ||
        (myNormName && room.hostName && room.hostName.trim().toLowerCase() === myNormName && room.hostTeam === teamId)
      );

      const isMyTeam = isMyTeamInRoom || (!isTaken && myTeamId === teamId);

      const card = document.createElement('div');
      card.className = `p-3 rounded-2xl border-2 transition relative flex flex-col justify-between ${
        isMyTeam
          ? 'bg-amber-950/60 border-amber-500 shadow-md ring-2 ring-amber-400/40 cursor-default'
          : (isTaken
            ? 'bg-slate-950/70 border-slate-800 opacity-60 cursor-not-allowed'
            : 'bg-slate-900 border-slate-700 hover:border-amber-400 cursor-pointer shadow-lg hover:scale-102')
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-sm text-white">${teamId}</span>
          ${isMyTeam
            ? `<span class="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase">YOU</span>`
            : (isTaken
              ? `<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-red-950 text-red-300 border border-red-800">TAKEN</span>`
              : `<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">AVAILABLE</span>`)
          }
        </div>
        <div class="text-[10px] text-slate-400 mt-2 truncate">
          ${isMyTeam
            ? `<strong class="text-amber-400">Managing (Your Team)</strong>`
            : (isTaken ? `Manager: ${takenBy.userName || 'Player'}` : 'Click to Select')}
        </div>
      `;

      if (!isTaken && !isMyTeam) {
        card.onclick = () => {
          executeLiveTeamChange(teamId);
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

    const isCurrentUserHost = isCurrentUserRoomHost(room);

    playerKeys.forEach(tId => {
      const p = players[tId];
      const now = Date.now();
      const lastSeenTime = p.lastSeen ? (typeof p.lastSeen === 'number' ? p.lastSeen : new Date(p.lastSeen).getTime()) : 0;
      const isStale = lastSeenTime > 0 && (now - lastSeenTime > 25000);
      const isOnline = (p.isOnline !== false) && !isStale;
      const isHost = p.isHost || p.userId === room.hostId || (room.hostName && p.userName && p.userName.trim().toLowerCase() === room.hostName.trim().toLowerCase());

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
              <span class="${isOnline ? 'text-emerald-400' : 'text-red-400'} font-medium">${isOnline ? '🟢 Online' : '🔴 Offline'}</span>
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
        if (!room.players || Object.keys(room.players).length < 2) {
          alert('At least 2 players must join before the auction can start.');
          return;
        }
        // Ensure user's team in Game matches room team!
        let activeTeam = room.hostTeam;
        const myId = StorageEngine?.currentUser?.userId;
        const myName = StorageEngine?.currentUser?.userName || localStorage.getItem('ipl_user_name');
        if (room.players) {
          for (const tId of Object.keys(room.players)) {
            const p = room.players[tId];
            if (p && (p.isHost || p.userId === room.hostId || p.userId === myId || (myName && p.userName === myName))) {
              activeTeam = tId;
              break;
            }
          }
        }
        if (!activeTeam) {
          activeTeam = AppState.userTeamId || (typeof Game !== 'undefined' && Game.getState ? Game.getState().userTeamId : 'RCB');
        }

        AppState.userTeamId = activeTeam;
        AppState.selectedLandingTeamId = activeTeam;
        AppState.selectedPlaying11TeamId = activeTeam;
        AppState.selectedReviewTeamId = activeTeam;

        // Apply auction mode & start
        if (typeof setAuctionMode === 'function') {
          setAuctionMode(room.mode || 'MINI');
        }
        if (typeof Game !== 'undefined') {
          if (typeof Game.changeUserTeam === 'function') Game.changeUserTeam(activeTeam);
          else if (typeof Game.selectTeam === 'function') Game.selectTeam(activeTeam);
          else if (Game.getState) Game.getState().userTeamId = activeTeam;

          if (Game.setBidDuration) Game.setBidDuration(window.RoomRules.timer || 10);
          Game.startAuction();
        }

        // Stop lobby sync interval as auction has now begun
        if (window._lobbySyncInterval) {
          clearInterval(window._lobbySyncInterval);
          window._lobbySyncInterval = null;
        }

        // ── LOCK SETTINGS: Hide settings editor after auction starts ──
        window.AuctionStarted = true;
        room.status = 'started';
        if (window.CurrentRoom) window.CurrentRoom.status = 'started';
        // Hide the edit settings button & editor
        const editBtn = document.getElementById('lobbyEditSettingsBtn');
        const settingsEditor = document.getElementById('lobbySettingsEditor');
        if (editBtn) editBtn.classList.add('hidden');
        if (settingsEditor) settingsEditor.classList.add('hidden');
        // Persist started status
        if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.saveRoom === 'function') {
          StorageEngine.saveRoom(room);
        }
        // ── END LOCK SETTINGS ──

        if (typeof updateTopBar === 'function') updateTopBar();
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
      btnOpenCreate.onclick = () => {
        const selectHostTeam = document.getElementById('selectCreateRoomHostTeam');
        if (selectHostTeam) {
          selectHostTeam.value = AppState.userTeamId || (typeof Game !== 'undefined' && Game.getState ? Game.getState().userTeamId : 'MI') || 'MI';
        }
        modalCreate.classList.remove('hidden');
      };
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
      exceedLimitEnabled: false,
      exceedThreshold: 15,
      exceedMaxPlayers: 3,
      acceleratedEnabled: false,
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
      btnConfirm.onclick = async () => {
        createConfig.maxBidAmount = Number(document.getElementById('selectMaxBidAmount')?.value) || 25;
        createConfig.exceedThreshold = Number(document.getElementById('selectExceedAmount')?.value) || 15;
        createConfig.exceedMaxPlayers = Number(document.getElementById('selectExceedPlayersCount')?.value) || 3;
        
        const selectHostTeam = document.getElementById('selectCreateRoomHostTeam');
        const chosenTeam = (selectHostTeam ? selectHostTeam.value : null)
          || AppState.userTeamId
          || (typeof Game !== 'undefined' && Game.getState && Game.getState().userTeamId)
          || 'MI';
        createConfig.hostTeam = chosenTeam;
        AppState.userTeamId = chosenTeam;
        AppState.selectedLandingTeamId = chosenTeam;
        AppState.selectedPlaying11TeamId = chosenTeam;
        AppState.selectedReviewTeamId = chosenTeam;
        if (typeof Game !== 'undefined') {
          if (typeof Game.changeUserTeam === 'function') Game.changeUserTeam(chosenTeam);
          else if (typeof Game.selectTeam === 'function') Game.selectTeam(chosenTeam);
          else if (Game.getState) Game.getState().userTeamId = chosenTeam;
        }
        if (typeof StorageEngine !== 'undefined' && StorageEngine.updateUserTeam) {
          StorageEngine.updateUserTeam(chosenTeam);
        }

        const room = await StorageEngine.createAuctionRoom(createConfig);
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
      btnConfirmJoin.onclick = async () => {
        let code = inputJoinCode.value.trim();
        if (!code) {
          alert('Please enter a room code or link.');
          return;
        }
        if (code.toLowerCase().includes('roomid=')) {
          code = code.split(/roomid=/i)[1];
        } else if (code.toLowerCase().includes('room=')) {
          code = code.split(/room=/i)[1];
        }
        code = decodeURIComponent(code).split('&')[0].split('/')[0].split('#')[0].trim().toUpperCase();
        if (/^\d{3,5}$/.test(code)) {
          code = 'IPL-' + code;
        }
        const prevText = btnConfirmJoin.textContent;
        btnConfirmJoin.textContent = 'Joining...';
        btnConfirmJoin.disabled = true;
        try {
          await handleJoinSpecificRoom(code);
          if (modalJoin) modalJoin.classList.add('hidden');
        } finally {
          btnConfirmJoin.textContent = prevText;
          btnConfirmJoin.disabled = false;
        }
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
  async function renderPublicRoomsList() {
    const grid = document.getElementById('publicRoomsGrid');
    if (!grid) return;

    // Fetch latest active public rooms from server for cross-device visibility
    if (typeof StorageEngine !== 'undefined' && typeof StorageEngine.fetchPublicRoomsFromServer === 'function') {
      try {
        await StorageEngine.fetchPublicRoomsFromServer();
      } catch (e) {}
    }

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

      card.querySelector('.btn-join-public-room').onclick = async (e) => {
        const btn = e.currentTarget;
        const prevText = btn.textContent;
        btn.textContent = 'Joining...';
        btn.disabled = true;
        try {
          await handleJoinSpecificRoom(room.roomId);
        } finally {
          btn.textContent = prevText;
          btn.disabled = false;
        }
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
        if (typeof Game !== 'undefined') {
          const gs = Game.getState ? Game.getState() : Game.GameState;
          if (gs) {
            if (gs.currentPlayerIndex >= gs.auctionPool.length - 1 && gs.auctionPool.length > 0) {
              gs.phase = 'bidding';
              gs.isPaused = false;
              if (typeof Game.loadPlayer === 'function') {
                Game.loadPlayer(gs.currentPlayerIndex);
              }
            }
          }
        }
        switchArenaTab('bidding');
      };
    }

    if (btnFinish) {
      btnFinish.onclick = () => {
        if (typeof Game !== 'undefined' && typeof Game.endAuction === 'function') {
          Game.endAuction();
        } else {
          switchArenaTab('playing11');
        }
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
      wireAdditionalButtons();
    });
  } else {
    setTimeout(initWelcomeAndRoomFlow, 300);
    wireAdditionalButtons();
  }


  // Wire additional UI buttons (PDF, PNG, Impact Player)
  
  // =========================================================================
  // LIVE IN-AUCTION TEAM CHANGER
  // =========================================================================

  function openChangeTeamModal() {
    const modal = document.getElementById('changeTeamModal');
    const grid = document.getElementById('changeTeamGrid');
    if (!modal || !grid) return;

    const allTeams = (typeof TEAMS !== 'undefined') ? TEAMS : (Game.getTeams ? Game.getTeams() : []);
    const currentRoom = window.CurrentRoom || null;
    const roomPlayers = (currentRoom && currentRoom.players) ? currentRoom.players : {};
    const currentUser = (typeof StorageEngine !== 'undefined' && StorageEngine.getCurrentUser) ? StorageEngine.getCurrentUser() : null;
    const myUserId = currentUser?.userId || 'me';
    const myUserName = currentUser?.userName || localStorage.getItem('ipl_user_name');

    // Find user's actual assigned team in this room
    let roomTeam = null;
    if (currentRoom && currentRoom.players) {
      for (const tId of Object.keys(currentRoom.players)) {
        const p = currentRoom.players[tId];
        if (p && (p.userId === myUserId || (myUserName && p.userName === myUserName))) {
          roomTeam = tId;
          break;
        }
      }
    }

    const currentTeamId = roomTeam || ((typeof Game !== 'undefined' && Game.getState) ? Game.getState().userTeamId : (AppState.userTeamId || 'RCB'));

    grid.innerHTML = allTeams.map(t => {
      const isCurrent = t.id === currentTeamId;
      const takenByPlayer = roomPlayers[t.id];
      const isTakenByOther = takenByPlayer && takenByPlayer.userId !== myUserId && (!myUserName || takenByPlayer.userName !== myUserName);
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

    const currentRoom = window.CurrentRoom || null;
    const currentUser = (typeof StorageEngine !== 'undefined' && StorageEngine.getCurrentUser) ? StorageEngine.getCurrentUser() : null;
    const myUserId = currentUser?.userId || 'me';
    const myUserName = currentUser?.userName || localStorage.getItem('ipl_user_name') || 'Manager';

    // Find the team currently occupied by this user in CurrentRoom
    let roomTeamOfUser = null;
    const myNormName = (myUserName ? myUserName.trim().toLowerCase() : '');
    if (currentRoom && currentRoom.players) {
      for (const t of Object.keys(currentRoom.players)) {
        const p = currentRoom.players[t];
        const pNormName = (p && p.userName ? p.userName.trim().toLowerCase() : '');
        if (p && ((myUserId && p.userId === myUserId) || (myNormName && pNormName && pNormName === myNormName))) {
          roomTeamOfUser = t;
          break;
        }
      }
    }

    const gameUserTeam = (typeof Game !== 'undefined' && Game.getState) ? Game.getState().userTeamId : null;
    const oldTeamId = roomTeamOfUser || gameUserTeam || AppState.userTeamId || 'RCB';

    // Only abort if user ALREADY occupies newTeamId in BOTH Game and Room!
    if (newTeamId === oldTeamId && (!currentRoom || roomTeamOfUser === newTeamId) && gameUserTeam === newTeamId) {
      alert('You are already managing this franchise.');
      return;
    }

    console.log(`[IPL Auction] Switching franchise from ${oldTeamId} (room: ${roomTeamOfUser}, game: ${gameUserTeam}) to ${newTeamId}`);

    // Check availability in current room if player is in a room
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
        for (const t of Object.keys(currentRoom.players)) {
          const p = currentRoom.players[t];
          const pNormName = (p && p.userName ? p.userName.trim().toLowerCase() : '');
          if ((myUserId && p.userId === myUserId) || (myNormName && pNormName === myNormName)) {
            delete currentRoom.players[t];
          }
        }
        const isHost = (currentRoom.hostId === myUserId) || (currentRoom.hostName === myUserName);
        currentRoom.players[newTeamId] = {
          userId: myUserId,
          userName: myUserName,
          status: 'online',
          isOnline: true,
          isHost: isHost,
          joinedAt: new Date().toISOString()
        };
        if (isHost) currentRoom.hostTeam = newTeamId;
        try {
          const db = JSON.parse(localStorage.getItem('ipl_auction_rooms') || localStorage.getItem('ipl_all_active_rooms') || '{}');
          db[currentRoom.roomId] = currentRoom;
          localStorage.setItem('ipl_auction_rooms', JSON.stringify(db));
          localStorage.setItem('ipl_all_active_rooms', JSON.stringify(db));
        } catch (e) {}
      }
    }

    // 1. Update Game Engine
    try {
      if (typeof Game !== 'undefined') {
        if (typeof Game.changeUserTeam === 'function') {
          Game.changeUserTeam(newTeamId);
        } else if (typeof Game.selectTeam === 'function') {
          Game.selectTeam(newTeamId);
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
          StorageEngine.currentUser.favoriteTeam = newTeamId;
          if (typeof StorageEngine.saveCurrentUser === 'function') StorageEngine.saveCurrentUser();
        }
        if (typeof StorageEngine.assignMultiplayerManager === 'function') {
          StorageEngine.assignMultiplayerManager(newTeamId, myUserId, myUserName);
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

    // 6. Close change team modal if open
    const modal = document.getElementById('changeTeamModal');
    if (modal) modal.classList.add('hidden');

    // 7. If room lobby is open, re-render it
    if (window.CurrentRoom) {
      renderLobbyTeamsGrid(window.CurrentRoom);
      renderLobbyPlayersList(window.CurrentRoom);
    }

    // 8. Sound & Feedback
    try {
      if (typeof AuctionAudio !== 'undefined' && typeof AuctionAudio.playSoldFanfare === 'function') {
        AuctionAudio.playSoldFanfare();
      }
    } catch (e) {}

    const targetTeam = (typeof Game !== 'undefined' && Game.getTeam) ? Game.getTeam(newTeamId) : null;
    const teamTitle = targetTeam ? (targetTeam.shortName || targetTeam.name) : newTeamId;
    alert(`🎉 Franchise successfully changed to ${teamTitle}! All squad data, purse, and bidding controls have been updated.`);
  }

  window.openChangeTeamModal = openChangeTeamModal;
  window.executeLiveTeamChange = executeLiveTeamChange;

  function wireAdditionalButtons() {
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

        const promptList = bench.map((p, i) => `${i + 1}. ${p.name} (${p.role || 'Player'}) - ₹${Number(p.soldPrice || p.price || 0).toFixed(2)} Cr`).join('\n');
        const choice = prompt(`Select Impact Player from Bench:\n\n${promptList}\n\nEnter player number (1-${bench.length}):`);
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
  }


  // When player leaves or closes tab, mark them offline in room
  window.addEventListener('beforeunload', () => {
    try {
      if (window.CurrentRoom && StorageEngine?.currentUser?.userId) {
        StorageEngine.setPlayerOnlineStatus(window.CurrentRoom.roomId, StorageEngine.currentUser.userId, false);
      }
    } catch (e) {}
  });

})();
