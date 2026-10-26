import { games, meta } from '../lib/data.js';

export default function MetaPanel({ game }) {
  const info = games[game];
  const guides = info.championData.filter(c => c.coverage === 'editorial').length;
  return <aside className="meta-panel">
    <div className="meta-heading"><strong>Patch {info.patch}</strong><span>{info.championData.length} champions</span></div>
    <p>{info.summary}</p>
    <p className="coverage-note">{guides} editorial guides · All 5 roles · Limited named matchup coverage</p>
    <details>
      <summary>Patch changes & data confidence</summary>
      <p>{meta.methodology}</p>
      <p><a href={info.source} target="_blank" rel="noreferrer">Riot patch notes ({info.publishedAt})</a> · <a href={info.rosterSource} target="_blank" rel="noreferrer">Official roster</a></p>
      <ul>{Object.entries(info.changes).map(([name, note]) => <li key={name}><strong>{name}:</strong> {note}</li>)}</ul>
      <h3>Before you lock in</h3>
      <ul>{meta.draftChecklist.map(text => <li key={text}>{text}</li>)}</ul>
      <h3>Next useful data</h3>
      <ul>{meta.nextDataPriorities.map(text => <li key={text}>{text}</li>)}</ul>
    </details>
  </aside>;
}
