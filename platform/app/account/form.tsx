"use client";
import { useState } from "react";
import Link from "next/link";
import { personalClient } from "@/lib/personal-client";
import "../fitness.css";
export default function AccountForm({
  providers,
  production,
  registrationAvailable,
}: {
  providers: Record<string, boolean>;
  production: boolean;
  registrationAvailable: boolean;
}) {
  const [mode, setMode] = useState("signin"),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const { data: session } = personalClient.useSession();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const f = new FormData(e.currentTarget),
      email = String(f.get("email")).trim(),
      password = String(f.get("password"));
    try {
      if (mode === "reset") {
        const r = await personalClient.requestPasswordReset({
          email,
          redirectTo: "/account/reset",
        });
        setMessage(
          r.error
            ? r.error.message || "Could not send reset link."
            : "If this account exists, a reset link will be sent when email delivery is configured.",
        );
        return;
      }
      const r =
        mode === "signup"
          ? await personalClient.signUp.email({
              email,
              password,
              name: email.split("@")[0].slice(0, 50),
            })
          : await personalClient.signIn.email({ email, password });
      if (r.error) setMessage(r.error.message || "Could not sign in.");
      else if (mode === "signup" && production)
        setMessage(
          "Check your email to verify your account before signing in.",
        );
      else window.location.assign("/my-space");
    } catch {
      setMessage("The account service is unavailable. Please try again later.");
    } finally {
      setBusy(false);
    }
  }
  async function social(provider: string) {
    setBusy(true);
    try {
      const r = await personalClient.signIn.social({
        provider: provider as "google",
        callbackURL: "/my-space",
      });
      if (r.error) setMessage(r.error.message || "Sign-in is unavailable.");
    } catch {
      setMessage("This sign-in provider is not available.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="fitness-site account-page">
      <Link href="/" className="fitness-kicker">
        ← PUBLIC FITNESS HUB
      </Link>
      <section className="public-panel account-card">
        <span className="fitness-kicker">YOUR RECORDS. YOUR ACCOUNT.</span>
        <h1>
          {session
            ? "Your fitness account"
            : mode === "signup"
              ? "Start your next chapter."
              : mode === "reset"
                ? "Find your way back."
                : "Welcome back."}
        </h1>
        {session ? (
          <>
            <p>Signed in as {session.user.email}</p>
            <Link className="fitness-primary" href="/my-space">
              Open my records →
            </Link>
            <button
              className="fitness-secondary"
              onClick={async () => {
                await personalClient.signOut();
                window.location.assign("/");
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p>
              Explore freely. Sign in when you want to save plans, workouts,
              intake, and progress.
            </p>
            {
              <form onSubmit={submit}>
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                </label>
                {mode !== "reset" && (
                  <label>
                    Password
                    <input
                      name="password"
                      type="password"
                      minLength={8}
                      maxLength={128}
                      required
                      autoComplete={
                        mode === "signup" ? "new-password" : "current-password"
                      }
                    />
                    <small>
                      At least 8 characters. A password manager can help.
                    </small>
                  </label>
                )}
                <button disabled={busy} className="fitness-primary wide">
                  {busy
                    ? "Working…"
                    : mode === "signup"
                      ? "Create account"
                      : mode === "reset"
                        ? "Send reset link"
                        : "Sign in"}
                </button>
              </form>
            }
            <div className="account-switch">
              <button
                disabled={!registrationAvailable}
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              >
                {mode === "signup"
                  ? "Already have an account? Sign in"
                  : "New here? Create an account"}
              </button>
              <button onClick={() => setMode("reset")}>Forgot password?</button>
            </div>
            {!registrationAvailable && (
              <p className="public-small" role="status">
                New accounts are not open yet while email verification is being
                prepared. You can still explore guides and create one-time plans
                without signing in.
              </p>
            )}
            <div className="social-options">
              {["google", "microsoft", "chatgpt"].map((p) => (
                <button
                  className="fitness-secondary"
                  disabled={!providers[p] || busy}
                  key={p}
                  onClick={() => social(p)}
                >
                  Continue with{" "}
                  {p === "chatgpt"
                    ? "ChatGPT"
                    : p[0].toUpperCase() + p.slice(1)}
                  {!providers[p] && (
                    <small>
                      {p === "chatgpt" ? "Coming soon" : "Coming soon"}
                    </small>
                  )}
                </button>
              ))}
            </div>
            <p className="public-small">
              More sign-in options will be available soon.
            </p>
          </>
        )}
        {message && (
          <p className="fitness-message" role="status">
            {message}
          </p>
        )}
        <Link href="/planner" className="public-small">
          Just need a one-time plan? Continue without an account →
        </Link>
      </section>
    </main>
  );
}
