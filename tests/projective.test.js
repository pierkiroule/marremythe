import { test } from "node:test";
import assert from "node:assert/strict";
import { mythCatalog } from "../src/domain/matching.js";
import {
  motifs,
  projectiveRecipe,
  projectiveBubbles,
  draftLimits,
} from "../src/domain/projective.js";
import {
  bubbleIndex,
  encodeCollection,
  parseCollection,
} from "../src/domain/bubbles.js";
test("every cultural inspiration provides its own sensory world, obstacle, object and ally, with an open ending", () => {
  assert.equal(Object.keys(motifs).length, mythCatalog.length);
  for (const myth of mythCatalog) {
    assert.equal(motifs[myth.id].length, 6);
    const recipe = projectiveRecipe(myth);
    for (const key of [
      "title",
      "hero",
      "world",
      "obstacle",
      "object",
      "ally",
      "quest",
    ])
      assert.ok(recipe[key].length > 10, `${myth.id}: ${key}`);
    const bubbles = projectiveBubbles(myth);
    assert.equal(bubbles.length, 6);
    assert.equal(new Set(bubbles.map((b) => b.id)).size, 6);
    assert.ok(bubbles[0].text.includes("ni le chemin, ni la fin"));
    const cultural = bubbles.find((b) => b.kind === "inspiration");
    assert.ok(cultural.text.includes(myth.summary));
    assert.ok(
      cultural.text.includes("Ce n’est pas une version traditionnelle"),
    );
    assert.ok(bubbles.every((b) => bubbleIndex.has(b.id)));
  }
  assert.equal(
    new Set(Object.values(motifs).map((m) => m[2])).size,
    mythCatalog.length,
  );
});
test("chosen values guide the quest and personal drafts shape the seed without entering the saved collection", () => {
  const myth = mythCatalog.find((m) => m.id === "sisyphe");
  assert.notEqual(
    projectiveRecipe(myth, { need: [2] }).quest,
    projectiveRecipe(myth, { need: [0] }).quest,
  );
  const state = { need: [1, 2], other: { type: "PRIVATE" } };
  assert.ok(!JSON.stringify(projectiveRecipe(myth, state)).includes("PRIVATE"));
  const draft = {
    hero: "PRIVATE_HERO",
    world: "PRIVATE_WORLD",
    quest: "PRIVATE_QUEST",
    ally: "PRIVATE_ALLY",
  };
  const bubbles = projectiveBubbles(myth, state, draft);
  assert.ok(bubbles[1].text.includes("PRIVATE_HERO"));
  assert.ok(bubbles[2].text.includes("PRIVATE_QUEST"));
  const stored = encodeCollection(bubbles.map((b) => b.id));
  assert.ok(!stored.includes("PRIVATE"));
  assert.ok(
    parseCollection(stored)
      .map((id) => bubbleIndex.get(id))
      .every((b) => !b.text.includes("PRIVATE")),
  );
  assert.deepEqual(
    parseCollection(
      encodeCollection(["sisyphe:idea", "sisyphe:projective:quest"]),
    ),
    ["sisyphe:idea", "sisyphe:projective:quest"],
  );
  const bounded = projectiveRecipe(myth, {}, { hero: "x".repeat(1000) });
  assert.equal(bounded.hero.length, draftLimits.hero);
  assert.equal(
    projectiveRecipe(myth, {}, { hero: "   " }).hero,
    projectiveRecipe(myth).hero,
  );
});
