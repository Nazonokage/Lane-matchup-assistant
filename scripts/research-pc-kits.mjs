// Optional, explicit research refresh. Never runs as part of the production build.
// Fetches public Riot Data Dragon data; no API key or match-history access.
import fs from 'node:fs';
const version = '16.21.1';
const base = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion`;
const fetchJson = async url => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response.json();
};
const index = await fetchJson(`${base}.json`);
const champions = Object.values(index.data);
const references = {};
const queue = [...champions];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const champion = queue.shift();
    const source = `${base}/${champion.id}.json`;
    const data = (await fetchJson(source)).data[champion.id];
    // Short attributed excerpt only. No long copied guide or ability descriptions.
    const sentences = (data.enemytips || []).flatMap(tip => tip.replace(/<[^>]*>/g, '').split(/(?<=[.!?])\s+/));
    const tip = sentences.find(text => text.trim().split(/\s+/).length <= 22 && text.trim().split(/\s+/).length >= 6) || '';
    references[data.name] = { source, version, checkedAt: '2026-10-25', officialEnemyTip: tip, sourceKind: 'Official PC kit reference; not matchup statistics' };
  }
}));
fs.writeFileSync(new URL('../src/data/pcKitReferences.json', import.meta.url), JSON.stringify(references, null, 2) + '\n');
console.log(`Saved ${Object.keys(references).length} PC references; ${Object.values(references).filter(r => r.officialEnemyTip).length} short official tips. Wild Rift does not inherit these tips.`);
