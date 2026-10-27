/** Build the reviewed roster + editorial strategy bundle. No network needed. */
import fs from 'node:fs';
import './validate-sources.mjs';
import { championGuides, gameOverrides } from '../src/data/championGuides.js';
import { counterplayGuides } from '../src/data/counterplay.js';
import { correctedTraits } from '../src/data/draftProfiles.js';
import { draftRules } from '../src/data/draftRules.js';
import { draftInteractions } from '../src/data/draftInteractions.js';
import { strategyMeta, lanePlans, traitLabels, itemPlan, spikePlan, duoPairs, laneInteractions } from '../src/data/strategy.js';
const dir = new URL('../src/data/', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name, dir), 'utf8'));
const rosters = read('rosters.json');
const meta = read('meta.json');
const pcKitReferences = read('pcKitReferences.json');
const sourcedMatchups = read('sourcedMatchups.json');
const games = {};
for (const game of ['pc', 'wr']) {
  const allowed = new Set(rosters[game].champions);
  if (allowed.size !== rosters[game].champions.length) throw new Error('Duplicate roster entry: ' + game);
  const championData = [...allowed].sort((a,b) => a.localeCompare(b)).map(name => {
    const authored = championGuides[name];
    if (!authored) throw new Error('Missing guide: ' + name);
    if (!counterplayGuides[name]) throw new Error('Missing counterplay: ' + name);
    const guide = { ...authored, ...gameOverrides[game][name] };
    guide.traits = correctedTraits(name, guide.traits);
    if (guide.lanes.some(lane => !lanePlans[lane])) throw new Error('Unknown lane: ' + name);
    if (guide.traits.some(trait => !traitLabels[trait])) throw new Error('Unknown trait: ' + name);
    const roles = guide.lanes.map(lane => lane === 'Dragon' ? (guide.category === 'mage' ? 'APC' : 'ADC') : lane);
    const matchupsByLane = Object.fromEntries(guide.lanes.map(lane => {
      const goodAgainst = [], badAgainst = [], synergies = [];
      for (const interaction of [...laneInteractions, ...sourcedMatchups]) {
        if (!interaction.games.includes(game) || interaction.lane !== lane || !allowed.has(interaction.favored) || !allowed.has(interaction.challenged)) continue;
        const reference = interaction.sources?.[0] || (game === 'pc' ? pcKitReferences[interaction.favored]?.source : `https://wildrift.leagueoflegends.com/en-us/champions/${interaction.favored.toLowerCase()}/`);
        const attribution = { evidence: interaction.evidence || 'editorial-interaction', reference, sources: interaction.sources, reviewedAt: interaction.reviewedAt };
        if (interaction.favored === name) goodAgainst.push({ name: interaction.challenged, note: interaction.edge, ...attribution });
        if (interaction.challenged === name) badAgainst.push({ name: interaction.favored, note: interaction.response, ...attribution });
      }
      for (const [carry, support, note] of duoPairs) {
        if (!allowed.has(carry) || !allowed.has(support)) continue;
        if (lane === 'Dragon' && carry === name) synergies.push({ name: support, note, evidence: 'editorial-pairing' });
        if (lane === 'Support' && support === name) synergies.push({ name: carry, note, evidence: 'editorial-pairing' });
      }
      return [lane, { goodAgainst, badAgainst, synergies, avoidSynergies: [], conditions: { green: [], red: [] },
        lanePlan: lanePlans[lane].plan, objectivePlan: lanePlans[lane].objective, itemPlan: itemPlan(guide, lane),
        lanePressure: { risk: guide.risk, response: lanePlans[lane].plan },
        matchupCoverage: `${goodAgainst.length} named opportunities · ${badAgainst.length} named threats; source suggestions and editorial kit windows` }];
    }));
    const first = matchupsByLane[guide.lanes[0]];
    return { name, game, primaryRole: roles[0], roles, playableLanes: guide.lanes, secondaryRoles: guide.lanes.slice(1),
      category: guide.category, archetype: guide.category, traits: guide.traits, damage: guide.damage,
      playstyle: guide.traits.filter(t => t !== 'immobile').map(t => traitLabels[t]), strengths: [],
      tips: guide.plan, caution: guide.risk, spikePlan: spikePlan(guide, game),
      ...counterplayGuides[name], kitReference: game === 'pc' ? pcKitReferences[name] : null,
      coverage: 'editorial', guideLanes: guide.lanes, guideWrittenAt: strategyMeta.writtenAt,
      evidence: strategyMeta.basis, source: rosters[game].source, basicsSource: strategyMeta.references[game],
      patchNote: meta.games[game].changes[name] || '',
      matchupsByLane, goodAgainst: first.goodAgainst, badAgainst: first.badAgainst,
      synergies: first.synergies, avoidSynergies: [], conditions: first.conditions };
  });
  games[game] = { championData, draftRules, draftInteractions: draftInteractions.filter(p => p.games.includes(game)),
    otherInfo: { flexPicks: championData.filter(c => c.playableLanes.length > 1).map(c => ({name:c.name,lanes:c.playableLanes,note:'Confirm the assigned role; the guide changes with lane.'})),
      globalConditions: Object.entries(lanePlans).map(([lane, plan]) => ({id: 'plan-' + lane, lanes:[lane],text:plan.plan})) },
    ...meta.games[game], rosterSource: rosters[game].source, strategyMeta };
}
fs.writeFileSync(new URL('dataset.json', dir), JSON.stringify({ games, meta }));
for (const [game, data] of Object.entries(games)) console.log(game + ': ' + data.championData.length + ' editorial guides across all five roles');
