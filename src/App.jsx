import { useEffect, useReducer, useRef } from "react";
import {
  canAdvance,
  initialJourney,
  journeyReducer,
  steps,
} from "./domain/journey.js";
import Choices from "./components/Choices.jsx";
import Cauldron from "./components/Cauldron.jsx";
import Aromas from "./components/Aromas.jsx";
import Discovery from "./components/Discovery.jsx";
const headings = [
  "J’en ai plus que marre.",
  "Quelles épices là-dedans ?",
  "À la marmite.",
  "Quelle saveur t’appelle ?",
  "Un récit fait écho.",
];
const descriptions = [
  "Qu’est-ce qui te pèse ? Choisis jusqu’à trois ingrédients amers. Rien à écrire.",
  "Ce que ça te fait, c’est le piquant. Ce qui te manque, ce sont les herbes fraîches.",
  "Jette tes ingrédients, puis remue jusqu’à ce que ça mijote à point.",
  "Une bulle pour chaque possible. Choisis celle qui te parle.",
  "Tes choix ouvrent une porte vers un mythe ou une légende à découvrir.",
];
const nextLabels = [
  "Vers les épices",
  "Vers la marmite",
  "Goûter les arômes",
  "Découvrir mon récit",
];
export default function App() {
  const [state, dispatch] = useReducer(
    journeyReducer,
    undefined,
    initialJourney,
  );
  const heading = useRef(null);
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
      <main className="app" id="main">
        <header className="top">
          <a className="brand" href="./" aria-label="MARREMYTHE, accueil">
            MARREMYTHE<span> •°</span>
          </a>
          <span className="edition">L’atelier des possibles</span>
        </header>
        <nav aria-label="Progression de la découverte">
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
                <span className="step-name">
                  {name
                    .replace("Le ", "")
                    .replace("Les ", "")
                    .replace("La ", "")}
                </span>
              </li>
            ))}
          </ol>
        </nav>
        <section
          className="step-content"
          key={state.step}
          aria-labelledby="step-title"
        >
          <div className="eb">
            {steps[state.step][0]} {steps[state.step][1]}{" "}
            <span className="step-number">{state.step + 1} / 5</span>
          </div>
          <h1 id="step-title" ref={heading} tabIndex={-1}>
            {headings[state.step]}
          </h1>
          <p className="intro">{descriptions[state.step]}</p>
          {state.step === 0 && (
            <Choices
              field="type"
              title="Tes ingrédients amers"
              state={state}
              dispatch={dispatch}
            />
          )}
          {state.step === 1 && (
            <>
              <Choices
                field="emotion"
                title="🌶️ Ce que ça me fait"
                state={state}
                dispatch={dispatch}
              />
              <Choices
                field="need"
                title="🌿 Ce qui me manque"
                state={state}
                dispatch={dispatch}
              />
            </>
          )}
          {state.step === 2 && <Cauldron state={state} dispatch={dispatch} />}
          {state.step === 3 && <Aromas state={state} dispatch={dispatch} />}
          {state.step === 4 && <Discovery state={state} dispatch={dispatch} />}
          {state.step < 4 && (
            <div className="footer">
              {state.step > 0 && (
                <button
                  className="back"
                  onClick={() => dispatch({ type: "back" })}
                >
                  ← Retour
                </button>
              )}
              <button
                className="btn"
                disabled={!canAdvance(state)}
                onClick={() => dispatch({ type: "next" })}
              >
                {nextLabels[state.step]} →
              </button>
            </div>
          )}
        </section>
        <footer className="app-note">
          Des histoires anciennes, des échos pour aujourd’hui.
          <br />
          <span>
            Tes mots restent dans cette page. Aucun compte, aucun envoi.
          </span>
        </footer>
      </main>
    </>
  );
}
