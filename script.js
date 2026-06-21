/* Lane Ledger — core logic (5-lane) */

const LANES = ["Dragon", "Support", "Mid", "Jungle", "Baron"];

const SCORE = {
  goodAgainst: 3,
  badAgainst: -2,
  synergy: 2,
  avoidSynergy: -2,
  reverseCounter: 3,
  reverseWeak: -2,
  supLaneGood: 2,
  supLaneBad: -2,
  playstyle: 1,
  conditionGreen: 1,
  conditionRed: -1,
  draftRule: 2
};

const ROLE_COLORS = {
  ADC: "adc",
  APC: "apc",
  Support: "support",
  Mid: "mid",
  Jungle: "jungle",
  Baron: "baron"
};

const LANE_CONFIG = {
  Dragon: {
    desc: "Enemy bot lane + your support → pick your ADC/APC.",
    fields: [
      { id: "enemy-support", key: "enemySupport", label: "Enemy Support", pool: "Support" },
      { id: "enemy-adc", key: "enemyADC", label: "Enemy ADC / APC", pool: "carry" },
      { id: "your-support", key: "yourSupport", label: "Your Support", pool: "Support" }
    ],
    pickLane: "Dragon",
    isPick: (c) => c.roles?.includes("ADC") || c.roles?.includes("APC")
  },
  Support: {
    desc: "Enemy bot lane + your carry → pick your support.",
    fields: [
      { id: "enemy-adc", key: "enemyADC", label: "Enemy Carry", pool: "carry" },
      { id: "enemy-support", key: "enemySupport", label: "Enemy Support", pool: "Support" },
      { id: "your-adc", key: "yourAlly", label: "Your Carry", pool: "carry" }
    ],
    pickLane: "Support",
    isPick: (c) => c.playableLanes?.includes("Support") || c.roles?.includes("Support")
  },
  Mid: {
    desc: "Enemy mid pick → recommend your mid.",
    fields: [{ id: "enemy-mid", key: "enemy1", label: "Enemy Mid", pool: "Mid" }],
    pickLane: "Mid",
    isPick: (c) => c.playableLanes?.includes("Mid")
  },
  Jungle: {
    desc: "Enemy jungle pick → recommend your jungle.",
    fields: [{ id: "enemy-jgl", key: "enemy1", label: "Enemy Jungle", pool: "Jungle" }],
    pickLane: "Jungle",
    isPick: (c) => c.playableLanes?.includes("Jungle")
  },
  Baron: {
    desc: "Enemy baron pick → recommend your baron laner.",
    fields: [{ id: "enemy-baron", key: "enemy1", label: "Enemy Baron", pool: "Baron" }],
    pickLane: "Baron",
    isPick: (c) => c.playableLanes?.includes("Baron")
  }
};

const EMPTY_DRAFT = {
  enemyADC: "",
  enemySupport: "",
  yourSupport: "",
  yourAlly: "",
  enemy1: ""
};

const state = {
  tab: "almanac",
  activeLane: "Dragon",
  search: "",
  roleFilter: "All",
  playstyleFilter: "All",
  expandedChampion: null,
  expandedPick: null,
  draft: { ...EMPTY_DRAFT }
};

/* ── helpers ── */

function byName(name) {
  return championData.find((c) => c.name === name) || null;
}

function normalizeEntry(entry) {
  if (typeof entry === "string") return { name: entry, note: "" };
  return entry;
}

function entryName(entry) {
  return normalizeEntry(entry).name;
}

function findMatch(list, target) {
  if (!list || !target) return null;
  return list.map(normalizeEntry).find((e) => e.name === target) || null;
}

function getMatchups(champ, lane) {
  const slice = champ.matchupsByLane?.[lane];
  if (slice) {
    return {
      goodAgainst: slice.goodAgainst || [],
      badAgainst: slice.badAgainst || [],
      conditions: slice.conditions || { green: [], red: [] }
    };
  }
  return {
    goodAgainst: champ.goodAgainst || [],
    badAgainst: champ.badAgainst || [],
    conditions: champ.conditions || { green: [], red: [] }
  };
}

