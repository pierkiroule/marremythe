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

export function angerAromas(angers = []) {
  const scores = new Map();
  for (const anger of [...new Set(angers)]
    .filter(Number.isInteger)
    .sort((a, b) => a - b)) {
    if (!Number.isInteger(anger)) continue;
    for (const index of angerValueHints[anger] || [])
      scores.set(index, (scores.get(index) || 0) + 1);
  }
  // A free-form anger is not analysed. Offer an explicitly general possibility.
  const general = scores.size === 0;
  const candidates = general
    ? [[5, 0]]
    : [...scores].sort((a, b) => b[1] - a[1]);
  return candidates.map(([index]) => ({
    ...selectedValues([index])[0],
    id: `value:${index}`,
    emoji: valueCatalog[index][0],
    general,
  }));
}
export const valueCollectionBubbles = valueCatalog
  .slice(0, -1)
  .map(([emoji, label, meaning], index) => ({
    id: `value:${index}`,
    key: "value",
    kind: "value",
    emoji,
    label,
    text: meaning,
    color: ["violet", "mint", "mint", "gold", "blue", "gold", "pink", "peach"][
      index
    ],
    mythTitle: "Mon bouillon de valeurs",
    tradition: "",
  }));
