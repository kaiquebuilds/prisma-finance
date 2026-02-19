# Prisma Finance - Project Guidelines

## The Product

Prisma is a personal finance management app built for brazilian users. Its core value proposition is to increase clarity, reducing financial stress and enabling better decision-making - an unfortunate reality for the majority of the brazilian population.

The main personas are Alex and Juliana, you can read more about them in the [personas doc](/docs/product/personas).

Our goals are in the [product strategy doc](/docs/product/strategy.md) and [north stars doc](/docs/product/north-star.md), but in summary we want to:

- Provide a clear and intuitive interface.
- Offer actionable insights and recommendations based on users' financial data.
- Ensure top-notch security and privacy for our users' financial information.
- Continuously iterate and improve based on user feedback and data.

## Architecture

Our architecture is a monorepo managed with Nx, containing multiple apps and shared packages. The main components are:

- `apps/web`: The main Next.js frontend application.
- `apps/api`: The Express backend API.
- `apps/marketing`: A Next.js marketing site.
- `apps/web-e2e`: Playwright end-to-end tests.
- `packages/core`: A shared package for core business logic and utilities, with no app dependencies.

Tech stack rationale can be found in the [tech stack ADR](/docs/architecture/adr/001-tech-stack.md).

Every meaningful architectural decision is documented in an ADR (Architecture Decision Record) in the [ADRs directory](/docs/architecture/adr/).

## Web App (`apps/web`)

**Next.js 16 App Router** with TypeScript. Key directories under `src/`:

- `app/(public)/` — Unauthenticated pages
- `app/(protected)/` — Authenticated pages
- `app/api/` — Route handlers (health check, PostHog proxy)
- `components/ui/` — Shadcn-style UI primitives
- `hooks/` — Custom React hooks
- `icons/` — SVG icons (imported as React components via @svgr/webpack)
- `lib/` — Utilities

## API App (`apps/api`)

**Express 5** with Prisma ORM and PostgreSQL. Structure:

- `src/routes/` — Route handlers
- `src/services/` — Business logic
- `src/repositories/` — Prisma data access layer
- `src/middleware/` — Express middleware (Clerk auth, rate limiting, etc.)
- `src/lib/` — Utilities (logger, etc.)
- `src/instrument.ts` — Sentry instrumentation (loaded before app)
- `src/env.ts` — Typed environment variables
- `prisma/schema.prisma` — Database schema
- `prisma/migrations/` — Migration history

Database: PostgreSQL 17 via Docker (`docker compose up -d`).

## Key Patterns

**Forms**: `react-hook-form` + `zod` (v4) + `@hookform/resolvers/zod`.

**Styling**: Tailwind CSS v4, `class-variance-authority` for variants, `clsx` + `tailwind-merge` for conditional classes.

**Testing**: Vitest for unit tests (jsdom for web, node for api). Web vitest config uses `passWithNoTests: true`.

**Language**: All UI text is in **Portuguese (pt-BR)**.

**Observability**: PostHog for analytics, Sentry for error tracking — both are instrumented in auth flows and globally via Next.js/Express integrations.

## Commands

All commands are run via Nx. Use `pnpm` as the package manager.

```bash
# Run dev servers
pnpm nx run web:dev
pnpm nx run api:dev

# Build
pnpm nx run web:build
pnpm nx run api:build

# Test (single project)
pnpm nx run web:test
pnpm nx run api:test
pnpm nx run core:test

# Run a single test file
pnpm nx run web:test -- --reporter=verbose <path/to/file.test.ts>

# Lint
pnpm nx run web:lint
pnpm nx run api:lint

# Typecheck
pnpm nx run web:typecheck
pnpm nx run api:typecheck

# Run affected targets (CI-style)
pnpm nx affected -t typecheck
pnpm nx affected -t lint
pnpm nx affected -t test

# Database (from apps/api/)
pnpm --filter api db:generate       # Regenerate Prisma client
pnpm --filter api db:migrate:dev    # Run dev migrations
pnpm --filter api db:studio         # Open Prisma Studio
```
