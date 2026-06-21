import { championData, draftRules, otherInfo } from "./data.js";
import { POOL_TO_LANE } from "./mergeData.js";
import {
  DRAFT_KEYS,
  EMPTY_DRAFT,
  LANE_CONFIG,
  SCORE
} from "./constants.js";

const championByName = new Map(championData.map((c) => [c.name, c]));

export function byName(name) {
  return championByName.get(name) || null;
}

export function normalizeEntry(entry) {
  if (typeof entry === "string") return { name: entry, note: "" };
  return entry;
}

export function findMatch(list, target) {
  if (!list || !target) return null;
  return list.map(normalizeEntry).find((e) => e.name === target) || null;
}

export function getMatchups(champ, lane) {
  const slice = champ.matchupsByLane?.[lane];
  if (slice) {
    return {
      goodAgainst: slice.goodAgainst || [],
      badAgainst: slice.badAgainst || [],
      conditions: slice.conditions || { green: [], red: [] }
    };
  }
  return {
    goodAgainst: champ.goodAgainst || [],
    badAgainst: champ.badAgainst || [],
    conditions: champ.conditions || { green: [], red: [] }
  };
}

export function withLaneMatchups(champ, lane) {
  const m = getMatchups(champ, lane);
  return { ...champ, goodAgainst: m.goodAgainst, badAgainst: m.badAgainst, conditions: m.conditions };
}

const POOL_CHAMPIONS = Object.fromEntries(
  ["Baron", "Jungle", "Mid", "Support", "carry"].map((pool) => [pool, null])
);

