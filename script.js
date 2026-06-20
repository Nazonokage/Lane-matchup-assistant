/* Lane Ledger — core logic */

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

const ROLE_COLORS = { ADC: "adc", Support: "support", APC: "apc" };

const state = {
  tab: "almanac",
  search: "",
  roleFilter: "All",
  playstyleFilter: "All",
  expandedChampion: null,
  expandedPick: null,
  draft: { enemyADC: "", enemySupport: "", yourSupport: "" }
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

function hasMatch(list, target) {
  if (!list || !target) return false;
  return list.some((e) => entryName(e) === target);
}

function findMatch(list, target) {
  if (!list || !target) return null;
  return list.map(normalizeEntry).find((e) => e.name === target) || null;
}

function isCarry(champ) {
  return champ.roles.includes("ADC") || champ.roles.includes("APC");
}

function primaryRole(champ) {
  if (champ.roles.includes("ADC")) return "ADC";
  if (champ.roles.includes("APC")) return "APC";
  if (champ.roles.includes("Support")) return "Support";
  return champ.roles[0];
}

function getPlaystyles() {
  const set = new Set();
  championData.forEach((c) => (c.playstyle || []).forEach((p) => set.add(p)));
  return [...set].sort();
}

function getChampionsByRole(role) {
  if (role === "All") return [...championData].sort((a, b) => a.name.localeCompare(b.name));
  return championData
    .filter((c) => c.roles.includes(role))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function evaluateCondition(condition, ctx) {
  try {
    return Function(
      "enemyADC",
      "enemySupport",
      "yourSupport",
      "enemyRole",
      `return ${condition}`
    )(ctx.enemyADC, ctx.enemySupport, ctx.yourSupport, ctx.enemyRole);
  } catch {
    return false;
  }
}

function getDraftContext(draft) {
  const enemy = byName(draft.enemyADC);
  const enemyRole = enemy?.roles.includes("APC") ? "APC" : enemy?.roles.includes("ADC") ? "ADC" : "";
  return { ...draft, enemyRole };
}

function getTriggeredRules(draft) {
  const ctx = getDraftContext(draft);
  return draftRules.filter((r) => evaluateCondition(r.condition, ctx));
}

function getRulesForChampion(champ, draft) {
  const triggered = getTriggeredRules(draft);
  return triggered.filter(
    (r) =>
      r.text.toLowerCase().includes(champ.name.toLowerCase()) ||
      r.condition.includes(`'${champ.name}'`)
  );
}

function getDraftKeywords(draft) {
  const keywords = new Set();
  const names = [draft.enemyADC, draft.enemySupport, draft.yourSupport].filter(Boolean);

  names.forEach((name) => {
    keywords.add(name.toLowerCase());
    const champ = byName(name);
    if (!champ) return;
    if (champ.archetype) keywords.add(champ.archetype.toLowerCase());
    (champ.playstyle || []).forEach((p) => keywords.add(p.toLowerCase()));
  });

  const enemySup = byName(draft.enemySupport);
  if (enemySup?.archetype === "Hook") {
    ["hook", "hooks", "pick", "positioning"].forEach((k) => keywords.add(k));
  }
  if (enemySup?.archetype === "Engage") {
    ["engage", "dive", "all-in", "gap closer"].forEach((k) => keywords.add(k));
  }
  if (enemySup?.archetype === "Enchanter") {
    ["enchanter", "sustain", "peel", "protect"].forEach((k) => keywords.add(k));
  }
  if (enemySup?.archetype === "Poke") {
    ["poke", "siege", "pressure"].forEach((k) => keywords.add(k));
  }

  return { keywords, names };
}

function conditionApplies(text, ctx) {
  const lower = text.toLowerCase();
  if (ctx.names.some((n) => lower.includes(n.toLowerCase()))) return true;
  for (const kw of ctx.keywords) {
    if (lower.includes(kw)) return true;
  }
  return false;
}

function evaluateConditions(champ, draft) {
  const reasons = [];
  const warnings = [];
  let scoreDelta = 0;
  if (!champ.conditions) return { reasons, warnings, scoreDelta };

  const ctx = getDraftKeywords(draft);
  (champ.conditions.green || []).forEach((text) => {
    if (conditionApplies(text, ctx)) {
      scoreDelta += SCORE.conditionGreen;
      reasons.push({ label: "Good fit for this draft", text });
    }
  });
  (champ.conditions.red || []).forEach((text) => {
    if (conditionApplies(text, ctx)) {
      scoreDelta += SCORE.conditionRed;
      warnings.push({ label: "Draft warning", text });
    }
  });

  return { reasons, warnings, scoreDelta };
}

function getContextualMatchups(champ, draft) {
  const { enemyADC, enemySupport, yourSupport } = draft;
  const pick = (list, targets) =>
    (list || []).map(normalizeEntry).filter((e) => targets.filter(Boolean).includes(e.name));

  return {
    goodVsEnemy: pick(champ.goodAgainst, [enemyADC, enemySupport]),
    badVsEnemy: pick(champ.badAgainst, [enemyADC, enemySupport]),
    synergies: pick((champ.synergies || []).map(normalizeEntry), [yourSupport]),
    avoidSynergies: pick(champ.avoidSynergies, [yourSupport])
  };
}

function renderContextualMatchups(champ, draft) {
  const ctx = getContextualMatchups(champ, draft);
  const hasAny =
    ctx.goodVsEnemy.length ||
    ctx.badVsEnemy.length ||
    ctx.synergies.length ||
    ctx.avoidSynergies.length;
  if (!hasAny) return "";

  return `
    <div class="context-matchups">
      <h4>This draft</h4>
      <div class="detail-grid">
        ${ctx.goodVsEnemy.length ? `<div><h4>Your edge</h4>${renderMatchupList(ctx.goodVsEnemy, "good")}</div>` : ""}
        ${ctx.badVsEnemy.length ? `<div><h4>Their edge</h4>${renderMatchupList(ctx.badVsEnemy, "bad")}</div>` : ""}
        ${ctx.synergies.length ? `<div><h4>Works with your sup</h4>${renderMatchupList(ctx.synergies, "good")}</div>` : ""}
        ${ctx.avoidSynergies.length ? `<div><h4>Clashes with your sup</h4>${renderMatchupList(ctx.avoidSynergies, "bad")}</div>` : ""}
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
        ${champ.archetype ? `<span class="archetype">${esc(champ.archetype)}</span>` : ""}
      </div>
      ${(champ.playstyle || []).length ? `<p class="context-tags">${(champ.playstyle || []).map((p) => `<span class="tag">${esc(p)}</span>`).join("")}</p>` : ""}
      ${champ.caution ? `<p class="caution compact">⚠ ${esc(champ.caution)}</p>` : ""}
    </article>`;
}

function renderDraftContextStrip(draft) {
  const slots = [
    { label: "Enemy support", name: draft.enemySupport },
    { label: "Enemy carry", name: draft.enemyADC },
    { label: "Your support", name: draft.yourSupport }
  ].filter((s) => s.name);

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

/* ── scoring ── */

function scorePlaystyle(champ, yourSup, enemySup) {
  let bonus = 0;
  const styles = champ.playstyle || [];

  if (yourSup?.archetype === "Engage" && styles.some((s) => ["all-in", "lane bully", "snowball"].includes(s))) {
    bonus += SCORE.playstyle;
  }
  if (yourSup?.archetype === "Enchanter" && styles.some((s) => ["hypercarry", "scaling", "safe"].includes(s))) {
    bonus += SCORE.playstyle;
  }
  if (enemySup?.archetype === "Hook" && styles.some((s) => ["safe", "kiting", "poke"].includes(s))) {
    bonus += SCORE.playstyle;
  }
  if (enemySup?.archetype === "Engage" && styles.some((s) => ["kiting", "safe", "utility"].includes(s))) {
    bonus += SCORE.playstyle;
  }

  return bonus;
}

function scoreChampion(champ, draft) {
  const reasons = [];
  const warnings = [];
  let score = 0;

  const { enemyADC, enemySupport, yourSupport } = draft;
  const yourSup = byName(yourSupport);
  const enemySup = byName(enemySupport);
  const enemyCarry = byName(enemyADC);

  // ── ADC/APC vs enemy carry (almanac goodAgainst / badAgainst) ──
  const goodVsCarry = findMatch(champ.goodAgainst, enemyADC);
  if (goodVsCarry) {
    score += SCORE.goodAgainst;
    reasons.push({ label: "Counters enemy carry", text: goodVsCarry.note || `Strong into ${enemyADC}` });
  }

  const badVsCarry = findMatch(champ.badAgainst, enemyADC);
  if (badVsCarry) {
    score += SCORE.badAgainst;
    warnings.push({ label: "Weak into enemy carry", text: badVsCarry.note || `Struggles vs ${enemyADC}` });
  }

  // ── Reverse lookup: enemy carry's almanac lists this pick ──
  if (enemyCarry) {
    const theyFearUs = findMatch(enemyCarry.badAgainst, champ.name);
    if (theyFearUs && !badVsCarry) {
      score += SCORE.reverseCounter;
      reasons.push({ label: "Enemy carry hates this", text: theyFearUs.note || `${enemyADC} is listed weak into you` });
    }
    const theyBeatUs = findMatch(enemyCarry.goodAgainst, champ.name);
    if (theyBeatUs && !goodVsCarry) {
      score += SCORE.reverseWeak;
      warnings.push({ label: "Enemy carry favors this lane", text: theyBeatUs.note || `${enemyADC} is listed strong into you` });
    }
  }

  // ── vs enemy support (some carries list supp matchups, e.g. Zyra vs hooks) ──
  const goodVsSup = findMatch(champ.goodAgainst, enemySupport);
  if (goodVsSup) {
    score += SCORE.goodAgainst;
    reasons.push({ label: "Handles enemy support", text: goodVsSup.note || `Good into ${enemySupport}` });
  }

  const badVsSup = findMatch(champ.badAgainst, enemySupport);
  if (badVsSup) {
    score += SCORE.badAgainst;
    warnings.push({ label: "Struggles vs enemy support", text: badVsSup.note || `Watch out for ${enemySupport}` });
  }

  // ── Synergy with your support (both directions from almanac) ──
  const synFromCarry = findMatch((champ.synergies || []).map(normalizeEntry), yourSupport);
  const synFromSup = yourSup ? findMatch((yourSup.synergies || []).map(normalizeEntry), champ.name) : null;

  if (synFromCarry || synFromSup) {
    score += SCORE.synergy;
    const note = synFromCarry?.note || synFromSup?.note;
    reasons.push({
      label: "Support synergy",
      text: note || `Pairs well with ${yourSupport}`
    });
  }

  const avoidFromCarry = findMatch(champ.avoidSynergies, yourSupport);
  const avoidFromSup = yourSup ? findMatch(yourSup.avoidSynergies, champ.name) : null;

  if (avoidFromCarry || avoidFromSup) {
    score += SCORE.avoidSynergy;
    const note = avoidFromCarry?.note || avoidFromSup?.note;
    warnings.push({
      label: "Bad support pairing",
      text: note || `Clashes with ${yourSupport}`
    });
  }

  // ── Support vs support lane (your sup almanac) ──
  if (yourSup && enemySupport) {
    const supWins = findMatch(yourSup.goodAgainst, enemySupport);
    if (supWins) {
      score += SCORE.supLaneGood;
      reasons.push({ label: "Your support wins sup matchup", text: supWins.note || `${yourSupport} beats ${enemySupport}` });
    }
    const supLoses = findMatch(yourSup.badAgainst, enemySupport);
    if (supLoses) {
      score += SCORE.supLaneBad;
      warnings.push({ label: "Your support loses sup matchup", text: supLoses.note || `${yourSupport} struggles vs ${enemySupport}` });
    }
  }

  // ── Playstyle + archetype fit ──
  const ps = scorePlaystyle(champ, yourSup, enemySup);
  if (ps > 0) {
    score += ps;
    reasons.push({ label: "Playstyle fit", text: "Lane comp lines up with this pick's strengths." });
  }

  // ── conditions.green / conditions.red from almanac ──
  const cond = evaluateConditions(champ, draft);
  score += cond.scoreDelta;
  reasons.push(...cond.reasons);
  warnings.push(...cond.warnings);

  // ── Draft rules ──
  getRulesForChampion(champ, draft).forEach((r) => {
    score += SCORE.draftRule;
    reasons.push({ label: "Draft rule", text: r.text });
  });

  return { score, reasons, warnings };
}

function getRecommendations(draft) {
  const hasInput = draft.enemyADC || draft.enemySupport || draft.yourSupport;
  if (!hasInput) return [];

  const carries = championData.filter(isCarry);
  return carries
    .map((champ) => ({ champ, ...scoreChampion(champ, draft) }))
    .sort((a, b) => b.score - a.score || a.champ.name.localeCompare(b.champ.name))
    .slice(0, 8);
}

/* ── filtering ── */

function filterAlmanac() {
  let list = championData;

  if (state.roleFilter !== "All") {
    list = list.filter((c) => c.roles.includes(state.roleFilter));
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
        (c.archetype || "").toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => a.name.localeCompare(b.name));
}

/* ── persistence ── */

function saveDraft() {
  try {
    localStorage.setItem("laneLedgerDraft", JSON.stringify(state.draft));
  } catch { /* offline / private mode */ }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem("laneLedgerDraft");
    if (raw) state.draft = { ...state.draft, ...JSON.parse(raw) };
  } catch { /* ignore */ }
}

/* ── rendering ── */

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
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
function renderDraftPickDetail(champ, draft, reasons, warnings) {
  return `
    <div class="rec-body">
      ${
        reasons.length
          ? `<div class="why"><h4>Why pick this</h4><ul>${reasons.map((r) => `<li><strong>${esc(r.label)}:</strong> ${esc(r.text)}</li>`).join("")}</ul></div>`
          : `<p class="muted">No strong signals from this draft — check full almanac below.</p>`
      }
      ${
        warnings.length
          ? `<div class="watch"><h4>What to watch out for</h4><ul>${warnings.map((w) => `<li><strong>${esc(w.label)}:</strong> ${esc(w.text)}</li>`).join("")}</ul></div>`
          : ""
      }
      ${renderContextualMatchups(champ, draft)}
      <div class="almanac-in-draft">
        <h4>Full almanac entry</h4>
        ${renderChampionDetail(champ)}
      </div>
      <button class="btn-copy" type="button" data-copy="${esc(champ.name)}">Copy pick name</button>
    </div>`;
}

function renderChampionDetail(champ) {
  const role = primaryRole(champ);
  const rules = getTriggeredRules(state.draft).filter(
    (r) => r.text.toLowerCase().includes(champ.name.toLowerCase()) || r.condition.includes(champ.name)
  );

  return `
    <div class="detail-panel">
      <div class="detail-header">
        <span class="badge badge-${ROLE_COLORS[role] || "adc"}">${esc(role)}</span>
        ${champ.archetype ? `<span class="badge badge-archetype">${esc(champ.archetype)}</span>` : ""}
        ${(champ.playstyle || []).map((p) => `<span class="tag">${esc(p)}</span>`).join("")}
      </div>
      ${champ.caution ? `<p class="caution">⚠ ${esc(champ.caution)}</p>` : ""}
      ${champ.tips ? `<p class="tips">💡 ${esc(champ.tips)}</p>` : ""}
      <div class="detail-grid">
        <div><h4>Good against</h4>${renderMatchupList(champ.goodAgainst, "good")}</div>
        <div><h4>Bad against</h4>${renderMatchupList(champ.badAgainst, "bad")}</div>
        <div><h4>Synergies</h4>${renderMatchupList((champ.synergies || []).map(normalizeEntry), "good")}</div>
        <div><h4>Avoid synergies</h4>${renderMatchupList(champ.avoidSynergies, "bad")}</div>
      </div>
      ${renderConditions(champ.conditions)}
      ${rules.length ? `<div class="rules-block"><h4>Relevant draft rules</h4><ul>${rules.map((r) => `<li>${esc(r.text)}</li>`).join("")}</ul></div>` : ""}
    </div>`;
}

function renderAlmanac() {
  const list = filterAlmanac();
  const playstyles = getPlaystyles();

  return `
    <section class="panel">
      <div class="search-row">
        <input type="search" id="search-input" placeholder="Search champions…" value="${esc(state.search)}" autocomplete="off" />
      </div>
      <div class="chip-row">
        ${["All", "ADC", "Support", "APC"].map(
          (r) =>
            `<button class="chip ${state.roleFilter === r ? "active" : ""}" data-role="${r}">${r}</button>`
        ).join("")}
      </div>
      <div class="chip-row chip-row-sm">
        <button class="chip chip-sm ${state.playstyleFilter === "All" ? "active" : ""}" data-playstyle="All">All styles</button>
        ${playstyles.map(
          (p) =>
            `<button class="chip chip-sm ${state.playstyleFilter === p ? "active" : ""}" data-playstyle="${esc(p)}">${esc(p)}</button>`
        ).join("")}
      </div>
      <p class="result-count">${list.length} champion${list.length !== 1 ? "s" : ""}</p>
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
                  ${champ.archetype ? `<span class="archetype">${esc(champ.archetype)}</span>` : ""}
                  <span class="chevron">${open ? "▾" : "▸"}</span>
                </button>
                ${open ? renderChampionDetail(champ) : ""}
              </article>`;
          })
          .join("")}
      </div>
    </section>`;
}

function renderDraftSelect(id, label, value, roleFilter) {
  const options = getChampionsByRole(roleFilter === "carry" ? "All" : roleFilter);
  const filtered =
    roleFilter === "carry"
      ? options.filter(isCarry)
      : roleFilter === "Support"
        ? options.filter((c) => c.roles.includes("Support"))
        : options;

  return `
    <label class="field">
      <span>${label}</span>
      <select id="${id}" data-draft="${id}">
        <option value="">— optional —</option>
        ${filtered.map((c) => `<option value="${esc(c.name)}" ${value === c.name ? "selected" : ""}>${esc(c.name)}</option>`).join("")}
      </select>
    </label>`;
}

function renderDraft() {
  const recs = getRecommendations(state.draft);
  const triggered = getTriggeredRules(state.draft);

  return `
    <section class="panel">
      <p class="panel-desc">Set enemy bot lane and your support. Recommendations update live.</p>
      <div class="draft-fields">
        ${renderDraftSelect("enemy-support", "Enemy Support", state.draft.enemySupport, "Support")}
        ${renderDraftSelect("enemy-adc", "Enemy ADC / APC", state.draft.enemyADC, "carry")}
        ${renderDraftSelect("your-support", "Your Support", state.draft.yourSupport, "Support")}
      </div>
      ${renderDraftContextStrip(state.draft)}
      ${
        triggered.length
          ? `<div class="rules-banner"><h3>Active draft rules</h3><ul>${triggered.map((r) => `<li>${esc(r.text)}</li>`).join("")}</ul></div>`
          : ""
      }
      <div class="rec-list">
        ${
          !state.draft.enemyADC && !state.draft.enemySupport && !state.draft.yourSupport
            ? `<p class="empty">Pick at least one field to see recommendations.</p>`
            : recs.length === 0
              ? `<p class="empty">No carry picks in roster.</p>`
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
                        ${
                          open ? renderDraftPickDetail(champ, state.draft, reasons, warnings) : ""
                        }
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
        <p class="subtitle">Bot lane draft companion</p>
      </div>
      <p class="meta">${typeof lastUpdated !== "undefined" ? `Updated ${lastUpdated}` : ""}${typeof metaNote !== "undefined" && metaNote ? ` · ${esc(metaNote)}` : ""}</p>
    </header>
    <nav class="tabs">
      <button class="tab ${state.tab === "almanac" ? "active" : ""}" data-tab="almanac">Almanac</button>
      <button class="tab ${state.tab === "draft" ? "active" : ""}" data-tab="draft">Draft Helper</button>
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

  ["enemy-adc", "enemy-support", "your-support"].forEach((id) => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.addEventListener("change", (e) => {
      const key = id === "enemy-adc" ? "enemyADC" : id === "enemy-support" ? "enemySupport" : "yourSupport";
      state.draft[key] = e.target.value;
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
        setTimeout(() => { btn.textContent = "Copy pick name"; }, 1500);
      } catch {
        btn.textContent = name;
      }
    });
  });
}

/* ── boot ── */

document.addEventListener("DOMContentLoaded", () => {
  loadDraft();
  render();
});
