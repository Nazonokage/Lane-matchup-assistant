import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import ChampionDetail from "./ChampionDetail.jsx";
import { ChampionIcon } from "./ui.jsx";

export default function ChampionModal({ champ, activeLane, draft, onClose }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const lane = activeLane === "All" ? champ.playableLanes[0] : activeLane;

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = [...root.querySelectorAll("a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [champ.name, onClose]);

  return createPortal(
    <div
      className="almanac-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="almanac-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="almanac-modal-head">
          <ChampionIcon name={champ.name} alt="" size={44} />
          <div className="almanac-modal-titles">
            <p className="almanac-modal-kicker">{lane}</p>
            <h2 id={titleId}>{champ.name}</h2>
          </div>
          <button ref={closeRef} type="button" className="almanac-modal-close" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="almanac-modal-body">
          <ChampionDetail champ={champ} activeLane={lane} draft={draft} />
        </div>
      </div>
    </div>,
    document.body
  );
}
