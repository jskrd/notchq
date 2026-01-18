FROM node:25-alpine
WORKDIR /app
RUN npm install --global --force corepack
RUN corepack enable pnpm
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono
RUN chown hono:nodejs /app
COPY --chown=hono:nodejs . .
USER hono
RUN pnpm install --frozen-lockfile --prod
EXPOSE 3001
CMD ["node", "./apps/api/src/index.ts"]
