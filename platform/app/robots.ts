import type { MetadataRoute } from "next";
import { indexingEnabled, siteURL } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return indexingEnabled()
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: ["/account", "/my-space", "/manage", "/login", "/api/"],
        },
        sitemap: siteURL("/sitemap.xml"),
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
