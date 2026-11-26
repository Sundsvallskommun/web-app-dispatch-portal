# =====================
# Dependencies
# =====================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS deps
USER 0

WORKDIR /app
COPY package.json yarn.lock ./

# Yarn is pinned and lifecycle scripts are disabled: nothing needed for the build has an install
# script (sharp ships prebuilt binaries; cypress, @parcel/watcher and unrs-resolver are dev tooling),
# and it stops dependencies from running arbitrary code or phoning home during the image build.
RUN npm install -g --ignore-scripts yarn@1.22.22 \
 && yarn install --frozen-lockfile --ignore-scripts --network-timeout 600000

# =====================
# Build
# =====================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS builder
USER 0

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build with placeholder values for the NEXT_PUBLIC_* variables. Next inlines these at build time,
# so entrypoint.sh replaces the placeholders with real values when the container starts. The base
# path is the exception: Next resolves basePath at build time, so .env-cicd fixes it to /admin.
COPY .env-cicd .env.local

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install -g --ignore-scripts yarn@1.22.22 \
 && yarn build

# =====================
# Runtime
# =====================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS runner
USER 0

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/public ./public

# Next standalone output (includes its own pruned node_modules, package.json and server.js),
# root-owned. .next must be writable by group 0: entrypoint.sh rewrites the inlined NEXT_PUBLIC_*
# placeholders in .next at container start. OpenShift runs the container as an arbitrary UID in group 0, so group write is the only way to
# allow that.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN chmod -R g+w /app/.next

# Root-owned and read-only; line endings are enforced by .gitattributes.
COPY --chmod=0555 entrypoint.sh ./

USER 1001

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
