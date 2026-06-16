# ── Stage 1: Build ──
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy root configs and package manifests
COPY package.json package-lock.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/backend-nestjs/package.json ./apps/backend-nestjs/

# Install dependencies
RUN npm ci

# Copy full monorepo source files needed for build
COPY packages/shared-types ./packages/shared-types
COPY apps/backend-nestjs ./apps/backend-nestjs

# Compile workspaces
RUN npm run build --workspace=packages/shared-types
RUN npm run build:backend

# ── Stage 2: Production ──
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy root package.json and manifests
COPY package.json package-lock.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/backend-nestjs/package.json ./apps/backend-nestjs/

# Install production-only dependencies
RUN npm ci --omit=dev

# Copy compiled resources and workspaces from builder
COPY --from=builder /usr/src/app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /usr/src/app/apps/backend-nestjs/dist ./apps/backend-nestjs/dist
COPY --from=builder /usr/src/app/apps/backend-nestjs/assets ./apps/backend-nestjs/assets

EXPOSE 3000

CMD ["node", "apps/backend-nestjs/dist/src/main"]
