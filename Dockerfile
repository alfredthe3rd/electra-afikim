# Production image for the site (Next.js + Payload), built as a Next.js
# "standalone" server. Used by docker-compose.yml.

FROM node:22-alpine AS base

# --- Install dependencies -------------------------------------------------
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build ------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Placeholders so the config loads during the build. Every page renders per
# request, so the build never connects to the database; the real values are
# supplied at runtime from .env.
ARG DATABASE_URL=postgres://build:build@localhost:5432/build
ARG PAYLOAD_SECRET=build-time-placeholder
RUN DATABASE_URL=$DATABASE_URL PAYLOAD_SECRET=$PAYLOAD_SECRET npm run build

# --- Runtime ----------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as the same uid/gid as the server account that owns the media folder,
# so uploads written by the app belong to that account.
ARG APP_UID=1001
ARG APP_GID=1001
RUN addgroup -S -g ${APP_GID} app && adduser -S -u ${APP_UID} -G app app

COPY --from=builder /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static

# Payload stores uploads in ./media (relative to /app); docker-compose mounts
# a host folder here so they survive rebuilds.
RUN mkdir -p media .next/cache && chown -R app:app media .next

USER app
EXPOSE 3000
CMD ["node", "server.js"]
