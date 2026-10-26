import { useEffect, useRef } from "react";
import { useEngine } from "../lib/gameContext.js";
import { ROLE_COLORS } from "../lib/constants.js";
import ChampionModal from "./ChampionModal.jsx";
import LaneChips from "./LaneChips.jsx";
import { ChampionIcon } from "./ui.jsx";

function cellRole(champ, activeLane, primaryRole) {
  if (activeLane && activeLane !== "All") {
    return activeLane === "Dragon" ? (champ.roles.includes("APC") ? "APC" : "ADC") : activeLane;
  }
  return primaryRole(champ);
}

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
  onToggleChampion,
  onCloseChampion
}) {
  const { filterAlmanac, getPlaystyles, getSubRoleFilters, primaryRole } = useEngine();
  const list = filterAlmanac({ activeLane, roleFilter, playstyleFilter, search });
  const playstyles = getPlaystyles(activeLane);
  const subRoles = getSubRoleFilters(activeLane);
  const gridRef = useRef(null);
  const selected = list.find((champ) => champ.name === expandedChampion) || null;
  const laneLabel = activeLane === "All" ? "All lanes" : activeLane === "Dragon" ? "Bot / Dragon" : activeLane === "Baron" ? "Top / Baron" : activeLane;

  useEffect(() => {
    if (expandedChampion && !selected) onCloseChampion();
  }, [expandedChampion, selected, onCloseChampion]);

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cells = root.querySelectorAll(".animate-on-scroll");
    if (reduced) {
      cells.forEach((el) => el.classList.add("animate"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("animate");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    cells.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [list]);

  return (
    <section className="panel almanac-panel">
      <header className="almanac-masthead">
        <p className="almanac-kicker">Almanac</p>
        <div className="almanac-masthead-row">
          <h2 className="almanac-title">{laneLabel}</h2>
          <p className="result-count">
            {list.length} champion{list.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      <LaneChips activeLane={activeLane} isDraft={false} onSelect={onLaneChange} />
      <div className="search-row">
        <input
          type="search"
          aria-label="Search champions in the selected lane"
          placeholder={`Search ${laneLabel} champions…`}
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

      <div ref={gridRef} className="almanac-grid">
        {list.length === 0 ? <p className="empty almanac-empty">No champions match your filters.</p> : null}
        {list.map((champ, index) => {
          const open = expandedChampion === champ.name;
          const role = cellRole(champ, activeLane, primaryRole);
          return (
            <button
              key={champ.name}
              type="button"
              className={`almanac-cell animate-on-scroll${open ? " open" : ""}`}
              style={{ animationDelay: `${Math.min(index, 15) * 40}ms` }}
              onClick={() => onToggleChampion(champ.name)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label={`${champ.name}, ${role}`}
            >
              <ChampionIcon name={champ.name} alt="" size={48} />
              <span className="almanac-cell-copy">
                <span className="almanac-cell-name">{champ.name}</span>
                <span className={`almanac-cell-role badge-${ROLE_COLORS[role] || "adc"}`}>
                  {role}
                  {champ.coverage === "roster-only" ? " · Roster" : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selected ? (
        <ChampionModal
          champ={selected}
          activeLane={activeLane}
          draft={draft}
          onClose={onCloseChampion}
        />
      ) : null}
    </section>
  );
}
