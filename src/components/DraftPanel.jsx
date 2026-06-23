import { useMemo } from "react";
import {
  DRAFT_FIELD_DEFS,
  DRAFT_KEYS,
  LANE_CONFIG
} from "../lib/constants.js";
import {
  byName,
  getContextualMatchups,
  getDraftValues,
  getDraftedNamesExcept,
  getFlexWarnings,
  getGlobalConditions,
  getPoolChampions,
  getRecommendations,
  getTriggeredRules
} from "../lib/engine.js";
import ChampionDetail from "./ChampionDetail.jsx";
import LaneChips from "./LaneChips.jsx";
import {
  ChampionIcon,
  CopyButton,
  FlexBadge,
  IntelChip,
  MatchupList,
  RoleBadge
} from "./ui.jsx";

function DraftContextStrip({ draft, lane }) {
  const cfg = LANE_CONFIG[lane];
  const filled = DRAFT_KEYS.filter((k) => draft[k]).map((k) => ({
    key: k,
    name: draft[k],
    label: DRAFT_FIELD_DEFS[k].label
  }));

  if (!filled.length) return null;

  const fullKeys = new Set([cfg.directOpponent, cfg.lanePartner].filter(Boolean));
  const fullSlots = filled.filter((s) => fullKeys.has(s.key));
  const chipSlots = filled.filter((s) => !fullKeys.has(s.key));
  const fullLabels = {
    [cfg.directOpponent]: "Direct opponent",
    [cfg.lanePartner]: "Lane partner"
  };

  return (
    <div className="context-strip">
      <h3>Lane intel</h3>
      <div className="context-cards">
        {fullSlots.map((s) => {
          const champ = byName(s.name);
          if (!champ) return null;
          return (
            <div key={s.key} className="context-slot">
              <span className="context-label">{fullLabels[s.key] || s.label}</span>
              <article className="context-card">
                <div className="context-card-head">
                  <RoleBadge champ={champ} />
                  <strong>{champ.name}</strong>
                  <span className="tag" style={{ padding: "1px 4px" }}>
                    <ChampionIcon name={champ.name} alt={champ.name} size={14} />
                  </span>
                  <FlexBadge champ={champ} activeLane={lane} />
                </div>
                {(champ.playstyle || []).length ? (
                  <p className="context-tags">
                    {(champ.playstyle || []).map((p) => (
                      <span key={p} className="tag">{p}</span>
                    ))}
                  </p>
                ) : null}
                {champ.caution ? <p className="caution compact">⚠ {champ.caution}</p> : null}
              </article>
            </div>
          );
        })}
      </div>
      {chipSlots.length ? (
        <div className="intel-chips">
          {chipSlots.map((s) => {
            const champ = byName(s.name);
            return champ ? <IntelChip key={s.key} champ={champ} /> : null;
          })}
        </div>
      ) : null}
    </div>
  );
}

function ContextualMatchups({ champ, draft, lane }) {
  const ctx = getContextualMatchups(champ, draft, lane);
  const hasAny = ctx.goodVsEnemy.length || ctx.badVsEnemy.length || ctx.synergies.length || ctx.avoidSynergies.length;
  if (!hasAny) return null;

  return (
    <div className="context-matchups">
      <h4>This draft</h4>
      <div className="detail-grid">
        {ctx.goodVsEnemy.length ? (
          <div><h4>Your edge</h4><MatchupList items={ctx.goodVsEnemy} cls="good" /></div>
        ) : null}
        {ctx.badVsEnemy.length ? (
          <div><h4>Their edge</h4><MatchupList items={ctx.badVsEnemy} cls="bad" /></div>
        ) : null}
        {ctx.synergies.length ? (
          <div><h4>Synergies</h4><MatchupList items={ctx.synergies} cls="good" /></div>
        ) : null}
        {ctx.avoidSynergies.length ? (
          <div><h4>Avoid</h4><MatchupList items={ctx.avoidSynergies} cls="bad" /></div>
        ) : null}
      </div>
    </div>
  );
}

