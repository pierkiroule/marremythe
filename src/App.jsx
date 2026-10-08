import { useEffect, useReducer, useRef, useState } from "react";
import {
  canAdvance,
  initialJourney,
  journeyReducer,
  steps,
} from "./domain/journey.js";
import Choices from "./components/Choices.jsx";
import Cauldron from "./components/Cauldron.jsx";
import Discovery from "./components/Discovery.jsx";
import Particles from "./components/Particles.jsx";
import SoundToggle from "./components/SoundToggle.jsx";
import ResourceCollection from "./components/ResourceCollection.jsx";
import { useResourceCollection } from "./hooks/useResourceCollection.js";
const headings = [
  "J’en ai marre.",
  "Hop, à la marmite !",
  "Ton histoire t’attend.",
];
export default function App() {
  const [state, dispatch] = useReducer(
    journeyReducer,
    undefined,
    initialJourney,
  );
  const heading = useRef(null);
  const collection = useResourceCollection();
  const [collectionOpen, setCollectionOpen] = useState(false);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [state.step]);
  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <div className="aur" aria-hidden="true" />
      <div className="stars" aria-hidden="true" />
      <Particles intensity={state.step === 1 ? 0.6 + state.heat / 100 : 0.14} />
      <main className={`app ${state.step === 2 ? "reveal-app" : ""}`} id="main">
        <header className="top">
          <a className="brand" href="./" aria-label="MARREMYTHE, accueil">
            MARREMYTHE<span> •°</span>
          </a>
          <div className="header-controls">
            <button
              className="collection-toggle"
              onClick={() => setCollectionOpen(true)}
            >
              🥣 Mon bouillon ({collection.ids.length})
            </button>
            <SoundToggle />
          </div>
        </header>
        {state.step !== 2 && (
          <nav aria-label="Progression">
            <ol className="step-list">
              {steps.map(([emoji, name], index) => (
                <li
                  key={name}
                  className={
                    index === state.step
                      ? "current"
                      : index < state.step
                        ? "complete"
                        : ""
                  }
                  aria-current={index === state.step ? "step" : undefined}
                >
                  <span aria-hidden="true">{emoji}</span>
                  <span>{name}</span>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <section
          key={state.step}
          className="step-content"
          aria-labelledby={state.step === 2 ? "myth-title" : "step-title"}
        >
          {state.step !== 2 && (
            <h1 id="step-title" ref={heading} tabIndex={-1}>
              {headings[state.step]}
            </h1>
          )}
          {state.step === 0 && (
            <>
              <p className="intro">
                Un ras-le-bol. Quelques ingrédients. Une histoire pour y voir
                plus clair.
              </p>
              <Choices
                field="type"
                title="Qu’est-ce qui te pèse ?"
                state={state}
                dispatch={dispatch}
              />
              <Choices
                field="need"
                title="De quoi as-tu besoin ?"
                state={state}
                dispatch={dispatch}
              />
              <details className="optional-emotions">
                <summary>
                  Et ce que tu ressens ? <span>Facultatif</span>
                </summary>
                <Choices
                  field="emotion"
                  title="Une pincée d’émotion"
                  state={state}
                  dispatch={dispatch}
                />
              </details>
              <button
                className="btn primary-action"
                disabled={!canAdvance(state)}
                onClick={() => dispatch({ type: "next" })}
              >
                À la marmite →
              </button>
            </>
          )}
          {state.step === 1 && (
            <>
              <Cauldron state={state} dispatch={dispatch} />
              {state.heat < 100 && (
                <button
                  className="text-button return-button"
                  onClick={() => dispatch({ type: "edit" })}
                >
                  ← Mes ingrédients
                </button>
              )}
            </>
          )}
          {state.step === 2 && (
            <Discovery
              state={state}
              dispatch={dispatch}
              collection={collection}
            />
          )}
        </section>
        {state.step !== 2 && (
          <footer className="app-note">
            Tes choix restent ici. À toi de voir ce que l’histoire t’apporte.
          </footer>
        )}
        {collection.temporary && (
          <p className="collection-warning" role="status">
            Ton navigateur ne peut pas enregistrer le bouillon. Il reste pour
            cette session.
          </p>
        )}
      </main>
      {collectionOpen && (
        <ResourceCollection
          collection={collection}
          onClose={() => setCollectionOpen(false)}
        />
      )}
    </>
  );
}
