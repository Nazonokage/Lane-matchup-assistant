# Lane Ledger — Project Plan
*(working title, rename freely)*

An offline-first **bot lane** companion. Opens on your phone with no connection needed. Helps you quickly pick your ADC (or APC) during champ select based on the enemy bot lane and your own support.

---

## 1. Tech approach

- Plain HTML + external CSS + external JS — no build step, no framework, no CDN dependencies.
- Champion data lives in its own JS file, loaded via a normal `<script>` tag (not `fetch`), so it works over `file://` with zero network calls. **Important:** `fetch()`-ing a local `.json` file gets blocked by CORS on `file://` in most mobile browsers.
- `data.js` uses a clean JSON-shaped object literal (`const championData = [...]`) for easy editing/validation while staying compatible.
- No champion portraits/art. Text + role-colored badges only.

### File structure
```
lane-ledger/
├── index.html        UI shell, two tabs
├── style.css          all styling
├── data.js            champion roster (the only file that grows over time)
└── script.js          search, scoring, rendering logic
```

---

## 2. Data model

**Bot lane focus**: Full detailed entries for ADCs and Supports. APC/Mage entries are included but lighter.

One unified roster. Each champion has:

**ADC / APC example:**
```js
{
  name: "Caitlyn",
  roles: ["ADC"],
  playstyle: ["poke", "siege"],           // NEW — helps with rules & filtering
  goodAgainst: [ { name: "Vayne", note: "..." } ],
  badAgainst: [ { name: "Varus", note: "..." } ],
  synergies: ["Morgana", "Lux", "Thresh"],
  avoidSynergies: [ { name: "Alistar", note: "..." } ],
  caution: "Loses all early pressure if she falls behind on CS.",
  conditions: {
    green: ["You want to siege towers fast"],
    red: ["Enemy has heavy dive/gap closers"]
  }
}
```

**Support example:**
```js
{
  name: "Thresh",
  roles: ["Support"],
  archetype: "Hook",                      // Hook | Engage | Enchanter | Poke | Mage
  playstyle: ["engage"],                  // NEW
  goodAgainst: [ ... ],
  badAgainst: [ ... ],
  synergies: ["Draven", "Kalista", "Caitlyn"],
  caution: "..."
}
```

**Schema highlights**:
- `name`, `roles` (array)
- `playstyle` / `tags` (array) — e.g. `["hypercarry"]`, `["poke"]`, `["all-in"]`
- `archetype` (Support only)
- `goodAgainst` / `badAgainst` (array of `{name, note}`)
- `synergies` / `avoidSynergies`
- `caution`, `conditions` (optional)

**Cross-cutting Draft Rules** (simplified for v1):
```js
const draftRules = [
  {
    id: "draven-rule",
    condition: "enemyADC === 'Draven'",
    text: "Draven beats most marksmen early. Play safe unless on Caitlyn/Varus."
  },
  // more simple string or basic conditions...
]
```

**Scope notes**:
- Prioritize **ADC + Support** data completeness.
- Curated matchups only (from your cheat sheet + logical support entries).
- Meta is patch-dependent — update `data.js` as needed.

---

## 3. UI structure

### Tab 1 — Champ Almanac
- Live search + filter chips: All / ADC / Support (APC secondary)
- Tap champion → expanded card with all fields + relevant draft rules

### Tab 2 — Draft Helper
Three optional fields:
- Opponent Support
- Opponent ADC/APC
- Your Support

Live recommendations with simple scoring:
- + for direct counters / synergies
- − for avoidSynergies / bad archetype matchups
- Surface relevant draft rules

Each suggestion expands to:
- **Why pick this**
- **What to watch out for**

---

## 4. Visual direction
Dark tactical theme with gold/teal/red accents.

---

## 5. Build order
1. Author **full Support entries** (archetypes + key matchups/synergies) + finish ADC data from cheat sheet.
2. Add `playstyle` tags across the roster.
3. Define simple scoring weights for Draft Helper.
4. `data.js` — complete roster + draftRules.
5. `script.js` — core logic.
6. `index.html` + `style.css`.
7. Test on phone (whole folder transfer).
