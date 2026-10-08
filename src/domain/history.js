// Only fragment indices are stored: personal free text never leaves memory.
export function readHistory() {
  try {
    const parsed = JSON.parse(
      globalThis.localStorage?.getItem("mm_hist") || "{}",
    );
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, value]) =>
          key !== "__proto__" &&
          Array.isArray(value) &&
          value.every((index) => Number.isInteger(index) && index >= 0),
      ),
    );
  } catch {
    return {};
  }
}
export function saveHistory(history) {
  try {
    globalThis.localStorage?.setItem("mm_hist", JSON.stringify(history));
  } catch {
    /* Storage is optional. */
  }
}
