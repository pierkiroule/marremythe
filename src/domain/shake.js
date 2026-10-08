// Changes in acceleration detect shakes, not gravity at rest. Timestamp debounce
// makes progress independent of the sensor sampling rate.
export function createShakeDetector({ threshold = 12, cooldown = 230 } = {}) {
  let previous = null;
  let lastShake = -Infinity;
  return (acceleration, now) => {
    const vector = acceleration && [
      acceleration.x,
      acceleration.y,
      acceleration.z,
    ];
    if (!vector || !vector.every(Number.isFinite) || !Number.isFinite(now))
      return false;
    const last = previous;
    previous = vector;
    if (!last) return false;
    const delta = Math.hypot(
      ...vector.map((value, index) => value - last[index]),
    );
    if (delta < threshold || now - lastShake < cooldown) return false;
    lastShake = now;
    return true;
  };
}
