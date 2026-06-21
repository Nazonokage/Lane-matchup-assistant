// =============================================================================
// Lane Ledger — bot lane data now lives in JSON (not this file).
//
//   data/drLane.json     → ADC + APC (Dragon lane)
//   data/suppRole.json   → Supports
//   data/draftRules.json → Draft rules
//
// After editing JSON:  npm run build   (or: node scripts/build-data.js)
// App loads:           data/bundle.js
//
// Legacy backup:       data/_legacy-data.js.bak
// Re-merge from backup: node scripts/extract-bot-data.js
// =============================================================================



// // Lane Ledger - Champion Data
// // Complete roster with ADCs, APCs, and Supports
// // Wild Rift Focus with PC champions included for completeness

// const championData = [
//   // ============ ADCs (Traditional Marksmen) ============
//   {
//     name: "Ashe",
//     roles: ["ADC"],
//     playstyle: ["utility", "kiting", "engage"],
//     goodAgainst: [
//       { name: "Vayne", note: "Reveal her with W, slow to kite" },
//       { name: "Corki", note: "Out-range and out-slow her mobility" },
//       { name: "Miss Fortune", note: "Slow her movement, cancel her strut" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Can't out-trade his raw damage" },
//       { name: "Ezreal", note: "Can't catch him with slows" },
//       { name: "Caitlyn", note: "Gets poked from outside her range" }
//     ],
//     synergies: ["Braum", "Lulu", "Seraphine"],
//     avoidSynergies: [
//       { name: "Yuumi", note: "Zero kill pressure in a passive poke lane" },
//       { name: "Janna", note: "No kill pressure, too passive" }
//     ],
//     caution: "No mobility. Position is everything.",
//     conditions: {
//       green: ["Your team needs engage", "Enemy has low mobility"],
//       red: ["Enemy has multiple assassins", "Need to survive lane"]
//     },
//     tips: "Use W to check bushes. R can be used as global engage."
//   },
//   {
//     name: "Caitlyn",
//     roles: ["ADC"],
//     playstyle: ["poke", "siege", "lane bully"],
//     goodAgainst: [
//       { name: "Vayne", note: "Outranges and pokes her down early" },
//       { name: "Jinx", note: "Deny her scaling with early pressure" },
//       { name: "Tristana", note: "Poke her out before she can jump" }
//     ],
//     badAgainst: [
//       { name: "Varus", note: "Can match poke and has better all-in" },
//       { name: "Draven", note: "Gets out-traded in short bursts" },
//       { name: "Ashe", note: "Can engage on you when you misposition" }
//     ],
//     synergies: ["Morgana", "Lux", "Thresh"],
//     avoidSynergies: [
//       { name: "Alistar", note: "Knocks them out of trap placement range" },
//       { name: "Malphite", note: "Knocks enemies out of trap placement range" }
//     ],
//     caution: "Loses all early pressure if she falls behind on CS. Transition to trap utility if behind.",
//     conditions: {
//       green: ["You want to siege towers fast", "Enemy has low mobility"],
//       red: ["Enemy has heavy dive/gap closers", "Assassin-heavy enemy team"]
//     },
//     tips: "Place traps diagonally in lane brush to catch enemies off guard."
//   },
//   {
//     name: "Corki",
//     roles: ["ADC"],
//     playstyle: ["poke", "scaling", "hybrid"],
//     goodAgainst: [
//       { name: "Jinx", note: "Poke her out, better mobility" },
//       { name: "Zeri", note: "Out-trade with mixed damage" },
//       { name: "Smolder", note: "Match his scaling with better poke" }
//     ],
//     badAgainst: [
//       { name: "Caitlyn", note: "Gets out-ranged and poked" },
//       { name: "Draven", note: "Can't trade into his early damage" },
//       { name: "Lucian", note: "Gets burst down before he scales" }
//     ],
//     synergies: ["Leona", "Rakan", "Nautilus"],
//     avoidSynergies: [
//       { name: "Yuumi", note: "You need heavy frontline presence to scale safely" }
//     ],
//     caution: "Weak early game. Scales with items.",
//     conditions: {
//       green: ["Your team has frontline", "Need hybrid damage"],
//       red: ["Enemy has heavy engage", "Need early game pressure"]
//     },
//     tips: "Use Q for poke, W for escape/engage. Package is your teamfight power spike."
//   },
//   {
//     name: "Draven",
//     roles: ["ADC"],
//     playstyle: ["all-in", "lane bully", "snowball"],
//     goodAgainst: [
//       { name: "Vayne", note: "Bully her before she scales" },
//       { name: "Jinx", note: "Don't let her scale, dominate early" },
//       { name: "Ashe", note: "Out-trade her in short bursts" }
//     ],
//     badAgainst: [
//       { name: "Caitlyn", note: "Gets poked out, hard to catch axes" },
//       { name: "Varus", note: "Can poke from range and all-in with burst" },
//       { name: "Tristana", note: "Can jump away and out-range later" }
//     ],
//     synergies: ["Leona", "Thresh", "Nami"],
//     avoidSynergies: [
//       { name: "Pyke", note: "Steals cashout kills" },
//       { name: "Mage Supports", note: "Ruins wave freeze" }
//     ],
//     caution: "Dropping an axe in a bad position can lose you the trade. Track your axe locations.",
//     conditions: {
//       green: ["You can stomp lane early", "Enemy has immobile bot lane"],
//       red: ["Enemy has point-and-click CC", "Multiple tanks on enemy team"]
//     },
//     tips: "Try to catch axes on the edge of enemy range to bait aggression."
//   },
//   {
//     name: "Ezreal",
//     roles: ["ADC"],
//     playstyle: ["poke", "kiting", "safe"],
//     goodAgainst: [
//       { name: "Ashe", note: "Poke her from safety, dodge with E" },
//       { name: "Varus", note: "Out-poke with Q, dodge his Q" },
//       { name: "Miss Fortune", note: "Safe laning, avoid her bounces" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Gets all-inned and burst down" },
//       { name: "Caitlyn", note: "Out-ranged, can't trade" },
//       { name: "Twitch", note: "Can't deal with his stealth engage" }
//     ],
//     synergies: ["Yuumi", "Karma", "Nami"],
//     avoidSynergies: [
//       { name: "Lulu", note: "He doesn't auto-attack rapidly enough to maximize her passive" }
//     ],
//     caution: "If you miss Qs, your damage drops massively. Practice your aim.",
//     conditions: {
//       green: ["Enemy has low mobility", "You need to play safe"],
//       red: ["Enemy has point-and-click engage", "Need DPS, not poke"]
//     },
//     tips: "Auto-attack between Qs for maximum DPS. Use E defensively, not aggressively unless safe."
//   },
//   {
//     name: "Jhin",
//     roles: ["ADC"],
//     playstyle: ["burst", "utility", "traps"],
//     goodAgainst: [
//       { name: "Miss Fortune", note: "Match her burst, better utility" },
//       { name: "Senna", note: "Out-range her, harder to trade" },
//       { name: "Sivir", note: "Burst through her shield" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Can't out-trade him at any point" },
//       { name: "Lucian", note: "Gets burst when out of bullets" },
//       { name: "Tristana", note: "Jumps on you during reload" }
//     ],
//     synergies: ["Nautilus", "Pyke", "Zyra"],
//     avoidSynergies: [
//       { name: "Yuumi", note: "Her rework needs rapid attacks—feels awful on Jhin" }
//     ],
//     caution: "Your movement speed is low. Position carefully.",
//     conditions: {
//       green: ["Enemy has immobile carries", "Your team needs pick potential"],
//       red: ["Enemy has heavy dive/tanks", "Need sustained DPS"]
//     },
//     tips: "W and R root based on damage your team deals. Communicate with support for setup."
//   },
//   {
//     name: "Jinx",
//     roles: ["ADC"],
//     playstyle: ["hypercarry", "siege", "reset"],
//     goodAgainst: [
//       { name: "Sivir", note: "Out-range her, better late game" },
//       { name: "Varus", note: "Out-scale him, avoid early poke" },
//       { name: "Kog'Maw", note: "Match his scaling with better mobility" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Gets bullied hard early" },
//       { name: "Caitlyn", note: "Out-ranged and poked" },
//       { name: "Lucian", note: "Burst down before you scale" }
//     ],
//     synergies: ["Lulu", "Yuumi", "Janna"],
//     avoidSynergies: [
//       { name: "Pyke", note: "Leaves you with zero peel when dived" },
//       { name: "Senna", note: "No meat shields or peel" }
//     ],
//     caution: "Extremely weak early game. Give up CS to stay healthy.",
//     conditions: {
//       green: ["Enemy lacks assassins", "Your team can protect you"],
//       red: ["Enemy has early lane bullies", "Heavy dive comps"]
//     },
//     tips: "Use Q for range, W for poke, E for CC. Reset on kills in teamfights."
//   },
//   {
//     name: "Kai'Sa",
//     roles: ["ADC"],
//     playstyle: ["hypercarry", "duelist", "mobile"],
//     goodAgainst: [
//       { name: "Vayne", note: "Better early game, can match her scaling" },
//       { name: "Sivir", note: "Burst her through spellshield" },
//       { name: "Jinx", note: "Dive her before she scales" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Loses early, gets denied scaling" },
//       { name: "Lucian", note: "Gets burst before she can scale" },
//       { name: "Caitlyn", note: "Gets poked out early" }
//     ],
//     synergies: ["Nautilus", "Leona", "Rakan"],
//     avoidSynergies: [
//       { name: "Soraka", note: "Can't trigger your Plasma stacks effectively" },
//       { name: "Janna", note: "Can't trigger Plasma stacks" }
//     ],
//     caution: "Needs evolved abilities to truly come online. Farm for Q evolve first.",
//     conditions: {
//       green: ["Enemy has low CC", "You have engage support"],
//       red: ["Enemy has long-range poke", "Need early game pressure"]
//     },
//     tips: "Auto + W + Auto for burst in lane. Evolve Q first usually."
//   },
//   {
//     name: "Kalista",
//     roles: ["ADC"],
//     playstyle: ["duelist", "mobile", "objective"],
//     goodAgainst: [
//       { name: "Jinx", note: "Burst her before she scales" },
//       { name: "Sivir", note: "Can't shield your rend" },
//       { name: "Vayne", note: "Out-duel her with mobility" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Can't out-trade early" },
//       { name: "Ashe", note: "Slows make your passive harder to use" },
//       { name: "Caitlyn", note: "Out-ranged and poked" }
//     ],
//     synergies: ["Thresh", "Taric", "Nautilus"],
//     avoidSynergies: [
//       { name: "Yuumi", note: "You can't realistically throw a cat into the fray with your ult" }
//     ],
//     caution: "Your damage relies on rend. Track your stacks.",
//     conditions: {
//       green: ["You have a strong engage support", "Need objective control"],
//       red: ["Enemy has heavy slows", "Need scaling ADC"]
//     },
//     tips: "Use W for vision. Save E for rend execute. Ult to save support."
//   },
//   {
//     name: "Kog'Maw",
//     roles: ["ADC"],
//     playstyle: ["hypercarry", "siege", "poke"],
//     goodAgainst: [
//       { name: "Vayne", note: "Out-range her with W" },
//       { name: "Jinx", note: "Match her scaling" },
//       { name: "Sivir", note: "Out-range and out-trade" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Gets burst down" },
//       { name: "Lucian", note: "Dash to dodge your R" },
//       { name: "Caitlyn", note: "Out-ranges your Q" }
//     ],
//     synergies: ["Lulu", "Yuumi", "Braum"],
//     avoidSynergies: [
//       { name: "Pyke", note: "They roam and abandon you to get 2v1 dove under tower" },
//       { name: "Pantheon", note: "Roams and leaves you vulnerable" }
//     ],
//     caution: "Immobile. Position is critical.",
//     conditions: {
//       green: ["Enemy lacks assassins", "Your team has strong frontline"],
//       red: ["Enemy has heavy dive", "Assassin threat"]
//     },
//     tips: "W for range extension. Save R for finishing kills."
//   },
//   {
//     name: "Lucian",
//     roles: ["ADC"],
//     playstyle: ["burst", "lane bully", "mobile"],
//     goodAgainst: [
//       { name: "Vayne", note: "Bully her early, deny scaling" },
//       { name: "Jinx", note: "Burst her down before she scales" },
//       { name: "Kai'Sa", note: "Out-burst her early" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Loses in all-ins early" },
//       { name: "Caitlyn", note: "Gets poked, outranged" },
//       { name: "Sivir", note: "Spellshield blocks your burst" }
//     ],
//     synergies: ["Nami", "Braum", "Yuumi"],
//     avoidSynergies: [
//       { name: "Senna", note: "Extremely squishy, struggles against hard engage" }
//     ],
//     caution: "Falls off late game. Use your mid-game spike to pressure objectives.",
//     conditions: {
//       green: ["Enemy has squishy backline", "Short lane vs scaling ADC"],
//       red: ["Enemy has heavy armor/shields", "Extended teamfights"]
//     },
//     tips: "Use W before R for faster rotations and more damage from your ultimate."
//   },
//   {
//     name: "Miss Fortune",
//     roles: ["ADC"],
//     playstyle: ["burst", "teamfight", "poke"],
//     goodAgainst: [
//       { name: "Vayne", note: "Q bounce denies her early" },
//       { name: "Sivir", note: "Poke through her shield" },
//       { name: "Jinx", note: "Early lane dominance" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Loses in all-ins" },
//       { name: "Varus", note: "Out-poked and out-traded" },
//       { name: "Jhin", note: "His burst matches yours with better utility" }
//     ],
//     synergies: ["Leona", "Amumu", "Seraphine"],
//     avoidSynergies: [
//       { name: "Janna", note: "Monsoon knockback pushes enemies out of your ult" }
//     ],
//     caution: "Your ult can be interrupted. Wait for CC before using.",
//     conditions: {
//       green: ["Enemy has grouped up", "Teamfight composition"],
//       red: ["Enemy has interrupts", "Need sustained DPS"]
//     },
//     tips: "Use Q to bounce off minions. Ult for teamfights."
//   },
//   {
//     name: "Nilah",
//     roles: ["ADC"],
//     playstyle: ["duelist", "teamfight", "scaling"],
//     goodAgainst: [
//       { name: "Samira", note: "Out-duel her with W" },
//       { name: "Tristana", note: "Counter her jump with W" },
//       { name: "Vayne", note: "Match her scaling" }
//     ],
//     badAgainst: [
//       { name: "Caitlyn", note: "Can't get in range" },
//       { name: "Draven", note: "Loses early trades" },
//       { name: "Ashe", note: "Slows make it hard to engage" }
//     ],
//     synergies: ["Soraka", "Sona", "Yuumi"],
//     avoidSynergies: [
//       { name: "Senna", note: "You need immediate engage or melee-adjacent buffs" },
//       { name: "Lux", note: "Need engage support, not poke" }
//     ],
//     caution: "Short range. Need to know when to engage.",
//     conditions: {
//       green: ["You have a sustain support", "Enemy lacks poke"],
//       red: ["Enemy has heavy poke", "Need early game pressure"]
//     },
//     tips: "W for defense, E for engage. Ult for teamfight CC."
//   },
//   {
//     name: "Samira",
//     roles: ["ADC"],
//     playstyle: ["all-in", "reset", "duelist"],
//     goodAgainst: [
//       { name: "Jinx", note: "All-in before she scales" },
//       { name: "Ashe", note: "Block her R with W" },
//       { name: "Miss Fortune", note: "Block her Q with W" }
//     ],
//     badAgainst: [
//       { name: "Vayne", note: "Condemn cancels your E" },
//       { name: "Draven", note: "Loses auto trades early" },
//       { name: "Xayah", note: "Can't engage into her feathers" }
//     ],
//     synergies: ["Nautilus", "Alistar", "Rakan"],
//     avoidSynergies: [
//       { name: "Yuumi", note: "Enchanters leave you unable to jump in safely" },
//       { name: "Soraka", note: "Can't engage safely" }
//     ],
//     caution: "Very short range. Need to wait for the right moment to go in.",
//     conditions: {
//       green: ["Enemy has low CC", "You have engage support"],
//       red: ["Enemy has point-and-click CC", "Multiple tanks"]
//     },
//     tips: "Auto-E-Q-Auto-W for quick S rank. Save W for key abilities."
//   },
//   {
//     name: "Senna",
//     roles: ["Support", "ADC"],
//     playstyle: ["poke", "sustain", "utility"],
//     goodAgainst: [
//       { name: "Sona", note: "Out-poke and out-scale" },
//       { name: "Soraka", note: "Deny her healing with poke" },
//       { name: "Miss Fortune", note: "Cancel her strut with auto" }
//     ],
//     badAgainst: [
//       { name: "Blitzcrank", note: "Hook = death" },
//       { name: "Thresh", note: "Hook = death" },
//       { name: "Leona", note: "Engage = death" }
//     ],
//     synergies: ["Nasus", "Galio", "Nautilus"],
//     avoidSynergies: [
//       { name: "Enchanters", note: "Two squishy, passive laners who fold to hook" }
//     ],
//     caution: "Squishy. Don't get caught by hooks.",
//     conditions: {
//       green: ["Enemy lacks engage", "You need poke and sustain"],
//       red: ["Enemy has hook supports", "Heavy engage comps"]
//     },
//     tips: "Q for poke/heal. W for root. E for stealth. R for shield/damage."
//   },
//   {
//     name: "Sivir",
//     roles: ["ADC"],
//     playstyle: ["waveclear", "teamfight", "utility"],
//     goodAgainst: [
//       { name: "Caitlyn", note: "Spellshield her Q and traps" },
//       { name: "Miss Fortune", note: "Block her Q and ult" },
//       { name: "Xayah", note: "Shield her E, push her in" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Can't shield his autos" },
//       { name: "Vayne", note: "Outscales and dives you" },
//       { name: "Lucian", note: "Can't block his passive" }
//     ],
//     synergies: ["Yuumi", "Karma", "Lulu"],
//     avoidSynergies: [
//       { name: "Alistar", note: "Sivir wants to push and poke, not dive early" },
//       { name: "Leona", note: "Wants to push, not all-in" }
//     ],
//     caution: "Short range. Position carefully in teamfights.",
//     conditions: {
//       green: ["Enemy has poke champions", "You need waveclear to stall"],
//       red: ["Enemy has dive comps", "Need single-target damage"]
//     },
//     tips: "Spellshield can block 1 ability per fight. Wait for key abilities."
//   },
//   {
//     name: "Smolder",
//     roles: ["ADC"],
//     playstyle: ["scaling", "poke", "utility"],
//     goodAgainst: [
//       { name: "Vayne", note: "Poke her and out-scale" },
//       { name: "Kog'Maw", note: "Match his scaling" },
//       { name: "Jinx", note: "Out-poke and out-scale" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Can't trade early" },
//       { name: "Lucian", note: "Burst before you scale" },
//       { name: "Caitlyn", note: "Out-ranged and poked" }
//     ],
//     synergies: ["Braum", "Thresh", "Nautilus"],
//     avoidSynergies: [
//       { name: "Mage Supports", note: "They steal minion last-hits you need for dragon stacks" }
//     ],
//     caution: "Weak early. Need to farm for stacks.",
//     conditions: {
//       green: ["Game will go late", "Your team has peel"],
//       red: ["Enemy has early pressure", "Need early game power"]
//     },
//     tips: "Farm for stacks. Use Q for poke. R for teamfight damage."
//   },
//   {
//     name: "Tristana",
//     roles: ["ADC"],
//     playstyle: ["hypercarry", "siege", "reset"],
//     goodAgainst: [
//       { name: "Vayne", note: "Jump on her, out-burst" },
//       { name: "Jinx", note: "Jump on her before she scales" },
//       { name: "Sivir", note: "Jump over her boomerang, burst" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Can't out-trade early" },
//       { name: "Lucian", note: "Gets burst before she can jump" },
//       { name: "Xayah", note: "Can't engage into her feathers" }
//     ],
//     synergies: ["Leona", "Nautilus", "Rakan"],
//     avoidSynergies: [
//       { name: "Soraka", note: "Stifles your explosive, all-in early jump power" },
//       { name: "Sona", note: "No engage potential" }
//     ],
//     caution: "Your jump has a long CD early. Only use for kills or escapes.",
//     conditions: {
//       green: ["Enemy has squishy bot lane", "You can jump on their mistakes"],
//       red: ["Enemy has Draven/Caitlyn", "Heavy CC to stop your jump"]
//     },
//     tips: "E on enemy, then W auto for burst. Reset jump on kills."
//   },
//   {
//     name: "Twitch",
//     roles: ["ADC"],
//     playstyle: ["hypercarry", "stealth", "duelist"],
//     goodAgainst: [
//       { name: "Jinx", note: "Out-duel her, stealth engage" },
//       { name: "Kog'Maw", note: "Stealth to get close, burst" },
//       { name: "Vayne", note: "Stealth to avoid her, out-range" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Gets burst early" },
//       { name: "Caitlyn", note: "Traps reveal stealth" },
//       { name: "Lucian", note: "Burst before you scale" }
//     ],
//     synergies: ["Lulu", "Yuumi", "Nami"],
//     avoidSynergies: [
//       { name: "Blitzcrank", note: "Pulling a bruiser onto an immobile rat is a death sentence" }
//     ],
//     caution: "Immobile. Position is crucial.",
//     conditions: {
//       green: ["Enemy lacks true sight", "Your team has peel"],
//       red: ["Enemy has multiple assassins", "Need early game pressure"]
//     },
//     tips: "Stealth to position. Ult for teamfight damage."
//   },
//   {
//     name: "Varus",
//     roles: ["ADC", "APC"],
//     playstyle: ["poke", "burst", "utility"],
//     goodAgainst: [
//       { name: "Caitlyn", note: "Match poke, better all-in" },
//       { name: "Jinx", note: "Poke her before she scales" },
//       { name: "Sivir", note: "Burst through her shield" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Can't trade into his damage" },
//       { name: "Tristana", note: "Jumps on you during poke" },
//       { name: "Vayne", note: "Can't catch her with Q" }
//     ],
//     synergies: ["Lulu", "Karma", "Thresh"],
//     avoidSynergies: [
//       { name: "Pyke", note: "Lacks the raw peel Varus needs to survive dive comps" }
//     ],
//     caution: "Your Q is telegraphed. Vary your aim.",
//     conditions: {
//       green: ["Enemy has low mobility", "You need poke before fights"],
//       red: ["Enemy has engage supports", "Heavy assassin threat"]
//     },
//     tips: "Save R for peel in fights, not just engage. AP Varus maximizes W damage."
//   },
//   {
//     name: "Vayne",
//     roles: ["ADC"],
//     playstyle: ["hypercarry", "duelist", "scaling"],
//     goodAgainst: [
//       { name: "Sivir", note: "Out-scale her, Condemn her shield" },
//       { name: "Ezreal", note: "Dodge his Q, out-duel" },
//       { name: "Kog'Maw", note: "Condemn cancels his W" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Can't survive early" },
//       { name: "Caitlyn", note: "Gets poked heavily early" },
//       { name: "Ashe", note: "Reveals stealth, slows kill kiting" }
//     ],
//     synergies: ["Lulu", "Yuumi", "Janna"],
//     avoidSynergies: [
//       { name: "Lux", note: "Zero protection; they turn the lane into a fiesta" },
//       { name: "Brand", note: "No peel, fiesta lane" }
//     ],
//     caution: "Extremely weak early game. Give up CS to stay healthy.",
//     conditions: {
//       green: ["Enemy team lacks CC", "You can survive laning phase"],
//       red: ["Enemy has Twitch/Rengar", "Heavy point-and-click CC"]
//     },
//     tips: "Use Q to dodge skillshots, not just for damage. Auto-Q-Auto is your core trade pattern."
//   },
//   {
//     name: "Xayah",
//     roles: ["ADC"],
//     playstyle: ["burst", "utility", "kiting"],
//     goodAgainst: [
//       { name: "Samira", note: "R denies her engage" },
//       { name: "Kai'Sa", note: "Feathers catch her engage" },
//       { name: "Vayne", note: "Condemn canceled by your R" }
//     ],
//     badAgainst: [
//       { name: "Caitlyn", note: "Out-ranged, trap cancels your engage" },
//       { name: "Draven", note: "Loses early trades" },
//       { name: "Ashe", note: "Slows make it hard to kite" }
//     ],
//     synergies: ["Rakan", "Thresh", "Nautilus"],
//     avoidSynergies: [
//       { name: "Yuumi", note: "Makes it harder to bait enemies over your feathers" }
//     ],
//     caution: "Your feathers do more damage on return. Position to catch them.",
//     conditions: {
//       green: ["Enemy has tanks you can root", "Your team needs CC"],
//       red: ["Enemy has poke supports", "Need early game pressure"]
//     },
//     tips: "E roots based on feather count. Q+Auto+E for quick trade."
//   },
//   {
//     name: "Zeri",
//     roles: ["ADC"],
//     playstyle: ["kiting", "mobile", "DPS"],
//     goodAgainst: [
//       { name: "Jinx", note: "Out-kite her with mobility" },
//       { name: "Sivir", note: "Can't shield your autos" },
//       { name: "Vayne", note: "Out-range and out-kite" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Loses early trades hard" },
//       { name: "Lucian", note: "Can't out-burst him" },
//       { name: "Caitlyn", note: "Out-ranged and poked" }
//     ],
//     synergies: ["Yuumi", "Lulu", "Janna"],
//     avoidSynergies: [
//       { name: "Alistar", note: "Zeri prefers kiting out long skirmishes over instant burst" },
//       { name: "Leona", note: "Prefers kiting, not burst" }
//     ],
//     caution: "Your Q can be blocked by minions. Work around the wave.",
//     conditions: {
//       green: ["Enemy has low mobility", "Your team has frontline"],
//       red: ["Enemy has point-and-click CC", "Need burst damage"]
//     },
//     tips: "Use E to reposition in fights, not just engage. Build attack speed."
//   },

