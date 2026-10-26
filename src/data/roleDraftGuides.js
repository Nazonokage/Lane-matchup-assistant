// Editorial solo-queue decision prompts, not tier lists or guaranteed lane priority.
export const roleDraftGuides = {
  Baron: {
    title: 'Top / Baron draft plan',
    priorities: 'Compare the lane trade pattern first, then decide whether your team needs a frontline, a side-lane threat or protection for its carries.',
    checklist: 'Check enemy reach, sustain and key defensive cooldowns. A strong teamfight pick can still need help surviving the lane.',
    execution: 'Keep the wave near a safe retreat when the enemy jungler is missing. Before an objective, choose a side-lane trade or a timely group with your team.'
  },
  Jungle: {
    title: 'Jungle draft plan',
    priorities: 'Match your route and fight timing to allied setup. Choose between early pressure, farming toward a power spike, and reliable engage or protection.',
    checklist: 'Lane picks do not prove lane priority. Check actual waves, health and nearby teammates before invading or contesting river.',
    execution: 'Plan an opening route and a fallback if a gank fails. Spend gold before the next objective and trade across the map when a contest has no support.'
  },
  Mid: {
    title: 'Mid draft plan',
    priorities: 'Balance wave control, damage type and fight setup. Consider whether the team needs a protected damage source or someone who can help the jungler catch targets.',
    checklist: 'Compare range, entry tools and escape routes against the enemy mid. Wave-clear tools do not automatically let you move first.',
    execution: 'Clear or secure the wave before moving, ping missing opponents and avoid following through dark river alone. Preserve a defensive spell against ganks.'
  },
  Support: {
    title: 'Support draft plan',
    priorities: 'Match your carry’s trade pattern and answer the enemy duo. Choose engage when allies can follow, protection against dives, or recovery against repeated poke.',
    checklist: 'Consider both enemy laners. Engage range, minion blockers, healing costs and defensive cooldowns matter more than a single champion pairing.',
    execution: 'Roam after a safe crash or reset. Build vision with a teammate and keep one useful defensive tool for the enemy most likely to reach your carry.'
  },
  Dragon: {
    title: 'ADC / Dragon draft plan',
    priorities: 'Choose a damage pattern that fits your support and the enemy frontline, then check whether you can safely keep attacking.',
    checklist: 'Assess both enemy laners and threats from other roles. A favorable duel does not make an unsafe two-versus-two playable.',
    execution: 'Trade within your partner’s reach, preserve your escape against catches and reset before objectives so you can approach behind your team.'
  }
};
