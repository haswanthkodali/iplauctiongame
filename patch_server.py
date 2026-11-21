with open('server.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Add /api/rooms/public in do_GET
get_anchor = "if path == '/api/network-info':"
get_replacement = """if path == '/api/rooms/public':
            db = load_db()
            rooms = [r for r in db.get("multiplayer_rooms", {}).values() if r.get("visibility", "PUBLIC") == "PUBLIC"]
            self._send_json(200, {"success": True, "rooms": rooms})
            return

        if path == '/api/network-info':"""

if get_anchor in code and '/api/rooms/public' not in code:
    code = code.replace(get_anchor, get_replacement)
    print("Added /api/rooms/public to server.py")

with open('server.py', 'w', encoding='utf-8') as f:
    f.write(code)
print("server.py updated")
