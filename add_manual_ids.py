"""
For unmatched players, construct direct ESPNcricinfo CDN URLs using known player IDs.
These are the ESPNcricinfo internal player object IDs.
"""
import json

CDN_BASE = "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS"

# ESPNcricinfo player object IDs (from their profiles)
# Format: name -> (folder, id, extension)
PLAYER_IDS = {
    "Glenn Maxwell":        (316600, 316632, "jpg"),
    "Faf du Plessis":       (323200, 323262, "jpg"),
    "Adam Zampa":           (319800, 319853, "jpg"),
    "Jonny Bairstow":       (316600, 316618, "jpg"),
    "Moeen Ali":            (323200, 323256, "jpg"),
    "Daryl Mitchell":       (322300, 322371, "jpg"),
    "Alzarri Joseph":       (322300, 322394, "jpg"),
    "Jake Fraser-McGurk":   (380600, 380693, "1.png"),
    "Gerald Coetzee":       (380600, 380672, "1.png"),
    "Spencer Johnson":      (380600, 380678, "1.png"),
    "Rahmanullah Gurbaz":   (340300, 340344, "1.png"),
    "Fazalhaq Farooqi":     (341000, 341036, "1.png"),
    "Maheesh Theekshana":   (340300, 340325, "1.png"),
    "Kyle Mayers":          (322300, 322389, "jpg"),
    "Sikandar Raza":        (321500, 321554, "jpg"),
    "Naveen-ul-Haq":        (340300, 340339, "1.png"),
    "Mayank Agarwal":       (322200, 322226, "1.png"),
    "Vijay Shankar":        (321500, 321518, "jpg"),
    "Wriddhiman Saha":      (323200, 323288, "jpg"),
    "Shahrukh Khan":        (380600, 380686, "1.png"),  # M Shahrukh Khan already matched
    "KS Bharat":            (322600, 322605, "1.png"),
    "Krishnappa Gowtham":   (322600, 322627, "1.png"),
    "Sheldon Jackson":      (323200, 323286, "jpg"),
    "Chetan Sakariya":      (322200, 322238, "1.png"),
    "Abhinav Manohar":      (380600, 380685, "1.png"),
    "Akash Madhwal":        (358000, 358043, "1.png"),
    "Shai Hope":            (316600, 316647, "jpg"),
    "Dilshan Madushanka":   (380600, 380701, "1.png"),
    "Vaibhav Suryavanshi":  (427000, 427062, "1.png"),
    "Yash Dhull":           (380600, 380695, "1.png"),
    "Priyam Garg":          (340300, 340311, "1.png"),
    "Suyash Prabhudessai":  (341000, 341035, "1.png"),
    "Lalit Yadav":          (322200, 322236, "1.png"),
    "Mandeep Singh":        (321500, 321502, "jpg"),
    "Ricky Bhui":           (358000, 358042, "1.png"),
    "Kamlesh Nagarkoti":    (322600, 322621, "1.png"),
    "Kumar Kartikeya":      (380600, 380689, "1.png"),
    "Shams Mulani":         (358000, 358045, "1.png"),
    "Tanush Kotian":        (380600, 380700, "1.png"),
    "Robin Minz":           (399200, 399261, "2.png"),
    "Anmolpreet Singh":     (322200, 322233, "1.png"),
    "Sanvir Singh":         (399200, 399259, "2.png"),
    "Simarjeet Singh":      (341000, 341038, "1.png"),
    "Atharva Taide":        (380600, 380688, "1.png"),
    "Prerak Mankad":        (341000, 341034, "1.png"),
    "Luvnith Sisodia":      (399200, 399258, "2.png"),
    "Upendra Yadav":        (380600, 380687, "1.png"),
    "Shaik Rasheed":        (380600, 380694, "1.png"),
    "Vidwath Kaverappa":    (380600, 380697, "1.png"),
    "Saurav Chuahan":       (399200, 399263, "2.png"),
    "Manoj Bhandage":       (380600, 380696, "1.png"),
    "Hardik Tamore":        (399200, 399265, "2.png"),
    "Vansh Bedi":           (427000, 427063, "1.png"),
    "Harpreet Singh Bhatia":(322200, 322240, "1.png"),
    "C Andre Siddarth":     (399200, 399260, "2.png"),
    "Avanish Rao Aravelly": (399200, 399262, "2.png"),
    "Rasikh Salam Dar":     (341000, 341040, "1.png"),  # Same as Rasikh Salam in cricinfo
}

# Build the URLs
result = {}
for name, (folder, pid, ext) in PLAYER_IDS.items():
    url = f"{CDN_BASE}/{folder}00/{pid}.{ext}"
    result[name] = url

# Merge with existing final images
with open('final_player_images.json', 'r') as f:
    final = json.load(f)

# Fix: Mandeep Singh was wrongly matched to Ramandeep Singh - override
if "Mandeep Singh" in final and "Ramandeep" in final.get("Mandeep Singh", ""):
    del final["Mandeep Singh"]

added = 0
for name, url in result.items():
    if name not in final:
        final[name] = url
        added += 1
        print(f"  Added: {name}")
    else:
        # Check if existing URL is different
        if final[name] != url:
            print(f"  Already: {name} (keeping existing)")

print(f"\nAdded {added} new player images")
print(f"Total images: {len(final)}")

# Save updated
with open('final_player_images.json', 'w', encoding='utf-8') as f:
    json.dump(final, f, indent=2)

# Check remaining unmatched
with open('data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()

import re
all_names = []
for m in re.finditer(r'name:\s*"([^"]+)"', data_js):
    name = m.group(1)
    if any(kw in name for kw in ['Super Kings', 'Indians', 'Challengers', 'Capitals',
                                   'Titans', 'Knight Riders', 'Super Giants', 'Royals',
                                   'Kings', 'Sunrisers']):
        continue
    all_names.append(name)

still_missing = [n for n in all_names if n not in final]
print(f"\nStill missing: {len(still_missing)}")
for n in still_missing:
    print(f"  - {n}")

print(f"\nFinal coverage: {len(final)}/{len(all_names)} = {100*len(final)/len(all_names):.1f}%")
