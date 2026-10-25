# Gym Engine

A fitness platform for independent gyms in Nepal, gym-goers, and fitness enthusiasts. This is the single maintained repository for the former `gymsite` and bachelor gym-management projects.

The current application lives in **[platform/](platform/)**. The repository-root application is retained as historical source; do not use its old startup instructions to run the rebuild.

## Start locally

Requires Node.js 22.17 or newer.

```sh
cd platform
npm ci
npm run dev
```

Open http://127.0.0.1:3000. No account is required for guides, exercise references, research, or one-time planning. Create an individual account at `/account` to save personal plans, intake, workouts, and progress. Gym staff use `/manage` and `/login`; the first local staff visit offers owner setup.

## What is included

- Public food references, eight evidence guides, and 24 movement references with muscle/equipment/position filters.
- Editable meal and exercise drafts, listed ingredient exclusions, functional preferences, and optional resting-energy estimates.
- Individual email/password accounts and private server-side journals with revision-conflict checks.
- Source-linked research retrieval, with optional opt-in AI explanations prepared for configuration.
- Local gym members, memberships, NPR billing/payment records, receipts, attendance, and reports.
- Public metadata, canonicals, Article/Breadcrumb structured data, sitemap, and private-page noindex rules.

The catalogs are a starting point, not exhaustive. Recommendations are educational templates; medical contexts and restrictive diets need professional assessment. Gym Engine does not claim to replace a licensed clinician or dietitian.

## Documentation

| Document | Purpose |
| --- | --- |
| [Application guide](platform/README.md) | Local development, implemented operations, validation, and limitations |
| [Deployment and integrations](DEPLOYMENT-AND-INTEGRATIONS.md) | Vercel root settings, PostgreSQL migrations, email, OAuth, optional AI, and search indexing |
| [Public and personal experience](PUBLIC-AND-PERSONAL.md) | Anonymous access, account ownership, storage, and planning boundaries |
| [Product direction](PRODUCT-DIRECTION.md) | Audiences, product vision, and staged delivery |
| [Consolidation record](CONSOLIDATION.md) | Canonical repository, preserved source history, and retirement status |

## Validation

Run inside `platform/`:

```sh
npm test
npx tsc --noEmit
npm run build
```

GitHub Actions runs tests and a production build for changes to the current application.

## Configuration and launch status

Copy `platform/.env.example` to `platform/.env.local` and follow the integration guide. Never commit secrets or the ignored `platform/data/` directory.

Development personal storage uses SQLite; production personal accounts require durable PostgreSQL, explicit migrations, verified email delivery, and an auth secret. Google/Microsoft sign-in and optional AI stay unavailable until configured. ChatGPT sign-in additionally requires approved partner access.

Gym staff storage is still local SQLite and is disabled on Vercel until migrated. Existing Vercel failures are deployment checks, not failed Git pushes; select `platform` as the deployment Root Directory and inspect authenticated build logs. This is a development milestone, not a production launch. Search indexing is disabled by default until production/editorial review.

## Legacy history

The original `gymsite` history remains in this repository. The college PHP application's complete Git history is preserved on [`archive/college-project`](https://github.com/sudip-parajuli/gym-engine/tree/archive/college-project), with verified offline backups. No separate college repository is needed for ongoing development. See the consolidation record for the actual removal status.
