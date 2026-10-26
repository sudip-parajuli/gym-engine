import { execFileSync } from "node:child_process";

// Explicit, operator-controlled migration runs in Vercel's encrypted environment.
// Never persist database credentials in source or print environment values.
const run = (args, env = process.env) =>
  execFileSync(process.execPath, args, { stdio: "inherit", env });
if (process.env.RUN_DATABASE_MIGRATIONS === "true") {
  if (!process.env.DATABASE_URL_UNPOOLED)
    throw new Error("Direct migration connection is required.");
  const migrationEnv = {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL_UNPOOLED,
  };
  run(
    ["--experimental-strip-types", "scripts/migrate-personal.ts"],
    migrationEnv,
  );
  if (
    process.env.VERCEL_ENV === "preview" &&
    process.env.RUN_STORAGE_SMOKE_TEST === "true"
  ) {
    run(
      ["--experimental-strip-types", "scripts/check-postgres.ts"],
      migrationEnv,
    );
  }
}
run(["node_modules/next/dist/bin/next", "build"]);
