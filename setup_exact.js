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
  }
