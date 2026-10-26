import assert from 'node:assert/strict';
import fs from 'node:fs';
import { championGuides, gameOverrides } from '../src/data/championGuides.js';
import { counterplayGuides } from '../src/data/counterplay.js';
import { draftRules } from '../src/data/draftRules.js';
import { draftInteractions } from '../src/data/draftInteractions.js';
import { DRAFT_FIELD_DEFS } from '../src/lib/constants.js';
import { roleDraftGuides } from '../src/data/roleDraftGuides.js';
import { traitCorrections, supportEconomy } from '../src/data/draftProfiles.js';
import { traitLabels, lanePlans, duoPairs, laneInteractions } from '../src/data/strategy.js';
const rosters = JSON.parse(fs.readFileSync(new URL('../src/data/rosters.json', import.meta.url), 'utf8'));
const allNames = new Set([...rosters.pc.champions, ...rosters.wr.champions]);
const validTraits = traits => traits.every(t => Object.hasOwn(traitLabels, t));
assert.deepEqual(Object.keys(roleDraftGuides).sort(), Object.keys(lanePlans).sort());
for (const guide of Object.values(roleDraftGuides)) {
  assert(guide.title && guide.priorities && guide.checklist && guide.execution);
}
for (const [name, guide] of Object.entries(championGuides)) {
  assert(allNames.has(name), `Guide not in either roster: ${name}`);
  assert(['physical', 'magic', 'mixed'].includes(guide.damage), `Damage: ${name}`);
  assert(['mage', 'marksman', 'fighter', 'tank', 'support', 'assassin'].includes(guide.category));
  assert(guide.lanes.length && new Set(guide.lanes).size === guide.lanes.length);
  assert(guide.lanes.every(lane => lanePlans[lane]));
  assert(validTraits(guide.traits), `Unknown trait: ${name}`);
  assert.equal(new Set(guide.traits).size, guide.traits.length);
  assert(counterplayGuides[name], `Missing counterplay: ${name}`);
}
assert.deepEqual(Object.keys(counterplayGuides).sort(), [...allNames].sort());
for (const [game, overrides] of Object.entries(gameOverrides)) {
  for (const [name, change] of Object.entries(overrides)) {
    assert(rosters[game].champions.includes(name), `Unavailable override: ${game}/${name}`);
    if (change.lanes) assert(change.lanes.every(lane => lanePlans[lane]));
  }
}
for (const [name, change] of Object.entries(traitCorrections)) {
  assert(allNames.has(name), `Unknown trait correction: ${name}`);
  assert(validTraits([...(change.add || []), ...(change.remove || [])]));
}
assert(validTraits(supportEconomy.remove));
const ruleIds = new Set();
for (const rule of draftRules) {
  assert(!ruleIds.has(rule.id), `Duplicate rule: ${rule.id}`); ruleIds.add(rule.id);
  assert(rule.lanes.length && rule.lanes.every(l => lanePlans[l]));
  assert(['enemySupport', 'enemyBot', 'direct', 'partner', 'allies', 'enemies', 'alliedJungle', 'alliedLanes', 'enemyJungle', 'otherEnemies'].includes(rule.scope));
  assert(validTraits([...(rule.candidateAll || []), ...(rule.candidateNone || []), ...rule.enemyAny]));
  assert(rule.enemyAny.length && Number.isInteger(rule.delta) && Math.abs(rule.delta) <= 1);
  assert(!rule.minimum || (Number.isInteger(rule.minimum) && rule.minimum > 0));
  assert(rule.label && rule.advice.includes('{targets}'));
  assert(!Object.hasOwn(rule, 'condition'), 'No executable rule conditions');
}
const pairs = new Set();
for (const [carry, support, note] of duoPairs) {
  const key = `${carry}/${support}`;
  assert(!pairs.has(key), `Duplicate pairing: ${key}`); pairs.add(key);
  assert(championGuides[carry]?.lanes.includes('Dragon') && championGuides[support]?.lanes.includes('Support'), key);
  assert(note?.length > 20);
}
const interactions = new Set();
for (const plan of draftInteractions) {
  assert(!ruleIds.has(plan.id)); ruleIds.add(plan.id);
  assert(plan.slots.length && plan.slots.every(key => key.startsWith('enemy') && DRAFT_FIELD_DEFS[key]));
  assert(plan.plan && plan.response && plan.reviewedAt && plan.games.length && plan.lanes.length);
  assert(['ddragon.leagueoflegends.com', 'wildrift.leagueoflegends.com'].includes(new URL(plan.source).hostname));
  for (const game of plan.games) {
    assert(rosters[game].champions.includes(plan.champion) && rosters[game].champions.includes(plan.enemy));
    const guide = { ...championGuides[plan.champion], ...gameOverrides[game][plan.champion] };
    assert(plan.lanes.every(l => guide.lanes.includes(l)));
  }
}
for (const entry of laneInteractions) {
  assert(entry.edge && entry.response && entry.games.length);
  for (const game of entry.games) {
    assert(rosters[game]);
    for (const name of [entry.favored, entry.challenged]) {
      assert(rosters[game].champions.includes(name), `${game}: unavailable matchup ${name}`);
      const guide = { ...championGuides[name], ...gameOverrides[game][name] };
      assert(guide.lanes.includes(entry.lane), `${game}: wrong matchup role ${name}/${entry.lane}`);
    }
    const key = [game, entry.lane, ...[entry.favored, entry.challenged].sort()].join('/');
    assert(!interactions.has(key), `Duplicate/conflicting interaction: ${key}`); interactions.add(key);
  }
}
