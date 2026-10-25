import Link from "next/link";
import { GUIDES } from "@/lib/knowledge";
import "../fitness.css";
export const metadata = {
  title: "Diet styles, accessible fitness & evidence guides",
  description:
    "Compare keto, plant-based, meat-forward, DASH and intermittent fasting, with cited evidence, limitations and practical guidance.",
  alternates: { canonical: "/diets" },
};
export default function Diets() {
  return (
    <main className="fitness-site">
      <div className="fitness-main">
        <Link className="public-back-link" href="/">
          ← Gym Engine
        </Link>
        <section className="public-page-heading">
          <p className="fitness-kicker">UNDERSTAND YOUR OPTIONS</p>
          <h1>
            Different approaches.
            <br />
            Evidence before promises.
          </h1>
          <p>
            Explore food patterns, meal timing, and inclusive movement. Each
            guide explains its sources and limits. You can read every guide
            without an account.
          </p>
        </section>
        <div className="learn-grid">
          {GUIDES.map((g) => (
            <article className="learn-card" key={g.slug}>
              <span className="fitness-kicker">{g.category}</span>
              <h2>{g.title}</h2>
              <p>{g.summary}</p>
              <Link href={"/diets/" + g.slug}>Read the guide →</Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