function withLaneMatchups(champ, lane) {
  const m = getMatchups(champ, lane);
  return { ...champ, goodAgainst: m.goodAgainst, badAgainst: m.badAgainst, conditions: m.conditions };
}

function getChampionsByLane(lane) {
  return championData
    .filter((c) => c.playableLanes?.includes(lane))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getPoolChampions(pool, lane) {
  if (pool === "carry") {
    return championData
      .filter((c) => c.roles?.includes("ADC") || c.roles?.includes("APC"))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  if (pool === "Support") return getChampionsByLane("Support");
  return getChampionsByLane(lane);
}

function primaryRole(champ) {
  if (champ.roles?.includes("ADC")) return "ADC";
  if (champ.roles?.includes("APC")) return "APC";
  if (champ.roles?.includes("Support")) return "Support";
  if (champ.playableLanes?.includes("Mid")) return "Mid";
  if (champ.playableLanes?.includes("Jungle")) return "Jungle";
  if (champ.playableLanes?.includes("Baron")) return "Baron";
  return champ.roles?.[0] || "ADC";
}

function flexBadge(champ) {
  const other = (champ.playableLanes || []).filter((l) => l !== state.activeLane);
  if (!other.length) return "";
  return `<span class="flex-badge">Also: ${other.map(esc).join(", ")}</span>`;
}

function getPlaystyles() {
  const set = new Set();
  getChampionsByLane(state.activeLane).forEach((c) => (c.playstyle || []).forEach((p) => set.add(p)));
  return [...set].sort();
}

function getDraftValues(draft) {
  return Object.values(draft).filter(Boolean);
}

function evaluateCondition(condition, ctx) {
  try {
    return Function(
      "enemyADC",
      "enemySupport",
      "yourSupport",
      "yourAlly",
      "enemy1",
      "enemyRole",
      `return ${condition}`
    )(
      ctx.enemyADC,
      ctx.enemySupport,
      ctx.yourSupport,
      ctx.yourAlly,
      ctx.enemy1,
      ctx.enemyRole
    );
  } catch {
    return false;
  }
}

function getDraftContext(draft, lane) {
  const enemy = byName(draft.enemyADC || draft.enemy1);
  const enemyRole = enemy?.roles?.includes("APC") ? "APC" : enemy?.roles?.includes("ADC") ? "ADC" : "";
  return { ...draft, enemyRole, lane };
}

function getTriggeredRules(draft, lane) {
  const ctx = getDraftContext(draft, lane);
  return draftRules.filter((r) => {
    if (r.lanes?.length && !r.lanes.includes(lane)) return false;
    return evaluateCondition(r.condition, ctx);
  });
}

function getRulesForChampion(champ, draft, lane) {
  return getTriggeredRules(draft, lane).filter(
    (r) =>
      r.text.toLowerCase().includes(champ.name.toLowerCase()) ||
      r.condition.includes(`'${champ.name}'`)
  );
}

function getDraftKeywords(draft, lane) {
  const keywords = new Set();
  const names = getDraftValues(draft);

  names.forEach((name) => {
    keywords.add(name.toLowerCase());
    const champ = byName(name);
    if (!champ) return;
    if (champ.archetype) keywords.add(champ.archetype.toLowerCase());
    (champ.playstyle || []).forEach((p) => keywords.add(p.toLowerCase()));
  });

  const enemySup = byName(draft.enemySupport);
  if (enemySup?.archetype === "Hook") ["hook", "hooks", "pick", "positioning"].forEach((k) => keywords.add(k));
  if (enemySup?.archetype === "Engage") ["engage", "dive", "all-in", "gap closer"].forEach((k) => keywords.add(k));
  if (enemySup?.archetype === "Enchanter") ["enchanter", "sustain", "peel", "protect"].forEach((k) => keywords.add(k));
  if (enemySup?.archetype === "Poke") ["poke", "siege", "pressure"].forEach((k) => keywords.add(k));

  return { keywords, names, lane };
}

function conditionApplies(text, ctx) {
  const lower = text.toLowerCase();
  if (ctx.names.some((n) => lower.includes(n.toLowerCase()))) return true;
  for (const kw of ctx.keywords) {
    if (lower.includes(kw)) return true;
  }
  return false;
}

function evaluateConditions(champ, draft, lane) {
  const reasons = [];
  const warnings = [];
  let scoreDelta = 0;
  const conditions = getMatchups(champ, lane).conditions;
  if (!conditions) return { reasons, warnings, scoreDelta };

  const ctx = getDraftKeywords(draft, lane);
  (conditions.green || []).forEach((text) => {
    if (conditionApplies(text, ctx)) {
      scoreDelta += SCORE.conditionGreen;
      reasons.push({ label: "Good fit for this draft", text });
    }
  });
  (conditions.red || []).forEach((text) => {
    if (conditionApplies(text, ctx)) {
      scoreDelta += SCORE.conditionRed;
      warnings.push({ label: "Draft warning", text });
    }
  });

  return { reasons, warnings, scoreDelta };
}

function getFlexWarnings(draft) {
  const selected = new Set(getDraftValues(draft));
  return (typeof otherInfo !== "undefined" ? otherInfo.flexPicks : []).filter(
    (fp) => selected.has(fp.name) && fp.lanes?.length > 1
  );
}

function renderFlexBanner(draft) {
  const flex = getFlexWarnings(draft);
  if (!flex.length) return "";
  return `<div class="flex-banner"><h3>Flex pick warning</h3><ul>${flex
    .map((f) => `<li><strong>${esc(f.name)}</strong> — ${esc(f.note)} (${esc(f.lanes.join(" / "))})</li>`)
    .join("")}</ul></div>`;
}

function renderGlobalConditions(lane) {
  const items = (typeof otherInfo !== "undefined" ? otherInfo.globalConditions : []).filter(
    (g) => !g.lanes?.length || g.lanes.includes(lane)
  );
  if (!items.length) return "";
  return `<div class="rules-banner global-cond"><h3>Global notes</h3><ul>${items
    .map((g) => `<li>${esc(g.text)}</li>`)
    .join("")}</ul></div>`;
}

/* ── scoring ── */

function scorePlaystyle(champ, yourSup, enemySup) {
  let bonus = 0;
  const styles = champ.playstyle || [];
  if (yourSup?.archetype === "Engage" && styles.some((s) => ["all-in", "lane bully", "snowball"].includes(s)))
    bonus += SCORE.playstyle;
  if (yourSup?.archetype === "Enchanter" && styles.some((s) => ["hypercarry", "scaling", "safe"].includes(s)))
    bonus += SCORE.playstyle;
  if (enemySup?.archetype === "Hook" && styles.some((s) => ["safe", "kiting", "poke"].includes(s)))
    bonus += SCORE.playstyle;
  if (enemySup?.archetype === "Engage" && styles.some((s) => ["kiting", "safe", "utility"].includes(s)))
    bonus += SCORE.playstyle;
  return bonus;
}

function scoreChampion(champ, draft, lane) {
  const reasons = [];
  const warnings = [];
  let score = 0;
  const cv = withLaneMatchups(champ, lane);

  if (lane === "Dragon" || lane === "Support") {
    const { enemyADC, enemySupport, yourSupport, yourAlly } = draft;
    const yourSup = lane === "Dragon" ? byName(yourSupport) : null;
    const yourCarry = lane === "Support" ? byName(yourAlly) : null;
    const enemySup = byName(enemySupport);
    const enemyCarry = byName(enemyADC);

    const enemies = [
      [enemyADC, "Enemy carry"],
      [enemySupport, "Enemy support"]
    ];
    enemies.forEach(([name, lbl]) => {
      if (!name) return;
      const good = findMatch(cv.goodAgainst, name);
      if (good) {
        score += SCORE.goodAgainst;
        reasons.push({ label: `${lbl} counter`, text: good.note || `Strong into ${name}` });
      }
      const bad = findMatch(cv.badAgainst, name);
      if (bad) {
        score += SCORE.badAgainst;
        warnings.push({ label: `${lbl} weak`, text: bad.note || `Struggles vs ${name}` });
      }
      const enemy = byName(name);
      if (enemy) {
        const ev = withLaneMatchups(enemy, lane);
        const revG = findMatch(ev.badAgainst, champ.name);
        if (revG && !bad) {
          score += SCORE.reverseCounter;
          reasons.push({ label: "Enemy hates this", text: revG.note || `${name} weak into you` });
        }
        const revB = findMatch(ev.goodAgainst, champ.name);
        if (revB && !good) {
          score += SCORE.reverseWeak;
          warnings.push({ label: "Enemy favors lane", text: revB.note || `${name} strong into you` });
        }
      }
    });

    if (lane === "Dragon" && yourSupport) {
      const syn = findMatch((champ.synergies || []).map(normalizeEntry), yourSupport);
      const synSup = yourSup ? findMatch((yourSup.synergies || []).map(normalizeEntry), champ.name) : null;
      if (syn || synSup) {
        score += SCORE.synergy;
        reasons.push({ label: "Support synergy", text: syn?.note || synSup?.note || `Works with ${yourSupport}` });
      }
      const avoid = findMatch(champ.avoidSynergies, yourSupport);
      const avoidSup = yourSup ? findMatch(yourSup.avoidSynergies, champ.name) : null;
      if (avoid || avoidSup) {
        score += SCORE.avoidSynergy;
        warnings.push({ label: "Bad pairing", text: avoid?.note || avoidSup?.note || `Clashes with ${yourSupport}` });
      }
    }

    if (lane === "Support" && yourAlly) {
      const syn = findMatch((champ.synergies || []).map(normalizeEntry), yourAlly);
      const synCarry = yourCarry ? findMatch((yourCarry.synergies || []).map(normalizeEntry), champ.name) : null;
      if (syn || synCarry) {
        score += SCORE.synergy;
        reasons.push({ label: "Carry synergy", text: syn?.note || synCarry?.note || `Works with ${yourAlly}` });
      }
      const avoid = findMatch(champ.avoidSynergies, yourAlly);
      if (avoid) {
        score += SCORE.avoidSynergy;
        warnings.push({ label: "Bad pairing", text: avoid.note || `Clashes with ${yourAlly}` });
      }
    }

    if (lane === "Support" && enemySup && byName(draft.yourAlly)) {
      /* support vs support when evaluating your support pick */
    }

    if (yourSup && enemySup && lane === "Dragon") {
      const yv = withLaneMatchups(yourSup, "Support");
      const wins = findMatch(yv.goodAgainst, enemySupport);
      if (wins) {
        score += SCORE.supLaneGood;
        reasons.push({ label: "Your sup wins matchup", text: wins.note || `${yourSupport} beats ${enemySupport}` });
      }
      const loses = findMatch(yv.badAgainst, enemySupport);
      if (loses) {
        score += SCORE.supLaneBad;
        warnings.push({ label: "Your sup loses matchup", text: loses.note || `${yourSupport} struggles` });
      }
    }

    const ps = scorePlaystyle(champ, yourSup || withLaneMatchups(champ, "Support"), enemySup);
    if (ps > 0) {
      score += ps;
      reasons.push({ label: "Playstyle fit", text: "Comp lines up with this pick." });
    }
  } else {
    const enemyName = draft.enemy1;
    if (enemyName) {
      const good = findMatch(cv.goodAgainst, enemyName);
      if (good) {
        score += SCORE.goodAgainst;
        reasons.push({ label: "Counters enemy", text: good.note || `Strong into ${enemyName}` });
      }
      const bad = findMatch(cv.badAgainst, enemyName);
      if (bad) {
        score += SCORE.badAgainst;
        warnings.push({ label: "Weak into enemy", text: bad.note || `Struggles vs ${enemyName}` });
      }
      const enemy = byName(enemyName);
      if (enemy) {
        const ev = withLaneMatchups(enemy, lane);
        const revG = findMatch(ev.badAgainst, champ.name);
        if (revG && !bad) {
          score += SCORE.reverseCounter;
          reasons.push({ label: "Enemy hates this", text: revG.note });
        }
        const revB = findMatch(ev.goodAgainst, champ.name);
        if (revB && !good) {
          score += SCORE.reverseWeak;
          warnings.push({ label: "Enemy favors lane", text: revB.note });
        }
      }
    }
  }

  const cond = evaluateConditions(champ, draft, lane);
  score += cond.scoreDelta;
  reasons.push(...cond.reasons);
  warnings.push(...cond.warnings);

  getRulesForChampion(champ, draft, lane).forEach((r) => {
    score += SCORE.draftRule;
    reasons.push({ label: "Draft rule", text: r.text });
  });

  return { score, reasons, warnings };
}

function getRecommendations(draft, lane) {
  const cfg = LANE_CONFIG[lane];
  if (!getDraftValues(draft).length) return [];

  return getChampionsByLane(cfg.pickLane)
    .filter(cfg.isPick)
    .map((champ) => ({ champ, ...scoreChampion(champ, draft, lane) }))
    .sort((a, b) => b.score - a.score || a.champ.name.localeCompare(b.champ.name))
    .slice(0, 8);
}

/* ── filtering ── */

function filterAlmanac() {
  let list = getChampionsByLane(state.activeLane);

  if (state.roleFilter !== "All") {
    list = list.filter((c) => c.roles?.includes(state.roleFilter));
  }

  if (state.playstyleFilter !== "All") {
    list = list.filter((c) => (c.playstyle || []).includes(state.playstyleFilter));
  }

  const q = state.search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.playstyle || []).some((p) => p.toLowerCase().includes(q)) ||
        (c.archetype || "").toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => a.name.localeCompare(b.name));
}

