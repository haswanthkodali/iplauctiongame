with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
# check that all major divs have matching open/close
opens = len(re.findall(r'<div\b', html))
closes = len(re.findall(r'</div>', html))
print(f"<div> tags: {opens} opens, {closes} closes")

# Check for required IDs
required_ids = [
    'welcomeNewUserModal', 'createRoomModal', 'joinRoomModal', 'roomLobbySection',
    'lobbyRoomsBadge', 'lobbyTeamsGrid', 'lobbyPlayersList', 'lobbyHostPanel',
    'homeAuctionHistorySection', 'homePastAuctionsList', 'homePublicRoomsSection', 'publicRoomsGrid',
    'tabContent-home', 'tabContent-manager', 'tabContent-auction', 'tabContent-franchises', 'tabContent-catalog',
    'arenaPane-bidding', 'arenaPane-playing11', 'arenaPane-messages', 'arenaPane-ratings', 'arenaPane-accelerated',
    'playing11FieldGrid', 'impactPlayerName', 'btnPickImpactPlayer', 'arenaCatListContainer',
    'btnDownloadPdfReport', 'btnDownloadPngCard', 'chatMessagesContainer', 'inputChatMessage', 'btnSendChatMessage'
]

missing = [rid for rid in required_ids if f'id="{rid}"' not in html and f"id='{rid}'" not in html]
if missing:
    print("Missing IDs in index.html:", missing)
else:
    print("✅ All required UI IDs present in index.html!")
