import { test } from "node:test";
import assert from "node:assert/strict";
import { mythEcho } from "../src/domain/mythEcho.js";
import { researchUrl } from "../src/domain/matching.js";
test("the revealed traditional story resonates with the recognised value and explains actual anger matches", () => {
  const echo = mythEcho({ type: [0] }, 1);
  assert.equal(echo.myth.id, "atlas");
  assert.deepEqual(echo.angers, ["Tout porter"]);
  assert.deepEqual(echo.matchedAngers, ["Tout porter"]);
  assert.equal(echo.value.label, "Solidarité");
  for (let anger = 0; anger < 10; anger++)
    for (let value = 0; value < 8; value++) {
      const match = mythEcho({ type: [anger] }, value);
      assert.ok(match.myth.tags.values.includes(value));
      assert.ok(match.myth.summary && match.myth.resource && match.myth.source);
    }
});
test("free-form anger and previous value selections are not interpreted or sent to research", () => {
  const base = { type: [10], need: [0], other: { type: "PRIVATE_ANGER" } };
  const echo = mythEcho(base, 5);
  assert.deepEqual(echo.angers, []);
  assert.deepEqual(echo, mythEcho({ ...base, need: [7], other: {} }, 5));
  assert.ok(!JSON.stringify(echo).includes("PRIVATE"));
  assert.ok(!researchUrl(echo.myth).includes("PRIVATE"));
  assert.equal(mythEcho(base, 8), null);
});
