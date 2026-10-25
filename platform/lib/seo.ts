export const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://gymsite-suhb.vercel.app"
).replace(/\/$/, "");
export function siteURL(path: string) {
  return new URL(path, BASE_URL).toString();
}
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
export function indexingEnabled() {
  return (
    process.env.ENABLE_INDEXING === "true" &&
    process.env.VERCEL_ENV !== "preview"
  );
}
