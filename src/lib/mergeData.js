/**
 * Merge lane JSON files into championData / draftRules (shared by React app + build script).
 */

export const LANE_FILE_META = [
  { key: "drLane", lane: "Dragon" },
  { key: "suppRole", lane: "Support" },
  { key: "Midlane", lane: "Mid" },
  { key: "JglRole", lane: "Jungle" },
  { key: "BrLane", lane: "Baron" }
];

const ROLE_TO_LANE = {
  ADC: "Dragon",
  APC: "Dragon",
  Dragon: "Dragon",
  Support: "Support",
  Mid: "Mid",
  Jungle: "Jungle",
  Baron: "Baron"
};

function normalizeEntry(entry) {
  if (typeof entry === "string") return { name: entry, note: "" };
  return { name: entry.name, note: entry.note || "" };
}

function mergeMatchupLists(a = [], b = []) {
  const map = new Map();
  [...a, ...b].map(normalizeEntry).forEach((e) => {
    const prev = map.get(e.name);
    map.set(e.name, prev ? { name: e.name, note: e.note || prev.note } : e);
  });
  return [...map.values()];
}

function mergeStringLists(a = [], b = []) {
  return [...new Set([...(a || []), ...(b || [])])];
}

function pickRicher(a, b) {
  if (!a) return b || "";
  if (!b) return a;
  return b.length > a.length ? b : a;
}

function toConditions(champ) {
  if (champ.conditions?.green || champ.conditions?.red) {
    return {
      green: champ.conditions.green || [],
      red: champ.conditions.red || []
    };
  }
  return {
    green: champ.pickWhen || [],
    red: champ.avoidWhen || []
  };
}

function resolvePrimaryRole(champ, fileLane) {
  const pr = champ.primaryRole || champ.roles?.[0] || fileLane;
  return ROLE_TO_LANE[pr] || pr;
}

function resolveRoles(champ, fileLane) {
  if (champ.roles?.length) return champ.roles;
  const pr = resolvePrimaryRole(champ, fileLane);
  if (pr === "Dragon") {
    if (champ.name && ["Ziggs", "Brand", "Veigar", "Seraphine"].includes(champ.name)) return ["APC"];
    return ["ADC"];
  }
  if (pr === "Support") return ["Support"];
  if (pr === "Mid") return ["Mid"];
  if (pr === "Jungle") return ["Jungle"];
  if (pr === "Baron") return ["Baron"];
  return [pr];
}

function normalizeSlice(champ) {
  const conditions = toConditions(champ);
  return {
    goodAgainst: (champ.goodAgainst || []).map(normalizeEntry),
    badAgainst: (champ.badAgainst || []).map(normalizeEntry),
    conditions,
    synergies: (champ.synergies || []).map(normalizeEntry),
    avoidSynergies: (champ.avoidSynergies || []).map(normalizeEntry)
  };
}

function normalizeChampion(champ, fileLane, sourceFile) {
  const primaryLane = resolvePrimaryRole(champ, fileLane);
  const roles = resolveRoles(champ, fileLane);
  const secondary = (champ.secondaryRoles || [])
    .map((r) => ROLE_TO_LANE[r] || r)
    .filter((r) => r !== primaryLane);

  const playable = mergeStringLists(
    [primaryLane, ...secondary],
    (champ.roles || []).map((r) => ROLE_TO_LANE[r] || r)
  ).filter(Boolean);

  return {
    name: champ.name,
    primaryRole: roles[0] === "APC" ? "APC" : roles[0] === "ADC" ? "ADC" : primaryLane,
    roles,
    secondaryRoles: secondary,
    playableLanes: [...new Set(playable)],
    archetype: champ.archetype,
    category: champ.category,
    playstyle: champ.playstyle || [],
    strengths: champ.strengths || [],
    caution: champ.caution || "",
    tips: champ.tips || "",
    synergies: (champ.synergies || []).map(normalizeEntry),
    avoidSynergies: (champ.avoidSynergies || []).map(normalizeEntry),
    matchupsByLane: {
      [fileLane]: normalizeSlice(champ)
    },
    _source: sourceFile
  };
}

