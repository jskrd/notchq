FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
RUN cd apps/api && pnpm run build

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono
COPY --from=deps --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=hono:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=hono:nodejs /app/apps/api/dist ./apps/api/dist
USER hono
EXPOSE 3001
CMD ["node", "./apps/api/dist/index.js"]
