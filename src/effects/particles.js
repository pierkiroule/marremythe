export function sparkle(x, y, count = 40, kind = "spark") {
  window.dispatchEvent(
    new CustomEvent("marremythe:particles", { detail: { x, y, count, kind } }),
  );
}
export function soundEffect(kind = "select") {
  window.dispatchEvent(new CustomEvent("marremythe:sound", { detail: kind }));
}
