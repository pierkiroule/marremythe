export function sparkle(x, y, count = 40, kind = "spark") {
  window.dispatchEvent(
    new CustomEvent("marremythe:particles", { detail: { x, y, count, kind } }),
  );
}
export function soundEffect(kind = "select") {
  window.dispatchEvent(new CustomEvent("marremythe:sound", { detail: kind }));
}

let readers = 0;
export function pauseParticles() {
  readers += 1;
  if (readers === 1)
    window.dispatchEvent(
      new CustomEvent("marremythe:reading", { detail: true }),
    );
  let active = true;
  return () => {
    if (!active) return;
    active = false;
    readers -= 1;
    if (readers === 0)
      window.dispatchEvent(
        new CustomEvent("marremythe:reading", { detail: false }),
      );
  };
}
