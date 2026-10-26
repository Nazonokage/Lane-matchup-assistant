import { useEngine } from "../lib/gameContext.js";
import { ConditionsBlock, FlexBadge, MatchupList, RoleBadge } from "./ui.jsx";

export default function ChampionDetail({ champ, activeLane, draft }) {
  const { getMatchups, getRulesForChampion } = useEngine();
  const m = getMatchups(champ, activeLane);
  const rules = getRulesForChampion(champ, draft, activeLane);

  return (
    <div className="detail-panel">
      <p className="coverage-note">Solo queue editorial guide · Written {champ.guideWrittenAt} · Not a measured win rate</p>
      <p className="coverage-note">Typical damage: {champ.damage}. Builds can change this. {m.matchupCoverage}.</p>
      {champ.patchNote ? <p className="patch-note"><strong>Patch change:</strong> {champ.patchNote}</p> : null}
      <div className="detail-header">
        <RoleBadge champ={champ} lane={activeLane} />

        {champ.archetype ? <span className="badge badge-archetype">{champ.archetype}</span> : null}
        {champ.category ? <span className="tag">{champ.category}</span> : null}
        <FlexBadge champ={champ} activeLane={activeLane} />
        {(champ.playstyle || []).map((p) => (
          <span key={p} className="tag">{p}</span>
        ))}
      </div>
      {champ.caution ? <p className="caution">⚠ {champ.caution}</p> : null}
      {champ.tips ? <p className="tips">💡 {champ.tips}</p> : null}
      <div className="guide-sections">
        <h4>Playing against {champ.name}</h4><p>{champ.counterplay}</p>
        <h4>Cooldown or resource to track</h4><p>{champ.keyWindow}</p>
        <h4>Your lane plan</h4><p>{m.lanePlan}</p>
        <h4>When to look for a play</h4><p>{champ.spikePlan}</p>
        <h4>Purchase priorities</h4><p>{m.itemPlan}</p>
        <h4>Before the next objective</h4><p>{m.objectivePlan}</p>
      </div>
      {champ.strengths?.length ? (
        <p className="strengths"><strong>Strengths:</strong> {champ.strengths.join(", ")}</p>
      ) : null}
      <div className="detail-grid">
        <div><h4>Lane opportunities ({activeLane})</h4><MatchupList items={m.goodAgainst} cls="good" /></div>
        <div><h4>Lane pressure to respect</h4><MatchupList items={m.badAgainst} cls="bad" /></div>
        {m.synergies?.length ? <div><h4>Partner plans for this role</h4><MatchupList items={m.synergies} cls="good" /></div> : null}
      </div>
      <details className="guide-evidence"><summary>Sources & confidence</summary>
        <p>{champ.evidence}</p>
        <p>Plans and fit scores are editorial analysis. Source links document champion mechanics and availability; they do not validate win rates or rankings.</p>
        {champ.kitReference ? <p><a href={champ.kitReference.source} target="_blank" rel="noreferrer">Riot PC kit reference ({champ.kitReference.version})</a> · Checked {champ.kitReference.checkedAt}</p> : null}
        {champ.kitReference?.officialEnemyTip ? <blockquote><p>“{champ.kitReference.officialEnemyTip}”</p><cite>Riot’s PC counterplay tip — ability guidance, not current matchup statistics.</cite></blockquote> : null}
        <a href={champ.source} target="_blank" rel="noreferrer">Riot champion roster</a> · <a href={champ.basicsSource} target="_blank" rel="noreferrer">Game basics</a>
      </details>
      <ConditionsBlock conditions={m.conditions} />
      {rules.length ? (
        <div className="rules-block">
          <h4>Relevant draft rules</h4>
          <ul>{rules.map((r) => <li key={r.id || r.text}>{r.text}</li>)}</ul>
        </div>
      ) : null}
    </div>
  );
}
