# Lane Ledger

Offline bot lane draft companion for fast **ADC/APC** pick decisions during champ select.

Lane Ledger contains:
- **Almanac**: browse/search champions and read matchup notes
- **Draft Helper**: choose enemy bot lane + your support → get recommended carry picks with “why” + “watch out” explanations

## Features
- Works **offline** (plain HTML/CSS/JS, no build step)
- Text-only champion matchups (no images/portraits)
- Filters for role + playstyle in the Almanac
- Draft Helper live scoring based on your selections:
  - good matchups / bad matchups
  - synergy + avoid pairing logic (both directions)
  - support-vs-support lane signals
  - conditions (green/red) that affect the score
  - rule-based “active draft rules” triggered by enemy picks
- Saves your last draft selection using `localStorage`

## Project Structure
```
.
├── index.html   # UI shell + tabs
├── style.css    # Dark tactical styling
├── script.js    # Search, scoring, rendering, and draft helper logic
└── data.js      # Champion roster + draft rules data (text-heavy)
```

## How it works
- `data.js` defines:
  - `championData`: champion roster with matchup notes (good/bad, synergies/avoid, tips/caution, etc.)
  - `draftRules`: rule triggers that become “Active draft rules” when enemy picks match
- `script.js`:
  - filters champions for the Almanac
  - computes a score for each carry pick based on the current draft inputs
  - renders top recommendations (with reasons + warnings) and relevant almanac details

## Setup / Run
Open the project folder and run locally:
- Open `index.html` in your browser (no build required)

If your browser blocks `file://` behavior, use any static server (optional):
- Node: `npx serve .`
- Python: `python -m http.server 8000`

Then open the shown URL.

## Notes
- This project is intended for **bot lane** (carry/support/APC).
- Update matchups inside `data.js` as patches/meta change.

## License
Add your preferred license here (e.g. MIT).

