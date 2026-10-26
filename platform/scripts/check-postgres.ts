import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";

if (
  process.env.VERCEL_ENV !== "preview" ||
  process.env.RUN_STORAGE_SMOKE_TEST !== "true"
) {
  throw new Error(
    "This fictional-data test is restricted to an explicitly enabled preview deployment.",
  );
}
// Only this isolated test process permits local-style signup; the deployed app
// retains production email verification and disabled signup without email setup.
Object.assign(process.env, { NODE_ENV: "test" });
const { personalAuth } = await import("../lib/personal-auth.ts");
const { personalQuery } = await import("../lib/personal-store.ts");
const auth = personalAuth();
const origin = process.env.BETTER_AUTH_URL!;
async function account() {
  const email = `qa-${randomUUID()}@example.test`;
  const response = await auth.handler(
    new Request(origin + "/api/auth/sign-up/email", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Storage QA",
        email,
        password: randomBytes(24).toString("hex"),
      }),
    }),
  );
  assert.equal(response.status, 200, "Preview account creation failed");
  const cookie = response.headers
    .getSetCookie()
    .map((v) => v.split(";")[0])
    .join("; ");
  const session = await auth.api.getSession({
    headers: new Headers({ Cookie: cookie }),
  });
  assert.ok(session?.user.id, "Session did not persist");
  return { id: session.user.id, cookie };
}
const a = await account(),
  b = await account();
const payload = JSON.stringify({
  version: 1,
  intakes: [],
  workouts: [],
  plans: [],
  measurements: [],
});
assert.equal(
  (
    await personalQuery(
      "INSERT INTO personal_journals(user_id,payload,revision) VALUES(?,?,1) RETURNING revision",
      [a.id, payload],
    )
  ).length,
  1,
);
assert.equal(
  (
    await personalQuery(
      "SELECT payload FROM personal_journals WHERE user_id=?",
      [a.id],
    )
  ).length,
  1,
);
assert.equal(
  (
    await personalQuery(
      "SELECT payload FROM personal_journals WHERE user_id=?",
      [b.id],
    )
  ).length,
  0,
);
assert.equal(
  (
    await personalQuery(
      "UPDATE personal_journals SET revision=revision+1 WHERE user_id=? AND revision=? RETURNING revision",
      [a.id, 1],
    )
  ).length,
  1,
);
assert.equal(
  (
    await personalQuery(
      "UPDATE personal_journals SET revision=revision+1 WHERE user_id=? AND revision=? RETURNING revision",
      [a.id, 1],
    )
  ).length,
  0,
);
const out = await auth.handler(
  new Request(origin + "/api/auth/sign-out", {
    method: "POST",
    headers: {
      Origin: origin,
      Cookie: a.cookie,
      "Content-Type": "application/json",
    },
    body: "{}",
  }),
);
assert.equal(out.status, 200);
assert.equal(
  await auth.api.getSession({ headers: new Headers({ Cookie: a.cookie }) }),
  null,
);
console.log(
  "PASS: preview PostgreSQL accounts, persisted sessions/journal, ownership selection, revision conflict, and session revocation. Fictional QA records remain only on the preview branch.",
);
process.exit(0);
