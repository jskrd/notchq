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
- `packages/rdb` - Kysely database schema and queries for PostgreSQL

## Code style

- TypeScript strict mode
- Prettier default formatting
- Use functional patterns where possible

## Commit messages

- Use conventional commits format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Documentation

- Auth architecture and implementation plan: `docs/auth.md`
