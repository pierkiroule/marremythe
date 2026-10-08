import { test } from "node:test";
import assert from "node:assert/strict";
import {
  storyBubbles,
  bubbleIndex,
  parseCollection,
  encodeCollection,
} from "../src/domain/bubbles.js";
import { mythCatalog } from "../src/domain/matching.js";
test("legacy cultural collections retain six distinct bubbles covering the story, resources and all questions", () => {
  for (const myth of mythCatalog) {
    const bubbles = storyBubbles(myth);
    assert.equal(bubbles.length, 6);
    assert.equal(new Set(bubbles.map((b) => b.id)).size, 6);
    assert.equal(bubbles[0].text, myth.summary);
    assert.equal(bubbles[1].text, myth.resource);
    assert.equal(bubbles[2].text, myth.nourishment);
    assert.deepEqual(
      bubbles.filter((b) => b.kind === "question").map((b) => b.text),
      myth.questions.map((q) => q.prompt),
    );
  }
  assert.equal(bubbleIndex.size, 1960);
});
test("collection only stores known public bubble identifiers, never supplied texts or notes", () => {
  const ids = [
    "sisyphe:story",
    "sisyphe:story",
    "unknown",
    "atlas:question-possibility",
  ];
  assert.deepEqual(parseCollection(encodeCollection(ids)), [
    "sisyphe:story",
    "atlas:question-possibility",
  ]);
  assert.deepEqual(
    parseCollection(
      JSON.stringify({
        version: 1,
        ids: ["sisyphe:story", 5, "<script>", null],
        note: "PRIVATE",
      }),
    ),
    ["sisyphe:story"],
  );
  for (const raw of [
    "null",
    "{}",
    "[]",
    "bad",
    JSON.stringify({ version: 2, ids: ["atlas:story"] }),
  ])
    assert.deepEqual(parseCollection(raw), []);
  assert.ok(!encodeCollection(ids).includes("text"));
});
