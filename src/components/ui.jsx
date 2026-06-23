import { useEffect, useRef, useState } from "react";
import { ROLE_COLORS } from "../lib/constants.js";
import { getFlexLanes, normalizeEntry, primaryRole } from "../lib/engine.js";

export function RoleBadge({ champ }) {
  const role = primaryRole(champ);
  return <span className={`badge badge-${ROLE_COLORS[role] || "adc"}`}>{role}</span>;
}

export function FlexBadge({ champ, activeLane }) {
  const other = getFlexLanes(champ, activeLane);
  if (!other.length) return null;
  return <span className="flex-badge">Also: {other.join(", ")}</span>;
}

export function MatchupList({ items, cls = "" }) {
  if (!items?.length) return <p className="muted">None listed</p>;
  return (
    <ul className={`matchup-list ${cls}`}>
      {items.map((e) => {
        const { name, note } = normalizeEntry(e);
        return (
          <li key={name}>
            <strong>{name}</strong>
            {note ? <span>{note}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

export function ConditionsBlock({ conditions }) {
  if (!conditions) return null;
  return (
    <>
      {conditions.green?.length ? (
        <div className="cond-block green">
          <h4>Pick when</h4>
          <ul>{conditions.green.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      ) : null}
      {conditions.red?.length ? (
        <div className="cond-block red">
          <h4>Avoid when</h4>
          <ul>{conditions.red.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      ) : null}
    </>
  );
}

export function IntelChip({ champ }) {
  if (!champ) return null;
  const role = primaryRole(champ);
  return (
    <span className="intel-chip">
      <span className={`intel-dot badge-${ROLE_COLORS[role] || "adc"}`} />
      {champ.name}
    </span>
  );
}

function normalizeChampionIconName(name) {
  return (name || "").trim();
}

export function ChampionIcon({ name, alt, size = 28 }) {
  const displayName = normalizeChampionIconName(name);
  const safeAlt = alt || displayName || "Champion";

  // Files are stored under src/assets/league_champion_icons/<ChampionName>.png
  // Example: src/assets/league_champion_icons/Aurelion_Sol.png
  // Vite will bundle these when referenced via relative import URLs.
  const iconSrc = new URL(`../assets/league_champion_icons/${encodeURIComponent(displayName)}.png`, import.meta.url).toString();
  const fallbackSrc = new URL(`../assets/league_champion_icons/default.png`, import.meta.url).toString();


  return (
    <img
      className="champ-icon"
      src={iconSrc}
      alt={safeAlt}
      width={size}
      height={size}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallbackSrc;
      }}
    />
  );
}

export function CopyButton({ name }) {
  const [label, setLabel] = useState("Copy pick name");
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  async function handleCopy(e) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(name);
      setLabel("Copied!");
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setLabel("Copy pick name"), 1500);
    } catch {
      setLabel(name);
    }
  }

  return (
    <button type="button" className="btn-copy" onClick={handleCopy}>
      {label}
    </button>
  );
}
