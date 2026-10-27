# Lane Ledger — Data Research & Improvement Prompt
> Drop this file into Codex (or any agent with web access). Its job is to search the web for real, current champion ability data and apply it to the `/src/data` files listed below.

---

## Your Mission

You are improving the counter-pick and draft-helper data for **Lane Ledger**, a League of Legends (PC) and Wild Rift draft companion. The app shows players ability-based matchup advice — no stats, no win rates, no tier lists. Everything is grounded in **how champion kits interact**.

**Priority order:**
1. 🌐 **Search online first** — verify every champion's current kit from official sources before writing anything
2. ✍️ **Write or rewrite** entries using what you found
3. 📋 **Output ready-to-paste** JS/JSON for each file

---

## Official Sources to Search (in priority order)

| Source | URL pattern | Use for |
|---|---|---|
| LoL champion page | `https://www.leagueoflegends.com/en-us/champions/<name>/` | Ability overview, role |
| Wild Rift champion page | `https://wildrift.leagueoflegends.com/en-us/champions/<name>/` | WR-specific kit |
| DDragon JSON (PC) | `https://ddragon.leagueoflegends.com/cdn/16.21.1/data/en_US/champion/<Name>.json` | Exact ability names |
| LoL wiki | `https://leagueoflegends.fandom.com/wiki/<Champion_name>` | Detailed mechanics, interactions |
| WR wiki | `https://wildrift.fandom.com/wiki/<Champion_name>` | WR-specific mechanics |

**Search before writing.** If a champion name doesn't appear on any of these pages, flag them as unverified — do not fabricate kit details.

---

## Files to Update

### File 1 — `src/data/counterplay.js`

**What it is:** One entry per champion. Tells a player how to play *against* that champion.

**Format (pipe-delimited rows inside a template literal):**
```
ChampionName|<counterplay text>|<keyWindow text>
```
- `counterplay` — 1–2 sentences: general strategy for facing this champion (positioning, trade windows, team coordination)
- `keyWindow` — 1 sentence: the specific ability name or state to watch, and when to act

**Quality rules:**
- ✅ Must name at least one **specific ability** (use the real ability name, e.g. "Bandage Toss", "Unstoppable Force", "Unraveled Earth")
- ✅ Must give an **actionable instruction** ("reserve control for...", "punish after...", "avoid standing in...")
- ❌ No cooldown numbers (they change with patch/rank/haste)
- ❌ No "their main ability" or "their control" — name it
- ❌ No placeholder text like "confirm the current kit" or "check the kit before assuming"

**Champions to research and fix/add (search each one online first):**

#### 🔴 Remove or fully rewrite — these entries contain placeholder disclaimers or are unverified names:

