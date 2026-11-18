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
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  function initApp() {
    cacheDOMElements();
    setupEventListeners();

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

    // Initial render
    renderLandingPage();
    renderAllViews();
    renderMultiplayerPaddles();

    // Ensure mode badge reflects Mini mode initially
    if (DOM.auctionModeBadge) {
      DOM.auctionModeBadge.textContent = 'MINI AUCTION (40/60)';
      DOM.auctionModeBadge.className = 'text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-purple-900/60 text-purple-300 border border-purple-700/50';
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
    DOM.btnAudioToggle.addEventListener('click', () => {
      const isMuted = AuctionAudio.toggleMute();
      DOM.audioIcon.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) AuctionAudio.playBidPaddle();
    });

    // Pause / Resume Toggle
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

    // Open Scout Modal Button
    DOM.btnOpenScoutModal.addEventListener('click', () => {
      Game.pauseGame();
      openScoutModal();
    });

    DOM.btnCloseScoutModal.addEventListener('click', () => {
      DOM.scoutModal.classList.add('hidden');
    });

    DOM.btnModalResumeAuction.addEventListener('click', () => {
      DOM.scoutModal.classList.add('hidden');
      Game.resumeGame();
    });

    // Mode Toggle Button
    DOM.btnModeToggle.addEventListener('click', () => {
      Game.pauseGame();
      DOM.modeSelectModal.classList.remove('hidden');
    });

    DOM.btnCloseModeModal.addEventListener('click', () => {
      DOM.modeSelectModal.classList.add('hidden');
      Game.resumeGame();
    });

    DOM.btnChooseMega.addEventListener('click', () => {
      switchAuctionMode('MEGA');
    });

    DOM.btnChooseMini.addEventListener('click', () => {
      switchAuctionMode('MINI');
    });

    // Bidding Action Buttons
    DOM.btnUserBid.addEventListener('click', () => {
      const state = Game.getState();
      if (state.phase !== 'auction' || state.isPaused) return;

      const userTeam = Game.getUserTeam();
      if (userTeam) {
        const success = Game.placeBid(userTeam.id);
        if (success) {
          triggerBidEffects(userTeam.id);
        }
      }
    });

    DOM.btnPassPlayer.addEventListener('click', () => {
      AuctionAudio.playHammerStrike(0.5);
      Game.passPlayer();
    });

    // Quick Raise Buttons
    DOM.quickRaiseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const addCr = parseFloat(btn.dataset.add);
        const state = Game.getState();
        const userTeam = Game.getUserTeam();
        if (userTeam && !state.isPaused) {
          Game.placeBid(userTeam.id);
          triggerBidEffects(userTeam.id);
        }
      });
    });

    // Auto-Bid Toggle
    DOM.chkAutoBid.addEventListener('change', (e) => {
      if (e.target.checked) {
        AuctionAudio.playBidPaddle();
      }
    });

    // Playing 11 Team Select
    DOM.selectPlaying11Team.addEventListener('change', (e) => {
      AppState.selectedPlaying11TeamId = e.target.value;
      renderPlaying11View();
    });

    // User Review Team Select
    DOM.userReviewTeamSelect.addEventListener('change', (e) => {
      AppState.selectedReviewTeamId = e.target.value;
      renderUserReviewCard();
    });

    // Ratings Mode Switcher
    DOM.btnRatingModeNormal.addEventListener('click', () => {
      setRatingMode('normal');
    });
    DOM.btnRatingModeUser.addEventListener('click', () => {
      setRatingMode('user');
    });

    // Catalog Filters
    DOM.catalogSearchInput.addEventListener('input', renderCatalogGrid);
    DOM.catalogSetFilter.addEventListener('change', renderCatalogGrid);
    DOM.catalogRoleFilter.addEventListener('change', renderCatalogGrid);
    DOM.catalogOverseasFilter.addEventListener('change', renderCatalogGrid);

    // Reshuffle Pool Button
    if (DOM.btnShufflePool) {
      DOM.btnShufflePool.addEventListener('click', () => {
        handleManualShuffle();
      });
    }

    // Landing Page Mode Selectors
    if (DOM.cardModeMini && DOM.cardModeMega) {
      DOM.cardModeMini.addEventListener('click', () => {
        setAuctionMode('MINI');
      });
      DOM.cardModeMega.addEventListener('click', () => {
        setAuctionMode('MEGA');
      });
    }

    // Landing Pool Size Selectors
    if (DOM.btnPoolQuick && DOM.btnPoolFull) {
      DOM.btnPoolQuick.addEventListener('click', () => {
        setPoolSize('quick');
      });
      DOM.btnPoolFull.addEventListener('click', () => {
        setPoolSize('full');
      });
    }

    // Random Team Pick
    if (DOM.btnRandomTeamLanding) {
      DOM.btnRandomTeamLanding.addEventListener('click', () => {
        pickRandomLandingTeam();
      });
    }

    // Launch Auction from Landing Page
    if (DOM.btnEnterAuctionRoom) {
      DOM.btnEnterAuctionRoom.addEventListener('click', () => {
        startAuctionFromLanding();
      });
    }
    if (DOM.btnStartAuctionHero) {
      DOM.btnStartAuctionHero.addEventListener('click', () => {
        startAuctionFromLanding();
      });
    }

    // Power Jump Button (+1.0 Cr jump bid)
    if (DOM.btnPowerJump) {
      DOM.btnPowerJump.addEventListener('click', () => {
        const userTeam = Game.getUserTeam();
        if (userTeam) {
          const success = Game.powerJump(userTeam.id);
          if (success) {
            triggerBidEffects(userTeam.id);
            if (DOM.auctioneerCallout) {
              DOM.auctioneerCallout.textContent = `⚡ POWER JUMP! +₹1.00 Cr RAISE BY ${userTeam.shortName || userTeam.name}!`;
            }
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
      DOM.btnOpenSupabaseModal.addEventListener('click', () => {
        openSupabaseConfigModal();
      });
    }
    if (DOM.btnCloseSupabaseModal) {
      DOM.btnCloseSupabaseModal.addEventListener('click', () => {
        DOM.supabaseConfigModal.classList.add('hidden');
      });
    }
    if (DOM.btnCloseSupabaseModal2) {
      DOM.btnCloseSupabaseModal2.addEventListener('click', () => {
        DOM.supabaseConfigModal.classList.add('hidden');
      });
    }
    if (DOM.btnSaveSupabaseConfig) {
      DOM.btnSaveSupabaseConfig.addEventListener('click', () => {
        saveSupabaseConfig();
      });
    }
    if (DOM.btnClearSupabaseConfig) {
      DOM.btnClearSupabaseConfig.addEventListener('click', () => {
        clearSupabaseConfig();
      });
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
      DOM.btnExecuteRelogin.addEventListener('click', () => {
        handleRelogin();
      });
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
      DOM.btnMultiplayerLobby.addEventListener('click', () => {
        openMultiplayerModal();
      });
    }

    if (DOM.btnPrivateLinkHeader) {
      DOM.btnPrivateLinkHeader.addEventListener('click', () => {
        openMultiplayerModal();
      });
    }

    if (DOM.btnCopyPrivateLink) {
      DOM.btnCopyPrivateLink.addEventListener('click', () => {
        copyPrivateLinkToClipboard();
      });
    }

    if (DOM.btnCreateNewRoom) {
      DOM.btnCreateNewRoom.addEventListener('click', () => {
        handleCreateNewRoom();
      });
    }

    if (DOM.btnCloseMultiplayerModal) {
      DOM.btnCloseMultiplayerModal.addEventListener('click', () => {
        DOM.multiplayerModal.classList.add('hidden');
      });
    }

    if (DOM.btnSaveMultiplayerRoom) {
      DOM.btnSaveMultiplayerRoom.addEventListener('click', () => {
        saveMultiplayerRoom();
      });
    }

    // GAME ENGINE REACTIVE EVENT SUBSCRIPTIONS
    Game.on('stateChange', () => {
      updateTopBar();
      updateAuctionArena();
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
      }
      switchTab('ratings');
    });
    });
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
    if (tabKey === 'playing11') renderPlaying11View();
    if (tabKey === 'franchises') renderFranchisesView();
    if (tabKey === 'catalog') renderCatalogGrid();
    if (tabKey === 'ratings') renderRatingsView();
  }

  function switchAuctionMode(mode) {
    AppState.auctionMode = mode;
    DOM.modeSelectModal.classList.add('hidden');

    DOM.auctionModeBadge.textContent = mode === 'MINI' ? 'MINI AUCTION (40/60)' : 'MEGA AUCTION';
    DOM.auctionModeBadge.className = mode === 'MINI'
      ? 'text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-purple-900/60 text-purple-300 border border-purple-700/50'
      : 'text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50';

    DOM.modeLabel.textContent = `Mode: ${mode === 'MINI' ? 'Mini' : 'Mega'}`;

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

    // Image with reliable SVG vector fallback
    DOM.playerPhoto.src = getPlayerImage(player);

    // Career Stats Ribbon
    const stats = getEnhancedPlayerStats(player);
    if (stats) {
      DOM.statMatches.textContent = stats.matches || '--';
      DOM.statRuns.textContent = stats.runs || 0;
      DOM.statSR.textContent = stats.strikeRate || '--';
      DOM.statAvg.textContent = stats.battingAvg || '--';
      DOM.statMilestones.textContent = `${stats.fifties || 0} / ${stats.hundreds || 0}`;
      DOM.statBowling.textContent = `${stats.wickets || 0} (${stats.economy || '--'})`;
      DOM.playerFormBadge.textContent = `Form: ${stats.recentForm || 'A'}`;
      DOM.playerBestPosBadge.textContent = stats.bestPosition || 'Middle Order';
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
    DOM.currentBidDisplay.textContent = `₹ ${Number(state.currentBid || 0).toFixed(2)} Cr`;
    DOM.basePriceDisplay.textContent = `₹ ${Number(player.basePrice || 0.20).toFixed(2)} Cr`;

    const inc = Game.getBidIncrement(state.currentBid);
    DOM.nextIncrementDisplay.textContent = `+₹ ${inc.toFixed(2)} Cr`;

    const nextBid = Game.getNextBidAmount();
    DOM.userNextBidAmount.textContent = `₹ ${nextBid.toFixed(2)} Cr`;

    // Leader Franchise
    if (state.currentBidder) {
      const leaderTeam = Game.getTeam(state.currentBidder);
      if (leaderTeam) {
        DOM.leaderLogo.textContent = leaderTeam.logo || '🏏';
        DOM.leaderLogo.style.backgroundColor = leaderTeam.primaryColor || '#1e293b';
        DOM.leaderName.textContent = leaderTeam.name;
      }
    } else {
      DOM.leaderLogo.textContent = '⚪';
      DOM.leaderLogo.style.backgroundColor = '#1e293b';
      DOM.leaderName.textContent = 'No Bids Yet';
    }

    // Check if user can bid
    const userBidStatus = Game.canUserBid();
    if (userBidStatus.canBid) {
      DOM.btnUserBid.disabled = false;
      DOM.btnUserBid.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      DOM.btnUserBid.disabled = true;
      DOM.btnUserBid.classList.add('opacity-50', 'cursor-not-allowed');
    }

    // Update dynamic multiplayer human manager paddles
    renderMultiplayerPaddles();
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
        <img src="${getPlayerImage(player)}" alt="${player.name}" class="w-full h-full object-cover">
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
  // TAB 2: PLAYING XI & BACKUPS VIEW
  // =========================================================================

  function renderPlaying11View() {
    const team = Game.getTeam(AppState.selectedPlaying11TeamId) || Game.getUserTeam();
    if (!team) return;

    const playerStatsDB = window.PLAYER_STATS || {};
    const bestXIResult = RatingEngine.selectBestXI(team.players, playerStatsDB);
    const backups = RatingEngine.selectBackups(team.players, bestXIResult, playerStatsDB);
    const depthScore = RatingEngine._calcSquadDepth(team.players, bestXIResult, playerStatsDB);

    // Summary Badges
    DOM.xiScoreVal.textContent = `${bestXIResult.totalRating || 0}/100`;
    DOM.xiOverseasCount.textContent = `${bestXIResult.overseasUsed || 0} / 4`;
    DOM.xiBowlingOptions.textContent = `${bestXIResult.bowlingOptions || 0} Options`;
    DOM.xiWkStatus.textContent = bestXIResult.hasWK ? 'Guaranteed (🧤)' : 'Missing WK';
    DOM.xiWkStatus.className = bestXIResult.hasWK ? 'text-lg font-bold text-emerald-400' : 'text-lg font-bold text-red-400';
    DOM.xiBenchDepthScore.textContent = `${depthScore || 0}/100`;

    // Render 11 Visual Positions on Cricket Turf
    DOM.playing11FieldGrid.innerHTML = '';

    bestXIResult.xi.forEach((slot, idx) => {
      const template = RatingEngine.XI_TEMPLATE[idx];
      const p = slot.player;

      const card = document.createElement('div');
      card.className = 'bg-slate-950/85 backdrop-blur-md rounded-2xl border p-2.5 flex flex-col justify-between shadow-lg text-center transition hover:scale-105';
      card.style.borderColor = p ? (p.overseas ? '#8B5CF6' : '#3B82F6') : '#334155';

      if (p) {
        card.innerHTML = `
          <div class="text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">${template.label}</div>
          <div class="w-14 h-16 mx-auto my-1.5 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative">
            <img src="${getPlayerImage(p)}" alt="${p.name}" class="w-full h-full object-cover">
            ${p.overseas ? '<span class="absolute top-0.5 right-0.5 text-[10px]" title="Overseas Player">✈️</span>' : ''}
          </div>
          <div class="font-bold text-white text-xs truncate" title="${p.name}">${p.name}</div>
          <div class="text-[10px] text-amber-400 font-semibold">${p.role}</div>
          <div class="mt-1 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span class="text-slate-400">OVR</span>
            <span class="font-bold text-amber-300">${p.rating || 75}</span>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="text-[9px] font-bold uppercase tracking-wider text-slate-500">${template.label}</div>
          <div class="w-14 h-16 mx-auto my-1.5 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-xl">
            ?
          </div>
          <div class="text-xs text-slate-500 italic">Empty Slot</div>
          <div class="text-[9px] text-slate-600">${template.idealRoles.join('/')}</div>
        `;
      }

      DOM.playing11FieldGrid.appendChild(card);
    });

    // Render Bench Backups
    DOM.benchBackupsContainer.innerHTML = '';
    const slots = RatingEngine.XI_TEMPLATE;

    slots.forEach((template, idx) => {
      const backupPlayer = backups[idx];
      const box = document.createElement('div');
      box.className = 'p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs';

      if (backupPlayer) {
        box.innerHTML = `
          <div>
            <span class="text-[10px] uppercase text-slate-500 font-semibold block">Backup ${template.label}</span>
            <strong class="text-white">${backupPlayer.name}</strong>
            <span class="text-[11px] text-amber-400 block">${backupPlayer.role} (OVR ${backupPlayer.rating || 70})</span>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
            ${backupPlayer.overseas ? '✈️ OS Backup' : '🇮🇳 Domestic'}
          </span>
        `;
      } else {
        box.innerHTML = `
          <div>
            <span class="text-[10px] uppercase text-slate-500 font-semibold block">Backup ${template.label}</span>
            <span class="text-slate-500 italic">No reserve acquired</span>
          </div>
          <span class="text-[10px] text-red-400 font-bold">Gap</span>
        `;
      }

      DOM.benchBackupsContainer.appendChild(box);
    });
  }

  // =========================================================================
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
      card.className = `p-5 rounded-2xl bg-slate-900 border transition shadow-lg ${isUser ? 'border-amber-400 shadow-amber-500/10' : 'border-slate-800'}`;

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
          <img src="${getPlayerImage(player)}" alt="${player.name}" class="w-full h-full object-cover">
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
                    <img src="${getPlayerImage(p)}" alt="${p.name}" class="w-8 h-8 rounded-lg object-cover">
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
      const res = await StorageEngine.loginUser('Manager', 'RCB');
      user = res.user;
    }
    updateUserDisplay(user);

    // If user has past ratings, load them
    if (user && user.pastRatings) {
      Object.assign(AppState.userTeamRatings, user.pastRatings);
    }
  }

  function updateUserDisplay(user) {
    if (!user) return;
    if (DOM.headerUserName) DOM.headerUserName.textContent = user.userName;
    if (DOM.userAvatarLetter) DOM.userAvatarLetter.textContent = user.userName.charAt(0).toUpperCase();
    if (DOM.modalUserName) DOM.modalUserName.textContent = user.userName;
    if (DOM.modalUserAvatar) DOM.modalUserAvatar.textContent = user.userName.charAt(0).toUpperCase();
    if (DOM.inputEditUserName) DOM.inputEditUserName.value = user.userName;
  }

  async function handleRename() {
    const newName = DOM.inputEditUserName ? DOM.inputEditUserName.value.trim() : '';
    if (!newName) return;
    const res = await StorageEngine.updateUserName(newName);
    if (res.success) {
      updateUserDisplay(res.user);
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
      DOM.serverSyncBadge.className = StorageEngine.isServerConnected
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

    DOM.multiplayerTeamsList.innerHTML = '';

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

      DOM.multiplayerTeamsList.appendChild(row);
    });

    DOM.multiplayerModal.classList.remove('hidden');
  }

  async function saveMultiplayerRoom() {
    const selects = document.querySelectorAll('.select-team-manager');
    const allUsers = await StorageEngine.getAllUsers();
    const currentUser = StorageEngine.getCurrentUser();

    for (const sel of selects) {
      const teamId = sel.dataset.team;
      const val = sel.value;

      if (val === 'AI') {
        StorageEngine.removeMultiplayerManager(teamId);
        Game.setHumanTeam(teamId, null);
      } else if (val === 'NEW_HUMAN') {
        const pName = prompt(`Enter player name managing ${teamId}:`);
        if (pName && pName.trim()) {
          const res = await StorageEngine.loginUser(pName.trim(), teamId);
          await StorageEngine.assignMultiplayerManager(teamId, res.user.userId, res.user.userName);
          Game.setHumanTeam(teamId, { userId: res.user.userId, userName: res.user.userName });
        }
      } else {
        const matched = allUsers.find(u => u.userId === val) || (currentUser && currentUser.userId === val ? currentUser : null);
        if (matched) {
          await StorageEngine.assignMultiplayerManager(teamId, matched.userId, matched.userName);
          Game.setHumanTeam(teamId, { userId: matched.userId, userName: matched.userName });
        }
      }
    }

    renderMultiplayerPaddles();
    updateTopBar();
    DOM.multiplayerModal.classList.add('hidden');
    AuctionAudio.playSoldFanfare();
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
    const humanManagers = StorageEngine.getHumanManagers();
    const humanTeamIds = Object.keys(humanManagers);
    const count = humanTeamIds.length;

    if (DOM.multiplayerCountBadge) {
      DOM.multiplayerCountBadge.textContent = Math.max(1, count);
    }

    if (count <= 1) {
      if (DOM.multiplayerPaddlesSection) DOM.multiplayerPaddlesSection.classList.add('hidden');
      return;
    }

    if (DOM.multiplayerPaddlesSection) DOM.multiplayerPaddlesSection.classList.remove('hidden');
    if (DOM.multiplayerPaddlesList) {
      DOM.multiplayerPaddlesList.innerHTML = '';
      const nextBid = Game.getNextBidAmount();

      humanTeamIds.forEach(tId => {
        const team = Game.getTeam(tId);
        const mgr = humanManagers[tId];
        if (!team) return;

        const btn = document.createElement('button');
        btn.className = 'p-3 rounded-2xl border text-left transition hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-between text-xs';
        btn.style.backgroundColor = team.primaryColor || '#1e293b';
        btn.style.borderColor = team.secondaryColor || '#f59e0b';

        const check = (typeof Game.canTeamBid === 'function') ? Game.canTeamBid(team.id) : Game.canUserBid();
        if (check && !check.canBid) {
          btn.disabled = true;
          btn.classList.add('opacity-40', 'cursor-not-allowed');
          btn.title = check.reason;
        } else {
          btn.disabled = false;
          btn.classList.remove('opacity-40', 'cursor-not-allowed');
        }

        btn.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-base">${team.logo || '🏏'}</span>
            <div>
              <strong class="text-white block font-bold">${team.shortName || team.name}</strong>
              <span class="text-slate-200 text-[10px] block opacity-90">${mgr.userName}</span>
            </div>
          </div>
          <span class="font-cricket font-bold text-white text-base">${check && !check.canBid ? check.reason : `BID ₹${nextBid.toFixed(2)}Cr`}</span>
        `;

        btn.addEventListener('click', () => {
          const success = Game.placeBid(team.id);
          if (success) {
            triggerBidEffects(team.id);
          }
        });

        DOM.multiplayerPaddlesList.appendChild(btn);
      });
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

    DOM.setSwapBanner.classList.remove('opacity-0', '-translate-y-6', 'scale-95', 'pointer-events-none');
    DOM.setSwapBanner.classList.add('opacity-100', 'translate-y-0', 'scale-100');

    setTimeout(() => {
      DOM.setSwapBanner.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
      DOM.setSwapBanner.classList.add('opacity-0', '-translate-y-6', 'scale-95', 'pointer-events-none');
    }, 3800);
  }

  function updateOnDeckPreview() {
    if (!DOM.onDeckPreviewContainer) return;
    const state = Game.getState();
    const nextThree = state.auctionPool.slice(state.currentPlayerIndex + 1, state.currentPlayerIndex + 4);

    DOM.onDeckPreviewContainer.innerHTML = '';
    if (nextThree.length === 0) {
      DOM.onDeckPreviewContainer.innerHTML = '<span class="text-slate-500 italic">Final Lot</span>';
    } else {
      nextThree.forEach(np => {
        const chip = document.createElement('div');
        chip.className = 'flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300';
        chip.innerHTML = `
          <img src="${getPlayerImage(np)}" class="w-4 h-4 rounded-full object-cover">
          <span class="font-medium text-white truncate max-w-[75px]">${np.name}</span>
          <span class="text-amber-400 font-bold">${np.rating}</span>
        `;
        DOM.onDeckPreviewContainer.appendChild(chip);
      });
    }
  }

  function populateTeamSelects() {
    const rawTeams = (typeof TEAMS !== 'undefined') ? TEAMS : [];
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

    DOM.landingTeamsGrid.innerHTML = '';

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

      DOM.landingTeamsGrid.appendChild(card);
    });

    updateLandingSummary();
  }

  function selectLandingTeam(teamId) {
    AppState.selectedLandingTeamId = teamId;
    AuctionAudio.playBidPaddle();
    renderLandingPage();
  }

  function setAuctionMode(mode) {
    AppState.auctionMode = mode;
    AuctionAudio.playBidPaddle();

    if (mode === 'MINI') {
      DOM.cardModeMini.classList.add('border-amber-400', 'shadow-amber-500/10');
      DOM.cardModeMini.classList.remove('border-slate-800');
      DOM.radioCheckMini.textContent = '✓';
      DOM.radioCheckMini.className = 'w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black';

      DOM.cardModeMega.classList.remove('border-amber-400', 'shadow-amber-500/10');
      DOM.cardModeMega.classList.add('border-slate-800');
      DOM.radioCheckMega.textContent = '○';
      DOM.radioCheckMega.className = 'w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-black';
      
      DOM.auctionModeBadge.textContent = 'MINI AUCTION (40/60)';
      DOM.auctionModeBadge.className = 'text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-purple-900/60 text-purple-300 border border-purple-700/50';
    } else {
      DOM.cardModeMega.classList.add('border-amber-400', 'shadow-amber-500/10');
      DOM.cardModeMega.classList.remove('border-slate-800');
      DOM.radioCheckMega.textContent = '✓';
      DOM.radioCheckMega.className = 'w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black';

      DOM.cardModeMini.classList.remove('border-amber-400', 'shadow-amber-500/10');
      DOM.cardModeMini.classList.add('border-slate-800');
      DOM.radioCheckMini.textContent = '○';
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
      DOM.btnPoolQuick.classList.add('border-amber-400');
      DOM.btnPoolQuick.classList.remove('border-slate-800');
      DOM.badgePoolQuick.textContent = 'SELECTED';
      DOM.badgePoolQuick.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700';

      DOM.btnPoolFull.classList.remove('border-amber-400');
      DOM.btnPoolFull.classList.add('border-slate-800');
      DOM.badgePoolFull.textContent = 'FULL';
      DOM.badgePoolFull.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700';
    } else {
      DOM.btnPoolFull.classList.add('border-amber-400');
      DOM.btnPoolFull.classList.remove('border-slate-800');
      DOM.badgePoolFull.textContent = 'SELECTED';
      DOM.badgePoolFull.className = 'text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700';

      DOM.btnPoolQuick.classList.remove('border-amber-400');
      DOM.btnPoolQuick.classList.add('border-slate-800');
      DOM.badgePoolQuick.textContent = 'QUICK';
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

    // 5. Audio & Celebration FX
    AuctionAudio.playSoldFanfare();
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
    }

    // 6. Update user chip in header
    updateTopBar();
    renderAllViews();
  }

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

      // Render Content
      const startingPurse = Math.max(15, 120 - (retained.length * 15));
      DOM.retainedModalTeamContent.innerHTML = `
        <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div class="flex items-center gap-3">
            <span class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold" style="background-color: ${team.primaryColor || '#1e293b'}">
              ${team.logo || '🏏'}
            </span>
            <div>
              <h4 class="text-base font-bold text-white">${team.name}</h4>
              <p class="text-xs text-slate-400">${team.city || 'India'} • Ground: ${team.homeStadium || 'Chinnaswamy Stadium'}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs uppercase text-slate-400 font-semibold block">Mini Auction Purse</span>
            <span class="text-xl font-cricket font-extrabold text-amber-400">₹${startingPurse.toFixed(1)} Cr</span>
          </div>
        </div>

        <div class="space-y-2">
          <h5 class="text-xs font-bold uppercase tracking-wider text-amber-400">Official 2027 Retained Cores (${retained.length} Players)</h5>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${retained.map((name, i) => `
              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs">${i + 1}</span>
                  <strong class="text-white">${name}</strong>
                </div>
                <span class="text-emerald-400 font-semibold">RETAINED</span>
              </div>
            `).join('')}
          </div>
        </div>
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
    sim.sortedStandings.forEach((s) => {
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
    if (!DOM.supabaseConfigModal) return;
    const savedUrl = localStorage.getItem('supabase_url') || '';
    const savedKey = localStorage.getItem('supabase_anon_key') || '';

    if (DOM.inputSupabaseUrl) DOM.inputSupabaseUrl.value = savedUrl;
    if (DOM.inputSupabaseKey) DOM.inputSupabaseKey.value = savedKey;

    updateSupabaseStatusDisplay(savedUrl, savedKey);
    DOM.supabaseConfigModal.classList.remove('hidden');
  }

  function updateSupabaseStatusDisplay(url, key) {
    if (!DOM.supabaseStatusBadge) return;
    if (url && key) {
      DOM.supabaseStatusBadge.textContent = 'CONNECTED';
      DOM.supabaseStatusBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800';
      if (DOM.supabaseStatusDetail) DOM.supabaseStatusDetail.textContent = 'Active cross-device Realtime synchronization.';
    } else {
      DOM.supabaseStatusBadge.textContent = 'NOT CONFIGURED';
      DOM.supabaseStatusBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800';
      if (DOM.supabaseStatusDetail) DOM.supabaseStatusDetail.textContent = 'Connect your free Supabase project for cross-device multiplayer.';
    }
  }

  function saveSupabaseConfig() {
    const url = (DOM.inputSupabaseUrl?.value || '').trim();
    const key = (DOM.inputSupabaseKey?.value || '').trim();

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
        alert('Supabase connected successfully! Realtime multiplayer bids will now sync across devices.');
      } else {
        alert('Failed to connect. Please verify your Project URL and anon key.');
      }
    }
  }

  function clearSupabaseConfig() {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
    if (DOM.inputSupabaseUrl) DOM.inputSupabaseUrl.value = '';
    if (DOM.inputSupabaseKey) DOM.inputSupabaseKey.value = '';
    updateSupabaseStatusDisplay('', '');
    alert('Supabase configuration removed. App will run in offline/local mode.');
  }

})();
