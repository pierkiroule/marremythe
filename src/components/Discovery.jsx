import { useEffect, useRef, useState } from "react";
import ReflectionQuestions from "./ReflectionQuestions.jsx";
import {
  discoveryCandidates,
  mythCatalog,
  researchUrl,
  resonanceReasons,
} from "../domain/matching.js";

export default function Discovery({ state, dispatch }) {
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState({});
  const titleRef = useRef(null);
  useEffect(() => {
    if (index > 0) titleRef.current?.focus();
  }, [index]);
  const candidates = discoveryCandidates(state);
  const result = candidates[index];
  if (!result) return <p>Aucun récit disponible pour le moment.</p>;
  const { myth } = result;
  const reasons = resonanceReasons(result);
  return (
    <>
      <article className="myth discovery" aria-labelledby="myth-title">
        <div className="discovery-origin">
          <span aria-hidden="true">{myth.emoji}</span>
          <span>
            {myth.kind} · {myth.tradition}
          </span>
        </div>
        <h2 id="myth-title" ref={titleRef} tabIndex={-1}>
          {myth.title}
        </h2>
        <div className="discovery-summary">
          {myth.summary.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <section className="resonance" aria-labelledby="resonance-title">
          <h3 id="resonance-title">
            {result.hasConcreteSelection
              ? "Ce que cette histoire peut t’apporter"
              : "Une histoire à découvrir"}
          </h3>
          {result.hasConcreteSelection && reasons.length > 0 && (
            <details className="matching-details">
              <summary>Pourquoi cette histoire ?</summary>
              <ul>
                {reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </details>
          )}
          {myth.resource.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p className="nourishment">
            <span>Une idée à garder</span>
            {myth.nourishment}
          </p>
          <p className="interpretation-note">
            Tu peux garder cette idée si elle te parle. Tu peux aussi voir les
            choses autrement.
          </p>
          {!result.hasConcreteSelection && (
            <p className="hint">
              Avec les choix « Autre », on ne sait pas encore ce qui te pèse.
              Cette histoire est une proposition. Tu peux changer tes choix.
            </p>
          )}
        </section>
        <ReflectionQuestions
          myth={myth}
          answers={drafts[myth.id] || {}}
          onAnswer={(questionId, value) =>
            setDrafts((previous) => ({
              ...previous,
              [myth.id]: { ...previous[myth.id], [questionId]: value },
            }))
          }
        />
        <p className="cultural-source">
          <strong>D’où vient l’histoire ?</strong>
          <br />
          {myth.source}
        </p>
        <a
          className="btn research-link"
          href={researchUrl(myth)}
          target="_blank"
          rel="noopener noreferrer"
        >
          En savoir plus sur cette histoire <span aria-hidden="true">↗</span>
          <span className="sr-only"> (nouvel onglet)</span>
        </a>
        <p className="hint research-note">
          La recherche utilise le nom de l’histoire, pas tes réponses.
        </p>
      </article>
      <div className="footer">
        <button className="back" onClick={() => dispatch({ type: "edit" })}>
          ← Changer mes choix
        </button>
        {index + 1 < candidates.length && (
          <button className="back" onClick={() => setIndex(index + 1)}>
            Voir une autre histoire
          </button>
        )}
        <button className="back" onClick={() => dispatch({ type: "restart" })}>
          Recommencer
        </button>
      </div>
      <p className="hint discovery-note">
        {mythCatalog.length} histoires à découvrir. Elles existent en plusieurs
        versions. Ici, elles sont racontées avec nos mots, à partir des textes
        indiqués.
      </p>
    </>
  );
}
