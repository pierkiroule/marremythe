import { useState } from "react";
import { BU } from "../domain/catalog.js";
export function sampleAromas(previous = []) {
  const pool = BU.map((_, i) => i).filter((i) => !previous.includes(i));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 5);
}
export default function Aromas({ state, dispatch }) {
  const [shown, setShown] = useState(() => {
    const sampled = sampleAromas();
    if (state.bubble !== null && !sampled.includes(state.bubble))
      sampled[0] = state.bubble;
    return sampled;
  });
  return (
    <>
      <div className="aroma-grid">
        {shown.map((index, position) => (
          <button
            key={index}
            className={`aroma ${state.bubble === index ? "chosen" : ""}`}
            aria-pressed={state.bubble === index}
            style={{ "--i": position }}
            onClick={() => dispatch({ type: "aroma", index })}
          >
            <span className="aroma-orb" aria-hidden="true">
              {BU[index][0]}
            </span>
            <strong>{BU[index][1]}</strong>
            <small>{BU[index][2]}</small>
          </button>
        ))}
      </div>
      <p className="aroma-taste" role="status">
        {state.bubble === null
          ? "Choisis la saveur qui te parle."
          : `Tu as choisi ${BU[state.bubble][1].toLowerCase()} : ${BU[state.bubble][2]}.`}
      </p>
      <button
        className="mini"
        onClick={() => {
          setShown(sampleAromas(shown));
          dispatch({ type: "resetAroma" });
        }}
      >
        ↻ Autres arômes
      </button>
    </>
  );
}