//   // ============ APCs (Mages played bot) ============
//   {
//     name: "Ziggs",
//     roles: ["APC"],
//     playstyle: ["poke", "siege", "utility"],
//     goodAgainst: [
//       { name: "Jinx", note: "Out-poke and out-siege" },
//       { name: "Caitlyn", note: "Match her poke" },
//       { name: "Sivir", note: "Can't shield your bombs effectively" },
//       { name: "Draven", note: "Poke him from safety" }
//     ],
//     badAgainst: [
//       { name: "Varus", note: "Out-pokes you" },
//       { name: "Ezreal", note: "Dodges your bombs" },
//       { name: "Yasuo", note: "Windwall blocks your Q" },
//       { name: "Samira", note: "W blocks your bombs" }
//     ],
//     synergies: ["Leona", "Nautilus", "Thresh", "Mage Supports"],
//     avoidSynergies: [
//       { name: "Passive Enchanters", note: "Zero frontline to protect you" }
//     ],
//     caution: "Your Q can be dodged. Predict movement.",
//     conditions: {
//       green: ["Team has heavy AD mid/jungle", "You want to neutralize lane and take first tower"],
//       red: ["Enemy has infinite dive/gap closers", "Your support picks a passive enchanter with zero frontline"]
//     },
//     tips: "Q for poke. W for execute and escape. R for waveclear."
//   },
//   {
//     name: "Brand",
//     roles: ["Support", "APC"],
//     playstyle: ["poke", "burst", "utility"],
//     goodAgainst: [
//       { name: "Braum", note: "Burn through his shield" },
//       { name: "Alistar", note: "Poke him out, ignore engage" },
//       { name: "Taric", note: "Burn through his heals" },
//       { name: "Yuumi", note: "Poke her off ADC" }
//     ],
//     badAgainst: [
//       { name: "Twitch", note: "Stealth engage bursts you" },
//       { name: "Caitlyn", note: "Out-ranges and pokes" },
//       { name: "Lux", note: "Out-ranges your combos" },
//       { name: "Blitzcrank", note: "Hook = death" }
//     ],
//     synergies: ["Leona", "Nautilus", "Amumu"],
//     avoidSynergies: [
//       { name: "Draven", note: "You will ruin his passive cashout" }
//     ],
//     caution: "Squishy. Don't get caught.",
//     conditions: {
//       green: ["Enemy has triple-tank comp", "Your team lacks AOE burst magic damage"],
//       red: ["Enemy has insane long-range poke", "Your ADC is Draven"]
//     },
//     tips: "Q for stun. W for AOE. E for spread. R for teamfight damage."
//   },
//   {
//     name: "Veigar",
//     roles: ["APC", "Support"],
//     playstyle: ["scaling", "burst", "utility"],
//     goodAgainst: [
//       { name: "Samira", note: "Cage stops her engage" },
//       { name: "Kai'Sa", note: "Cage stops her dash" },
//       { name: "Lucian", note: "Cage stops his dash" },
//       { name: "Kalista", note: "Cage stops her hops" }
//     ],
//     badAgainst: [
//       { name: "Caitlyn", note: "Out-ranges you" },
//       { name: "Ezreal", note: "Dodges your cage" },
//       { name: "Sivir", note: "Spell-shields your stun" },
//       { name: "Olaf", note: "Ignores CC completely" }
//     ],
//     synergies: ["Morgana", "Lux", "Nautilus"],
//     avoidSynergies: [
//       { name: "Soraka", note: "Need burst, not sustain" },
//       { name: "Yuumi", note: "Need engage support" }
//     ],
//     caution: "Very weak early. Farm safely.",
//     conditions: {
//       green: ["Enemy relies on dashing in straight lines", "Game is expected to go late"],
//       red: ["Enemy locks Sivir or Olaf", "Need early priority for first Dragon spawn"]
//     },
//     tips: "Farm with Q. Cage for CC. R for execute."
//   },
//   {
//     name: "Seraphine",
//     roles: ["APC", "Support"],
//     playstyle: ["poke", "heal", "utility"],
//     goodAgainst: [
//       { name: "Ashe", note: "Out-sustain her poke" },
//       { name: "Miss Fortune", note: "Sustain through her damage" },
//       { name: "Jhin", note: "Out-sustain his burst" }
//     ],
//     badAgainst: [
//       { name: "Pyke", note: "Hook = death" },
//       { name: "Blitzcrank", note: "Hook = death" },
//       { name: "Nautilus", note: "Hook = death" },
//       { name: "Zeri", note: "Can't hit her with skillshots" }
//     ],
//     synergies: ["Senna", "Tank Supports", "Wombo-Combo Teams"],
//     avoidSynergies: [
//       { name: "Enchanters", note: "Need engage or tank support" }
//     ],
//     caution: "Squishy. Position carefully.",
//     conditions: {
//       green: ["You have a fasting Senna or heavy engage tank", "Your team has 5v5 teamfight/wombo-combo"],
//       red: ["Enemy has high-mobility assassins", "Hook champions are left open"]
//     },
//     tips: "Q for damage. W for heal. E for CC. R for engage."
//   },
//   {
//     name: "Zyra",
//     roles: ["Support", "APC"],
//     playstyle: ["poke", "zone control", "utility"],
//     goodAgainst: [
//       { name: "Vayne", note: "Plants block her engage" },
//       { name: "Kai'Sa", note: "Plants block her dash" },
//       { name: "Nautilus", note: "Plants block his hook" },
//       { name: "Thresh", note: "Plants block his hook" }
//     ],
//     badAgainst: [
//       { name: "Miss Fortune", note: "Double-up clears plants quickly" },
//       { name: "Caitlyn", note: "Headshot clears plants" },
//       { name: "Xerath", note: "Out-ranges you" },
//       { name: "Lux", note: "Out-ranges your plants" }
//     ],
//     synergies: ["Jhin", "Caitlyn", "Ashe"],
//     avoidSynergies: [
//       { name: "Enchanters", note: "Need poke synergy, not sustain" }
//     ],
//     caution: "Immobile. Position is crucial.",
//     conditions: {
//       green: ["Enemy lane is low-range or relies on hooks", "You want absolute lane dominance from level 1"],
//       red: ["Enemy ADC can clear plants from afar", "Your team desperately needs a real frontline tank"]
//     },
//     tips: "Q+W for poke. E+W for root. R for teamfight CC."
//   },

