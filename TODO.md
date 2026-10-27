# TODO

## Current handoff — 2026-10-27

Read [REFACTORING.md](./REFACTORING.md) before the next structural change. Preserve the design in [brand-spec.md](./brand-spec.md) and the data contract in [src/data/README.md](./src/data/README.md).

### Completed
- [x] Named opportunities and threats for all 441 supported champion-role combinations, with reciprocal entries and game/role filtering.
- [x] Separate WR and PC source snapshots, provenance labels, authored flex-role notes and offline compilation.
- [x] Keep general pressure guidance as supporting advice beneath named threats.
- [x] Style source links and add keyboard focus and new-tab accessibility labels.
- [x] Use fixed local ports: `43187` for development, `43188` for production preview.
- [x] Confirm the browser loads the app, opens champion details and displays the styled links.

### Next changes, in order
- [ ] **Content quality:** audit inherited ability claims and replace general source-suggested notes with individually researched matchup explanations. Start with Vex–Akali (dash triggers/shroud claims), Rammus–Bel'Veth (Royal Maelstrom/reflection claims), and platform-specific ability differences. Coverage tests do not establish mechanical correctness.
- [ ] **Research reliability:** add parser fixtures, explicit champion/URL aliases, incomplete-fetch safeguards and a reviewable conflict report. Recheck the PC Nunu & Willump snapshot, which currently has no directly parsed role list; its coverage comes from reciprocal entries.
- [ ] **Compiler cleanup:** extract pure parsing/selection helpers, cache kit references once and index pair counts. Preserve deterministic output and current precedence before changing selection policy.
- [ ] **Bundle size:** load only the selected game's data and engine; measure initial and game-switch load sizes. Do not hide the existing large-chunk warning by raising its limit.
- [ ] **UI refactoring:** extract matchup/source-link and pressure-summary components; centralize source labels and URLs. Check narrow screens, long lists, keyboard focus, modal scrolling and multiple-source wrapping.
- [ ] **Documentation accuracy:** separate roster, patch, source-check and editorial-review dates. Clarify that all roles have a shortlist while the full opponent matrix remains incomplete.
- [ ] Run `npm test`, `npm run lint`, `npm run build`, and `git diff --check`; use `npm run audit:data` after data changes. Record actual results in the changelog.

## UI & Layout Tuning
- [x] Remove images shown on `.detail-header`
- [x] Make image inside `.rec-head` bigger
- [x] Make almanac look similar to `.rec-head` (put icon in `.card-head`)
- [x] Keep Almanac grid clean and show threat/avoid champ icons inside champion modal
- [x] Build succeeded (`npm run build`)

---

## Counter-Pick & Strategy Data Updates (2026-10-26)

### ✅ Completed
- [x] **Mojibake fixes** — fixed `â€™` → `'` in `draftInteractions.js` (`janna-samira`, `poppy-tristana-wr`)
- [x] **Samira vs Janna (Support)** — added reciprocal cross-role counterplay in `draftInteractions.js` (`janna-samira`, `samira-janna`); added ability details for *Howling Gale*, *Monsoon*, and *Inferno Trigger*
- [x] **Samira vs Xayah (Dragon)** — added dual-platform PC & Wild Rift matchup coverage; updated `strategy.js` and `draftInteractions.js` with *Feather Storm* and *Bladecaller* vs *Inferno Trigger* and *Wild Rush*
- [x] **Dragon Lane counter matchups expanded**:
  - `Nilah vs Samira` (Jubilant Veil basic attack dodge & AOE reduction vs Inferno Trigger burst)
  - `Tristana vs Twitch` (Rocket Jump & Explosive Charge burst vs weak early poison)
  - `Lucian vs Ezreal` (Lightslinger bursts vs Mystic Shot poke; punishing Arcane Shift)
  - `Draven vs Kai'Sa` (Spinning Axe early dominance vs un-evolved Icathian Rain)
  - `Varus vs Draven` (Piercing Arrow & Chain of Corruption targeting axe landing markers)
  - `Sivir vs Caitlyn` (Enabled for both PC & Wild Rift)
- [x] **Support Lane counter matchups expanded**:
  - `Pyke vs Senna` (Bone Skewer & Phantom Undertow punishing Senna's low mobility and windups)
  - `Nautilus vs Pyke` (Staggering Blow roots & Dredge Line stopping grey health regen)
  - `Thresh vs Leona` (Flay interrupting Zenith Blade mid-dash)
  - `Leona vs Sona` (Zenith Blade & Shield of Daybreak all-in vs squishy enchanter)
  - Dual-platform PC & WR enabled for `Janna vs Alistar`, `Braum vs Blitzcrank`, `Janna vs Rell`, `Morgana vs Nautilus`
- [x] **Baron / Top Lane counter matchups expanded**:
  - `Malphite vs Tryndamere` (Ground Slam 50% attack speed reduction & Seismic Shard kite)
  - `Renekton vs Riven` (Ruthless Predator point-blank stun vs Broken Wings mobility)
  - `Gnar vs Darius` (Boomerang Throw & Hyper kiting outside Apprehend range)
  - Dual-platform PC & WR enabled for `Jax vs Irelia` and `Jax vs Tryndamere`
- [x] **Mid Lane counter matchups expanded**:
  - `Kassadin vs LeBlanc` (Void Stone magic reduction & Null Sphere shield vs Distortion dive)
  - `Kassadin vs Katarina` (Null Sphere channel cancel on Death Lotus & Riftwalk chase)
  - `Vex vs Akali` (Doom 'n Gloom fear triggering on Five Point Strike / Shuriken Flip)
  - Dual-platform PC & WR enabled for `Galio vs Katarina`
- [x] **Jungle Lane counter matchups expanded**:
  - `Rammus vs Bel'Veth` (Defensive Ball Curl & Frenzying Taunt reflecting Royal Maelstrom attack speed)
- [x] **Cross-role draft interactions added**:
  - `caitlyn-vayne-dragon` (650 attack range & Yordle Snap Traps zoning Vayne)
  - `draven-jinx-dragon` (early axe burst vs Jinx scaling)
  - `lulu-zed-mid` (Whimsy polymorph shutting down Death Mark dive)
  - `braum-lucian-bot` (Unbreakable absorbing The Culling)
  - `morgana-blitz-bot` (Black Shield blocking Rocket Grab)
- [x] **Dataset regenerated & validated** (`npm run test` passed with full reciprocity check)

---

### 📋 Next Priorities
- [ ] Verify current official availability and unfinished kit notes for `Locke`, `Zaahen`, `Norra`, and `Yunara`; do not assume they are fake or remove them based on the historical prompt.
- [ ] Expand remaining PC-only mid matchups if applicable to Wild Rift roster
