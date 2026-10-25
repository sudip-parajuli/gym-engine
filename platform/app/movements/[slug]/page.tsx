import { notFound } from "next/navigation";
import Link from "next/link";
import { MOVEMENTS } from "@/lib/exercise-catalog";
import { jsonLd, siteURL } from "@/lib/seo";
import "../../fitness.css";
export function generateStaticParams() {
  return MOVEMENTS.map((m) => ({ slug: m.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    m = MOVEMENTS.find((x) => x.slug === slug);
  return m
    ? {
        title: m.name + " — movement guide",
        description: `${m.muscles.join(", ")} movement reference: ${m.cue}`,
        alternates: { canonical: "/movements/" + m.slug },
      }
    : {};
}
export default async function Movement({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    m = MOVEMENTS.find((x) => x.slug === slug);
  if (!m) notFound();
  return (
    <main className="fitness-site">
      <article className="knowledge-article">
        <nav aria-label="Breadcrumb">
          <Link href="/">Gym Engine</Link> /{" "}
          <Link href="/exercises">Exercises</Link> / {m.name}
        </nav>
        <p className="fitness-kicker">
          {m.muscles.join(" · ")} · {m.position} · {m.equipment}
        </p>
        <h1>{m.name}</h1>
        <p className="article-byline">
          Gym Engine editorial · General movement reference · Individual form
          review not provided.
        </p>
        <section>
          <h2>Starting cue</h2>
          <p>{m.cue}</p>
        </section>
        <section>
          <h2>A more approachable setup</h2>
          <p>{m.adaptation}</p>
        </section>
        <section>
          <h2>Who is this for?</h2>
          <p>
            People of any gender whose abilities, experience, and care plan
            permit this movement. Choose an appropriate range and setup; stop if
            it causes pain. Medical or rehabilitation restrictions need
            individualized guidance.
          </p>
        </section>
        <section>
          <h2>Source context</h2>
          <p>
            These are original, abbreviated editorial cues. The linked reference
            provides general strength, sitting, or activity guidance; it is not
            a clinical validation of this individual variation.
          </p>
          <a href={m.source} target="_blank" rel="noreferrer">
            Open source guidance ↗
          </a>
        </section>
        <Link className="fitness-primary" href="/planner">
          Build a routine draft →
        </Link>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: m.name + " movement guide",
              description: m.cue,
              author: { "@type": "Organization", name: "Gym Engine editorial" },
              mainEntityOfPage: siteURL("/movements/" + m.slug),
              citation: m.source,
            }),
          }}
        />
      </article>
    </main>
  );
}
