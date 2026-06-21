/**
 * Pre-merge lane JSON into a single dataset artifact at build time.
 * Run: node scripts/build-data.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildDataset } from "../src/lib/mergeData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../src/data");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

const laneFiles = {
  drLane: readJson("drLane.json"),
  suppRole: readJson("suppRole.json"),
  Midlane: readJson("Midlane.json"),
  JglRole: readJson("JglRole.json"),
  BrLane: readJson("BrLane.json")
};

const dataset = buildDataset(laneFiles, readJson("draftRules.json"), readJson("otherinfo.json"));

const outPath = path.join(dataDir, "dataset.json");
fs.writeFileSync(outPath, JSON.stringify(dataset));

console.log(`Wrote ${outPath}`);
console.log(`  ${dataset.championData.length} champions, ${dataset.draftRules.length} draft rules`);
