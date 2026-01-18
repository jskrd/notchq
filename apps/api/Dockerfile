FROM node:25-alpine
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono
RUN corepack enable pnpm
RUN chown hono:nodejs /app
COPY --chown=hono:nodejs . .
USER hono
RUN pnpm install --frozen-lockfile --prod
EXPOSE 3001
CMD ["node", "./apps/api/src/index.ts"]
