"""
apply_past_data_and_images_fix.py
1. Fixes Past Data Restoration on Refresh:
   - Enhances StorageEngine.getAuctionHistory to recover and restore past auction data from
     currentUser.pastSquads / users DB if cleaned history is empty
   - Enhances StorageEngine.saveAuctionResult to automatically write to cleaned auction history
   - In initApp and initWelcomeAndRoomFlow: always calls renderHomeAuctionHistory()
   - Unifies ipl_user_name, ipl_manager_name, and currentUser so identity is always preserved on refresh
2. Fixes Player Images:
   - Removes consecutiveFailures killswitch in player-images.js so other players aren't blocked
   - Maps missing overseas & domestic players to high-quality ESPNcricinfo / IPL URLs
   - Adds referrerpolicy="no-referrer" to all img tags in index.html and app.js to prevent CDN blocking
"""

import re
import json

# =========================================================================
# 1. UPDATE storage.js
# =========================================================================
with open('storage.js', 'r', encoding='utf-8') as f:
    storage_code = f.read()

# Enhance getAuctionHistory to check currentUser.pastSquads and local users DB
old_get_history = """    getAuctionHistory() {
      try {
        const raw = localStorage.getItem('ipl_auction_cleaned_history');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return [];
    }"""

new_get_history = """    getAuctionHistory() {
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
    }"""

if old_get_history in storage_code:
    storage_code = storage_code.replace(old_get_history, new_get_history, 1)
    print("Updated getAuctionHistory in storage.js to recover past squads")
else:
    print("WARNING: old_get_history not found in storage.js")

# In saveAuctionResult, also automatically save to cleaned auction history!
old_save_result_end = """      db[user.userId] = user;
      this.saveLocalUsersDB(db);
      this.currentUser = user;
      this.persistLocalUser(user);

      return true;
    }"""

new_save_result_end = """      db[user.userId] = user;
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
    }"""

if old_save_result_end in storage_code:
    storage_code = storage_code.replace(old_save_result_end, new_save_result_end, 1)
    print("Updated saveAuctionResult in storage.js to auto-save cleaned auction history")
else:
    print("WARNING: old_save_result_end not found in storage.js")

with open('storage.js', 'w', encoding='utf-8') as f:
    f.write(storage_code)
print("storage.js updated successfully.")

# =========================================================================
# 2. UPDATE app.js
# =========================================================================
with open('app.js', 'r', encoding='utf-8') as f:
    app_code = f.read()

# In initApp: always call renderHomeAuctionHistory()
old_init_calls = """    // Initial render
    renderLandingPage();
    renderAllViews();
    wireNewFeatures();
    renderMultiplayerPaddles();"""

new_init_calls = """    // Initial render & restore past history
    renderLandingPage();
    renderAllViews();
    wireNewFeatures();
    renderMultiplayerPaddles();
    if (typeof renderHomeAuctionHistory === 'function') renderHomeAuctionHistory();
    if (typeof renderPublicRoomsList === 'function') renderPublicRoomsList();"""

if old_init_calls in app_code:
    app_code = app_code.replace(old_init_calls, new_init_calls, 1)
    print("Added renderHomeAuctionHistory to initApp in app.js")

# In initWelcomeAndRoomFlow: check all name keys and immediately restore past data
old_welcome_init = """  function initWelcomeAndRoomFlow() {
    const savedName = localStorage.getItem('ipl_user_name');
    const welcomeModal = document.getElementById('welcomeNewUserModal');
    const inputWelcomeName = document.getElementById('inputWelcomeUserName');
    const btnSubmitWelcome = document.getElementById('btnSubmitWelcomeName');

    // Parse URL parameter ?roomId= or ?room=
    const urlParams = new URLSearchParams(window.location.search);
    const queryRoomId = urlParams.get('roomId') || urlParams.get('room');

    if (!savedName) {"""

new_welcome_init = """  function initWelcomeAndRoomFlow() {
    // Unify all storage keys for user identity so refresh never loses past data!
    const savedName = localStorage.getItem('ipl_user_name') || localStorage.getItem('ipl_manager_name') || (StorageEngine && StorageEngine.currentUser ? StorageEngine.currentUser.userName : null);
    const welcomeModal = document.getElementById('welcomeNewUserModal');
    const inputWelcomeName = document.getElementById('inputWelcomeUserName');
    const btnSubmitWelcome = document.getElementById('btnSubmitWelcomeName');

    // Parse URL parameter ?roomId= or ?room=
    const urlParams = new URLSearchParams(window.location.search);
    const queryRoomId = urlParams.get('roomId') || urlParams.get('room');

    if (!savedName) {"""

