import { LANE_CONFIG } from './constants.js';

// Describe the actual role and selected opponents without inventing matchup scores.
export function draftPickPlan(champ, draft, lane, byName) {
  const config = LANE_CONFIG[lane];
  const role = champ.matchupsByLane[lane];
  const opponent = byName(draft[config.directOpponent]);
  const partner = config.lanePartner ? byName(draft[config.lanePartner]) : null;
  const opportunity = role?.goodAgainst.find(entry => entry.name === opponent?.name);
  const pressure = role?.badAgainst.find(entry => entry.name === opponent?.name);
  return {
    approach: champ.tips,
    risk: champ.caution,
    lanePlan: role?.lanePlan,
    objective: role?.objectivePlan,
    purchases: role?.itemPlan,
    timing: champ.spikePlan,
    opponent: opponent ? {
      name: opponent.name,
      interaction: opportunity?.note || pressure?.note || null,
      counterplay: opponent.counterplay,
      track: opponent.keyWindow
    } : null,
    partner: partner ? { name: partner.name, plan: partner.tips } : null
  };
}
