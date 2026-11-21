"""
IPL AUCTION GAME - BACKEND SERVER (server.py)
============================================================================
Lightweight zero-dependency HTTP + REST server in pure Python 3.
Provides:
1. Static web file serving (index.html, JS, assets)
2. User authentication & profile management (login, rename, relogin)
3. Persistent server data storage (server_data.json):
   - User personal profiles
   - Past bid history
   - Past ratings & purchase list reviews
   - Past squad details & Playing 11 setups
4. Multiplayer Room Management:
   - Multiple human managers assigned to different franchises
   - Synchronized multiplayer bidding state
============================================================================
"""

import http.server
import socketserver
import json
import os
import urllib.parse
from datetime import datetime

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'server_data.json')

def get_lan_ip():
    try:
        import socket
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "10.226.78.86"

# Initialize persistent data structure
def load_db():
    if not os.path.exists(DATA_FILE):
        initial = {
            "users": {},
            "multiplayer_rooms": {
                "default": {
                    "roomId": "default",
                    "mode": "MEGA",
                    "humanManagers": {}, # teamId -> { userId, userName }
                    "currentBidder": None,
                    "lastUpdated": datetime.now().isoformat()
                }
            },
            "history": []
        }
        save_db(initial)
        return initial
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading DB: {e}")
        return {"users": {}, "multiplayer_rooms": {}, "history": []}

def save_db(data):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error writing DB: {e}")
        return False

class IPLAuctionRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def _send_json(self, status, payload):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode('utf-8'))

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # API: Get all users / check relogin list
        if path == '/api/users':
            db = load_db()
            user_list = [
                {
                    "userId": u["userId"],
                    "userName": u["userName"],
                    "favoriteTeam": u.get("favoriteTeam", "RCB"),
                    "lastActive": u.get("lastActive"),
                    "auctionCount": len(u.get("pastSquads", []))
                }
                for u in db["users"].values()
            ]
            self._send_json(200, {"success": True, "users": user_list})
            return

        # API: Get specific user profile with past data
        if path.startswith('/api/users/'):
            user_id = path.split('/')[3]
            db = load_db()
            user = db["users"].get(user_id)
            if user:
                self._send_json(200, {"success": True, "user": user})
            else:
                self._send_json(404, {"success": False, "error": "User not found"})
            return

        # API: Network Info & Private Link
        if path == '/api/rooms/public':
            db = load_db()
            rooms = [r for r in db.get("multiplayer_rooms", {}).values() if r.get("visibility", "PUBLIC") == "PUBLIC"]
            self._send_json(200, {"success": True, "rooms": rooms})
            return

        if path == '/api/network-info':
            lan_ip = get_lan_ip()
            self._send_json(200, {
                "success": True,
                "lanIp": lan_ip,
                "lan_ip": lan_ip,
                "port": 8000,
                "https_port": 8443,
                "localhostUrl": "http://localhost:8000",
                "privateLanUrl": f"http://{lan_ip}:8000",
                "securePrivateLanUrl": f"https://{lan_ip}:8443"
            })
            return

        # API: Get Multiplayer Room state (supports ?roomId=...)
        if path == '/api/multiplayer/room':
            db = load_db()
            query = urllib.parse.parse_qs(parsed.query)
            room_id = query.get('roomId', ['default'])[0].strip().upper()
            rooms = db.setdefault("multiplayer_rooms", {})
            if room_id in rooms:
                self._send_json(200, {"success": True, "room": rooms[room_id]})
            else:
                self._send_json(404, {"success": False, "error": "Room not found", "roomId": room_id})
            return

        # Fallback to static files (support /auction rewrite)
        if path == '/auction' or path == '/auction/':
            self.path = '/index.html'
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            body = json.loads(post_body)
        except Exception:
            body = {}

        # API: User Login or Register
        if path == '/api/users/login':
            user_name = (body.get('userName') or '').strip()
            if not user_name:
                self._send_json(400, {"success": False, "error": "User name is required"})
                return

            db = load_db()
            user_id = body.get('userId')
            
            # Find existing by name or userId
            existing_user = None
            if user_id and user_id in db["users"]:
                existing_user = db["users"][user_id]
            else:
                for u in db["users"].values():
                    if u["userName"].lower() == user_name.lower():
                        existing_user = u
                        break

            if existing_user:
                existing_user["lastActive"] = datetime.now().isoformat()
                if body.get('favoriteTeam'):
                    existing_user["favoriteTeam"] = body['favoriteTeam']
                save_db(db)
                self._send_json(200, {"success": True, "user": existing_user, "isNew": False})
            else:
                new_id = f"user_{int(datetime.now().timestamp() * 1000)}"
                new_user = {
                    "userId": new_id,
                    "userName": user_name,
                    "favoriteTeam": body.get('favoriteTeam', 'RCB'),
                    "createdAt": datetime.now().isoformat(),
                    "lastActive": datetime.now().isoformat(),
                    "pastBids": [],       # Full personal bid history
                    "pastRatings": {},    # Custom ratings assigned by this user
                    "pastSquads": []      # Completed squad history
                }
                db["users"][new_id] = new_user
                save_db(db)
                self._send_json(201, {"success": True, "user": new_user, "isNew": True})
            return

        # API: Save user auction result / squad / rating / bids
        if path.startswith('/api/users/') and path.endswith('/auction-result'):
            parts = path.split('/')
            user_id = parts[3]
            db = load_db()
            if user_id not in db["users"]:
                self._send_json(404, {"success": False, "error": "User not found"})
                return

            user = db["users"][user_id]
            squad_entry = body.get('squad')
            ratings_entry = body.get('ratings')
            bids_entry = body.get('bids', [])

            if squad_entry:
                squad_entry["savedAt"] = datetime.now().isoformat()
                user.setdefault("pastSquads", []).append(squad_entry)

            if ratings_entry:
                user.setdefault("pastRatings", {}).update(ratings_entry)

            if bids_entry:
                user.setdefault("pastBids", []).extend(bids_entry)

            save_db(db)
            self._send_json(200, {"success": True, "user": user})
            return

        # API: Multiplayer - Create or Save Room State
        if path in ['/api/multiplayer/room/create', '/api/multiplayer/room/save']:
            raw_id = (body.get('roomId') or f"IPL_{int(datetime.now().timestamp()) % 100000}").strip().upper()
            pin = (body.get('pin') or '').strip()
            db = load_db()
            rooms = db.setdefault("multiplayer_rooms", {})
            existing = rooms.get(raw_id, {})
            rooms[raw_id] = {
                "roomId": raw_id,
                "roomName": body.get('roomName', existing.get('roomName', f"Auction Room {raw_id}")),
                "pin": pin if pin else existing.get('pin', None),
                "mode": body.get('mode', existing.get('mode', 'MINI')),
                "visibility": body.get('visibility', existing.get('visibility', 'PUBLIC')),
                "hostId": body.get('hostId', existing.get('hostId')),
                "hostName": body.get('hostName', existing.get('hostName')),
                "hostTeam": body.get('hostTeam', existing.get('hostTeam')),
                "rules": body.get('rules', existing.get('rules', {})),
                "players": body.get('players', existing.get('players', {})),
                "banned": body.get('banned', existing.get('banned', [])),
                "status": body.get('status', existing.get('status', 'waiting')),
                "createdAt": existing.get('createdAt', body.get('createdAt', datetime.now().isoformat())),
                "lastUpdated": datetime.now().isoformat()
            }
            save_db(db)
            self._send_json(200, {"success": True, "room": rooms[raw_id]})
            return

        # API: Multiplayer - Assign human manager to team
        if path == '/api/multiplayer/room/join':
            room_id = (body.get('roomId') or 'default').strip().upper()
            team_id = body.get('teamId')
            user_id = body.get('userId')
            user_name = body.get('userName')
            pin = (body.get('pin') or '').strip()

            if not team_id or not user_id:
                self._send_json(400, {"success": False, "error": "teamId and userId required"})
                return

            db = load_db()
            rooms = db.setdefault("multiplayer_rooms", {})
            if room_id not in rooms:
                rooms[room_id] = {
                    "roomId": room_id,
                    "mode": "MEGA",
                    "pin": None,
                    "humanManagers": {},
                    "lastUpdated": datetime.now().isoformat()
                }

            room = rooms[room_id]
            # Verify PIN if room has one set
            if room.get("pin") and room.get("pin") != pin:
                self._send_json(403, {"success": False, "error": "Invalid Private Room PIN"})
                return

            room["humanManagers"][team_id] = {
                "userId": user_id,
                "userName": user_name,
                "joinedAt": datetime.now().isoformat()
            }
            room["lastUpdated"] = datetime.now().isoformat()
            save_db(db)
            self._send_json(200, {"success": True, "room": room})
            return

        # API: Multiplayer - Leave Room / Unassign team
        if path == '/api/multiplayer/room/leave':
            room_id = (body.get('roomId') or 'default').strip().upper()
            team_id = body.get('teamId')
            db = load_db()
            rooms = db.setdefault("multiplayer_rooms", {})
            if room_id in rooms and team_id in rooms[room_id].get("humanManagers", {}):
                del rooms[room_id]["humanManagers"][team_id]
                rooms[room_id]["lastUpdated"] = datetime.now().isoformat()
                save_db(db)
            self._send_json(200, {"success": True, "room": rooms.get(room_id, {})})
            return

        self._send_json(404, {"error": "Not Found"})

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            body = json.loads(post_body)
        except Exception:
            body = {}

        # API: Update user's name anytime
        if path.startswith('/api/users/') and path.endswith('/name'):
            parts = path.split('/')
            user_id = parts[3]
            new_name = (body.get('userName') or '').strip()

            if not new_name:
                self._send_json(400, {"success": False, "error": "New name cannot be empty"})
                return

            db = load_db()
            if user_id not in db["users"]:
                db["users"][user_id] = {
                    "userId": user_id,
                    "userName": new_name,
                    "favoriteTeam": "RCB",
                    "createdAt": datetime.now().isoformat(),
                    "lastActive": datetime.now().isoformat(),
                    "pastBids": [],
                    "pastRatings": {},
                    "pastSquads": []
                }
            else:
                db["users"][user_id]["userName"] = new_name
                db["users"][user_id]["lastActive"] = datetime.now().isoformat()

            # Also update any multiplayer room assignments
            room = db["multiplayer_rooms"].get("default", {})
            for t_id, mgr in room.get("humanManagers", {}).items():
                if mgr.get("userId") == user_id:
                    mgr["userName"] = new_name

            save_db(db)
            self._send_json(200, {"success": True, "user": db["users"][user_id]})
            return

        self._send_json(404, {"error": "Not Found"})

