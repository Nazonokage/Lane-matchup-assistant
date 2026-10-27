import assert from 'node:assert/strict';
import fs from 'node:fs';
import { clearRetiredPreferences, retiredPreferenceKeys } from '../src/lib/preferences.js';
import { createEngine } from '../src/lib/engine.js';
import { draftPickPlan } from '../src/lib/draftPickPlan.js';
import { EMPTY_DRAFT, LANES, LANE_CONFIG } from '../src/lib/constants.js';

const read = file => JSON.parse(fs.readFileSync(new URL(file, import.meta.url), 'utf8'));
const { games } = read('../src/data/dataset.json');
const rosters = read('../src/data/rosters.json');
const cache = new Map([...retiredPreferenceKeys.map(key => [key, 'old draft']), ['unrelated', 'keep']]);
clearRetiredPreferences({ removeItem: key => cache.delete(key) });
assert.deepEqual([...cache], [['unrelated', 'keep']]);
assert.doesNotThrow(() => clearRetiredPreferences({ removeItem() { throw new Error('blocked'); } }));
for (const game of ['pc', 'wr']) {
  const data = games[game];
  const engine = createEngine(data, game);
  assert.deepEqual(data.championData.map(c => c.name).sort(), [...rosters[game].champions].sort());
  assert.equal(new Set(data.championData.map(c => c.name)).size, data.championData.length);
  const available = new Set(data.championData.map(c => c.name));
  for (const champion of data.championData) {
    assert.equal(champion.coverage, 'editorial');
    for (const field of ['tips', 'caution', 'counterplay', 'keyWindow', 'spikePlan', 'evidence']) assert(champion[field]?.length > 20, `${game}: missing ${field} for ${champion.name}`);
    if (game === 'pc') {
      assert(champion.kitReference?.source.startsWith('https://ddragon.leagueoflegends.com/'));
      assert((champion.kitReference.officialEnemyTip || '').split(/\s+/).length <= 22);
    } else assert.equal(champion.kitReference, null);
    assert(champion.playableLanes.length, `${champion.name} needs a lane`);
    assert(champion.playableLanes.every(lane => LANES.includes(lane)));
    for (const record of [champion, ...Object.values(champion.matchupsByLane)]) {
      for (const key of ['goodAgainst', 'badAgainst', 'synergies', 'avoidSynergies']) {
        assert.equal(new Set((record[key] || []).map(e => e.name)).size, (record[key] || []).length, 'No repeated matchup entries');
        for (const entry of record[key] || []) assert(available.has(typeof entry === 'string' ? entry : entry.name), `${game}: invalid ${key} entry`);
      }
    }
    for (const lane of champion.playableLanes) {
      const slice = champion.matchupsByLane[lane];
      assert(slice.lanePlan && slice.itemPlan && slice.objectivePlan);
      assert(slice.goodAgainst.length > 0, `${game}: missing named opportunities for ${champion.name}/${lane}`);
      assert(slice.badAgainst.length > 0, `${game}: missing named threats for ${champion.name}/${lane}`);
      assert(slice.lanePressure?.risk?.length > 20, `${game}: missing lane pressure for ${champion.name}/${lane}`);
      assert(slice.lanePressure?.response?.length > 20, `${game}: missing pressure response for ${champion.name}/${lane}`);
      assert.equal(engine.getMatchups(champion, lane).lanePressure, slice.lanePressure);
      for (const entry of slice.goodAgainst) {
        assert(engine.byName(entry.name).playableLanes.includes(lane), `${game}: opponent outside ${lane}`);
        assert(engine.getMatchups(engine.byName(entry.name), lane).badAgainst.some(e => e.name === champion.name), `${champion.name}/${entry.name}: reciprocal matchup`);
        assert(!slice.badAgainst.some(e => e.name === entry.name));
      }
      for (const entry of slice.badAgainst) {
        assert(engine.byName(entry.name).playableLanes.includes(lane), `${game}: threat outside ${lane}`);
        assert(engine.getMatchups(engine.byName(entry.name), lane).goodAgainst.some(e => e.name === champion.name), `${champion.name}/${entry.name}: reciprocal threat`);
      }
    }
  }
  assert.equal(engine.filterAlmanac({ activeLane: 'All', roleFilter: 'All', playstyleFilter: 'All', search: '' }).length, data.championData.length);
  assert.equal(engine.getRecommendations(EMPTY_DRAFT, 'Dragon').length, 0);
  const draft = { ...EMPTY_DRAFT, enemyADC: 'Caitlyn', enemyJungle: 'Vi', allySupport: 'Lulu', allyTop: 'Darius', allyMid: 'Zed' };
  for (const lane of LANES) {
    assert(engine.getRecommendations(draft, lane).length > 0, `${game}: recommendations for ${lane}`);
    for (const pick of engine.getRecommendations(draft, lane)) {
      assert(available.has(pick.champ.name));
      assert.notEqual(pick.champ.coverage, 'roster-only');
      assert(!Object.entries(draft).filter(([key]) => key !== LANE_CONFIG[lane].hiddenAlly).some(([,name]) => name === pick.champ.name));
      assert(pick.evidenceCount > 0, 'Never rank alphabetically without evidence');
      assert(Number.isFinite(pick.score));
      assert.equal(pick.score, pick.signals.reduce((sum, s) => sum + s.delta, 0));
      assert(pick.warnings.every(s => s.delta <= 0));
      assert(pick.reasons.every(s => s.delta > 0));
      assert.equal(new Set(pick.signals.map(s => s.id)).size, pick.signals.length);
    }
  }
}
const pc = createEngine(games.pc, 'pc');
const wr = createEngine(games.wr, 'wr');
for (const engine of [pc, wr]) {
  for (const lane of ['Baron', 'Jungle']) {
    for (const draft of [{ enemyMid: 'Lux' }, { enemyADC: 'Miss Fortune' }, { enemyJungle: 'Vi' }]) {
      const picks = engine.getRecommendations({ ...EMPTY_DRAFT, ...draft }, lane);
      assert(picks.some(p => p.score > 0), `${lane}: partial draft must offer supported choices`);
      for (const pick of picks) {
        assert(pick.signals.filter(s => s.id.startsWith('team-threat-')).length <= 1);
        if (!draft[LANE_CONFIG[lane].directOpponent]) assert(!pick.matchupKnown);
      }
    }
  }
  assert.equal(engine.getRecommendations({ ...EMPTY_DRAFT, allyTop: 'Lux' }, 'Baron').length, 0, 'Hidden own slot is not a threat');
}
for (const engine of [pc, wr]) {
  for (const [name, lane, slot, enemy] of [
    ['Poppy', 'Baron', 'enemyTop', 'Irelia'],
    ['Poppy', 'Jungle', 'enemyJungle', 'Lee Sin'],
    ['Ahri', 'Mid', 'enemyMid', 'Irelia'],
    ['Lulu', 'Support', 'enemySupport', 'Leona'],
    ['Jinx', 'Dragon', 'enemyADC', 'Caitlyn']
  ]) {
    const champ = engine.byName(name);
    const plan = draftPickPlan(champ, { ...EMPTY_DRAFT, [slot]: enemy }, lane, engine.byName);
    assert.equal(plan.opponent.name, enemy);
    assert.equal(plan.opponent.counterplay, engine.byName(enemy).counterplay);
    assert.equal(plan.lanePlan, champ.matchupsByLane[lane].lanePlan);
    assert(plan.approach && plan.risk && plan.objective && plan.purchases && plan.timing);
    assert.equal(draftPickPlan(champ, EMPTY_DRAFT, lane, engine.byName).opponent, null);
  }
  assert.equal(draftPickPlan(engine.byName('Ahri'), { ...EMPTY_DRAFT, enemyTop: 'Irelia' }, 'Mid', engine.byName).opponent, null);
}
assert(pc.byName('Aphelios'));
assert.equal(wr.byName('Aphelios'), null);
assert(wr.byName('Norra'));
assert.equal(pc.byName('Norra'), null);
assert(wr.byName('Hwei') && wr.byName('Nocturne') && wr.byName('Maokai'));
const recs = pc.getRecommendations({ ...EMPTY_DRAFT, allySupport: 'Lulu' }, 'Dragon');
assert(recs.some(r => r.champ.name === 'Jinx' && r.score > 0));
const score = (name, draft, lane = 'Dragon') => pc.scoreChampion(pc.byName(name), { ...EMPTY_DRAFT, ...draft }, lane);
assert.equal(score('Jinx', { allySupport: 'Lulu' }).signals.filter(s => s.id === 'lane-partner').length, 1);
assert.equal(score('Caitlyn', { enemyADC: 'Vayne' }).signals.find(s => s.id === 'lane-interaction').delta, 1);
assert.equal(score('Caitlyn', { allyTop: 'Vayne' }).matchupKnown, false);
assert.equal(score('Caitlyn', { enemyTop: 'Vayne' }).matchupKnown, false);
assert.equal(score('Jinx', { enemySupport: 'Lulu' }).signals.some(s => s.id === 'lane-partner'), false);
assert.deepEqual(pc.getMatchups(pc.byName('Caitlyn'), 'Mid').goodAgainst, []);
assert.equal(score('Caitlyn', { enemyADC: 'Vayne' }, 'Mid').score, 0);
assert.equal(pc.getRecommendations({ ...EMPTY_DRAFT, allyADC: 'Jinx' }, 'Dragon').length, 0);
assert(score('Lux', { allyTop: 'Darius', allyADC: 'Jinx' }, 'Mid').signals.some(s => s.id === 'damage-mix'));
assert(!score('Nautilus', { allyADC: 'Jinx' }, 'Support').signals.some(s => s.id === 'frontline'));
assert(score('Nautilus', { allyADC: 'Jinx', allyMid: 'Lux' }, 'Support').signals.some(s => s.id === 'frontline'));
assert(score('Jinx', { enemyMid: 'Zed', enemyJungle: 'Vi' }).signals.some(s => s.id === 'dive-risk' && s.delta < 0));
assert(score('Lulu', { allyADC: 'Jinx', enemyJungle: 'Vi' }, 'Support').signals.some(s => s.id === 'protect-carry'));
assert.equal(score('Rammus', { enemyJungle: 'Master Yi' }, 'Jungle').matchupKnown, true);
assert(!score('Yasuo', { allyJungle: 'Amumu' }, 'Mid').signals.some(s => s.id === 'knockup-setup'));
assert(score('Yasuo', { allyJungle: 'Diana' }, 'Mid').signals.some(s => s.id === 'knockup-setup'));
assert(!score('Yasuo', { allySupport: 'Alistar' }).signals.some(s => s.id === 'knockup-setup'), 'Explicit pairing already includes this setup');
assert(score('Jinx', { enemySupport: 'Blitzcrank' }).signals.some(s => s.id === 'bot-catch-risk'));
assert(!score('Jinx', { allySupport: 'Blitzcrank' }).signals.some(s => s.id === 'bot-catch-risk'));
assert(score('Ezreal', { enemySupport: 'Leona' }).signals.some(s => s.id === 'bot-mobility'));
assert(score('Soraka', { enemyADC: 'Caitlyn', enemySupport: 'Lux' }, 'Support').signals.some(s => s.id === 'bot-poke-recovery'));
assert(!score('Lux', { allyADC: 'Jinx', allySupport: 'Senna' }, 'Mid').signals.some(s => s.id === 'damage-mix'), 'Support Senna is not a second farming physical carry');
assert(!score('Brand', { allyADC: 'Jinx', allyMid: 'Zed' }, 'Support').signals.some(s => s.id === 'damage-mix'), 'Support Brand is not a farming AP carry');
assert.equal(pc.byName('Corki').damage, 'physical');
assert.equal(wr.byName('Corki').damage, 'mixed');
assert(score('Braum', { enemyADC: 'Miss Fortune' }, 'Support').threatPlans.some(p => p.id === 'braum-mf'));
assert.equal(score('Braum', { allyADC: 'Miss Fortune' }, 'Support').threatPlans.length, 0);
assert.equal(score('Braum', { enemyMid: 'Miss Fortune' }, 'Support').threatPlans.length, 0);
assert.equal(wr.scoreChampion(wr.byName('Braum'), { ...EMPTY_DRAFT, enemyADC: 'Miss Fortune' }, 'Support').threatPlans.length, 0, 'PC interaction is not WR evidence');
assert(wr.scoreChampion(wr.byName('Poppy'), { ...EMPTY_DRAFT, enemyADC: 'Tristana' }, 'Support').threatPlans.some(p => p.id === 'poppy-tristana-wr'));
assert.equal(score('Lissandra', { enemyMid: 'Katarina' }, 'Mid').matchupKnown, true);
assert.equal(score('Taliyah', { enemyJungle: 'Lee Sin' }, 'Jungle').matchupKnown, true);
for (const [candidate, enemy, lane, slot] of [
  ['Shen', 'Tryndamere', 'Baron', 'enemyTop'],
  ['Jax', 'Warwick', 'Baron', 'enemyTop'],
  ['Gragas', 'Jax', 'Baron', 'enemyTop'],
  ['Olaf', 'Rammus', 'Jungle', 'enemyJungle'],
  ['Olaf', 'Amumu', 'Jungle', 'enemyJungle'],
  ['Poppy', 'Xin Zhao', 'Jungle', 'enemyJungle'],
  ['Gragas', 'Katarina', 'Mid', 'enemyMid'],
  ['Ahri', 'Irelia', 'Mid', 'enemyMid'],
  ['Veigar', 'Ahri', 'Mid', 'enemyMid']
]) {
  assert(score(candidate, { [slot]: enemy }, lane).matchupKnown, `${candidate}/${enemy}: named role interaction`);
  assert(score(enemy, { [slot]: candidate }, lane).signals.some(s => s.id === 'lane-interaction' && s.delta === -1));
}
assert.equal(wr.scoreChampion(wr.byName('Olaf'), { ...EMPTY_DRAFT, enemyJungle: 'Amumu' }, 'Jungle').matchupKnown, false, 'Do not transfer PC Olaf research to WR');
assert(wr.scoreChampion(wr.byName('Ahri'), { ...EMPTY_DRAFT, enemyMid: 'Irelia' }, 'Mid').matchupKnown);
const unknown = pc.getRecommendationReport({ ...EMPTY_DRAFT, enemyTop: 'Garen' }, 'Mid');
for (const engine of [pc, wr]) {
  for (const [lane, slot] of [['Mid', 'enemyMid'], ['Baron', 'enemyTop'], ['Jungle', 'enemyJungle']]) {
    for (const enemy of engine.getChampionsByLane(lane)) {
      const picks = engine.getRecommendations({ ...EMPTY_DRAFT, [slot]: enemy.name }, lane);
      assert(picks.some(p => p.score > 0), `${lane} against ${enemy.name}: no positive conditional options`);
      for (const pick of picks) assert(pick.signals.filter(s => s.id.startsWith('solo-') && !s.id.startsWith('solo-jungle-') && s.delta > 0).length <= 1);
    }
  }
  const laneDraft = { ...EMPTY_DRAFT, enemyMid: 'Lux' };
  const fullerDraft = { ...laneDraft, enemyJungle: 'Vi' };
  const before = engine.getRecommendations(laneDraft, 'Mid');
  const after = engine.getRecommendations(fullerDraft, 'Mid');
  assert.notDeepEqual(before.map(p => [p.champ.name, p.score]), after.map(p => [p.champ.name, p.score]));
  const ahriBefore = engine.scoreChampion(engine.byName('Ahri'), laneDraft, 'Mid');
  const ahriAfter = engine.scoreChampion(engine.byName('Ahri'), fullerDraft, 'Mid');
  assert(ahriAfter.score > ahriBefore.score);
  assert(ahriAfter.signals.some(s => s.id === 'solo-jungle-escape' && s.text.includes('Vi')));
  assert(!engine.scoreChampion(engine.byName('Ahri'), { ...laneDraft, allyJungle: 'Vi' }, 'Mid').signals.some(s => s.id === 'solo-jungle-escape'));
}
for (const engine of [pc, wr]) {
  for (const [lane, draft, name, rule] of [
    ['Baron', { enemyTop: 'Irelia' }, 'Poppy', 'solo-space-melee'],
    ['Mid', { allyJungle: 'Lee Sin' }, 'Ahri', 'mid-jungle-setup'],
    ['Jungle', { allyMid: 'Ahri' }, 'Lee Sin', 'jungle-followup'],
    ['Support', { enemySupport: 'Leona' }, 'Janna', 'bot-disengage']
  ]) {
    const result = engine.scoreChampion(engine.byName(name), { ...EMPTY_DRAFT, ...draft }, lane);
    assert(result.signals.some(s => s.id === rule), `${lane}/${name}: missing role-specific advice`);
    assert(engine.getRecommendationReport({ ...EMPTY_DRAFT, ...draft }, lane).picks.length, `${lane}: sparse draft should produce supported suggestions`);
  }
  assert(engine.scoreChampion(engine.byName('Poppy'), { ...EMPTY_DRAFT, enemyMid: 'Irelia' }, 'Jungle').threatPlans.length);
  assert.equal(engine.scoreChampion(engine.byName('Poppy'), { ...EMPTY_DRAFT, allyMid: 'Irelia' }, 'Jungle').threatPlans.length, 0);
}
assert(score('Taliyah', { enemyJungle: 'Lee Sin' }, 'Mid').threatPlans.length);
assert(!score('Ahri', { enemyJungle: 'Lee Sin' }, 'Mid').signals.some(s => s.id === 'mid-jungle-setup'));
assert(wr.scoreChampion(wr.byName('Lissandra'), { ...EMPTY_DRAFT, enemyADC: 'Samira' }, 'Mid').threatPlans.length);
assert(unknown.picks.every(p => !p.matchupKnown));
for (const pick of pc.getRecommendations({ ...EMPTY_DRAFT, enemyADC: 'Caitlyn', enemySupport: 'Lux', allySupport: 'Lulu' }, 'Dragon')) {
  assert(pick.signals.filter(s => s.id.startsWith('bot-') && s.delta > 0).length <= 1);
  assert(pick.signals.filter(s => s.id.startsWith('bot-') && s.delta < 0).length <= 1);
}
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
assert(html.includes('https://lane-matchup-assistant.vercel.app/'));
assert(html.includes('League of Legends &amp; Wild Rift') || html.includes('League of Legends & Wild Rift'));
const structuredData = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(structuredData['@graph'][1].url, 'https://lane-matchup-assistant.vercel.app/');
assert(fs.existsSync(new URL('../public/social-card.png', import.meta.url)));
console.log('Passed: complete guides, kit attribution, role coverage, reciprocal matchups, score explanations, game isolation, draft cleanup and SEO metadata.');
