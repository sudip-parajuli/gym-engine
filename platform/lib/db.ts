import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
let database: DatabaseSync;
export function db() {
  if (process.env.VERCEL)
    throw new Error(
      "Gym operations require durable staff storage; local SQLite is disabled on Vercel.",
    );
  if (database) return database;
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  database = new DatabaseSync(join(process.cwd(), "data", "gym-engine.sqlite"));
  database.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS gyms(id TEXT PRIMARY KEY,name TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS staff(id TEXT PRIMARY KEY,gym_id TEXT NOT NULL REFERENCES gyms(id),email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,name TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,staff_id TEXT NOT NULL REFERENCES staff(id),expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS members(id TEXT PRIMARY KEY,gym_id TEXT NOT NULL REFERENCES gyms(id),name TEXT NOT NULL,phone TEXT NOT NULL,email TEXT NOT NULL DEFAULT '',goal TEXT NOT NULL DEFAULT 'General fitness',created TEXT NOT NULL,UNIQUE(gym_id,phone));
 CREATE TABLE IF NOT EXISTS memberships(id TEXT PRIMARY KEY,gym_id TEXT NOT NULL REFERENCES gyms(id),member_id TEXT NOT NULL REFERENCES members(id),plan TEXT NOT NULL,start TEXT NOT NULL,end TEXT NOT NULL,fee INTEGER NOT NULL CHECK(fee>0));
 CREATE TABLE IF NOT EXISTS payments(id TEXT PRIMARY KEY,gym_id TEXT NOT NULL REFERENCES gyms(id),membership_id TEXT NOT NULL REFERENCES memberships(id),amount INTEGER NOT NULL CHECK(amount>0),method TEXT NOT NULL,created TEXT NOT NULL,reference TEXT NOT NULL DEFAULT '');
 CREATE TABLE IF NOT EXISTS attendance(id TEXT PRIMARY KEY,gym_id TEXT NOT NULL REFERENCES gyms(id),member_id TEXT NOT NULL REFERENCES members(id),day TEXT NOT NULL,created TEXT NOT NULL,UNIQUE(gym_id,member_id,day));
 CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,gym_id TEXT NOT NULL,staff_id TEXT NOT NULL,action TEXT NOT NULL,entity_id TEXT NOT NULL,created TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS login_attempts(key TEXT PRIMARY KEY,count INTEGER NOT NULL,reset_at INTEGER NOT NULL);
 `);
  return database;
}
export function audit(gym: string, staff: string, action: string, id: string) {
  db()
    .prepare(
      "INSERT INTO audit(gym_id,staff_id,action,entity_id,created) VALUES(?,?,?,?,?)",
    )
    .run(gym, staff, action, id, new Date().toISOString());
}
