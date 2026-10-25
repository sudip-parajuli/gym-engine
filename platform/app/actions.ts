"use server";
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, audit } from "@/lib/db";
import {
  requireStaff,
  createSession,
  destroySession,
  hashPassword,
  verify,
} from "@/lib/auth";
import { PLANS, addMonths, amount, today, validDate } from "@/lib/domain";
const field = (f: FormData, k: string) => String(f.get(k) || "").trim();
function transaction(fn: () => void) {
  const d = db();
  d.exec("BEGIN IMMEDIATE");
  try {
    fn();
    d.exec("COMMIT");
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
}
export async function setup(f: FormData) {
  if (process.env.NODE_ENV === "production")
    redirect("/login?error=Initial+setup+must+be+completed+locally.");
  let error = "";
  try {
    const email = field(f, "email").toLowerCase(),
      password = field(f, "password"),
      name = field(f, "name"),
      gym = field(f, "gym");
    if (
      !/^\S+@\S+\.\S+$/.test(email) ||
      password.length < 12 ||
      password.length > 128 ||
      !name ||
      !gym
    )
      throw new Error(
        "Enter all fields and use a password of 12–128 characters.",
      );
    const staff = randomUUID(),
      gymId = randomUUID();
    transaction(() => {
      if (db().prepare("SELECT id FROM staff LIMIT 1").get())
        throw new Error("Setup is already complete. Please sign in.");
      db()
        .prepare("INSERT INTO gyms VALUES(?,?)")
        .run(gymId, gym.slice(0, 100));
      db()
        .prepare("INSERT INTO staff VALUES(?,?,?,?,?)")
        .run(staff, gymId, email, hashPassword(password), name.slice(0, 100));
    });
    await createSession(staff);
  } catch (e) {
    error = e instanceof Error ? e.message : "Setup failed.";
  }
  if (error) redirect("/login?error=" + encodeURIComponent(error));
  redirect("/");
}
export async function login(f: FormData) {
  let error = "";
  try {
    const email = field(f, "email").toLowerCase(),
      password = field(f, "password");
    if (password.length > 128) throw new Error("Invalid credentials.");
    const key = email.slice(0, 254),
      now = Date.now();
    const attempt = db()
      .prepare("SELECT count,reset_at FROM login_attempts WHERE key=?")
      .get(key) as { count: number; reset_at: number } | undefined;
    if (attempt && attempt.reset_at > now && attempt.count >= 5)
      throw new Error("Too many attempts. Try again in 15 minutes.");
    const user = db()
      .prepare("SELECT id,password_hash FROM staff WHERE email=?")
      .get(email) as { id: string; password_hash: string } | undefined;
    if (!user || !verify(password, user.password_hash)) {
      db()
        .prepare(
          "INSERT INTO login_attempts VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN reset_at<? THEN 1 ELSE count+1 END,reset_at=CASE WHEN reset_at<? THEN excluded.reset_at ELSE reset_at END",
        )
        .run(key, now + 900000, now, now);
      throw new Error("Email or password is incorrect.");
    }
    db().prepare("DELETE FROM login_attempts WHERE key=?").run(key);
    await createSession(user.id);
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not sign in.";
  }
  if (error) redirect("/login?error=" + encodeURIComponent(error));
  redirect("/");
}
export async function logout() {
  await destroySession();
  redirect("/login");
}
export async function addMember(f: FormData) {
  const s = await requireStaff();
  let error = "";
  try {
    const name = field(f, "name"),
      phone = field(f, "phone").replace(/[\s-]/g, ""),
      email = field(f, "email"),
      start = field(f, "start"),
      plan = PLANS.find((p) => p.id === field(f, "plan"));
    const goal = field(f, "goal");
    if (name.length < 2 || name.length > 100 || !/^(\+977)?9\d{9}$/.test(phone))
      throw new Error("Enter a name and a valid Nepali mobile number.");
    if (email && !/^\S+@\S+\.\S+$/.test(email))
      throw new Error("Enter a valid email address.");
    if (!plan || !validDate(start))
      throw new Error("Select a plan and valid start date.");
    const canonical = phone.replace(/^\+977/, "");
    const id = randomUUID();
    transaction(() => {
      if (
        db()
          .prepare("SELECT id FROM members WHERE gym_id=? AND phone=?")
          .get(s.gym_id, canonical)
      )
        throw new Error("A member with this mobile number already exists.");
      db()
        .prepare("INSERT INTO members VALUES(?,?,?,?,?,?,?)")
        .run(
          id,
          s.gym_id,
          name,
          canonical,
          email.slice(0, 254),
          goal.slice(0, 100),
          new Date().toISOString(),
        );
      db()
        .prepare("INSERT INTO memberships VALUES(?,?,?,?,?,?,?)")
        .run(
          randomUUID(),
          s.gym_id,
          id,
          plan.id,
          start,
          addMonths(start, plan.months),
          plan.price,
        );
      audit(s.gym_id, s.id, "member.created", id);
    });
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not save member.";
  }
  revalidatePath("/");
  redirect(
    "/?view=members&" +
      (error
        ? "error=" + encodeURIComponent(error)
        : "success=Member+added.+Membership+invoice+is+ready."),
  );
}
export async function recordPayment(f: FormData) {
  const s = await requireStaff();
  let error = "";
  try {
    const id = field(f, "membership"),
      paisa = amount(field(f, "amount")),
      method = field(f, "method");
    if (
      !["Cash", "eSewa (manual)", "Khalti (manual)", "Bank transfer"].includes(
        method,
      )
    )
      throw new Error("Choose a payment method.");
    transaction(() => {
      const m = db()
        .prepare("SELECT fee FROM memberships WHERE id=? AND gym_id=?")
        .get(id, s.gym_id) as { fee: number } | undefined;
      if (!m) throw new Error("Membership not found.");
      const paid = db()
        .prepare(
          "SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE membership_id=? AND gym_id=?",
        )
        .get(id, s.gym_id) as { total: number };
      if (paisa > m.fee - paid.total)
        throw new Error("Payment exceeds the outstanding balance.");
      const pid = randomUUID();
      db()
        .prepare("INSERT INTO payments VALUES(?,?,?,?,?,?,?)")
        .run(
          pid,
          s.gym_id,
          id,
          paisa,
          method,
          new Date().toISOString(),
          field(f, "reference").slice(0, 100),
        );
      audit(s.gym_id, s.id, "payment.recorded", pid);
    });
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not record payment.";
  }
  revalidatePath("/");
  redirect(
    "/?view=payments&" +
      (error
        ? "error=" + encodeURIComponent(error)
        : "success=Payment+recorded.+Receipt+is+available."),
  );
}
export async function checkIn(f: FormData) {
  const s = await requireStaff();
  let error = "";
  try {
    const id = field(f, "member");
    transaction(() => {
      if (
        !db()
          .prepare(
            "SELECT id FROM memberships WHERE member_id=? AND gym_id=? AND start<=? AND end>?",
          )
          .get(id, s.gym_id, today(), today())
      )
        throw new Error(
          "This member needs an active membership before checking in.",
        );
      if (
        db()
          .prepare(
            "SELECT id FROM attendance WHERE gym_id=? AND member_id=? AND day=?",
          )
          .get(s.gym_id, id, today())
      )
        throw new Error("This member has already checked in today.");
      db()
        .prepare("INSERT INTO attendance VALUES(?,?,?,?,?)")
        .run(randomUUID(), s.gym_id, id, today(), new Date().toISOString());
      audit(s.gym_id, s.id, "attendance.checked_in", id);
    });
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not check in.";
  }
  revalidatePath("/");
  redirect(
    "/?view=attendance&" +
      (error
        ? "error=" + encodeURIComponent(error)
        : "success=Member+checked+in."),
  );
}
