# Security

Gym Engine is under active development and has not completed a production security or clinical review. Current limitations are documented in [deployment](docs/deployment.md) and [architecture](docs/architecture.md).

## Report a vulnerability

Do not publish credentials, private records, exploit details, or a reproduction containing real health information in a public issue.

If GitHub private vulnerability reporting is available in this repository's **Security** tab, use it. Otherwise, contact the maintainer through a private contact method listed on [their GitHub profile](https://github.com/sudip-parajuli) to arrange a confidential report. If no private method is available, open an issue requesting a private security contact without disclosing the vulnerability.

Include the affected commit/version, environment, expected versus actual behavior, impact, and a minimal reproduction using fictional data. Do not access another person's records to demonstrate a finding. No response-time or bounty commitment is currently offered.

## Deployment responsibilities

Keep secrets and databases outside version control. Configure durable storage, verified email, secure production origins, shared rate limits, backups, and monitoring before live use. Personal and staff sessions must remain separate. Review authentication, account isolation, recovery, data lifecycle, and optional AI behavior after dependency or configuration changes.
