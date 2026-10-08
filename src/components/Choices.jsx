import { soundEffect } from "../effects/particles.js";
import { catalogs, limits } from "../domain/journey.js";
import { suggestedValues } from "../domain/values.js";
export default function Choices({ field, state, dispatch, title }) {
  const items = catalogs[field];
  const selected = state[field];
  const atLimit = selected.length >= limits[field];
  return (
    <fieldset className="choices">
      <legend>{title}</legend>
      {field === "need" && (
        <p className="value-invitation">
          {suggestedValues(state.type).length
            ? `Peut-être ${suggestedValues(state.type)
                .map((value) => value.label.toLowerCase())
                .join(", ")}… À toi de choisir, ou de prendre une autre piste.`
            : "Une colère peut pointer vers quelque chose d’important. Choisis jusqu’à deux valeurs qui te parlent."}
        </p>
      )}
      <div className="chips">
        {items.map(([emoji, label, subtitle], index) => (
          <button
            key={label}
            type="button"
            className={`chip ${selected.includes(index) ? "sel" : ""}`}
            aria-pressed={selected.includes(index)}
            disabled={atLimit && !selected.includes(index)}
            onClick={() => (
              soundEffect("select"),
              dispatch({ type: "toggle", field, index })
            )}
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
        {selected.length} / {limits[field]}{" "}
        {field === "need" ? "valeurs choisies" : "dans la marmythe"}
        {atLimit && " · Panier rempli"}
      </p>
    </fieldset>
  );
}
