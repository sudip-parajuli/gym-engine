# Gym Engine consolidation

Canonical repository: https://github.com/sudip-parajuli/gym-engine (renamed from `gymsite` on 25 October 2026). Current application: `platform/`. The rebuild is consolidated through pull request #1 into `main`; `rebuild/gym-engine` is its implementation branch.

## Preserved histories

- Original gymsite main commit: `89a673df1cb773c5fc1ce6c6cb170a1cc00f1a37`.
- College project main commit: `9a0b2be894551d8b6c3cd28adc98b992ceb99ee9`.
- `archive/college-project` preserves the college source and history in this repository. Browse this branch to inspect the original PHP implementation.
- Full-history Git bundles were created and verified before implementation. Keep copies outside this checkout before any repository deletion.

The new code combines the member-management direction of gymsite with the booking/payment/reporting concepts of the college project. This is a staged reimplementation, not a claim that all legacy features have been migrated. Diet/recipe and remaining booking workflows still need implementation and verification.

## Repository retirement

The owner explicitly requested a single repository and deletion of the college repository. The college source history and database definitions are preserved in the archive branch and verified offline Git bundle. GitHub metadata was inventoried separately because Git history does not preserve issues or project settings.

The canonical repository has been renamed to `gym-engine` and local origin updated. Vercel's Git connection still needs inspection before deployment changes.

The college repository was inventoried: one `main` branch, no tags, issues, releases, deployments, wiki, or GitHub Pages. Its archive branch hash was verified on the canonical remote. GitHub rejected the authorized delete request with HTTP 403, so the college repository was archived and its description/homepage point to Gym Engine. It has not been deleted. Repository metadata and retirement results were saved alongside the offline backups.

## Deployment

The rebuild is local development software. SQLite must not be deployed to Vercel's ephemeral filesystem. PostgreSQL deployment and authentication/role hardening remain a separate milestone.

Deletion was retried after re-inventorying the repository: GitHub again returned HTTP 403, 'Must have admin rights to Repository.' The current API credential cannot remove it. An authorized owner can finish under the college repository Settings > General > Danger Zone > Delete this repository. The college repository remains archived until that action succeeds; no deletion is claimed.
