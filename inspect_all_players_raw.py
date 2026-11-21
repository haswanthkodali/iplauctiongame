import json

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\all_players_raw.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

print("Type of raw:", type(raw))
props = raw.get('props', {})
print("props keys:", list(props.keys()))
pageProps = props.get('appPageProps', {})
print("appPageProps keys:", list(pageProps.keys()))
data = pageProps.get('data', {})
print("data keys:", list(data.keys()) if isinstance(data, dict) else type(data))
content = data.get('content', {})
print("content keys:", list(content.keys()) if isinstance(content, dict) else type(content))
players = content.get('players', {})
print("players keys:", list(players.keys()) if isinstance(players, dict) else type(players))
print("players total:", players.get('total'))
print("results count:", len(players.get('results', [])))