function getSubRoleFilters() {
  if (state.activeLane === "Dragon") return ["All", "ADC", "APC"];
  return ["All"];
}

/* ── persistence ── */

function saveDraft() {
  try {
    localStorage.setItem(
      "laneLedgerState",
      JSON.stringify({ activeLane: state.activeLane, draft: state.draft })
    );
  } catch { /* ignore */ }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem("laneLedgerState") || localStorage.getItem("laneLedgerDraft");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.activeLane) state.activeLane = parsed.activeLane;
    if (parsed.draft) state.draft = { ...EMPTY_DRAFT, ...parsed.draft };
  } catch { /* ignore */ }
}

/* ── rendering ── */

function esc(str) {
  if (str == null) return "";
  const d = document.createElement("div");
  d.textContent = String(str);
  return d.innerHTML;
}

function renderLaneChips() {
  return `
    <div class="chip-row lane-row">
      ${LANES.map(
        (l) =>
          `<button type="button" class="chip chip-lane badge-lane-${l.toLowerCase()} ${state.activeLane === l ? "active" : ""}" data-lane="${l}">${l}</button>`
      ).join("")}
    </div>`;
}

function renderMatchupList(items, cls) {
  if (!items?.length) return `<p class="muted">None listed</p>`;
  return `<ul class="matchup-list ${cls}">${items
    .map((e) => {
      const { name, note } = normalizeEntry(e);
      return `<li><strong>${esc(name)}</strong>${note ? `<span>${esc(note)}</span>` : ""}</li>`;
    })
    .join("")}</ul>`;
}