//   // ============ Additional APCs ============
//   {
//     name: "Karthus",
//     roles: ["APC"],
//     playstyle: ["scaling", "global", "utility"],
//     goodAgainst: [
//       { name: "Sivir", note: "Can't spellshield your Q" },
//       { name: "Ezreal", note: "Out-scale him" },
//       { name: "Caitlyn", note: "Scale past her" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Burst you early" },
//       { name: "Lucian", note: "Dash to dodge Q" },
//       { name: "Vayne", note: "Can't hit her" }
//     ],
//     synergies: ["Morgana", "Lux", "Karma", "Nami", "Lulu"],
//     avoidSynergies: [
//       { name: "Leona", note: "Can't follow engage" },
//       { name: "Alistar", note: "Need poke support" }
//     ],
//     caution: "Immobile. Position is crucial.",
//     conditions: {
//       green: ["Enemy lacks mobility", "Your team needs global pressure"],
//       red: ["Enemy has assassins", "Need early game pressure"]
//     },
//     tips: "Q for poke. W for slow. R for global damage."
//   },
//   {
//     name: "Heimerdinger",
//     roles: ["APC"],
//     playstyle: ["poke", "zone control", "utility"],
//     goodAgainst: [
//       { name: "Sivir", note: "Can't push into turrets" },
//       { name: "Ezreal", note: "Can't farm against turrets" },
//       { name: "Caitlyn", note: "Can't siege with turrets" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Kill turrets quickly" },
//       { name: "Lucian", note: "Dash to turrets, kill them" },
//       { name: "Vayne", note: "Condemn cancels your turrets" }
//     ],
//     synergies: ["Morgana", "Lux", "Karma", "Nami", "Lulu"],
//     avoidSynergies: [
//       { name: "Leona", note: "Can't follow engage" },
//       { name: "Alistar", note: "Need poke support" }
//     ],
//     caution: "Turrets have long CD early. Don't waste them.",
//     conditions: {
//       green: ["Enemy has low waveclear", "Need zone control"],
//       red: ["Enemy has assassins", "Need mobility"]
//     },
//     tips: "Place turrets defensively. Use E for stun. R for empowerment."
//   },
//   {
//     name: "Cassiopeia",
//     roles: ["APC"],
//     playstyle: ["scaling", "DPS", "utility"],
//     goodAgainst: [
//       { name: "Sivir", note: "Can't spellshield your Q" },
//       { name: "Ezreal", note: "Out-scale him" },
//       { name: "Caitlyn", note: "Scale past her" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Burst you early" },
//       { name: "Lucian", note: "Dash to dodge Q" },
//       { name: "Vayne", note: "Can't hit her" }
//     ],
//     synergies: ["Morgana", "Lux", "Karma", "Nami", "Lulu"],
//     avoidSynergies: [
//       { name: "Leona", note: "Can't follow engage" },
//       { name: "Alistar", note: "Need poke support" }
//     ],
//     caution: "Immobile. Position carefully.",
//     conditions: {
//       green: ["Enemy lacks mobility", "Need DPS"],
//       red: ["Enemy has assassins", "Need early game pressure"]
//     },
//     tips: "Q for poke. W for ground. E for sustain. R for CC."
//   },

