// Validate the checked-in roster snapshot; does not invent or fetch new champions.
import fs from 'node:fs';
import { championGuides } from '../src/data/championGuides.js';
const rosters = JSON.parse(fs.readFileSync(new URL('../src/data/rosters.json', import.meta.url), 'utf8'));
for (const game of ['pc', 'wr']) {
  const names = rosters[game].champions;
  if (new Set(names).size !== names.length) throw new Error('Duplicate roster entry');
  for (const name of names) if (!championGuides[name]) throw new Error('Missing guide: ' + name);
  console.log(`${game}: ${names.length} champions in snapshot reviewed ${rosters.reviewedAt}. Review ${rosters[game].source} before editing rosters.json.`);
}