function renderConditions(conditions) {
  if (!conditions) return "";
  let html = "";
  if (conditions.green?.length) {
    html += `<div class="cond-block green"><h4>Pick when</h4><ul>${conditions.green.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div>`;
  }
  if (conditions.red?.length) {
    html += `<div class="cond-block red"><h4>Avoid when</h4><ul>${conditions.red.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div>`;
  }
  return html;
}

function getContextualMatchups(champ, draft, lane) {
  const m = getMatchups(champ, lane);
  const targets = getDraftValues(draft);
  const pick = (list) => (list || []).map(normalizeEntry).filter((e) => targets.includes(e.name));

  return {
    goodVsEnemy: pick(m.goodAgainst),
    badVsEnemy: pick(m.badAgainst),
    synergies: pick((champ.synergies || []).map(normalizeEntry)),
    avoidSynergies: pick(champ.avoidSynergies)
  };
}

function renderContextualMatchups(champ, draft, lane) {
  const ctx = getContextualMatchups(champ, draft, lane);
  const hasAny = ctx.goodVsEnemy.length || ctx.badVsEnemy.length || ctx.synergies.length || ctx.avoidSynergies.length;
  if (!hasAny) return "";

  return `
    <div class="context-matchups">
      <h4>This draft</h4>
      <div class="detail-grid">
        ${ctx.goodVsEnemy.length ? `<div><h4>Your edge</h4>${renderMatchupList(ctx.goodVsEnemy, "good")}</div>` : ""}
        ${ctx.badVsEnemy.length ? `<div><h4>Their edge</h4>${renderMatchupList(ctx.badVsEnemy, "bad")}</div>` : ""}
        ${ctx.synergies.length ? `<div><h4>Synergies</h4>${renderMatchupList(ctx.synergies, "good")}</div>` : ""}
        ${ctx.avoidSynergies.length ? `<div><h4>Avoid</h4>${renderMatchupList(ctx.avoidSynergies, "bad")}</div>` : ""}
      </div>
    </div>`;
}