//   // ============ Supports ============
//   {
//     name: "Thresh",
//     roles: ["Support"],
//     archetype: "Hook",
//     playstyle: ["engage", "peel", "utility"],
//     goodAgainst: [
//       { name: "Blitzcrank", note: "Flay denies his pull" },
//       { name: "Leona", note: "Flay cancels her E" },
//       { name: "Nautilus", note: "Can peel his engage" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Black shield blocks your hook" },
//       { name: "Zilean", note: "Speed boost makes hooks hard to land" },
//       { name: "Janna", note: "Tornado cancels your Q" }
//     ],
//     synergies: ["Draven", "Caitlyn", "Kalista", "Lucian", "Samira"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "Can't follow up hook easily" },
//       { name: "Sivir", note: "No burst to capitalize on hooks" }
//     ],
//     caution: "Hook has a long wind-up. Predict enemy movement.",
//     conditions: {
//       green: ["You need engage", "Enemy has immobile carries"],
//       red: ["Enemy has Morgana/Sivir", "Heavy poke lanes"]
//     },
//     tips: "Use E passive for poke. Q+E+R is your full combo."
//   },
//   {
//     name: "Blitzcrank",
//     roles: ["Support"],
//     archetype: "Hook",
//     playstyle: ["pick", "engage", "roaming"],
//     goodAgainst: [
//       { name: "Sona", note: "Pull her in, burst down" },
//       { name: "Soraka", note: "Hook her when she tries to heal" },
//       { name: "Janna", note: "Pull her before she can tornado" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Black shield blocks Q" },
//       { name: "Leona", note: "She engages on your ADC after you miss" },
//       { name: "Alistar", note: "Can headbutt your ADC away" }
//     ],
//     synergies: ["Draven", "Lucian", "Jhin", "Caitlyn", "Kalista"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No burst after hook" },
//       { name: "Sivir", note: "Can't capitalize on your hook" }
//     ],
//     caution: "Miss a hook and you're useless for 10 seconds. Don't throw blind hooks.",
//     conditions: {
//       green: ["Enemy has immobile supports/ADCs", "You can dominate vision"],
//       red: ["Enemy has tanky engage supports", "Need to play safe"]
//     },
//     tips: "Use W to close distance, then E, then Q for guaranteed hook."
//   },
//   {
//     name: "Nautilus",
//     roles: ["Support"],
//     archetype: "Hook",
//     playstyle: ["engage", "tank", "peel"],
//     goodAgainst: [
//       { name: "Thresh", note: "Can't flay your hook" },
//       { name: "Blitzcrank", note: "Body block his hook for ADC" },
//       { name: "Rakan", note: "Catch him mid-W" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Shield blocks your Q and R" },
//       { name: "Alistar", note: "Can peel your engages" },
//       { name: "Janna", note: "Tornado cancels your Q dash" }
//     ],
//     synergies: ["Kai'Sa", "Samira", "Draven", "Caitlyn", "Lucian"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "Can't follow up your engage" },
//       { name: "Sivir", note: "Not enough burst for your hook" }
//     ],
//     caution: "Your hook pulls you to them. Only engage if you can win the fight.",
//     conditions: {
//       green: ["You need engage", "Enemy has low mobility"],
//       red: ["Enemy has Morgana", "Heavy disengage comps"]
//     },
//     tips: "Auto attack for root then hook. R can peel for ADC."
//   },
//   {
//     name: "Pyke",
//     roles: ["Support"],
//     archetype: "Hook",
//     playstyle: ["assassin", "engage", "roaming"],
//     goodAgainst: [
//       { name: "Soraka", note: "Burst her before she heals" },
//       { name: "Sona", note: "Easy to catch" },
//       { name: "Yuumi", note: "Hook her off ADC" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Shield blocks your hook and stun" },
//       { name: "Thresh", note: "Flay cancels your dash" },
//       { name: "Alistar", note: "Peels you away" }
//     ],
//     synergies: ["Draven", "Jhin", "Caitlyn", "Lucian", "Samira"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up damage" },
//       { name: "Sivir", note: "Shield blocks your combo" }
//     ],
//     caution: "Squishy. Don't engage without vision.",
//     conditions: {
//       green: ["Enemy has squishy bot lane", "You can roam for kills"],
//       red: ["Enemy has point-and-click CC", "Tanky enemy team"]
//     },
//     tips: "Q tap for slow, Q hold for hook. R for execute and reset."
//   },
//   {
//     name: "Leona",
//     roles: ["Support"],
//     archetype: "Engage",
//     playstyle: ["engage", "tank", "all-in"],
//     goodAgainst: [
//       { name: "Thresh", note: "Can't flay your E once you're in" },
//       { name: "Nautilus", note: "Your W out-tanks his engage" },
//       { name: "Blitzcrank", note: "Hook you in, you engage on them" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Black shield blocks your CC" },
//       { name: "Janna", note: "Tornado cancels your E" },
//       { name: "Alistar", note: "Headbutt peels you away" }
//     ],
//     synergies: ["Draven", "Samira", "Tristana", "Kai'Sa", "Lucian"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "Can't follow up your engage" },
//       { name: "Sivir", note: "Not enough burst for your engage" }
//     ],
//     caution: "Once you go in, you're all-in. Don't engage without your ADC ready.",
//     conditions: {
//       green: ["Enemy has immobile carries", "You need early pressure"],
//       red: ["Enemy has Morgana", "Heavy poke lanes"]
//     },
//     tips: "E-Q-R is your full combo. W before E for extra tankiness."
//   },
//   {
//     name: "Alistar",
//     roles: ["Support"],
//     archetype: "Engage",
//     playstyle: ["engage", "peel", "tank"],
//     goodAgainst: [
//       { name: "Leona", note: "Peel her engage off your ADC" },
//       { name: "Nautilus", note: "Headbutt him after he hooks in" },
//       { name: "Blitzcrank", note: "Hook your ADC? Headbutt him away" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't CC through shield" },
//       { name: "Janna", note: "Tornado stops your engage" },
//       { name: "Braum", note: "Can block your combo" }
//     ],
//     synergies: ["Draven", "Samira", "Tristana", "Kai'Sa", "Lucian"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up damage" },
//       { name: "Sivir", note: "Need burst for your engage" }
//     ],
//     caution: "Your combo is telegraphed. W-Q or flash Q.",
//     conditions: {
//       green: ["Enemy has engage supports", "You need peel for ADC"],
//       red: ["Enemy has disengage", "Need to play defensive"]
//     },
//     tips: "W-Q combo. Use R to remove CC and survive."
//   },
//   {
//     name: "Rakan",
//     roles: ["Support"],
//     archetype: "Engage",
//     playstyle: ["engage", "enchanter", "mobile"],
//     goodAgainst: [
//       { name: "Thresh", note: "Can dodge his hook with E" },
//       { name: "Blitzcrank", note: "E to avoid hook" },
//       { name: "Leona", note: "Dodge her E with W" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Shield blocks your CC" },
//       { name: "Nautilus", note: "Catch you in W" },
//       { name: "Janna", note: "Tornado cancels your W" }
//     ],
//     synergies: ["Xayah", "Kai'Sa", "Samira", "Draven", "Lucian"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "Can't follow up engage" },
//       { name: "Sivir", note: "No burst for your engage" }
//     ],
//     caution: "Squishy for an engage support. Don't get caught.",
//     conditions: {
//       green: ["You have Xayah", "Team needs engage"],
//       red: ["Heavy CC enemy team", "Need peel support"]
//     },
//     tips: "W-R-E for engage. E back to ADC after engaging."
//   },
//   {
//     name: "Braum",
//     roles: ["Support"],
//     archetype: "Enchanter",
//     playstyle: ["peel", "engage", "tank"],
//     goodAgainst: [
//       { name: "Thresh", note: "Block his hook with E" },
//       { name: "Blitzcrank", note: "Block his hook with E" },
//       { name: "Nautilus", note: "Block his hook with E" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't block her Q with E" },
//       { name: "Lulu", note: "Can't block polymorph" },
//       { name: "Janna", note: "Can't block tornado" }
//     ],
//     synergies: ["Lucian", "Vayne", "Kai'Sa", "Samira", "Tristana"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up CC" },
//       { name: "Sivir", note: "Need burst" }
//     ],
//     caution: "Can't peel magic damage. Don't pick into AP-heavy comps.",
//     conditions: {
//       green: ["Enemy has skillshots", "Need peel"],
//       red: ["Enemy has AP burst", "Need engage support"]
//     },
//     tips: "E for block. Q for slow. R for knockup."
//   },
//   {
//     name: "Janna",
//     roles: ["Support"],
//     archetype: "Enchanter",
//     playstyle: ["peel", "disengage", "utility"],
//     goodAgainst: [
//       { name: "Leona", note: "Cancel her E with Q" },
//       { name: "Nautilus", note: "Cancel his Q with Q" },
//       { name: "Alistar", note: "W him away when he engages" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't peel through shield" },
//       { name: "Blitzcrank", note: "Can't stop his hook" },
//       { name: "Zyra", note: "Poke out-ranges you" }
//     ],
//     synergies: ["Vayne", "Kog'Maw", "Jinx", "Twitch", "Caitlyn"],
//     avoidSynergies: [
//       { name: "Draven", note: "Need engage, not peel" },
//       { name: "Samira", note: "Need engage support" }
//     ],
//     caution: "Can't engage. Only disengage. Don't pick if your team needs engage.",
//     conditions: {
//       green: ["Enemy has engage supports", "Your ADC needs protection"],
//       red: ["Enemy has poke supports", "Your team needs engage"]
//     },
//     tips: "Use Q for disengage. E to shield your ADC during trades."
//   },
//   {
//     name: "Lulu",
//     roles: ["Support"],
//     archetype: "Enchanter",
//     playstyle: ["peel", "buff", "utility"],
//     goodAgainst: [
//       { name: "Leona", note: "W her engage" },
//       { name: "Nautilus", note: "Polymorph him" },
//       { name: "Thresh", note: "Shield her ADC, polymorph hook target" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't polymorph through shield" },
//       { name: "Blitzcrank", note: "Can't stop his hook" },
//       { name: "Xerath", note: "Out-ranges you" }
//     ],
//     synergies: ["Vayne", "Kog'Maw", "Twitch", "Jinx", "Kai'Sa"],
//     avoidSynergies: [
//       { name: "Draven", note: "Need engage support" },
//       { name: "Samira", note: "Need engage support" }
//     ],
//     caution: "Squishy. Position behind your ADC.",
//     conditions: {
//       green: ["Your ADC needs protection", "Enemy has divers"],
//       red: ["Enemy has long-range poke", "Your team needs engage"]
//     },
//     tips: "E for shield, W for polymorph, R for peel. Use W on carry for speed."
//   },
//   {
//     name: "Soraka",
//     roles: ["Support"],
//     archetype: "Enchanter",
//     playstyle: ["heal", "sustain", "utility"],
//     goodAgainst: [
//       { name: "Leona", note: "Silence cancels her combo" },
//       { name: "Nautilus", note: "Heal through his engage" },
//       { name: "Alistar", note: "Sustain through his combo" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't heal through CC" },
//       { name: "Blitzcrank", note: "Hook > burst > no heal" },
//       { name: "Thresh", note: "Hook > burst > no heal" }
//     ],
//     synergies: ["Vayne", "Kog'Maw", "Ezreal", "Caitlyn", "Jinx"],
//     avoidSynergies: [
//       { name: "Draven", note: "Need engage, not sustain" },
//       { name: "Samira", note: "Need engage support" }
//     ],
//     caution: "Your health is your resource. Don't spam heals without reason.",
//     conditions: {
//       green: ["Enemy has poke", "Your ADC can scale"],
//       red: ["Enemy has burst/engage", "Your team needs engage"]
//     },
//     tips: "Q for sustain, W for heal, E for silence. Don't heal when low."
//   },
//   {
//     name: "Nami",
//     roles: ["Support"],
//     archetype: "Enchanter",
//     playstyle: ["poke", "sustain", "engage"],
//     goodAgainst: [
//       { name: "Leona", note: "Q can stop her engage" },
//       { name: "Nautilus", note: "Q to stop his hook" },
//       { name: "Alistar", note: "Q after his combo" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't CC through shield" },
//       { name: "Blitzcrank", note: "Can't stop hook" },
//       { name: "Thresh", note: "Can't stop hook" }
//     ],
//     synergies: ["Lucian", "Draven", "Caitlyn", "Jhin", "Ezreal"],
//     avoidSynergies: [
//       { name: "Vayne", note: "Need peel, not poke" },
//       { name: "Kog'Maw", note: "Need more peel" }
//     ],
//     caution: "Q is your only peel. Don't waste it.",
//     conditions: {
//       green: ["You need poke + sustain", "Enemy has engage"],
//       red: ["Enemy has Morgana", "Need hard engage"]
//     },
//     tips: "E for on-hit buff. Q for CC. W for heal and poke."
//   },
//   {
//     name: "Karma",
//     roles: ["Support", "APC"],
//     archetype: "Poke",
//     playstyle: ["poke", "shield", "utility"],
//     goodAgainst: [
//       { name: "Leona", note: "W to stop her engage" },
//       { name: "Nautilus", note: "W to stop his hook" },
//       { name: "Alistar", note: "W to stop his combo" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't CC through shield" },
//       { name: "Blitzcrank", note: "Can't stop hook" },
//       { name: "Thresh", note: "Can't stop hook" }
//     ],
//     synergies: ["Ezreal", "Caitlyn", "Jhin", "Sivir", "Draven"],
//     avoidSynergies: [
//       { name: "Vayne", note: "Need peel, not poke" },
//       { name: "Kog'Maw", note: "Need more sustain" }
//     ],
//     caution: "Your mantra is your identity. Use it wisely.",
//     conditions: {
//       green: ["Enemy has immobile bot lane", "You need poke"],
//       red: ["Enemy has engage supports", "Your team needs engage"]
//     },
//     tips: "Mantra Q for poke, Mantra E for team shield and speed."
//   },
//   {
//     name: "Yuumi",
//     roles: ["Support"],
//     archetype: "Enchanter",
//     playstyle: ["heal", "buff", "utility"],
//     goodAgainst: [
//       { name: "Leona", note: "Can't target you" },
//       { name: "Nautilus", note: "Can't hook you" },
//       { name: "Blitzcrank", note: "Can't hook you" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't CC through her shield" },
//       { name: "Thresh", note: "Can't CC through his hook" },
//       { name: "Alistar", note: "Can't CC through his combo" }
//     ],
//     synergies: ["Ezreal", "Zeri", "Vayne", "Kog'Maw", "Twitch"],
//     avoidSynergies: [
//       { name: "Draven", note: "Need engage support" },
//       { name: "Samira", note: "Need engage support" }
//     ],
//     caution: "If your ADC dies, you're useless. Position carefully.",
//     conditions: {
//       green: ["Your ADC is mobile", "Enemy has poke"],
//       red: ["Enemy has engage supports", "Your ADC is immobile"]
//     },
//     tips: "Q for poke, E for heal. Ult for CC. Use W to jump between allies."
//   },
//   {
//     name: "Morgana",
//     roles: ["Support", "APC"],
//     archetype: "Mage",
//     playstyle: ["poke", "engage", "utility"],
//     goodAgainst: [
//       { name: "Thresh", note: "Black shield blocks his hook" },
//       { name: "Blitzcrank", note: "Black shield blocks his hook" },
//       { name: "Leona", note: "Black shield blocks her CC" }
//     ],
//     badAgainst: [
//       { name: "Lulu", note: "Polymorph > shield" },
//       { name: "Janna", note: "Tornado > shield" },
//       { name: "Nami", note: "Q > shield" }
//     ],
//     synergies: ["Caitlyn", "Jhin", "Lucian", "Kai'Sa", "Draven"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up CC" },
//       { name: "Sivir", note: "No follow-up CC" }
//     ],
//     caution: "Black Shield has long CD. Don't waste it.",
//     conditions: {
//       green: ["Enemy has engage supports", "You need poke"],
//       red: ["Enemy has poke supports", "Enemy has Lulu/Polymorph"]
//     },
//     tips: "Q for root. E for shield. W for poke. R for teamfight CC."
//   },
//   {
//     name: "Lux",
//     roles: ["Support", "APC"],
//     archetype: "Mage",
//     playstyle: ["poke", "burst", "utility"],
//     goodAgainst: [
//       { name: "Thresh", note: "Poke him from range" },
//       { name: "Blitzcrank", note: "Poke him from range" },
//       { name: "Nautilus", note: "Poke him from range" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Shield blocks your CC" },
//       { name: "Lulu", note: "Polymorph > CC" },
//       { name: "Janna", note: "Tornado > CC" }
//     ],
//     synergies: ["Caitlyn", "Jhin", "Lucian", "Draven", "Ashe"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up CC" },
//       { name: "Sivir", note: "No follow-up CC" }
//     ],
//     caution: "Squishy. Don't get caught.",
//     conditions: {
//       green: ["Enemy has immobile bot lane", "Need poke and burst"],
//       red: ["Enemy has engage supports", "Heavy dive comps"]
//     },
//     tips: "Q for root. E for poke. W for shield. R for burst."
//   },
//   {
//     name: "Sona",
//     roles: ["Support"],
//     archetype: "Enchanter",
//     playstyle: ["heal", "poke", "utility"],
//     goodAgainst: [
//       { name: "Leona", note: "Poke her from range" },
//       { name: "Nautilus", note: "Poke him from range" },
//       { name: "Alistar", note: "Poke him from range" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't CC through shield" },
//       { name: "Blitzcrank", note: "Can't stop hook" },
//       { name: "Thresh", note: "Can't stop hook" }
//     ],
//     synergies: ["Ezreal", "Caitlyn", "Jhin", "Sivir", "Draven"],
//     avoidSynergies: [
//       { name: "Vayne", note: "Need peel, not poke" },
//       { name: "Kog'Maw", note: "Need more sustain" }
//     ],
//     caution: "Squishy. Position carefully.",
//     conditions: {
//       green: ["Enemy has immobile bot lane", "Need poke and sustain"],
//       red: ["Enemy has engage supports", "Heavy dive comps"]
//     },
//     tips: "Q for poke. W for heal. E for speed. R for CC."
//   },
//   {
//     name: "Xerath",
//     roles: ["Support", "APC"],
//     archetype: "Mage",
//     playstyle: ["poke", "burst", "utility"],
//     goodAgainst: [
//       { name: "Thresh", note: "Poke from range" },
//       { name: "Blitzcrank", note: "Poke from range" },
//       { name: "Nautilus", note: "Poke from range" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Shield blocks your CC" },
//       { name: "Lulu", note: "Polymorph > CC" },
//       { name: "Janna", note: "Tornado > CC" }
//     ],
//     synergies: ["Caitlyn", "Jhin", "Lucian", "Draven", "Ashe"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up CC" },
//       { name: "Sivir", note: "No follow-up CC" }
//     ],
//     caution: "Squishy and immobile. Position is crucial.",
//     conditions: {
//       green: ["Enemy has immobile bot lane", "Need poke"],
//       red: ["Enemy has engage supports", "Heavy dive comps"]
//     },
//     tips: "Q for poke. W for slow. E for stun. R for burst."
//   },
//   {
//     name: "Vel'Koz",
//     roles: ["Support", "APC"],
//     archetype: "Mage",
//     playstyle: ["poke", "burst", "utility"],
//     goodAgainst: [
//       { name: "Thresh", note: "Poke from range" },
//       { name: "Blitzcrank", note: "Poke from range" },
//       { name: "Nautilus", note: "Poke from range" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Shield blocks your CC" },
//       { name: "Lulu", note: "Polymorph > CC" },
//       { name: "Janna", note: "Tornado > CC" }
//     ],
//     synergies: ["Caitlyn", "Jhin", "Lucian", "Draven", "Ashe"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up CC" },
//       { name: "Sivir", note: "No follow-up CC" }
//     ],
//     caution: "Squishy and immobile. Position carefully.",
//     conditions: {
//       green: ["Enemy has immobile bot lane", "Need poke"],
//       red: ["Enemy has engage supports", "Heavy dive comps"]
//     },
//     tips: "Q for poke. W for waveclear. E for CC. R for true damage burst."
//   },
//   {
//     name: "Taric",
//     roles: ["Support"],
//     archetype: "Enchanter",
//     playstyle: ["heal", "engage", "tank"],
//     goodAgainst: [
//       { name: "Leona", note: "Heal through her engage" },
//       { name: "Nautilus", note: "Heal through his engage" },
//       { name: "Alistar", note: "Heal through his combo" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't CC through shield" },
//       { name: "Lulu", note: "Can't out-heal polymorph" },
//       { name: "Janna", note: "Can't out-heal tornado" }
//     ],
//     synergies: ["Lucian", "Vayne", "Kai'Sa", "Samira", "Tristana"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up CC" },
//       { name: "Sivir", note: "Need burst" }
//     ],
//     caution: "Your ultimate has a delay. Predict engages.",
//     conditions: {
//       green: ["Enemy has melee engage", "Need sustain"],
//       red: ["Enemy has poke", "Need engage support"]
//     },
//     tips: "Q for heal. W for shield. E for stun. R for invulnerability."
//   },
//   {
//     name: "Seraphine",
//     roles: ["Support", "APC"],
//     archetype: "Mage",
//     playstyle: ["poke", "heal", "utility"],
//     goodAgainst: [
//       { name: "Thresh", note: "Poke him from range" },
//       { name: "Blitzcrank", note: "Poke him from range" },
//       { name: "Nautilus", note: "Poke him from range" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Shield blocks your CC" },
//       { name: "Lulu", note: "Polymorph > CC" },
//       { name: "Janna", note: "Tornado > CC" }
//     ],
//     synergies: ["Jhin", "Caitlyn", "Lucian", "Draven", "Ashe"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up CC" },
//       { name: "Sivir", note: "No follow-up CC" }
//     ],
//     caution: "Squishy. Position carefully.",
//     conditions: {
//       green: ["Enemy has immobile bot lane", "Need poke and sustain"],
//       red: ["Enemy has engage supports", "Heavy dive comps"]
//     },
//     tips: "Q for damage. W for heal. E for CC. R for engage."
//   },
//   {
//     name: "Zilean",
//     roles: ["Support", "APC"],
//     archetype: "Mage",
//     playstyle: ["poke", "utility", "revive"],
//     goodAgainst: [
//       { name: "Thresh", note: "Speed to dodge hooks" },
//       { name: "Blitzcrank", note: "Speed to dodge hooks" },
//       { name: "Nautilus", note: "Speed to dodge hooks" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Can't CC through shield" },
//       { name: "Lulu", note: "Can't out-speed polymorph" },
//       { name: "Janna", note: "Can't out-speed tornado" }
//     ],
//     synergies: ["Ezreal", "Caitlyn", "Jhin", "Draven", "Lucian"],
//     avoidSynergies: [
//       { name: "Vayne", note: "Need peel, not speed" },
//       { name: "Kog'Maw", note: "Need more sustain" }
//     ],
//     caution: "Squishy. Position carefully.",
//     conditions: {
//       green: ["Enemy has engage supports", "Need speed and utility"],
//       red: ["Enemy has poke", "Need engage support"]
//     },
//     tips: "Q for stun. W for CD reset. E for speed. R for revive."
//   },
//   {
//     name: "Amumu",
//     roles: ["Support"],
//     archetype: "Engage",
//     playstyle: ["engage", "tank", "teamfight"],
//     goodAgainst: [
//       { name: "Thresh", note: "Can't flay your Q" },
//       { name: "Blitzcrank", note: "Body block his hook" },
//       { name: "Nautilus", note: "Out-tank his engage" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Black shield blocks your CC" },
//       { name: "Janna", note: "Tornado cancels your Q" },
//       { name: "Lulu", note: "Polymorph stops your engage" }
//     ],
//     synergies: ["Miss Fortune", "Samira", "Kai'Sa", "Draven"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up damage" },
//       { name: "Sivir", note: "No follow-up damage" }
//     ],
//     caution: "Your Q has a long CD early. Don't miss it.",
//     conditions: {
//       green: ["Enemy has grouped up", "Teamfight comp"],
//       red: ["Enemy has disengage", "Need peel support"]
//     },
//     tips: "Q for engage. W for damage. R for teamfight CC."
//   },
//   {
//     name: "Nasus",
//     roles: ["Support"],
//     archetype: "Engage",
//     playstyle: ["poke", "utility", "scaling"],
//     goodAgainst: [
//       { name: "Thresh", note: "Wither his engage" },
//       { name: "Blitzcrank", note: "Wither him" },
//       { name: "Nautilus", note: "Wither him" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Black shield blocks your W" },
//       { name: "Lulu", note: "Polymorph stops you" },
//       { name: "Janna", note: "Tornado stops you" }
//     ],
//     synergies: ["Senna", "Caitlyn", "Jhin", "Ezreal"],
//     avoidSynergies: [
//       { name: "Draven", note: "Need engage, not poke" },
//       { name: "Samira", note: "Need engage support" }
//     ],
//     caution: "Weak early. Need to scale.",
//     conditions: {
//       green: ["Enemy has auto-attack dependent ADC", "Need scaling"],
//       red: ["Enemy has early pressure", "Need engage support"]
//     },
//     tips: "W for slow. E for armor shred. Farm Q for scaling."
//   },
//   {
//     name: "Galio",
//     roles: ["Support"],
//     archetype: "Engage",
//     playstyle: ["engage", "peel", "utility"],
//     goodAgainst: [
//       { name: "Thresh", note: "Can't CC through your W" },
//       { name: "Blitzcrank", note: "Can't hook through your W" },
//       { name: "Nautilus", note: "Can't CC through your W" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Black shield blocks your CC" },
//       { name: "Lulu", note: "Polymorph stops your engage" },
//       { name: "Janna", note: "Tornado cancels your E" }
//     ],
//     synergies: ["Senna", "Caitlyn", "Jhin", "Ezreal"],
//     avoidSynergies: [
//       { name: "Draven", note: "Need engage, not peel" },
//       { name: "Samira", note: "Need engage support" }
//     ],
//     caution: "Your ult has a long CD. Use it wisely.",
//     conditions: {
//       green: ["Enemy has AP damage", "Need engage"],
//       red: ["Enemy has AD heavy", "Need peel support"]
//     },
//     tips: "W for taunt. E for engage. R for global peel."
//   },
//   {
//     name: "Pantheon",
//     roles: ["Support"],
//     archetype: "Engage",
//     playstyle: ["engage", "roaming", "burst"],
//     goodAgainst: [
//       { name: "Thresh", note: "Block his hook with E" },
//       { name: "Blitzcrank", note: "Block his hook with E" },
//       { name: "Nautilus", note: "Block his hook with E" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Black shield blocks your stun" },
//       { name: "Lulu", note: "Polymorph stops your engage" },
//       { name: "Janna", note: "Tornado cancels your W" }
//     ],
//     synergies: ["Draven", "Samira", "Tristana", "Kai'Sa"],
//     avoidSynergies: [
//       { name: "Kog'Maw", note: "You roam and abandon him" },
//       { name: "Jinx", note: "You roam and abandon her" }
//     ],
//     caution: "Fall off late game. Use early pressure.",
//     conditions: {
//       green: ["Enemy has squishy bot lane", "You need to roam"],
//       red: ["Enemy has tanky comp", "Need peel support"]
//     },
//     tips: "E for block. W for stun. R for roam."
//   },

