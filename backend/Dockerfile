# =====================
# Dependencies + Prisma Client
# =====================
FROM node:20-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY prisma ./prisma
RUN yarn prisma generate

# =====================
# Build
# =====================
FROM node:20-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# =====================
# Runtime
# =====================
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y openssl

ENV NODE_ENV=production

COPY --from=builder --chown=nodejs:nodejs /app/ ./
WORKDIR /app

EXPOSE 3000
CMD ["node", "./dist/server.js"]
