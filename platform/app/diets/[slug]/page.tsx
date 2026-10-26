import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, sourceById } from "@/lib/knowledge";
import { DietVisual } from "../../fitness-visuals";
import { siteURL, jsonLd } from "@/lib/seo";
import "../../fitness.css";
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    g = GUIDES.find((x) => x.slug === slug);
  return g
    ? {
        title: g.title,
        description: g.summary,
        alternates: { canonical: "/diets/" + g.slug },
        openGraph: {
          title: g.title,
          description: g.summary,
          url: siteURL("/diets/" + g.slug),
          type: "article",
        },
      }
    : {};
}
export default async function Guide({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    g = GUIDES.find((x) => x.slug === slug);
  if (!g) notFound();
  const sources = g.sources.map(sourceById).filter((x) => !!x);
  return (
    <main className="fitness-site">
      <article className="knowledge-article">
        <nav aria-label="Breadcrumb">
          <Link href="/">Gym Engine</Link> /{" "}
          <Link href="/diets">Evidence guides</Link> / {g.title}
        </nav>
        <p className="fitness-kicker">{g.category}</p>
        <h1>{g.title}</h1>
        <DietVisual slug={g.slug} />
        <p className="article-summary">{g.summary}</p>
        <p className="article-byline">
          Gym Engine editorial · Published 25 October 2026
          <br />
          {g.review}
        </p>
        <section className="article-takeaway">
          <h2>What to take away</h2>
          <p>{g.takeaway}</p>
        </section>
        <section>
          <h2>What remains uncertain or individual</h2>
          <p>{g.limits}</p>
        </section>
        <section>
          <h2>Practical next steps</h2>
          <ul>
            {g.practical.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Research and source notes</h2>
          {sources.map((s) => (
            <div className="source-note" key={s.id}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title} ↗
              </a>
              <small>
                {s.kind} · {s.year} · checked 25 October 2026
              </small>
              <p>{s.summary}</p>
            </div>
          ))}
        </section>
        <Link className="fitness-primary" href="/planner">
          Explore the public planner →
        </Link>
        <p className="public-small">
          This educational guide does not diagnose a condition or replace a
          qualified dietitian, clinician, or rehabilitation professional.
        </p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: g.title,
              description: g.summary,
              datePublished: "2026-10-25",
              dateModified: "2026-10-25",
              author: { "@type": "Organization", name: "Gym Engine editorial" },
              publisher: { "@type": "Organization", name: "Gym Engine" },
              mainEntityOfPage: siteURL("/diets/" + g.slug),
              citation: sources.map((s) => s.url),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Gym Engine",
                  item: siteURL("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Evidence guides",
                  item: siteURL("/diets"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: g.title,
                  item: siteURL("/diets/" + g.slug),
                },
              ],
            }),
          }}
        />
      </article>
    </main>
  );
}
