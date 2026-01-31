# Authentication

This document captures the authentication architecture and implementation plan.

## Architecture

### Overview

The system uses a split authentication strategy:

- **`apps/api`** - Token-based auth for programmatic API access
- **`apps/book`** - Session-based auth for web UI, with sessions stored in Redis

When a user logs into `apps/book`, the app authenticates against `apps/api`, receives a token, and stores that token in a Redis session. The browser receives only a session ID cookie. Subsequent requests use the session to retrieve the token for API calls.

### What lives where

**`packages/auth`** (shared auth logic):

- Token generation and validation
- Password hashing utilities
- Redis session store (connect, read, write, delete)
- Session types and interfaces
- Shared configuration defaults

**`apps/api`** (token-based endpoints):

- Login endpoint (validate credentials, return token)
- Registration endpoint (create user, return token)
- Token validation middleware

**`apps/book`** (session-based web auth):

- Session middleware integration with Next.js
- Cookie configuration (domain, path, secure flags)
- Login/registration UI pages

### Token Specification

Opaque tokens using a selector/validator pattern for secure storage.

**Format:**

```
nq_<32 char selector><64 char validator>
```

- **Prefix**: `nq_` (identifies as a notchq token)
- **Selector**: 32 characters, base62 (~190 bits entropy)
- **Validator**: 64 characters, base62 (~381 bits entropy)
- **Total length**: 99 characters

**Example:**

```
nq_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
```

**Database storage:**

- `selector`: 32 chars, stored plain text (indexed for lookup)
- `validator_hash`: hash of the 64-char validator
- `user_id`: token owner

**Why this pattern:**

- If database leaks, attackers get selectors (useless alone) and hashed validators (can't reverse)
- Lookup by selector is fast (indexed)
- Validation compares hash of provided validator against stored hash
- No visible separator - cleaner UX, implementation details hidden

**Database schema:**

```
tokens table:
- id
- user_id (one user → many tokens)
- selector (indexed)
- validator_hash
- created_at
- expires_at
- last_used_at
```

### Expiration Strategy

Both sessions and tokens use sliding (rolling) expiration - activity extends the expiry.

**Duration:** 30 days of inactivity before expiration.

**Redis sessions:**

- TTL set to 30 days on creation
- Each request resets TTL to 30 days (built-in "rolling" option in session middleware)
- Redis automatically deletes expired sessions

**Database tokens:**

- `expires_at` set to now + 30 days on creation
- Updated on each authenticated request

**Write optimization:**
Only update `expires_at` and `last_used_at` if `last_used_at` is more than 1 hour old. This reduces writes from potentially hundreds per active session to ~1 per hour, while maintaining sufficient precision for a 30-day window.

**Cleanup:**

- Redis: automatic via TTL
- Tokens: scheduled job (daily cron) deletes tokens where `expires_at < now()`

## Implementation Phases

### Phase 1: Token auth in packages/auth + apps/api

Build the core token-based authentication:

- [x] Password hashing utilities in `packages/auth`
- [x] Token generation/validation in `packages/auth`
- [ ] Login endpoint in `apps/api`
- [ ] Registration endpoint in `apps/api`
- [ ] Token validation middleware in `apps/api`

### Phase 2: Session logic in packages/auth

Build the session store for web apps:

- [ ] Redis session store in `packages/auth`
- [ ] Session types/interfaces in `packages/auth`

### Phase 3: Web UI auth in apps/book

Integrate sessions and build the UI:

- [ ] Session middleware integration in `apps/book`
- [ ] Login page
- [ ] Registration page
- [ ] Protected routes

## Open Questions

(Capture decisions and questions as they come up)

None currently.
