# Gym Engine — product direction and consolidation plan

Status: product direction recorded 25 October 2026. The operations foundation is implemented in `platform/`; see `CONSOLIDATION.md` for current remote repository changes. No production deployment has been performed.

## Product promise

Help a gym run its daily operations and help its members follow achievable fitness and nutrition plans. The owner should know who needs attention, what money is due, and how the business is performing without assembling spreadsheets.

## Initial repository findings

- College project: PHP pages with PDO database access, member profiles, package bookings, payment-status workflows, registration/booking reports, and recipe recommendations.
- Its `diet_recommendations.php` computes a weighted score but uses `ORDER BY RAND() LIMIT 3`, so selection does not follow that score. This is rule-based matching, not a trained ML model.
- `gymsite`: Next.js 14.2.3, React, TypeScript, Tailwind, and Radix-based UI components. The inspected dashboard keeps members in React state and hardcodes several summary figures. The separate add-member screen has no persistence handler.
- `gym-backend/server.js`: Express/Mongoose registration and login prototype; passwords are stored and queried as plain strings, and login returns a message without establishing a session. Replace this authentication flow before production use.
- `gym-backend/node_modules` is committed in the repository. Exclude dependency installations from the consolidated source.
- The supplied Vercel URL could not be loaded by the web reader. No visual or runtime audit of the deployed site is claimed.
- This is an initial inspection, not a full security audit or a verified migration inventory. Database schemas, live data, hosting ownership, and integration credentials remain unverified.

## First release

Confirmed audience: independent gyms in Nepal, with multiple gyms supported later. Initial product defaults: NPR, Asia/Kathmandu, English, and manually recorded cash/digital payments.

Roles: owner/admin, front desk, trainer, member. Trainers access assigned members; members access their own records. Enforce authorization on the server.

1. Daily dashboard: actual check-ins, active memberships, renewals due, outstanding balances, and collected revenue. Every metric links to the records behind it.
2. Members: searchable directory, onboarding, contact details, status, membership history, notes with role-based visibility, and CSV import/export.
3. Memberships: configurable plans, start/end dates, renewals, freezes, cancellations, and explicit lifecycle rules.
4. Billing: invoices, payment allocations, partial payments, balances, receipts, and recorded payment methods. Keep invoices, payment events, and membership status separate.
5. Attendance: staff-assisted check-in first, duplicate prevention, attendance history, and manual correction with an audit trail.
6. Member portal: membership status, receipts, attendance, assigned plans, and progress records.
7. Nutrition foundation: food catalog with sources and serving units, preferences, allergies/exclusions, goals, and trainer-reviewed plan drafts. Explain why foods were selected and record plan versions.

First complete implementation slice: sign in → create member → assign plan → record payment → check in → see correct dashboard totals. Validate persistence after reload, role restrictions, and cross-gym isolation.

## UX direction

Use a calm, readable operations interface: neutral surfaces, dark navigation, one energetic brand accent, accessible contrast, clear tables, and responsive layouts. Reserve imagery for onboarding and public marketing.

Primary navigation: Overview, Members, Memberships, Payments, Attendance, Training, Nutrition, Reports, Settings. Introduce navigation only as its workflows become available.

The member profile is the working hub: overview, membership, billing, attendance, progress, training, nutrition. Make Add member, Record payment, and Check in easy to reach. Show useful empty, validation, loading, and failure states.

## AI, recommendations, and analytics

Start with descriptive analytics: collected revenue versus billed revenue, renewal rate, attendance frequency, outstanding balances, and cohort retention. Define date windows and denominators before implementation.

Add AI where the result can be checked: draft a member progress summary from recorded facts; explain a recommendation; draft a renewal message for staff review; answer an owner's reporting question through permitted, read-only metrics. AI must never invent payments, member activity, or nutrition values, or silently change records.

Nutrition selection should enforce exclusions and use verified food quantities and deterministic calculations. AI can explain and propose substitutions within those constraints. Define the supported population and professional review process before launching personalized nutrition features.

Begin retention alerts with transparent rules such as a drop in attendance. Consider trained ranking or churn models only after collecting consented, usable outcomes. Establish a baseline, evaluation set, data leakage checks, and monitoring before claiming improved predictions. Avoid fabricated risk percentages.

## Proposed technical architecture

Use a TypeScript web application with a modular backend and PostgreSQL. Next.js is a reasonable continuity choice because the newer repository already uses React/Next.js; select supported package versions during implementation. Keep domain services independent of page components and expose versioned APIs for the later mobile client.

Suggested source layout:

```text
apps/web
packages/domain
packages/contracts
packages/ui
docs
```

Keep this structure modest; introduce packages only when shared code justifies them. No separate ML service or microservice fleet in the first release. Add background jobs when reminders, imports, or AI tasks require retries.

Core entities: gym, user, staff role assignment, member, membership plan, membership, invoice, invoice line, payment, payment allocation, attendance event, trainer assignment, measurement, food, recipe, nutrition plan/version, consent, audit event.

Separate a login user from a gym member: staff may register members who do not yet have a login. Put gym ownership on tenant-owned records; enforce scoped access and test it. Store money in integer minor units with an explicit currency. Store timestamps consistently and interpret business dates in the gym's configured timezone.

Use established authentication with secure sessions; do not port the existing password implementation. Plan for backups, restore verification, audit logs, environment-based secrets, and retention/deletion rules for body measurements and nutrition data.

Mobile later: evaluate Expo/React Native and reuse contracts, validation, and domain APIs; do not assume desktop UI components transfer directly.

## Consolidating the repositories

1. Inventory both repositories, branches, assets, database definitions, and actual deployed configuration. Check asset licenses and ownership before reuse.
2. Create recoverable Git backups and a feature-to-source inventory. Check for exposed secrets without copying them into reports; rotate any confirmed credentials.
3. Provisional canonical repository: `gymsite`, because it already contains the React web foundation and corresponds to the supplied deployment. Confirm this before any rename or deployment reconnection.
4. Build on an isolated rebuild branch. Port useful workflows and verified assets into the new architecture; do not paste the PHP application into the React runtime.
5. If there is real data, prepare a dry-run migration with row counts, identifier mapping, reconciliation, and rollback. If there is none, use clearly labeled seed data.
6. Replace the deployed app only after the operational slice and migration are verified.
7. Archive the superseded repository with a pointer to the canonical project. Consider deletion only after verifying backups, history, and the replacement. No deletion has been performed.

## Delivery sequence

- Foundation: audience and workflow decisions, full audit, data model, authentication, permissions, visual system.
- Operations: members, plans, billing, attendance, real dashboard, imports, audit history.
- Coaching: member portal, trainer assignments, progress, training and nutrition drafts.
- Intelligence: descriptive reporting, explainable alerts, controlled AI summaries and recommendations.
- Expansion: payment integrations, multi-location features, mobile application; trained ML only when evidence supports it.

## Sources

- https://github.com/sudip-parajuli/gym-management-and-diet-recommendation-system
- https://github.com/sudip-parajuli/gymsite
- https://nextjs.org/docs/app/getting-started/route-handlers
- https://www.postgresql.org/docs/18/ddl-rowsecurity.html
- https://github.com/expo/expo/blob/main/packages/expo/README.md