function DraftPickDetail({ champ, draft, lane, reasons, warnings }) {
  return (
    <div className="rec-body">
      {reasons.length ? (
        <div className="why">
          <h4>Why pick this</h4>
          <ul>
            {reasons.map((r, i) => (
              <li key={i}><strong>{r.label}:</strong> {r.text}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="muted">No strong signals — check almanac below.</p>
      )}
      {warnings.length ? (
        <div className="watch">
          <h4>What to watch out for</h4>
          <ul>
            {warnings.map((w, i) => (
              <li key={i}><strong>{w.label}:</strong> {w.text}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <ContextualMatchups champ={champ} draft={draft} lane={lane} />
      <div className="almanac-in-draft">
        <h4>Full almanac entry</h4>
        <ChampionDetail champ={champ} activeLane={lane} draft={draft} />
      </div>
      <CopyButton name={champ.name} />
    </div>
  );
}

function DraftSelect({ draftKey, draft, options, onChange }) {
  const def = DRAFT_FIELD_DEFS[draftKey];

  return (
    <label className="field">
      <span>{def.label}</span>
      <select
        value={draft[draftKey]}
        onChange={(e) => onChange(draftKey, e.target.value)}
      >
        <option value="">— optional —</option>
        {options.map((c) => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>
    </label>
  );
}

function RecommendationsPanel({ draft, lane, recommendationsOpen, expandedPick, onGetPicks, onTogglePick }) {
  if (!getDraftValues(draft).length) {
    return <p className="empty">Fill in at least one draft slot to get picks.</p>;
  }

  if (!recommendationsOpen) {
    return (
      <button type="button" className="btn-reveal" onClick={onGetPicks}>
        Get picks
      </button>
    );
  }

  const recs = getRecommendations(draft, lane);
  if (!recs.length) {
    return <p className="empty">No picks found for {LANE_CONFIG[lane].draftLabel}.</p>;
  }

  return recs.map(({ champ, score, reasons, warnings }) => {
    const open = expandedPick === champ.name;
    const scoreCls = score > 0 ? "pos" : score < 0 ? "neg" : "neutral";
    return (
      <article key={champ.name} className={`rec-card ${open ? "open" : ""}`}>
                <button type="button" className="rec-head" onClick={() => onTogglePick(champ.name)}>
          <div className="rec-title">
            <RoleBadge champ={champ} />
            <span className="rec-name">{champ.name}</span>
            <span className="tag" style={{ padding: "1px 4px" }}>
              <ChampionIcon name={champ.name} alt={champ.name} size={14} />
            </span>
          </div>
          <span className={`score score-${scoreCls}`}>{score > 0 ? "+" : ""}{score}</span>
        </button>
        {open ? (
          <DraftPickDetail champ={champ} draft={draft} lane={lane} reasons={reasons} warnings={warnings} />
        ) : null}
      </article>
    );
  });
}

export default function DraftPanel({
  activeLane,
  draft,
  recommendationsOpen,
  expandedPick,
  onLaneChange,
  onDraftChange,
  onGetPicks,
  onTogglePick
}) {
  const cfg = LANE_CONFIG[activeLane];
  const triggered = useMemo(
    () => getTriggeredRules(draft, activeLane),
    [draft, activeLane]
  );
  const flex = useMemo(() => getFlexWarnings(draft), [draft]);
  const globalCond = useMemo(() => getGlobalConditions(activeLane), [activeLane]);
  const selectOptions = useMemo(() => {
    const result = {};
    for (const key of DRAFT_KEYS) {
      const def = DRAFT_FIELD_DEFS[key];
      const taken = getDraftedNamesExcept(draft, key);
      result[key] = getPoolChampions(def.pool).filter(
        (c) => !taken.has(c.name) || draft[key] === c.name
      );
    }
    return result;
  }, [draft]);
  const enemyKeys = DRAFT_KEYS.filter((k) => k.startsWith("enemy"));
  const allyKeys = DRAFT_KEYS.filter((k) => k.startsWith("ally") && k !== cfg.hiddenAlly);

  return (
    <section className="panel">
      <LaneChips activeLane={activeLane} isDraft onSelect={onLaneChange} />
      <p className="panel-desc">{cfg.desc}</p>

      <div className="draft-group">
        <h3 className="draft-group-title">Enemy Team</h3>
        <div className="draft-fields">
          {enemyKeys.map((k) => (
            <DraftSelect key={k} draftKey={k} draft={draft} options={selectOptions[k]} onChange={onDraftChange} />
          ))}
        </div>
      </div>

      <div className="draft-group">
        <h3 className="draft-group-title">Your Team</h3>
        <div className="draft-fields">
          {allyKeys.map((k) => (
            <DraftSelect key={k} draftKey={k} draft={draft} options={selectOptions[k]} onChange={onDraftChange} />
          ))}
        </div>
      </div>

      <DraftContextStrip draft={draft} lane={activeLane} />

      {flex.length ? (
        <div className="flex-banner">
          <h3>Flex pick warning</h3>
          <ul>
            {flex.map((f) => (
              <li key={f.name}>
                <strong>{f.name}</strong> — {f.note} ({f.lanes.join(" / ")})
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {globalCond.length ? (
        <div className="rules-banner global-cond">
          <h3>Global notes</h3>
          <ul>{globalCond.map((g, i) => <li key={i}>{g.text}</li>)}</ul>
        </div>
      ) : null}

      {triggered.length ? (
        <div className="rules-banner">
          <h3>Active draft rules</h3>
          <ul>{triggered.map((r) => <li key={r.id || r.text}>{r.text}</li>)}</ul>
        </div>
      ) : null}

      <div className="rec-list">
        <RecommendationsPanel
          draft={draft}
          lane={activeLane}
          recommendationsOpen={recommendationsOpen}
          expandedPick={expandedPick}
          onGetPicks={onGetPicks}
          onTogglePick={onTogglePick}
        />
      </div>
    </section>
  );
}
