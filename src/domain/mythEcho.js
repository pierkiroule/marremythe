import { rankMyths } from "./matching.js";
import { TY } from "./catalog.js";
import { valueCatalog } from "./values.js";

export function mythEcho(state, valueIndex) {
  if (
    !Number.isInteger(valueIndex) ||
    valueIndex < 0 ||
    valueIndex >= valueCatalog.length - 1
  )
    return null;
  // Only the recognised value and predefined anger choices guide the story.
  const result = rankMyths({
    type: state.type || [],
    need: [valueIndex],
    emotion: [],
    bubble: null,
  }).find((result) => result.myth.tags.values.includes(valueIndex));
  if (!result) return null;
  const angers = [...new Set(state.type || [])]
    .filter(
      (index) => Number.isInteger(index) && index >= 0 && index < TY.length - 1,
    )
    .map((index) => TY[index][1]);
  return {
    myth: result.myth,
    angers,
    matchedAngers: result.matches.type.map((index) => TY[index][1]),
    value: {
      label: valueCatalog[valueIndex][1],
      meaning: valueCatalog[valueIndex][2],
    },
  };
}
