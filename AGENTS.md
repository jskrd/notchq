# AGENTS.md

## Setup commands

- Install deps: `pnpm install`
- Run format: `pnpm format`
- Run knip: `pnpm knip`
- Run lint: `pnpm lint`
- Run tests: `pnpm test`
- Run type check: `pnpm typecheck`

## Project structure

- `apps/api` - Hono REST API serving business, offering, and booking data
- `apps/book` - Next.js booking interface for customers
- `packages/auth` - Argon2 password hashing utilities
- `packages/db` - Kysely database schema and queries for PostgreSQL

## Code style

- TypeScript strict mode
- Prettier default formatting
- Use functional patterns where possible

## Commit messages

- Use conventional commits format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Documentation

- Auth architecture and implementation plan: `docs/auth.md`

## Testing

- Tests must be able to run in parallel — no test should depend on execution order or shared mutable state
- Each test creates its own data (via factories); no cleanup required — leftover data must not affect other tests
- Use `@repo/db/factories` to create test database records (e.g. `createUser()`, `createOffering()`)
- Factories accept optional `Partial<NewEntity>` overrides and auto-create required parent records
- Optional FKs (like `basket.user_id`) default to `null` — don't auto-create for those
- External services (e.g. Stripe) must be mocked — tests must never send real requests to external APIs
- Internal services (PostgreSQL, Redis) are expected to be running — tests read and write real data against them, no mocking
