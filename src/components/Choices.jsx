import { catalogs, limits } from "../domain/journey.js";
export default function Choices({ field, state, dispatch, title }) {
  const items = catalogs[field];
  const selected = state[field];
  const atLimit = selected.length >= limits[field];
  return (
    <fieldset className="choices">
      <legend>{title}</legend>
      <div className="chips">
        {items.map(([emoji, label, subtitle], index) => (
          <button
            key={label}
            type="button"
            className={`chip ${selected.includes(index) ? "sel" : ""}`}
            aria-pressed={selected.includes(index)}
            disabled={atLimit && !selected.includes(index)}
            onClick={() => dispatch({ type: "toggle", field, index })}
          >
            <span className="em" aria-hidden="true">
              {emoji}
            </span>
            <span className="tx">
              {label}
              {field === "type" && <small>{subtitle}</small>}
            </span>
          </button>
        ))}
      </div>
      {selected.includes(items.length - 1) && (
        <div className="ob">
          <label htmlFor={`other-${field}`}>
            Précise si tu veux <span className="hint">(facultatif)</span>
          </label>
          <textarea
            id={`other-${field}`}
            value={state.other[field]}
            maxLength={120}
            placeholder="Quelques mots, pour toi…"
            onChange={(event) =>
              dispatch({ type: "text", field, value: event.target.value })
            }
          />
          <span className="hint">
            {state.other[field].length} / 120 caractères
          </span>
        </div>
      )}
      <p className="hint" role="status">
        {selected.length} / {limits[field]} dans le panier
        {atLimit && " · Retire un ingrédient pour en choisir un autre."}
      </p>
    </fieldset>
  );
}
