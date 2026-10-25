import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verify(password: string, hash: string) {
  const [salt, key] = hash.split(":");
  const expected = Buffer.from(key, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
const digest = (s: string) => createHash("sha256").update(s).digest("hex");
export async function session() {
  const token = (await cookies()).get("ge_session")?.value;
  if (!token) return null;
  return db()
    .prepare(
      "SELECT staff.id,staff.gym_id,staff.name,gyms.name AS gym_name FROM sessions JOIN staff ON staff.id=sessions.staff_id JOIN gyms ON gyms.id=staff.gym_id WHERE token_hash=? AND expires>?",
    )
    .get(digest(token), Date.now()) as
    | { id: string; gym_id: string; name: string; gym_name: string }
    | undefined;
}
export async function requireStaff() {
  const s = await session();
  if (!s) redirect("/login");
  return s;
}
export async function createSession(id: string) {
  const token = randomBytes(32).toString("hex");
  db().prepare("DELETE FROM sessions WHERE expires<?").run(Date.now());
  db()
    .prepare("INSERT INTO sessions VALUES(?,?,?)")
    .run(digest(token), id, Date.now() + 86400000 * 7);
  (await cookies()).set("ge_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 604800,
  });
}
export async function destroySession() {
  const c = await cookies();
  const token = c.get("ge_session")?.value;
  if (token)
    db().prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(token));
  c.delete("ge_session");
}