//   // ============ Additional PC Champions (for completeness) ============
//   {
//     name: "Aphelios",
//     roles: ["ADC"],
//     playstyle: ["utility", "DPS", "burst"],
//     goodAgainst: [
//       { name: "Caitlyn", note: "Better utility, strong 2v2" },
//       { name: "Jhin", note: "Out-trade with Calibrum" },
//       { name: "Sivir", note: "Burst through shield" }
//     ],
//     badAgainst: [
//       { name: "Draven", note: "Can't trade early" },
//       { name: "Vayne", note: "Condemn cancels your Q" },
//       { name: "Kai'Sa", note: "Can't match her mobility" }
//     ],
//     synergies: ["Thresh", "Nautilus", "Leona", "Braum", "Lulu"],
//     avoidSynergies: [
//       { name: "Soraka", note: "Need engage, not sustain" },
//       { name: "Yuumi", note: "Want CC support" }
//     ],
//     caution: "Weapon order matters. Learn your rotations.",
//     conditions: {
//       green: ["You know your weapon combos", "Team needs utility"],
//       red: ["Enemy has assassins", "Need early game pressure"]
//     },
//     tips: "Red+White for DPS, Green+Purple for picks. Plan your weapons."
//   },
//   {
//     name: "Rell",
//     roles: ["Support"],
//     archetype: "Engage",
//     playstyle: ["engage", "teamfight", "tank"],
//     goodAgainst: [
//       { name: "Thresh", note: "Can't flay your R" },
//       { name: "Leona", note: "Your R cancels her E" },
//       { name: "Nautilus", note: "Pull him in with E" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Black shield blocks your CC" },
//       { name: "Janna", note: "Tornado cancels your W" },
//       { name: "Braum", note: "Can block your engage" }
//     ],
//     synergies: ["Samira", "Kai'Sa", "Draven", "Tristana", "Lucian"],
//     avoidSynergies: [
//       { name: "Ezreal", note: "No follow-up damage" },
//       { name: "Sivir", note: "Need burst for your engage" }
//     ],
//     caution: "Your W is slow. Predict enemy movement.",
//     conditions: {
//       green: ["Enemy has grouped up", "Teamfight comp"],
//       red: ["Enemy has heavy disengage", "Need pick comp"]
//     },
//     tips: "W for engage, E for stun, R for teamfight CC."
//   },
//   {
//     name: "Bard",
//     roles: ["Support"],
//     archetype: "Poke",
//     playstyle: ["roaming", "utility", "peel"],
//     goodAgainst: [
//       { name: "Leona", note: "Ult to peel her engage" },
//       { name: "Thresh", note: "Dodge hook, poke him" },
//       { name: "Blitzcrank", note: "Poke him, avoid hook" }
//     ],
//     badAgainst: [
//       { name: "Morgana", note: "Black shield blocks your CC" },
//       { name: "Nautilus", note: "Can't escape his hook" },
//       { name: "Alistar", note: "Can't poke through his sustain" }
//     ],
//     synergies: ["Jhin", "Caitlyn", "Ezreal", "Draven", "Lucian"],
//     avoidSynergies: [
//       { name: "Vayne", note: "Need peel, not poke" },
//       { name: "Kai'Sa", note: "Need engage support" }
//     ],
//     caution: "Roaming leaves your ADC 1v2. Time your roams carefully.",
//     conditions: {
//       green: ["You can roam well", "Enemy has immobile bot lane"],
//       red: ["Enemy has dive supports", "Your ADC needs protection"]
//     },
//     tips: "Collect chimes for movespeed and mana. R can save teammates."
//   },
//   {
//     name: "Senna",
//     roles: ["Support", "ADC"],
//     archetype: "Mage",
//     playstyle: ["poke", "sustain", "utility"],
//     goodAgainst: [
//       { name: "Sona", note: "Out-poke and out-scale" },
//       { name: "Soraka", note: "Deny her healing with poke" },
//       { name: "Miss Fortune", note: "Cancel her strut with auto" }
//     ],
//     badAgainst: [
//       { name: "Blitzcrank", note: "Hook = death" },
//       { name: "Thresh", note: "Hook = death" },
//       { name: "Leona", note: "Engage = death" }
//     ],
//     synergies: ["Nasus", "Galio", "Nautilus"],
//     avoidSynergies: [
//       { name: "Enchanters", note: "Two squishy, passive laners who fold to hook" }
//     ],
//     caution: "Squishy. Don't get caught by hooks.",
//     conditions: {
//       green: ["Enemy lacks engage", "You need poke and sustain"],
//       red: ["Enemy has hook supports", "Heavy engage comps"]
//     },
//     tips: "Q for poke/heal. W for root. E for stealth. R for shield/damage."
//   }
// ];

