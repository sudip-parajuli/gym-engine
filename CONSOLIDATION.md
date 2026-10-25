# Gym Engine consolidation

Canonical repository candidate: the former `gymsite` repository. Rebuild branch: `rebuild/gym-engine`. New application: `platform/`.

## Preserved histories

- Original gymsite main commit: `89a673df1cb773c5fc1ce6c6cb170a1cc00f1a37`.
- College project main commit: `9a0b2be894551d8b6c3cd28adc98b992ceb99ee9`.
- `archive/college-project` preserves the college source and history in this repository. Browse this branch to inspect the original PHP implementation.
- Full-history Git bundles were created and verified before implementation. Keep copies outside this checkout before any repository deletion.

The new code combines the member-management direction of gymsite with the booking/payment/reporting concepts of the college project. This is a staged reimplementation, not a claim that all legacy features have been migrated. Diet/recipe and remaining booking workflows still need implementation and verification.

## Repository retirement criteria

Do not delete the college repository until its branches, issues, releases, assets, database definitions, and deployment references have been inventoried; all needed material is preserved; the archive branch is verified on GitHub; and the replacement workflows are accepted. Git history backups do not preserve GitHub issues or project settings.

Renaming the canonical repository to `gym-engine` is authorized by the owner. Update local origin and inspect Vercel's Git connection after renaming. GitHub's redirect is useful but should not be the long-term configuration.

## Deployment

The rebuild is local development software. SQLite must not be deployed to Vercel's ephemeral filesystem. PostgreSQL deployment and authentication/role hardening remain a separate milestone.
