import { test } from "node:test";
import assert from "node:assert/strict";
import { selectedValues, suggestedValues } from "../src/domain/values.js";
import {
  projectiveBubbles,
  projectiveRecipe,
} from "../src/domain/projective.js";
import { mythCatalog } from "../src/domain/matching.js";
test("anger suggests possibilities without imposing values or interpreting personal text", () => {
  assert.ok(suggestedValues([0]).some((value) => value.label === "Solidarité"));
  assert.ok(
    suggestedValues([3]).some((value) => value.label === "Reconnaissance"),
  );
  assert.deepEqual(selectedValues([8, -1, 9, "1"]), []);
  assert.equal(selectedValues([1, 1]).length, 1);
  const myth = mythCatalog.find((myth) => myth.id === "sisyphe");
  const recipe = projectiveRecipe(myth, {
    type: [0],
    need: [5],
    other: { need: "PRIVATE" },
  });
  assert.deepEqual(
    recipe.values.map((value) => value.label),
    ["Justice et respect"],
  );
  assert.ok(recipe.quest.includes("justice"));
  assert.ok(!JSON.stringify(recipe).includes("PRIVATE"));
  const unknown = projectiveBubbles(myth, { type: [10], need: [8] });
  assert.ok(unknown[0].text.includes("mots te manquent"));
  assert.equal(
    projectiveRecipe(myth, { type: [10], need: [8] }).values.length,
    0,
  );
});
