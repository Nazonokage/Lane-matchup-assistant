// Optional source refresh. Save names and provenance, never third-party guide text.
import fs from 'node:fs';
const root = new URL('../src/data/', import.meta.url);
const rosters = JSON.parse(fs.readFileSync(new URL('rosters.json', root)));
const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const names = new Map(rosters.pc.champions.map(n => [normalize(n), n]));
const queue = [...rosters.pc.champions];
const champions = [], failures = [];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const name = queue.shift();
    const slug = ({ 'Nunu & Willump': 'nunu-willump', "Cho'Gath": 'chogath', "Kha'Zix": 'khazix', "Kog'Maw": 'kogmaw', "Vel'Koz": 'velkoz', "Kai'Sa": 'kaisa', "Bel'Veth": 'belveth', "Rek'Sai": 'reksai', 'Dr. Mundo': 'dr-mundo' })[name] || name.toLowerCase().replace(/['.]/g, '').replace(/ /g, '-');
    const source = `https://www.counterstats.net/league-of-legends/${slug}`;
    try {
      const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(String(response.status));
      const html = await response.text();
      const lanes = {};
      let lane, direction;
      const tokens = html.matchAll(/<span class="collapse" id="([^"]+)"|<h3>([\s\S]*?)<\/h3>|<a class="champ-box__row"[\s\S]*?<\/a>/g);
      for (const token of tokens) {
        if (token[1]) { lane = { top: 'Baron', jungle: 'Jungle', mid: 'Mid', bottom: 'Dragon', adc: 'Dragon', support: 'Support' }[token[1]]; direction = null; if(lane) lanes[lane] ||= { goodAgainst: [], badAgainst: [] }; }
        else if (token[2]) direction = /Best Picks/.test(token[2]) ? 'badAgainst' : /Worst Picks/.test(token[2]) ? 'goodAgainst' : null;
        else if (lane && direction) {
          const display = token[0].match(/<span class="champion">([^<]+)/)?.[1];
          const enemy = display && names.get(normalize(display.replace(/&amp;/g, '&').replace(/&#039;/g, "'")));
          if (enemy && enemy !== name && lanes[lane][direction].length < 6 && !lanes[lane][direction].includes(enemy)) lanes[lane][direction].push(enemy);
        }
      }
      champions.push({ name, source, lanes });
    } catch(error) { failures.push({ name, source, error: error.message }); }
  }
}));
champions.sort((a,b) => a.name.localeCompare(b.name));
fs.writeFileSync(new URL('pcMatchupResearch.json', root), JSON.stringify({ checkedAt: '2026-10-27', sourceGame: 'pc', basis: 'Third-party matchup suggestions; percentages and rankings are not imported.', champions, failures }, null, 2) + '\n');
console.log(JSON.stringify({ pages: champions.length, failures, empty: champions.filter(c => !Object.keys(c.lanes).length).map(c => c.name) }));
