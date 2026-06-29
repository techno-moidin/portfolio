# 📊 Frontend Traffic Analytics Setup & Deployment Guide

This documentation details the changes made to the React frontend to support visitor tracking, secure URL gateway reveals, console title updates, and passcode locking.

---

## 🛠️ Summary of Frontend Changes

1. **Visitor Tracking Hook (`src/App.tsx`):**
   * Checks `localStorage` for a unique browser/device UUID (`msm_device_id`). If not present, generates one.
   * On application mount, sends a silent `POST /api/traffic/track` request containing the device identifier, user agent, and document referrer to register the hit.
2. **Hidden URL Gateway Check (`src/components/FloatingConsole.tsx`):**
   * On mount, inspects the URL query parameters. If it detects `?gateway=YOUR_VALUE`, it queries `POST /api/traffic/verify-gateway` in the background.
   * If the backend confirms the key matches, it sets `adminMode` to `true` inside the browser session (`sessionStorage`), revealing the **Traffic Insights** tab.
   * Dynamically removes the `?gateway=...` parameter from the browser URL search bar (via `window.history.replaceState`) so the passcode is never leaked if the URL is copied.
3. **Dynamic Console Title:**
   * When `adminMode` is active (unlocked via gateway query), the floating console header text dynamically shifts from **"Developer Console"** to **"Admin Console"**, providing instant visual confirmation.
4. **Passcode Form Gate:**
   * Clicking the "Traffic Insights" tab renders a secure passcode entry form. The user must type their passcode, which is checked on the backend to receive a Bearer session token.
   * The Bearer token is sent in the header of all stats queries: `Authorization: Bearer <token>`.
   * **Offline Resiliency Fallback:** If the backend server is offline, typing the default passcode (`msmlabs26`) or gateway (`msm-gateway`) allows testing statistics locally by building stats out of frontend logs.

---

## 🌐 Production Environment Variables (Vercel Dashboard)

When deploying the React frontend to **Vercel**, copy and paste these exact key-value pairs into the **Environment Variables** panel of your Vercel project settings:

| Variable Key | Production Value | Description |
|---|---|---|
| **`VITE_API_URL`** | `https://secure.msmlabs.dev` | The REST API endpoint of your deployed Render NestJS Backend |
| **`VITE_WS_URL`** | `https://secure.msmlabs.dev` | The Socket.io WebSockets endpoint of your deployed Render NestJS Backend |

---

## 🔑 How to Access the Analytics Dashboard in Production

1. Navigate to: **`https://msmlabs.dev/?gateway=msm-gateway`**
2. Toggle the navbar perspective role to **CTO**.
3. Click the glowing green terminal icon in the bottom-right corner.
4. Notice that the header reads **"Admin Console"** (the tab is successfully revealed!).
5. Click the **TRAFFIC INSIGHTS** tab.
6. Enter **`msmlabs26`** in the passcode field and click **Authenticate**.
7. Enjoy your traffic statistics!
