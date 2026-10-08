import myths from "./myths.json" with { type: "json" };
import { catalogs } from "./journey.js";
import { BU } from "./catalog.js";

// The situation and the desired resource lead the match. An aroma refines it;
// it must never outweigh a concrete situation. Free text is not analysed or sent.
export const weights = { type: 6, need: 5, emotion: 3, aroma: 1 };
export const mythCatalog = myths;

export function rankMyths(state, catalog = mythCatalog) {
  const selection = Object.fromEntries(
    Object.entries(catalogs).map(([field, items]) => [
      field,
      [...new Set(state[field] || [])].filter(
        (index) =>
          Number.isInteger(index) && index >= 0 && index < items.length - 1,
      ),
    ]),
  );
  const hasConcreteSelection = Object.values(selection).some(
    (indices) => indices.length,
  );
  return catalog
    .map((myth) => {
      let score = 0;
      const matches = {};
      for (const field of Object.keys(catalogs)) {
        matches[field] = selection[field].filter((index) =>
          myth.tags[field].includes(index),
        );
        if (selection[field].length)
          score +=
            (weights[field] * matches[field].length) / selection[field].length;
      }
      const aromaMatches =
        Number.isInteger(state.bubble) &&
        myth.tags.aroma.includes(state.bubble);
      if (aromaMatches) score += weights.aroma;
      return {
        myth,
        score,
        matches,
        aromaMatches,
        hasConcreteSelection,
        selectedAroma: state.bubble,
      };
    })
    .sort((a, b) => b.score - a.score || a.myth.id.localeCompare(b.myth.id));
}

export function discoveryCandidates(state) {
  const ranked = rankMyths(state);
  if (!ranked[0]?.hasConcreteSelection) return ranked.slice(0, 3);
  // Keep alternatives close to the best fit and anchored in a situation or need.
  const best = ranked[0].score;
  const hasAnchor = ranked.some(
    (result) => result.matches.type.length || result.matches.need.length,
  );
  return ranked
    .filter(
      (result) =>
        result.score >= best * 0.75 &&
        (!hasAnchor ||
          result.matches.type.length ||
          result.matches.need.length),
    )
    .slice(0, 3);
}

export function resonanceReasons(result) {
  const reasons = [];
  for (const [field, prefix] of [
    ["type", "Ce qui te pèse"],
    ["emotion", "Ce que tu ressens"],
    ["need", "Ce que tu recherches"],
  ]) {
    if (result.matches[field].length)
      reasons.push(
        `${prefix} : ${result.matches[field].map((index) => catalogs[field][index][1].toLowerCase()).join(", ")}.`,
      );
  }
  if (result.aromaMatches)
    reasons.push(
      `L’image que tu as choisie : ${BU[result.selectedAroma][1].toLowerCase()}`,
    );
  return reasons;
}

export function researchUrl(myth) {
  // Only public cultural metadata is transmitted when the user opens the link.
  return `https://www.google.com/search?q=${encodeURIComponent(myth.searchQuery)}`;
}
