import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialJourney,
  journeyReducer as reduce,
  canAdvance,
  ingredients,
} from "../src/domain/journey.js";
function selectedJourney() {
  let state = initialJourney();
  state = reduce(state, { type: "toggle", field: "type", index: 0 });
  state = reduce(state, { type: "next" });
  for (const field of ["emotion", "need"])
    state = reduce(state, { type: "toggle", field, index: 0 });
  return state;
}
test("navigation guards and selection limits", () => {
  let state = initialJourney();
  assert.equal(reduce(state, { type: "next" }).step, 0);
  for (let index = 0; index < 4; index++)
    state = reduce(state, { type: "toggle", field: "type", index });
  assert.equal(state.type.length, 3);
  state = reduce(state, { type: "toggle", field: "type", index: 0 });
  assert.deepEqual(state.type, [1, 2]);
  assert.equal(canAdvance(state), true);
});
test("cooking requires ingredients, caps progress and resets when selections change", () => {
  let state = reduce(selectedJourney(), { type: "next" });
  assert.equal(reduce(state, { type: "stir", now: 0 }).heat, 0);
  state = reduce(state, { type: "throwAll" });
  assert.equal(state.thrown.length, ingredients(state).length);
  for (let i = 0; i < 16; i++)
    state = reduce(state, { type: "stir", now: i * 100 });
  assert.equal(state.heat, 100);
  assert.equal(state.ms, 1400);
  state = reduce(state, { type: "next" });
  assert.equal(reduce(state, { type: "next" }).step, 3);
  state = reduce(state, { type: "aroma", index: 1 });
  assert.equal(reduce(state, { type: "next" }).step, 4);
  state = reduce(reduce(state, { type: "back" }), { type: "back" });
  state = reduce(state, { type: "back" });
  state = reduce(state, { type: "toggle", field: "need", index: 1 });
  assert.equal(state.heat, 0);
  assert.equal(state.bubble, null);
});
