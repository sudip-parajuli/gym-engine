import { db } from "@/lib/db";
import { session } from "@/lib/auth";
import { redirect } from "next/navigation";
import { login, setup } from "../actions";
import { ArrowUpRight, Dumbbell, ShieldCheck } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await session()) redirect("/");
  const first = !db().prepare("SELECT id FROM staff LIMIT 1").get();
  const { error } = await searchParams;
  return (
    <main className="login-page">
      <section className="login-story">
        <div className="brand">
          <span className="brand-symbol">
            <Dumbbell size={22} />
          </span>
          gym<span className="brand-engine">engine</span>
        </div>
        <div>
          <p className="eyebrow">BUILT FOR THE EVERYDAY STRONG</p>
          <h1>
            Your gym.
            <br />
            Your people.
            <br />
            <span>In motion.</span>
          </h1>
          <p>
            Less time managing spreadsheets.
            <br />
            More time building a stronger community.
          </p>
        </div>
        <small>Made for independent gyms in Nepal · NPR · Nepal time</small>
      </section>
      <section className="login-form">
        <div className="login-form-inner">
          <span className="pill">
            <ShieldCheck size={14} /> Your gym’s private workspace
          </span>
          <h2>
            {first ? "A fresh start for your gym." : "Good to have you back."}
          </h2>
          <p className="muted">
            {first
              ? "Create your owner account to get things moving."
              : "Sign in to see what’s happening on the floor."}
          </p>
          {error && (
            <div className="notice error" role="alert">
              {error}
            </div>
          )}
          <form action={first ? setup : login}>
            {first && (
              <>
                <label>
                  Gym name
                  <input
                    name="gym"
                    placeholder="e.g. Summit Fitness"
                    required
                    maxLength={100}
                  />
                </label>
                <label>
                  Your name
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                  />
                </label>
              </>
            )}
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="username"
                placeholder="you@yourgym.com"
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete={first ? "new-password" : "current-password"}
                minLength={first ? 12 : 1}
                maxLength={128}
                required
              />
              {first && (
                <small>At least 12 characters. Use a unique password.</small>
              )}
            </label>
            <button className="primary wide">
              {first ? "Create my workspace" : "Sign in"}
              <ArrowUpRight size={18} />
            </button>
          </form>
          <p className="login-note">
            {first
              ? "Local development setup · No sample members are added."
              : "Access is restricted to your gym’s staff."}
          </p>
        </div>
      </section>
    </main>
  );
}
