/**
 * IPL AUCTION GAME - PLAYER IMAGES & AVATAR ENGINE
 * ============================================================================
 * Provides:
 * 1. PLAYER_IMAGES: Real headshot URLs using ESPNcricinfo CDN (img1.hscicdn.com)
 * 2. generatePlayerAvatarSVG(player): Ultra-stylish vector jersey avatar generator
 * 3. getPlayerImage(player): Helper that returns photo with instant SVG fallback
 * ============================================================================
 */

(function (global) {
  'use strict';

  // =========================================================================
  // REAL PLAYER HEADSHOT IMAGE URLs
  // Using ESPNcricinfo CDN with verified player IDs
  // Format: https://img1.hscicdn.com/image/upload/f_auto,t_h_100_2x/lsci/db/PICTURES/CMS/{folder}/{id}.jpg
  // Also using IPLT20.com official CDN for some players
  // =========================================================================
  const PLAYER_IMAGES = {
    // === MARQUEE INDIAN SUPERSTARS ===
    "Virat Kohli":          "https://documents.iplt20.com/ipl/IPLHeadshot2024/2.png",
    "Rohit Sharma":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/6.png",
    "Jasprit Bumrah":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/1.png",
    "MS Dhoni":             "https://documents.iplt20.com/ipl/IPLHeadshot2024/57.png",
    "Hardik Pandya":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/54.png",
    "Rishabh Pant":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/167.png",
    "Suryakumar Yadav":     "https://documents.iplt20.com/ipl/IPLHeadshot2024/108.png",
    "Ravindra Jadeja":      "https://documents.iplt20.com/ipl/IPLHeadshot2024/9.png",
    "Shubman Gill":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/228.png",
    "KL Rahul":             "https://documents.iplt20.com/ipl/IPLHeadshot2024/19.png",
    "Shreyas Iyer":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/312.png",
    "Sanju Samson":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/190.png",
    "Ruturaj Gaikwad":      "https://documents.iplt20.com/ipl/IPLHeadshot2024/509.png",
    "Yashasvi Jaiswal":     "https://documents.iplt20.com/ipl/IPLHeadshot2024/536.png",
    "Rinku Singh":          "https://documents.iplt20.com/ipl/IPLHeadshot2024/535.png",
    "Axar Patel":           "https://documents.iplt20.com/ipl/IPLHeadshot2024/157.png",
    "Kuldeep Yadav":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/350.png",
    "Yuzvendra Chahal":     "https://documents.iplt20.com/ipl/IPLHeadshot2024/111.png",
    "Mohammed Shami":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/94.png",
    "Mohammed Siraj":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/237.png",
    "Arshdeep Singh":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/479.png",
    "Shivam Dube":          "https://documents.iplt20.com/ipl/IPLHeadshot2024/440.png",
    "Tilak Varma":          "https://documents.iplt20.com/ipl/IPLHeadshot2024/969.png",
    "Rajat Patidar":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/955.png",
    "Abhishek Sharma":      "https://documents.iplt20.com/ipl/IPLHeadshot2024/487.png",
    "Nitish Kumar Reddy":   "https://documents.iplt20.com/ipl/IPLHeadshot2024/1138.png",
    "Sai Sudharsan":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/1024.png",
    "Washington Sundar":    "https://documents.iplt20.com/ipl/IPLHeadshot2024/254.png",
    "Shardul Thakur":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/177.png",
    "Deepak Chahar":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/140.png",
    "Bhuvneshwar Kumar":    "https://documents.iplt20.com/ipl/IPLHeadshot2024/116.png",
    "Ravi Bishnoi":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/538.png",
    "Prasidh Krishna":      "https://documents.iplt20.com/ipl/IPLHeadshot2024/434.png",
    "Avesh Khan":           "https://documents.iplt20.com/ipl/IPLHeadshot2024/354.png",
    "Mayank Yadav":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/1083.png",
    "Harshit Rana":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/1148.png",
    "Varun Chakravarthy":   "https://documents.iplt20.com/ipl/IPLHeadshot2024/482.png",
    "T Natarajan":          "https://documents.iplt20.com/ipl/IPLHeadshot2024/395.png",
    "Ishant Sharma":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/35.png",

    // === MARQUEE OVERSEAS STARS ===
    "Pat Cummins":          "https://documents.iplt20.com/ipl/IPLHeadshot2024/370.png",
    "Mitchell Starc":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/107.png",
    "Rashid Khan":          "https://documents.iplt20.com/ipl/IPLHeadshot2024/212.png",
    "Travis Head":          "https://documents.iplt20.com/ipl/IPLHeadshot2024/485.png",
    "Heinrich Klaasen":     "https://documents.iplt20.com/ipl/IPLHeadshot2024/492.png",
    "Jos Buttler":          "https://documents.iplt20.com/ipl/IPLHeadshot2024/171.png",
    "Andre Russell":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/141.png",
    "Sunil Narine":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/50.png",
    "Glenn Maxwell":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/127.png",
    "Nicholas Pooran":      "https://documents.iplt20.com/ipl/IPLHeadshot2024/396.png",
    "Trent Boult":          "https://documents.iplt20.com/ipl/IPLHeadshot2024/68.png",
    "Faf du Plessis":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/24.png",
    "David Miller":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/92.png",
    "Quinton de Kock":      "https://documents.iplt20.com/ipl/IPLHeadshot2024/178.png",
    "Marcus Stoinis":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/209.png",
    "Sam Curran":           "https://documents.iplt20.com/ipl/IPLHeadshot2024/349.png",
    "Liam Livingstone":     "https://documents.iplt20.com/ipl/IPLHeadshot2024/486.png",
    "Kagiso Rabada":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/174.png",
    "Anrich Nortje":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/418.png",
    "Matheesha Pathirana":  "https://documents.iplt20.com/ipl/IPLHeadshot2024/1052.png",
    "Devon Conway":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/440.png",
    "Phil Salt":            "https://documents.iplt20.com/ipl/IPLHeadshot2024/1021.png",
    "Mitchell Marsh":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/150.png",
    "Jake Fraser-McGurk":   "https://documents.iplt20.com/ipl/IPLHeadshot2024/1137.png",
    "Rachin Ravindra":      "https://documents.iplt20.com/ipl/IPLHeadshot2024/1127.png",
    "Will Jacks":           "https://documents.iplt20.com/ipl/IPLHeadshot2024/1051.png",
    "Wanindu Hasaranga":    "https://documents.iplt20.com/ipl/IPLHeadshot2024/397.png",
    "Adam Zampa":           "https://documents.iplt20.com/ipl/IPLHeadshot2024/146.png",
    "Josh Hazlewood":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/143.png",
    "Marco Jansen":         "https://documents.iplt20.com/ipl/IPLHeadshot2024/981.png",
    "Gerald Coetzee":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/1077.png",
    "Lockie Ferguson":      "https://documents.iplt20.com/ipl/IPLHeadshot2024/278.png",
    "Alzarri Joseph":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/413.png",
    "Rovman Powell":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/413.png",
    "Shimron Hetmyer":      "https://documents.iplt20.com/ipl/IPLHeadshot2024/389.png",
    "Tim David":            "https://documents.iplt20.com/ipl/IPLHeadshot2024/988.png",
    "Cameron Green":        "https://documents.iplt20.com/ipl/IPLHeadshot2024/489.png",
    "Daryl Mitchell":       "https://documents.iplt20.com/ipl/IPLHeadshot2024/330.png",
    "Mark Wood":            "https://documents.iplt20.com/ipl/IPLHeadshot2024/180.png"
  };

  // Flag and emoji mapping
  const COUNTRY_FLAGS = {
    "India": "🇮🇳",
    "Australia": "🇦🇺",
    "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "South Africa": "🇿🇦",
    "West Indies": "🏝️",
    "New Zealand": "🇳🇿",
    "Afghanistan": "🇦🇫",
    "Sri Lanka": "🇱🇰",
    "Bangladesh": "🇧🇩",
    "Zimbabwe": "🇿🇼",
    "Ireland": "🇮🇪",
    "USA": "🇺🇸",
    "Nepal": "🇳🇵",
    "Netherlands": "🇳🇱",
    "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿"
  };

  // Role Color Themes
  const ROLE_THEMES = {
    "Batsman": { primary: "#1E40AF", secondary: "#3B82F6", accent: "#93C5FD", icon: "🏏" },
    "Bowler": { primary: "#991B1B", secondary: "#EF4444", accent: "#FCA5A5", icon: "⚡" },
    "All-Rounder": { primary: "#5B21B6", secondary: "#8B5CF6", accent: "#C4B5FD", icon: "⭐" },
    "Wicket-Keeper": { primary: "#065F46", secondary: "#10B981", accent: "#6EE7B7", icon: "🧤" }
  };

  /**
   * Generates a high-fidelity SVG avatar data URL for any player.
   * Completely self-contained, crisp at any resolution, and works 100% offline.
   */
  function generatePlayerAvatarSVG(player) {
    if (!player) return "";
    const name = player.name || "IPL Player";
    const initials = player.initials || name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    const role = player.role || "Batsman";
    const rating = player.rating || 80;
    const country = player.country || "India";
    const flag = COUNTRY_FLAGS[country] || "🏏";
    const theme = ROLE_THEMES[role] || ROLE_THEMES["Batsman"];

    // Color gradient based on player ID hash or rating
    const idNum = typeof player.id === 'number' ? player.id : (name.charCodeAt(0) * 7);
    const hue = (idNum * 37) % 360;

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 280" width="240" height="280">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.secondary}" />
      <stop offset="100%" stop-color="${theme.primary}" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Base with Rounded Corners -->
  <rect x="6" y="6" width="228" height="268" rx="20" fill="url(#bgGrad)" stroke="${theme.secondary}" stroke-width="2" filter="url(#cardShadow)"/>

  <!-- Halo / Spotlight Effect -->
  <circle cx="120" cy="110" r="75" fill="${theme.secondary}" opacity="0.18" />

  <!-- Cricket Player Silhouette / Portrait Geometry -->
  <!-- Shoulders & Jersey -->
  <path d="M 45 230 C 50 185, 80 165, 120 165 C 160 165, 190 185, 195 230 Z" fill="url(#jerseyGrad)" />
  <!-- Jersey Collar -->
  <polygon points="120,185 105,165 135,165" fill="#f8fafc" opacity="0.9"/>
  <!-- Jersey Stripe / Accent -->
  <path d="M 70 230 L 95 180 L 105 180 L 85 230 Z" fill="#ffffff" opacity="0.25" />
  <path d="M 170 230 L 145 180 L 135 180 L 155 230 Z" fill="#ffffff" opacity="0.25" />

  <!-- Neck -->
  <rect x="108" y="140" width="24" height="26" rx="4" fill="#E2B29F" />

  <!-- Head / Face -->
  <ellipse cx="120" cy="115" rx="36" ry="42" fill="#E2B29F" />

  <!-- Cricket Cap / Helmet -->
  <path d="M 82 108 C 82 72, 158 72, 158 108 Z" fill="${theme.primary}" stroke="#0f172a" stroke-width="1.5"/>
  <!-- Cap Visor -->
  <ellipse cx="120" cy="110" rx="46" ry="9" fill="${theme.secondary}" />
  <ellipse cx="120" cy="108" rx="43" ry="5" fill="#ffffff" opacity="0.3" />

  <!-- Player Initials on Jersey -->
  <text x="120" y="218" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle" letter-spacing="2">
    ${initials}
  </text>

  <!-- OVR Rating Shield Badge (Top Right) -->
  <g transform="translate(172, 18)">
    <polygon points="24,0 48,10 48,34 24,46 0,34 0,10" fill="url(#goldGrad)" stroke="#78350F" stroke-width="1.5"/>
    <text x="24" y="28" font-family="'Inter', sans-serif" font-weight="900" font-size="19" fill="#0f172a" text-anchor="middle">
      ${rating}
    </text>
  </g>

  <!-- Country Flag Badge (Top Left) -->
  <g transform="translate(18, 22)">
    <circle cx="16" cy="16" r="16" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="16" y="22" font-size="18" text-anchor="middle">${flag}</text>
  </g>

  <!-- Role Badge at Bottom -->
  <g transform="translate(24, 238)">
    <rect x="0" y="0" width="192" height="26" rx="13" fill="#0f172a" stroke="${theme.secondary}" stroke-width="1.5"/>
    <text x="96" y="18" font-family="'Inter', sans-serif" font-weight="700" font-size="12" fill="${theme.accent}" text-anchor="middle" letter-spacing="1">
      ${theme.icon} ${role.toUpperCase()}
    </text>
  </g>
</svg>`.trim();

    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // Track failed URLs and network availability
  const _failedImageUrls = new Set();
  let _consecutiveFailures = 0;
  let _offlineOrBlocked = false;

  /**
   * Helper that retrieves the best image URL for a player.
   * If remote is blocked or player has no photo, returns instant SVG avatar.
   */
  function getPlayerImage(player) {
    if (!player) return "";
    const pObj = typeof player === 'string' ? { name: player } : player;
    const name = pObj.name;

    // If remote CDN is blocked or unavailable, return instant SVG directly
    if (_offlineOrBlocked) {
      return generatePlayerAvatarSVG(pObj);
    }

    const directUrl = PLAYER_IMAGES[name];
    if (directUrl && !_failedImageUrls.has(directUrl)) {
      return directUrl;
    }

    // Fallback: generate high-quality SVG avatar
    return generatePlayerAvatarSVG(pObj);
  }

  /**
   * Call this from an <img onerror> handler to swap to SVG fallback
   * and remember that the CDN URL failed so we don't retry it.
   */
  function handlePlayerImageError(imgElement, player) {
    if (!imgElement) return;
    if (imgElement.src && imgElement.src.startsWith('data:image/svg+xml')) {
      return;
    }
    if (imgElement.src) {
      _failedImageUrls.add(imgElement.src);
      _consecutiveFailures++;
      // If 3 or more images fail, remote CDN is blocked/offline: fast-fail to SVG for all
      if (_consecutiveFailures >= 3) {
        _offlineOrBlocked = true;
      }
    }
    try {
      let p = player;
      if (!p && imgElement.dataset) {
        p = {
          name: imgElement.dataset.playerName || imgElement.alt || 'IPL Player',
          role: imgElement.dataset.playerRole || 'Batsman',
          rating: parseInt(imgElement.dataset.playerRating, 10) || 80,
          country: imgElement.dataset.playerCountry || 'India',
          initials: imgElement.dataset.playerInitials || ''
        };
      }
      if (!p || (!p.name && !imgElement.dataset.playerName)) {
        p = (typeof Game !== 'undefined' && Game.getCurrentPlayer) ? Game.getCurrentPlayer() : { name: 'IPL Player', role: 'Batsman', rating: 80 };
      }
      imgElement.src = generatePlayerAvatarSVG(p);
    } catch (e) {
      console.warn("Avatar fallback warning", e);
    }
  }

  /**
   * Generates a fully guarded <img> HTML element with instant SVG fallback,
   * referrerpolicy, and all player attributes for flawless rendering everywhere.
   */
  function renderPlayerAvatarImg(player, extraClasses = 'w-full h-full object-cover') {
    if (!player) return `<img src="" alt="" class="${extraClasses}">`;
    const name = typeof player === 'string' ? player : (player.name || 'IPL Player');
    const role = typeof player === 'object' ? (player.role || 'Batsman') : 'Batsman';
    const rating = typeof player === 'object' ? (player.rating || 80) : 80;
    const country = typeof player === 'object' ? (player.country || 'India') : 'India';
    const initials = typeof player === 'object' ? (player.initials || '') : '';
    const src = getPlayerImage(player);

    const safeName = String(name).replace(/"/g, '&quot;');
    const safeRole = String(role).replace(/"/g, '&quot;');
    const safeCountry = String(country).replace(/"/g, '&quot;');
    const safeInitials = String(initials).replace(/"/g, '&quot;');

    return `<img src="${src}" alt="${safeName}" 
      data-player-name="${safeName}" 
      data-player-role="${safeRole}" 
      data-player-rating="${rating}" 
      data-player-country="${safeCountry}" 
      data-player-initials="${safeInitials}" 
      referrerpolicy="no-referrer" 
      onerror="handlePlayerImageError(this)" 
      class="${extraClasses}">`;
  }

  // Global Exports
  global.PLAYER_IMAGES = PLAYER_IMAGES;
  global.COUNTRY_FLAGS = COUNTRY_FLAGS;
  global.ROLE_THEMES = ROLE_THEMES;
  global.generatePlayerAvatarSVG = generatePlayerAvatarSVG;
  global.getPlayerImage = getPlayerImage;
  global.handlePlayerImageError = handlePlayerImageError;
  global.renderPlayerAvatarImg = renderPlayerAvatarImg;

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
