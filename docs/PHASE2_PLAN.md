# Phase 2: Full-Stack Monorepo & Dynamic Role Perspective Integration

This document serves as our active, step-by-step development tracker for Phase 2. We will execute these tasks sequentially, validating and marking them off one by one to ensure absolute stability at each step.

---

## 🚦 Phase 2 Lifecycle Status
- **Current Step:** [x] Step 6: Docker Integration & Verification (Complete)
- **Overall Progress:** `100%` (6/6 major steps completed)

---

## 📋 Comprehensive Checklist

### 📦 Step 1: Monorepo Workspace Restructuring
- [x] Create monorepo subdirectories (`apps/frontend-react`, `apps/backend-nestjs`, `packages/shared-types`).
- [x] Move existing React files from the project root into `apps/frontend-react` (retaining all components, assets, data layers).
- [x] Create root `package.json` with npm workspaces: `["apps/*", "packages/*"]` and root build/run scripts.
- [x] Adjust React configurations (Vite config, TSConfig paths, asset resolutions) for its new subdirectory location.
- [x] Verify frontend building and running natively inside `apps/frontend-react`.

### 🛡️ Step 2: Shared Types Integration
- [x] Scaffold `packages/shared-types` with standard `package.json` workspace definitions.
- [x] Create `packages/shared-types/src/index.ts` declaring:
  - `UserRole` union (`'HR' | 'CEO' | 'CTO'`).
  - `RoleContent` and `TelemetryMetrics` schemas.
  - Core interfaces for keyword matchers, project cost calculations, and bug checking telemetry.
- [x] Build shared-types package and link it as a workspace dependency.

### ⚙️ Step 3: NestJS Backend Service Scaffolding
- [x] Initialize standard NestJS project structures in `apps/backend-nestjs`.
- [x] Install required NestJS core modules, Socket.io gateway components, and dependencies.
- [x] Configure `main.ts` with global route prefix `/api` and active CORS policies.
- [x] Implement `PortfolioController`:
  - `GET /api/portfolio/resume`: streams pdf cv data.
  - `GET /api/portfolio/skills?match=tag`: retrieves tag matches.
  - `POST /api/portfolio/calculate-scope`: computes ROI roadmap arrays.
- [x] Implement `SandboxController`:
  - `POST /api/sandbox/verify-bug`: verifies selected IDE bug lines and returns git-diff code blocks.
- [x] Implement `TelemetryGateway`:
  - Socket.io gateway simulating synthetic server load (CPU, memory, latency, active connections).
  - Listens to frontend traffic adjustment commands to scale simulated load dynamically.

### 🎨 Step 4: Persona Selector & Context Transitions
- [x] Create unified React context state `RoleContext` inside the frontend.
- [x] Build premium glassmorphic **Perspective Switcher** with interactive sliding animations inside `Navbar.tsx`.
- [x] Implement custom CSS view transition rules:
  - Scale down and fade out active layouts over 200ms.
  - Re-align structural container boundaries based on target persona.
  - Hydrate, scale up, and ease back to full visibility over 300ms.
- [x] Configure dynamic headlines and descriptions inside the `Hero` section for Recruiter, Founder, and Engineer roles.

### 🎮 Step 5: Advanced Interactive Feature Integration
- [x] **Recruiter (HR) View:**
  - Build interactive tech skill keyword selector chips.
  - Make API calls to calculate compatible match matrices.
  - Highlight related projects/roles dynamically with premium neon borders and calculate a visual "Role Fit Score".
- [x] **Founder (CEO) View:**
  - Build interactive complexity, duration, and scalability sliders.
  - Integrate visual staging roadmap timeline showing milestones, database caching, and QA reviews.
- [x] **Technical Leader (CTO) View:**
  - Inject explicit API endpoint tags onto major dashboard cards.
  - Integrate a floating command console logging client state metrics and network roundtrips.
  - Build **Code Review Sandbox**: rendering IDE syntax code blocks where users inspect asynchronous database race conditions and unoptimized loop queues. Correct submissions render gorgeous inline Git Diffs.
  - Build **System Stress-Tester**: rendering SVG node networks showing load-balancing paths. Integrate real-time graphs reading Socket.io streams, and toggle buttons to spin up worker nodes or enable Redis cache blocks.

### 🐳 Step 6: Docker Integration & Verification
- [x] Write a production-ready, multi-stage `Dockerfile` for `apps/frontend-react` (Vite build + custom Nginx configuration).
- [x] Write a multi-stage `Dockerfile` for `apps/backend-nestjs` (TypeScript compile + pruned dependencies).
- [x] Write a root `docker-compose.yml` to orchestrate both images.
- [x] Test the entire full-stack application natively (`npm run dev`) and inside Docker (`docker compose up --build`).
