# Deployment and integrations

Public web deployment: **https://gym-engine.vercel.app**. The Vercel project `gym-engine` builds `main` from `platform/` using Node 22. Production deployment was verified on 26 October 2026. Public guides and one-time planning are available; personal-account storage is connected to Neon PostgreSQL. Verified email, social sign-in, and optional AI still require service configuration. Staff operations remain disabled on Vercel pending durable-storage migration. Search indexing remains disabled until editorial/production review.

## Vercel setup

Choose the canonical Vercel project and production domain. Set **Root Directory = platform**, framework Next.js, install `npm ci`, and build `node scripts/vercel-build.mjs`. `platform/vercel.json` records those commands once that project root is selected. Use Node 22.17 or newer.

Do not set output to a static export: accounts, journals, and the helper API need server functions. Connect the Git source to `sudip-parajuli/gym-engine`. Disable redundant deployment integrations so only the intended project builds and owns the production domain.

Set `NEXT_PUBLIC_SITE_URL` and `BETTER_AUTH_URL` to the canonical production HTTPS origin. Set a unique, randomly generated `BETTER_AUTH_SECRET` of at least 32 bytes. Add a durable PostgreSQL `DATABASE_URL`; never deploy local SQLite as durable Vercel storage. Run `npm run db:migrate` against that database from a secure environment before enabling account traffic. Normal builds do not run account migrations. An operator can explicitly set `RUN_DATABASE_MIGRATIONS=true` for a deployment; `scripts/vercel-build.mjs` uses the direct `DATABASE_URL_UNPOOLED` only in the migration child process. Turn the flag off after the migration succeeds. Runtime traffic uses the pooled `DATABASE_URL`.

**Gym staff persistence is still the earlier local SQLite implementation.** The personal-account PostgreSQL adapter does not migrate gym operations. Keep staff operations local until their separate database migration is completed; do not treat this release as production-ready gym management.

For the exact free-tier provider setup and callbacks, see [authentication setup](authentication-setup.md).

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

A validated import/restore tool remains future work. Exports contain personal information: keep them private. Production privacy policy, data retention/deletion, tested backups and access reviews are still launch requirements.

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

## Connected Neon storage

Neon organization: `org-dry-field-25690240` (Free). Gym Engine project: `wandering-queen-79594826`, database: `gym_engine`. This is independent of EasyMoto.

- Production branch: `production` (`br-royal-voice-b593u98a`).
- Preview branch: `preview-storage` (`br-green-fire-b5v95d2q`).
- Vercel production and preview environments use separate database connections and auth secrets, stored as sensitive variables. No live credentials belong in source or local project files.
- Preview migration/QA uses `RUN_DATABASE_MIGRATIONS=true` and `RUN_STORAGE_SMOKE_TEST=true`. The smoke test refuses to run outside a preview deployment and leaves fictional records on that isolated branch. Disable both flags after an explicit validation run.
- The auth/journal schema consists of `ge_user`, `ge_session`, `ge_account`, `ge_verification`, and `personal_journals`. Staff tables have not been migrated.

Database connectivity does not enable production signup by itself. Email/password signup remains closed until verified email delivery is configured; social sign-in needs its own registered provider. Existing verified accounts can authenticate when configured. Do not disable verification merely to bypass missing email setup.

For later schema changes, test on the preview branch, inspect the diff, and explicitly migrate production. Retain the free plan; monitor its usage in Neon rather than assuming unlimited storage or compute.