function mergeChampions(existing, incoming, fileLane) {
  if (!existing) return incoming;

  if (existing.matchupsByLane[fileLane]) {
    const prev = existing.matchupsByLane[fileLane];
    const next = incoming.matchupsByLane[fileLane];
    existing.matchupsByLane[fileLane] = {
      goodAgainst: mergeMatchupLists(prev.goodAgainst, next.goodAgainst),
      badAgainst: mergeMatchupLists(prev.badAgainst, next.badAgainst),
      conditions: {
        green: mergeStringLists(prev.conditions.green, next.conditions.green),
        red: mergeStringLists(prev.conditions.red, next.conditions.red)
      },
      synergies: mergeMatchupLists(prev.synergies, next.synergies),
      avoidSynergies: mergeMatchupLists(prev.avoidSynergies, next.avoidSynergies)
    };
  } else {
    existing.matchupsByLane[fileLane] = incoming.matchupsByLane[fileLane];
  }

  existing.playableLanes = mergeStringLists(existing.playableLanes, incoming.playableLanes);
  existing.secondaryRoles = mergeStringLists(existing.secondaryRoles, incoming.secondaryRoles);
  existing.roles = mergeStringLists(existing.roles, incoming.roles);
  existing.playstyle = mergeStringLists(existing.playstyle, incoming.playstyle);
  existing.strengths = mergeStringLists(existing.strengths, incoming.strengths);
  existing.caution = pickRicher(existing.caution, incoming.caution);
  existing.tips = pickRicher(existing.tips, incoming.tips);
  existing.archetype = existing.archetype || incoming.archetype;
  existing.category = existing.category || incoming.category;
  existing.synergies = mergeMatchupLists(existing.synergies, incoming.synergies);
  existing.avoidSynergies = mergeMatchupLists(existing.avoidSynergies, incoming.avoidSynergies);

  return existing;
}

function flattenForBundle(merged) {
  const lanes = Object.keys(merged.matchupsByLane);
  const primaryLane = merged.playableLanes[0] || lanes[0];
  const slice = merged.matchupsByLane[primaryLane] || merged.matchupsByLane[lanes[0]];

  const out = { ...merged };
  delete out._source;
  out.goodAgainst = slice?.goodAgainst || [];
  out.badAgainst = slice?.badAgainst || [];
  out.conditions = slice?.conditions || { green: [], red: [] };
  return out;
}

function mergeRulesList(existing, incoming, defaultLanes) {
  const byId = new Map(existing.map((r) => [r.id, r]));
  for (const rule of incoming || []) {
    const tagged = {
      ...rule,
      lanes: rule.lanes?.length ? rule.lanes : defaultLanes
    };
    byId.set(rule.id, tagged);
  }
  return [...byId.values()];
}

export function buildDataset(laneFiles, draftRulesDoc, otherInfoDoc) {
  const byName = new Map();

  for (const { key, lane } of LANE_FILE_META) {
    const data = laneFiles[key];
    if (!data?.champions?.length) continue;

    const seenInFile = new Set();
    for (const champ of data.champions) {
      if (seenInFile.has(champ.name)) continue;
      seenInFile.add(champ.name);

      const norm = normalizeChampion(champ, lane, `${key}.json`);
      const prev = byName.get(champ.name);
      byName.set(champ.name, prev ? mergeChampions(prev, norm, lane) : norm);
    }
  }

  const championData = [...byName.values()]
    .map(flattenForBundle)
    .sort((a, b) => a.name.localeCompare(b.name));

  let draftRules = [];
  if (draftRulesDoc?.rules?.length) {
    draftRules = mergeRulesList(draftRules, draftRulesDoc.rules, ["Dragon", "Support"]);
  }

  for (const { key, lane } of LANE_FILE_META) {
    const inline = laneFiles[key]?.draftRules;
    if (inline?.length) {
      draftRules = mergeRulesList(draftRules, inline, [lane]);
    }
  }

  const otherInfo = otherInfoDoc || {
    meta: {},
    flexPicks: [],
    globalConditions: [],
    metaNotes: []
  };

  const lastUpdated = otherInfo.meta?.lastUpdated || "June 2026";
  const metaNote =
    otherInfo.metaNotes?.[0]?.text ||
    "Wild Rift draft companion — 5 lanes.";

  return { championData, draftRules, otherInfo, lastUpdated, metaNote };
}

export const POOL_TO_LANE = {
  Baron: "Baron",
  Jungle: "Jungle",
  Mid: "Mid",
  Support: "Support"
};
