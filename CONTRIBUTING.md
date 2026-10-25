# Contributing to Gym Engine

Thanks for helping improve fitness learning, personal tools, and gym operations. Read the [overview](README.md), [feature status](docs/features.md), and [architecture](docs/architecture.md) first.

## Development workflow

1. Open an issue for substantial product or architectural changes so scope can be discussed.
2. Create a focused branch from `main`.
3. Work in `platform/`; follow its `AGENTS.md` and the bundled framework documentation when using unfamiliar Next.js APIs.
4. Keep changes scoped, update affected documentation, and use fictional test data.
5. Run `npm test`, `npx tsc --noEmit`, and `npm run build` from `platform/` when application behavior changes.
6. Open a pull request describing the problem, resulting behavior, validation, and remaining limitations. Include screenshots for visible UI changes.

## Engineering expectations

- Enforce authorization on the server and preserve the boundary between personal and staff identity.
- Use integer minor currency units and explicit business-date rules.
- Handle loading, empty, validation, failure, and conflicting-save states.
- Do not commit `.env.local`, credentials, database files, exports, dependencies, or build output.
- Add meaningful tests for domain or security behavior; avoid tests that merely repeat implementation details.
- Keep public learning accessible without forcing registration.

## Research and recommendations

Use primary sources, link the exact source, and explain evidence limitations. Do not fabricate clinician credentials, nutrient values, citations, risk estimates, or AI/ML capability. Changes that add clinical personalization need an explicit supported-population definition, qualified review, and evaluation. Never send private records to AI automatically.

## Communication

Be respectful, explain trade-offs clearly, and keep issues free of private personal/health information. Report vulnerabilities through [SECURITY.md](SECURITY.md), not a public issue. The project has not selected a license; clarify reuse/contribution licensing with the maintainer before substantial external contributions.
