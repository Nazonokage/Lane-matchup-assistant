// Research check for the hand-authored flex-role additions.
import fs from 'node:fs';
import { flexMatchups } from '../src/data/flexMatchups.js';
const root = new URL('../src/data/', import.meta.url);
const refs = JSON.parse(fs.readFileSync(new URL('pcKitReferences.json', root)));
const queue = [...new Set(flexMatchups.flatMap(p => p.games.flatMap(game => [p.favored,p.challenged].map(name => `${game}|${name}`))))];
const results = [], failures = [];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const [game,name] = queue.shift().split('|');
    const source = game === 'pc' ? refs[name].source : `https://wildrift.leagueoflegends.com/en-us/champions/${name.toLowerCase().replace(/ /g,'-').replace(/[^a-z0-9-]/g,'')}/`;
    try {
      const response = await fetch(source,{signal:AbortSignal.timeout(30000)});
      if(!response.ok) throw new Error(String(response.status));
      const body = await response.text();
      const mentioned = flexMatchups.filter(p => p.games.includes(game) && [p.favored,p.challenged].includes(name));
      if(game === 'pc') {
        const kit = Object.values(JSON.parse(body).data)[0];
        const abilities = [kit.passive,...kit.spells].map(s => ({ name:s.name, description:s.description.replace(/<[^>]*>/g,'') }));
        results.push({game,name,source,abilities:abilities.filter(s=>mentioned.some(p=>(p.edge+p.response).includes(s.name)))});
      } else {
        // Save just ability names that occur in our own prose and on the page.
        const words = new Set(mentioned.flatMap(p => (p.edge+' '+p.response).match(/[A-Z][a-z]+(?:[ '\u2019-]+[A-Z][a-z]+)+/g)||[]));
        results.push({game,name,source,verifiedNames:[...words].filter(s=>body.toLowerCase().includes(s.toLowerCase()))});
      }
    } catch(error){failures.push({game,name,source,error:error.message});}
  }
}));
fs.mkdirSync(new URL('../.research/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('../.research/flex-kit-check.json',import.meta.url),JSON.stringify({results,failures},null,2));
console.log(JSON.stringify({checked:results.length,failures,wr:results.filter(r=>r.game==='wr')},null,2));
