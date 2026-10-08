import { useState } from "react";
import { bubbleIndex } from "../domain/bubbles.js";
import Modal from "./Modal.jsx";
import BubbleReader from "./BubbleReader.jsx";
export default function ResourceCollection({ collection, onClose }) {
  const [active, setActive] = useState(null);
  const bubbles = collection.ids
    .map((id) => bubbleIndex.get(id))
    .filter(Boolean);
  const values = bubbles.filter((b) => b.kind === "value"),
    legacy = bubbles.filter((b) => b.kind !== "value");
  function list(items) {
    return (
      <ul className="collection-list">
        {items.map((bubble) => (
          <li key={bubble.id}>
            <button
              className={`collection-card color-${bubble.color}`}
              onClick={() => setActive(bubble)}
            >
              <span aria-hidden="true">{bubble.emoji}</span>
              <span>
                <strong>{bubble.label}</strong>
                <small>
                  {bubble.kind === "value" ? bubble.text : bubble.mythTitle}
                </small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <>
      <Modal
        titleId="collection-title"
        onRequestClose={onClose}
        className="collection-dialog"
      >
        <header className="reader-header">
          <h2 id="collection-title">Mon bouillon de valeurs</h2>
          <button
            className="dialog-close"
            aria-label="Fermer mon bouillon"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="reader-body">
          <p className="hint">
            Les valeurs que tu as reconnues dans tes colères.
          </p>
          {values.length ? (
            list(values)
          ) : (
            <p className="collection-empty">
              Ton bouillon est encore vide. Garde une valeur quand elle te
              ressemble.
            </p>
          )}
          {legacy.length > 0 && (
            <details className="legacy-bubbles">
              <summary>Mes anciennes bulles ({legacy.length})</summary>
              {list(legacy)}
            </details>
          )}
          <p className="hint collection-privacy">
            {collection.temporary
              ? "Ton bouillon reste pour cette session : ce navigateur ne peut pas l’enregistrer."
              : "Ton bouillon reste dans ce navigateur, sur cet appareil. Les autres personnes qui utilisent ce navigateur peuvent le voir."}{" "}
            Tes mots personnels ne sont pas enregistrés. Ouvre une valeur pour
            la retirer.
          </p>
        </div>
      </Modal>
      {active && (
        <BubbleReader
          bubble={active}
          collection={collection}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
