import Link from "next/link";
import { SOURCES } from "@/lib/knowledge";
import "../fitness.css";
export const metadata = {
  title: "Fitness and nutrition research library",
  description:
    "Trace Gym Engine’s educational guides to research papers and public-health guidance, with evidence types and limitations.",
  alternates: { canonical: "/research" },
};
export default function Research() {
  return (
    <main className="fitness-site">
      <div className="fitness-main">
        <Link className="public-back-link" href="/">
          ← Gym Engine
        </Link>
        <section className="public-page-heading">
          <p className="fitness-kicker">FOLLOW THE EVIDENCE</p>
          <h1>
            A source is a beginning,
            <br />
            not a promise.
          </h1>
          <p>
            Our selected references, not an exhaustive literature search.
            Evidence types matter: a review of trials, a scoping review, and an
            educational interview answer different questions. Editorial clinical
            review is pending.
          </p>
        </section>
        <div className="learn-grid">
          {SOURCES.map((s) => (
            <article className="learn-card" key={s.id}>
              <span className="fitness-kicker">
                {s.kind} · {s.year}
              </span>
              <h2>{s.title}</h2>
              <p>{s.summary}</p>
              <a href={s.url} target="_blank" rel="noreferrer">
                Open original source ↗
              </a>
            </article>
          ))}
        </div>
        <Link className="fitness-primary" href="/assistant">
          Ask the research helper →
        </Link>
        <p className="public-source">
          Sources checked 25 October 2026. We summarize rather than republish
          research, and do not claim affiliation or endorsement.
        </p>
      </div>
    </main>
  );
}