function renderDraftContextCard(champ) {
  const role = primaryRole(champ);
  return `
    <article class="context-card">
      <div class="context-card-head">
        <span class="badge badge-${ROLE_COLORS[role] || "adc"}">${esc(role)}</span>
        <strong>${esc(champ.name)}</strong>
        ${flexBadge(champ)}
      </div>
      ${(champ.playstyle || []).length ? `<p class="context-tags">${(champ.playstyle || []).map((p) => `<span class="tag">${esc(p)}</span>`).join("")}</p>` : ""}
      ${champ.caution ? `<p class="caution compact">⚠ ${esc(champ.caution)}</p>` : ""}
    </article>`;
}

function renderDraftContextStrip(draft, lane) {
  const cfg = LANE_CONFIG[lane];
  const slots = cfg.fields
    .map((f) => ({ label: f.label.replace("Enemy ", "Enemy ").replace("Your ", "Your "), name: draft[f.key] }))
    .filter((s) => s.name);

  if (!slots.length) return "";

  return `
    <div class="context-strip">
      <h3>Lane intel</h3>
      <div class="context-cards">
        ${slots
          .map((s) => {
            const champ = byName(s.name);
            return champ
              ? `<div class="context-slot"><span class="context-label">${esc(s.label)}</span>${renderDraftContextCard(champ)}</div>`
              : "";
          })
          .join("")}
      </div>
    </div>`;
}

