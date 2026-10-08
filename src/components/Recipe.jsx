import { useState } from "react";
import { generateRecipe } from "../domain/recipe.js";
import { ingredients } from "../domain/journey.js";
export default function Recipe({ state, dispatch }) {
  const [recipe, setRecipe] = useState(null);
  const [feedback, setFeedback] = useState("");
  const regenerate = () => {
    setRecipe(generateRecipe(state));
    setFeedback("");
  };
  async function copy() {
    try {
      await navigator.clipboard.writeText(recipe.text);
      setFeedback("Recette copiée ✓");
    } catch {
      setFeedback(
        "La copie est indisponible ici. Tu peux télécharger ta recette.",
      );
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([recipe.text], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "ma-recette-marremythe.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (!recipe)
    return (
      <>
        <div className="cloche">
          <button
            className="cl"
            aria-label="Soulever la cloche"
            onClick={regenerate}
          >
            🍽️
          </button>
        </div>
        <p className="center hint">
          Une histoire possible t’attend sous la cloche.
        </p>
      </>
    );
  return (
    <>
      <article className="myth show">
        <div className="halo" aria-hidden="true">
          {recipe.emoji}
        </div>
        <h2 tabIndex={-1}>{recipe.title}</h2>
        <p className="sub">
          Une histoire possible, pas une interprétation de ta personne.
        </p>
        <div className="meta">
          <div>
            <b>{ingredients(state).length}</b>
            <span>ingrédients</span>
          </div>
          <div>
            <b>{Math.max(1, Math.round(state.ms / 1000))} s</b>
            <span>de mijotage</span>
          </div>
          <div>
            <b>1</b>
            <span>humain servi</span>
          </div>
        </div>
        {recipe.sections.map(([emoji, title, text], index) => (
          <section className="sec" key={title} style={{ "--k": index }}>
            <h3>
              <span aria-hidden="true">{emoji}</span>
              {title}
            </h3>
            <p>{text}</p>
          </section>
        ))}
        <section className="sec chef" style={{ "--k": 4 }}>
          <h3>👩‍🍳 Le conseil du chef</h3>
          <p>{recipe.chef}</p>
        </section>
        <section className="sec" style={{ "--k": 5 }}>
          <h3>📜 Écho culturel</h3>
          <p>
            <b>{recipe.echo[0]}</b> — {recipe.echo[1]}.
          </p>
          <p className="hint">Une résonance symbolique, pas une équivalence.</p>
        </section>
      </article>
      <div className="footer">
        <button className="back" onClick={() => dispatch({ type: "restart" })}>
          🧺 Nouvelle recette
        </button>
        <button className="back" onClick={regenerate}>
          🔁 Re-mijoter
        </button>
        <button className="btn" onClick={copy}>
          Copier ma recette
        </button>
        <button className="back" onClick={download}>
          Télécharger le texte
        </button>
      </div>
      <p className="hint copy-status" role="status">
        {feedback}
      </p>
    </>
  );
}
