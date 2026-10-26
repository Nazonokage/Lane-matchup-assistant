import { useMemo } from "react";
import { roleDraftGuides } from "../data/roleDraftGuides.js";
import { draftPickPlan } from "../lib/draftPickPlan.js";
import {
  DRAFT_FIELD_DEFS,
  DRAFT_KEYS,
  LANE_CONFIG
} from "../lib/constants.js";
import { useEngine } from "../lib/gameContext.js";
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
  const { byName } = useEngine();
  const cfg = LANE_CONFIG[lane];
  const filled = DRAFT_KEYS.filter((k) => k !== cfg.hiddenAlly && draft[k]).map((k) => ({
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
                  <RoleBadge champ={champ} lane={s.key === cfg.directOpponent ? lane : lane === 'Support' ? 'Dragon' : 'Support'} />
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
                {s.key === cfg.directOpponent ? <>
                  <p className="tips compact"><strong>Playing against them:</strong> {champ.counterplay}</p>
                  <p className="caution compact"><strong>Track:</strong> {champ.keyWindow}</p>
                </> : <p className="tips compact"><strong>Partner’s plan:</strong> {champ.tips}</p>}
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
  const { getContextualMatchups } = useEngine();
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

function DraftPickDetail({ champ, draft, lane, reasons, warnings, matchupKnown, summary, threatPlans, plan }) {
  return (
    <div className="rec-body">
      <p className="coverage-note">{summary}</p>
      {!matchupKnown ? <p className="coverage-note">No reviewed named lane interaction for the shown opponent. This suggestion uses team fit, partner setup and any separately listed threat responses, not a counter win rate.</p> : null}
      {reasons.length ? (
        <div className="why">
          <h4>Why pick this</h4>
          <ul>
            {reasons.map((r, i) => (
              <li key={i}><strong>{r.label} (+{r.delta}):</strong> {r.text} <span className="coverage-note">{r.evidence}</span></li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="muted">No positive fit signals for this pick. Review the risks below.</p>
      )}
      {warnings.length ? (
        <div className="watch">
          <h4>What to watch out for</h4>
          <ul>
            {warnings.map((w, i) => (
              <li key={i}><strong>{w.label}{w.delta < 0 ? ` (${w.delta})` : ' (note)'}:</strong> {w.text}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <ContextualMatchups champ={champ} draft={draft} lane={lane} />
      <div className="guide-sections">
        <h4>How to play this pick</h4>
        <p>{plan.lanePlan}</p>
        {plan.opponent ? <>
          <h4>Against {plan.opponent.name}</h4>
          <p>{plan.opponent.counterplay}</p>
          <p><strong>Track before committing:</strong> {plan.opponent.track}</p>
          {!plan.opponent.interaction ? <p className="coverage-note">Opponent kit advice; this pair has no reviewed named matchup yet.</p> : null}
        </> : <p className="coverage-note">Select your direct opponent for their counterplay and key cooldown.</p>}
        {plan.partner ? <p><strong>Coordinate with {plan.partner.name}:</strong> {plan.partner.plan}</p> : null}
        <h4>Your fight window</h4><p>{plan.timing}</p>
        <h4>Purchase priorities</h4><p>{plan.purchases}</p>
        <h4>Before the next objective</h4><p>{plan.objective}</p>
      </div>
      {threatPlans?.length ? <div className="context-matchups">
        <h4>Specific enemy threats</h4>
        {threatPlans.map(plan => <div key={plan.id}>
          <p><strong>Against {plan.enemy}:</strong> {plan.plan}</p>
          <p><strong>Their response:</strong> {plan.response}</p>
          <p className="coverage-note"><a href={plan.source} target="_blank" rel="noreferrer">Ability source</a> · Reviewed {plan.reviewedAt} · {plan.evidence}</p>
        </div>)}
      </div> : null}
      <details className="almanac-in-draft">
        <summary>Full champion guide & sources</summary>
        <ChampionDetail champ={champ} activeLane={lane} draft={draft} />
      </details>
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
        aria-label={def.label}
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

function RecommendationsPanel({ draft, lane, expandedPick, onTogglePick }) {
  const { getDraftValues, getRecommendationReport, byName } = useEngine();
  if (!getDraftValues({ ...draft, [LANE_CONFIG[lane].hiddenAlly]: '' }).length) {
    return <p className="empty">Select a teammate or opponent above. Suggestions will update automatically here.</p>;
  }

  const { picks: recs, unassessed, total } = getRecommendationReport(draft, lane);
  if (!recs.length) {
    return <p className="empty">{total ? `No scored fit evidence for the ${total} available picks yet. Add your lane partner or more enemy and allied picks. You can still explore every champion in the Almanac.` : 'Add a visible draft pick to compare available champions.'}</p>;
  }

  return <><p className="coverage-note" role="status">{recs.length} picks with scored evidence for this draft.</p><details className="coverage-note"><summary>How fit points work</summary><p>Fit points compare the shown draft only. Equal scores are alphabetical, not a tier ranking. Zero can mean advantages and risks balance out. {unassessed} of {total} available picks have no scored evidence and are not ranked. Negative scores highlight risks, not recommended counters.</p></details><div className="rec-grid">{recs.map(({ champ, score, reasons, warnings, matchupKnown, summary, threatPlans }) => {
    const open = expandedPick === champ.name;
    const plan = draftPickPlan(champ, draft, lane, byName);
    const extraContext = [...reasons, ...warnings].find(signal => signal.id.startsWith('solo-jungle-'));
    const scoreCls = score > 0 ? "pos" : score < 0 ? "neg" : "neutral";
    return (
      <article key={champ.name} className={`rec-card ${open ? "open" : ""}`}>
                <button type="button" className="rec-head" aria-expanded={open} onClick={() => onTogglePick(champ.name)}>
          <div className="rec-title">
            <RoleBadge champ={champ} lane={lane} />
            <span className="rec-name">{champ.name}</span>
            <span className="tag" style={{ padding: "1px 4px" }}>
              <ChampionIcon name={champ.name} alt={champ.name} size={14} />
            </span>
          </div>
          <span className={`score score-${scoreCls}`} aria-label={`${score} editorial fit points`}>{score > 0 ? "+" : ""}{score} fit</span>
        </button>
        <div className="pick-preview">
          <p><strong>{score < 0 ? 'Fit caution' : 'Draft fit'}:</strong> {(score < 0 ? warnings.find(w => w.delta < 0)?.text : reasons[0]?.text) || 'Advantages and risks balance out; review the available signals before locking in.'}</p>
          <p><strong>Your game plan:</strong> {plan.approach}</p>
          {extraContext ? <p><strong>Enemy jungle changes:</strong> {extraContext.text}</p> : null}
          {plan.opponent ? <p><strong>Against {plan.opponent.name}{plan.opponent.interaction ? '' : ' (kit advice)'}:</strong> {plan.opponent.interaction || plan.opponent.counterplay}</p> : null}
          <p><strong>Main risk:</strong> {warnings[0]?.text || plan.risk}</p>
          <button type="button" className="btn" aria-expanded={open} onClick={() => onTogglePick(champ.name)}>{open ? 'Hide detailed advice' : 'Matchup, teamplay & build advice'}</button>
        </div>
        {open ? (
          <DraftPickDetail champ={champ} draft={draft} lane={lane} reasons={reasons} warnings={warnings} matchupKnown={matchupKnown} summary={summary} threatPlans={threatPlans} plan={plan} />
        ) : null}
      </article>
    );
  })}</div></>;
}

export default function DraftPanel({
  activeLane,
  draft,
  expandedPick,
  onLaneChange,
  onDraftChange,
  onTogglePick
}) {
  const { getTriggeredRules, getFlexWarnings, getGlobalConditions, getDraftedNamesExcept, getPoolChampions } = useEngine();
  const cfg = LANE_CONFIG[activeLane];
  const roleGuide = roleDraftGuides[activeLane];
  const triggered = useMemo(
    () => getTriggeredRules(draft, activeLane),
    [draft, activeLane, getTriggeredRules]
  );
  const flex = useMemo(() => getFlexWarnings(draft), [draft, getFlexWarnings]);
  const globalCond = useMemo(() => getGlobalConditions(activeLane), [activeLane, getGlobalConditions]);
  const selectOptions = useMemo(() => {
    const result = {};
    for (const key of DRAFT_KEYS) {
      const def = DRAFT_FIELD_DEFS[key];
      const taken = getDraftedNamesExcept({ ...draft, [cfg.hiddenAlly]: '' }, key);
      result[key] = getPoolChampions(def.pool).filter(
        (c) => !taken.has(c.name) || draft[key] === c.name
      );
    }
    return result;
  }, [draft, cfg.hiddenAlly, getDraftedNamesExcept, getPoolChampions]);
  const enemyKeys = DRAFT_KEYS.filter((k) => k.startsWith("enemy"));
  const allyKeys = DRAFT_KEYS.filter((k) => k.startsWith("ally") && k !== cfg.hiddenAlly);

  return (
    <section className="panel">
      <LaneChips activeLane={activeLane} isDraft onSelect={onLaneChange} />
      <p className="panel-desc">{cfg.desc}</p>
      <p className="coverage-note">Suggestions target general ranked solo queue. Fit points reflect team needs, threats and conditional pairings—not live win rates or mastery. Choose a practiced pick when the fit is close.</p>

      <div className="draft-teams">
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

      </div>
      <section className="rec-list" aria-labelledby="draft-picks-heading">
        <h3 id="draft-picks-heading">Picks for your draft</h3>
        <p className="coverage-note">Updates automatically as you change champions or roles.</p>
        <RecommendationsPanel
          draft={draft}
          lane={activeLane}
          expandedPick={expandedPick}
          onTogglePick={onTogglePick}
        />
      </section>

      <DraftContextStrip draft={draft} lane={activeLane} />
      <details className="rules-banner" key={activeLane}>
        <summary><strong>{roleGuide.title}</strong></summary>
        <p><strong>What to draft for:</strong> {roleGuide.priorities}</p>
        <p><strong>Before locking in:</strong> {roleGuide.checklist}</p>
        <p><strong>Your opening plan:</strong> {roleGuide.execution}</p>
      </details>

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


    </section>
  );
}