function renderChampionDetail(champ) {
  const lane = state.activeLane;
  const m = getMatchups(champ, lane);
  const role = primaryRole(champ);
  const rules = getRulesForChampion(champ, state.draft, lane);

  return `
    <div class="detail-panel">
      <div class="detail-header">
        <span class="badge badge-${ROLE_COLORS[role] || "adc"}">${esc(role)}</span>
        ${champ.archetype ? `<span class="badge badge-archetype">${esc(champ.archetype)}</span>` : ""}
        ${champ.category ? `<span class="tag">${esc(champ.category)}</span>` : ""}
        ${flexBadge(champ)}
        ${(champ.playstyle || []).map((p) => `<span class="tag">${esc(p)}</span>`).join("")}
      </div>
      ${champ.caution ? `<p class="caution">⚠ ${esc(champ.caution)}</p>` : ""}
      ${champ.tips ? `<p class="tips">💡 ${esc(champ.tips)}</p>` : ""}
      ${champ.strengths?.length ? `<p class="strengths"><strong>Strengths:</strong> ${esc(champ.strengths.join(", "))}</p>` : ""}
      <div class="detail-grid">
        <div><h4>Good against (${esc(lane)})</h4>${renderMatchupList(m.goodAgainst, "good")}</div>
        <div><h4>Bad against (${esc(lane)})</h4>${renderMatchupList(m.badAgainst, "bad")}</div>
        <div><h4>Synergies</h4>${renderMatchupList((champ.synergies || []).map(normalizeEntry), "good")}</div>
        <div><h4>Avoid synergies</h4>${renderMatchupList(champ.avoidSynergies, "bad")}</div>
      </div>
      ${renderConditions(m.conditions)}
      ${rules.length ? `<div class="rules-block"><h4>Relevant draft rules</h4><ul>${rules.map((r) => `<li>${esc(r.text)}</li>`).join("")}</ul></div>` : ""}
    </div>`;
}

