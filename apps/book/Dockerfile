FROM node:25-alpine AS base
WORKDIR /app

FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/book run build

FROM base
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=build --chown=nextjs:nodejs /app/apps/book/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/book/.next/static ./apps/book/.next/static
COPY --from=build --chown=nextjs:nodejs /app/apps/book/public ./apps/book/public
USER nextjs
EXPOSE 3000
CMD ["node", "./apps/book/server.js"]
