# Gym Engine — operations foundation

A responsive staff workspace for independent gyms in Nepal. This is the first functional rebuild milestone, not a production release.

## Run locally

Requires Node.js 22.17 or later (the built-in `node:sqlite` API is experimental on Node 22).

```sh
cd platform
npm ci
npm run dev
```

Open http://127.0.0.1:3000. On the first run, create a gym and owner account with a unique password of at least 12 characters. Setup is disabled under `NODE_ENV=production`. The preview binds to loopback only. Do not expose this development server publicly.

Records are stored in ignored `platform/data/gym-engine.sqlite`. They survive reloads and restarts. Never commit this directory. Stop the app before copying the complete data directory for a local backup; SQLite may have WAL sidecar files. Both source repository backups are separate Git bundles and do not back up application data.

## Implemented

- Owner setup, scrypt password hashing, seven-day opaque sessions, HttpOnly/SameSite cookies, sign-out, and account-based failed-login throttling.
- Gym-scoped members with canonical Nepali mobile numbers; duplicate phone prevention.
- Monthly, quarterly, and annual memberships with initial NPR prices. End dates are exclusive, with calendar-month clamping.
- Membership invoices represented by the stored fee; partial payments, transactional balance checks, and payment receipts. Integer paisa arithmetic.
- Staff-assisted attendance, active-membership checks, and one check-in per member per Nepal calendar day.
- Dashboard totals, seven-day attendance chart, renewal reminders, outstanding balances, member profiles, and basic plan reports.
- Audit records for member creation, payments, and attendance.

eSewa/Khalti selections only record payments that staff have confirmed manually. There is no payment gateway connection. Receipts are acknowledgements, not tax invoices.

## Validate

```sh
npm test
npx tsc --noEmit
npm run build
```

Browser acceptance: create owner → add member → record a partial payment → verify remaining balance and receipt → check in → verify duplicate is unavailable → reload and confirm dashboard totals. Use fictional data only in development.

## Before production

- Migrate SQLite to PostgreSQL with versioned migrations and tested cross-tenant isolation. The current schema is scoped by gym but this release provisions only one gym and one owner.
- Complete staff invitations, owner/front-desk/trainer/member authorization, password recovery, session management, and stronger distributed login protection.
- Add configurable membership plans, renewals/freezes, member editing, payment corrections/refunds, import/export, and a full invoice model.
- Test backups and restoration, privacy/retention rules, monitored error reporting, and deployment security. Remove development-only setup from the deployed surface.
- Add training/nutrition workflows and reviewed recommendation rules; AI and trained ML are not implemented in this milestone.
- Move from server-action-only mutations to a versioned API when implementing the mobile client.

Keep the existing Vercel deployment unchanged until its root configuration, durable database, environment, and migration are ready. The root of this repository still contains the historical Next.js app; this rebuild lives in `platform/`.
