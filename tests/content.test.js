import { test } from "node:test";
import assert from "node:assert/strict";
import { mythCatalog } from "../src/domain/matching.js";

test("every cultural story has an evocative retelling, an interpretation and three specific invitations", () => {
  const prompts = [];
  for (const myth of mythCatalog) {
    assert.ok(
      myth.summary.split("\n\n").length >= 2,
      `${myth.id}: narrative paragraphs`,
    );
    assert.ok(myth.summary.trim().length > 0, `${myth.id}: retelling`);
    assert.ok(myth.resource.trim().length > 0, `${myth.id}: interpretation`);
    assert.ok(
      myth.nourishment.trim().length > 0,
      `${myth.id}: useful takeaway`,
    );
    assert.deepEqual(
      myth.questions.map((question) => question.id),
      ["perspective", "resource", "possibility"],
    );
    for (const question of myth.questions) {
      assert.ok(
        question.prompt.trim().length > 0 && question.prompt.endsWith("?"),
        `${myth.id}: open invitation`,
      );
      prompts.push(question.prompt);
    }
  }
  assert.equal(
    new Set(prompts).size,
    prompts.length,
    "questions are tailored, not a repeated template",
  );
});

test("tragic versions remain identifiable and interpretation is separate from the traditional plot", () => {
  const find = (id) => mythCatalog.find((myth) => myth.id === id);
  assert.ok(find("sisyphe").summary.includes("sans fin"));
  assert.ok(find("dedale").summary.includes("tombe"));
  assert.ok(find("orpheus").summary.includes("seconde fois"));
  assert.ok(find("sedna").summary.includes("communautés"));
  assert.ok(find("atlas").source.includes("Pseudo-Apollodore"));
  assert.ok(find("sisyphe").questions[1].prompt.includes("différent"));
  assert.ok(find("atlas").questions[2].prompt.includes("partager"));
});

test("teen-facing texts remain short enough to read and avoid specialist vocabulary", () => {
  const words = (text) => text.trim().split(/\s+/u).length;
  const jargon =
    /\b(?:réciprocité|discernement|soutenable|habitable|nourricier|élaboration|modalité)\b/iu;
  for (const myth of mythCatalog) {
    assert.ok(words(myth.summary) <= 130, `${myth.id}: summary stays focused`);
    assert.ok(
      words(myth.resource) <= 90,
      `${myth.id}: clear short interpretation`,
    );
    for (const question of myth.questions)
      assert.ok(
        words(question.prompt) <= 28,
        `${myth.id}: one manageable question`,
      );
    assert.ok(
      !jargon.test(
        [
          myth.summary,
          myth.resource,
          myth.nourishment,
          ...myth.questions.map((q) => q.prompt),
        ].join(" "),
      ),
      `${myth.id}: no specialist vocabulary`,
    );
  }
});
