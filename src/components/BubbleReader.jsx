import { useRef, useState } from "react";
import Modal from "./Modal.jsx";
import { mythCatalog, researchUrl } from "../domain/matching.js";
import { sparkle, soundEffect } from "../effects/particles.js";
import StoryWorkshop from "./StoryWorkshop.jsx";
import { projectiveRecipe } from "../domain/projective.js";
export default function BubbleReader({
  bubble,
  collection,
  onClose,
  note = "",
  onNote,
  recipe,
  draft,
  onDraft,
}) {
  const [decision, setDecision] = useState(false);
  const [localDraft, setLocalDraft] = useState({});
  const keepButton = useRef(null);
  const saved = collection.has(bubble.id);
  const myth = mythCatalog.find((item) => item.id === bubble.mythId);
  const titleId = `reader-${bubble.id.replaceAll(":", "-")}`;
  function requestClose() {
    if (saved) {
      onClose();
      return;
    }
    setDecision(true);
    keepButton.current?.focus();
  }
  function keep() {
    collection.keep(bubble.id);
    sparkle(innerWidth / 2, innerHeight * 0.7, 100);
    soundEffect("drop");
    onClose();
  }
  return (
    <Modal
      titleId={titleId}
      onRequestClose={requestClose}
      className={`bubble-reader color-${bubble.color}`}
    >
      <header className="reader-header">
        <span>
          {bubble.kind === "projective" ? "Inspiré de " : ""}
          {bubble.mythTitle}
          {bubble.tradition ? ` · ${bubble.tradition}` : ""}
        </span>
        <button
          className="dialog-close"
          aria-label="Fermer la bulle"
          onClick={requestClose}
        >
          ×
        </button>
      </header>
      <div className="reader-body">
        {(bubble.kind === "projective" || bubble.kind === "inspiration") && (
          <p className="story-origin">
            {bubble.kind === "inspiration"
              ? "Le récit qui a inspiré ce mélange"
              : "Création libre · Rien n’est écrit d’avance"}
          </p>
        )}
        <span className="reader-emoji" aria-hidden="true">
          {bubble.emoji}
        </span>
        <h2 id={titleId}>{bubble.label}</h2>
        {bubble.text.split("\n\n").map((paragraph, index) => (
          <p className="bubble-text" key={index}>
            {paragraph}
          </p>
        ))}
        {bubble.key === "workshop" && (
          <StoryWorkshop
            recipe={recipe || projectiveRecipe(myth, {}, localDraft)}
            draft={draft || localDraft}
            onChange={onDraft || setLocalDraft}
          />
        )}
        {(bubble.kind === "story" || bubble.kind === "inspiration") && (
          <>
            <p className="hint">{myth.source}</p>
            <a
              className="research-link"
              href={researchUrl(myth)}
              target="_blank"
              rel="noopener noreferrer"
            >
              En savoir plus sur cette histoire ↗
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          </>
        )}
        {bubble.kind === "resource" && (
          <p className="hint">
            Tu peux garder cette idée si elle te parle, ou voir les choses
            autrement.
          </p>
        )}
        {bubble.kind === "question" && onNote && (
          <details className="reflection-writing">
            <summary>Écrire ma réponse</summary>
            <label className="sr-only" htmlFor={`${titleId}-note`}>
              {bubble.text}
            </label>
            <textarea
              id={`${titleId}-note`}
              value={note}
              maxLength={2000}
              rows={3}
              placeholder="Ce qui me vient…"
              onChange={(event) => onNote(event.target.value)}
            />
            <p className="hint">
              Ta réponse reste dans cette page. Elle n’est pas ajoutée à ta
              collection.
            </p>
          </details>
        )}
      </div>
      <footer className="reader-actions">
        <p role="status">
          {saved
            ? "Cette bulle est dans ton bouillon."
            : decision
              ? "Tu la gardes dans ton bouillon, ou tu la laisses ?"
              : "Une bulle qui te parle ? Garde-la pour plus tard."}
        </p>
        {saved ? (
          <>
            <button className="btn" onClick={onClose}>
              Fermer
            </button>
            <button
              className="text-button"
              onClick={() => {
                collection.remove(bubble.id);
                onClose();
              }}
            >
              Retirer de mon bouillon
            </button>
          </>
        ) : (
          <>
            <button
              ref={keepButton}
              className="btn"
              onClick={keep}
              aria-label="Garder dans mon bouillon"
            >
              Garder <span aria-hidden="true">♡</span>
            </button>
            <button
              className="back"
              onClick={onClose}
              aria-label="Laisser cette bulle"
            >
              Laisser
            </button>
          </>
        )}
        {!saved && (
          <p className="hint">
            {bubble.key === "seed" && bubble.kind === "projective"
              ? "Les valeurs choisies sont gardées dans ton bouillon. Tes mots personnels ne le sont pas."
              : bubble.kind === "projective" || bubble.kind === "inspiration"
                ? "Seuls les ingrédients de départ sont gardés, pas tes noms, ton univers ni tes réponses."
                : "Seul le texte de cette bulle sera gardé sur cet appareil, pas ta réponse."}
          </p>
        )}
        {collection.temporary && (
          <p className="hint">
            L’enregistrement n’est pas disponible. Ton bouillon reste pour cette
            session.
          </p>
        )}
      </footer>
    </Modal>
  );
}
