"use client";
import { useState } from "react";
import Link from "next/link";
import { personalClient } from "@/lib/personal-client";
import { AccountNotice, PasswordField } from "../controls";
import "../../fitness.css";
export default function Reset() {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <main className="fitness-site account-page">
      <section className="public-panel account-card">
        <h1>Choose a new password.</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const f = new FormData(e.currentTarget),
              token =
                new URLSearchParams(window.location.search).get("token") || "";
            try {
              const result = await personalClient.resetPassword({
                newPassword: String(f.get("password")),
                token,
              });
              setMessage(
                result.error?.message ||
                  "Password updated. You can sign in now.",
              );
            } catch {
              setMessage(
                "The reset link could not be used. Request a new one.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <PasswordField fresh />
          <button className="fitness-primary" disabled={busy}>
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
        <AccountNotice message={message} onDismiss={() => setMessage("")} />
        <Link href="/account">Back to sign in →</Link>
      </section>
    </main>
  );
}
