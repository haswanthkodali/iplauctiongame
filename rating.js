/**
 * ============================================================================
 * ENHANCED RATING & ANALYSIS ENGINE — IPL Auction Game
 * ============================================================================
 *
 * Provides:
 *   1. Strongest Playing XI Selection (greedy + backtracking)
 *   2. Backup Player Selection for every XI slot
 *   3. Squad / Purchase-List Rating (Mega & Mini Auction modes)
 *   4. Cross-Team Ranking after auction
 *   5. Auctioneer Strategy AI with team personalities
 *
 * Loaded after data.js and stats.js — expects window.PlayerDB / StatsEngine
 * to already be available when the functions are called at runtime.
 * ============================================================================
 */

const RatingEngine = {

    // ========================================================================
    //  CONSTANTS & TEMPLATES
    // ========================================================================

    /** Ideal XI template: slot index → role expectations */
    XI_TEMPLATE: [
        { slot: 1,  label: "Opener 1",       idealRoles: ["BAT", "WK-BAT"], batting: true,  bowling: false, overseas: true,  wkPreferred: true  },
        { slot: 2,  label: "Opener 2",       idealRoles: ["BAT", "WK-BAT"], batting: true,  bowling: false, overseas: true,  wkPreferred: false },
        { slot: 3,  label: "No.3 Anchor",    idealRoles: ["BAT", "WK-BAT"], batting: true,  bowling: false, overseas: true,  wkPreferred: false },
        { slot: 4,  label: "Middle Order 4",  idealRoles: ["BAT", "WK-BAT", "AR"], batting: true,  bowling: false, overseas: true,  wkPreferred: false },
        { slot: 5,  label: "Middle Order 5",  idealRoles: ["BAT", "WK-BAT", "AR"], batting: true,  bowling: false, overseas: true,  wkPreferred: false },
        { slot: 6,  label: "All-Rounder 6",   idealRoles: ["AR"],           batting: true,  bowling: true,  overseas: true,  wkPreferred: false },
        { slot: 7,  label: "All-Rounder 7",   idealRoles: ["AR", "BOWL"],   batting: true,  bowling: true,  overseas: true,  wkPreferred: false },
        { slot: 8,  label: "Bowler 8",        idealRoles: ["BOWL", "AR"],   batting: false, bowling: true,  overseas: true,  wkPreferred: false },
        { slot: 9,  label: "Bowler 9",        idealRoles: ["BOWL"],         batting: false, bowling: true,  overseas: true,  wkPreferred: false },
        { slot: 10, label: "Bowler 10",       idealRoles: ["BOWL"],         batting: false, bowling: true,  overseas: true,  wkPreferred: false },
        { slot: 11, label: "Bowler 11",       idealRoles: ["BOWL"],         batting: false, bowling: true,  overseas: true,  wkPreferred: false },
    ],

    /** Maximum overseas players in an IPL XI */
    MAX_OVERSEAS_XI: 4,

    /** Maximum overseas players in a squad */
    MAX_OVERSEAS_SQUAD: 8,

    /** Maximum squad size */
    MAX_SQUAD_SIZE: 25,

    // ========================================================================
    //  HELPER: Normalise role strings coming from different data shapes
    // ========================================================================

    _normaliseRole(role) {
        if (!role) return "BAT";
        const r = role.toUpperCase().replace(/[\s-]+/g, "");
        if (r.includes("WICKET") || r.includes("WK"))  return "WK-BAT";
        if (r.includes("ALLROUND") || r === "AR")       return "AR";
        if (r.includes("BOWL"))                          return "BOWL";
        return "BAT";
    },

    _isOverseas(player) {
        if (player.overseas !== undefined) return !!player.overseas;
        if (player.nationality) {
            return player.nationality.toUpperCase() !== "INDIA" &&
                   player.nationality.toUpperCase() !== "IND";
        }
        return false;
    },

    _isWicketKeeper(player) {
        const role = (player.role || "").toUpperCase();
        return role.includes("WK") || role.includes("WICKET") || role.includes("KEEPER");
    },

    // ========================================================================
    //  PLAYER FIT SCORE — how well a player fits a particular XI slot
    // ========================================================================

    /**
     * Parse recentForm which may be a string grade ("A+", "A", "B+", "B", "C")
     * or a numeric 0-1 value. Returns a 0-1 float.
     */
    _parseForm(formValue) {
        if (typeof formValue === 'number') return Math.max(0, Math.min(1, formValue));
        if (typeof formValue === 'string') {
            const f = formValue.trim().toUpperCase();
            if (f === 'A+' || f === 'S') return 1.0;
            if (f === 'A')  return 0.85;
            if (f === 'B+') return 0.70;
            if (f === 'B')  return 0.55;
            if (f === 'C+') return 0.45;
            if (f === 'C')  return 0.35;
            if (f === 'D')  return 0.20;
        }
        return 0.5; // default
    },

    /**
     * Compute a 0-100 fit score for placing `player` in `slot` of the XI.
     * Higher = better fit.
     * 
     * CRITICAL RULES:
     * - Pure batsmen/WK (bowlingRating < 50) get ZERO fit in specialist bowler slots (8-11)
     * - Pure tailender bowlers (battingRating < 40) get ZERO fit in top-order batting slots (1-5)
     * - WK-BAT players get bonus in batting slots 1-5 (they can bat anywhere in top/middle order)
     */
    _playerSlotFitScore(player, slotIndex, playerStatsDB) {
        const template = this.XI_TEMPLATE[slotIndex];
        const role     = this._normaliseRole(player.role);
        const stats    = (playerStatsDB && playerStatsDB[player.name]) || {};

        const bowlRating = stats.bowlingRating || player.bowlingRating || 0;
        const batRating  = stats.battingRating || player.battingRating || 0;

        // ========== HARD GATES — prevent absurd placements ==========
        const isBattingSlot  = slotIndex <= 4;                       // Slots 0-4: Openers, No.3, Middle Order
        const isFinisherSlot = slotIndex === 5 || slotIndex === 6;   // Slots 5-6: All-Rounder / Finisher
        const isBowlerSlot   = slotIndex >= 7;                       // Slots 7-10: Bowler 8, 9, 10, 11
        const isPureBatter   = (role === "BAT" || role === "WK-BAT") && bowlRating < 50;
        const isPureBowler   = role === "BOWL" && batRating < 40;

        // Pure batsmen MUST NOT fill specialist bowling slots (8, 9, 10, 11)
        if (isBowlerSlot && isPureBatter) return 0;
        // Pure tailender bowlers MUST NOT fill top-order batting slots (1-5)
        if (isBattingSlot && isPureBowler) return 0;

        let score = 0;

        // ---- 1. Role Match (0-35) ----
        if (template.idealRoles.includes(role)) {
            score += 35;
        } else if (role === "AR") {
            // All-rounders are flexible; partial credit everywhere
            score += 20;
        } else if ((role === "BAT" || role === "WK-BAT") && template.batting) {
            score += 15;
        } else if (role === "BOWL" && template.bowling) {
            score += 15;
        } else {
            score += 2; // very low — wrong role for this slot
        }

        // ---- 2. Batting position fit (0-25) ----
        if (template.batting) {
            // Scale to 0-15
            score += Math.min(15, (batRating / 100) * 15);

            // Position-specific bonuses
            if (slotIndex <= 1) {
                // Openers: reward strike rate and powerplay stats
                const sr = stats.strikeRate || player.strikeRate || 125;
                const ppSR = stats.powerplaySR || sr;
                score += Math.min(5, ((ppSR - 100) / 60) * 5);
                // Extra for proven openers
                if ((player.battingPosition || 5) <= 2) score += 5;
            } else if (slotIndex === 2) {
                // No.3 anchor: reward average and consistency
                const avg = stats.battingAvg || player.battingAvg || 25;
                score += Math.min(5, (avg / 50) * 5);
                if ((player.battingPosition || 5) === 3) score += 5;
            } else if (slotIndex >= 3 && slotIndex <= 4) {
                // Middle order: power + SR in middle overs
                const sr = stats.middleOversSR || stats.strikeRate || player.strikeRate || 130;
                score += Math.min(5, ((sr - 110) / 50) * 5);
                const avg = stats.battingAvg || player.battingAvg || 25;
                score += Math.min(5, (avg / 45) * 5);
            } else if (slotIndex >= 5 && slotIndex <= 6) {
                // Finishers: death batting SR
                const deathSR = stats.deathSR || stats.strikeRate || player.strikeRate || 140;
                score += Math.min(5, ((deathSR - 120) / 50) * 5);
                score += (role === "AR") ? 5 : 0;
            }
        }

        // ---- 3. Bowling ability (0-20) ----
        if (template.bowling) {
            score += Math.min(12, (bowlRating / 100) * 12);

            const econ = stats.economy || player.economy || 9;
            score += Math.min(4, ((10 - econ) / 4) * 4);

            const wickets = stats.wickets || player.wickets || 0;
            score += Math.min(4, (wickets / 25) * 4);
        }

        // ---- 4. Overall rating boost (0-15) ----
        const overall = stats.overallRating || player.rating || player.overallRating || 50;
        score += Math.min(15, (overall / 100) * 15);

        // ---- 5. WK bonus for top-order slots (0-10) ----
        if (template.wkPreferred && this._isWicketKeeper(player)) {
            score += 10;
        }
        // WK-BAT players also get a small bonus in any batting/middle-order slot
        if (role === "WK-BAT" && (isBattingSlot || isFinisherSlot) && !template.wkPreferred) {
            score += 3;
        }

        // ---- 6. Recent form (0-5) ----
        const form = this._parseForm(stats.recentForm || player.form || 0.5);
        score += form * 5;

        return Math.max(0, Math.min(100, Math.round(score)));
    },

    // ========================================================================
    //  SELECT BEST XI — greedy with backtracking for overseas constraint
    // ========================================================================

    selectBestXI(squadPlayers, playerStatsDB) {
        if (!squadPlayers || squadPlayers.length === 0) {
            return this._emptyXIResult();
        }

        const db = playerStatsDB || {};
        const slots = this.XI_TEMPLATE.length; // 11

        // --- Build fit-score matrix: fitMatrix[slotIndex][playerIndex] ---
        const fitMatrix = [];
        for (let s = 0; s < slots; s++) {
            fitMatrix[s] = squadPlayers.map((p, idx) => ({
                playerIdx: idx,
                player: p,
                fitScore: this._playerSlotFitScore(p, s, db),
            }));
            // Sort descending by fitScore for greedy pass
            fitMatrix[s].sort((a, b) => b.fitScore - a.fitScore);
        }

        // --- Greedy pass: pick best available player per slot ---
        const bestAssignment = this._greedyAssign(fitMatrix, squadPlayers, slots);

        // --- Backtracking improvement: try swaps to improve total score ---
        const improved = this._backtrackImprove(bestAssignment, fitMatrix, squadPlayers, slots);

        // --- Build result object ---
        return this._buildXIResult(improved, squadPlayers, db);
    },

    /**
     * Greedy assignment: iterate slots in priority order, assign best available
     * player while respecting overseas constraint.
     */
    _greedyAssign(fitMatrix, players, slots) {
        const used = new Set();
        let overseasCount = 0;
        const assignment = new Array(slots).fill(null); // assignment[slot] = playerIndex

        // Priority order: top order, anchor, middle order, all-rounders, bowlers
        const slotPriority = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        for (const s of slotPriority) {
            for (const candidate of fitMatrix[s]) {
                if (used.has(candidate.playerIdx)) continue;
                // STRICT HARD-GATE: Never place player if fitScore <= 0 (e.g. pure batsman in bowler slot)
                if (!candidate.fitScore || candidate.fitScore <= 0) continue;

                const isOvs = this._isOverseas(candidate.player);
                if (isOvs && overseasCount >= this.MAX_OVERSEAS_XI) continue;

                assignment[s] = candidate.playerIdx;
                used.add(candidate.playerIdx);
                if (isOvs) overseasCount++;
                break;
            }
        }
        return assignment;
    },

    /**
     * Backtracking improvement: attempt pairwise swaps to increase total fit.
     * Enforces strict role hard-gates during swaps.
     */
    _backtrackImprove(assignment, fitMatrix, players, slots) {
        const best = [...assignment];
        let bestTotal = this._totalFit(best, fitMatrix);
        let improved = true;
        let iterations = 0;
        const MAX_ITER = 100;

        while (improved && iterations < MAX_ITER) {
            improved = false;
            iterations++;

            for (let s1 = 0; s1 < slots; s1++) {
                if (best[s1] === null) continue;
                for (let s2 = s1 + 1; s2 < slots; s2++) {
                    if (best[s2] === null) continue;

                    const pIdx1 = best[s1];
                    const pIdx2 = best[s2];

                    // Check if swap respects role gates (fitScore > 0 for both new slots)
                    const fit1New = fitMatrix[s2].find(c => c.playerIdx === pIdx1)?.fitScore || 0;
                    const fit2New = fitMatrix[s1].find(c => c.playerIdx === pIdx2)?.fitScore || 0;
                    if (fit1New <= 0 || fit2New <= 0) continue;

                    // Try swapping players in slot s1 and s2
                    const temp = [...best];
                    temp[s1] = pIdx2;
                    temp[s2] = pIdx1;

                    // Check overseas constraint
                    if (this._overseasValid(temp, players)) {
                        const newTotal = this._totalFit(temp, fitMatrix);
                        if (newTotal > bestTotal) {
                            best[s1] = temp[s1];
                            best[s2] = temp[s2];
                            bestTotal = newTotal;
                            improved = true;
                        }
                    }
                }

                // Try replacing slot s1 with an unused player
                const usedSet = new Set(best.filter(x => x !== null));
                for (let pIdx = 0; pIdx < players.length; pIdx++) {
                    if (usedSet.has(pIdx)) continue;

                    const fitNew = fitMatrix[s1].find(c => c.playerIdx === pIdx)?.fitScore || 0;
                    if (fitNew <= 0) continue;

                    const temp = [...best];
                    temp[s1] = pIdx;

                    if (this._overseasValid(temp, players)) {
                        const newTotal = this._totalFit(temp, fitMatrix);
                        if (newTotal > bestTotal) {
                            best[s1] = pIdx;
                            bestTotal = newTotal;
                            improved = true;
                        }
                    }
                }
            }
        }
        return best;
    },

    /**
     * Backtracking improvement: attempt pairwise swaps to increase total fit.
     * Limited iterations to avoid performance issues.
     */
    _backtrackImprove(assignment, fitMatrix, players, slots) {
        const best = [...assignment];
        let bestTotal = this._totalFit(best, fitMatrix);
        let improved = true;
        let iterations = 0;
        const MAX_ITER = 200;

        while (improved && iterations < MAX_ITER) {
            improved = false;
            iterations++;

            for (let s1 = 0; s1 < slots; s1++) {
                for (let s2 = s1 + 1; s2 < slots; s2++) {
                    // Try swapping players in slot s1 and s2
                    const temp = [...best];
                    const t = temp[s1];
                    temp[s1] = temp[s2];
                    temp[s2] = t;

                    // Check overseas constraint
                    if (this._overseasValid(temp, players)) {
                        const newTotal = this._totalFit(temp, fitMatrix);
                        if (newTotal > bestTotal) {
                            best[s1] = temp[s1];
                            best[s2] = temp[s2];
                            bestTotal = newTotal;
                            improved = true;
                        }
                    }
                }

                // Try replacing slot s1 with an unused player
                const usedSet = new Set(best.filter(x => x !== null));
                for (let pIdx = 0; pIdx < players.length; pIdx++) {
                    if (usedSet.has(pIdx)) continue;

                    const temp = [...best];
                    temp[s1] = pIdx;

                    if (this._overseasValid(temp, players)) {
                        const newTotal = this._totalFit(temp, fitMatrix);
                        if (newTotal > bestTotal) {
                            best[s1] = pIdx;
                            bestTotal = newTotal;
                            improved = true;
                        }
                    }
                }
            }
        }

        return best;
    },

    _totalFit(assignment, fitMatrix) {
        let total = 0;
        for (let s = 0; s < assignment.length; s++) {
            if (assignment[s] === null) continue;
            const entry = fitMatrix[s].find(e => e.playerIdx === assignment[s]);
            total += entry ? entry.fitScore : 0;
        }
        return total;
    },

    _overseasValid(assignment, players) {
        let count = 0;
        for (const pIdx of assignment) {
            if (pIdx !== null && this._isOverseas(players[pIdx])) {
                count++;
                if (count > this.MAX_OVERSEAS_XI) return false;
            }
        }
        return true;
    },

    /**
     * Build the final XI result object from the assignment array.
     */
    _buildXIResult(assignment, players, db) {
        const xi = [];
        let totalRating = 0;
        let overseasUsed = 0;
        let battingDepth = 0;
        let bowlingOptions = 0;
        let hasWK = false;

        for (let s = 0; s < assignment.length; s++) {
            const pIdx = assignment[s];
            if (pIdx === null) {
                xi.push({ player: null, position: s + 1, role: "EMPTY", fitScore: 0 });
                continue;
            }
            const player = players[pIdx];
            const role = this._normaliseRole(player.role);
            const stats = db[player.name] || {};
            const fitScore = this._playerSlotFitScore(player, s, db);

            xi.push({
                player: player,
                position: s + 1,
                role: role,
                fitScore: fitScore,
            });

            totalRating += fitScore;

            if (this._isOverseas(player)) overseasUsed++;
            if (this._isWicketKeeper(player)) hasWK = true;

            // Batting depth: count positions where player has decent batting
            const batRating = stats.battingRating || player.battingRating || 0;
            if (batRating >= 30 || role === "BAT" || role === "WK-BAT" || role === "AR") {
                battingDepth = s + 1; // last position with a batter
            }

            // Bowling options: count players who can bowl
            const bowlRating = stats.bowlingRating || player.bowlingRating || 0;
            if (bowlRating >= 25 || role === "BOWL" || role === "AR") {
                bowlingOptions++;
            }
        }

        // Normalise totalRating to 0-100 scale (max possible ~1100 for 11 × 100)
        const normalisedRating = Math.round((totalRating / (11 * 100)) * 100);

        // Determine balance
        const balance = this._assessBalance(xi, db);

        // Identify strengths & weaknesses
        const { strengths, weaknesses } = this._identifyStrengthsWeaknesses(xi, db, hasWK, battingDepth, bowlingOptions, overseasUsed);

        return {
            xi,
            totalRating: normalisedRating,
            battingDepth,
            bowlingOptions,
            balance,
            overseasUsed,
            strengths,
            weaknesses,
        };
    },

    /**
     * Evaluates a custom user-built Playing 11 (array of up to 11 players).
     * Computes Batting Depth, Bowling Depth, Player Skills, Overseas limit,
     * Wicket-keeper check, and Final Composite Championship Rating.
     */
    evaluateUserXI(userXI, fullSquad, playerStatsDB) {
        const db = playerStatsDB || {};
        const xi = [];
        let totalFitScore = 0;
        let overseasUsed = 0;
        let battingDepth = 0;
        let bowlingOptions = 0;
        let paceCount = 0;
        let spinCount = 0;
        let hasWK = false;
        let totalBatRating = 0;
        let totalBowlRating = 0;
        let totalSkillRating = 0;
        let filledCount = 0;

        for (let s = 0; s < 11; s++) {
            const player = userXI && userXI[s] ? userXI[s] : null;
            if (!player) {
                xi.push({ player: null, position: s + 1, role: "EMPTY", fitScore: 0 });
                continue;
            }

            filledCount++;
            const role = this._normaliseRole(player.role);
            const stats = db[player.name] || {};
            const fitScore = this._playerSlotFitScore(player, s, db);

            xi.push({
                player: player,
                position: s + 1,
                role: role,
                fitScore: fitScore
            });

            totalFitScore += fitScore;
            totalSkillRating += (player.rating || 80);

            if (this._isOverseas(player)) overseasUsed++;
            if (this._isWicketKeeper(player)) hasWK = true;

            const batRating = stats.battingRating || player.battingRating || 0;
            const bowlRating = stats.bowlingRating || player.bowlingRating || 0;
            totalBatRating += batRating;
            totalBowlRating += bowlRating;

            if (batRating >= 35 || role === "BAT" || role === "WK-BAT" || role === "AR") {
                battingDepth = s + 1;
            }
            if (bowlRating >= 30 || role === "BOWL" || role === "AR") {
                bowlingOptions++;
                const bowlType = (stats.bowlingType || player.bowlingType || player.speciality || "").toUpperCase();
                if (bowlType.includes("SPIN") || bowlType.includes("LEG") || bowlType.includes("OFF")) {
                    spinCount++;
                } else {
                    paceCount++;
                }
            }
        }

        // 1. Batting Depth Score (0-100)
        let battingDepthScore = 0;
        if (filledCount > 0) {
            const avgBat = totalBatRating / Math.min(8, Math.max(1, battingDepth));
            const depthFactor = Math.min(100, (battingDepth / 8) * 40 + (avgBat / 95) * 60);
            battingDepthScore = Math.round(depthFactor);
        }

        // 2. Bowling Depth Score (0-100)
        let bowlingDepthScore = 0;
        if (filledCount > 0) {
            const optionsFactor = Math.min(50, (bowlingOptions / 6) * 50); // 6 bowling options = 50 pts
            const avgBowl = bowlingOptions > 0 ? (totalBowlRating / bowlingOptions) : 0;
            const varietyBonus = (paceCount > 0 && spinCount > 0) ? 10 : 0;
            bowlingDepthScore = Math.min(100, Math.round(optionsFactor + (avgBowl / 95) * 40 + varietyBonus));
        }

        // 3. Player Skill & Impact Score (0-100)
        const avgOvr = filledCount > 0 ? (totalSkillRating / filledCount) : 0;
        const skillScore = Math.round((avgOvr / 96) * 100);

        // 4. Role Balance Score (0-100)
        let balanceScore = 80;
        if (hasWK) balanceScore += 10; else balanceScore -= 25;
        if (overseasUsed > 4) balanceScore -= 30; // Illegal overseas
        if (bowlingOptions < 5) balanceScore -= 20; // Need min 5 bowlers in T20
        balanceScore = Math.max(0, Math.min(100, balanceScore));

        // 5. Final Composite Score
        const finalRating = Math.round(
            (battingDepthScore * 0.35) +
            (bowlingDepthScore * 0.35) +
            (skillScore * 0.20) +
            (balanceScore * 0.10)
        );

        const { strengths, weaknesses } = this._identifyStrengthsWeaknesses(xi, db, hasWK, battingDepth, bowlingOptions, overseasUsed);

        let tier = "B-Tier Contender";
        if (finalRating >= 90) tier = "🏆 S-Tier Championship Favorite";
        else if (finalRating >= 84) tier = "⭐ A+ Playoff Contender";
        else if (finalRating >= 78) tier = "🏏 A-Tier Competitive Squad";
        else if (finalRating >= 70) tier = "⚡ B+ Emerging Contender";

        return {
            xi,
            filledCount,
            totalRating: finalRating,
            finalRating: finalRating,
            battingDepthScore,
            bowlingDepthScore,
            skillScore,
            balanceScore,
            avgRating: Math.round(avgOvr),
            battingDepth,
            bowlingOptions,
            paceCount,
            spinCount,
            overseasUsed,
            hasWK,
            isOverseasValid: overseasUsed <= 4,
            tier,
            strengths,
            weaknesses
        };
    },

    _assessBalance(xi, db) {
        let batScore = 0;
        let bowlScore = 0;

        for (const entry of xi) {
            if (!entry.player) continue;
            const stats = db[entry.player.name] || {};
            batScore  += stats.battingRating  || entry.player.battingRating  || 0;
            bowlScore += stats.bowlingRating   || entry.player.bowlingRating  || 0;
        }

        const ratio = batScore / (bowlScore || 1);

        if (ratio > 2.0) return "Batting Heavy";
        if (ratio < 0.7) return "Bowling Heavy";
        if (ratio >= 0.9 && ratio <= 1.5) return "Balanced";
        return "All-Round";
    },

    _identifyStrengthsWeaknesses(xi, db, hasWK, battingDepth, bowlingOptions, overseasUsed) {
        const strengths  = [];
        const weaknesses = [];

        // --- Batting depth ---
        if (battingDepth >= 8)       strengths.push("Deep batting lineup (bat to #" + battingDepth + ")");
        else if (battingDepth <= 6)  weaknesses.push("Shallow batting — only " + battingDepth + " recognised batters");

        // --- Bowling variety ---
        let paceCount = 0, spinCount = 0;
        for (const entry of xi) {
            if (!entry.player) continue;
            const stats = db[entry.player.name] || {};
            const bowlType = (stats.bowlingType || entry.player.bowlingType || "").toUpperCase();
            if (bowlType.includes("PACE") || bowlType.includes("FAST") || bowlType.includes("MEDIUM")) paceCount++;
            if (bowlType.includes("SPIN") || bowlType.includes("LEG") || bowlType.includes("OFF") || bowlType.includes("LEFT ARM ORTHODOX")) spinCount++;
        }
        if (paceCount >= 3) strengths.push("Strong pace attack (" + paceCount + " pacers)");
        if (spinCount >= 2) strengths.push("Good spin options (" + spinCount + " spinners)");
        if (paceCount <= 1) weaknesses.push("Weak pace attack — only " + paceCount + " pacer(s)");
        if (spinCount === 0) weaknesses.push("No specialist spinner");

        // --- Bowling options ---
        if (bowlingOptions >= 7) strengths.push(bowlingOptions + " bowling options gives flexibility");
        if (bowlingOptions <= 4) weaknesses.push("Only " + bowlingOptions + " bowling options — risky if one fails");

        // --- WK ---
        if (!hasWK) weaknesses.push("No specialist wicket-keeper selected");

        // --- Overseas usage ---
        if (overseasUsed === 4) strengths.push("All 4 overseas slots utilised");
        if (overseasUsed <= 2) weaknesses.push("Under-utilising overseas slots (" + overseasUsed + "/4)");

        // --- Star quality ---
        let starCount = 0;
        for (const entry of xi) {
            if (!entry.player) continue;
            const overall = (db[entry.player.name] || {}).overallRating || entry.player.rating || 0;
            if (overall >= 85) starCount++;
        }
        if (starCount >= 3) strengths.push(starCount + " elite-rated players in XI");
        if (starCount === 0) weaknesses.push("No marquee match-winner in XI");

        return { strengths, weaknesses };
    },

    _emptyXIResult() {
        return {
            xi: [],
            totalRating: 0,
            battingDepth: 0,
            bowlingOptions: 0,
            balance: "Balanced",
            overseasUsed: 0,
            strengths: [],
            weaknesses: ["No players in squad"],
        };
    },

    // ========================================================================
    //  SELECT BACKUPS — best replacement for every XI position
    // ========================================================================

    selectBackups(squadPlayers, selectedXI, playerStatsDB) {
        const db = playerStatsDB || {};

        // Build set of XI player names for exclusion
        const xiNames = new Set();
        for (const entry of selectedXI.xi) {
            if (entry.player) xiNames.add(entry.player.name);
        }

        // Available bench players
        const bench = squadPlayers.filter(p => !xiNames.has(p.name));

        const backups = [];

        for (let s = 0; s < selectedXI.xi.length; s++) {
            const starter = selectedXI.xi[s];
            if (!starter.player) {
                backups.push({
                    position: s + 1,
                    starter: "EMPTY",
                    backup: null,
                    ratingDrop: 0,
                    note: "No suitable backup",
                });
                continue;
            }

            // Score every bench player for this slot
            const candidates = bench.map(p => ({
                player: p,
                fitScore: this._playerSlotFitScore(p, s, db),
            })).sort((a, b) => b.fitScore - a.fitScore);

            // Check overseas impact: if starter is Indian but backup is overseas,
            // ensure we wouldn't exceed the 4-overseas cap after the swap.
            let bestBackup = null;
            let bestScore  = 0;

            for (const c of candidates) {
                const starterOvs = this._isOverseas(starter.player);
                const backupOvs  = this._isOverseas(c.player);

                // If swapping in an overseas player for a domestic one, check cap
                if (!starterOvs && backupOvs) {
                    if (selectedXI.overseasUsed >= this.MAX_OVERSEAS_XI) continue;
                }

                bestBackup = c.player;
                bestScore  = c.fitScore;
                break;
            }

            const ratingDrop = starter.fitScore - bestScore;
            let note;
            if (!bestBackup) {
                note = "No suitable backup";
            } else if (ratingDrop <= 5) {
                note = "Like-for-like";
            } else if (ratingDrop <= 15) {
                note = "Slight downgrade";
            } else if (this._normaliseRole(bestBackup.role) !== this._normaliseRole(starter.player.role)) {
                note = "Role change needed";
            } else {
                note = "Significant downgrade";
            }

            backups.push({
                position: s + 1,
                starter: starter.player.name,
                backup: bestBackup ? bestBackup.name : null,
                ratingDrop: Math.max(0, ratingDrop),
                note,
            });
        }

        return backups;
    },

    // ========================================================================
    //  RATE SQUAD — comprehensive purchase-list evaluation
    // ========================================================================

    rateSquad(teamData, squadPlayers, playerStatsDB, auctionMode) {
        const db      = playerStatsDB || {};
        const isMini  = (auctionMode || "").toUpperCase() === "MINI";
        const squad   = squadPlayers || [];

        // 1. Playing XI strength
        const xiResult   = this.selectBestXI(squad, db);
        const xiScore    = xiResult.totalRating;

        // 2. Squad depth: bench quality relative to starters
        const depthScore = this._calcSquadDepth(squad, xiResult, db);

        // 3. Balance: bat/bowl/AR distribution
        const balanceScore = this._calcBalanceScore(squad, db);

        // 4. Value for money: rating per crore
        const vfmScore = this._calcValueForMoney(squad, db, teamData);

        // 5. Overseas quality
        const overseasScore = this._calcOverseasQuality(squad, db);

        // 6. Future potential: young players
        const futureScore = this._calcFuturePotential(squad, db);

        // 7. Past team data (mini auction only)
        const pastScore = isMini ? this._calcPastTeamScore(teamData) : 0;

        // --- Weighted aggregation ---
        let overallScore;
        const breakdown = {};

        if (isMini) {
            // Mini auction: 40% Past Team Data + 60% Strongest Playing XI for each spot & backups
            const squadScore60 = Math.round(xiScore * 0.70 + depthScore * 0.30);
            overallScore = Math.round(pastScore * 0.40 + squadScore60 * 0.60);

            breakdown.formula = "40% Past Team Core Data + 60% (Strongest Playing XI & Spot Backups)";
            breakdown.pastTeamData = {
                weight: "40%",
                score: Math.round(pastScore),
                grade: this.getGrade(pastScore),
                details: this._pastTeamDetails(teamData),
            };
            breakdown.squadScore60 = {
                weight: "60%",
                score: squadScore60,
                grade: this.getGrade(squadScore60),
                playingXIComponent: Math.round(xiScore),
                backupsComponent: Math.round(depthScore),
                details: "Strongest XI: " + xiScore + "/100 (70% weight) | Bench Backups: " + depthScore + "/100 (30% weight)",
            };
            breakdown.playingXI = {
                score: Math.round(xiScore),
                grade: this.getGrade(xiScore),
                details: "Best XI rating " + xiScore + "/100 — " + xiResult.balance,
            };
            breakdown.squadDepth = {
                score: Math.round(depthScore),
                grade: this.getGrade(depthScore),
                details: "Bench backups depth across 11 spots: " + depthScore + "/100",
            };
        } else {
            // Mega auction: weighted combination
            overallScore = Math.round(
                xiScore       * 0.35 +
                depthScore    * 0.20 +
                balanceScore  * 0.15 +
                vfmScore      * 0.15 +
                overseasScore * 0.10 +
                futureScore   * 0.05
            );

            breakdown.playingXI = {
                score: Math.round(xiScore),
                grade: this.getGrade(xiScore),
                details: "Best XI rating " + xiScore + "/100 — " + xiResult.balance,
            };
            breakdown.squadDepth = {
                score: Math.round(depthScore),
                grade: this.getGrade(depthScore),
                details: squad.length + " players, bench quality score " + Math.round(depthScore),
            };
            breakdown.balance = {
                score: Math.round(balanceScore),
                grade: this.getGrade(balanceScore),
                details: this._balanceDetails(squad, db),
            };
            breakdown.valueForMoney = {
                score: Math.round(vfmScore),
                grade: this.getGrade(vfmScore),
                details: this._vfmDetails(squad, db, teamData),
            };
            breakdown.overseasQuality = {
                score: Math.round(overseasScore),
                grade: this.getGrade(overseasScore),
                details: this._overseasDetails(squad, db),
            };
            breakdown.futurePotential = {
                score: Math.round(futureScore),
                grade: this.getGrade(futureScore),
                details: this._futureDetails(squad),
            };
        }

        // Strengths / weaknesses from XI result + squad-level observations
        const { strengths, weaknesses } = this._squadStrengthsWeaknesses(squad, xiResult, db, teamData);

        // Recommendation
        const recommendation = this._generateRecommendation(squad, xiResult, db, teamData);

        return {
            overallGrade: this.getGrade(overallScore),
            overallScore,
            breakdown,
            strengths,
            weaknesses,
            recommendation,
        };
    },

    // --- Squad rating sub-calculations ---

    _calcSquadDepth(squad, xiResult, db) {
        if (squad.length <= 11) return Math.max(10, squad.length * 4);

        const backups = this.selectBackups(squad, xiResult, db);
        const avgDrop = backups.reduce((sum, b) => sum + b.ratingDrop, 0) / backups.length;

        // Lower average rating drop = better depth
        // avgDrop 0 → score 100, avgDrop 40+ → score 20
        let score = 100 - (avgDrop * 2);

        // Bonus for large squad
        if (squad.length >= 22) score += 5;
        if (squad.length >= 18) score += 5;

        return Math.max(0, Math.min(100, score));
    },

    _calcBalanceScore(squad, db) {
        let batCount = 0, bowlCount = 0, arCount = 0, wkCount = 0;
        for (const p of squad) {
            const role = this._normaliseRole(p.role);
            if (role === "BAT")     batCount++;
            if (role === "BOWL")    bowlCount++;
            if (role === "AR")      arCount++;
            if (role === "WK-BAT")  wkCount++;
        }

        let score = 50; // start at middle

        // Ideal: 4-5 batters, 4-5 bowlers, 3-4 AR, 1-2 WK per XI
        // We rate based on squad proportions
        const total = squad.length || 1;
        const batPct  = (batCount + wkCount) / total;
        const bowlPct = bowlCount / total;
        const arPct   = arCount / total;

        // Bat: ideal 30-40%
        if (batPct >= 0.25 && batPct <= 0.45) score += 15;
        else if (batPct >= 0.20 && batPct <= 0.50) score += 8;

        // Bowl: ideal 30-40%
        if (bowlPct >= 0.25 && bowlPct <= 0.45) score += 15;
        else if (bowlPct >= 0.20 && bowlPct <= 0.50) score += 8;

        // AR: ideal 15-25%
        if (arPct >= 0.12 && arPct <= 0.30) score += 10;
        else if (arPct >= 0.08) score += 5;

        // WK: need at least 1, ideally 2
        if (wkCount >= 2) score += 10;
        else if (wkCount === 1) score += 5;
        else score -= 15;

        return Math.max(0, Math.min(100, score));
    },

    _calcValueForMoney(squad, db, teamData) {
        const totalSpent = (teamData && teamData.spent) || squad.reduce((s, p) => s + (p.price || 0.5), 0);
        if (totalSpent <= 0) return 50;

        let totalRating = 0;
        for (const p of squad) {
            const stats = db[p.name] || {};
            totalRating += stats.overallRating || p.rating || p.overallRating || 50;
        }

        // Rating points per crore
        const ratingPerCrore = totalRating / totalSpent;

        // Benchmark: ~8-10 rating pts per crore is average
        // 15+ is excellent, <5 is poor
        let score = Math.min(100, (ratingPerCrore / 15) * 100);

        // Penalty for massive overpays on single players
        for (const p of squad) {
            const rating = (db[p.name] || {}).overallRating || p.rating || 50;
            const price  = p.price || 0.5;
            const expectedPrice = (rating / 100) * 15; // rough fair value
            if (price > expectedPrice * 2) {
                score -= 3; // penalty for each big overpay
            }
        }

        return Math.max(0, Math.min(100, Math.round(score)));
    },

    _calcOverseasQuality(squad, db) {
        const overseas = squad.filter(p => this._isOverseas(p));
        if (overseas.length === 0) return 20;

        let totalRating = 0;
        for (const p of overseas) {
            const stats = db[p.name] || {};
            totalRating += stats.overallRating || p.rating || p.overallRating || 50;
        }

        const avgRating = totalRating / overseas.length;

        // Average overseas rating: 60 avg → 60 score, 85+ → 95 score
        let score = Math.min(95, avgRating * 1.1);

        // Bonus for having diverse overseas roles
        const roles = new Set(overseas.map(p => this._normaliseRole(p.role)));
        if (roles.size >= 3) score += 5;

        return Math.max(0, Math.min(100, Math.round(score)));
    },

    _calcFuturePotential(squad, db) {
        let youngCount = 0;
        let uncappedCount = 0;

        for (const p of squad) {
            const age = p.age || 27;
            if (age <= 23) youngCount++;
            if (age <= 21) youngCount += 0.5; // extra bonus for very young
            if (p.uncapped || p.isCapped === false) uncappedCount++;
        }

        // 3+ young players is good, 5+ is excellent
        let score = Math.min(60, youngCount * 12);

        // Uncapped talent shows scouting depth
        score += Math.min(20, uncappedCount * 5);

        // Base score so teams aren't penalised too hard
        score += 20;

        return Math.max(0, Math.min(100, Math.round(score)));
    },

    _calcPastTeamScore(teamData) {
        if (!teamData) return 50;

        let score = 40; // base

        // Titles
        const titles = teamData.titles || teamData.iplTitles || 0;
        score += Math.min(20, titles * 5);

        // Win percentage
        const winPct = teamData.winPercentage || teamData.winPct || 50;
        score += Math.min(20, ((winPct - 40) / 25) * 20);

        // Recent seasons (playoffs in last 3 years)
        const recentPlayoffs = teamData.recentPlayoffs || 0;
        score += Math.min(10, recentPlayoffs * 4);

        // Historical strength / legacy factor
        const legacy = teamData.legacy || teamData.historyScore || 5;
        score += Math.min(10, legacy);

        return Math.max(0, Math.min(100, Math.round(score)));
    },

    // --- Detail string generators for breakdown ---

    _pastTeamDetails(teamData) {
        if (!teamData) return "No historical data available";
        const titles = teamData.titles || teamData.iplTitles || 0;
        const winPct = teamData.winPercentage || teamData.winPct || "N/A";
        return titles + " title(s), " + winPct + "% win rate, legacy franchise";
    },

    _balanceDetails(squad, db) {
        let bat = 0, bowl = 0, ar = 0, wk = 0;
        for (const p of squad) {
            const role = this._normaliseRole(p.role);
            if (role === "BAT") bat++;
            if (role === "BOWL") bowl++;
            if (role === "AR") ar++;
            if (role === "WK-BAT") wk++;
        }
        return bat + " batters, " + bowl + " bowlers, " + ar + " all-rounders, " + wk + " WK(s)";
    },

    _vfmDetails(squad, db, teamData) {
        const totalSpent = (teamData && teamData.spent) || squad.reduce((s, p) => s + (p.price || 0.5), 0);
        return "₹" + totalSpent.toFixed(1) + "cr spent on " + squad.length + " players";
    },

    _overseasDetails(squad, db) {
        const overseas = squad.filter(p => this._isOverseas(p));
        return overseas.length + " overseas player(s) in squad";
    },

    _futureDetails(squad) {
        const young = squad.filter(p => (p.age || 27) <= 23);
        return young.length + " players aged 23 or under";
    },

    // --- Squad-level strengths/weaknesses ---

    _squadStrengthsWeaknesses(squad, xiResult, db, teamData) {
        // Start with XI-level observations
        const strengths  = [...xiResult.strengths];
        const weaknesses = [...xiResult.weaknesses];

        // Squad size
        if (squad.length >= 22) strengths.push("Full-strength squad of " + squad.length + " players");
        if (squad.length < 15) weaknesses.push("Very thin squad — only " + squad.length + " players");

        // Budget remaining
        const budget = (teamData && teamData.budget) || 120;
        const spent  = (teamData && teamData.spent) || squad.reduce((s, p) => s + (p.price || 0.5), 0);
        const remaining = budget - spent;
        if (remaining > 30) strengths.push("₹" + remaining.toFixed(1) + "cr remaining — good flexibility");
        if (remaining < 5 && squad.length < 20) weaknesses.push("Low remaining budget (₹" + remaining.toFixed(1) + "cr) with squad spots to fill");

        // Check for marquee players
        let topPlayerCount = 0;
        for (const p of squad) {
            const r = (db[p.name] || {}).overallRating || p.rating || 0;
            if (r >= 90) topPlayerCount++;
        }
        if (topPlayerCount >= 2) strengths.push(topPlayerCount + " marquee (90+ rated) players signed");

        return { strengths, weaknesses };
    },

    _generateRecommendation(squad, xiResult, db, teamData) {
        const needs = this.auctioneerStrategy.analyzeTeamNeeds({ ...teamData, name: (teamData || {}).name }, squad);

        if (needs.criticalNeeds.length > 0) {
            return "URGENT: Must address critical needs — " + needs.criticalNeeds.join(", ");
        }
        if (needs.importantNeeds.length > 0) {
            return "Target " + needs.importantNeeds[0] + " in remaining auction rounds";
        }
        if (needs.niceToHave.length > 0) {
            return "Consider adding depth: " + needs.niceToHave.join(", ");
        }
        return "Squad looks well-rounded — focus on value picks for remaining budget";
    },

    // ========================================================================
    //  RANK ALL TEAMS
    // ========================================================================

    rankTeams(allTeams, playerStatsDB, auctionMode) {
        const db = playerStatsDB || {};
        const rankings = [];

        for (const team of allTeams) {
            const squad       = team.players || team.squad || [];
            const squadRating = this.rateSquad(team, squad, db, auctionMode);
            const bestXI      = this.selectBestXI(squad, db);
            const backups     = this.selectBackups(squad, bestXI, db);

            // Identify MVP & worst purchase
            // MVP formula: 75% role-specific rating (Bowler -> Bowling, Batter/WK -> Batting, AR -> Combined) + 25% price value
            let mvp = { player: "N/A", value: "N/A", score: 0, roleRating: 0, price: 0 };
            let worst = { player: "N/A", value: "N/A" };
            let highestMvpScore = -Infinity;
            let worstValueRatio = Infinity;

            for (const p of squad) {
                const stats = db[p.name] || {};
                const role = (p.role || '').toUpperCase();
                const price = Number(p.soldPrice !== undefined ? p.soldPrice : (p.price !== undefined ? p.price : 0.5));

                // 75% Role-Specific Rating:
                // - If Bowler: evaluate bowlingRating
                // - If Batter or Wicketkeeper: evaluate battingRating
                // - If All-Rounder: weighted combination of batting and bowling
                let roleRating = 75;
                if (role.includes('BOWL')) {
                    roleRating = stats.bowlingRating || p.bowlingRating || p.rating || stats.overallRating || 75;
                } else if (role.includes('BAT') || role.includes('WK') || role.includes('WICKET')) {
                    roleRating = stats.battingRating || p.battingRating || p.rating || stats.overallRating || 75;
                } else if (role.includes('ALL') || role === 'AR') {
                    const batR = stats.battingRating || p.battingRating || p.rating || 75;
                    const bowlR = stats.bowlingRating || p.bowlingRating || p.rating || 75;
                    roleRating = Math.max(batR, bowlR) * 0.6 + Math.min(batR, bowlR) * 0.4;
                } else {
                    roleRating = p.rating || stats.overallRating || 75;
                }

                // 25% Price Factor (0-100 scale: lower price = higher efficiency score)
                // Benchmark: ₹0.30 Cr base gives 100 pts, ₹25 Cr gives 20 pts
                const priceScore = Math.max(10, Math.min(100, 100 - ((price - 0.3) / 24.7) * 80));

                // Final MVP score = 75% role rating + 25% price efficiency
                const mvpScore = (roleRating * 0.75) + (priceScore * 0.25);

                if (mvpScore > highestMvpScore) {
                    highestMvpScore = mvpScore;
                    const valueTag = mvpScore >= 83 ? "Elite Steal" : mvpScore >= 75 ? "Top Value" : mvpScore >= 68 ? "Good Buy" : "Star Asset";
                    mvp = {
                        player: p.name,
                        value: `${valueTag} (₹${price.toFixed(2)} Cr)`,
                        score: Math.round(mvpScore),
                        roleRating: Math.round(roleRating),
                        price: price
                    };
                }

                // Value ratio for worst purchase
                const ratio = roleRating / Math.max(0.3, price);
                if (ratio < worstValueRatio && price > 2.0) {
                    worstValueRatio = ratio;
                    worst = {
                        player: p.name,
                        value: price > 15 ? "Massively Overpaid" : "High Premium"
                    };
                }
            }

            const moneySpent     = (team.spent) || squad.reduce((s, p) => s + (p.price || 0.5), 0);
            const budget         = team.budget || 120;
            const moneyRemaining = budget - moneySpent;

            rankings.push({
                rank: 0, // will be set after sort
                team: team,
                overallScore: squadRating.overallScore,
                grade: squadRating.overallGrade,
                bestXI: bestXI.xi,
                bestXIRating: bestXI.totalRating,
                moneySpent: Math.round(moneySpent * 10) / 10,
                moneyRemaining: Math.round(moneyRemaining * 10) / 10,
                playersBought: squad.length,
                mvpPurchase: mvp,
                worstPurchase: worst,
                squadRating: squadRating,
            });
        }

        // Sort by overall score descending
        rankings.sort((a, b) => b.overallScore - a.overallScore);

        // Assign ranks
        for (let i = 0; i < rankings.length; i++) {
            rankings[i].rank = i + 1;
        }

        return rankings;
    },

    // ========================================================================
    //  AUCTIONEER STRATEGY AI
    // ========================================================================

    auctioneerStrategy: {

        /**
         * Team personality profiles — drive bidding aggression and priorities.
         * Each trait is on a 0.0–1.0 scale.
         */
        teamPersonalities: {
            CSK:  { aggression: 0.6, starHunter: 0.7, youthFocus: 0.3, spinPriority: 0.8, pacePriority: 0.4, battingPriority: 0.5, balancePriority: 0.6 },
            MI:   { aggression: 0.8, starHunter: 0.9, youthFocus: 0.5, spinPriority: 0.4, pacePriority: 0.8, battingPriority: 0.6, balancePriority: 0.7 },
            RCB:  { aggression: 0.9, starHunter: 1.0, youthFocus: 0.4, spinPriority: 0.3, pacePriority: 0.5, battingPriority: 0.9, balancePriority: 0.4 },
            KKR:  { aggression: 0.7, starHunter: 0.6, youthFocus: 0.6, spinPriority: 0.7, pacePriority: 0.5, battingPriority: 0.5, balancePriority: 0.7 },
            DC:   { aggression: 0.7, starHunter: 0.7, youthFocus: 0.7, spinPriority: 0.5, pacePriority: 0.6, battingPriority: 0.6, balancePriority: 0.6 },
            PBKS: { aggression: 0.9, starHunter: 0.8, youthFocus: 0.5, spinPriority: 0.4, pacePriority: 0.5, battingPriority: 0.8, balancePriority: 0.4 },
            RR:   { aggression: 0.5, starHunter: 0.5, youthFocus: 0.8, spinPriority: 0.6, pacePriority: 0.5, battingPriority: 0.5, balancePriority: 0.7 },
            SRH:  { aggression: 0.6, starHunter: 0.6, youthFocus: 0.7, spinPriority: 0.5, pacePriority: 0.7, battingPriority: 0.5, balancePriority: 0.7 },
            GT:   { aggression: 0.6, starHunter: 0.5, youthFocus: 0.8, spinPriority: 0.5, pacePriority: 0.6, battingPriority: 0.5, balancePriority: 0.8 },
            LSG:  { aggression: 0.7, starHunter: 0.7, youthFocus: 0.6, spinPriority: 0.5, pacePriority: 0.7, battingPriority: 0.6, balancePriority: 0.6 },
        },

        /**
         * Calculate the maximum bid a team should place on a player.
         */
        calculateMaxBid(team, player, playerStatsDB, currentSquad) {
            const db   = playerStatsDB || {};
            const stats = db[player.name] || {};
            const rating = stats.overallRating || player.rating || player.overallRating || 50;
            const teamAbbr = (team.abbr || team.name || "").toUpperCase();
            const personality = this.teamPersonalities[teamAbbr] || {
                aggression: 0.7, starHunter: 0.7, youthFocus: 0.5,
                spinPriority: 0.5, pacePriority: 0.5, battingPriority: 0.5, balancePriority: 0.5,
            };

            // --- 1. Base value from rating ---
            const baseValue = (rating / 100) * 15; // 0-15 crore

            // --- 2. Need multiplier (1.0 – 2.0) ---
            const needs = this.analyzeTeamNeeds(team, currentSquad);
            const playerRole = RatingEngine._normaliseRole(player.role);
            let needMult = 1.0;

            // Check if player fills a critical need
            const roleLabelMap = {
                "BAT": ["Opener", "Anchor", "Middle Order", "Top Order"],
                "BOWL": ["Death Bowler", "Pacer", "Spinner", "Bowler"],
                "AR": ["All-Rounder", "Finisher"],
                "WK-BAT": ["WK", "Wicketkeeper"],
            };
            const matchLabels = roleLabelMap[playerRole] || [];

            for (const need of needs.criticalNeeds) {
                if (matchLabels.some(ml => need.toUpperCase().includes(ml.toUpperCase()))) {
                    needMult = 2.0;
                    break;
                }
            }
            if (needMult < 2.0) {
                for (const need of needs.importantNeeds) {
                    if (matchLabels.some(ml => need.toUpperCase().includes(ml.toUpperCase()))) {
                        needMult = 1.5;
                        break;
                    }
                }
            }
            if (needMult < 1.5) {
                for (const need of needs.niceToHave) {
                    if (matchLabels.some(ml => need.toUpperCase().includes(ml.toUpperCase()))) {
                        needMult = 1.2;
                        break;
                    }
                }
            }

            // --- 3. Scarcity multiplier (1.0 – 1.5) ---
            // Simplified: based on how common this role is — fewer available = higher
            const scarcityMult = 1.0 + (needMult - 1.0) * 0.3; // correlates with need

            // --- 4. Budget constraint ---
            const budget = team.budget || team.remainingBudget || 120;
            const spent  = team.spent || currentSquad.reduce((s, p) => s + (p.price || 0.5), 0);
            const remainingBudget = budget - spent;
            const squadSize   = currentSquad.length;
            const minSlots    = Math.max(0, (team.minSquadSize || 18) - squadSize);
            const usableBudget = Math.max(0, remainingBudget - (minSlots * 0.20));

            // --- 5. Form multiplier (0.8 – 1.2) ---
            const form = RatingEngine._parseForm(stats.recentForm || player.form || 0.5);
            const formMult = 0.8 + (form * 0.4);

            // --- 6. Team personality multiplier ---
            let personalityMult = 1.0;
            personalityMult *= (0.7 + personality.aggression * 0.6); // 0.7 – 1.3

            // Star players attract star-hunter teams
            if (rating >= 85) {
                personalityMult *= (0.9 + personality.starHunter * 0.3); // 0.9 – 1.2
            }

            // Role-specific personality modifiers
            const bowlType = (stats.bowlingType || player.bowlingType || "").toUpperCase();
            if (bowlType.includes("SPIN") && personality.spinPriority) {
                personalityMult *= (0.9 + personality.spinPriority * 0.2);
            }
            if ((bowlType.includes("PACE") || bowlType.includes("FAST")) && personality.pacePriority) {
                personalityMult *= (0.9 + personality.pacePriority * 0.2);
            }
            if (playerRole === "BAT" && personality.battingPriority) {
                personalityMult *= (0.9 + personality.battingPriority * 0.15);
            }

            // Young player bonus for youth-focused teams
            const age = player.age || 27;
            if (age <= 23 && personality.youthFocus > 0.6) {
                personalityMult *= (1.0 + personality.youthFocus * 0.15);
            }

            // --- Combine ---
            const rawMax = baseValue * needMult * scarcityMult * formMult * personalityMult;
            const maxBid = Math.min(rawMax, usableBudget);

            // Round to nearest 0.25 crore
            return Math.round(maxBid * 4) / 4;
        },

        /**
         * Decide whether a team should bid on the current player at the current price.
         */
        shouldBid(team, player, currentBid, playerStatsDB, currentSquad, remainingPool) {
            const db = playerStatsDB || {};
            const squadSize = currentSquad.length;
            const maxSquad  = team.maxSquadSize || RatingEngine.MAX_SQUAD_SIZE;

            // --- 1. Budget check ---
            const budget = team.budget || team.remainingBudget || 120;
            const spent  = team.spent || currentSquad.reduce((s, p) => s + (p.price || 0.5), 0);
            const remaining = budget - spent;
            if (currentBid > remaining) {
                return { bid: false, priority: "SKIP", reason: "Cannot afford — bid exceeds remaining budget" };
            }

            // --- 2. Squad space check ---
            if (squadSize >= maxSquad) {
                return { bid: false, priority: "SKIP", reason: "Squad is full (" + maxSquad + " players)" };
            }

            // --- 3. Overseas limit check ---
            if (RatingEngine._isOverseas(player)) {
                const overseasCount = currentSquad.filter(p => RatingEngine._isOverseas(p)).length;
                if (overseasCount >= RatingEngine.MAX_OVERSEAS_SQUAD) {
                    return { bid: false, priority: "SKIP", reason: "Overseas quota full (" + RatingEngine.MAX_OVERSEAS_SQUAD + ")" };
                }
            }

            // --- 4. Max bid comparison ---
            const maxBid = this.calculateMaxBid(team, player, db, currentSquad);
            if (currentBid > maxBid) {
                return { bid: false, priority: "SKIP", reason: "Current bid (₹" + currentBid + "cr) exceeds valuation (₹" + maxBid + "cr)" };
            }

            // --- 5. Priority classification ---
            const needs = this.analyzeTeamNeeds(team, currentSquad);
            const playerRole = RatingEngine._normaliseRole(player.role);
            const roleLabelMap = {
                "BAT": ["Opener", "Anchor", "Middle Order", "Top Order", "Batter"],
                "BOWL": ["Death Bowler", "Pacer", "Spinner", "Bowler"],
                "AR": ["All-Rounder", "Finisher"],
                "WK-BAT": ["WK", "Wicketkeeper"],
            };
            const matchLabels = roleLabelMap[playerRole] || [];

            // MUST BID: fills a critical gap
            const fillsCritical = needs.criticalNeeds.some(n =>
                matchLabels.some(ml => n.toUpperCase().includes(ml.toUpperCase()))
            );
            if (fillsCritical) {
                return { bid: true, priority: "MUST", reason: "Fills critical need — team desperately requires this role" };
            }

            // SHOULD BID: fills an important need and is good value
            const fillsImportant = needs.importantNeeds.some(n =>
                matchLabels.some(ml => n.toUpperCase().includes(ml.toUpperCase()))
            );
            const stats = db[player.name] || {};
            const rating = stats.overallRating || player.rating || player.overallRating || 50;
            const isGoodValue = currentBid < maxBid * 0.75;

            if (fillsImportant && isGoodValue) {
                return { bid: true, priority: "SHOULD", reason: "Good value buy that fills an important need" };
            }
            if (fillsImportant) {
                return { bid: true, priority: "SHOULD", reason: "Fills an important squad need" };
            }

            // MIGHT BID: high-quality player even without specific need
            if (rating >= 80 && isGoodValue) {
                return { bid: true, priority: "MIGHT", reason: "High-quality player available at good value" };
            }
            if (rating >= 85) {
                return { bid: true, priority: "MIGHT", reason: "Elite player — worth considering regardless of immediate need" };
            }

            // SKIP: team already strong in this role
            const sameRoleCount = currentSquad.filter(p => RatingEngine._normaliseRole(p.role) === playerRole).length;
            if (sameRoleCount >= 5) {
                return { bid: false, priority: "SKIP", reason: "Already have " + sameRoleCount + " players in this role" };
            }

            // Moderate player who fills a nice-to-have
            const fillsNice = needs.niceToHave.some(n =>
                matchLabels.some(ml => n.toUpperCase().includes(ml.toUpperCase()))
            );
            if (fillsNice && isGoodValue) {
                return { bid: true, priority: "MIGHT", reason: "Decent depth option at good value" };
            }

            return { bid: false, priority: "SKIP", reason: "No pressing need and not compelling value" };
        },

        /**
         * Analyse a team's needs at any point during the auction.
         */
        analyzeTeamNeeds(team, currentSquad) {
            const squad = currentSquad || [];

            // Count by role
            let batCount  = 0;
            let bowlCount = 0;
            let arCount   = 0;
            let wkCount   = 0;
            let paceCount = 0;
            let spinCount = 0;
            let overseasCount = 0;

            for (const p of squad) {
                const role = RatingEngine._normaliseRole(p.role);
                if (role === "BAT")     batCount++;
                if (role === "BOWL")    bowlCount++;
                if (role === "AR")      arCount++;
                if (role === "WK-BAT")  wkCount++;
                if (RatingEngine._isOverseas(p)) overseasCount++;

                const bowlType = (p.bowlingType || "").toUpperCase();
                if (bowlType.includes("PACE") || bowlType.includes("FAST") || bowlType.includes("MEDIUM")) paceCount++;
                if (bowlType.includes("SPIN") || bowlType.includes("LEG") || bowlType.includes("OFF")) spinCount++;
            }

            const criticalNeeds  = [];
            const importantNeeds = [];
            const niceToHave     = [];

            // --- Critical: absolute must-haves ---
            if (wkCount === 0)  criticalNeeds.push("WK — no wicketkeeper in squad");
            if (bowlCount + (arCount >= 1 ? 1 : 0) < 2) criticalNeeds.push("Bowler — dangerously few bowling options");
            if (batCount + wkCount < 2) criticalNeeds.push("Top Order Batter — not enough batters");

            // --- Important: should address ---
            if (wkCount === 1)  importantNeeds.push("Backup WK");
            if (paceCount < 2)  importantNeeds.push("Pacer — need more pace options");
            if (spinCount < 1)  importantNeeds.push("Spinner — no spin option");
            if (arCount < 2)    importantNeeds.push("All-Rounder — need more balance");
            if (batCount + wkCount < 5) importantNeeds.push("Middle Order Batter");
            if (bowlCount < 4)  importantNeeds.push("Bowler — need more bowling depth");

            // Check if no death bowling specialist
            let deathBowler = false;
            for (const p of squad) {
                const sp = (p.specialty || p.speciality || "").toUpperCase();
                if (sp.includes("DEATH")) deathBowler = true;
            }
            if (!deathBowler && bowlCount >= 2) importantNeeds.push("Death Bowler");

            // --- Nice to have: depth picks ---
            if (batCount + wkCount >= 5 && batCount + wkCount < 7) niceToHave.push("Backup Opener");
            if (paceCount >= 2 && paceCount < 4) niceToHave.push("Pace Backup");
            if (spinCount >= 1 && spinCount < 3) niceToHave.push("Spin Backup");
            if (arCount >= 2 && arCount < 4) niceToHave.push("Additional All-Rounder");

            // Overseas & squad calculations
            const overseasSlotsLeft = RatingEngine.MAX_OVERSEAS_SQUAD - overseasCount;
            const squadSlotsLeft    = (team.maxSquadSize || RatingEngine.MAX_SQUAD_SIZE) - squad.length;
            const budget            = team.budget || team.remainingBudget || 120;
            const spent             = team.spent || squad.reduce((s, p) => s + (p.price || 0.5), 0);
            const budgetPerSlot     = squadSlotsLeft > 0 ? (budget - spent) / squadSlotsLeft : 0;

            return {
                criticalNeeds,
                importantNeeds,
                niceToHave,
                overseasSlotsLeft: Math.max(0, overseasSlotsLeft),
                squadSlotsLeft: Math.max(0, squadSlotsLeft),
                budgetPerSlot: Math.round(budgetPerSlot * 100) / 100,
            };
        },
    },

    // ========================================================================
    //  UTILITY: Score → Letter Grade
    // ========================================================================

    getGrade(score) {
        if (score >= 95) return "A+";
        if (score >= 90) return "A";
        if (score >= 85) return "A-";
        if (score >= 80) return "B+";
        if (score >= 75) return "B";
        if (score >= 70) return "B-";
        if (score >= 65) return "C+";
        if (score >= 60) return "C";
        if (score >= 55) return "C-";
        if (score >= 50) return "D+";
        if (score >= 45) return "D";
        return "F";
    },

    // ========================================================================
    //  2027 SEASON TOURNAMENT SIMULATION ENGINE
    //  Simulates 14-match IPL league stage, full Points Table, and Playoffs
    // ========================================================================

    simulateSeason(teamsList, playerStatsDB = {}) {
        const teams = Array.isArray(teamsList) ? teamsList : [];
        if (teams.length === 0) return null;

        // 1. Calculate base XI strength for each team
        const teamStrengths = {};
        teams.forEach(t => {
            const xiResult = RatingEngine.selectBestXI(t.players || [], playerStatsDB);
            // Normalized strength 60 - 95
            const baseRating = xiResult.totalRating ? (xiResult.totalRating / 11) : 75;
            // Bonus for squad depth (backups)
            const depthBonus = Math.min(5, ((t.players || []).length - 11) * 0.4);
            teamStrengths[t.id] = baseRating + depthBonus;
        });

        // 2. Initialize Points Table stats
        const standings = {};
        teams.forEach(t => {
            standings[t.id] = {
                teamId: t.id,
                teamName: t.shortName || t.name,
                logo: t.logo || '🏏',
                primaryColor: t.primaryColor || '#1e293b',
                played: 0,
                won: 0,
                lost: 0,
                tied: 0,
                points: 0,
                runsScored: 0,
                oversFaced: 0,
                runsConceded: 0,
                oversBowled: 0,
                nrr: 0.0
            };
        });

        // 3. Generate 14 matches for each team (70 total matches in 10-team IPL)
        // Group format: Play each other team at least once, plus 5 repeat rivals
        const teamIds = teams.map(t => t.id);
        const matches = [];

        for (let i = 0; i < teamIds.length; i++) {
            for (let j = i + 1; j < teamIds.length; j++) {
                // First round: all pairs play once (45 matches)
                matches.push({ home: teamIds[i], away: teamIds[j] });
            }
        }
        // Additional 25 matches to make 14 matches per team
        for (let i = 0; i < teamIds.length; i++) {
            for (let k = 1; k <= 5; k++) {
                const opp = teamIds[(i + k) % teamIds.length];
                if (i < ((i + k) % teamIds.length)) {
                    matches.push({ home: opp, away: teamIds[i] });
                }
            }
        }

        // Limit matches so each team plays exactly 14 matches
        const matchesPlayedCount = {};
        teamIds.forEach(id => matchesPlayedCount[id] = 0);
        const leagueMatches = [];

        for (const m of matches) {
            if (matchesPlayedCount[m.home] < 14 && matchesPlayedCount[m.away] < 14) {
                leagueMatches.push(m);
                matchesPlayedCount[m.home]++;
                matchesPlayedCount[m.away]++;
            }
        }

        // 4. Simulate each league match
        leagueMatches.forEach(m => {
            const strHome = (teamStrengths[m.home] || 75) + 2.0; // Home pitch advantage (+2 rating)
            const strAway = teamStrengths[m.away] || 75;

            // Probability of home team winning
            const diff = strHome - strAway;
            const winProbHome = 1 / (1 + Math.pow(10, -diff / 25));
            const homeWon = Math.random() < winProbHome;

            // Generate realistic T20 scores
            const baseScore = 150 + Math.floor(Math.random() * 45);
            let scoreHome, scoreAway, wktsHome, wktsAway;

            if (homeWon) {
                const margin = 1 + Math.floor(Math.random() * 35);
                scoreHome = baseScore + margin;
                scoreAway = baseScore;
                wktsHome = Math.floor(3 + Math.random() * 5);
                wktsAway = Math.floor(5 + Math.random() * 5);
                standings[m.home].won++;
                standings[m.home].points += 2;
                standings[m.away].lost++;
            } else {
                const margin = 1 + Math.floor(Math.random() * 35);
                scoreAway = baseScore + margin;
                scoreHome = baseScore;
                wktsAway = Math.floor(3 + Math.random() * 5);
                wktsHome = Math.floor(5 + Math.random() * 5);
                standings[m.away].won++;
                standings[m.away].points += 2;
                standings[m.home].lost++;
            }

            standings[m.home].played++;
            standings[m.away].played++;

            // Accumulate runs & overs for Net Run Rate (NRR)
            standings[m.home].runsScored += scoreHome;
            standings[m.home].oversFaced += 20;
            standings[m.home].runsConceded += scoreAway;
            standings[m.home].oversBowled += 20;

            standings[m.away].runsScored += scoreAway;
            standings[m.away].oversFaced += 20;
            standings[m.away].runsConceded += scoreHome;
            standings[m.away].oversBowled += 20;
        });

        // 5. Calculate Final Net Run Rate (NRR)
        Object.values(standings).forEach(s => {
            const forRate = s.oversFaced > 0 ? (s.runsScored / s.oversFaced) : 0;
            const againstRate = s.oversBowled > 0 ? (s.runsConceded / s.oversBowled) : 0;
            s.nrr = +(forRate - againstRate).toFixed(3);
        });

        // 6. Sort Standings: Points DESC, then NRR DESC, then Won DESC
        const sortedStandings = Object.values(standings).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.nrr !== a.nrr) return b.nrr - a.nrr;
            return b.won - a.won;
        });

        // Add Rank & Qualifier badge (Top 4 qualify for playoffs)
        sortedStandings.forEach((s, idx) => {
            s.rank = idx + 1;
            s.isQualifier = idx < 4;
        });

        // 7. Simulate Playoffs (Top 4)
        const top4 = sortedStandings.slice(0, 4);
        let playoffs = {
            qualifier1: null,
            eliminator: null,
            qualifier2: null,
            final: null,
            champion: null,
            runnerUp: null
        };

        if (top4.length >= 4) {
            // Helper for simulating single knockout match
            const simKnockout = (t1Id, t2Id, matchName) => {
                const s1 = teamStrengths[t1Id] || 75;
                const s2 = teamStrengths[t2Id] || 75;
                const probT1 = 1 / (1 + Math.pow(10, -(s1 - s2) / 25));
                const t1Won = Math.random() < probT1;
                const winnerId = t1Won ? t1Id : t2Id;
                const loserId = t1Won ? t2Id : t1Id;

                const baseRuns = 160 + Math.floor(Math.random() * 40);
                const winRuns = baseRuns + Math.floor(5 + Math.random() * 25);
                const winnerObj = standings[winnerId];
                const loserObj = standings[loserId];

                return {
                    matchName,
                    team1: standings[t1Id],
                    team2: standings[t2Id],
                    winner: winnerObj,
                    loser: loserObj,
                    summary: `${winnerObj.teamName} (${winRuns}/${Math.floor(4+Math.random()*4)}) beat ${loserObj.teamName} (${baseRuns}/${Math.floor(6+Math.random()*4)})`
                };
            };

            // Qualifier 1: 1st vs 2nd
            const q1 = simKnockout(top4[0].teamId, top4[1].teamId, "Qualifier 1");
            // Eliminator: 3rd vs 4th
            const elim = simKnockout(top4[2].teamId, top4[3].teamId, "Eliminator");
            // Qualifier 2: Loser Q1 vs Winner Eliminator
            const q2 = simKnockout(q1.loser.teamId, elim.winner.teamId, "Qualifier 2");
            // Final: Winner Q1 vs Winner Q2
            const finalMatch = simKnockout(q1.winner.teamId, q2.winner.teamId, "TATA IPL 2027 Grand Final");

            playoffs = {
                qualifier1: q1,
                eliminator: elim,
                qualifier2: q2,
                final: finalMatch,
                champion: finalMatch.winner,
                runnerUp: finalMatch.loser
            };
        }

        return {
            standings: sortedStandings,
            playoffs,
            totalMatches: leagueMatches.length,
            simulatedAt: new Date().toISOString()
        };
    }
};

// ============================================================================
//  EXPOSE GLOBALLY
// ============================================================================
window.RatingEngine = RatingEngine;