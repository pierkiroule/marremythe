import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialJourney,
  journeyReducer as reduce,
  canAdvance,
  ingredients,
} from "../src/domain/journey.js";
test("only anger selection is needed to begin and only anger ingredients are thrown", () => {
  let state = initialJourney();
  assert.equal(canAdvance(state), false);
  state = reduce(state, { type: "toggle", field: "type", index: 0 });
  assert.equal(canAdvance(state), true);
  assert.deepEqual(state.need, []);
  assert.deepEqual(
    ingredients({ ...state, need: [1], emotion: [0] }).map((i) => i.id),
    ["type-0"],
  );
});
test("all selected angers must land before direct revelation; neither mixing nor sensors are required", () => {
  let state = { ...initialJourney(), step: 1, type: [0, 3] };
  assert.equal(reduce(state, { type: "next" }).step, 1);
  state = reduce(state, { type: "throw", id: "fake" });
  assert.deepEqual(state.thrown, []);
  state = reduce(state, { type: "throw", id: "type-0" });
  state = reduce(state, { type: "throw", id: "type-0" });
  assert.deepEqual(state.thrown, ["type-0"]);
  assert.equal(canAdvance(state), false);
  state = reduce(state, { type: "throw", id: "type-3" });
  assert.equal(canAdvance(state), true);
  assert.equal(state.heat, 0);
  assert.equal(reduce(state, { type: "next" }).step, 2);
  assert.equal(canAdvance({ ...initialJourney(), step: 1 }), false);
});
test("selection limits, editing and restarting preserve the simple flow", () => {
  let state = initialJourney();
  for (let index = 0; index < 4; index++)
    state = reduce(state, { type: "toggle", field: "type", index });
  assert.equal(state.type.length, 3);
  state = reduce(state, { type: "next" });
  assert.deepEqual(
    reduce(state, { type: "toggle", field: "type", index: 5 }),
    state,
  );
  state = reduce(state, { type: "throw", id: "type-0" });
  state = reduce(state, { type: "edit" });
  state = reduce(state, { type: "toggle", field: "type", index: 0 });
  assert.deepEqual(state.thrown, []);
  assert.deepEqual(reduce(state, { type: "restart" }), initialJourney());
});
