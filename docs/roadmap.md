# Roadmap

This roadmap describes intended work, not a delivery-date commitment. See [features](features.md) for current implementation status.

## Production foundation

- Migrate gym staff storage to PostgreSQL with versioned migrations and cross-gym isolation tests.
- Configure and test personal PostgreSQL, verified email, OAuth callbacks, recovery, and session revocation.
- Implement shared abuse controls, monitoring, retention/deletion, backup restoration, and production privacy notices.
- Complete reviewed deployment configuration and domain/indexing verification.

## Daily gym workflows

- Staff invitations and owner/front-desk/trainer authorization.
- Configurable plans, renewals/freezes, corrections/refunds, and complete invoice/payment allocation models.
- Imports/exports, attendance corrections, and configurable reporting periods.
- Gym-member portal and explicit, revocable trainer access to personal records.

## Personal fitness

- Reviewed food composition, serving conversions, custom recipes, and traceable nutrient totals.
- Larger movement library with reviewed adaptations and demonstrations.
- Entry editing, backup import/restore, richer scheduling, progression, and progress visualization.
- Qualified review of supported populations and personalized nutrition/training logic.

## Intelligence and expansion

- Evaluate optional source-grounded AI with adversarial, clinical-boundary, citation, and cost tests.
- Add descriptive retention/cohort reporting before predictive claims.
- Consider trained recommendations only with consented outcome data, baselines, evaluation, and monitoring.
- Multiple gym locations, payment gateways, localization, and a later mobile application.
