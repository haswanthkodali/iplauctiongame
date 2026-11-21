"""
Comprehensive fix for app.js:
1. Guard all unguarded addEventListener calls on missing DOM elements
2. Guard unguarded DOM property accesses (.innerHTML, .value, .classList, .textContent)
3. Move the MULTIPLAYER ROOM & REDESIGN ENGINE code INSIDE the IIFE
4. Fix dangling code at the end
"""

import re
import shutil

INPUT = 'app.js'
BACKUP = 'app.js.bak2'
OUTPUT = 'app.js'

with open(INPUT, 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
shutil.copy2(INPUT, BACKUP)
print(f"Backup created: {BACKUP}")

# ============================================================
# STEP 1: Find the IIFE boundary
# ============================================================
iife_end_marker = '})();'
iife_end_pos = content.find(iife_end_marker)
print(f"IIFE ends at position: {iife_end_pos}")

iife_code = content[:iife_end_pos]
outer_code = content[iife_end_pos + len(iife_end_marker):]
print(f"IIFE code length: {len(iife_code)}")
print(f"Outer code length: {len(outer_code)}")

# ============================================================
# STEP 2: Fix setupEventListeners inside the IIFE
# Guard all unguarded addEventListener calls on DOM.xxx elements
# ============================================================

# Elements confirmed MISSING from HTML
missing_elements = {
    'btnModeToggle', 'btnCloseModeModal', 'btnChooseMega', 'btnChooseMini',
    'chkAutoBid', 'modeSelectModal',
    'cardModeMini', 'cardModeMega',
    'btnPoolQuick', 'btnPoolFull',
    'btnRandomTeamLanding', 'btnEnterAuctionRoom', 'btnStartAuctionHero',
    'btnOpenSupabaseModal', 'btnCloseSupabaseModal', 'btnCloseSupabaseModal2',
    'btnSaveSupabaseConfig', 'btnClearSupabaseConfig',
    'btnExecuteRelogin',
    'btnMultiplayerLobby', 'btnPrivateLinkHeader',
    'btnCopyPrivateLink', 'btnCreateNewRoom',
    'btnCloseMultiplayerModal', 'btnSaveMultiplayerRoom',
    'supabaseConfigModal', 'multiplayerModal',
    'modeLabel', 'onDeckPreviewContainer',
    'setSwapBanner', 'setSwapTitle', 'setSwapSubtitle',
    'multiplayerCountBadge', 'multiplayerPaddlesSection', 'multiplayerPaddlesList',
    'serverSyncBadge', 'pastBidsCountBadge', 'pastSquadsList', 'pastRatingsList',
    'inputReloginName', 'registeredProfilesList',
    'multiplayerTeamsList', 'inputPrivateShareLink',
    'currentRoomBadge', 'copyLinkBtnText',
    'radioCheckMini', 'radioCheckMega',
    'badgePoolQuick', 'badgePoolFull',
    'landingTeamsGrid', 'landingSelectedLogo', 'landingSelectedTeamName',
    'landingSelectedModeBadge', 'landingSelectedPurse',
    'inputSupabaseUrl', 'inputSupabaseKey',
    'supabaseStatusBadge', 'supabaseStatusDetail',
    'managerEntryModal', 'inputManagerName', 'entryTeamSelectGrid', 'btnSubmitManagerEntry',
    'squadBenchSubtitle',
    'btnToggleChatDrawer', 'btnFloatingChat', 'multiplayerChatDrawer',
    'btnCloseChatDrawer', 'btnTabChatMessages', 'btnTabPurchasedShortcut',
    'chatMessagesView', 'btnChatShortcutSoldToggle',
    'purchasedPlayersShortcutView', 'inputSearchPurchased', 'btnRefreshPurchasedList',
    'shortcutTotalSoldCount', 'shortcutTotalPurseSpent', 'shortcutPurchasedListContainer',
    'chatBadgeCount', 'chatTabBadge', 'purchasedTabBadge', 'floatingChatBadge',
    'selectAiBiddingMode', 'aiBiddingModeHint',
    'btnShareRoomWhatsApp', 'btnShareRoomNative',
    'exportModalManagerBadge', 'btnShareSquadNative',
}

lines = iife_code.split('\n')
fixed_lines = []
fixes_applied = 0

i = 0
while i < len(lines):
    line = lines[i]
    stripped = line.strip()
    
    # Pattern 1: Unguarded DOM.xxx.addEventListener on a missing element
    # e.g. "    DOM.btnModeToggle.addEventListener('click', () => {"
    match = re.match(r'^(\s+)(DOM\.(\w+))\.addEventListener\(', line)
    if match:
        indent = match.group(1)
        full_ref = match.group(2)
        prop = match.group(3)
        if prop in missing_elements:
            # Need to find the full block: could be single-line or multi-line
            # Wrap in if (DOM.prop) { ... }
            fixed_lines.append(f'{indent}if ({full_ref}) {{')
            fixed_lines.append(f'  {line}')
            # Look for closing of the addEventListener block
            brace_count = line.count('{') - line.count('}')
            while brace_count > 0 and i + 1 < len(lines):
                i += 1
                next_line = lines[i]
                brace_count += next_line.count('{') - next_line.count('}')
                fixed_lines.append(f'  {next_line}')
            fixed_lines.append(f'{indent}}}')
            fixes_applied += 1
            i += 1
            continue
    
    # Pattern 2: Unguarded DOM.xxx.classList / .textContent / .innerHTML / .value / .className on missing
    # e.g. "    DOM.modeSelectModal.classList.add('hidden');"
    match2 = re.match(r'^(\s+)(DOM\.(\w+))\.(classList|textContent|innerHTML|value|className|style|disabled|appendChild|remove)\b', line)
    if match2:
        indent2 = match2.group(1)
        full_ref2 = match2.group(2)
        prop2 = match2.group(3)
        if prop2 in missing_elements:
            # Check if already guarded (previous line has if check)
            prev = fixed_lines[-1].strip() if fixed_lines else ''
            if f'if ({full_ref2})' not in prev and f'if({full_ref2})' not in prev:
                fixed_lines.append(f'{indent2}if ({full_ref2}) {line.lstrip()}')
                fixes_applied += 1
                i += 1
                continue
    
    # Pattern 3: Unguarded DOM.xxx.innerHTML = ... in populateTeamSelects / populateCatalogSetFilter
    # These elements ARE in HTML so they should be fine, but guard them anyway for safety
    
    fixed_lines.append(line)
    i += 1

iife_code = '\n'.join(fixed_lines)
print(f"Fixes applied inside IIFE: {fixes_applied}")

# ============================================================
# STEP 3: Guard populateTeamSelects and populateCatalogSetFilter
# ============================================================

# populateTeamSelects: DOM.selectPlaying11Team.innerHTML = '' can crash if null
old_populate = "DOM.selectPlaying11Team.innerHTML = '';\n    DOM.userReviewTeamSelect.innerHTML = '';"
new_populate = "if (!DOM.selectPlaying11Team || !DOM.userReviewTeamSelect) return;\n    DOM.selectPlaying11Team.innerHTML = '';\n    DOM.userReviewTeamSelect.innerHTML = '';"
iife_code = iife_code.replace(old_populate, new_populate)

old_catalog = "DOM.catalogSetFilter.innerHTML = '<option value=\"ALL\">All Auction Sets</option>';"
new_catalog = "if (!DOM.catalogSetFilter) return;\n    DOM.catalogSetFilter.innerHTML = '<option value=\"ALL\">All Auction Sets</option>';"
iife_code = iife_code.replace(old_catalog, new_catalog)

# Guard switchAuctionMode's access to removed elements
old_switch = "DOM.modeSelectModal.classList.add('hidden');\n\n    DOM.auctionModeBadge.textContent"
new_switch = "if (DOM.modeSelectModal) DOM.modeSelectModal.classList.add('hidden');\n\n    if (DOM.auctionModeBadge) DOM.auctionModeBadge.textContent"
iife_code = iife_code.replace(old_switch, new_switch)

old_switch2 = "DOM.modeLabel.textContent = `Mode: ${mode === 'MINI' ? 'Mini' : 'Mega'}`;"
new_switch2 = "if (DOM.modeLabel) DOM.modeLabel.textContent = `Mode: ${mode === 'MINI' ? 'Mini' : 'Mega'}`;"
iife_code = iife_code.replace(old_switch2, new_switch2)

# Guard auctionEnd handler's access
old_ae1 = "    switchTab('playing11');"
new_ae1 = "    if (typeof switchTab === 'function') switchTab('playing11');"
# Don't replace all - only do specific ones. Skip for now, this is inside event handler which should be fine.

# ============================================================
# STEP 4: Move outer code INSIDE the IIFE
# ============================================================

# The outer code uses AppState, DOM, Game, StorageEngine, switchTab, etc.
# which are all scoped inside the IIFE. We need to move it inside.

# Clean up the outer code:
# - Remove the dangling code at the very end that's outside any function
#   (the PDF/PNG buttons and Impact Player picker code after the DOMContentLoaded block)

# Find the dangling code after the DOMContentLoaded block
dcl_pattern = "  // Hook into DOMContentLoaded\n"
dcl_idx = outer_code.rfind(dcl_pattern)
if dcl_idx != -1:
    # Find the end of the DOMContentLoaded block
    after_dcl = outer_code[dcl_idx:]
    # Find "setTimeout(initWelcomeAndRoomFlow, 300);\n  }\n"
    end_hook = after_dcl.find("setTimeout(initWelcomeAndRoomFlow, 300);\n  }\n")
    if end_hook != -1:
        # Find the actual end of this block
        end_pos = dcl_idx + end_hook + len("setTimeout(initWelcomeAndRoomFlow, 300);\n  }\n")
        proper_outer = outer_code[:end_pos]
        dangling = outer_code[end_pos:]
        print(f"Dangling code length: {len(dangling)}")
        
        # The dangling code has PDF/PNG button wiring and Impact Player picker
        # Wrap it in a DOMContentLoaded-safe init function
        dangling_stripped = dangling.strip()
        if dangling_stripped:
            # Wrap dangling code in a function called from initWelcomeAndRoomFlow
            wrapped_dangling = f"""

  // Wire additional UI buttons (PDF, PNG, Impact Player)
  function wireAdditionalButtons() {{
    {dangling_stripped}
  }}
"""
            # Also need to call it. We'll add a call right after initWelcomeAndRoomFlow runs
            # Actually, let's just call it inside initWelcomeAndRoomFlow at the end
            # Find the end of initWelcomeAndRoomFlow and add call there
            # OR: simpler - just wrap and call at DOMContentLoaded
            
            # Replace the DOMContentLoaded hook to also call wireAdditionalButtons
            old_hook = """  // Hook into DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initWelcomeAndRoomFlow, 300);
    });
  } else {
    setTimeout(initWelcomeAndRoomFlow, 300);
  }"""
            new_hook = """  // Hook into DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initWelcomeAndRoomFlow, 300);
      wireAdditionalButtons();
    });
  } else {
    setTimeout(initWelcomeAndRoomFlow, 300);
    wireAdditionalButtons();
  }"""
            proper_outer = proper_outer.replace(old_hook, new_hook)
            outer_code = proper_outer + wrapped_dangling
        else:
            outer_code = proper_outer
    else:
        print("WARNING: Could not find end of DOMContentLoaded hook")
else:
    print("WARNING: Could not find DOMContentLoaded hook in outer code")

# Now insert outer code INSIDE the IIFE, just before the closing })();
final_code = iife_code + '\n' + outer_code + '\n\n})();\n'

# ============================================================
# STEP 5: Final safety - guard ALL remaining DOM.xxx property access on missing elements
# ============================================================

# Do a final pass to find any remaining unguarded access
final_lines = final_code.split('\n')
safe_lines = []
for idx, line in enumerate(final_lines):
    modified = False
    for prop in missing_elements:
        full_ref = f'DOM.{prop}'
        # Check for unguarded property access patterns
        patterns = [
            f'{full_ref}.classList',
            f'{full_ref}.textContent',
            f'{full_ref}.innerHTML',
            f'{full_ref}.value',
            f'{full_ref}.className',
            f'{full_ref}.style',
            f'{full_ref}.disabled',
            f'{full_ref}.appendChild',
        ]
        for pat in patterns:
            if pat in line:
                stripped_line = line.strip()
                # Check if already guarded
                if stripped_line.startswith(f'if ({full_ref})') or stripped_line.startswith(f'if({full_ref})'):
                    break
                if f'if ({full_ref})' in line:
                    break
                # Check previous line
                prev_stripped = safe_lines[-1].strip() if safe_lines else ''
                if f'if ({full_ref})' in prev_stripped:
                    break
                    
                # Guard it
                indent = line[:len(line) - len(line.lstrip())]
                line = f'{indent}if ({full_ref}) {line.lstrip()}'
                modified = True
                fixes_applied += 1
                break
        if modified:
            break
    safe_lines.append(line)

final_code = '\n'.join(safe_lines)

# ============================================================
# STEP 6: Write the fixed file
# ============================================================
with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write(final_code)

print(f"\nTotal fixes applied: {fixes_applied}")
print(f"Output written to: {OUTPUT}")
print(f"Output size: {len(final_code)} bytes")

# Verify: count })(); occurrences
iife_count = final_code.count('})();')
print(f"IIFE closures found: {iife_count}")

# Verify: check that the code has balanced braces
open_braces = final_code.count('{')
close_braces = final_code.count('}')
print(f"Braces: {{ = {open_braces}, }} = {close_braces}, diff = {open_braces - close_braces}")
