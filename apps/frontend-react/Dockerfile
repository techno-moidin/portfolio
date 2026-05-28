# ── Stage 1: Build ──
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy root configurations and workspace manifests
COPY package.json package-lock.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/frontend-react/package.json ./apps/frontend-react/

# Install dependencies (workspaces resolve automatically)
RUN npm ci

# Copy full monorepo source files needed for build
COPY packages/shared-types ./packages/shared-types
COPY apps/frontend-react ./apps/frontend-react

# Compile workspaces
RUN npm run build --workspace=packages/shared-types
RUN npm run build:frontend

# ── Stage 2: Production ──
FROM nginx:alpine

# Copy compiled static assets from builder stage
COPY --from=builder /usr/src/app/apps/frontend-react/dist /usr/share/nginx/html

# Copy custom Nginx configuration for client-side routing
COPY apps/frontend-react/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
