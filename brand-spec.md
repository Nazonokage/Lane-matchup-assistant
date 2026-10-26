# Lane Ledger desktop extension

Mode: Preserve. Audience: ranked solo-queue players comparing draft choices on a laptop or desktop.

The approved layout uses an 1180px maximum width, two team-selection columns and two recommendation columns at 900px and above. Smaller screens retain the single-column flow. Expanded advice spans both columns. The information hierarchy remains role → champions → suggested picks → supporting guidance.

Design dials: visual variance 2/10, motion 1/10, information density 7/10, asset dependence 6/10, brand fidelity 9/10. This is a quiet comparison tool at laptop viewing distance; extra width serves readable choices rather than decoration.

Existing assets: `public/think_fam_think.png` (logo), existing champion artwork loaded by `ChampionIcon`. Preserve the system-font stack, 10px card radius, existing flat surfaces and focus outlines. No new motion, fonts, icons or shadows.

Palette: background #0d1117, panel #161b22, card #1c2129, text #e6edf3, border #30363d, teal #3fb9b0, gold #d4a853. Role and status colors remain as defined in `src/index.css`. Spacing: 4px base; desktop gutters 28px, grid gaps 24px and card interiors 20px. Body copy grows to 15px inside desktop recommendations; dropdown text is 16px.

The supplied Garden skill's relative redesign and calibration reference files were not present next to the document. Existing repository styles and the user's approved layout provide the design context.