if old_welcome_init in app_code:
    app_code = app_code.replace(old_welcome_init, new_welcome_init, 1)
    print("Updated initWelcomeAndRoomFlow to check all identity keys in app.js")

# Also in initWelcomeAndRoomFlow's else branch:
old_welcome_else = """    } else {
      // Old User: Log in automatically and show past history
      StorageEngine.loginUser(savedName, AppState.userTeamId || 'RCB');
      if (queryRoomId) {
        handleJoinSpecificRoom(queryRoomId);
      } else {
        renderHomeAuctionHistory();
        renderPublicRoomsList();
      }
    }"""

new_welcome_else = """    } else {
      // Old User: ensure both keys are set and restore past data immediately
      localStorage.setItem('ipl_user_name', savedName);
      localStorage.setItem('ipl_manager_name', savedName);
      if (welcomeModal) welcomeModal.classList.add('hidden');

      if (typeof StorageEngine !== 'undefined') {
        StorageEngine.loginUser(savedName, AppState.userTeamId || 'RCB').then(res => {
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
    }"""

if old_welcome_else in app_code:
    app_code = app_code.replace(old_welcome_else, new_welcome_else, 1)
    print("Updated initWelcomeAndRoomFlow else branch to ensure past data loads on refresh")

# Add referrerpolicy="no-referrer" to all img tags generated in app.js
app_code = app_code.replace('<img src="${photoUrl}"', '<img referrerpolicy="no-referrer" src="${photoUrl}"')
app_code = app_code.replace('<img src="${p.photo ||', '<img referrerpolicy="no-referrer" src="${p.photo ||')

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_code)
print("app.js updated successfully.")

# =========================================================================
# 3. UPDATE player-images.js
# =========================================================================
with open('player-images.js', 'r', encoding='utf-8') as f:
    pimg_code = f.read()

# Remove consecutiveFailures killswitch in handlePlayerImageError
old_err_tracker = """    if (imgElement.src) {
      _failedImageUrls.add(imgElement.src);
      _consecutiveFailures++;
      // If 10 or more images fail, remote CDN is blocked/offline: fast-fail to SVG for all
      
    }"""

new_err_tracker = """    if (imgElement.src) {
      _failedImageUrls.add(imgElement.src);
      // Fallback only this individual image, never block other players
    }"""

pimg_code = pimg_code.replace(old_err_tracker, new_err_tracker)

