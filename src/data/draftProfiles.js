// Scoring corrections and role context. These are kit-based editorial tags, not tiers.
// A trait describes an available tool, never a guarantee that it wins a matchup.
export const traitCorrections = {
  Amumu: { remove: ['knockup'] },
  Caitlyn: { add: ['sustained'] },
  Ezreal: { add: ['sustained'] },
  Lucian: { add: ['sustained'] },
  Tristana: { add: ['sustained'] },
  Xayah: { add: ['immobile'] },
  Sivir: { add: ['immobile'] },
  Sona: { add: ['peel'] },
  "Cho'Gath": { add: ['knockup'] },
  Diana: { add: ['knockup'] },
  Galio: { add: ['knockup'] },
  Gragas: { add: ['knockup'] },
  Maokai: { add: ['knockup'] },
  'Nunu & Willump': { add: ['knockup'] },
  Poppy: { add: ['knockup'] },
  Riven: { add: ['knockup'] },
  Sejuani: { add: ['knockup'] },
  Sion: { add: ['knockup'] },
  Thresh: { add: ['knockup'] },
  Vi: { add: ['knockup'] },
  Zyra: { add: ['knockup'] }
};

// Low-income support builds should not be counted as a team's main damage source.
// The same champion in a farming role retains its normal damage profile.
export const supportEconomy = {
  remove: ['sustained', 'antiTank', 'split', 'waveclear'],
  note: 'Support economy: do not assume this pick supplies farming-carry damage or wave control.'
};
const farmingDamageRoles = { Galio: ['Mid'], Gragas: ['Mid'], Karma: ['Mid'], Zilean: ['Mid'] };

export const draftProfileSources = [
  'https://www.leagueoflegends.com/en-us/champions/amumu/',
  'https://www.leagueoflegends.com/en-us/champions/corki/',
  'https://wildrift.leagueoflegends.com/en-us/champions/corki/'
];

export function correctedTraits(name, traits) {
  const correction = traitCorrections[name] || {};
  return [...new Set([...traits.filter(t => !correction.remove?.includes(t)), ...(correction.add || [])])];
}

export function roleProfile(champion, lane) {
  return { ...champion, draftRole: lane,
    traits: lane === 'Support' ? champion.traits.filter(t => !supportEconomy.remove.includes(t)) : champion.traits,
    suppliesCarryDamage: lane !== 'Support' && (!['tank', 'support'].includes(champion.category) || farmingDamageRoles[champion.name]?.includes(lane)) };
}
