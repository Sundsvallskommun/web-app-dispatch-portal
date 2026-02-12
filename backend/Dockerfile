# =====================
# Dependencies + Prisma
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

# create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

ENV NODE_ENV=production
ENV PORT=3000

# only copy what's needed
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nodejs
EXPOSE 3000

CMD ["node", "dist/server.js"]