| Champion | Current problem | Action |
|---|---|---|
| `Locke` | keyWindow: *"confirm the current kit details before planning a precise burst threshold"* — explicit placeholder | Search `https://www.leagueoflegends.com/en-us/champions/` for "Locke". If not found, **remove** from this file AND from `rosters.json` (pc list). If found, rewrite with real abilities. |
| `Zaahen` | keyWindow: *"check the current kit before assuming a low-health finish is safe"* — explicit placeholder | Same: search first. Remove from file and `rosters.json` if not a real released champion. |
| `Norra` | Lore character (Yuumi's owner), never a playable champion — entry is fully generic with no real ability names | Search `https://wildrift.leagueoflegends.com/en-us/champions/` for "Norra". If not playable, **remove** from this file AND from `rosters.json` (wr list). |
| `Yunara` | Name not on current LoL/WR roster; both fields are generic ("enhanced form" — no ability named) | Search both game champion lists. Remove or rewrite with verified kit. |

#### 🟡 Rewrite — real champions but advice is too generic (no ability names):

| Champion | What to search | Abilities to reference |
|---|---|---|
| `Briar` | `https://www.leagueoflegends.com/en-us/champions/briar/` | Head Rush (W), Snack Attack frenzy passive, Chum the Waters (R) |
| `Smolder` | `https://www.leagueoflegends.com/en-us/champions/smolder/` | Dragon Practice (passive stacks), Achooo! (W breathe), Flap, Flap, Flap (E) |
| `Mel` | `https://www.leagueoflegends.com/en-us/champions/mel/` | Her reflective/reactive defensive spell — search and name it exactly |
| `Yunara` (if real) | Search WR + PC sites | Search and name all abilities before writing |

---

### File 2 — `src/data/draftInteractions.js`

**What it is:** Specific interactions between a champion you're considering picking (`champion`) and an enemy already in the draft (`enemy`). Shows how a specific ability of yours addresses a specific threat.

**Format:**
```js
{ id: 'champion-enemy-lane-game', games: ['pc'] or ['wr'] or ['pc','wr'],
  champion: 'ChampionName', lanes: ['Lane'], enemy: 'EnemyName', slots: ['enemyRole'],
  plan: '2–3 sentences from the champion player perspective, naming a specific ability.',
  response: '2–3 sentences: what the enemy can do to reduce this advantage.',
  source: '<DDragon or wildrift URL for the champion>' }
```

**Valid lanes:** `Baron`, `Jungle`, `Mid`, `Dragon`, `Support`
**Valid slots:** `enemyTop`, `enemyJungle`, `enemyMid`, `enemyADC`, `enemySupport`

#### 🔴 MISSING — Dragon lane has zero entries. Research and add at least 6:

Search each matchup on LoL wiki / WR wiki to verify the kit interaction exists, then write the entry.

| Suggested pair | Game | Search URL |
|---|---|---|
| Draven vs Jinx | pc + wr | `https://www.leagueoflegends.com/en-us/champions/draven/` |
| Caitlyn vs Vayne | pc + wr | `https://www.leagueoflegends.com/en-us/champions/caitlyn/` |
| Kai'Sa vs Xayah | pc | `https://www.leagueoflegends.com/en-us/champions/kaisa/` |
| Miss Fortune vs Ezreal | pc + wr | `https://www.leagueoflegends.com/en-us/champions/missfortune/` |
| Twitch vs Caitlyn | pc | `https://www.leagueoflegends.com/en-us/champions/twitch/` |
| Xayah vs Samira | pc + wr | `https://www.leagueoflegends.com/en-us/champions/xayah/` |
| Jinx vs Miss Fortune | pc + wr | `https://www.leagueoflegends.com/en-us/champions/jinx/` |
| Sivir vs Vayne | pc + wr | `https://www.leagueoflegends.com/en-us/champions/sivir/` |

For each: name the **specific ability** that creates the advantage (e.g. "Spinning Axes" for Draven, "Spell Shield" for Sivir, "Tumble invisibility" for Vayne).

#### 🟡 Fix encoding — replace `â€™` with `'` in these two entries:
- `janna-samira` — `Samiraâ€™s` → `Samira's`
- `poppy-tristana-wr` — `Tristanaâ€™s` → `Tristana's`

#### 🟡 Rewrite generic entries — search the abilities, then rewrite with specifics:

| ID | Champion | Enemy | What's wrong | Search |
|---|---|---|---|---|
| `malphite-jinx-wr` | Malphite | Jinx | Plan/response name no Malphite abilities | `https://wildrift.leagueoflegends.com/en-us/champions/malphite/` |
| `rammus-jinx-wr` | Rammus | Jinx | Response is "a defensive cooldown..." — no ability named | `https://wildrift.leagueoflegends.com/en-us/champions/rammus/` |
| `poppy-tristana-wr` | Poppy | Tristana | Response reads like a disclaimer | `https://wildrift.leagueoflegends.com/en-us/champions/poppy/` |

---

### File 3 — `src/data/strategy.js` — `laneInteractions` array

**What it is:** 40 lane-specific interactions from the favored champion's perspective. Used for draft scoring.

**Format:**
```js
{ games: ['pc','wr'], lane: 'Lane',
  favored: 'Champion', challenged: 'Champion',
  edge: '2–3 sentences: why favored wins this matchup (name the ability)',
  response: '2–3 sentences: how challenged can reduce the disadvantage' }
```

**Tasks:**
1. **Review all 40 existing entries** — flag any where `edge` or `response` doesn't name a specific ability, then rewrite
2. **Add at least 4 new Dragon lane entries** from the matchups you researched above for `draftInteractions.js` (the same research covers both files)
3. **Add at least 2 new Support lane entries** — good candidates:
   - Lulu vs Leona (pc + wr) — Whimsy/Help, Pix vs Zenith Blade/Solar Flare
   - Thresh vs Blitzcrank (pc + wr) — Death Sentence vs Rocket Grab hook trading
   - Soraka vs Pyke (pc + wr) — Equinox silence vs Ghostwater Dive roam

---

### File 4 — `src/data/championGuides.js`

**What it is:** Per-champion draft plan and risk for the person *playing* that champion.

**Format (pipe-delimited, 7 fields):**
```
Name|lanes(B/J/M/D/S)|damage|category|traits|plan|risk
```
- `plan` — 1–2 sentences: the champion's primary game plan (what to do)
- `risk` — 1 sentence: what punishes this champion if you play it wrong

**Task — expand terse entries (under 15 words in plan or risk):**

For each champion below, search their kit online, then rewrite with more specific ability references:

| Champion | Field(s) to expand | Search |
|---|---|---|
| `Zaahen` | both plan + risk | Search LoL champ list — if not found, remove entry |
| `Mel` | risk | `https://www.leagueoflegends.com/en-us/champions/mel/` |
| `Zoe` | risk | `https://www.leagueoflegends.com/en-us/champions/zoe/` |
| `Ivern` | risk | `https://www.leagueoflegends.com/en-us/champions/ivern/` |
| `Briar` | plan | `https://www.leagueoflegends.com/en-us/champions/briar/` |
| `Smolder` | plan + risk | `https://www.leagueoflegends.com/en-us/champions/smolder/` |

---

### File 5 — `src/data/rosters.json` (only if champions are removed)

If you confirm that `Locke`, `Zaahen`, `Norra`, or `Yunara` are **not real released champions**, remove them from:
- `rosters.json` → `pc.champions` array (for Locke, Zaahen, Yunara)
- `rosters.json` → `wr.champions` array (for Norra, Yunara)

Also remove their entries from `counterplay.js` and `championGuides.js`.

---

## Writing Rules (apply to all files)

| Rule | Detail |
|---|---|
| ✅ Name abilities | Use the exact ability name — "Bandage Toss", "Rocket Grab", "Spell Shield" — not "his stun" or "her hook" |
| ✅ Actionable verbs | "Reserve X for Y", "Place Z across", "Trade after", "Punish when" |
| ✅ Both sides | Every entry needs the advantage AND the counter/caveat |
| ✅ 2–3 sentences per field | Enough to be useful, not a wall of text |
| ❌ No cooldown numbers | Haste, rank and patch change them |
| ❌ No win-rate claims | Never say "X counters Y hard" or "X is a strong pick into Y" |
| ❌ No cross-platform assumptions | If PC and WR kits differ, split into separate entries with `games: ['pc']` vs `games: ['wr']` |
| ❌ No fabricated kit details | If you can't find the ability name online, say so — don't guess |

---

## Output Format

Group everything by file. For each change output the **complete replacement** ready to paste:

### counterplay.js changes
```
ChampionName|rewritten counterplay text|rewritten keyWindow text
```
(One row per champion, same format as the file)

### draftInteractions.js new/fixed entries
```js
{ id: '...', games: [...], champion: '...', lanes: [...], enemy: '...', slots: [...],
  plan: '...', response: '...', source: '...' },
```

### strategy.js new/fixed entries
```js
{ games: [...], lane: '...', favored: '...', challenged: '...', edge: '...', response: '...' },
```

### championGuides.js changes
```
Name|lanes|damage|category|traits|plan|risk
```

### rosters.json removals (if any)
List the champion names to remove and from which game array.

### Summary table
| File | Action | Champion/Entry | Change |
|---|---|---|---|

---

## Verification Checklist Before Submitting

- [ ] Every ability name you used appears on the official champion page or wiki
- [ ] No entry says "confirm kit" or "check the kit" or similar hedging
- [ ] Dragon lane now has ≥ 6 entries in `draftInteractions.js`
- [ ] Dragon lane has ≥ 4 entries in `strategy.js` laneInteractions
- [ ] Encoding fixed: no `â€™` in any entry
- [ ] Removed champs (if any) are deleted from all three files (rosters, guides, counterplay)
- [ ] All new entries follow the 2–3 sentence rule and name abilities explicitly
