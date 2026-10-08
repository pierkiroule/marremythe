import { useState } from "react";
import { bubbleIndex } from "../domain/bubbles.js";
import Modal from "./Modal.jsx";
import BubbleReader from "./BubbleReader.jsx";
export default function ResourceCollection({ collection, onClose }) {
  const [active, setActive] = useState(null);
  const bubbles = collection.ids
    .map((id) => bubbleIndex.get(id))
    .filter(Boolean);
  return (
    <>
      <Modal
        titleId="collection-title"
        onRequestClose={onClose}
        className="collection-dialog"
      >
        <header className="reader-header">
          <h2 id="collection-title">Mon bouillon de ressources</h2>
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
            Les bulles que tu as choisies. À rouvrir quand tu veux.
          </p>
          {bubbles.length ? (
            <ul className="collection-list">
              {bubbles.map((bubble) => (
                <li key={bubble.id}>
                  <button
                    className={`collection-card color-${bubble.color}`}
                    onClick={() => setActive(bubble)}
                  >
                    <span aria-hidden="true">{bubble.emoji}</span>
                    <span>
                      <strong>{bubble.label}</strong>
                      <small>{bubble.mythTitle}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="collection-empty">
              Ton bouillon est encore vide. Ouvre une bulle et garde celles qui
              te parlent.
            </p>
          )}
          <p className="hint collection-privacy">
            {collection.temporary
              ? "Ton navigateur ne peut pas enregistrer le bouillon. Il reste disponible tant que cette page reste ouverte."
              : "Ton bouillon est enregistré dans ce navigateur, sur cet appareil. Les textes conservés restent accessibles aux autres personnes qui utilisent ce navigateur."}{" "}
            Tes réponses personnelles ne sont pas enregistrées. Tu peux retirer
            chaque bulle en l’ouvrant.
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
