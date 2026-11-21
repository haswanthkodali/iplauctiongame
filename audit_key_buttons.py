import re

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

buttons_to_audit = [
    # Room Lobby
    'lobbyTeamsGrid',
    'btnToggleLobbySettings',
    'btnSaveLobbySettings',
    'btnCancelLobbySettings',
    'btnHostStartAuction',
    'btnLeaveRoomLobby',
    'btnCopyLobbyLink',
    'btnShareLobbyWhatsApp',
    'btnLobbyTimer5s',
    'btnLobbyTimer10s',
    'lobbyEditSettingsBtn',
    'lobbySettingsEditor',
    # Change Team Modal
    'btnHeaderChangeTeam',
    'btnArenaChangeTeam',
    'changeTeamModal',
    'btnCloseChangeTeamModal',
    'changeTeamGrid',
    # Create Room Modal
    'btnOpenCreateRoomModal',
    'createRoomModal',
    'btnCloseCreateRoomModal',
    'btnConfirmCreateRoom',
    'btnRuleMaxBidYes',
    'btnRuleMaxBidNo',
    'btnRuleExceedYes',
    'btnRuleExceedNo',
    'btnRuleAcceleratedOn',
    'btnRuleAcceleratedOff',
    # Join Room Modal
    'btnOpenJoinRoomModal',
    'joinRoomModal',
    'btnCloseJoinRoomModal',
    'btnConfirmJoinRoom',
    # Header & Nav
    'btnPauseResume',
    'btnAudioToggle',
    # Arena
    'btnUserBid',
    'btnPassPlayer',
    'btnPowerJump',
]

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("Auditing key interactive buttons in index.html and app.js:")
for b in buttons_to_audit:
    in_html = f'id="{b}"' in html or f"id='{b}'" in html
    in_app = f"'{b}'" in app_js or f'"{b}"' in app_js
    print(f"  {b:30} -> in HTML: {in_html!s:5} | in app.js: {in_app!s:5}")
