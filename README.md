# Lane Ledger

Offline **Wild Rift** draft companion — all 5 lanes, works on phone with no internet.

## How it works (flow)

```mermaid
graph TD
  A[Open app (index.html)] --> B{Choose tab}
  B -->|Almanac| C[Search champ / browse roles]
  B -->|Draft Helper| D[Fill in opponent picks + your support]

  D --> E[Matchups & synergies lookup]
  E --> F[Apply draft rules]
  F --> G[Score candidates]
  G --> H[Show top recommendations]
  H --> I[Expand “Why pick this” + “What to watch out for”]

  C --> J[Open champion card]
  J --> I
```

## Quick start

1. Open `index.html` in your browser (or copy the folder to your phone).
2. Use **Almanac** to browse champs, **Draft Helper** for live pick suggestions.

Data is already built in `data/bundle.js`. You only need to rebuild after editing JSON.

## Edit champion data

**Source of truth** — edit these, not `data.js` or `bundle.js`:

| File | Content |
|------|---------|
| `data/drLane.json` | Dragon lane — ADC + APC |
| `data/suppRole.json` | Supports |
| `data/Midlane.json` | Mid |
| `data/JglRole.json` | Jungle |
| `data/BrLane.json` | Baron |
| `data/draftRules.json` | Bot lane draft rules |
| `data/otherinfo.json` | Flex picks, global conditions, meta notes |

Then rebuild:

```bash
npm run build
# or: node scripts/build-data.js
```

## Project layout

```
├── index.html          # App shell
├── script.js           # UI + scoring
├── style.css
├── data/
│   ├── drLane.json     # ← edit bot carries here
│   ├── suppRole.json   # ← edit supports here
│   ├── …other lane JSON
│   └── bundle.js       # generated — app loads this
└── scripts/
    ├── build-data.js
    └── extract-bot-data.js   # optional legacy merge
```

## Flex champs (Akali, Yasuo, etc.)

Same champion in multiple lane files (e.g. Mid + Baron) merges at build into **one almanac card** with `matchupsByLane` — no duplicate entries in the app.

## Legacy `data.js`

`data.js` at the project root is **deprecated** (stub only). Full old export backed up at `data/_legacy-data.js.bak`. To merge anything still missing from that backup:

```bash
# temporarily restore backup as data.js, then:
node scripts/extract-bot-data.js
npm run build
```

## License

MIT or your choice.
