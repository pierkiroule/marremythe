import { TY, EM, NE } from "./catalog.js";
export const catalogs = { type: TY, emotion: EM, need: NE };
export const limits = { type: 3, emotion: 2, need: 2 };
export const steps = [
  ["🧺", "Le garde-manger"],
  ["🌶️", "Les épices"],
  ["🍲", "La marmite"],
  ["🫧", "Les arômes"],
  ["🍽️", "Le service"],
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
  return Object.entries(catalogs).flatMap(([field, items]) =>
    state[field].map((index) => ({
      id: `${field}-${index}`,
      emoji: items[index][0],
      label: items[index][1],
    })),
  );
}
export function canAdvance(state) {
  return [
    state.type.length > 0,
    state.emotion.length > 0 && state.need.length > 0,
    state.heat >= 100,
    state.bubble !== null,
    false,
  ][state.step];
}
export function journeyReducer(state, action) {
  switch (action.type) {
    case "toggle": {
      const { field, index } = action;
      if (!catalogs[field]?.[index] || state.step > 1) return state;
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
        bubble: null,
      };
    }
    case "text":
      return catalogs[action.field]
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
    case "back":
      return { ...state, step: Math.max(0, state.step - 1) };
    case "throw":
      return state.step === 2 &&
        ingredients(state).some((i) => i.id === action.id)
        ? { ...state, thrown: [...new Set([...state.thrown, action.id])] }
        : state;
    case "throwAll":
      return state.step === 2
        ? { ...state, thrown: ingredients(state).map((i) => i.id) }
        : state;
    case "stir": {
      if (
        state.step !== 2 ||
        state.thrown.length !== ingredients(state).length ||
        state.heat >= 100
      )
        return state;
      const now = action.now;
      const heat = Math.min(100, state.heat + 7);
      const startedAt = state.startedAt ?? now;
      return {
        ...state,
        heat,
        startedAt,
        ms: heat === 100 ? Math.max(1000, now - startedAt) : 0,
      };
    }
    case "aroma":
      return state.step === 3 &&
        Number.isInteger(action.index) &&
        action.index >= 0 &&
        action.index < 10
        ? { ...state, bubble: action.index }
        : state;
    case "resetAroma":
      return { ...state, bubble: null };
    case "restart":
      return initialJourney();
    default:
      return state;
  }
}
