import fs from 'node:fs';
import { draftRules } from '../src/data/draftRules.js';
const { games } = JSON.parse(fs.readFileSync(new URL('../src/data/dataset.json', import.meta.url), 'utf8'));
console.log('Data coverage: profile presence is NOT named matchup evidence.');
for (const [game, data] of Object.entries(games)) {
  console.log(`\n${game}: ${data.championData.length} profiles, ${draftRules.length} conditional rules`);
  for (const lane of ['Dragon', 'Support', 'Mid', 'Jungle', 'Baron']) {
    const profiles = data.championData.filter(c => c.playableLanes.includes(lane));
    const named = profiles.filter(c => c.matchupsByLane[lane].goodAgainst.length + c.matchupsByLane[lane].badAgainst.length);
    const pairs = profiles.reduce((sum,c) => sum + c.matchupsByLane[lane].synergies.length, 0);
    console.log(`${lane}: ${profiles.length} profiles; ${named.length} with named interactions; ${pairs} partner plans; ${profiles.length - named.length} without named matchup evidence`);
  }
}
console.log('\nHistorical sources: 9 JSON files in src/data/archive; excluded from build.');
const archive = new URL('../src/data/archive/', import.meta.url);
for (const file of fs.readdirSync(archive).filter(f => f.endsWith('.json'))) {
  const value = JSON.parse(fs.readFileSync(new URL(file, archive), 'utf8'));
  const profiles = Array.isArray(value) ? value : Array.isArray(value.champions) ? value.champions : Object.values(value.champions || {});
  const rules = [...(value.rules || []), ...(value.draftRules || [])];
  let references = 0;
  const walk = node => {
    if (!node || typeof node !== 'object') return;
    for (const [key, child] of Object.entries(node)) {
      if (['goodAgainst', 'badAgainst', 'synergies', 'avoidSynergies'].includes(key) && Array.isArray(child)) references += child.length;
      walk(child);
    }
  };
  walk(value);
  console.log(`${file}: ${profiles.length} profiles, ${rules.length} legacy rules, ${references} matchup/pairing entries (unreviewed historical claims)`);
}
