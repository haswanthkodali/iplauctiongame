with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if any(fn in l for fn in ['renderPlaying11ViewInteractive', 'renderSquadBenchTray', 'switchTab', 'initUserSession', 'handleCreateNewRoom']):
        print(f"{i+1}: {l.strip()[:80]}")
