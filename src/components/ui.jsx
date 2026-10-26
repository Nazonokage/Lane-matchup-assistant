import { useEffect, useRef, useState } from "react";
import { ROLE_COLORS } from "../lib/constants.js";
import { useEngine } from "../lib/gameContext.js";

export function RoleBadge({ champ, lane }) {
  const { primaryRole } = useEngine();
  const role = lane && lane !== 'All' ? (lane === 'Dragon' ? (champ.roles.includes('APC') ? 'APC' : 'ADC') : lane) : primaryRole(champ);
  return <span className={`badge badge-${ROLE_COLORS[role] || "adc"}`}>{role}</span>;
}

export function FlexBadge({ champ, activeLane }) {
  const { getFlexLanes } = useEngine();
  const other = getFlexLanes(champ, activeLane);
  if (!other.length) return null;
  return <span className="flex-badge">Also: {other.join(", ")}</span>;
}

export function MatchupList({ items, cls = "" }) {
  const { normalizeEntry } = useEngine();
  if (!items?.length) return <p className="muted">No named interaction reviewed. This does not mean the matchup is neutral.</p>;
  return (
    <ul className={`matchup-list ${cls}`}>
      {items.map((e) => {
        const { name, note, reference } = normalizeEntry(e);
        return (
          <li key={name}>
            <strong>{name}</strong>
            {note ? <span>{note}</span> : null}
            {reference ? <a href={reference} target="_blank" rel="noreferrer">Kit reference · strategic inference</a> : null}
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
  const { primaryRole } = useEngine();
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
  return (name || "").toLowerCase().replace(/[^a-z0-9]/g, '');
}

const championIcons = Object.fromEntries(Object.entries(import.meta.glob('../assets/league_champion_icons/*.png', { eager: true, query: '?url', import: 'default' })).map(([path, url]) => [normalizeChampionIconName(path.split('/').pop().replace('.png', '')), url]));
championIcons.viktor = championIcons.victor;

export function ChampionIcon({ name, alt, size = 28 }) {
  const displayName = normalizeChampionIconName(name);
  const safeAlt = alt || name || "Champion";

  // Files are stored under src/assets/league_champion_icons/<ChampionName>.png
  // Example: src/assets/league_champion_icons/Aurelion_Sol.png
  // Vite will bundle these when referenced via relative import URLs.
  const iconSrc = championIcons[displayName] || championIcons.default;
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
