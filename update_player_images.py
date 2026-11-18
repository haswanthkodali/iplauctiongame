with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\player-images.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace all weserv proxies with direct https://
code = code.replace('https://images.weserv.nl/?url=', 'https://')

# Update handlePlayerImageError and getPlayerImage
old_handlers = """  // Track which remote URLs have already failed so we don't re-request them
  const _failedImageUrls = new Set();

  /**
   * Helper that retrieves the best image URL for a player.
   * Returns CDN photo if available and hasn't previously failed, otherwise SVG avatar.
   */
  function getPlayerImage(player) {
    if (!player) return "";
    const name = typeof player === 'string' ? player : player.name;

    // If we have a known CDN URL and it hasn't previously errored
    const directUrl = PLAYER_IMAGES[name];
    if (directUrl && !_failedImageUrls.has(directUrl)) {
      return directUrl;
    }

    // Fallback: generate high-quality SVG avatar
    return generatePlayerAvatarSVG(typeof player === 'string' ? { name: player } : player);
  }

  /**
   * Call this from an <img onerror> handler to swap to SVG fallback
   * and remember that the CDN URL failed so we don't retry it.
   */
  function handlePlayerImageError(imgElement, player) {
    if (!imgElement) return;
    // Prevent infinite recursion if the fallback SVG data URL somehow triggers error
    if (imgElement.src && imgElement.src.startsWith('data:image/svg+xml')) {
      return;
    }
    if (imgElement.src) {
      _failedImageUrls.add(imgElement.src);
    }
    try {
      const p = player || (typeof Game !== 'undefined' && Game.getCurrentPlayer ? Game.getCurrentPlayer() : null);
      const fallback = generatePlayerAvatarSVG(p || { name: 'IPL Player', role: 'Batsman', rating: 80 });
      imgElement.src = fallback;
    } catch (e) {
      console.warn("Avatar fallback warning", e);
    }
  }"""

new_handlers = """  // Track failed URLs and network availability
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
  }"""

if old_handlers in code:
    code = code.replace(old_handlers, new_handlers)
    print("Replaced image handlers with auto-fallback system!")
else:
    print("Warning: old_handlers not matched exactly, updating with regex")
    # Use regex
    code = re.sub(
        r'  // Track which remote URLs have already failed.*?(?=  // Global Exports)',
        new_handlers + '\n\n',
        code,
        flags=re.DOTALL
    )

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\player-images.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("player-images.js successfully updated!")
