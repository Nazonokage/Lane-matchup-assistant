import { useCallback, useState } from "react";
import { lastUpdated, metaNote } from "./lib/data.js";
import AlmanacPanel from "./components/AlmanacPanel.jsx";
import DraftPanel from "./components/DraftPanel.jsx";
import { EMPTY_DRAFT } from "./lib/constants.js";
import { loadDraftFromStorage, saveDraftToStorage } from "./lib/engine.js";

export default function App() {
  const [tab, setTab] = useState("almanac");
  const [activeLane, setActiveLane] = useState(
    () => loadDraftFromStorage()?.activeLane ?? "Dragon"
  );
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [playstyleFilter, setPlaystyleFilter] = useState("All");
  const [expandedChampion, setExpandedChampion] = useState(null);
  const [expandedPick, setExpandedPick] = useState(null);
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  const [draft, setDraft] = useState(
    () => loadDraftFromStorage()?.draft ?? { ...EMPTY_DRAFT }
  );

  const persist = useCallback((lane, nextDraft) => {
    saveDraftToStorage(lane, nextDraft);
  }, []);

  function handleTab(next) {
    setTab(next);
    setRecommendationsOpen(false);
    setExpandedPick(null);
  }

  function handleLaneChange(lane) {
    setActiveLane(lane);
    setRoleFilter("All");
    setPlaystyleFilter("All");
    setExpandedChampion(null);
    setExpandedPick(null);
    setRecommendationsOpen(false);
    persist(lane, draft);
  }

  function handleDraftChange(key, value) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    setExpandedPick(null);
    persist(activeLane, next);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <img src="/think_fam_think.png" alt="Lane Ledger logo" className="logo" width={52} height={52} />
          <div>
            <h1>Lane Ledger</h1>
            <p className="subtitle">Wild Rift draft companion · 5 lanes</p>
          </div>
        </div>
        <p className="meta">
          Updated {lastUpdated}
          {metaNote ? ` · ${metaNote}` : ""}
        </p>
      </header>

      <nav className="tabs">
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
        />
      ) : (
        <DraftPanel
          activeLane={activeLane}
          draft={draft}
          recommendationsOpen={recommendationsOpen}
          expandedPick={expandedPick}
          onLaneChange={handleLaneChange}
          onDraftChange={handleDraftChange}
          onGetPicks={() => setRecommendationsOpen(true)}
          onTogglePick={(name) => setExpandedPick((prev) => (prev === name ? null : name))}
        />
      )}
    </div>
  );
}