function buildPoolChampions(pool) {
  if (pool === "carry") {
    return championData
      .filter((c) => c.roles?.includes("ADC") || c.roles?.includes("APC"))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  const lane = POOL_TO_LANE[pool] || pool;
  return championData
    .filter((c) => c.playableLanes?.includes(lane))
    .sort((a, b) => a.name.localeCompare(b.name));
}

for (const pool of Object.keys(POOL_CHAMPIONS)) {
  POOL_CHAMPIONS[pool] = buildPoolChampions(pool);
}

const championsByLane = Object.fromEntries(
  ["Dragon", "Support", "Mid", "Jungle", "Baron"].map((lane) => [
    lane,
    championData
      .filter((c) => c.playableLanes?.includes(lane))
      .sort((a, b) => a.name.localeCompare(b.name))
  ])
);

export function getChampionsByLane(lane) {
  return championsByLane[lane] || [];
}

export function getPoolChampions(pool) {
  return POOL_CHAMPIONS[pool] || buildPoolChampions(pool);
}

export function primaryRole(champ) {
  if (champ.roles?.includes("ADC")) return "ADC";
  if (champ.roles?.includes("APC")) return "APC";
  if (champ.roles?.includes("Support")) return "Support";
  if (champ.playableLanes?.includes("Mid")) return "Mid";
  if (champ.playableLanes?.includes("Jungle")) return "Jungle";
  if (champ.playableLanes?.includes("Baron")) return "Baron";
  return champ.roles?.[0] || "ADC";
}

export function getFlexLanes(champ, activeLane) {
  return (champ.playableLanes || []).filter((l) => l !== activeLane);
}

export function getPlaystyles(activeLane) {
  const set = new Set();
  getChampionsByLane(activeLane).forEach((c) => (c.playstyle || []).forEach((p) => set.add(p)));
  return [...set].sort();
}

export function getDraftValues(draft) {
  return Object.values(draft).filter(Boolean);
}

export function getDraftedNames(draft) {
  return new Set(getDraftValues(draft));
}

export function getDraftedNamesExcept(draft, exceptKey) {
  const taken = new Set();
  DRAFT_KEYS.forEach((k) => {
    if (k !== exceptKey && draft[k]) taken.add(draft[k]);
  });
  return taken;
}

function compileRuleCondition(condition) {
  try {
    return Function(
      "enemyTop", "enemyJungle", "enemyMid", "enemyADC", "enemySupport",
      "allyTop", "allyJungle", "allyMid", "allyADC", "allySupport", "enemyRole",
      `return ${condition}`
    );
  } catch {
    return null;
  }
}

const compiledRules = draftRules.map((rule) => ({
  ...rule,
  evaluate: compileRuleCondition(rule.condition)
}));

function runRule(rule, ctx) {
  if (!rule.evaluate) return false;
  try {
    return rule.evaluate(
      ctx.enemyTop || "", ctx.enemyJungle || "", ctx.enemyMid || "",
      ctx.enemyADC || "", ctx.enemySupport || "",
      ctx.allyTop || "", ctx.allyJungle || "", ctx.allyMid || "",
      ctx.allyADC || "", ctx.allySupport || "", ctx.enemyRole || ""
    );
  } catch {
    return false;
  }
}

function getDraftContext(draft, lane) {
  const enemy = byName(draft.enemyADC);
  const enemyRole = enemy?.roles?.includes("APC") ? "APC" : enemy?.roles?.includes("ADC") ? "ADC" : "";
  return { ...draft, enemyRole, lane };
}

export function getTriggeredRules(draft, lane) {
  const ctx = getDraftContext(draft, lane);
  return compiledRules.filter((r) => {
    if (r.lanes?.length && !r.lanes.includes(lane)) return false;
    return runRule(r, ctx);
  });
}

export function getRulesForChampion(champ, draftOrTriggered, lane) {
  const triggered = Array.isArray(draftOrTriggered)
    ? draftOrTriggered
    : getTriggeredRules(draftOrTriggered, lane);
  return triggered.filter(
    (r) =>
      r.text.toLowerCase().includes(champ.name.toLowerCase()) ||
      r.condition.includes(`'${champ.name}'`)
  );
}

function getDraftKeywords(draft, lane) {
  const keywords = new Set();
  const names = getDraftValues(draft);

  names.forEach((name) => {
    keywords.add(name.toLowerCase());
    const champ = byName(name);
    if (!champ) return;
    if (champ.archetype) keywords.add(champ.archetype.toLowerCase());
    (champ.playstyle || []).forEach((p) => keywords.add(p.toLowerCase()));
  });

  const enemySup = byName(draft.enemySupport);
  if (enemySup?.archetype === "Hook") ["hook", "hooks", "pick", "positioning"].forEach((k) => keywords.add(k));
  if (enemySup?.archetype === "Engage") ["engage", "dive", "all-in", "gap closer"].forEach((k) => keywords.add(k));
  if (enemySup?.archetype === "Enchanter") ["enchanter", "sustain", "peel", "protect"].forEach((k) => keywords.add(k));
  if (enemySup?.archetype === "Poke") ["poke", "siege", "pressure"].forEach((k) => keywords.add(k));

  return { keywords, names, lane };
}

function conditionApplies(text, ctx) {
  const lower = text.toLowerCase();
  if (ctx.names.some((n) => lower.includes(n.toLowerCase()))) return true;
  for (const kw of ctx.keywords) {
    if (lower.includes(kw)) return true;
  }
  return false;
}

function evaluateConditions(champ, draft, lane) {
  const reasons = [];
  const warnings = [];
  let scoreDelta = 0;
  const conditions = getMatchups(champ, lane).conditions;
  if (!conditions) return { reasons, warnings, scoreDelta };

  const ctx = getDraftKeywords(draft, lane);
  (conditions.green || []).forEach((text) => {
    if (conditionApplies(text, ctx)) {
      scoreDelta += SCORE.conditionGreen;
      reasons.push({ label: "Good fit for this draft", text });
    }
  });
  (conditions.red || []).forEach((text) => {
    if (conditionApplies(text, ctx)) {
      scoreDelta += SCORE.conditionRed;
      warnings.push({ label: "Draft warning", text });
    }
  });

  return { reasons, warnings, scoreDelta };
}

export function getFlexWarnings(draft) {
  const selected = getDraftedNames(draft);
  return otherInfo.flexPicks.filter((fp) => selected.has(fp.name) && fp.lanes?.length > 1);
}

export function getGlobalConditions(lane) {
  return otherInfo.globalConditions.filter((g) => !g.lanes?.length || g.lanes.includes(lane));
}

function scorePlaystyle(champ, yourSup, enemySup) {
  let bonus = 0;
  const styles = champ.playstyle || [];
  if (yourSup?.archetype === "Engage" && styles.some((s) => ["all-in", "lane bully", "snowball"].includes(s)))
    bonus += SCORE.playstyle;
  if (yourSup?.archetype === "Enchanter" && styles.some((s) => ["hypercarry", "scaling", "safe"].includes(s)))
    bonus += SCORE.playstyle;
  if (enemySup?.archetype === "Hook" && styles.some((s) => ["safe", "kiting", "poke"].includes(s)))
    bonus += SCORE.playstyle;
  if (enemySup?.archetype === "Engage" && styles.some((s) => ["kiting", "safe", "utility"].includes(s)))
    bonus += SCORE.playstyle;
  return bonus;
}

function scoreEnemyMatchup(champ, cv, enemyName, lbl, lane, isDirect) {
  const reasons = [];
  const warnings = [];
  let score = 0;
  const direct = isDirect ? SCORE.directOpponent : 0;

  const good = findMatch(cv.goodAgainst, enemyName);
  if (good) {
    score += SCORE.goodAgainst + direct;
    reasons.push({ label: `${lbl} counter`, text: good.note || `Strong into ${enemyName}` });
  }
  const bad = findMatch(cv.badAgainst, enemyName);
  if (bad) {
    score += SCORE.badAgainst - direct;
    warnings.push({ label: `${lbl} weak`, text: bad.note || `Struggles vs ${enemyName}` });
  }

  const enemy = byName(enemyName);
  if (enemy) {
    const ev = withLaneMatchups(enemy, lane);
    const revG = findMatch(ev.badAgainst, champ.name);
    if (revG && !bad) {
      score += SCORE.reverseCounter + direct;
      reasons.push({ label: "Enemy hates this", text: revG.note || `${enemyName} weak into you` });
    }
    const revB = findMatch(ev.goodAgainst, champ.name);
    if (revB && !good) {
      score += SCORE.reverseWeak - direct;
      warnings.push({ label: "Enemy favors lane", text: revB.note || `${enemyName} strong into you` });
    }
  }

  return { score, reasons, warnings };
}

function scoreAllySynergy(champ, allyName, lbl, isPartner) {
  const reasons = [];
  const warnings = [];
  let score = 0;
  const partner = isPartner ? SCORE.lanePartner : 0;
  const ally = byName(allyName);

  const syn = findMatch((champ.synergies || []).map(normalizeEntry), allyName);
  const synAlly = ally ? findMatch((ally.synergies || []).map(normalizeEntry), champ.name) : null;
  if (syn || synAlly) {
    score += SCORE.synergy + partner;
    reasons.push({ label: `${lbl} synergy`, text: syn?.note || synAlly?.note || `Works with ${allyName}` });
  }
  const avoid = findMatch(champ.avoidSynergies, allyName);
  const avoidAlly = ally ? findMatch(ally.avoidSynergies, champ.name) : null;
  if (avoid || avoidAlly) {
    score += SCORE.avoidSynergy;
    warnings.push({ label: "Bad pairing", text: avoid?.note || avoidAlly?.note || `Clashes with ${allyName}` });
  }

  return { score, reasons, warnings };
}

export function scoreChampion(champ, draft, lane, triggeredRules) {
  const reasons = [];
  const warnings = [];
  let score = 0;
  const cfg = LANE_CONFIG[lane];
  const cv = withLaneMatchups(champ, lane);

  const enemySlots = [
    ["enemyTop", "Enemy top"], ["enemyJungle", "Enemy jungle"], ["enemyMid", "Enemy mid"],
    ["enemyADC", "Enemy carry"], ["enemySupport", "Enemy support"]
  ];

  enemySlots.forEach(([key, lbl]) => {
    const name = draft[key];
    if (!name) return;
    const r = scoreEnemyMatchup(champ, cv, name, lbl, lane, key === cfg.directOpponent);
    score += r.score;
    reasons.push(...r.reasons);
    warnings.push(...r.warnings);
  });

  const allySlots = [
    ["allyTop", "Ally top"], ["allyJungle", "Ally jungle"], ["allyMid", "Ally mid"],
    ["allyADC", "Ally carry"], ["allySupport", "Ally support"]
  ].filter(([key]) => key !== cfg.hiddenAlly);

  allySlots.forEach(([key, lbl]) => {
    const name = draft[key];
    if (!name) return;
    const r = scoreAllySynergy(champ, name, lbl, key === cfg.lanePartner);
    score += r.score;
    reasons.push(...r.reasons);
    warnings.push(...r.warnings);
  });

  if (lane === "Dragon" && draft.allySupport && draft.enemySupport) {
    const yourSup = byName(draft.allySupport);
    if (yourSup) {
      const yv = withLaneMatchups(yourSup, "Support");
      const wins = findMatch(yv.goodAgainst, draft.enemySupport);
      if (wins) {
        score += SCORE.supLaneGood;
        reasons.push({ label: "Your sup wins matchup", text: wins.note || `${draft.allySupport} beats ${draft.enemySupport}` });
      }
      const loses = findMatch(yv.badAgainst, draft.enemySupport);
      if (loses) {
        score += SCORE.supLaneBad;
        warnings.push({ label: "Your sup loses matchup", text: loses.note || `${draft.allySupport} struggles` });
      }
    }
  }

  if (lane === "Support" && draft.allyADC && draft.enemyADC) {
    const yourCarry = byName(draft.allyADC);
    if (yourCarry) {
      const yv = withLaneMatchups(yourCarry, "Dragon");
      const wins = findMatch(yv.goodAgainst, draft.enemyADC);
      if (wins) {
        score += SCORE.supLaneGood;
        reasons.push({ label: "Your carry wins lane", text: wins.note || `${draft.allyADC} beats ${draft.enemyADC}` });
      }
      const loses = findMatch(yv.badAgainst, draft.enemyADC);
      if (loses) {
        score += SCORE.supLaneBad;
        warnings.push({ label: "Your carry loses lane", text: loses.note || `${draft.allyADC} struggles vs ${draft.enemyADC}` });
      }
    }
  }

  if (lane === "Dragon" || lane === "Support") {
    const yourSup = byName(draft.allySupport);
    const enemySup = byName(draft.enemySupport);
    const ps = scorePlaystyle(champ, yourSup, enemySup);
    if (ps > 0) {
      score += ps;
      reasons.push({ label: "Playstyle fit", text: "Comp lines up with this pick." });
    }
  }

  const cond = evaluateConditions(champ, draft, lane);
  score += cond.scoreDelta;
  reasons.push(...cond.reasons);
  warnings.push(...cond.warnings);

  getRulesForChampion(champ, triggeredRules).forEach((r) => {
    score += SCORE.draftRule;
    reasons.push({ label: "Draft rule", text: r.text });
  });

  return { score, reasons, warnings };
}

export function getRecommendations(draft, lane) {
  const cfg = LANE_CONFIG[lane];
  const drafted = getDraftedNames(draft);
  if (!drafted.size) return [];

  const triggeredRules = getTriggeredRules(draft, lane);

  return getChampionsByLane(cfg.pickLane)
    .filter(cfg.isPick)
    .filter((champ) => !drafted.has(champ.name))
    .map((champ) => ({ champ, ...scoreChampion(champ, draft, lane, triggeredRules) }))
    .sort((a, b) => b.score - a.score || a.champ.name.localeCompare(b.champ.name))
    .slice(0, 8);
}

export function filterAlmanac({ activeLane, roleFilter, playstyleFilter, search }) {
  let list = getChampionsByLane(activeLane);

  if (roleFilter !== "All") list = list.filter((c) => c.roles?.includes(roleFilter));
  if (playstyleFilter !== "All") list = list.filter((c) => (c.playstyle || []).includes(playstyleFilter));

  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.playstyle || []).some((p) => p.toLowerCase().includes(q)) ||
        (c.archetype || "").toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export function getSubRoleFilters(activeLane) {
  if (activeLane === "Dragon") return ["All", "ADC", "APC"];
  return ["All"];
}

export function getContextualMatchups(champ, draft, lane) {
  const m = getMatchups(champ, lane);
  const targets = getDraftValues(draft);
  const pick = (list) => (list || []).map(normalizeEntry).filter((e) => targets.includes(e.name));

  return {
    goodVsEnemy: pick(m.goodAgainst),
    badVsEnemy: pick(m.badAgainst),
    synergies: pick((champ.synergies || []).map(normalizeEntry)),
    avoidSynergies: pick(champ.avoidSynergies)
  };
}

export function loadDraftFromStorage() {
  try {
    const raw = localStorage.getItem("laneLedgerState") || localStorage.getItem("laneLedgerDraft");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.draft && "enemyTop" in parsed.draft) {
      return {
        activeLane: parsed.activeLane || "Dragon",
        draft: { ...EMPTY_DRAFT, ...parsed.draft }
      };
    }
  } catch { /* ignore */ }
  return null;
}

export function saveDraftToStorage(activeLane, draft) {
  try {
    localStorage.setItem("laneLedgerState", JSON.stringify({ activeLane, draft }));
  } catch { /* ignore */ }
}
