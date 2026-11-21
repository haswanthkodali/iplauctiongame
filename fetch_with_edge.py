import subprocess

cmd = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless",
    "--disable-gpu",
    "--virtual-time-budget=10000",
    "--dump-dom",
    "https://www.espncricinfo.com/auction/ipl-2026-auction-1515016/all-players"
]

try:
    p = subprocess.run(cmd, capture_output=True, timeout=25)
    print("Return code:", p.returncode)
    print("Stdout length:", len(p.stdout))
    print("Stderr length:", len(p.stderr))
    if len(p.stdout) > 0:
        with open("cricinfo_edge_dump.html", "wb") as f:
            f.write(p.stdout)
        print("Saved to cricinfo_edge_dump.html!")
except Exception as e:
    print("Error:", e)
