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
import Welcome from "./components/Welcome.jsx";
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
  const [started, setStarted] = useState(false);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [state.step, started]);
  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <div
        className={`aur ${started && state.step === 0 ? "quiet" : ""}`}
        aria-hidden="true"
      />
      <div className="stars" aria-hidden="true" />
      <Particles
        intensity={
          !started
            ? 0.8
            : state.step === 1
              ? 0.8
              : state.step === 0
                ? 0.04
                : 0.1
        }
      />
      <main
        className={`app ${!started ? "welcome-app" : state.step === 2 ? "reveal-app" : ""}`}
        id="main"
      >
        <header className="top">
          <a
            className="brand"
            href="./"
            aria-label="La Marmythe à colère, accueil"
          >
            MARMYTHE<span> •°</span>
          </a>
          <div className="header-controls">
            <button
              className="collection-toggle"
              onClick={() => setCollectionOpen(true)}
            >
              🥣 Mon bouillon (
              {collection.ids.filter((id) => id.startsWith("value:")).length})
            </button>
            <SoundToggle />
          </div>
        </header>
        {!started && <Welcome onStart={() => setStarted(true)} />}
        {started && state.step !== 2 && (
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
        {started && (
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
                  Jette tes colères dans la marmythe. Une bulle fera apparaître
                  une valeur possible. À toi de voir si elle te ressemble.
                </p>
                <Choices
                  field="type"
                  title="J’en ai marre de…"
                  state={state}
                  dispatch={dispatch}
                />
                <button
                  className="btn primary-action"
                  disabled={!canAdvance(state)}
                  onClick={() => dispatch({ type: "next" })}
                >
                  Je les jette →
                </button>
              </>
            )}
            {state.step === 1 && (
              <>
                <Cauldron state={state} dispatch={dispatch} />
                {state.thrown.length < state.type.length && (
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
        )}
        {started && state.step !== 2 && (
          <footer className="app-note">
            Ta colère a sa place. À toi de choisir ce qu’elle défend.
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
