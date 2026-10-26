import { DRAFT_KEYS, LANE_CONFIG } from './constants.js';
import { suggestChampion, draftTeams } from './suggestions.js';

export function createEngine(dataset, game = 'wr') {
  const { championData, otherInfo } = dataset;
  const champions = new Map(championData.map(c => [c.name, c]));
  const byName = name => champions.get(name) || null;
  const normalizeEntry = entry => typeof entry === 'string' ? { name: entry, note: '' } : entry;
  const findMatch = (list, name) => (list || []).map(normalizeEntry).find(entry => entry.name === name) || null;
  const emptySlice = () => ({ goodAgainst: [], badAgainst: [], synergies: [], avoidSynergies: [], conditions: { green: [], red: [] } });
  // Never borrow a different lane's matchup list as a fallback.
  const getMatchups = (champ, lane) => champ.matchupsByLane?.[lane] || emptySlice();
  const withLaneMatchups = (champ, lane) => ({ ...champ, ...getMatchups(champ, lane) });
  const getChampionsByLane = lane => lane === 'All' ? [...championData] : championData.filter(c => c.playableLanes.includes(lane));
  const getPoolChampions = pool => getChampionsByLane(pool === 'carry' ? 'Dragon' : pool);
  const primaryRole = champ => champ.primaryRole;
  const getFlexLanes = (champ, lane) => champ.playableLanes.filter(value => value !== lane);
  const getPlaystyles = lane => [...new Set(getChampionsByLane(lane).flatMap(c => c.playstyle))].sort();
  const getDraftValues = draft => DRAFT_KEYS.map(key => draft[key]).filter(name => byName(name));
  const getDraftedNames = draft => new Set(getDraftValues(draft));
  const getDraftedNamesExcept = (draft, exceptKey) => new Set(DRAFT_KEYS.filter(key => key !== exceptKey).map(key => draft[key]).filter(name => byName(name)));
  const getFlexWarnings = draft => otherInfo.flexPicks.filter(pick => getDraftedNames(draft).has(pick.name));
  const getGlobalConditions = lane => otherInfo.globalConditions.filter(note => note.lanes.includes(lane));
  const getSubRoleFilters = lane => lane === 'Dragon' ? ['All', 'ADC', 'APC'] : ['All'];

  function getTriggeredRules(draft, lane) {
    const { allies, enemies } = draftTeams(draft, byName, lane);
    const notes = [];
    if (allies.length < 2) notes.push({ id: 'partial-draft', text: 'Few allies are shown. Team-needs bonuses wait for more picks; no missing role is assumed to be absent.' });
    if (enemies.length >= 2 && enemies.filter(c => c.traits.includes('dive')).length >= 2) notes.push({ id: 'enemy-dive', text: 'Multiple enemy picks can reach the backline. Plan vision, spacing and who will hold a defensive cooldown.' });
    if (allies.length >= 3 && !allies.some(c => c.traits.includes('frontline'))) notes.push({ id: 'frontline-open', text: 'No frontline is shown among the other allies. Consider adding one or agree on a ranged, disengage-focused plan.' });
    return notes;
  }
  // Team notes are informational. They are never blindly added to a champion's score.
  const getRulesForChampion = () => [];
  function scoreChampion(champ, draft, lane) {
    if (!LANE_CONFIG[lane] || !champ.guideLanes?.includes(lane)) return { score: 0, reasons: [], warnings: [], signals: [], evidenceCount: 0, matchupKnown: false };
    return suggestChampion(champ, draft, lane, byName);
  }
  function getRecommendationReport(draft, lane) {
    if (!LANE_CONFIG[lane]) return { picks: [], unassessed: 0, total: 0 };
    const visibleDraft = { ...draft, [LANE_CONFIG[lane].hiddenAlly]: '' };
    if (!getDraftValues(visibleDraft).length) return { picks: [], unassessed: 0, total: 0 };
    const drafted = getDraftedNames(visibleDraft);
    const eligible = getChampionsByLane(lane)
      .filter(champ => !drafted.has(champ.name) && champ.guideLanes.includes(lane))
      .map(champ => ({ champ, ...scoreChampion(champ, visibleDraft, lane) }));
    const assessed = eligible.filter(pick => pick.evidenceCount > 0);
    const picks = assessed
      .sort((a,b) => b.score - a.score || a.champ.name.localeCompare(b.champ.name))
      .slice(0,8);
    return { picks, total: eligible.length, unassessed: eligible.length - assessed.length };
  }
  const getRecommendations = (draft, lane) => getRecommendationReport(draft, lane).picks;
  function filterAlmanac({ activeLane, roleFilter, playstyleFilter, search }) {
    const normalize = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');
    const query = normalize(search.trim());
    return getChampionsByLane(activeLane)
      .filter(c => roleFilter === 'All' || c.roles.includes(roleFilter))
      .filter(c => playstyleFilter === 'All' || c.playstyle.includes(playstyleFilter))
      .filter(c => !query || normalize([c.name, c.category, c.damage, ...c.playstyle].join(' ')).includes(query))
      .sort((a,b) => a.name.localeCompare(b.name));
  }
  function getContextualMatchups(champ, draft, lane) {
    const slice = getMatchups(champ, lane);
    const cfg = LANE_CONFIG[lane];
    // Lane interactions concern the assigned opponent, not any champion mentioned in the draft.
    const enemyName = cfg?.directOpponent ? draft[cfg.directOpponent] : null;
    const partnerName = cfg?.lanePartner ? draft[cfg.lanePartner] : null;
    const pick = (list, name) => (list || []).filter(entry => entry.name === name);
    return { goodVsEnemy: pick(slice.goodAgainst, enemyName), badVsEnemy: pick(slice.badAgainst, enemyName),
      synergies: pick(slice.synergies, partnerName), avoidSynergies: pick(slice.avoidSynergies, partnerName) };
  }
  return { byName, normalizeEntry, findMatch, getMatchups, withLaneMatchups, getChampionsByLane,
    getPoolChampions, primaryRole, getFlexLanes, getPlaystyles, getDraftValues, getDraftedNames,
    getDraftedNamesExcept, getTriggeredRules, getRulesForChampion, getFlexWarnings, getGlobalConditions,
    scoreChampion, getRecommendations, getRecommendationReport, filterAlmanac, getSubRoleFilters, getContextualMatchups };
}
