# MSM Portfolio — Phase 2 Architecture & Integration Guide

This document provides a comprehensive technical blueprint of the completed **Phase 2** full-stack monorepo system. It details the underlying directories, communication protocols, dynamic role features, offline try-catch resilience fallbacks, compositor performance layers, and containerized configurations built to prove advanced software engineering capabilities.

---

## 📂 1. Directory Restructuring (Monorepo Workspaces)
To support a modular full-stack codebase, the project transitioned into an isolated **npm workspaces monorepo**:

```text
portfolio/
├── package.json                   # Monorepo root workspaces manifest
├── docker-compose.yml             # Container orchestration config
├── docs/
│   └── PHASE2_ARCHITECTURE.md     # This comprehensive guide
├── packages/
│   └── shared-types/              # Workspace package: TypeScript models
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts           # Unified type contracts
└── apps/
    ├── frontend-react/            # Workspace package: React 19 Client
    │   ├── package.json
    │   ├── vite.config.ts
    │   ├── nginx.conf             # Custom SPA server router rules
    │   ├── Dockerfile             # Multi-stage static builder/server
    │   └── src/
    │       ├── App.tsx            # Main hub (Role Switcher anim coordinates)
    │       ├── utils/
    │       │   └── RoleContext.tsx # Context for transition state machines
    │       └── components/
    │           ├── FloatingConsole.tsx # Floating terminal logs monitor
    │           ├── Skills.tsx      # Skills grid, HR Matcher, CTO Sandbox
    │           └── Projects.tsx    # Bento grid, CEO ROI, CTO Stress Tester
    └── apps/backend-nestjs/       # Workspace package: NestJS Server Engine
        ├── package.json
        ├── tsconfig.json
        ├── nest-cli.json
        ├── Dockerfile             # Multi-stage production container
        └── src/
            ├── main.ts            # Server bootstrap (Prefixes & CORS)
            ├── app.module.ts      # Module registers controllers/gateways
            ├── portfolio/
            │   └── portfolio.controller.ts # REST API for CV & CEO ROI Calculator
            ├── sandbox/
            │   └── sandbox.controller.ts   # REST API for IDE bug checkers
            └── telemetry/
                └── telemetry.gateway.ts    # Socket.io live stream gateways
```

### Dependency Syncing Mechanism
By using standard package mappings `"shared-types": "*"` inside the workspace `package.json` manifests, npm links `packages/shared-types` locally. Whenever type signatures are modified, running `npm run build --workspace=packages/shared-types` immediately updates the type contracts for both client and server codebases.

---

## 🛡️ 2. Type Safety (`packages/shared-types`)
A single, strict source of truth governs the full-stack communications interfaces inside `packages/shared-types/src/index.ts`:

- `UserRole`: Union `'HR' | 'CEO' | 'CTO'` defining the active persona.
- `RoleContent`: Standard schema for custom headlines and subtitles.
- `TelemetryMetrics`: Real-time websocket data signature:
  ```typescript
  export interface TelemetryMetrics {
    cpuUsage: number;
    memoryUsage: number;
    apiLatencyMs: number;
    activeConnections: number;
  }
  ```
- `ScopeCalculateDto` & `ScopeCalculateResult`: Request and response schemas for business ROI calculators.
- `VerifyBugDto` & `VerifyBugResult`: Request and response schemas for sandboxed IDE checks.

---

## ⚙️ 3. NestJS Backend Core Services (`apps/backend-nestjs`)

### A. Dynamic REST APIs
1. **CV Stream (`GET /api/portfolio/resume`):** Streams a dynamic, valid PDF buffer containing structural resume text directly to browser download clients.
2. **Skill Compatibility Matrix (`GET /api/portfolio/skills?match=tag`):** Evaluates skill keywords and calculates compatibility scores (80% to 98%), mapping targeted bullet-points and linking related project IDs.
3. **Project ROI Calculator (`POST /api/portfolio/calculate-scope`):** Accepts parameters for Complexity, Launch Timelines, and Scale. Computes an accelerated development Gantt roadmap displaying durations and active task descriptions. Calculates total projected costs and speed-to-market scores.

### B. Sandboxed IDE Bug Checker
- **`POST /api/sandbox/verify-bug`:** Validates code reviews from the CTO puzzle selector:
  - **Puzzle 1 (N+1 Query Loop):** Validates if lines 8, 9, or 10 are selected. Returns an atomic SQL Joined query and an animated Git patch diff on success.
  - **Puzzle 2 (Double-Spend Transaction Race):** Validates if lines 4, 5, or 6 are selected. Returns a Redis Distributed Mutex lock solution and its matching Git patch diff on success.

