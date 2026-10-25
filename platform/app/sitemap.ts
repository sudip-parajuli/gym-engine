import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/knowledge";
import { MOVEMENTS } from "@/lib/exercise-catalog";
import { siteURL, indexingEnabled } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return indexingEnabled()
    ? [
        ...[
          "/",
          "/diets",
          "/research",
          "/foods",
          "/exercises",
          "/learn",
          "/planner",
          "/assistant",
        ],
        ...GUIDES.map((g) => "/diets/" + g.slug),
        ...MOVEMENTS.map((m) => "/movements/" + m.slug),
      ].map((path) => ({
        url: siteURL(path),
        lastModified: "2026-10-25",
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 1 : 0.7,
      }))
    : [];
}