function renderDraftPickDetail(champ, draft, lane, reasons, warnings) {
  return `
    <div class="rec-body">
      ${
        reasons.length
          ? `<div class="why"><h4>Why pick this</h4><ul>${reasons.map((r) => `<li><strong>${esc(r.label)}:</strong> ${esc(r.text)}</li>`).join("")}</ul></div>`
          : `<p class="muted">No strong signals — check almanac below.</p>`
      }
      ${warnings.length ? `<div class="watch"><h4>What to watch out for</h4><ul>${warnings.map((w) => `<li><strong>${esc(w.label)}:</strong> ${esc(w.text)}</li>`).join("")}</ul></div>` : ""}
      ${renderContextualMatchups(champ, draft, lane)}
      <div class="almanac-in-draft">
        <h4>Full almanac entry</h4>
        ${renderChampionDetail(champ)}
      </div>
      <button class="btn-copy" type="button" data-copy="${esc(champ.name)}">Copy pick name</button>
    </div>`;
}

function renderAlmanac() {
  const list = filterAlmanac();
  const playstyles = getPlaystyles();
  const subRoles = getSubRoleFilters();

  return `
    <section class="panel">
      ${renderLaneChips()}
      <div class="search-row">
        <input type="search" id="search-input" placeholder="Search ${esc(state.activeLane)} champions…" value="${esc(state.search)}" autocomplete="off" />
      </div>
      ${
        subRoles.length > 1
          ? `<div class="chip-row">${subRoles
              .map((r) => `<button type="button" class="chip ${state.roleFilter === r ? "active" : ""}" data-role="${r}">${r}</button>`)
              .join("")}</div>`
          : ""
      }
      <div class="chip-row chip-row-sm">
        <button type="button" class="chip chip-sm ${state.playstyleFilter === "All" ? "active" : ""}" data-playstyle="All">All styles</button>
        ${playstyles.map(
          (p) =>
            `<button type="button" class="chip chip-sm ${state.playstyleFilter === p ? "active" : ""}" data-playstyle="${esc(p)}">${esc(p)}</button>`
        ).join("")}
      </div>
      <p class="result-count">${list.length} champion${list.length !== 1 ? "s" : ""} · ${esc(state.activeLane)}</p>
      <div class="card-list">
        ${list.length === 0 ? `<p class="empty">No champions match your filters.</p>` : ""}
        ${list
          .map((champ) => {
            const role = primaryRole(champ);
            const open = state.expandedChampion === champ.name;
            return `
              <article class="card ${open ? "open" : ""}" data-champion="${esc(champ.name)}">
                <button class="card-head" type="button">
                  <span class="badge badge-${ROLE_COLORS[role] || "adc"}">${esc(role)}</span>
                  <span class="card-name">${esc(champ.name)}</span>
                  ${flexBadge(champ)}
                  <span class="chevron">${open ? "▾" : "▸"}</span>
                </button>
                ${open ? renderChampionDetail(champ) : ""}
              </article>`;
          })
          .join("")}
      </div>
    </section>`;
}

function renderDraftSelect(field, draft) {
  const lane = state.activeLane;
  const options = getPoolChampions(field.pool, lane);

  return `
    <label class="field">
      <span>${esc(field.label)}</span>
      <select id="${field.id}" data-draft-key="${field.key}">
        <option value="">— optional —</option>
        ${options.map((c) => `<option value="${esc(c.name)}" ${draft[field.key] === c.name ? "selected" : ""}>${esc(c.name)}</option>`).join("")}
      </select>
    </label>`;
}

