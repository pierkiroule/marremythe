import { useEffect, useRef, useState } from "react";
import { discoveryCandidates } from "../domain/matching.js";
import { projectiveBubbles, projectiveRecipe } from "../domain/projective.js";
import { sparkle, soundEffect } from "../effects/particles.js";
import BubbleReader from "./BubbleReader.jsx";
export default function Discovery({ state, dispatch, collection }) {
  const [index, setIndex] = useState(0),
    [active, setActive] = useState(null),
    [opened, setOpened] = useState([]),
    [drafts, setDrafts] = useState({});
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [index]);
  const candidates = discoveryCandidates(state),
    result = candidates[index];
  if (!result) return <p>Aucune histoire disponible pour le moment.</p>;
  const myth = result.myth,
    draft = drafts[myth.id] || {},
    recipe = projectiveRecipe(myth, state, draft),
    bubbles = projectiveBubbles(myth, state, draft);
  function open(bubble, event) {
    const box = event.currentTarget.getBoundingClientRect();
    sparkle(box.left + box.width / 2, box.top + box.height / 2, 110);
    soundEffect("drop");
    setOpened((previous) =>
      previous.includes(bubble.id) ? previous : [...previous, bubble.id],
    );
    setActive(bubble);
  }
  return (
    <div className="bubble-world">
      <header className="bubble-world-heading">
        <p className="eyebrow">Plop ! Une histoire à laisser mijoter…</p>
        <h1 id="myth-title" ref={heading} tabIndex={-1}>
          {recipe.title}
        </h1>
        <p>
          Des ingrédients pour ton histoire. La suite, c’est toi qui l’inventes.
        </p>
        {!result.hasConcreteSelection && (
          <p className="hint">
            Avec tes choix « Autre », cet univers est une piste à essayer.
          </p>
        )}
      </header>
      <div
        className="revelation-bubbles"
        aria-label="Les bulles de ton histoire"
      >
        {bubbles.map((bubble, position) => (
          <button
            key={bubble.id}
            className={`revelation-bubble color-${bubble.color} ${opened.includes(bubble.id) ? "explored" : ""}`}
            style={{ "--i": position }}
            onClick={(event) => open(bubble, event)}
            aria-label={`Ouvrir : ${bubble.label}`}
          >
            <span className="orb">
              <span aria-hidden="true">{bubble.emoji}</span>
              {collection.has(bubble.id) && (
                <span
                  className="bubble-saved"
                  aria-label="Conservée dans mon bouillon"
                >
                  ♥
                </span>
              )}
            </span>
            <strong>{bubble.label}</strong>
            {opened.includes(bubble.id) && (
              <small>
                {collection.has(bubble.id)
                  ? "Dans ton bouillon"
                  : "Déjà ouverte"}
              </small>
            )}
          </button>
        ))}
      </div>
      <footer className="bubble-world-actions">
        <button className="back" onClick={() => dispatch({ type: "edit" })}>
          ← Changer mes choix
        </button>
        {index + 1 < candidates.length && (
          <button className="back" onClick={() => setIndex(index + 1)}>
            Voir une autre histoire
          </button>
        )}
        <button
          className="text-button"
          onClick={() => dispatch({ type: "restart" })}
        >
          Recommencer
        </button>
      </footer>
      {active && (
        <BubbleReader
          bubble={bubbles.find((bubble) => bubble.id === active.id)}
          collection={collection}
          onClose={() => setActive(null)}
          recipe={recipe}
          draft={draft}
          onDraft={(value) =>
            setDrafts((previous) => ({ ...previous, [myth.id]: value }))
          }
        />
      )}
    </div>
  );
}
