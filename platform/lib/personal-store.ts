import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";
let connection: DatabaseSync | Pool;
export function personalDatabase() {
  if (connection) return connection;
  if (process.env.DATABASE_URL) {
    connection = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
    return connection;
  }
  if (process.env.NODE_ENV === "production")
    throw new Error(
      "Configure a durable DATABASE_URL before enabling personal accounts in production.",
    );
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  connection = new DatabaseSync(join(process.cwd(), "data", "personal.sqlite"));
  connection.exec("PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;");
  return connection;
}
export async function personalQuery<T extends Record<string, unknown>>(
  sql: string,
  values: (string | number | null)[] = [],
): Promise<T[]> {
  const d = personalDatabase();
  if (d instanceof Pool) {
    let i = 0;
    return (
      await d.query(
        sql.replace(/\?/g, () => "$" + ++i),
        values,
      )
    ).rows as T[];
  }
  return d.prepare(sql).all(...values) as T[];
}
export async function createJournalSchema() {
  await personalQuery(
    "CREATE TABLE IF NOT EXISTS personal_journals (user_id TEXT PRIMARY KEY REFERENCES ge_user(id) ON DELETE CASCADE, payload TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1)",
  );
}
