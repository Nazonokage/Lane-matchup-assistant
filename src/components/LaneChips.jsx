import { LANES, LANE_CONFIG } from "../lib/constants.js";

export default function LaneChips({ activeLane, isDraft, onSelect }) {
  return (
    <div className="chip-row lane-row">
      {(isDraft ? LANES : ['All', ...LANES]).map((lane) => (
        <button
          key={lane}
          type="button"
          className={`chip chip-lane badge-lane-${lane.toLowerCase()} ${activeLane === lane ? "active" : ""}`}
          onClick={() => onSelect(lane)}
          aria-pressed={activeLane === lane}
        >
          {isDraft ? LANE_CONFIG[lane].draftLabel : lane === 'All' ? 'All champions' : lane === 'Dragon' ? 'Bot / Dragon' : lane === 'Baron' ? 'Top / Baron' : lane}
        </button>
      ))}
    </div>
  );
}
