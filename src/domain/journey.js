import { TY, EM } from "./catalog.js";
import { valueCatalog } from "./values.js";
// `need` remains the internal field name; its choices now represent values.
export const catalogs = { type: TY, emotion: EM, need: valueCatalog };
export const limits = { type: 3, emotion: 2, need: 2 };
export const steps = [
  ["🔥", "Mes colères"],
  ["🍲", "Je jette"],
  ["✨", "Mon arôme"],
];
export const initialJourney = () => ({
  step: 0,
  type: [],
  emotion: [],
  need: [],
  other: { type: "", emotion: "", need: "" },
  bubble: null,
  thrown: [],
  heat: 0,
  startedAt: null,
  ms: 0,
});
export function ingredients(state) {
  return state.type
    .filter((index) => catalogs.type[index])
    .map((index) => ({
      id: `type-${index}`,
      emoji: catalogs.type[index][0],
      label: catalogs.type[index][1],
    }));
}
export function canAdvance(state) {
  const items = ingredients(state);
  return state.step === 0
    ? items.length > 0
    : state.step === 1 &&
        items.length > 0 &&
        items.every((item) => state.thrown.includes(item.id));
}
export function journeyReducer(state, action) {
  switch (action.type) {
    case "toggle": {
      const { field, index } = action;
      if (!catalogs[field]?.[index] || state.step !== 0) return state;
      const selected = state[field];
      if (!selected.includes(index) && selected.length >= limits[field])
        return state;
      return {
        ...state,
        [field]: selected.includes(index)
          ? selected.filter((i) => i !== index)
          : [...selected, index],
        thrown: [],
        heat: 0,
        startedAt: null,
        ms: 0,
      };
    }
    case "text":
      return state.step === 0 && catalogs[action.field]
        ? {
            ...state,
            other: {
              ...state.other,
              [action.field]: action.value.slice(0, 120),
            },
          }
        : state;
    case "next":
      return canAdvance(state) ? { ...state, step: state.step + 1 } : state;
    case "edit":
      return { ...state, step: 0 };
    case "back":
      return { ...state, step: Math.max(0, state.step - 1) };
    case "throw":
      return state.step === 1 &&
        ingredients(state).some((i) => i.id === action.id)
        ? { ...state, thrown: [...new Set([...state.thrown, action.id])] }
        : state;
    case "throwAll":
      return state.step === 1
        ? { ...state, thrown: ingredients(state).map((i) => i.id) }
        : state;
    case "restart":
      return initialJourney();
    default:
      return state;
  }
}
