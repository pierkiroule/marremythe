import { test } from "node:test";
import assert from "node:assert/strict";
import {
  rankMyths,
  discoveryCandidates,
  mythCatalog,
  researchUrl,
  resonanceReasons,
} from "../src/domain/matching.js";
import { catalogs } from "../src/domain/journey.js";
const state = (type, emotion, need, bubble = null) => ({
  type,
  emotion,
  need,
  bubble,
});

test("catalogue metadata, unique identities and taxonomy are complete", () => {
  assert.equal(
    new Set(mythCatalog.map((myth) => myth.id)).size,
    mythCatalog.length,
  );
  assert.ok(mythCatalog.length >= 40);
  for (const myth of mythCatalog) {
    for (const field of [
      "id",
      "title",
      "kind",
      "tradition",
      "summary",
      "resource",
      "source",
      "searchQuery",
    ])
      assert.ok(
        typeof myth[field] === "string" && myth[field].trim(),
        `${myth.id}: ${field}`,
      );
    for (const [field, choices] of Object.entries(catalogs)) {
      assert.ok(
        (field === "need" ? myth.tags.values : myth.tags[field]).length,
      );
      assert.ok(
        (field === "need" ? myth.tags.values : myth.tags[field]).every(
          (i) => Number.isInteger(i) && i >= 0 && i < choices.length - 1,
        ),
      );
    }
    assert.ok(
      myth.tags.aroma.every((i) => Number.isInteger(i) && i >= 0 && i < 10),
    );
    assert.equal(
      new URL(researchUrl(myth)).searchParams.get("q"),
      myth.searchQuery,
    );
  }
  for (const [field, choices] of Object.entries(catalogs)) {
    for (let index = 0; index < choices.length - 1; index++)
      assert.ok(
        mythCatalog.some((myth) =>
          (field === "need" ? myth.tags.values : myth.tags[field]).includes(
            index,
          ),
        ),
        `uncovered ${field}:${index}`,
      );
  }
});

test("representative situations bring relevant traditional stories to the front", () => {
  const examples = [
    [state([1], [3], [4], 6), "sisyphe"],
    [state([5], [5], [1], 7), "ariane"],
    [state([8], [4], [0], 7), "penelope"],
    [state([6], [3], [2], 2), "antee"],
  ];
  for (const [selection, expected] of examples)
    assert.equal(rankMyths(selection)[0].myth.id, expected);
  assert.ok(
    rankMyths(state([0], [3], [1]))
      .slice(0, 3)
      .some((result) => result.myth.id === "atlas"),
  );
});

test("the chosen value changes the discovery while the situation stays the same", () => {
  assert.notEqual(
    rankMyths(state([6], [3], [2], 2))[0].myth.id,
    rankMyths(state([6], [3], [6], 1))[0].myth.id,
  );
  assert.equal(rankMyths(state([1], [3], [4], 0))[0].myth.id, "sisyphe");
});

test("matching is deterministic, bounded and explains only actual matches", () => {
  const selected = state([0, 5], [3, 5], [1, 4], 7);
  assert.deepEqual(rankMyths(selected), rankMyths(selected));
  const candidates = discoveryCandidates(selected);
  assert.ok(candidates.length >= 1 && candidates.length <= 3);
  for (const result of candidates) {
    assert.ok(result.score >= 0 && result.score <= 15);
    assert.ok(result.matches.type.length || result.matches.need.length);
    for (const field of Object.keys(catalogs))
      for (const index of result.matches[field])
        assert.ok(selected[field].includes(index));
    assert.ok(resonanceReasons(result).length);
  }
});

test("Other-only and emotion-only inputs still return honest suggestions", () => {
  const other = discoveryCandidates(state([10], [8], [8], 3));
  assert.ok(other.length);
  assert.equal(other[0].hasConcreteSelection, false);
  assert.ok(other[0].aromaMatches);
  assert.ok(discoveryCandidates(state([10], [0], [8], null)).length);
  assert.ok(discoveryCandidates(state([], [], [], null)).length);
});

test("free text never influences the public search URL or requires storage", () => {
  const selected = {
    ...state([0], [3], [1], 1),
    other: {
      type: "PRIVATE_TYPE",
      emotion: "PRIVATE_EMOTION",
      need: "PRIVATE_NEED",
    },
  };
  const result = discoveryCandidates(selected)[0];
  assert.ok(!researchUrl(result.myth).includes("PRIVATE"));
  assert.deepEqual(rankMyths(selected), rankMyths({ ...selected, other: {} }));
});

test("optional emotions preserve the most specific cultural association", () => {
  assert.equal(
    rankMyths({ type: [1], need: [4], emotion: [], bubble: null })[0].myth.id,
    "sisyphe",
  );
});

test("anger is context while every proposed myth resonates with at least one explicitly chosen value", () => {
  for (let type = 0; type < 10; type++) {
    for (let value = 0; value < 8; value++) {
      const results = discoveryCandidates(state([type], [], [value]));
      assert.ok(results.length > 0);
      for (const result of results) {
        assert.ok(result.myth.tags.values.includes(value));
        assert.ok(
          resonanceReasons(result).some((reason) =>
            reason.includes("Les valeurs que tu choisis"),
          ),
        );
      }
    }
  }
  const other = discoveryCandidates(state([10], [], [8]));
  assert.ok(
    other.every(
      (result) =>
        !result.hasConcreteSelection && result.matches.need.length === 0,
    ),
  );
});