function renderDraft() {
  const lane = state.activeLane;
  const cfg = LANE_CONFIG[lane];
  const recs = getRecommendations(state.draft, lane);
  const triggered = getTriggeredRules(state.draft, lane);

  return `
    <section class="panel">
      ${renderLaneChips()}
      <p class="panel-desc">${esc(cfg.desc)}</p>
      <div class="draft-fields">${cfg.fields.map((f) => renderDraftSelect(f, state.draft)).join("")}</div>
      ${renderDraftContextStrip(state.draft, lane)}
      ${renderFlexBanner(state.draft)}
      ${renderGlobalConditions(lane)}
      ${
        triggered.length
          ? `<div class="rules-banner"><h3>Active draft rules</h3><ul>${triggered.map((r) => `<li>${esc(r.text)}</li>`).join("")}</ul></div>`
          : ""
      }
      <div class="rec-list">
        ${
          !getDraftValues(state.draft).length
            ? `<p class="empty">Pick at least one field to see recommendations.</p>`
            : recs.length === 0
              ? `<p class="empty">No picks found for ${esc(lane)}.</p>`
              : recs
                  .map(({ champ, score, reasons, warnings }) => {
                    const role = primaryRole(champ);
                    const open = state.expandedPick === champ.name;
                    const scoreCls = score > 0 ? "pos" : score < 0 ? "neg" : "neutral";
                    return `
                      <article class="rec-card ${open ? "open" : ""}" data-pick="${esc(champ.name)}">
                        <button class="rec-head" type="button">
                          <div class="rec-title">
                            <span class="badge badge-${ROLE_COLORS[role] || "adc"}">${esc(role)}</span>
                            <span class="rec-name">${esc(champ.name)}</span>
                          </div>
                          <span class="score score-${scoreCls}">${score > 0 ? "+" : ""}${score}</span>
                        </button>
                        ${open ? renderDraftPickDetail(champ, state.draft, lane, reasons, warnings) : ""}
                      </article>`;
                  })
                  .join("")
        }
      </div>
    </section>`;
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <header class="header">
      <div>
        <h1>Lane Ledger</h1>
        <p class="subtitle">Wild Rift draft companion · 5 lanes</p>
      </div>
      <p class="meta">${typeof lastUpdated !== "undefined" ? `Updated ${lastUpdated}` : ""}${typeof metaNote !== "undefined" && metaNote ? ` · ${esc(metaNote)}` : ""}</p>
    </header>
    <nav class="tabs">
      <button type="button" class="tab ${state.tab === "almanac" ? "active" : ""}" data-tab="almanac">Almanac</button>
      <button type="button" class="tab ${state.tab === "draft" ? "active" : ""}" data-tab="draft">Draft Helper</button>
    </nav>
    ${state.tab === "almanac" ? renderAlmanac() : renderDraft()}
  `;
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.tab = btn.dataset.tab;
      render();
    });
  });

  document.querySelectorAll("[data-lane]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeLane = btn.dataset.lane;
      state.roleFilter = "All";
      state.playstyleFilter = "All";
      state.expandedChampion = null;
      state.expandedPick = null;
      saveDraft();
      render();
    });
  });

  const search = document.getElementById("search-input");
  if (search) {
    search.addEventListener("input", (e) => {
      state.search = e.target.value;
      render();
      const el = document.getElementById("search-input");
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  }

  document.querySelectorAll("[data-role]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.roleFilter = btn.dataset.role;
      state.expandedChampion = null;
      render();
    });
  });

  document.querySelectorAll("[data-playstyle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.playstyleFilter = btn.dataset.playstyle;
      render();
    });
  });

  document.querySelectorAll("[data-champion]").forEach((card) => {
    card.querySelector(".card-head")?.addEventListener("click", () => {
      const name = card.dataset.champion;
      state.expandedChampion = state.expandedChampion === name ? null : name;
      render();
    });
  });

  document.querySelectorAll("[data-draft-key]").forEach((sel) => {
    sel.addEventListener("change", (e) => {
      state.draft[sel.dataset.draftKey] = e.target.value;
      state.expandedPick = null;
      saveDraft();
      render();
    });
  });

  document.querySelectorAll("[data-pick]").forEach((card) => {
    card.querySelector(".rec-head")?.addEventListener("click", () => {
      const name = card.dataset.pick;
      state.expandedPick = state.expandedPick === name ? null : name;
      render();
    });
  });

  document.querySelectorAll(".btn-copy").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const name = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(name);
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = "Copy pick name";
        }, 1500);
      } catch {
        btn.textContent = name;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadDraft();
  render();
});
