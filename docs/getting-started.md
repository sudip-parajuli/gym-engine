# Getting started

## Requirements

- Node.js 22.17 or newer and npm. The local SQLite API is experimental on Node 22.
- Git for source checkout.
- No external account is needed for basic local browsing, planning, personal accounts, or gym operations.

## Install and run

```sh
git clone https://github.com/sudip-parajuli/gym-engine.git
cd gym-engine/platform
npm ci
npm run dev
```

Use http://127.0.0.1:3000 consistently. The development server binds to loopback.

### Public experience

Start at `/`. Explore `/foods`, `/exercises`, `/diets`, `/research`, and `/planner` without an account. Plans are editable drafts. Saving prompts for a personal account.

### Personal records

Create an account at `/account` using email and a password of 8–128 characters. Local development can sign in without live email delivery. Use fictional information for development. `/my-space` stores personal intake, workouts, saved plans, and optional progress. Personal accounts do not grant staff access.

### Gym workspace

Visit `/login` for the first local owner setup. Supply a gym name and a unique password of at least 12 characters. Setup is disabled in production. Use `/manage` for operations. Digital-payment methods record staff-confirmed payments; they do not process money.

## Configuration

From `platform/`, copy `.env.example` to `.env.local`. The example contains names and empty credential values, never usable secrets.

| Variables                                      | Purpose                                                         |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`        | Canonical auth origin and production session signing secret     |
| `DATABASE_URL`                                 | Durable PostgreSQL for hosted personal accounts/journals        |
| `NEXT_PUBLIC_SITE_URL`, `ENABLE_INDEXING`      | Public canonical origin and reviewed-production indexing switch |
| `GOOGLE_CLIENT_*`, `MICROSOFT_CLIENT_*`        | Optional OAuth clients                                          |
| `CHATGPT_*`                                    | Optional approved-partner identity provider                     |
| `RESEND_API_KEY`, `MAIL_FROM`                  | Verified-email and recovery delivery                            |
| `AI_ENABLED`, `OPENAI_API_KEY`, `OPENAI_MODEL` | Optional opt-in research explanations                           |

Use `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000` locally. Only enable indexing on a verified production origin. See [deployment](deployment.md) for callbacks and service setup.

## Storage and migrations

Local data lives under ignored `platform/data/`: `personal.sqlite`, a development auth secret, and `gym-engine.sqlite` for staff operations. Never commit this folder. Stop the application before backing up the entire data directory, including any SQLite WAL sidecars. Source-code archives are not application-data backups.

Development initializes personal storage automatically. To explicitly apply personal-account migrations:

```sh
npm run db:migrate
```

Production requires `DATABASE_URL` and an auth secret; automatic migrations are disabled. This command does not migrate staff storage. PostgreSQL needs credentials and live integration testing before launch.

## Validation

```sh
npm test
npx tsc --noEmit
npm run build
```

Browser acceptance: anonymous draft generation; save boundary; personal sign-in and private records; two-account isolation; concurrent save rejection; sign-out revocation; local owner → member → partial payment → receipt → attendance → dashboard.

## Troubleshooting

- **npm cannot find package.json:** enter `platform/`; it is the application's package directory.
- **Origin rejected:** use the same exact origin for the browser and `BETTER_AUTH_URL` (including `127.0.0.1` versus `localhost`).
- **Social buttons unavailable:** register provider clients and configure the documented credentials.
- **Production accounts unavailable:** check PostgreSQL, migrations, auth secret, and verified email delivery. Local fallback storage is deliberately unavailable in production.
- **Records changed in another session:** reload before saving again; the API rejects stale revisions to protect newer entries.
- **Vercel staff workspace unavailable:** staff storage has not been migrated to durable hosted storage.
- **No AI output:** source retrieval is the default. AI needs all three AI variables and visitor consent.
- **Build/deployment failure:** inspect the specific build log; use Root Directory `platform`, Node 22.17+, and the commands in [deployment](deployment.md).