### C. Live Telemetry WebSockets (`TelemetryGateway`)
- Built using `@nestjs/websockets` and Socket.io on port `3000`.
- Establishes a bidirectional channel tracking client socket lifecycle events.
- Runs a 1,000ms loop streaming fluctuating synthetic parameters to connected clients:
  - Ingress traffic scales from 10 req/s to 50,000 req/s.
  - **Redis Cache Toggling:** Instantly slashes simulated latency and database CPU spikes by 92%.
  - **Scale-Out Provisioning:** Simulates spinning up application nodes (up to 8 clusters), dividing CPU utilization cleanly.

---

## 🎨 4. React Frontend Perspective Engine (`apps/frontend-react`)

### A. Context-Driven View Transitions (`RoleContext.tsx`)
A custom state machine handles role-shifting sequences cleanly without massive third-party packages:
1. When switching a role, context sets `transitionStatus` to `'fading-out'`.
2. A **200ms ease-out** transition scales down, blurs, and fades out the homepage wrapper.
3. At `200ms`, context updates the active `role` state, updating the rendered headers, buttons, and elements, and switches `transitionStatus` to `'fading-in'`.
4. A **300ms ease-in** transition scales up, unblurs, and fades the new layout back to full opacity.

### B. Custom Interactive Portals

#### 🚀 1. The Recruiter (HR) Dashboard
- Rendered inside `Skills.tsx`. Exposes a selection area populated with standard tech chips.
- Selecting a keyword makes queries to `/api/portfolio/skills?match=...` to retrieve match highlights.
- Dispatches custom events to the Projects catalog. Cards matching the skill glow green, while irrelevant projects fade, focusing the recruiter's attention.

#### 📈 2. The Product Founder (CEO) Dashboard
- Rendered inside `Projects.tsx`. Exposes complexity, timeline, and traffic sliders.
- Calculates cost estimates, launch velocities, and visual roadmaps featuring active milestone markers.

#### 💻 3. The Technical Leader (CTO) Dashboard
- Exposes API route tags under section headers to inspect underlying architectures.
- Exposes a **Diagnostics Terminal Console** (nested inside `FloatingConsole.tsx`) logging real-time client lifecycles, HTTP response roundtrips, and WebSocket data streams on screen.
- **IDE Code Review Sandbox:** Split-pane editor allowing developers to select lines, execute validations, and review syntax diffs.
- **System Stress-Tester:** SVG visual topology diagram. Displays active node channels, CPU/Memory gauges, and alerts during traffic spikes. Toggling Redis or scaling nodes immediately relieves simulated strain.

---

## 🔌 5. Offline Resiliency (Try-Catch Local Fallbacks)
To guarantee the portfolio operates cleanly even if the NestJS backend is offline or unreachable, the React frontend implements a **Local Fallback Strategy**:
- When fetch calls to `/api/...` or Socket.io connections to `localhost:3000` throw a connection timeout or network error, they gracefully degrade.
- The client-side catches the error, registers a warning `[LIFECYCLE] Backend offline. Running sandboxed local resolver...` inside the diagnostics terminal, and executes the matching calculations locally in JavaScript.
- All widgets, roadmaps, bug-finding diffs, and node gauges remain 100% interactive.

---

## 🚀 6. GPU Compositor & Scroll Optimizations
To completely eliminate page stutters and sluggish smooth-scrolling stutters, layout reflows were migrated to GPU hardware acceleration:
- **Transform translations:** The mouse-following radial glow was moved from updating layout-clunky `style.left`/`style.top` properties to compositor-friendly **`translate3d`** shifts in `App.tsx`:
  ```typescript
  cursorRef.current.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
  ```
- **Layer Promotion:** Added **`will-change: transform`** and **`transform: translate3d(0, 0, 0)`** to `.cursor-glow`, `.hero-glow`, `.glass-card` (which carries expensive backdrop filters), and the background `.particle-canvas`.
- **Why this wins:** The browser promotes these elements to separate compositor textures. The GPU handles translation coordinates and alpha composites natively, delivering a butter-smooth 60fps/120fps experience.

---

## 🐳 7. Multi-Stage Containerization (Docker)
A production-ready container structure orchestrates both services cleanly:
- **`apps/frontend-react/Dockerfile`:**
  - Multi-stage build compiling Vite TypeScript source via a Node builder.
  - Copies bundle files into a lightweight **Nginx web server** container.
  - Implements a custom [nginx.conf](file:///Users/apple/Desktop/SB_Projects/Workspace/techno/portfolio/apps/frontend-react/nginx.conf) to cleanly route unmatched SPA paths back to `index.html`.
- **`apps/backend-nestjs/Dockerfile`:**
  - Multi-stage builder compiling NestJS TypeScript source.
  - Uses `npm ci --omit=dev` to prune dev dependencies, building a lightweight Node runtime container.
- **`docker-compose.yml`:** Coordinates frontend (port 80) and backend (port 3000) services under a single networking layer, ready for instant hosting.
