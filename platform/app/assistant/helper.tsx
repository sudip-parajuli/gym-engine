"use client";
import Link from "next/link";
import { useState } from "react";
import type { researchAnswer } from "@/lib/coach";
import "../fitness.css";
type Answer = ReturnType<typeof researchAnswer> & { notice?: string };
export default function Helper({ aiAvailable }: { aiAvailable: boolean }) {
  const [answer, setAnswer] = useState<Answer | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <main className="fitness-site">
      <div className="fitness-main">
        <Link className="public-back-link" href="/">
          ← Gym Engine
        </Link>
        <section className="public-page-heading">
          <p className="fitness-kicker">ASK. CHECK. UNDERSTAND.</p>
          <h1>
            A research helper,
            <br />
            with sources you can follow.
          </h1>
          <p>
            Find relevant educational guides. It cannot replace a dietitian,
            doctor, physiotherapist, or individualized form assessment.
          </p>
        </section>
        <form
          className="public-panel helper-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            setBusy(true);
            setError("");
            try {
              const r = await fetch("/api/coach", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  question: f.get("question"),
                  aiConsent: f.get("ai") === "on",
                }),
              });
              const d = await r.json();
              if (!r.ok) throw new Error(d.error);
              setAnswer(d);
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Could not retrieve sources.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Your question
            <textarea
              name="question"
              minLength={3}
              maxLength={1000}
              required
              placeholder="What should I know before trying keto?"
            />
          </label>
          {aiAvailable ? (
            <label className="estimate-check">
              <input type="checkbox" name="ai" />
              Use an AI explanation. This sends my question and selected public
              source summaries to OpenAI. Don’t include personal medical
              details.
            </label>
          ) : (
            <p className="public-small">
              Source-retrieval mode. AI explanations are not configured; no AI
              model is called.
            </p>
          )}
          <button className="fitness-primary" disabled={busy}>
            {busy ? "Checking sources…" : "Find relevant evidence"}
          </button>
        </form>
        {error && (
          <p className="fitness-message" role="alert">
            {error}
          </p>
        )}
        {answer && (
          <section className="public-panel helper-answer" aria-live="polite">
            <span className="fitness-kicker">
              {answer.mode === "ai-explanation"
                ? "AI EXPLANATION · VERIFY WITH SOURCES"
                : "SOURCE RETRIEVAL · NO GENERATED EXPERT CLAIM"}
            </span>
            <h2>What the library can tell you</h2>
            <p>{answer.summary}</p>
            {answer.notice && <p className="public-small">{answer.notice}</p>}
            {answer.guides.map((g) => (
              <article className="source-note" key={g.slug}>
                <Link href={"/diets/" + g.slug}>{g.title} →</Link>
                <p>{g.takeaway}</p>
                <small>{g.limits}</small>
              </article>
            ))}
            <h3>Original sources</h3>
            {answer.sources.map((s) => (
              <a
                className="source-link"
                href={s.url}
                target="_blank"
                rel="noreferrer"
                key={s.id}
              >
                {s.title} · {s.kind} ↗
              </a>
            ))}
          </section>
        )}
        <p className="public-source">
          Responses are educational. No account records, health profile, or
          journal history are automatically shared with AI.{" "}
          <Link href="/research">See our evidence library →</Link>
        </p>
      </div>
    </main>
  );
}
