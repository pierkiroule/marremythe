import { useEffect, useRef, useState } from "react";
import { angerAromas, valueCollectionBubbles } from "../domain/values.js";
import { sparkle, soundEffect } from "../effects/particles.js";
export default function Discovery({ state, dispatch, collection }) {
  const candidates = angerAromas(state.type);
  const [index, setIndex] = useState(0),
    [decision, setDecision] = useState(null);
  const heading = useRef(null);
  const value = candidates[index],
    bubble = valueCollectionBubbles[value.index];
  const saved = collection.has(value.id);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [index]);
  function keep(event) {
    collection.keep(value.id);
    const box = event.currentTarget.getBoundingClientRect();
    sparkle(box.left + box.width / 2, box.top, 160, "confetti");
    soundEffect("drop");
    setDecision("kept");
  }
  return (
    <div className={`value-revelation color-${bubble.color}`}>
      <p className="eyebrow">Plop ! L’arôme de tes colères…</p>
      <div className="value-orb" aria-hidden="true">
        <span>{value.emoji}</span>
      </div>
      <h1 id="myth-title" ref={heading} tabIndex={-1}>
        {value.label}
      </h1>
      <p className="value-meaning">{value.meaning}</p>
      <p className="value-hypothesis">
        {value.general
          ? "Pour ta colère libre, voici une piste à essayer. On ne devine pas ce que tes mots veulent dire."
          : "Et si ta colère défendait cette valeur ?"}
      </p>
      {!decision ? (
        <>
          <p className="value-question">Est-ce qu’elle te ressemble ?</p>
          {saved && (
            <p className="hint">Cette valeur est déjà dans ton bouillon.</p>
          )}
          <div className="value-decisions">
            <button className="btn" onClick={keep}>
              Oui, {saved ? "elle me ressemble" : "je la garde"}
            </button>
            <button className="back" onClick={() => setDecision("left")}>
              Non, je la laisse
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="value-feedback" role="status">
            {decision === "kept"
              ? "Cette valeur est dans ton bouillon. À retrouver quand tu veux."
              : "Tu peux la laisser. C’est toi qui sais ce qui te ressemble."}
          </p>
          <button className="btn" onClick={() => dispatch({ type: "restart" })}>
            Jeter d’autres colères
          </button>
          {decision === "left" && index + 1 < candidates.length && (
            <button
              className="text-button"
              onClick={() => {
                setIndex(index + 1);
                setDecision(null);
              }}
            >
              Essayer un autre arôme
            </button>
          )}
        </>
      )}
      <p className="hint">Une piste à reconnaître, pas une vérité sur toi.</p>
    </div>
  );
}