# Expand PLAYER_IMAGES dictionary with overseas and missing star players
additional_stars = {
    # Star Overseas Batters & All-Rounders
    "Devon Conway": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321539.jpg",
    "Kane Williamson": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316630.jpg",
    "Aiden Markram": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319800/319842.jpg",
    "Harry Brook": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323200/323267.jpg",
    "Rovman Powell": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322300/322384.jpg",
    "Steve Smith": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/316600/316628.jpg",
    "Finn Allen": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321542.jpg",
    "Jason Roy": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/323200/323265.jpg",
    "Sherfane Rutherford": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/322300/322391.jpg",
    "Rassie van der Dussen": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319800/319839.jpg",
    "Rachin Ravindra": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/369300/369344.png",
    "Daryl Mitchell": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/321500/321546.jpg",
    "Tim David": "https://documents.iplt20.com/ipl/IPLHeadshot2024/636.png",
    "Marcus Stoinis": "https://documents.iplt20.com/ipl/IPLHeadshot2024/23.png",
    "Mitchell Marsh": "https://documents.iplt20.com/ipl/IPLHeadshot2024/40.png",
    "Liam Livingstone": "https://documents.iplt20.com/ipl/IPLHeadshot2024/183.png",
    "Sam Curran": "https://documents.iplt20.com/ipl/IPLHeadshot2024/138.png",
    "Glenn Phillips": "https://documents.iplt20.com/ipl/IPLHeadshot2024/635.png",
    "David Miller": "https://documents.iplt20.com/ipl/IPLHeadshot2024/128.png",
    "Shimron Hetmyer": "https://documents.iplt20.com/ipl/IPLHeadshot2024/210.png",
    "Nicholas Pooran": "https://documents.iplt20.com/ipl/IPLHeadshot2024/136.png",
    "Quinton de Kock": "https://documents.iplt20.com/ipl/IPLHeadshot2024/170.png",
    "Faf du Plessis": "https://documents.iplt20.com/ipl/IPLHeadshot2024/94.png",
    "Mitchell Starc": "https://documents.iplt20.com/ipl/IPLHeadshot2024/77.png",
    "Pat Cummins": "https://documents.iplt20.com/ipl/IPLHeadshot2024/33.png",
    "Trent Boult": "https://documents.iplt20.com/ipl/IPLHeadshot2024/66.png",
    "Kagiso Rabada": "https://documents.iplt20.com/ipl/IPLHeadshot2024/116.png",
    "Anrich Nortje": "https://documents.iplt20.com/ipl/IPLHeadshot2024/142.png",
    "Lockie Ferguson": "https://documents.iplt20.com/ipl/IPLHeadshot2024/370.png",
    "Josh Hazlewood": "https://documents.iplt20.com/ipl/IPLHeadshot2024/35.png",
    "Gerald Coetzee": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1983.png",
    "Spencer Johnson": "https://documents.iplt20.com/ipl/IPLHeadshot2024/2107.png",
    "Dilshan Madushanka": "https://documents.iplt20.com/ipl/IPLHeadshot2024/2047.png",
    "Nuwan Thushara": "https://documents.iplt20.com/ipl/IPLHeadshot2024/2056.png",
    "Alzarri Joseph": "https://documents.iplt20.com/ipl/IPLHeadshot2024/227.png",
    "Shai Hope": "https://documents.iplt20.com/ipl/IPLHeadshot2024/2070.png",
    "Tristan Stubbs": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1017.png",
    "Phil Salt": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1126.png",
    "Will Jacks": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1149.png",
    "Cameron Green": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1015.png",
    "Travis Head": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1020.png",
    "Heinrich Klaasen": "https://documents.iplt20.com/ipl/IPLHeadshot2024/202.png",
    "Sunil Narine": "https://documents.iplt20.com/ipl/IPLHeadshot2024/156.png",
    "Andre Russell": "https://documents.iplt20.com/ipl/IPLHeadshot2024/141.png",
    "Rashid Khan": "https://documents.iplt20.com/ipl/IPLHeadshot2024/218.png",
    "Wanindu Hasaranga": "https://documents.iplt20.com/ipl/IPLHeadshot2024/377.png",
    "Maheesh Theekshana": "https://documents.iplt20.com/ipl/IPLHeadshot2024/633.png",
    "Matheesha Pathirana": "https://documents.iplt20.com/ipl/IPLHeadshot2024/1014.png"
}

# Append missing players into PLAYER_IMAGES in player-images.js
insert_target = 'const PLAYER_IMAGES = {'
if insert_target in pimg_code:
    lines_to_add = "\n" + "\n".join([f'    "{k}": "{v}",' for k, v in additional_stars.items() if f'"{k}":' not in pimg_code])
    pimg_code = pimg_code.replace(insert_target, insert_target + lines_to_add, 1)
    print(f"Added additional player headshots to player-images.js")

with open('player-images.js', 'w', encoding='utf-8') as f:
    f.write(pimg_code)
print("player-images.js updated successfully.")

# =========================================================================
# 4. UPDATE index.html
# =========================================================================
with open('index.html', 'r', encoding='utf-8') as f:
    html_code = f.read()

# Add referrerpolicy="no-referrer" to #playerPhoto
html_code = html_code.replace('<img id="playerPhoto"', '<img id="playerPhoto" referrerpolicy="no-referrer"')

# Ensure cache-buster is bumped
import time
ts = int(time.time())
html_code = re.sub(r'src="player-images\.js(\?v=\d+)?"', f'src="player-images.js?v={ts}"', html_code)
html_code = re.sub(r'src="storage\.js(\?v=\d+)?"', f'src="storage.js?v={ts}"', html_code)
html_code = re.sub(r'src="app\.js(\?v=\d+)?"', f'src="app.js?v={ts}"', html_code)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_code)
print(f"index.html updated with cache buster v={ts}")
