import { useEffect, useRef, useState } from "react";
import {
  discoveryCandidates,
  mythCatalog,
  researchUrl,
  resonanceReasons,
} from "../domain/matching.js";

export default function Discovery({ state, dispatch }) {
  const [index, setIndex] = useState(0);
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
        <p className="discovery-summary">{myth.summary}</p>
        <section className="resonance" aria-labelledby="resonance-title">
          <h3 id="resonance-title">
            {result.hasConcreteSelection
              ? "Ce qui fait écho à tes choix"
              : "Une piste culturelle à explorer"}
          </h3>
          {result.hasConcreteSelection && reasons.length > 0 && (
            <ul>
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          )}
          <p>{myth.resource}</p>
          {!result.hasConcreteSelection && (
            <p className="hint">
              Tes choix « Autre » ne permettent pas une correspondance précise.
              Cette piste s’appuie sur l’arôme choisi ; reviens à tes
              ingrédients pour affiner.
            </p>
          )}
        </section>
        <p className="cultural-source">
          <strong>Pour situer le récit</strong>
          <br />
          {myth.source}
        </p>
        <a
          className="btn research-link"
          href={researchUrl(myth)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Explorer ce récit sur le web <span aria-hidden="true">↗</span>
          <span className="sr-only"> (nouvel onglet)</span>
        </a>
        <p className="hint research-note">
          La recherche porte sur le récit et sa tradition, jamais sur tes
          réponses.
        </p>
      </article>
      <div className="footer">
        <button className="back" onClick={() => dispatch({ type: "back" })}>
          ← Affiner mes choix
        </button>
        {index + 1 < candidates.length && (
          <button className="back" onClick={() => setIndex(index + 1)}>
            Découvrir une autre résonance
          </button>
        )}
        <button className="back" onClick={() => dispatch({ type: "restart" })}>
          Recommencer
        </button>
      </div>
      <p className="hint discovery-note">
        {mythCatalog.length} récits à explorer dans un catalogue en cours
        d’enrichissement. Les traditions connaissent plusieurs versions ; le
        résumé suit le repère indiqué.
      </p>
    </>
  );
}
