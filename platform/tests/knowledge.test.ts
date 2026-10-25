import { test } from "node:test";
import assert from "node:assert/strict";
import { researchAnswer } from "../lib/coach.ts";
import { GUIDES, SOURCES } from "../lib/knowledge.ts";
test("clinical questions return assessment guidance and citations, not medicine instructions", () => {
  const result = researchAnswer("Can I fast with diabetes and insulin?");
  assert.equal(result.clinical, true);
  assert.match(result.summary, /cannot diagnose/);
  assert.ok(result.sources.length > 0);
});
test("every guide source resolves and every cited URL is HTTPS", () => {
  for (const g of GUIDES) {
    assert.ok(g.sources.length);
    for (const id of g.sources) assert.ok(SOURCES.some((s) => s.id === id));
  }
  for (const s of SOURCES) assert.ok(s.url.startsWith("https://"));
});
test("unsupported queries do not invent research", () => {
  const answer = researchAnswer("xyzzy quuxxyz");
  assert.equal(answer.sources.length, 0);
  assert.match(answer.summary, /could not find/);
});
