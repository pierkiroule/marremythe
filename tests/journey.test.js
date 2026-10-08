import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialJourney,
  journeyReducer as reduce,
  canAdvance,
  ingredients,
  steps,
} from "../src/domain/journey.js";
function selectedJourney() {
  let state = initialJourney();
  for (const field of ["type", "need"])
    state = reduce(state, { type: "toggle", field, index: 0 });
  return state;
}
test("three-stage flow requires a situation and need but emotions are optional", () => {
  assert.equal(steps.length, 3);
  let state = initialJourney();
  assert.equal(reduce(state, { type: "next" }).step, 0);
  state = reduce(state, { type: "toggle", field: "type", index: 0 });
  assert.equal(canAdvance(state), false);
  state = reduce(state, { type: "toggle", field: "need", index: 0 });
  assert.equal(canAdvance(state), true);
  assert.equal(reduce(state, { type: "next" }).step, 1);
});
test("selection limits and edit reset cooking only when selections change", () => {
  let state = initialJourney();
  for (let index = 0; index < 4; index++)
    state = reduce(state, { type: "toggle", field: "type", index });
  assert.equal(state.type.length, 3);
  state = reduce(state, { type: "toggle", field: "type", index: 0 });
  assert.deepEqual(state.type, [1, 2]);
  state = {
    ...selectedJourney(),
    step: 1,
    heat: 60,
    thrown: ["type-0", "need-0"],
  };
  assert.deepEqual(
    reduce(state, { type: "toggle", field: "type", index: 1 }),
    state,
  );
  state = reduce(state, { type: "edit" });
  assert.equal(state.step, 0);
  assert.equal(state.heat, 60);
  state = reduce(state, { type: "toggle", field: "need", index: 1 });
  assert.equal(state.heat, 0);
  assert.deepEqual(state.thrown, []);
});
test("only valid dropped ingredients count and five mixing pulses finish the flow", () => {
  let state = reduce(selectedJourney(), { type: "next" });
  assert.equal(reduce(state, { type: "stir", now: 0 }).heat, 0);
  assert.equal(reduce(state, { type: "throw", id: "fake" }), state);
  state = reduce(state, { type: "throw", id: "type-0" });
  state = reduce(state, { type: "throw", id: "type-0" });
  assert.equal(state.thrown.length, 1);
  assert.equal(reduce(state, { type: "stir", now: 0 }).heat, 0);
  state = reduce(state, { type: "throw", id: "need-0" });
  assert.equal(state.thrown.length, ingredients(state).length);
  for (let i = 0; i < 5; i++)
    state = reduce(state, { type: "stir", now: i * 300 });
  assert.equal(state.heat, 100);
  assert.equal(state.ms, 1200);
  assert.equal(reduce(state, { type: "stir", now: NaN }).heat, 100);
  state = reduce(state, { type: "next" });
  assert.equal(state.step, 2);
  assert.equal(reduce(state, { type: "next" }).step, 2);
  assert.deepEqual(reduce(state, { type: "restart" }), initialJourney());
});
