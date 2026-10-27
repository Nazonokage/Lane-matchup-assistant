# Changelog

All notable changes to Lane Ledger are documented here.

---

## [Unreleased] — 2026-10-27

### Scalable fluid typography and font weights
- Implemented responsive fluid typography scale with `clamp()` CSS custom properties (`--text-2xs` through `--text-3xl`), ensuring typography scales smoothly between mobile viewports and large desktop monitors.
- Strengthened typography weights to a tactile medium base (`500`) and structured semi-bold anchors (`550`–`650`) across body text, badges, cards, inputs, and section kickers, improving visual presence and contrast on dark theme backgrounds without becoming heavy or harsh.
- Enabled antialiased subpixel text smoothing (`-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, and `text-rendering: optimizeLegibility`) for clean, crisp character rendering across high-DPI displays.
- Added balanced line wrapping (`text-wrap: pretty`) and refined typography styles for about sections, cards, and modal dialogs.

### Named champion matchups
- Filled both “Lane opportunities” and “Lane pressure to respect” for all 441 supported champion-role combinations: 173 PC champions across 240 roles and 142 Wild Rift champions across 201 roles.
- Added 1,209 source-suggested and authored flex-role interaction records. Combined with existing interactions, the dataset has 661 PC and 646 WR directional pairs; each pair produces an opportunity for one champion and a threat for the other.
- Saved separate WildRiftCounter and CounterStats research snapshots for WR and PC. Explicit ability-based flex-role entries cover secondary roles missing from source lists. Source suggestions retain general play notes and are labeled separately from authored kit interactions; coverage is not a claim that every matchup has individually researched mechanics.
- Preserved authored interaction priority, rejected contradictory external suggestions, and filtered by game roster and supported role. Builds compile checked-in snapshots without network access.
- Added checks for named coverage in both directions, reciprocity, duplicate/conflicting pairs, opponent roles, source-game isolation and source support for each imported direction. Named-matchup scoring retains its existing bounded contribution.

### Almanac and source links
- Added champion icons and an “Avoid vs” summary in the detail modal, with enemy-draft highlighting.
- Kept general champion risk and role guidance under “General pressure guidance,” beneath the named threats.
- Styled source anchors with teal text, borders, wrapping, spacing, hover/active states and visible keyboard focus. Added accessible labels identifying links that open a new tab.

### Development and handoff
- Set strict local development port `43187` and production-preview port `43188`, both bound to `127.0.0.1`. An occupied port now reports an error instead of silently changing the URL.
- Removed the unused engine argument that caused lint failure. Ignored temporary research output and local server logs in `.research/`.
- Updated `TODO.md` and added `REFACTORING.md` with prioritized follow-up work, data invariants and validation requirements.
- Validation: data tests and lint pass; browser smoke check confirmed page loading, champion detail and styled source links. Production builds still report the large JavaScript chunk warning; game-specific loading is tracked as follow-up work.

## [Unreleased] — 2026-10-26

### 🆕 New Files & Modules

| File | Purpose |
|------|---------|
| `src/lib/gameContext.js` | React context + `useEngine()` hook — wires the active game's engine to all components |
| `src/lib/suggestions.js` | Isolated scoring / suggestion helpers consumed by `useEngine()` |
| `src/lib/draftPickPlan.js` | Derives a plain-English pick plan (approach, risk, opponent matchup) for each suggestion |
| `src/lib/preferences.js` | Thin wrapper around `localStorage` for persisting user preferences |
| `src/components/ChampionModal.jsx` | Full-screen modal sheet for champion detail in the Almanac (replaces inline expansion) |
| `src/components/MetaPanel.jsx` | Displays patch / roster context beneath the header |
| `src/data/championGuides.js` | Editorial champion guide data (plan, risk, traits, per-game overrides) |
| `src/data/counterplay.js` | Champion counterplay notes keyed by name |
| `src/data/draftRules.js` | Draft rules rewritten as structured JS (replaces `draftRules.json`) |
| `src/data/draftInteractions.js` | Structured champion interaction pairs with game + lane tags |
| `src/data/draftProfiles.js` | Corrected trait overrides per champion |
| `src/data/roleDraftGuides.js` | Per-role draft guides: priorities, checklists, and opening execution notes |
| `src/data/strategy.js` | Centralised strategy metadata: lane plans, trait labels, item/spike plans, duo pairs, lane interactions |
| `src/data/meta.json` | Patch metadata (patch numbers, review timestamps, per-champion change notes) |
| `src/data/rosters.json` | Reviewed champion rosters for Wild Rift (`wr`) and PC (`pc`) |
| `src/data/pcKitReferences.json` | PC kit evidence sources used in build-time data generation |
| `src/data/README.md` | Documentation for the data layer |
| `public/robots.txt` | SEO — allows crawling of all public pages |
| `public/social-card.png` | Open Graph social share image |
| `brand-spec.md` | Brand / design spec document |
| `scripts/audit-data.mjs` | Audits champion guide coverage |
| `scripts/refresh-rosters.mjs` | Refreshes roster lists from upstream sources |
| `scripts/research-pc-kits.mjs` | Gathers PC kit reference URLs |
| `scripts/validate-data.mjs` | Validates `dataset.json` shape and required fields |
| `scripts/validate-sources.mjs` | Validates evidence sources referenced in the build |
| `src/data/archive/` | Archived legacy per-lane JSON files |

---

### 🗑️ Removed (Legacy Data Files)

The following per-lane JSON data files have been **deleted** and superseded by the new editorial JS data layer:

- `src/data/BrLane.json`
- `src/data/JglRole.json`
- `src/data/Midlane.json`
- `src/data/drLane.json`
- `src/data/suppRole.json`
- `src/data/draftRules.json`
- `src/data/otherinfo.json`

---

### ✨ Features & Improvements

#### Multi-Game Support
- Added a **game switcher** (Wild Rift / PC) in the app header via a `game-switch` button group.
- All engine functions are now scoped to the active game via `useEngine()` / `gameContext.js`.
- `App.jsx` now drives game state and passes the game ID down; subtitle and patch info update per game.

#### Draft Panel — Recommendations Overhaul
- **Removed the manual "Get Picks" reveal button** — recommendations now update automatically when the draft changes.
- Each suggestion card now shows a **pick preview** section with:
  - **Draft fit** / **Fit caution** summary sentence
  - **Your game plan** from `draftPickPlan`
  - **Against `<opponent>`** interaction or counterplay note
  - **Main risk** from warnings or the plan
  - A toggle button for full detailed advice
- Added a **"How fit points work"** `<details>` explanation beneath the count note.
- Added a **role draft guide** (`<details>` block) per lane showing priorities, checklist, and opening execution.
- Draft enemy/ally groups are now wrapped in a `.draft-teams` container for desktop two-column layout.
- Score label changed from `+N` to `+N fit` with an `aria-label` for screen readers.
- `RecommendationsPanel` uses `getRecommendationReport` (returns `{ picks, unassessed, total }`) instead of the old `getRecommendations` returning a plain array.
- Empty state copy improved: distinguishes "no evidence yet" from "nothing drafted."
- Added a disclaimer note: *"Suggestions target general ranked solo queue. Fit points reflect team needs, threats and conditional pairings—not live win rates or mastery."*

#### Almanac Panel — Grid & Modal Redesign
- Champion list replaced with a **2-column grid** (4-column on desktop ≥ 900 px) using `.almanac-grid` / `.almanac-cell`.
- Each cell shows the champion's **icon (48 px)**, name, and colour-coded role badge.
- Champion detail now opens in a **`ChampionModal`** bottom-sheet/dialog overlay instead of inline expansion.
- Added **staggered scroll-triggered animations** (`animate-on-scroll`) via `IntersectionObserver`; respects `prefers-reduced-motion`.
- New `AlmanacPanel` masthead with lane label, kicker, and live result count.
- Accessible: `aria-haspopup="dialog"`, `aria-expanded`, `aria-label` on all cells.
- Search `aria-label` added.

#### Engine (`src/lib/engine.js`) — Major Refactor
- Engine is now a **factory function** (`createEngine(data)`) returning all helpers, consumed via `useEngine()`.
- `getRecommendations` refactored into `getRecommendationReport` returning `{ picks, unassessed, total }`.
- `filterAlmanac` simplified with `normalize` helper; sorts alphabetically.
- `getContextualMatchups` now uses `LANE_CONFIG` to resolve the direct opponent and lane partner correctly, avoiding false positives from unrelated draft slots.
- Old exported standalone functions (`loadDraftFromStorage`, `saveDraftToStorage`, `getSubRoleFilters`, `compareByLanePriorityThenName`, etc.) consolidated or moved to `preferences.js` / `suggestions.js`.

#### Build Script (`scripts/build-data.mjs`) — Full Rewrite
- Now imports from JS editorial data modules (`championGuides`, `counterplay`, `draftRules`, `strategy`, etc.) instead of reading legacy JSON files.
- Builds per-game (`wr`, `pc`) champion datasets at build time, including:
  - Lane plans, item plans, spike plans
  - Per-lane `goodAgainst` / `badAgainst` / `synergies` from `laneInteractions` and `duoPairs`
  - Roster validation (no duplicates, all guides/counterplay present, valid lanes/traits)
- Runs `validate-sources.mjs` as part of the build.
- Outputs `dataset.json` with a multi-game shape.

#### Data Layer (`src/lib/mergeData.js`)
- Added `Top` → `Baron` mapping in `ROLE_TO_LANE` for PC champion compatibility.
- `normalizeChampion` now carries a `coverage` field defaulting to `"legacy"`.

#### UI Components
- **`ui.jsx`** — `RoleBadge` now accepts a `lane` prop to determine badge context.
- **`LaneChips.jsx`** — Minor prop/style updates.
- **`ChampionDetail.jsx`** — Updated to support new `matchupKnown`, `summary`, `threatPlans`, and `plan` props passed from the expanded recommendation.

#### Styling (`src/index.css`) — Significant additions
- New classes: `.almanac-masthead`, `.almanac-kicker`, `.almanac-masthead-row`, `.almanac-title`, `.almanac-grid`, `.almanac-cell`, `.almanac-cell-copy`, `.almanac-cell-name`, `.almanac-cell-role`, `.almanac-modal-*`, `.animate-on-scroll`, `@keyframes animationIn`.
- New layout classes: `.rec-grid`, `.draft-teams`, `.pick-preview`, `.rec-body`.
- Per-role badge colours: `.badge-adc`, `.badge-support`, `.badge-apc`, `.badge-mid`, `.badge-jungle`, `.badge-baron`.
- `.meta-panel`, `.coverage-note`, `.patch-note`, `.guide-sections`, `.guide-evidence`, `.site-info` added.
- Desktop responsive block (`min-width: 900px`) added: two-column draft/rec layouts, wider almanac grid, larger typography.
- Removed: `.btn-reveal` (replaced by auto-loading recommendations).

#### SEO / Meta (`index.html`)
- `<title>`, `<meta description>`, and Open Graph tags updated.
- `public/robots.txt` and `public/social-card.png` added.
- `sitemap.xml` updated.

---

### 📦 Dependencies (`package.json`)
- Minor additions (see `package.json` / `package-lock.json` for exact packages).

---

### 📝 Documentation
- `README.md` significantly trimmed and updated to reflect the current architecture.
- `src/data/README.md` added to document the data layer.
- `brand-spec.md` added at project root.
