# Instructions for the next refactoring pass

This is a handoff plan, not authorization to rewrite unrelated features. Follow the user's current request and keep structural changes separate from research/content corrections where practical.

## Start from the current behavior

1. Read `TODO.md`, `CHANGELOG.md`, `brand-spec.md` and `src/data/README.md`. Inspect the working tree before editing and preserve existing user changes.
2. Run the existing checks and record the baseline. The current dataset covers 173 PC and 142 WR champions, with both named directions in all 441 supported champion-role combinations. These are a shortlist of suggestions, not every possible opponent or a mechanically reviewed explanation for every pair.
3. Treat `PROMPT.md` as historical research ideas. Its champion-availability assumptions and suggested ability names require fresh verification; they are not authoritative facts or instructions to remove champions.

## Keep these contracts intact

- Keep PC and Wild Rift rosters, role overrides, sources and advice isolated. A champion existing in both games does not prove identical mechanics or matchup direction.
- Named opponents must support the same selected role. Never fill a missing lane with another lane's list or choose arbitrary opponents to satisfy coverage.
- Preserve reciprocal opportunity/threat entries, uniqueness, no self-matchups, and no simultaneous opposing direction for the same game/role/pair.
- Existing `strategy.js` entries take precedence. Explicit flex entries must not overlap them. External suggestions that disagree are excluded. Propose any precedence or selection-policy change explicitly and test it separately.
- Preserve the difference between `source-matchup`, `editorial-flex` and existing authored interactions. General champion notes must not be presented as individually verified pair mechanics. Sources establish different kinds of evidence; none implies a guaranteed win.
- Keep the existing bounded named-lane score contribution. More sources or more listed opponents must not multiply its weight.
- `sourcedMatchups.json` and `dataset.json` are generated outputs. Edit their inputs, run `npm run build:data`, and include the regenerated outputs. Normal builds must work offline; network refreshes stay explicit.
- Preserve the established palette, spacing, responsive layout and visible focus styles. Keep named matchups prominent and generic guidance secondary.

## Recommended sequence

### 1. Make research imports reviewable

Extract WR and PC parsers into pure functions. Add small HTML fixtures covering role-heading variants, encoded punctuation, missing captions, champion aliases, empty pages, failures and reversed direction. Store champion URLs explicitly where slug conventions differ. Ensure the PC import takes the intended shortlists rather than treating the entire ordered table as both strong and weak opponents.

Write refreshed snapshots only after validating collection completeness. Preserve the last good snapshot on failure. Produce a concise report of missing pages, rejected names, role exclusions and contradictory directions for editorial review; do not silently relax checks to make coverage pass.

### 2. Simplify the matchup compiler without changing results

Separate source loading, candidate normalization, conflict resolution, selection and output. Load `pcKitReferences.json` once instead of reading it for every flex source. Maintain indexed counts by game, role, champion and direction rather than repeatedly scanning all pairs.

Verify byte-stable generated output for a structural-only refactor and rerun compilation to check determinism. Add focused cases for authored precedence, conflicts, reciprocity, role isolation and an uncovered role. Keep build failure on missing coverage; do not introduce fake fallback opponents.

### 3. Reduce initial download size

Investigate splitting generated data and engine initialization by game. Measure the production bundle before and after, and verify switching games resets the appropriate UI state while preserving the current behavior. Keep source snapshots and temporary research files out of the browser bundle. Do not raise `chunkSizeWarningLimit` to conceal the issue.

### 4. Separate UI responsibilities

Extract a reusable source-link group and matchup item from `ui.jsx`, and isolate the pressure summary from `ChampionDetail.jsx`. Keep descriptive accessible link labels, `rel="noreferrer"`, new-tab behavior, wrapping and visible focus. Preserve modal close/Escape handling, focus return and body-scroll restoration. Visually check a small screen and a wide screen with a long matchup list and two source links.

## Content corrections are a separate track

Check current official game-specific ability descriptions before rewriting tactical advice. Prioritize the inherited Vex–Akali and Rammus–Bel'Veth claims noted in `TODO.md`, then unfinished counterplay entries and shared-game assumptions. Keep source dates separate from editorial review dates. Do not change a roster solely because a third-party page is missing or an old prompt calls a name unreleased.

## Completion checklist

- Run `npm test`, `npm run lint`, `npm run build` and `git diff --check`. Run `npm run audit:data` when changing data or its compilation.
- For UI changes, open the app, switch games/roles, open a champion and inspect both named lists, source links, scrolling and keyboard navigation. Record checks that could not be completed.
- Start development with `npm run dev` at `http://127.0.0.1:43187/`. Production preview uses `npm run preview` at port `43188` after a build. Strict ports intentionally fail if occupied; identify the owning process before stopping anything.
- Update `CHANGELOG.md` with the final behavior and validation, and `TODO.md` with actual remaining work. Keep temporary logs under ignored `.research/`. Inspect the staged diff before committing; push only when authorized.
