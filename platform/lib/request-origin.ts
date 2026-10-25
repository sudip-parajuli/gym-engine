export function trustedOrigin(request: Request) {
  const expected =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:3000");
  if (!expected) return false;
  try {
    return request.headers.get("origin") === new URL(expected).origin;
  } catch {
    return false;
  }
}
