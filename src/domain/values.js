export const valueCatalog = [
  ["🕊️", "Liberté", "Pouvoir choisir et avoir de la marge."],
  [
    "🫂",
    "Solidarité",
    "Partager les efforts et pouvoir compter sur de l’aide.",
  ],
  ["🌿", "Équilibre", "Respecter son temps, son énergie et ses limites."],
  ["✨", "Reconnaissance", "Être vu et pris au sérieux."],
  ["🧭", "Sens", "Comprendre ce qu’on fait et ce qui compte."],
  ["⚖️", "Justice et respect", "Être traité avec respect et sans injustice."],
  ["🤝", "Lien", "Avoir des relations où chacun a sa place."],
  ["🌱", "Renouveau", "Pouvoir faire évoluer ce qui ne convient plus."],
  ["✳️", "Autre", "Une valeur à nommer avec tes propres mots."],
];
export function selectedValues(indices = []) {
  return [...new Set(indices)]
    .filter(
      (index) =>
        Number.isInteger(index) &&
        index >= 0 &&
        index < valueCatalog.length - 1,
    )
    .map((index) => ({
      index,
      label: valueCatalog[index][1],
      meaning: valueCatalog[index][2],
    }));
}
// Possibilities, never an interpretation imposed on the person.
export const angerValueHints = [
  [1, 2, 5],
  [4, 7],
  [0, 5],
  [3, 5],
  [5, 6],
  [4],
  [2],
  [0, 6],
  [0, 7],
  [5, 6],
];
export function suggestedValues(angers = []) {
  return selectedValues(
    angers.flatMap((index) => angerValueHints[index] || []).slice(0, 4),
  );
}
