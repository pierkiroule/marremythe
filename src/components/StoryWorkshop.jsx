import { draftLimits } from "../domain/projective.js";
const fields = [
  ["hero", "Ton héros ou ton héroïne", "Un prénom, un surnom, une créature…"],
  ["world", "Ton décor", "Un lieu réel, magique ou complètement bizarre…"],
  ["quest", "Sa quête", "Qu’aimerait ton personnage voir changer ?"],
  ["ally", "Son allié", "Une personne, un animal, une équipe…"],
];
export default function StoryWorkshop({ recipe, draft, onChange }) {
  return (
    <div className="story-workshop">
      <p className="hint">
        Tout est facultatif. Tes mots restent dans cette page.
      </p>
      {fields.map(([key, label, placeholder]) => (
        <div className="story-field" key={key}>
          <label htmlFor={`story-${key}`}>{label}</label>
          <input
            id={`story-${key}`}
            value={draft[key] || ""}
            maxLength={draftLimits[key]}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(event) =>
              onChange({ ...draft, [key]: event.target.value })
            }
          />
          {key !== "hero" && (
            <div
              className="story-suggestions"
              aria-label={`Idées pour ${label.toLowerCase()}`}
            >
              {[
                recipe[key],
                ...(key === "world"
                  ? [
                      "un collège où les couloirs changent de planète",
                      "une ville sous-marine aux lampadaires méduses",
                    ]
                  : key === "quest"
                    ? [
                        "trouver une place où être soi-même",
                        "rendre une journée un peu plus légère",
                      ]
                    : [
                        "un dragon timide qui fait rire",
                        "une bande d’amis aux pouvoirs minuscules",
                      ]),
              ]
                .filter(
                  (value, index, values) => values.indexOf(value) === index,
                )
                .map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => onChange({ ...draft, [key]: value })}
                  >
                    {value}
                  </button>
                ))}
            </div>
          )}
        </div>
      ))}
      <div className="story-preview" aria-label="Ton amorce d’histoire">
        <h3>Ça commence comme ça…</h3>
        <p>
          Dans {recipe.world}, une aventure attend {recipe.hero}. Une envie :{" "}
          {recipe.quest}.
        </p>
        <p>
          Sur la route : {recipe.ally}. Et un objet étrange : {recipe.object}.
          Le premier geste ? La suite ? C’est à toi de la laisser mijoter.
        </p>
      </div>
      <details className="story-questions">
        <summary>Trois questions pour faire mijoter</summary>
        <p>
          Qu’est-ce qui pèse sur ton personnage, et qu’aimerait-il protéger ou
          retrouver ?
        </p>
        <p>
          Quelle force ou quelle rencontre pourrait l’aider, même un tout petit
          peu ?
        </p>
        <p>Quel premier geste pourrait-il essayer, sans devoir tout régler ?</p>
      </details>
      <p className="hint">
        Tu peux changer les règles, garder une fin ouverte ou simplement rêver
        la scène. Recommencer ou recharger efface tes mots.
      </p>
    </div>
  );
}
