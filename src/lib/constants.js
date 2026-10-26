export const LANES = ["Support","Dragon", "Mid", "Jungle", "Baron"];

export const DRAFT_KEYS = [
  "enemyTop", "enemyJungle", "enemyMid", "enemyADC", "enemySupport",
  "allyTop", "allyJungle", "allyMid", "allyADC", "allySupport"
];

export const ROLE_COLORS = {
  ADC: "adc",
  APC: "apc",
  Support: "support",
  Mid: "mid",
  Jungle: "jungle",
  Baron: "baron"
};

export const DRAFT_FIELD_DEFS = {
  enemyTop: { label: "Enemy Top", pool: "Baron", group: "enemy" },
  enemyJungle: { label: "Enemy Jungle", pool: "Jungle", group: "enemy" },
  enemyMid: { label: "Enemy Mid", pool: "Mid", group: "enemy" },
  enemyADC: { label: "Enemy ADC", pool: "carry", group: "enemy" },
  enemySupport: { label: "Enemy Support", pool: "Support", group: "enemy" },
  allyTop: { label: "Ally Top", pool: "Baron", group: "ally" },
  allyJungle: { label: "Ally Jungle", pool: "Jungle", group: "ally" },
  allyMid: { label: "Ally Mid", pool: "Mid", group: "ally" },
  allyADC: { label: "Ally ADC", pool: "carry", group: "ally" },
  allySupport: { label: "Ally Support", pool: "Support", group: "ally" }
};

export const LANE_CONFIG = {
  Dragon: {
    draftLabel: "ADC",
    hiddenAlly: "allyADC",
    directOpponent: "enemyADC",
    lanePartner: "allySupport",
    desc: "You're ADC — fill in the draft to see suggestions below.",
    pickLane: "Dragon",
    isPick: (c) => c.roles?.includes("ADC") || c.roles?.includes("APC")
  },
  Support: {
    draftLabel: "Support",
    hiddenAlly: "allySupport",
    directOpponent: "enemySupport",
    lanePartner: "allyADC",
    desc: "You're Support — fill in the draft to see suggestions below.",
    pickLane: "Support",
    isPick: (c) => c.playableLanes?.includes("Support") || c.roles?.includes("Support")
  },
  Mid: {
    draftLabel: "Mid",
    hiddenAlly: "allyMid",
    directOpponent: "enemyMid",
    lanePartner: null,
    desc: "You're Mid — fill in the draft to see suggestions below.",
    pickLane: "Mid",
    isPick: (c) => c.playableLanes?.includes("Mid")
  },
  Jungle: {
    draftLabel: "Jungle",
    hiddenAlly: "allyJungle",
    directOpponent: "enemyJungle",
    lanePartner: null,
    desc: "You're Jungle — fill in the draft to see suggestions below.",
    pickLane: "Jungle",
    isPick: (c) => c.playableLanes?.includes("Jungle")
  },
  Baron: {
    draftLabel: "Top",
    hiddenAlly: "allyTop",
    directOpponent: "enemyTop",
    lanePartner: null,
    desc: "You're Top — fill in the draft to see suggestions below.",
    pickLane: "Baron",
    isPick: (c) => c.playableLanes?.includes("Baron")
  }
};

export const EMPTY_DRAFT = Object.fromEntries(DRAFT_KEYS.map((k) => [k, ""]));
