import { DRAFT_KEYS, DRAFT_FIELD_DEFS, LANE_CONFIG } from './constants.js';
import { roleProfile } from '../data/draftProfiles.js';
import { draftRules } from '../data/draftRules.js';
import { draftInteractions } from '../data/draftInteractions.js';

const has = (champion, trait) => champion?.traits?.includes(trait) || false;
const damageDealer = champion => champion.suppliesCarryDamage;

export function draftTeams(draft, byName, lane) {
  const hidden = LANE_CONFIG[lane]?.hiddenAlly;
  const seen = new Set();
  const teams = { allies: [], enemies: [] };
  for (const key of DRAFT_KEYS) {
    if (key === hidden) continue;
    const champion = byName(draft[key]);
    if (!champion || seen.has(champion.name)) continue;
    seen.add(champion.name);
    const role = DRAFT_FIELD_DEFS[key].pool === 'carry' ? 'Dragon' : DRAFT_FIELD_DEFS[key].pool;
    teams[key.startsWith('ally') ? 'allies' : 'enemies'].push(roleProfile(champion, role));
  }
  return teams;
}

export function suggestChampion(champ, draft, lane, byName) {
  champ = roleProfile(champ, lane);
  const { allies, enemies } = draftTeams(draft, byName, lane);
  const cfg = LANE_CONFIG[lane];
  const slice = champ.matchupsByLane[lane];
  const signals = [];
  const add = (id, delta, label, text, evidence = 'Composition heuristic') => signals.push({ id, delta, label, text, evidence });
  const any = (list, trait) => list.some(c => has(c, trait));
  const count = (list, trait) => list.filter(c => has(c, trait)).length;
  const names = list => list.map(c => c.name).join(', ');
  const opponent = cfg.directOpponent ? byName(draft[cfg.directOpponent]) : null;
  const threatPlans = draftInteractions.filter(entry => entry.games.includes(champ.game) && entry.champion === champ.name && entry.lanes.includes(lane) && entry.slots.some(key => draft[key] === entry.enemy));
  // Multiple tools against different enemies are useful explanations, not a
  // stacking counter score. Award one bounded cross-role fit signal.
  if (threatPlans.length) add('cross-role-answer', 1, 'Specific answer to an enemy threat', threatPlans.map(p => `${p.enemy}: ${p.plan}`).join(' '), 'Editorial ability interactions; see sources below');
  if (opponent) {
    const favorable = slice?.goodAgainst.find(e => e.name === opponent.name);
    const difficult = slice?.badAgainst.find(e => e.name === opponent.name);
    // A conflict is not evidence for either direction. Never count the reverse entry twice.
    if (favorable && !difficult) add('lane-interaction', 1, 'Lane opportunity', favorable.note, 'Editorial lane interaction');
    if (difficult && !favorable) add('lane-interaction', -1, 'Lane pressure', difficult.note, 'Editorial lane interaction');
  }

  const partner = cfg.lanePartner ? byName(draft[cfg.lanePartner]) : null;
  const pairing = slice?.synergies.find(e => e.name === partner?.name);
  if (pairing) add('lane-partner', 2, `Pairing with ${partner.name}`, pairing.note, 'Editorial duo pairing');
  if (partner && !pairing) {
    const carry = lane === 'Dragon' ? champ : partner;
    const support = lane === 'Support' ? champ : partner;
    if (has(carry, 'sustained') && (has(support, 'peel') || has(support, 'shield'))) {
      add('lane-partner', 1, 'Protection for repeated damage', `${support.name} has protection tools that may give ${carry.name} more time to attack. Trade together; this does not establish a winning lane.`);
    } else if ((has(carry, 'early') || has(carry, 'dive')) && has(support, 'engage')) {
      add('lane-partner', 1, 'Shared engage window', `${support.name} can create an opening for ${carry.name}; check the wave, enemy cooldowns and follow-up distance first.`);
    }
  }

  const getSlot = key => {
    const c = byName(draft[key]);
    if (!c) return [];
    const pool = DRAFT_FIELD_DEFS[key].pool;
    return [roleProfile(c, pool === 'carry' ? 'Dragon' : pool)];
  };
  const scopes = { allies, enemies, direct: cfg.directOpponent ? getSlot(cfg.directOpponent) : [],
    otherEnemies: DRAFT_KEYS.filter(key => key.startsWith('enemy') && key !== cfg.directOpponent && !(['Mid', 'Baron'].includes(lane) && key === 'enemyJungle')).flatMap(getSlot),
    alliedJungle: getSlot('allyJungle'), enemyJungle: getSlot('enemyJungle'), alliedLanes: ['allyTop', 'allyMid', 'allyADC'].flatMap(getSlot),
    partner: cfg.lanePartner ? getSlot(cfg.lanePartner) : [],
    enemySupport: getSlot('enemySupport'), enemyBot: [...getSlot('enemyADC'), ...getSlot('enemySupport')] };
  // At most one positive and one negative bot-archetype signal. Avoid stacking
  // related labels into a fake overwhelming counter score.
  const usedBotDirections = new Set();
  const usedSoloDirections = new Set();
  let usedTeamThreat = false;
  for (const rule of draftRules) {
    if (!rule.lanes.includes(lane)) continue;
    if (!(rule.candidateAll || []).every(t => has(champ, t))) continue;
    if ((rule.candidateNone || []).some(t => has(champ, t))) continue;
    const targets = scopes[rule.scope].filter(c => rule.enemyAny.some(t => has(c, t)));
    if (targets.length < (rule.minimum || 1)) continue;
    if (rule.id.startsWith('team-threat-')) {
      if (usedTeamThreat) continue;
      usedTeamThreat = true;
    }
    // Related lane traits describe one opportunity, not several independent counters.
    if (rule.id.startsWith('solo-') && rule.scope === 'direct' && rule.delta !== 0) {
      if (usedSoloDirections.has(Math.sign(rule.delta))) continue;
      usedSoloDirections.add(Math.sign(rule.delta));
    }
    if (rule.id.startsWith('bot-') && rule.delta !== 0) {
      if (usedBotDirections.has(Math.sign(rule.delta))) continue;
      usedBotDirections.add(Math.sign(rule.delta));
    }
    add(rule.id, rule.delta, rule.label, rule.advice.replace('{targets}', names(targets)), 'Conditional kit guidance');
  }

  // Missing slots are unknown, not proof of a bad composition.
  if (allies.length >= 2 && !any(allies, 'frontline') && has(champ, 'frontline')) {
    add('frontline', 2, 'Adds a frontline', `No frontline is shown among ${names(allies)}. ${champ.name} can help hold space; teammates may still fill this role later.`);
  }
  const alliedDamage = allies.filter(damageDealer);
  if (alliedDamage.length >= 2 && damageDealer(champ)) {
    const allPhysical = alliedDamage.every(c => c.damage === 'physical');
    const allMagic = alliedDamage.every(c => c.damage === 'magic');
    if ((allPhysical && champ.damage === 'magic') || (allMagic && champ.damage === 'physical')) {
      add('damage-mix', 2, 'Diversifies damage', `The shown damage picks (${names(alliedDamage)}) lean ${allPhysical ? 'physical' : 'magic'}. ${champ.name} adds a different main damage type; builds still change the mix.`);
    }
  }
  if (allies.length >= 3) {
    if (!any(allies, 'engage') && !any(allies, 'pick') && (has(champ, 'engage') || has(champ, 'pick'))) add('initiation', 1, 'Adds fight setup', 'The shown allies have limited tagged engage or catch tools. Use this setup only when teammates can follow.');
    if (!any(allies, 'waveclear') && has(champ, 'waveclear')) add('waveclear', 1, 'Adds wave control', 'The shown allies have limited tagged wave clear. Clearing safely can create better resets and objective approaches.');
    if (!any(allies, 'sustained') && has(champ, 'sustained') && lane !== 'Support') add('sustained', 1, 'Adds sustained damage', 'The shown allies lean away from repeated damage. A safe attack or spell window helps with longer fights.');
  }

  const divers = enemies.filter(c => has(c, 'dive'));
  const vulnerableAlly = allies.find(c => has(c, 'immobile') && damageDealer(c));
  if (divers.length && vulnerableAlly && has(champ, 'peel')) add('protect-carry', 2, `Protects ${vulnerableAlly.name}`, `${names(divers)} can threaten the backline. Keep a defensive tool for their entry instead of spending everything to engage.`);
  if (divers.length >= 2 && has(champ, 'immobile')) {
    add('dive-risk', any(allies, 'peel') ? 0 : -2, 'Backline access risk', `${names(divers)} have dive tools. ${any(allies, 'peel') ? 'Allied peel is shown, but coordinate its timing.' : 'Peel is not shown yet; ask for protection and preserve your escape route.'}`);
  }
  if (count(enemies, 'frontline') >= 2 && has(champ, 'antiTank')) add('durable-targets', 2, 'Tools for durable targets', `Multiple enemy frontliners are shown (${names(enemies.filter(c => has(c, 'frontline')))}). Your kit can help in extended fights; penetration and safe uptime still matter.`);
  if (count(enemies, 'peel') >= 2 && champ.category === 'assassin') add('protected-targets', -2, 'Protected backline', `${names(enemies.filter(c => has(c, 'peel')))} have protection tools. Look for isolated targets or wait for those cooldowns instead of entering first.`);
  if (allies.length >= 2 && has(champ, 'scaling') && count(allies, 'scaling') >= 2) add('scaling-overlap', -1, 'Several picks need time', 'Your shown team already has multiple scaling plans. Agree on which early contests to trade rather than assuming every lane can move first.');

  // Specific cross-role mechanics are explicit and never inferred from a name in prose.
  if (champ.name === 'Yasuo' && !pairing && any(allies, 'knockup')) add('knockup-setup', 1, 'Ultimate setup', `Allied knockups (${names(allies.filter(c => has(c, 'knockup')))}) can create an ultimate window. Enter only if the landing position is safe.`);
  if (has(champ, 'split')) add('side-lane-plan', 0, 'Coordinate side pressure', 'Before splitting, check enemy positions and the next objective. Tell your team whether to wait, contest or trade.');
  const reasons = signals.filter(s => s.delta > 0);
  const warnings = signals.filter(s => s.delta <= 0);
  const score = signals.reduce((sum, signal) => sum + signal.delta, 0);
  return { score, reasons, warnings, signals, threatPlans, evidenceCount: signals.filter(s => s.delta !== 0).length,
    matchupKnown: Boolean(opponent && (slice?.goodAgainst.some(e => e.name === opponent.name) || slice?.badAgainst.some(e => e.name === opponent.name))),
    summary: `Based on ${allies.length} shown allies and ${enemies.length} shown enemies; missing picks remain unknown.` };
}
