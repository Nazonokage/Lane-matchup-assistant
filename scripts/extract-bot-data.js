/**
 * Merge legacy data.js → data/drLane.json, suppRole.json, draftRules.json
 * Preserves existing JSON entries (newer data wins). Only adds missing champs/rules.
 *
 * Usage: node scripts/extract-bot-data.js
 *        node scripts/extract-bot-data.js --full   (overwrite bot JSON from data.js)
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data");
const FULL = process.argv.includes("--full");

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function loadLegacy() {
  const legacyPath = path.join(ROOT, "data.js");
  if (!fs.existsSync(legacyPath)) return null;
  const src = fs.readFileSync(legacyPath, "utf8");
  if (!src.includes("championData")) return null;

  const ctx = {};
  vm.runInNewContext(
    src + "\nthis.championData=championData;this.draftRules=draftRules;this.lastUpdated=lastUpdated;",
    ctx
  );
  if (!ctx.championData?.length) return null;
  return ctx;
}

function toLaneEntry(champ) {
  return {
    name: champ.name,
    primaryRole: champ.roles?.includes("Support") && !champ.roles?.includes("ADC") && !champ.roles?.includes("APC")
      ? "Support"
      : "Dragon",
    secondaryRoles: champ.secondaryRoles || [],
    archetype: champ.archetype,
    playstyle: champ.playstyle || [],
    goodAgainst: champ.goodAgainst || [],
    badAgainst: champ.badAgainst || [],
    synergies: champ.synergies || [],
    avoidSynergies: champ.avoidSynergies || [],
    caution: champ.caution || "",
    tips: champ.tips || "",
    pickWhen: champ.conditions?.green || [],
    avoidWhen: champ.conditions?.red || [],
    roles: champ.roles || []
  };
}

function isDragon(champ) {
  return champ.roles?.includes("ADC") || champ.roles?.includes("APC");
}

function isSupport(champ) {
  return champ.roles?.includes("Support");
}

function mergeChampions(existing, incoming, label) {
  const byName = new Map(existing.map((c) => [c.name, c]));
  let added = 0;
  for (const champ of incoming) {
    if (FULL || !byName.has(champ.name)) {
      if (!byName.has(champ.name)) added++;
      byName.set(champ.name, champ);
    }
  }
  console.log(`  ${label}: ${byName.size} total (${added} added${FULL ? ", full replace" : ""})`);
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function mergeRules(existing, incoming) {
  const byId = new Map(existing.map((r) => [r.id, r]));
  let added = 0;
  for (const rule of incoming) {
    const tagged = { ...rule, lanes: rule.lanes || ["Dragon", "Support"] };
    if (!byId.has(rule.id)) added++;
    byId.set(rule.id, tagged);
  }
  console.log(`  draftRules: ${byId.size} total (${added} added)`);
  return [...byId.values()];
}

function main() {
  const legacy = loadLegacy();
  if (!legacy) {
    console.log("No legacy data.js with championData found — nothing to merge.");
    console.log("Edit data/drLane.json and data/suppRole.json directly, then run: node scripts/build-data.js");
    return;
  }

  const { championData, draftRules, lastUpdated } = legacy;
  const dragonSrc = championData.filter(isDragon).map(toLaneEntry);
  const supportSrc = championData.filter(isSupport).map(toLaneEntry);

  const drPath = path.join(DATA, "drLane.json");
  const supPath = path.join(DATA, "suppRole.json");
  const rulesPath = path.join(DATA, "draftRules.json");

  const drExisting = FULL ? { meta: {}, champions: [] } : readJson(drPath) || { meta: {}, champions: [] };
  const supExisting = FULL ? { meta: {}, champions: [] } : readJson(supPath) || { meta: {}, champions: [] };
  const rulesExisting = readJson(rulesPath) || { meta: {}, rules: [] };

  const updated = lastUpdated || drExisting.meta?.lastUpdated || "June 2026";

  const drLane = {
    meta: {
      lastUpdated: updated,
      patch: "7.1g",
      lane: "Dragon",
      description: "Wild Rift bot lane carry data (ADC + APC)"
    },
    champions: mergeChampions(FULL ? [] : drExisting.champions || [], dragonSrc, "drLane.json")
  };

  const suppRole = {
    meta: {
      lastUpdated: updated,
      patch: "7.1g",
      lane: "Support",
      description: "Wild Rift support champion data"
    },
    champions: mergeChampions(FULL ? [] : supExisting.champions || [], supportSrc, "suppRole.json")
  };

  const draftRulesOut = {
    meta: { lastUpdated: updated, patch: "7.1g" },
    rules: mergeRules(rulesExisting.rules || [], draftRules || [])
  };

  fs.writeFileSync(drPath, JSON.stringify(drLane, null, 2));
  fs.writeFileSync(supPath, JSON.stringify(suppRole, null, 2));
  fs.writeFileSync(rulesPath, JSON.stringify(draftRulesOut, null, 2));

  console.log(`\nDone. Run: node scripts/build-data.js`);
}

main();
