# 📊 Backend Traffic Analytics Setup & Deployment Guide

This documentation details the changes made to the NestJS backend to support visitor traffic monitoring, IP geolocation resolution, database fallbacks, and secure administrative authentication.

---

## 🛠️ Summary of Backend Changes

1. **Mongoose Database Schema (`src/traffic/traffic.schema.ts`):**
   * Configured the `Visitor` schema storing visitor UUID device IDs, list of visit logs, browser user agents, and resolved geo-IP details (country, region, city, ISP).
2. **Analytics Service Engine (`src/traffic/traffic.service.ts`):**
   * **Dual Database Fallback Adaptor:** Auto-detects if a `MONGODB_URI` connection is active. If yes, it logs metrics directly into MongoDB Atlas. If no (or on connection errors), it writes/reads locally to `apps/backend-nestjs/traffic_local.json` to keep development zero-config.
   * **Reverse Proxy IP Resolution:** Extracts client IP by inspecting the first entry of the `x-forwarded-for` header list.
   * **IP Geolocation Resolution:** Queries `ip-api.com` for client metadata. Gracefully handles localhost loopbacks (`127.0.0.1`, `::1`) by instantly returning placeholder details.
   * **Passcode Gateway & Token Validation:** Implements in-memory active session tokens for administrative stats fetching, checking passcodes and gateway phrases from environment variables.
   * **Lifecycle Cleanups:** Implements `OnModuleDestroy` hooks to cleanly terminate the database connection pool on teardown, preventing active sockets from hanging Jest test runs.
3. **API Controllers & Modules (`src/traffic/traffic.controller.ts` & `traffic.module.ts`):**
   * `POST /api/traffic/track` - Public route triggered by clients on website boot.
   * `POST /api/traffic/verify-gateway` - Checks if a URL phrase (`?gateway=xxx`) matches `ADMIN_GATEWAY_KEY` to reveal the console tab.
   * `POST /api/traffic/auth` - Checks if the typed passcode matches `ADMIN_PASSCODE` and returns a Bearer session token.
   * `GET /api/traffic/stats` - Protected route returning aggregated metrics. Requires a valid `Authorization: Bearer <token>` header.

---

## 🌐 Production Environment Variables (Render Dashboard)

When deploying the NestJS backend to **Render**, copy and paste these exact key-value pairs into the **Environment Variables** vault of your Render service:

| Variable Key | Production Value | Description |
|---|---|---|
| **`MONGODB_URI`** | `mongodb+srv://msmlabs:msmlabs26@cluster0.dyqenw6.mongodb.net/portfolio` | MongoDB Atlas cluster connection string directing writes to the `portfolio` database |
| **`ADMIN_PASSCODE`** | `msmlabs26` | The passcode you must type in the Console input to unlock metrics |
| **`ADMIN_GATEWAY_KEY`** | `msm-gateway` | The URL query key value (e.g. `?gateway=msm-gateway`) required to show the tab |
| **`PORT`** | `3000` | The network port NestJS listens on |
| **`ALLOWED_ORIGINS`** | `https://msmlabs.dev,https://www.msmlabs.dev` | Authorized domains permitted by the CORS security policy |

> [!NOTE]
> You can change the values of `ADMIN_PASSCODE` and `ADMIN_GATEWAY_KEY` in your Render dashboard at any time to update your passwords without redeploying the backend codebase!
