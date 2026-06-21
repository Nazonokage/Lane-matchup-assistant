/**
 * Lane Ledger — build data/bundle.js from JSON sources
 * Run: node scripts/build-data.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data");

const LANE_FILES = [
  { file: "drLane.json", lane: "Dragon" },
  { file: "suppRole.json", lane: "Support" },
  { file: "Midlane.json", lane: "Mid" },
  { file: "JglRole.json", lane: "Jungle" },
  { file: "BrLane.json", lane: "Baron" }
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

const report = { warnings: [], merged: [], counts: {} };

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return null;
  return JSON.parse(raw);
}

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

function normalizeSlice(champ, fileLane) {
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
      [fileLane]: normalizeSlice(champ, fileLane)
    },
    _source: sourceFile
  };
}

function mergeChampions(existing, incoming, fileLane) {
  if (!existing) return incoming;

  if (existing.matchupsByLane[fileLane]) {
    report.warnings.push(`Duplicate in same file/lane: ${incoming.name} (${fileLane}) — merging slices`);
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
    report.merged.push(`${incoming.name} (+${fileLane})`);
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

function loadLaneFiles() {
  const byName = new Map();

  for (const { file, lane } of LANE_FILES) {
    const fp = path.join(DATA, file);
    if (!fs.existsSync(fp)) {
      report.warnings.push(`Missing file: ${file}`);
      continue;
    }
    const data = readJson(fp);
    if (!data?.champions?.length) {
      report.warnings.push(`Empty or invalid: ${file}`);
      continue;
    }

    const seenInFile = new Set();
    for (const champ of data.champions) {
      if (seenInFile.has(champ.name)) {
        report.warnings.push(`Same-file duplicate: ${champ.name} in ${file}`);
      }
      seenInFile.add(champ.name);

      const norm = normalizeChampion(champ, lane, file);
      const prev = byName.get(champ.name);
      byName.set(champ.name, prev ? mergeChampions(prev, norm, lane) : norm);
    }
    report.counts[lane] = data.champions.length;
  }

  return [...byName.values()].map(flattenForBundle).sort((a, b) => a.name.localeCompare(b.name));
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

function loadDraftRules() {
  let rules = [];

  try {
    const bot = readJson(path.join(DATA, "draftRules.json"));
    if (bot?.rules?.length) {
      rules = mergeRulesList(rules, bot.rules, ["Dragon", "Support"]);
    }
  } catch {
    report.warnings.push("draftRules.json missing or invalid");
  }

  for (const { file, lane } of LANE_FILES) {
    const fp = path.join(DATA, file);
    if (!fs.existsSync(fp)) continue;
    const data = readJson(fp);
    if (data?.draftRules?.length) {
      rules = mergeRulesList(rules, data.draftRules, [lane]);
      report.counts[`rules:${lane}`] = data.draftRules.length;
    }
  }

  if (!rules.length) report.warnings.push("No draft rules loaded");
  return rules;
}

function loadOtherInfo() {
  const fp = path.join(DATA, "otherinfo.json");
  const data = readJson(fp);
  return (
    data || {
      meta: {},
      flexPicks: [],
      globalConditions: [],
      metaNotes: []
    }
  );
}

function serialize(obj) {
  return JSON.stringify(obj, null, 2)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function main() {
  const championData = loadLaneFiles();
  const draftRules = loadDraftRules();
  const otherInfo = loadOtherInfo();

  const lastUpdated = otherInfo.meta?.lastUpdated || "June 2026";
  const metaNote =
    otherInfo.metaNotes?.[0]?.text ||
    "Wild Rift draft companion — 5 lanes. Run node scripts/build-data.js after editing JSON.";

  const bundle = `// Lane Ledger — GENERATED by scripts/build-data.js
// Do not edit directly. Edit data/*.json then rebuild.

const lastUpdated = ${JSON.stringify(lastUpdated)};
const metaNote = ${JSON.stringify(metaNote)};

const otherInfo = ${serialize(otherInfo)};

const draftRules = ${serialize(draftRules)};

const championData = ${serialize(championData)};

console.log(\`Loaded \${championData.length} champions\`);
console.log(\`Loaded \${draftRules.length} draft rules\`);
`;

  fs.writeFileSync(path.join(DATA, "bundle.js"), bundle);

  console.log("Build complete → data/bundle.js");
  console.log(`Champions: ${championData.length}`);
  console.log(`Draft rules: ${draftRules.length}`);
  console.log("Lane file counts:", report.counts);
  if (report.merged.length) console.log(`Cross-lane merges: ${report.merged.length}`);
  if (report.warnings.length) {
    console.log("Warnings:");
    report.warnings.forEach((w) => console.log("  -", w));
  }
}

main();
