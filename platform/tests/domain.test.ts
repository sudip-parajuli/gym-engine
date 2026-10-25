import { test } from "node:test";
import assert from "node:assert/strict";
import { addMonths, amount, validDate } from "../lib/domain.ts";
test("membership renewal clamps to the last day of month", () => {
  assert.equal(addMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(addMonths("2024-01-31", 1), "2024-02-29");
  assert.equal(addMonths("2024-02-29", 12), "2025-02-28");
});
test("payment amounts use integer paisa and reject invalid values", () => {
  assert.equal(amount("2500.50"), 250050);
  for (const v of ["0", "-1", "1.001", "NaN", "1e3", ""])
    assert.throws(() => amount(v));
});
test("dates reject impossible calendar dates", () => {
  assert.ok(validDate("2026-10-25"));
  assert.equal(validDate("2026-02-30"), false);
});
