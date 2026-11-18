with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update playerPhoto img tag
old_img = '<img id="playerPhoto" src="" alt="Player Portrait" class="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105" referrerpolicy="no-referrer" onerror="handlePlayerImageError(this);">'
new_img = '<img id="playerPhoto" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 240 280\'%3E%3Crect width=\'240\' height=\'280\' fill=\'%230f172a\'/%3E%3C/svg%3E" alt="Player Portrait" class="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105" onerror="handlePlayerImageError(this);">'

if old_img in content:
    content = content.replace(old_img, new_img)
    print("Updated playerPhoto in index.html.")
else:
    print("Warning: old_img not found in index.html!")

# 2. Update stat label spans to have IDs
old_stats = """              <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold">Matches</span>
                  <span class="text-sm sm:text-base font-bold text-white" id="statMatches">252</span>
                </div>
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold">Runs</span>
                  <span class="text-sm sm:text-base font-bold text-amber-400" id="statRuns">8004</span>
                </div>
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold">Strike Rate</span>
                  <span class="text-sm sm:text-base font-bold text-blue-400" id="statSR">131.6</span>
                </div>
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold">Average</span>
                  <span class="text-sm sm:text-base font-bold text-emerald-400" id="statAvg">37.25</span>
                </div>
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold">50s / 100s</span>
                  <span class="text-sm sm:text-base font-bold text-purple-400" id="statMilestones">55 / 8</span>
                </div>
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold">Wkts / Econ</span>
                  <span class="text-sm sm:text-base font-bold text-red-400" id="statBowling">4 (8.8)</span>
                </div>
              </div>"""

new_stats = """              <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold" id="lblStat1">Matches</span>
                  <span class="text-sm sm:text-base font-bold text-white" id="statMatches">--</span>
                </div>
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold" id="lblStat2">Runs</span>
                  <span class="text-sm sm:text-base font-bold text-amber-400" id="statRuns">--</span>
                </div>
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold" id="lblStat3">Strike Rate</span>
                  <span class="text-sm sm:text-base font-bold text-blue-400" id="statSR">--</span>
                </div>
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold" id="lblStat4">Average</span>
                  <span class="text-sm sm:text-base font-bold text-emerald-400" id="statAvg">--</span>
                </div>
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold" id="lblStat5">50s / 100s</span>
                  <span class="text-sm sm:text-base font-bold text-purple-400" id="statMilestones">--</span>
                </div>
                <div class="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  <span class="text-[10px] text-slate-400 uppercase block font-semibold" id="lblStat6">Wkts / Econ</span>
                  <span class="text-sm sm:text-base font-bold text-red-400" id="statBowling">--</span>
                </div>
              </div>"""

if old_stats in content:
    content = content.replace(old_stats, new_stats)
    print("Updated stats grid labels in index.html.")
else:
    print("Warning: old_stats not found in index.html!")

# 3. Update commentary initial text
old_comm = '"Welcome franchisees! We open Set 1 with India\'s premier run-machine, Virat Kohli. Base price is set at ₹2.00 Crore. Opening bids please!"'
new_comm = '"Welcome franchisees to the IPL Auction Arena! Players are entering the stage. Place your bids to build your championship squad!"'

if old_comm in content:
    content = content.replace(old_comm, new_comm)
    print("Updated commentary in index.html.")
else:
    print("Warning: old_comm not found in index.html!")

with open(r'C:\Users\haswa\.gemini\antigravity\scratch\ipl-auction-game\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished index.html update.")
