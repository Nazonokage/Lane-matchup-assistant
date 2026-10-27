// Compile source suggestions into reciprocal, role-scoped Almanac matchups.
// Existing authored interactions take precedence over external suggestions.
import fs from 'node:fs';
import { championGuides, gameOverrides } from '../src/data/championGuides.js';
import { laneInteractions } from '../src/data/strategy.js';
import { counterplayGuides } from '../src/data/counterplay.js';
import { flexMatchups } from '../src/data/flexMatchups.js';
const root = new URL('../src/data/', import.meta.url);
const read = file => JSON.parse(fs.readFileSync(new URL(file, root)));
const rosters = read('rosters.json');
const output = [], missing = [];
for (const game of ['pc', 'wr']) {
  const research = read(game === 'pc' ? 'pcMatchupResearch.json' : 'matchupResearch.json');
  const guides = Object.fromEntries(rosters[game].champions.map(name => [name, { ...championGuides[name], ...gameOverrides[game][name] }]));
  const pairs = new Map(), candidates = new Map();
  const key = (lane, a, b) => [lane, ...[a,b].sort()].join('/');
  const count = (lane, name, field) => [...pairs.values()].filter(p => p.lane === lane && p[field] === name).length;
  for (const p of laneInteractions.filter(p => p.games.includes(game))) pairs.set(key(p.lane, p.favored, p.challenged), p);
  for (const p of flexMatchups.filter(p => p.games.includes(game))) {
    const id = key(p.lane, p.favored, p.challenged);
    if (pairs.has(id)) throw new Error(`Flex matchup overlaps existing entry: ${game}/${id}`);
    const slug = name => name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    const entry = { ...p, games: [game], sources: [p.favored, p.challenged].map(name => game === 'pc' ? read('pcKitReferences.json')[name].source : `https://wildrift.leagueoflegends.com/en-us/champions/${slug(name)}/`) };
    pairs.set(id, entry);
    output.push(entry);
  }
  for (const page of research.champions) {
    if (!guides[page.name]) continue;
    for (const [lane, lists] of Object.entries(page.lanes)) {
      if (!guides[page.name].lanes.includes(lane)) continue;
      for (const direction of ['goodAgainst', 'badAgainst']) {
        for (const enemy of lists[direction]) {
          if (!guides[enemy]?.lanes.includes(lane) || enemy === page.name) continue;
          const favored = direction === 'goodAgainst' ? page.name : enemy;
          const challenged = direction === 'goodAgainst' ? enemy : page.name;
          const id = key(lane, favored, challenged);
          if (pairs.has(id)) continue;
          const candidate = candidates.get(id) || { lane, favored, challenged, sources: [], conflict: false };
          if (candidate.favored !== favored) candidate.conflict = true;
          else if (!candidate.sources.includes(page.source)) candidate.sources.push(page.source);
          candidates.set(id, candidate);
        }
      }
    }
  }
  const sorted = [...candidates.values()].filter(p => !p.conflict).sort((a,b) => b.sources.length - a.sources.length || key(a.lane,a.favored,a.challenged).localeCompare(key(b.lane,b.favored,b.challenged)));
  for (const pair of sorted) {
    if (count(pair.lane,pair.favored,'favored') >= 2 && count(pair.lane,pair.challenged,'challenged') >= 2) continue;
    const { lane, favored, challenged, sources } = pair;
    const entry = {
      games: [game], lane, favored, challenged,
      edge: `Against ${challenged}: ${counterplayGuides[challenged].counterplay} Your plan: ${guides[favored].plan}`,
      response: `Against ${favored}: ${counterplayGuides[favored].counterplay} Your risk: ${guides[challenged].risk}`,
      evidence: 'source-matchup', sources, reviewedAt: research.checkedAt,
    };
    pairs.set(key(lane,favored,challenged), entry);
    output.push(entry);
  }
  for (const [name, guide] of Object.entries(guides)) for (const lane of guide.lanes) {
    const good = count(lane,name,'favored'), bad = count(lane,name,'challenged');
    if (!good || !bad) missing.push({ game, name, lane, good, bad });
  }
}
if (missing.length) throw new Error(`Missing named matchups: ${JSON.stringify(missing)}`);
fs.writeFileSync(new URL('sourcedMatchups.json', root), JSON.stringify(output, null, 2) + '\n');
console.log(`Compiled ${output.length} sourced and flex-role interactions; every champion-role has both directions.`);
