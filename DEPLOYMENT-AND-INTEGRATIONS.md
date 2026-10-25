# Deployment, sign-in, AI and discoverability

## The red GitHub checks

The rebuild commits reached GitHub successfully. At commit `42ff7549029853076c7bb7dd3bf1b5d8e055240f`, GitGuardian passed; the failing statuses were **Vercel – gymsite** and **Vercel – gymsite-suhb**. These are deployment failures, not rejected Git pushes.

Both legacy Vercel projects remain attached. The repository root is the old Next.js 14 application; the rebuild is `platform/`. Root TypeScript configuration includes every nested TS/TSX file and is unsuitable for building this nested application. The authenticated Vercel build logs were not accessible in this session, so the exact error in each failed deployment is not claimed here. Old framework/security checks, incorrect project root, and incompatible build inputs must be assessed from those logs before calling the deployment incident resolved.

The new `Gym Engine platform` GitHub Actions workflow verifies `platform/` directly with locked dependencies, tests, and a production build. It does not override either existing Vercel project's settings.

## Vercel setup

Choose one canonical Vercel project; retain the current public domain unless intentionally changing it. Set **Root Directory = platform**, framework Next.js, install `npm ci`, and build `npm run build`. `platform/vercel.json` records those commands once that project root is selected. Use Node 22.17 or newer.

Do not set output to a static export: accounts, journals, and the helper API need server functions. Reconnect the Git source to `sudip-parajuli/gym-engine` if the rename is not reflected. Keep the second project's deployment integration disabled only after confirming it is redundant; no project or public domain has been deleted by this change.

Set `NEXT_PUBLIC_SITE_URL` and `BETTER_AUTH_URL` to the canonical production HTTPS origin. Set a unique, randomly generated `BETTER_AUTH_SECRET` of at least 32 bytes. Add a durable PostgreSQL `DATABASE_URL`; never deploy local SQLite as durable Vercel storage. Run `npm run db:migrate` against that database from a secure environment before enabling account traffic. Production does not run automatic account migrations.

**Gym staff persistence is still the earlier local SQLite implementation.** The personal-account PostgreSQL adapter does not migrate gym operations. Keep staff operations local until their separate database migration is completed; do not treat this release as production-ready gym management.

## Personal accounts

Better Auth implements personal email/password registration, sessions, sign-out, email verification and reset endpoints. Local development can create an account with email/password only; display name is derived from the email prefix. Production email/password signup requires configured email delivery and verified email. Existing staff credentials are separate and never confer personal-account access.

Local development stores a random auth secret and the personal SQLite database under ignored `platform/data/`. Never commit or share these files. Default local origin is `http://127.0.0.1:3000`; use exactly the same origin in provider registration and `BETTER_AUTH_URL`.

Set `RESEND_API_KEY` and `MAIL_FROM` using a verified sender to enable verification/reset mail. Requests are sent only by configured account workflows. Do not enter secrets in chat or GitHub source. Test delivery, verification, reset, revocation and abuse protection before production launch.

### Google

Register a Google OAuth web client. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Register `/api/auth/callback/google` at each exact local/production origin. Minimal scopes are used by the provider. Test the provider's consent configuration and authorized users before publishing.

### Microsoft

Register an Entra web app with the account audience you want. Set `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, and optionally `MICROSOFT_TENANT_ID` (`common` for the initial configuration). Register `/api/auth/callback/microsoft` at the exact origin. Configure the app for personal and/or work accounts deliberately.

### ChatGPT

OpenAI's website sign-in is currently a limited trial for selected commercial partners. Obtain an approved client, exact callback URL and OIDC endpoints from OpenAI. Only then set `CHATGPT_CLIENT_ID`, optional `CHATGPT_CLIENT_SECRET`, and the exact `CHATGPT_DISCOVERY_URL`. Callback: `/api/auth/callback/chatgpt`. The integration uses Authorization Code with PKCE and requires issuer/JWKS-backed ID-token verification. It is disabled when configuration is missing. A ChatGPT subscription or an OpenAI API key alone does not configure this identity provider.

Automatic linking between personal email/password and social identities is disabled. Account-linking UX and verified ownership need a separate, tested flow.

## Records and progress

`/api/journal` derives the user ID from the verified session and never accepts an owner ID from the client. It uses private/no-store responses, same-origin writes, payload validation and revision-based conflict checks. Intake, workouts, saved plans and optional body measurements are stored in the signed-in account. Anonymous visitors can generate one-time drafts but cannot save them.

Earlier browser-local records are retained in localStorage and are not automatically uploaded. An explicit, validated import tool remains future work. Exports contain personal information: keep them private. Production privacy policy, data retention/deletion, tested backups and access reviews are still launch requirements.

## Research helper and optional AI

The default helper retrieves relevant summaries from the selected public evidence library and shows source links; it does not pretend to run a model. Optional explanations require all of `AI_ENABLED=true`, `OPENAI_API_KEY`, and `OPENAI_MODEL`. Select a supported model in your own API project and set project spending/rate limits. No live model call was tested without credentials.

The AI path uses the Responses API with `store:false`, bounded output, a timeout, source-ID constrained structured output, and fallback to source retrieval on invalid responses. The visitor must opt in to sending their question and public source summaries. The app never automatically sends their journal or health profile. Clinical questions are routed to assessment guidance, not diagnosis, medication changes, medical diets, or rehabilitation prescriptions.

The helper's in-process rate limit is a development/basic safeguard. Before enabling paid AI publicly, add shared rate limits, spending caps, monitoring and adversarial/clinical evaluation. No autonomous agent can change records or contact another service on the user's behalf.

## SEO and visibility in AI search

Public guides and movement details have stable, server-rendered URLs, unique metadata, canonical links, source notes, and Article/Breadcrumb structured data where applicable. Sitemap generation excludes accounts, journals, staff pages and APIs. Private pages are noindex. `ENABLE_INDEXING=false` is the default, and previews stay blocked even if indexing is enabled elsewhere.

After editorial review and verified production deployment, set `ENABLE_INDEXING=true` only on production. Confirm the canonical domain, `robots.txt`, sitemap URLs and structured data. Verify ownership in Google Search Console and Bing Webmaster Tools, submit the sitemap, and monitor crawl/indexing and query performance. No rankings, rich results, AI citations, or first-place results are guaranteed.

Publish useful, attributable health content with honest evidence limits; obtain qualified clinical review before presenting personalized specialist services. Do not fabricate expert authors, credentials, reviews or an affiliation with a source publisher. Avoid bulk AI-generated search pages. Google states its normal SEO practices apply to AI Overviews/AI Mode; special GEO files or markup do not guarantee inclusion.

## Primary documentation

- https://better-auth.com/docs/integrations/next
- https://better-auth.com/docs/adapters/postgresql
- https://better-auth.com/docs/authentication/google
- https://better-auth.com/docs/authentication/microsoft
- https://developers.openai.com/siwc/website
- https://developers.openai.com/api/docs/guides/text
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
