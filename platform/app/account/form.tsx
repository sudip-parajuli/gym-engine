"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { personalClient } from "@/lib/personal-client";
import { AccountNotice, PasswordField } from "./controls";
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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("error"))
      setMessage(
        "That verification link could not be used. Request a new verification email below.",
      );
    else if (params.get("verified") === "true")
      setMessage("Email verified. You can sign in now.");
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const f = new FormData(e.currentTarget),
      email = String(f.get("email")).trim(),
      password = String(f.get("password"));
    try {
      if (mode === "verify") {
        const r = await personalClient.sendVerificationEmail({
          email,
          callbackURL: "/account?verified=true",
        });
        setMessage(
          r.error
            ? r.error.message || "Could not request a verification email."
            : "If this account needs verification, a new link will be sent. Check your inbox and spam folder.",
        );
        return;
      }
      if (mode === "reset") {
        const r = await personalClient.requestPasswordReset({
          email,
          redirectTo: "/account/reset",
        });
        setMessage(
          r.error
            ? r.error.message || "Could not send reset link."
            : "If this account exists, a reset link will be sent. Check your inbox and spam folder.",
        );
        return;
      }
      const r =
        mode === "signup"
          ? await personalClient.signUp.email({
              email,
              password,
              name: email.split("@")[0].slice(0, 50),
              callbackURL: "/account?verified=true",
            })
          : await personalClient.signIn.email({ email, password });
      if (r.error) setMessage(
        mode === "signin" && r.error.code === "INVALID_EMAIL_OR_PASSWORD"
          ? "We couldn’t sign you in. Check your email and password. If you haven’t registered yet, choose Create an account. If you used Google to register, continue with Google."
          : r.error.message || "Could not sign in.",
      );
      else if (mode === "signup" && production)
        setMessage(
          "Check your email to verify your account before signing in. Open the verification link, then return here to sign in. Check your spam folder if you don’t see the email.",
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
              : mode === "reset" || mode === "verify"
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
                {mode !== "reset" && mode !== "verify" && (
                  <PasswordField key={mode} fresh={mode === "signup"} />
                )}
                <button disabled={busy} className="fitness-primary wide">
                  {busy
                    ? "Working…"
                    : mode === "signup"
                      ? "Create account"
                      : mode === "reset"
                        ? "Send reset link"
                        : mode === "verify"
                          ? "Send verification email"
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
              {registrationAvailable && (
                <button onClick={() => setMode("verify")}>
                  Resend verification email
                </button>
              )}
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
        <AccountNotice message={message} onDismiss={() => setMessage("")} />
        <Link href="/planner" className="public-small">
          Just need a one-time plan? Continue without an account →
        </Link>
        <p className="public-small"><Link href="/privacy">Privacy and your data</Link></p>
      </section>
    </main>
  );
}
