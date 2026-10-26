# Lane Ledger

A free League of Legends PC and Wild Rift roster browser and editorial draft companion.
Production: https://lane-matchup-assistant.vercel.app/

## Data coverage (reviewed 2026-10-25)

- PC: 173 champions; patch 26.21, including the October 22 Varus hotfix.
- Wild Rift: 142 champions; patch 7.3b.
- All 315 game profiles (174 unique champions) have authored gameplay and counterplay advice, a key cooldown/resource to track, role plans, purchase priorities and objective guidance.
- 40 selected matchup interactions explain both sides; 39 duo plans are filtered by game availability. Thirteen dated cross-role records cover specific enemy threats. All five roles have a visible draft plan and checklist, supported by 40 conditional draft rules. This is limited editorial coverage, not an exhaustive counter matrix or statistical tier list. Unlisted matchups remain unknown.
- Riot PC kit links cover all 173 PC champions; 146 include a short attributed enemy tip. These PC references never appear as Wild Rift evidence.
- Suggestions work across all five roles and explain each point from shown allies, enemies and explicit interactions. Missing picks remain unknown; ties are alphabetical. Scores are editorial heuristics, never win-rate estimates.
- Twelve conditional draft rules consider the enemy duo, recovery, disengage, wave control and jungle pressure. Role-specific profiles prevent support economy from being mistaken for farming-carry damage. Picks without any scored evidence are left unranked.
- Suggestions appear automatically below team selections and refresh when the draft or role changes; no reveal button is required.
- Legacy 7.1g data and free-text draft rules are no longer loaded into the application.
- Game selection and drafts persist separately. The Almanac's All champions view searches across lanes.

## Development

Use a Node version supported by Vite 8 (Node 22.12+ or current Node 24).

    npm install
    npm run dev
    npm test
    npm run lint
    npm run build

Vercel build command: npm run build. Output directory: dist. No server or API keys required.

## Updating data

Edit source files under src/data, then run npm run build:data. Do not edit generated dataset.json.

- rosters.json: official roster snapshot and source URLs, separate for each game.
- championGuides.js: champion plans, risks, structured traits and supported roles, with explicit game overrides. Role assignments are editorial, not pick-rate claims.
- counterplay.js: how to play against every champion and the cooldown/resource to watch.
- draftProfiles.js and draftRules.js: active scoring corrections, role context and declarative draft rules. See src/data/README.md for their contract and audit findings.
- strategy.js: role plans, purchase/spike guidance, explicit duo pairings and named interactions. Named interactions are strategic inference from kits, not measured counter rankings.
- pcKitReferences.json: attributed Riot PC references. scripts/research-pc-kits.mjs refreshes these from the pinned Data Dragon version; review the version and date when updating.
- meta.json: game-specific patch IDs, reviewed dates, selected changes, sources, methodology and data priorities.
- archive/: nine historical JSON sources, preserved for reference and excluded from the app.

scripts/refresh-rosters.mjs validates the checked-in October 25 snapshot; it does not fetch live data or regenerate rosters from old lane files. Review Riot's roster pages before editing rosters.json. Builds validate active source schemas and fail on invalid references. npm test adds behavioral regression checks; npm run audit:data prints named matchup coverage separately from profile counts.

Do not convert a buff into an automatic tier or invent win rates. Future matchup samples should include game, patch, rank, region, role, sample size, source and review date. Expand named interactions and verify exact item timings separately for each game before adding them. Shared guides describe broad kit decisions; they do not assert identical abilities or balance across games.

## Search visibility and deployment

The homepage includes a descriptive title, canonical production URL, Open Graph/Twitter cards, WebSite/WebApplication JSON-LD, and visible explanatory HTML outside the JavaScript app. robots.txt points to sitemap.xml. Existing Google verification files and meta token are preserved. social-card.png is a 1200 × 630 branded preview.

After deploying:

1. Verify that /, /robots.txt, /sitemap.xml and /social-card.png return successfully on the production domain.
2. In Google Search Console, use the existing verification setup and submit https://lane-matchup-assistant.vercel.app/sitemap.xml.
3. Inspect the homepage URL and request indexing. Review its rendered HTML and structured data.
4. Keep sitemap lastmod accurate when publishing substantive content changes.

Search engines decide when to crawl and rank; metadata does not guarantee placement. This change does not submit Search Console requests or deploy the site. Individual champion cards are not separate indexable pages yet; curated game-specific champion guide pages would be a useful next SEO step.
