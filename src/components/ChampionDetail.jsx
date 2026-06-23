import { getMatchups, getRulesForChampion } from "../lib/engine.js";
import { ConditionsBlock, FlexBadge, MatchupList, RoleBadge, ChampionIcon } from "./ui.jsx";

export default function ChampionDetail({ champ, activeLane, draft }) {
  const m = getMatchups(champ, activeLane);
  const rules = getRulesForChampion(champ, draft, activeLane);

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <RoleBadge champ={champ} />

        {champ.archetype ? <span className="badge badge-archetype">{champ.archetype}</span> : null}
        {champ.category ? <span className="tag">{champ.category}</span> : null}
        <FlexBadge champ={champ} activeLane={activeLane} />
        {(champ.playstyle || []).map((p) => (
          <span key={p} className="tag">{p}</span>
        ))}
      </div>
      {champ.caution ? <p className="caution">⚠ {champ.caution}</p> : null}
      {champ.tips ? <p className="tips">💡 {champ.tips}</p> : null}
      {champ.strengths?.length ? (
        <p className="strengths"><strong>Strengths:</strong> {champ.strengths.join(", ")}</p>
      ) : null}
      <div className="detail-grid">
        <div><h4>Good against ({activeLane})</h4><MatchupList items={m.goodAgainst} cls="good" /></div>
        <div><h4>Bad against ({activeLane})</h4><MatchupList items={m.badAgainst} cls="bad" /></div>
        <div><h4>Synergies</h4><MatchupList items={champ.synergies} cls="good" /></div>
        <div><h4>Avoid synergies</h4><MatchupList items={champ.avoidSynergies} cls="bad" /></div>
      </div>
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
