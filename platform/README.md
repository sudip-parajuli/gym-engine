# Gym Engine application

The current Next.js application is contained in this directory.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Node.js 22.17+ is required.

- [Project overview](../README.md)
- [Getting started and troubleshooting](../docs/getting-started.md)
- [Features and access](../docs/features.md)
- [Architecture and API boundaries](../docs/architecture.md)
- [Deployment and integrations](../docs/deployment.md)
- [Privacy and recommendation boundaries](../docs/privacy-and-recommendations.md)
- [Contributing](../CONTRIBUTING.md)

## Checks

```sh
npm test
npx tsc --noEmit
npm run build
```

Copy `.env.example` to `.env.local` only when configuring integrations. Never commit secrets or `data/`. Run `npm run db:migrate` for explicit personal-account migrations. Production personal accounts require PostgreSQL; staff operations still require a separate durable-storage migration.
