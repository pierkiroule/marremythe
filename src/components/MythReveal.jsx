import { useEffect, useRef } from "react";
import { mythEcho } from "../domain/mythEcho.js";
import { researchUrl } from "../domain/matching.js";
import { pauseParticles } from "../effects/particles.js";
export default function MythReveal({ state, value, onRestart }) {
  const heading = useRef(null);
  const echo = mythEcho(state, value.index);
  useEffect(() => {
    const resumeParticles = pauseParticles();
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    return resumeParticles;
  }, []);
  if (!echo) return <p>Ce récit n’est pas disponible pour le moment.</p>;
  const { myth, angers } = echo;
  return (
    <article className="myth-reveal" aria-labelledby="myth-title">
      <p className="eyebrow">Dans ton bouillon : {value.label}</p>
      <p className="value-feedback" role="status">
        Cette valeur est dans ton bouillon. Voici un récit qui lui fait écho.
      </p>
      <span className="myth-emblem" aria-hidden="true">
        {myth.emoji}
      </span>
      <h1 id="myth-title" ref={heading} tabIndex={-1}>
        {myth.title}
      </h1>
      <p className="myth-tradition">
        {myth.kind} · {myth.tradition}
      </p>
      <div className="myth-narrative">
        {myth.summary.split("\n\n").map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
      <section className="myth-echo" aria-labelledby="echo-title">
        <h2 id="echo-title">L’écho avec ton mélange</h2>
        <p className="anger-echo">
          {angers.length ? (
            <>
              Tu as jeté : {angers.map((anger) => `« ${anger} »`).join(", ")}.
            </>
          ) : (
            "Tu as jeté une colère avec tes propres mots. On ne les interprète pas à ta place."
          )}
        </p>
        <p>
          Tu as reconnu <strong>{value.label.toLowerCase()}</strong> :{" "}
          {value.meaning.charAt(0).toLowerCase() + value.meaning.slice(1)}
        </p>
        {myth.resource.split("\n\n").map((text, index) => (
          <p key={index}>{text}</p>
        ))}
        <p className="myth-takeaway">
          Une idée que ce récit peut nourrir : {myth.nourishment}
        </p>
        <p className="hint">
          Une résonance possible. À toi de voir ce que cette histoire t’apporte.
        </p>
      </section>
      <details className="myth-source">
        <summary>Le récit et sa source</summary>
        <p>{myth.source}</p>
      </details>
      <a
        className="research-link"
        href={researchUrl(myth)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Explorer ce mythe sur le web ↗
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
      <button className="btn" onClick={onRestart}>
        Jeter d’autres colères
      </button>
    </article>
  );
}
