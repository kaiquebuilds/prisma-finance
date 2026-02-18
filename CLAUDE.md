# Prisma Finance — Project Guidelines

## Project Overview

Prisma is a personal finance web app for Brazilian users, centered on a "safe-to-spend" calculation. The core question it answers: _"Can I buy this today without ruining my month?"_

Target users are **Alex (The Planner)** and **Juliana (The Overwhelmed)** — see `docs/product/personas.md`. All UI copy is in **Portuguese (pt-BR)**.

## Architecture

Nx monorepo:

- `apps/web` — Next.js (App Router), deployed on Vercel
- `apps/api` — Node.js + Express, deployed on Render
- `packages/core` — shared business logic (e.g. safe-to-spend calculation, financial utils)

Key services:

- **Auth:** Clerk (`@clerk/nextjs`). API verifies Bearer tokens via JWKS.
- **Database:** PostgreSQL on Neon via Prisma ORM. Users table keyed by Clerk subject.
- **Error tracking:** Sentry (`@sentry/nextjs` + backend SDK)
- **Analytics:** PostHog (`posthog-js`)

ADRs in `docs/architecture/adr/` explain every major decision. Read the relevant ADR before proposing changes to auth, infrastructure, or observability.

## Running Tasks

**Always ask before running any `nx` command** (build, lint, test, e2e). Do not run them autonomously.

When you do run tasks, use `nx`:

```
npx nx run web:build
npx nx run-many -t lint
npx nx affected -t test
```

## Sensitive Areas — Be Conservative

Apply extra scrutiny and ask before making changes in these areas:

1. **Financial calculations** — Any logic involving amounts, balances, installments, or safe-to-spend math. Correctness is non-negotiable. Prefer `decimal.js` or integer arithmetic over floating-point.
2. **Auth & security** — Clerk flows, JWT/JWKS handling, API authorization middleware, LGPD compliance (data minimization, user rights, 6-month inactive deletion).
3. **Database schema & migrations** — Prisma schema changes are hard to reverse. Always think about data migration and backward compatibility before touching `schema.prisma`.
4. **API contracts** — Breaking changes to request/response shapes affect both `apps/web` and `apps/api`. Coordinate changes across both apps.

## Git Workflow

- **Always ask before committing.** Propose the commit message and wait for explicit approval.
- **Never push** unless explicitly asked.
- Use **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `perf:`.
- Scope to the affected app/package when relevant: `feat(web):`, `fix(api):`.

## Code Conventions

### General

- **TypeScript strictly** — no `any`, no `as` casts unless truly necessary with a comment explaining why.
- **No barrel/index re-export files** — import from the specific file, not from a folder index.
- **Zod schemas co-located** with the component or route that uses them (not in a global `schemas/` folder).

### Next.js (`apps/web`)

- **Server Components by default.** Add `"use client"` only when the component genuinely needs browser APIs, event handlers, or React hooks.
- Auth check + redirect lives in the server `page.tsx`; the client component handles the form.
- Public routes live under `app/(public)/`. Shared auth UI components are in `(public)/_components/`, shared auth logic in `(public)/_lib/`.

### Error Handling

- Use `handleClerkError<T>(error, setError, flow)` for all Clerk errors — it instruments PostHog + Sentry automatically.
- Use identical error messages for `identifier_not_found` and `password_incorrect` to prevent user enumeration.

# Context7 MCP

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

<!-- nx configuration start-->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->

---

description: Core architecture principles
globs: []
alwaysApply: true

---

# Fakeflix Architecture Principles

**Structure:**

- Apps = Bootstraps (orchestration only)
- Packages = Business logic
- Modules = Independent, composable domains

**Module Structure:**

- package/module/core/services/ (Business logic)
- package/module/http/ (HTTP endpoints, external clients and DTOs)
- package/module/persistence/ (TypeORM entities/repos)

**10 Key Principles:**

1. Well-defined boundaries | 2. Composability | 3. Independence | 4. Individual scale | 5. Explicit communication
2. Replaceability | 7. Deployment independence | 8. State isolation ⚠️ | 9. Observability | 10. Fail independence

---

## 📚 Progressive Documentation Loading

**CRITICAL**: Only load documents relevant to your current task. Do NOT load all documentation at once (saves ~51k tokens).

### Decision Tree: What to Read (Priority Order)

**Start here for navigation:**

- **Understanding overall architecture or starting new work** → `docs/ARCHITECTURE-OVERVIEW.md` (navigation hub, ~12KB)

**Database & Entities (CRITICAL - most violated):**

- **Creating/modifying entities, migrations, or TypeORM** → `docs/STATE-ISOLATION.md` ⚠️ (~16KB)
  - Always check for duplicate entity names before creating entities
  - Required before any database work

**Implementation Patterns:**

- **Creating controllers, services, or repositories** → `docs/CODING-PATTERNS.md` (~28KB)
  - Repository pattern, lean controllers, transaction management
- **Organizing code within a package** → See `docs/IMPLEMENTATION-CHECKLIST.md` (File Organization section)

**Module Design & Communication:**

- **Creating new modules, boundaries, or inter-module communication** → `docs/MODULAR-PRINCIPLES.md` (~20KB)
  - Principles 1-7: boundaries, composability, independence, communication

**Resilience & Observability:**

- **Logging, metrics, error handling, circuit breakers** → `docs/RESILIENCE-OBSERVABILITY.md` (~20KB)
  - Principles 9-10: observability, fail independence

**External Integrations:**

- **Integrating external APIs, third-party services, HTTP clients** → `docs/THIRD-PARTY-INTEGRATION.md` (~16KB)
  - Mock/HTTP/SDK patterns, client encapsulation, injection patterns

**Verification & Compliance:**

- **Pre-commit checks, architecture verification, detection commands** → `docs/IMPLEMENTATION-CHECKLIST.md` (~20KB)
  - Detection commands, verification steps, anti-patterns

### Quick Reference by Task Type

| Task Type                 | Primary Doc                                | Secondary Docs              |
| ------------------------- | ------------------------------------------ | --------------------------- |
| New entity/migration      | STATE-ISOLATION.md                         | ARCHITECTURE-OVERVIEW.md    |
| New controller/service    | CODING-PATTERNS.md                         | IMPLEMENTATION-CHECKLIST.md |
| New module                | MODULAR-PRINCIPLES.md + STATE-ISOLATION.md | ARCHITECTURE-OVERVIEW.md    |
| External API integration  | THIRD-PARTY-INTEGRATION.md                 | RESILIENCE-OBSERVABILITY.md |
| Error handling/logging    | RESILIENCE-OBSERVABILITY.md                | CODING-PATTERNS.md          |
| Architecture verification | IMPLEMENTATION-CHECKLIST.md                | (run detection commands)    |
