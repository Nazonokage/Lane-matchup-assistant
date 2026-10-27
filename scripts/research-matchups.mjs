// Explicit research refresh; never run by the production build.
import fs from 'node:fs';
const root = new URL('../src/data/', import.meta.url);
const rosters = JSON.parse(fs.readFileSync(new URL('rosters.json', root)));
const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const names = new Map([...rosters.wr.champions, ...rosters.pc.champions].map(n => [normalize(n), n]));
const clean = s => (s || '').replace(/<[^>]+>/g, '').replace(/&#8217;|&#039;|&rsquo;/g, "'").replace(/&amp;|&#038;/g, '&').replace(/\s+/g, ' ').trim();
async function read(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response.text();
}
const index = await read('https://wildriftcounter.com/champions/');
const links = [...new Set([...index.matchAll(/href=["'](https:\/\/wildriftcounter.com\/champions\/[^/"']+\/)["']/g)].map(m => m[1]))];
const results = [];
const failures = [];
const queue = [...links];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const source = queue.shift();
    try {
      const html = await read(source);
      const title = clean(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '');
      const slug = source.split('/').filter(Boolean).at(-1);
      const name = names.get(normalize(title.split(/ (?:Wild Rift|counter Wild Rift)/i)[0])) || names.get(normalize(slug)) || (slug === 'nunu' ? 'Nunu & Willump' : null);
      if (!name) continue;
      const section = html.slice(html.indexOf('Discover all'), html.indexOf('Item Counter', html.indexOf('Discover all')));
      const tokens = [...section.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>|<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/g)];
      const lanes = {};
      let lane, direction;
      for (const token of tokens) {
        const value = clean(token[1] || token[2]);
        const role = { Top: 'Baron', Jungle: 'Jungle', Jungler: 'Jungle', Mid: 'Mid', Bot: 'Dragon', ADC: 'Dragon', Support: 'Support' }[value];
        if (role) { lane = role; direction = null; lanes[lane] ||= { goodAgainst: [], badAgainst: [] }; }
        else if (/is Weak Against/i.test(value)) direction = 'badAgainst';
        else if (/is Strong Against/i.test(value)) direction = 'goodAgainst';
        else if (token[2] && lane && direction) {
          const enemy = names.get(normalize(value));
          if (enemy && enemy !== name && !lanes[lane][direction].includes(enemy)) lanes[lane][direction].push(enemy);
        }
      }
      results.push({ name, source, lanes });
    } catch (error) { failures.push({ source, error: error.message }); }
  }
}));
results.sort((a,b) => a.name.localeCompare(b.name));
fs.writeFileSync(new URL('matchupResearch.json', root), JSON.stringify({ checkedAt: '2026-10-27', sourceGame: 'wr', basis: 'Third-party matchup ideas, not measured win rates or PC evidence.', champions: results, failures }, null, 2) + '\n');
console.log(JSON.stringify({ pages: results.length, failures, missingWR: rosters.wr.champions.filter(n => !results.some(r => r.name === n)) }));
