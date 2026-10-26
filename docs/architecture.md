# Architecture

Gym Engine currently uses a modular Next.js application in `platform/`. Public pages, personal tools, and staff operations share a web runtime while keeping identity and record ownership separate. A monorepo package split, independent ML service, and mobile client are not implemented.

## Main modules

| Location                                             | Responsibility                                                          |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| `app/fitness-hub.tsx`, `app/fitness.css`             | Public shell, discovery, and catalog experience                         |
| `app/personal-*`                                     | Draft planning, authenticated journal, and progress interface           |
| `app/account/`, `lib/personal-auth.ts`               | Better Auth personal identity and provider configuration                |
| `lib/personal-store.ts`, `lib/use-journal.ts`        | Personal persistence and client save lifecycle                          |
| `app/manage/`, `app/workspace.tsx`, `app/actions.ts` | Staff workspace and server-side mutations                               |
| `lib/db.ts`, `lib/auth.ts`, `lib/domain.ts`          | Local staff storage, sessions, money/date rules                         |
| `lib/fitness.ts`                                     | Templates, resting-energy equation, food references, journal validation |
| `lib/knowledge.ts`, `lib/exercise-catalog.ts`        | Authored evidence and movement catalogs                                 |
| `lib/coach.ts`, `app/api/coach/`                     | Source retrieval and optional constrained AI explanation                |
| `lib/seo.ts`, `app/robots.ts`, `app/sitemap.ts`      | Canonicals, structured data helpers, and indexing controls              |

## Identity and ownership

Personal identity uses Better Auth tables (`ge_user`, `ge_session`, `ge_account`, `ge_verification`). A personal journal belongs to the session user ID. The API does not accept another user's ID as an ownership selector. Automatic linking of social accounts is disabled.

Staff identity uses separate local staff/session tables and an opaque session cookie. Staff records belong to a gym. The current setup provisions one gym/owner; broader role management and multi-gym authorization remain roadmap work. A staff session is not a personal session, and gym membership is not required for personal records.

## Personal API contracts

| Endpoint             | Contract                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/auth/[...all]` | Better Auth registration, session, sign-in/out, verification, and recovery endpoints                                                           |
| `GET /api/journal`   | Authenticated user's validated journal, revision, and email; private no-store response; 401 for anonymous access                               |
| `PUT /api/journal`   | Same-origin authenticated write with `{journal, revision}`; validated structure and size cap; 409 for a stale revision                         |
| `POST /api/coach`    | Same-origin `{question, aiConsent?}`; bounded input, basic rate limit, public source retrieval; optional AI only when configured and consented |

These are internal web contracts, not a promised stable mobile API. Staff mutations use server actions with server-side checks.

## Persistence

Development uses separate SQLite databases for personal and staff records. Hosted personal storage uses `pg` with Neon PostgreSQL and explicit Better Auth/journal migrations. Vercel pool lifecycle attachment releases idle connections. Production and preview target separate Neon branches. A journal is currently a versioned JSON payload with an integer revision; conditional updates reject competing writes.

Staff tables cover gyms, staff, sessions, members, memberships, payments, attendance, audit events, and login attempts. Money uses integer paisa. Attendance uniqueness follows a Nepal calendar day. Staff SQLite is disabled on Vercel because ephemeral local files cannot safely persist business data.

Production still needs a staff database migration, richer authorization, backup/restore tests, lifecycle policies, and shared abuse controls. The presence of a PostgreSQL adapter is not a claim of completed production testing.

## Recommendations and AI

Planning is deterministic template/rule logic. There is no trained recommender or predictive model. Functional preferences adjust movement choices; exclusions filter listed food ingredients. Clinical and restrictive contexts stop automatic planning.

The research helper selects authored guides and their sources. Optional AI uses only the question and selected public source summaries, with explicit consent, bounded output, a timeout, `store:false`, and source-ID validation. It cannot write journals or payments. No account records are automatically included. Invalid model responses fall back to source retrieval; the public guides remain available independently.

## Rendering and search

Guides and movement details have stable server-rendered URLs. Metadata includes canonicals and appropriate Article/Breadcrumb data. Account/staff/journal pages are noindex; sitemap excludes them. Previews and the default configuration block indexing. Search visibility and AI citations depend on search engines and content quality, not a guaranteed ranking mechanism.
