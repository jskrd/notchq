FROM node:24-alpine AS base
WORKDIR /app

FROM base AS build
COPY . .
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/api... run build

FROM base
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono
COPY --from=build --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=hono:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=hono:nodejs /app/apps/api/dist ./apps/api/dist
USER hono
EXPOSE 3001
CMD ["node", "./apps/api/dist/index.js"]