// // ============ Draft Rules ============
// const draftRules = [
//   {
//     id: "draven-bully",
//     condition: "enemyADC === 'Draven'",
//     text: "Draven dominates most marksmen early with raw damage. Pick Caitlyn for range, Varus for poke, or Tristana for safety. Never pick Vayne/Kai'Sa into him."
//   },
//   {
//     id: "caitlyn-siege",
//     condition: "enemyADC === 'Caitlyn'",
//     text: "Caitlyn wins through lane pressure. Pick Varus to match poke, Draven for all-in, or Ezreal for safety. Avoid short-range ADCs."
//   },
//   {
//     id: "vayne-scaling",
//     condition: "enemyADC === 'Vayne'",
//     text: "Vayne needs to scale. Pick Draven/Lucian to punish early, Caitlyn for range, or Ashe for vision. Don't let her farm safely."
//   },
//   {
//     id: "lucian-burst",
//     condition: "enemyADC === 'Lucian'",
//     text: "Lucian wants early kills. Pick Caitlyn for range, Draven to trade back, or Sivir to block his burst. Don't pick Kog'Maw."
//   },
//   {
//     id: "ezreal-safe",
//     condition: "enemyADC === 'Ezreal'",
//     text: "Ezreal plays safe and pokes. Pick Draven to all-in, Twitch to flank, or Sivir to push him in. Don't let him scale safely."
//   },
//   {
//     id: "ashe-utility",
//     condition: "enemyADC === 'Ashe'",
//     text: "Ashe wins with utility and slows. Pick Draven to out-damage, Ezreal for mobility, or Caitlyn for range."
//   },
//   {
//     id: "jhin-burst",
//     condition: "enemyADC === 'Jhin'",
//     text: "Jhin wins with burst and utility. Pick Draven to out-trade, Tristana to jump his reload, or Varus for poke."
//   },
//   {
//     id: "jinx-hypercarry",
//     condition: "enemyADC === 'Jinx'",
//     text: "Jinx scales hard. Pick Draven/Lucian to pressure early, Tristana to match scaling, or Caitlyn to out-range."
//   },
//   {
//     id: "kalista-mobility",
//     condition: "enemyADC === 'Kalista'",
//     text: "Kalista wins with mobility. Pick Ashe for slows, Draven for raw damage, or Caitlyn for range to deny her jumps."
//   },
//   {
//     id: "kogmaw-hypercarry",
//     condition: "enemyADC === 'Kog'Maw'",
//     text: "Kog'Maw needs protection. Pick Draven/Lucian for early burst, Tristana to jump him, or Varus for poke."
//   },
//   {
//     id: "zeri-kiting",
//     condition: "enemyADC === 'Zeri'",
//     text: "Zeri wins with kiting. Pick Draven for early damage, Caitlyn for range, or Lucian for burst to shut her down."
//   },
//   {
//     id: "engage-support",
//     condition: "enemySupport === 'Leona' || enemySupport === 'Nautilus' || enemySupport === 'Alistar' || enemySupport === 'Amumu'",
//     text: "Engage supports want to all-in. Pick Morgana (black shield), Janna (disengage), or Braum (peel) to counter."
//   },
//   {
//     id: "hook-support",
//     condition: "enemySupport === 'Thresh' || enemySupport === 'Blitzcrank' || enemySupport === 'Pyke' || enemySupport === 'Nautilus'",
//     text: "Hook supports punish bad positioning. Pick Morgana (black shield), Sivir (spell shield), Ezreal (mobility), or Zyra (plants block hooks)."
//   },
//   {
//     id: "poke-support",
//     condition: "enemySupport === 'Zyra' || enemySupport === 'Xerath' || enemySupport === 'Vel'Koz' || enemySupport === 'Brand'",
//     text: "Poke supports win through pressure. Pick sustain (Soraka/Nami) or hard engage (Leona/Nautilus) to counter."
//   },
//   {
//     id: "enchanter-support",
//     condition: "enemySupport === 'Lulu' || enemySupport === 'Janna' || enemySupport === 'Soraka' || enemySupport === 'Nami' || enemySupport === 'Yuumi'",
//     text: "Enchanters protect and sustain. Pick poke (Zyra/Xerath) or engage (Leona/Nautilus) to out-pressure and deny their scaling."
//   },
//   {
//     id: "ziggs-apc",
//     condition: "enemyADC === 'Ziggs'",
//     text: "Ziggs wants to siege. Pick Ezreal for mobility, Varus for poke, or Draven for early burst. Don't let him take your tower."
//   },
//   {
//     id: "veigar-apc",
//     condition: "enemyADC === 'Veigar'",
//     text: "Veigar scales infinitely. Pick Sivir (spell shield), Ezreal (mobility), or Draven (early pressure) to counter."
//   },
//   {
//     id: "seraphine-apc",
//     condition: "enemyADC === 'Seraphine'",
//     text: "Seraphine wins in teamfights. Pick Pyke/Blitz/Nautilus for hook engage, or Zeri to dodge her skillshots."
//   },
//   {
//     id: "ziggs-siege",
//     condition: "enemyADC === 'Ziggs'",
//     text: "Ziggs is a siege god. Pick Sivir to push back, Ezreal to dodge, or Tristana to all-in him before he scales."
//   },
//   {
//     id: "brand-support",
//     condition: "enemySupport === 'Brand'",
//     text: "Brand is a damage support. Pick sustain (Soraka/Nami) to heal his poke, or engage to burst him down."
//   },
//   {
//     id: "zyra-plant",
//     condition: "enemySupport === 'Zyra'",
//     text: "Zyra's plants block hooks. Pick Miss Fortune to clear plants with Q, Caitlyn for range, or Xerath to out-poke her."
//   },
//   {
//     id: "senna-support",
//     condition: "enemySupport === 'Senna'",
//     text: "Senna wins through poke and scaling. Pick engage supports to burst her, or hard engage to lock her down."
//   },
//   {
//     id: "pyke-roam",
//     condition: "enemySupport === 'Pyke'",
//     text: "Pyke is a roaming assassin. Pick Morgana to block his hooks, or Alistar to peel his engages. Ward river and ping MIA."
//   },
//   {
//     id: "yuumi-enchanter",
//     condition: "enemySupport === 'Yuumi'",
//     text: "Yuumi is annoying but weak early. Pick engage supports to burst her ADC, or enchanters to match her sustain."
//   },
//   {
//     id: "apc-vs-adc",
//     condition: "enemyRole === 'APC' && (enemyADC === 'Ziggs' || enemyADC === 'Veigar' || enemyADC === 'Seraphine' || enemyADC === 'Karthus')",
//     text: "APCs are weak early. Pick Draven/Lucian for early pressure, or Sivir to push them in. Don't let them scale."
//   },
//   {
//     id: "adc-synergy",
//     condition: "yourSupport === 'Lulu' && (enemyADC === 'Draven' || enemyADC === 'Lucian')",
//     text: "Lulu struggles into lane bullies. Play safe, scale up, and peel for your ADC in teamfights."
//   },
//   {
//     id: "support-pairing-morgana",
//     condition: "yourSupport === 'Morgana' && (enemySupport === 'Thresh' || enemySupport === 'Blitzcrank' || enemySupport === 'Pyke' || enemySupport === 'Nautilus')",
//     text: "Morgana's black shield counters hooks. Use it to enable your ADC to play aggressively and deny their pick potential."
//   },
//   {
//     id: "support-pairing-leona",
//     condition: "yourSupport === 'Leona' && enemySupport === 'Morgana'",
//     text: "Morgana counters Leona with black shield. Bait out the shield before engaging, or look for roams to other lanes."
//   },
//   {
//     id: "support-pairing-braum",
//     condition: "yourSupport === 'Braum' && (enemySupport === 'Thresh' || enemySupport === 'Blitzcrank' || enemySupport === 'Nautilus')",
//     text: "Braum's E can block hooks. Use it to protect your ADC and counter-engage with Q and R."
//   },
//   {
//     id: "support-pairing-janna",
//     condition: "yourSupport === 'Janna' && (enemySupport === 'Leona' || enemySupport === 'Nautilus' || enemySupport === 'Alistar')",
//     text: "Janna's Q and R counter engage supports. Cancel their engages and peel for your ADC."
//   }
// ];
// console.log(`Loaded ${championData.length} champions`);
// console.log(`Loaded ${draftRules.length} draft rules`);
