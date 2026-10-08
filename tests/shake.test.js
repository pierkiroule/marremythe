import { test } from "node:test";
import assert from "node:assert/strict";
import { createShakeDetector } from "../src/domain/shake.js";
const vector = (x) => ({ x, y: 0, z: 9.8 });
test("rest, missing sensor values and slow small motions do not trigger a shake", () => {
  const detect = createShakeDetector();
  assert.equal(detect(null, 0), false);
  assert.equal(detect({ x: null, y: null, z: null }, 20), false);
  assert.equal(detect(vector(0), 30), false);
  for (let i = 1; i < 50; i++)
    assert.equal(detect(vector(i * 0.02), 30 + i * 50), false);
});
test("acceleration changes produce debounced pulses rather than sample-rate progress", () => {
  const detect = createShakeDetector();
  assert.equal(detect(vector(0), 0), false);
  assert.equal(detect(vector(20), 250), true);
  assert.equal(detect(vector(-20), 270), false);
  assert.equal(detect(vector(20), 520), true);
  assert.equal(detect(vector(-20), 550), false);
  assert.equal(detect(vector(0), 800), true);
});
