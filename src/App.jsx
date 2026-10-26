import { useCallback, useEffect, useState } from "react";
import { games, meta } from "./lib/data.js";
import { GameContext, engines } from "./lib/gameContext.js";
import { clearRetiredPreferences } from "./lib/preferences.js";
import MetaPanel from "./components/MetaPanel.jsx";
import AlmanacPanel from "./components/AlmanacPanel.jsx";
import DraftPanel from "./components/DraftPanel.jsx";
import { EMPTY_DRAFT, LANE_CONFIG } from "./lib/constants.js";


export default function App() {
  const [game, setGame] = useState('wr');
  useEffect(() => {
    try { clearRetiredPreferences(localStorage); } catch { /* Storage is optional. */ }
  }, []);
  function changeGame(next) {
    setGame(next);
  }
  return <GameContext.Provider value={engines[game]}><GameApp key={game} game={game} onGameChange={changeGame} /></GameContext.Provider>;
}

function GameApp({ game, onGameChange }) {
  const [tab, setTab] = useState("almanac");
  const [activeLane, setActiveLane] = useState(
    "Dragon"
  );
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [playstyleFilter, setPlaystyleFilter] = useState("All");
  const [expandedChampion, setExpandedChampion] = useState(null);
  const [expandedPick, setExpandedPick] = useState(null);
  const [draft, setDraft] = useState(
    { ...EMPTY_DRAFT }
  );


  function handleTab(next) {
    if (next === 'draft' && activeLane === 'All') setActiveLane('Dragon');
    setTab(next);
    setExpandedPick(null);
  }

  function handleLaneChange(lane) {
    setActiveLane(lane);
    setRoleFilter("All");
    setPlaystyleFilter("All");
    setExpandedChampion(null);
    setExpandedPick(null);
  }

  function handleDraftChange(key, value) {
    const next = { ...draft, [key]: value, [LANE_CONFIG[activeLane].hiddenAlly]: '' };
    setDraft(next);
    setExpandedPick(null);
  }

  const handleCloseChampion = useCallback(() => setExpandedChampion(null), []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <img src="/think_fam_think.png" alt="Lane Ledger logo" className="logo" width={52} height={52} />
          <div>
            <h1>Lane Ledger</h1>
            <p className="subtitle">{games[game].label} draft companion · 5 lanes</p>
          </div>
        </div>
        <p className="meta">
          Patch {games[game].patch} · Roster and patch review {meta.reviewedAt}
        </p>
      </header>

      <div className="game-switch" role="group" aria-label="Game">
        {Object.entries(games).map(([id, info]) => <button key={id} type="button" aria-pressed={game === id} className={game === id ? 'active' : ''} onClick={() => onGameChange(id)}>{info.label}</button>)}
      </div>
      <MetaPanel game={game} />
      <nav className="tabs" aria-label="Workflow">
        <button
          type="button"
          className={`tab ${tab === "almanac" ? "active" : ""}`}
          onClick={() => handleTab("almanac")}
        >
          Almanac
        </button>
        <button
          type="button"
          className={`tab ${tab === "draft" ? "active" : ""}`}
          onClick={() => handleTab("draft")}
        >
          Draft Helper
        </button>
      </nav>

      {tab === "almanac" ? (
        <AlmanacPanel
          activeLane={activeLane}
          search={search}
          roleFilter={roleFilter}
          playstyleFilter={playstyleFilter}
          expandedChampion={expandedChampion}
          draft={draft}
          onLaneChange={handleLaneChange}
          onSearchChange={setSearch}
          onRoleFilter={(r) => { setRoleFilter(r); setExpandedChampion(null); }}
          onPlaystyleFilter={setPlaystyleFilter}
          onToggleChampion={(name) => setExpandedChampion((prev) => (prev === name ? null : name))}
          onCloseChampion={handleCloseChampion}
        />
      ) : (
        <DraftPanel
          activeLane={activeLane}
          draft={draft}
          expandedPick={expandedPick}
          onLaneChange={handleLaneChange}
          onDraftChange={handleDraftChange}
          onTogglePick={(name) => setExpandedPick((prev) => (prev === name ? null : name))}
        />
      )}
    </div>
  );
}
