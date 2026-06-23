import {
  filterAlmanac,
  getPlaystyles,
  getSubRoleFilters
} from "../lib/engine.js";
import ChampionDetail from "./ChampionDetail.jsx";
import LaneChips from "./LaneChips.jsx";
import { ChampionIcon, FlexBadge, RoleBadge } from "./ui.jsx";


export default function AlmanacPanel({
  activeLane,
  search,
  roleFilter,
  playstyleFilter,
  expandedChampion,
  draft,
  onLaneChange,
  onSearchChange,
  onRoleFilter,
  onPlaystyleFilter,
  onToggleChampion
}) {
  const list = filterAlmanac({ activeLane, roleFilter, playstyleFilter, search });
  const playstyles = getPlaystyles(activeLane);
  const subRoles = getSubRoleFilters(activeLane);

  return (
    <section className="panel">
      <LaneChips activeLane={activeLane} isDraft={false} onSelect={onLaneChange} />
      <div className="search-row">
        <input
          type="search"
          placeholder={`Search ${activeLane} champions…`}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
      </div>
      {subRoles.length > 1 ? (
        <div className="chip-row">
          {subRoles.map((r) => (
            <button
              key={r}
              type="button"
              className={`chip ${roleFilter === r ? "active" : ""}`}
              onClick={() => onRoleFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>
      ) : null}
      <div className="chip-row chip-row-sm">
        <button
          type="button"
          className={`chip chip-sm ${playstyleFilter === "All" ? "active" : ""}`}
          onClick={() => onPlaystyleFilter("All")}
        >
          All styles
        </button>
        {playstyles.map((p) => (
          <button
            key={p}
            type="button"
            className={`chip chip-sm ${playstyleFilter === p ? "active" : ""}`}
            onClick={() => onPlaystyleFilter(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <p className="result-count">
        {list.length} champion{list.length !== 1 ? "s" : ""} · {activeLane}
      </p>
      <div className="card-list">
        {list.length === 0 ? <p className="empty">No champions match your filters.</p> : null}
        {list.map((champ) => {
          const open = expandedChampion === champ.name;
          return (
            <article key={champ.name} className={`card ${open ? "open" : ""}`}>
              <button type="button" className="card-head" onClick={() => onToggleChampion(champ.name)}>
                <RoleBadge champ={champ} />
                <span className="card-name">{champ.name}</span>
                <FlexBadge champ={champ} activeLane={activeLane} />
                <span className="tag" style={{ padding: "1px 4px" }}>
                  <ChampionIcon name={champ.name} alt={champ.name} size={14} />
                </span>

                <span className="chevron">{open ? "▾" : "▸"}</span>
              </button>

              {open ? (
                <ChampionDetail champ={champ} activeLane={activeLane} draft={draft} />
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