def run_server(port=8000, use_https=False):
    load_db()
    cert_path = os.path.join(BASE_DIR, 'cert.pem')
    key_path = os.path.join(BASE_DIR, 'key.pem')
    lan_ip = get_lan_ip()
    https_port = 8443

    # Dual Server: Start HTTPS with SSL cert on port 8443 in background thread
    if os.path.exists(cert_path) and os.path.exists(key_path):
        import ssl
        import threading
        def start_https_worker():
            try:
                socketserver.TCPServer.allow_reuse_address = True
                httpsd = socketserver.TCPServer(("", https_port), IPLAuctionRequestHandler)
                context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
                context.load_cert_chain(certfile=cert_path, keyfile=key_path)
                httpsd.socket = context.wrap_socket(httpsd.socket, server_side=True)
                print(f"🔒 HTTPS SECURE ROOMS ACTIVE (Port {https_port} with cert.pem)", flush=True)
                print(f"👉 Secure HTTPS Local:  https://localhost:{https_port}", flush=True)
                print(f"👉 Secure HTTPS Network: https://{lan_ip}:{https_port}", flush=True)
                httpsd.serve_forever()
            except Exception as e:
                print(f"HTTPS notice: {e}", flush=True)

        t = threading.Thread(target=start_https_worker, daemon=True)
        t.start()

    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", port), IPLAuctionRequestHandler)

    print(f"============================================================")
    print(f"🏆 IPL AUCTION GAME DUAL SERVER (HTTP & HTTPS ACTIVE)")
    print(f"👉 Standard Browser: http://localhost:{port}")
    print(f"👉 Network link:     http://{lan_ip}:{port}")
    print(f"👉 Secure SSL Link:  https://localhost:{https_port}")
    print(f"👉 Secure Network:   https://{lan_ip}:{https_port}")
    print(f"============================================================", flush=True)

    httpd.serve_forever()

if __name__ == '__main__':
    import sys
    port = 8000
    use_https = False
    if '--https' in sys.argv or '8443' in sys.argv:
        port = 8443
        use_https = True
    elif len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port=port, use_https=use_https)
