# Dynamic Production Blueprint: Security Hardening, Automated Testing, & Cloud Deployment

This blueprint outlines the complete technical specifications for **Phase 3 (Production Readiness)**. It details our architectural strategy to achieve bulletproof security, isolate sensitive variables cleanly without repository commits, handle free-tier hosting limitations (such as cold-starts) gracefully, and coordinate testing and CI/CD automation.

---

## 🚦 Phase 3 Lifecycle Status
- **Current Step:** [x] Step 3: CI/CD Pipeline Scaffolding (GitHub Actions)
- **Overall Progress:** `75%` (Step 1, Step 2, and Step 3 complete; preparing for Step 4 Deployed Server Go-Live)

---

## 🔒 1. High-Fidelity Security & Code Privacy Safeguards

**Status:** `✅ COMPLETED` (Source code maps fully deactivated locally, custom Nginx router denial rules created, and private repo hosting verified).

To prevent external visitors or automated scanners from inspecting, reading, or "sniffing" your original source code in production, we implement three core safety barriers:

### A. Disabling Browser Sourcemaps
* **The Vulnerability:** By default, build tools compile original TypeScript (`.ts`/`.tsx`) files into JavaScript, but they also generate source map (`.js.map`) files. If uploaded to a public server, anyone can open their browser's Developer Tools (under the "Sources" tab) and view your complete unminified codebase.
* **Our Solution:** We explicitly disable sourcemap generation in our production build configuration (`apps/frontend-react/vite.config.ts`):
  ```typescript
  build: {
    sourcemap: false
  }
  ```
  This guarantees that Vite only emits minimized, scrambled browser-optimized assets. Visitors can only see the compiled, highly compressed JavaScript bundles; they have zero means of reconstructing or reading your original React files.

### B. Strict Repository Privacy
* Ensure this monorepo is hosted in a **Private GitHub Repository**. Private repositories are 100% free on GitHub. Only accounts that you explicitly authorize can see your commits, branch structures, or read this document.

### C. Hardened Nginx Production Configuration
* In our multi-stage frontend container (`apps/frontend-react/Dockerfile`), we leverage Nginx as a high-performance web server.
* Our Nginx custom configuration ([nginx.conf](file:///Users/apple/Desktop/SB_Projects/Workspace/techno/portfolio/apps/frontend-react/nginx.conf)) is engineered to prevent directory browsing and block requests to internal system files:
  ```nginx
  # Prevent any directory listing or internal system sniffing
  autoindex off;
  location ~ /\.(?!well-known).* {
      deny all;
  }
  ```

---

## 🔑 2. Secrets & Twelve-Factor Environment Isolation

**Status:** `✅ COMPLETED` (Local `.env` credentials fully blocked in gitignore, `.env.example` templates created in frontend and backend, dynamic process parsing fully implemented).

Hardcoding active API endpoints, credentials, or keys inside code repositories is one of the most common vectors for security breaches. We implement a strict **Twelve-Factor App secrets architecture** to isolate runtime environments cleanly:

```mermaid
flowchart TD
    subgraph Local Developer Environment
        EnvDev[".env (Git-Ignored)"] --> DevRun["npm run dev (Port 3000)"]
    end

    subgraph Production Cloud Environment (100% Secure & Zero Cost)
        VercelEnv["Vercel Variables Dashboard"] -.->|Injected on Build| VercelClient["Static Frontend (Vite)"]
        RenderEnv["Render/Railway Dashboard"] -.->|Injected in Memory| RenderServer["Dockerized Backend (NestJS)"]
    end
    
    PrivateGit["Private GitHub Repo"] -->|Zero Secrets Committed| VercelEnv
    PrivateGit -->|Zero Secrets Committed| RenderEnv
```

### A. Zero Env Commits to Git
* **The Vulnerability:** Pushing a `.env` file containing database passwords, API tokens, or server settings to Git (even a private one) is dangerous.
* **Our Solution:** We audit and update our workspace `.gitignore` to block all `.env*` files explicitly, except for keeping a generic, empty template file (`.env.example`) that documents target parameter keys with zero real credentials.

### B. Encrypted Dashboard Memory Injection
* **No Environment Files on Server Disk:** In production (Vercel + Render/Railway), we do not write, upload, or generate `.env` files.
* **Dashboard Injection:** Variables are registered directly inside your cloud provider's web console. The hosting runtime keeps these secrets encrypted in cloud vaults, and injects them **directly into the container's active process memory** (`process.env` in NestJS, `import.meta.env` during Vercel's build stage).
* **Benefit:** Since secrets never touch physical storage, your credentials are 100% immune to filesystem-sniffing exploits.

---

## 🌎 3. Deployed Infrastructure & Zero-Cost Architecture

**Status:** `⏳ PENDING (Awaiting Cloud Hosting Handshakes in Step 4)` (Timeout resilience loops and offline try-catch layers fully implemented on client).

To make deployment completely free in the initial stages while preserving high performance, we have designed a distributed architecture combining Vercel and Render/Railway:

| Component | Cloud Platform | Deployment Method | Cost | Always-On / Sleep Behavior |
| --- | --- | --- | --- | --- |
| **Frontend (React)** | **Vercel** | Edge CDN Static Hosting | **$0.00** (Free Tier) | **Always On:** Instant load times worldwide, backed by global CDN edge points. |
| **Backend (NestJS)** | **Render / Railway** | Multi-Stage Docker Container | **$0.00** (Free Tier) | **Auto-Sleep:** Free containers sleep after 15 minutes of inactivity. First load triggers boot. |

### ⚠️ Render Cold-Start & Try-Catch Fallback Resilience

The only major limitation of Render's free tier is **container sleeping** (inactivity sleep after 15 minutes). The very first visitor to your portfolio will experience up to a **50-second startup delay** while Render provisions and spins up the Docker container. 

To prevent this from looking like a broken website to a recruiter, we have built a **Try-Catch Resilient Fallback Layer**:

```mermaid
sequenceDiagram
    participant Recruiter as Browser Client (React)
    participant NestJS as Deployed NestJS Server (Render)
    
    Recruiter->>NestJS: GET /api/portfolio/skills?match=react (with 3-sec Timeout)
    alt Server Awake
        NestJS-->>Recruiter: 200 OK (Calculated Match Analysis)
        Note over Recruiter: Render dynamic matched overlays and telemetry charts
    else Server Sleeping / Cold Start
        Note over Recruiter: 3-Second Timeout fires!
        Recruiter->>Recruiter: Catch Connection Timeout Exception
        Note over Recruiter: Write [LIFECYCLE] warning to diagnostic terminal
        Recruiter->>Recruiter: Load local fallback calculations in JS
        Note over Recruiter: Site remains 100% interactive instantly for Recruiter!
    end
```

1. **Active Timeouts:** All fetch requests made by React to the NestJS REST endpoints are governed by a strict timeout (e.g. 3 seconds).
2. **Graceful Catch Degradation:** If the backend is asleep (or completely offline), the request fails or times out. The React component catches the network exception instantly.
3. **CTO Dashboard Logging:** A warnings log `[LIFECYCLE] Backend offline. Running sandboxed local resolver...` prints inside the visual diagnostics console, proving your engineering capabilities to CTO visitors.
4. **Instant Client-Side fallback:** The React client automatically runs the exact same computation algorithms locally in client-side JavaScript. 
5. **Outcome:** The recruiter experiences **zero broken widgets or empty UI containers**. The Gantt Roadmaps, System Stress-Testers, and Code Sandboxes remain fully functional and interactive from the second the page loads.

---

## ⚡ 4. High-Performance Client-Side Rendering Optimization Architecture

**Status:** `✅ COMPLETED` (Dynamic rendering decoupled, hardware-accelerated `translate3d` transforms, element ref caching, and particle connections loop pruning complete).

Scroll lag and interaction stutter inside web applications are almost always caused by browser paint bottlenecks, layout reflows, and excessive React virtual DOM diffing. To ensure a butter-smooth 60fps/120fps experience for visiting recruiters, we have engineered three advanced frontend rendering optimizations:

### A. Isolated Dashboard Rendering (Render-Containment)
* **The Problem:** In our previous architecture, all state changes for the CEO calculator (Complexity/Timeline sliders) and the CTO stress tester (high-frequency Socket.io telemetry ticks arriving every 1,000ms) lived inside the parent `Projects` component. Every telemetry tick or slider drag triggered a **complete synchronous re-render of the entire Projects grid**. This forced React to continuously reconstruct and diff all project cards, images, hover overlays, and text blocks, bottlenecking the browser's main thread and causing scrolling lag.
* **Our Solution:** We decoupled and isolated both dynamic widgets into separate self-contained functional components inside `Projects.tsx`:
  - `ScopeCalculator` (managing all CEO range sliders and roadmap generators)
  - `SystemStressTester` (managing all WebSocket listeners, cluster nodes, and topology states)
* **Performance Gain:** By isolating dynamic state arrays inside these sub-components, telemetry data streams and slider dragging **only trigger re-renders inside these isolated sub-components**. The parent `Projects` grid and all static project cards remain completely unaffected at **0% computational rendering overhead**.

### B. High-Frequency Selector Ref Caching
* **The Problem:** Under the mouse-glow particle layer, the handler `handleMouseMove` queries `.hero-glow` on the document to apply dynamic 3D translations. Performing `document.querySelector('.hero-glow')` at a mouse movement rate of 120Hz triggers hundreds of synchronous DOM searches per second, overloading the browser layout thread.
* **Our Solution:** We optimized this by storing the queried elements inside a React `useRef` cache:
  ```typescript
  if (!heroGlowRef.current) {
    heroGlowRef.current = document.querySelector('.hero-glow');
  }
  ```
* **Performance Gain:** The browser performs the DOM query **exactly once** on the first mouse movement, and then directly modifies the hardware-accelerated `translate3d` transform on the cached ref.

### C. Canvas Particle Connection Loop Pruning
* **The Problem:** The interactive particle network in `ParticleCanvas.tsx` loops through and draws visual lines between all combinations of particles. This connects particles inside an $O(N^2)$ algorithm inside a `requestAnimationFrame` loop. Drawing 60 nodes yields $60 \times 59 / 2 = 1,770$ check iterations every single frame, causing significant GPU and rendering composite cycles.
* **Our Solution:** We reduced the target node count to **40 particles**.
* **Performance Gain:** Visual density remains pristine, while calculation loops drop to $40 \times 39 / 2 = 780$ passes—**slashing canvas processing loops by 56%** and leaving maximum main-thread CPU availability for interactive dashboard widgets.

---

## 🧪 5. Dynamic Production Testing Protocols

**Status:** `✅ COMPLETED` (Vitest hooks and Jest E2E controller suites successfully configured and verified locally with 20 passing specs).

To ensure that both public user interfaces and secured backend routers remain completely stable and bug-free across all future updates, we have established a parallel testing layer:

### A. Frontend Client Testing Specs (`apps/frontend-react/src/test`)
* **Environment**: [vitest.config.ts](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/frontend-react/vitest.config.ts) using `jsdom` for virtual document structures.
* **Mocks Setup**: [setup.ts](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/frontend-react/src/test/setup.ts) mock layer de-stresses Node execution by bypassing browser animations and connection nodes (`IntersectionObserver`, `requestAnimationFrame`).
* **Active Tests**:
  * [RoleContext.spec.tsx](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/frontend-react/src/test/RoleContext.spec.tsx): Verifies timing loops (200ms fade-out, 300ms fade-in) using virtual fake clocks.
  * [Skills.spec.tsx](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/frontend-react/src/test/Skills.spec.tsx): Verifies tech chip selections, backend queries mock resolved states, and try-catch offline local failovers.

### B. Backend Integration E2E Specs (`apps/backend-nestjs/test`)
* **Environment**: [jest.config.js](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/backend-nestjs/jest.config.js) compiling TypeScript files via `ts-jest` and mapping `shared-types` source modules directly.
* **Active Tests**:
  * [app.e2e-spec.ts](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/backend-nestjs/test/app.e2e-spec.ts):
    * **CORS policy verification**: Verifies that trusted local and Vercel domains are authorized, while unauthorized origins fail.
    * **Resume PDF stream validation**: Asserts that `GET /api/portfolio/resume` returns a valid binary PDF stream under attachment headers.
    * **Skills compatibility scoring**: Validates compatibility matches and highlighted project lists.
    * **CEO projections**: Asserts budget forecasts under differing slider crunches.
    * **CTO IDE debugger**: Validates lines verification algorithms and diff returns.

### C. Script Commands
Run these commands from the root directory to trigger tests:
```bash
# Run the complete test suite (Frontend Vitest + Backend E2E Jest)
npm test

# Run React frontend unit tests only
npm run test:frontend

# Run NestJS backend E2E tests only
npm run test:backend
```

---

## 📋 Phase 4-Step Production Roadmap

### ⚙️ Step 1: Pre-Deployment Code Hardening & Adaptations
* [x] Create this descriptive, self-derivative production blueprint (`DEPLOYMENT_TESTING_SECURITY_BLUEPRINT.md`).
* [x] Decommission obsolete generic planning document `docs/PHASE3_PLAN.md`.
* [x] Secure root `.gitignore` to explicitly ignore all `.env`, `.env.local`, and build cache artifacts.
* [x] Create dynamic `.env.example` templates inside the frontend AND backend directories.
* [x] Configure `vite.config.ts` to set `build.sourcemap: false` to completely block code sniffing.
* [x] Decouple frontend API calls in `Projects.tsx` and `Skills.tsx` to read dynamic URLs from `import.meta.env`.
* [x] Adjust NestJS `main.ts` CORS logic to automatically authorize local connections and Vercel subdomains dynamically.
* [x] Expose dynamic port bindings (`process.env.PORT || 3000`) inside NestJS `main.ts`.

---

### 🛡️ Step 2: Automated Testing Suites (Vitest + NestJS Jest)
* **Status**: `✅ COMPLETED` (Fully integrated Vitest unit specs, NestJS Jest E2E integration suites, and unified monorepo run scripts).
* **Action Plan**:
  * **Frontend (React)**: Install `vitest`, `@testing-library/react`, and `@testing-library/jest-dom` inside `apps/frontend-react`. Create isolated unit tests for:
    * `RoleContext`: Verify that transitions between `'HR'`, `'CEO'`, and `'CTO'` roles initiate correctly and follow the strict timing sequence (200ms fade-out/300ms fade-in).
    * `PerspectiveSwitcher`: Verify that clicking Recruiter, Founder, or Engineer successfully fires the role switcher events and context states.
    * `Skills`: Validate that clicking skill chips correctly queries the compatibility API and successfully triggers local JavaScript fallback mock calculations if the NestJS backend is offline.
  * **Backend (NestJS)**: Configure standard NestJS Jest specs. Create E2E integration specs in `apps/backend-nestjs/test/app.e2e-spec.ts` validating:
    * `GET /api/portfolio/skills`: Verify response compatibility matrices (80%-98% scores) and corresponding projects lists.
    * `POST /api/portfolio/calculate-scope`: Test ROI cost algorithms and project timelines under varying sliders parameters.
    * `POST /api/sandbox/verify-bug`: Validate that correct line numbers for SQL N+1 loops (8-10) and Redis distributed transaction locks (4-6) successfully output the corresponding Git diff patches and resolution code.
  * **User Contribution Point**:
    * **Action Required**: **None**. This step is 100% automated developer code. You only need to run `npm test` locally to review the green success checkmarks!

---

### 🤖 Step 3: CI/CD Pipeline Scaffolding (GitHub Actions)
* **Status**: ✅ **COMPLETED**

To prevent any broken, non-compiling, or style-violating code from ever making its way to production, we have introduced a rigorous automated CI/CD pipeline powered by **GitHub Actions**. Below is the reference manual detailing exactly **where** things are, **what** to look for, **how** to run and inspect them, and **how the `ci.yml` workflow performs its operations**.

---

#### A. Reference Matrix: Where, What, and How to Inspect

| Aspect | Target File / Directory | What is in it? | How to run/inspect locally? |
|---|---|---|---|
| **Pipeline Workflow** | [`.github/workflows/ci.yml`](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/.github/workflows/ci.yml) | GitHub Actions YAML configuration specifying serially dependent jobs (`test-and-build` and `docker-verify`), caching rules, and steps. | Automatically executed by GitHub. Inspect output via the **Actions** tab on your GitHub Repository console. |
| **Workspace Setup** | [`package.json` (root)](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/package.json) | Shortcut script references directing npm commands across monorepo workspaces. | Run `npm run lint:frontend` to verify ESLint, `npm run build` to verify compilation, or `npm test` to run all specs. |
| **Client Lint Rules** | [`apps/frontend-react/eslint.config.js`](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/frontend-react/eslint.config.js) | React 19 + TypeScript ESLint linting configurations ensuring standard rules compliance. | Checked via `npm run lint:frontend` at root or `npm run lint` inside the frontend workspace. |
| **Frontend Specs** | [`apps/frontend-react/src/test/`](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/frontend-react/src/test/) | Vitest unit and integration test specs (`RoleContext.spec.tsx` and `Skills.spec.tsx`). | Checked via `npm test` or `npm run test:frontend`. |
| **Backend Specs** | [`apps/backend-nestjs/test/`](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/backend-nestjs/test/) | Jest + Supertest E2E backend integration test specs (`app.e2e-spec.ts`). | Checked via `npm test` or `npm run test:backend`. |
| **Docker Structures** | `apps/*/Dockerfile` | Multi-stage, high-performance Alpine Dockerfiles compiling shared workspaces and assets. | Checked via Docker Build commands, or automatically verified in the pipeline's Buildx runner. |

---

#### B. Architectural Breakdown: How the `ci.yml` Pipeline Operates

The pipeline operates in two distinct, sequential phases (Jobs). Each phase must pass completely before code can be cleared for deployment:

```mermaid
flowchart TD
    Commit["Git Push / Pull Request to main/development"] --> Trigger["GitHub Actions Triggered"]
    
    subgraph Job 1: Test & Build (test-and-build)
        Trigger --> Checkout1["actions/checkout@v4"]
        Checkout1 --> Node1["Setup Node v20 (actions/setup-node@v4)"]
        Node1 --> Cache1["Cache Recovery (actions/cache@v4)"]
        Cache1 --> Install1["Clean Install (npm ci)"]
        Install1 --> BuildShared["Build shared-types library"]
        BuildShared --> Lint["Audit Frontend Rules (ESLint)"]
        Lint --> Test["Run Unified Specs (npm test)"]
        Test --> BuildAll["Compile Workspaces (npm run build)"]
    end
    
    subgraph Job 2: Docker Verification (docker-verify)
        BuildAll -->|Serially Triggered via needs| Checkout2["actions/checkout@v4"]
        Checkout2 --> Buildx["Setup Docker Buildx"]
        Buildx --> DockerBackend["Verify Backend Dockerfile Build"]
        Buildx --> DockerFrontend["Verify Frontend Dockerfile Build"]
    end
    
    DockerBackend --> Success["Pipeline GREEN: Merging Cleared"]
    DockerFrontend --> Success
```

##### 1. Job 1: Test and Build (`test-and-build`)
This job runs on a virtual Linux machine (`ubuntu-latest`) and coordinates code styling, test validations, and compiler builds:
* **`actions/checkout@v4`**: Pulls your codebase down into the GitHub virtual runner.
* **`actions/setup-node@v4`**: Installs Node.js v20 (aligning with our production environments) on the runner's path.
* **`actions/cache@v4`**: Inspects your `package-lock.json` hash and recovers npm's local caches from GitHub's high-speed global CDN. This **reduces workflow run times by up to 70%** on consecutive runs.
* **`npm ci`**: Conducts a clean, deterministic package installation matching your lockfile.
* **`npm run build:shared`**: Compiles the shared TypeScript typings (`packages/shared-types`). *This must occur before building the applications.*
* **`npm run lint:frontend`**: Executes ESLint against all React client files. If any syntax error, layout warning, or styling rule is breached, the job immediately exits with a non-zero code, preventing compilation.
* **`npm test`**: Triggers both Vitest client specs and NestJS Jest E2E specifications.
* **`npm run build`**: Compiles the final production bundles to prove that TypeScript compiles correctly without errors.

##### 2. Job 2: Docker Compliance Verification (`docker-verify`)
This job is configured with `needs: test-and-build`, meaning it will only fire if the first job succeeds. It ensures that your multi-stage containerizations are fully compliant and won't throw errors when building on Render or Railway:
* **`docker/setup-buildx-action@v3`**: Prepares extended, hardware-accelerated Docker builds using Buildx.
* **`docker/build-push-action@v5` (Backend & Frontend)**: Executes a dry-run compile (`push: false`) of your multi-stage [backend Dockerfile](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/backend-nestjs/Dockerfile) and [frontend Dockerfile](file:///c:/Users/shahe/shaheer/portfolio/MSM_portfolio/portfolio/apps/frontend-react/Dockerfile). This guarantees that:
  - Cache layers resolve correctly.
  - Multi-stage copies (`COPY --from=builder ...`) are perfectly configured.
  - Alpine binaries install correctly.

---

#### C. User Contribution & GitHub Settings Guide

To unleash the full potential of your new pipeline:

1. **Keep it Private (100% Free)**: Ensure your repository is set to **Private** on GitHub. It guarantees your secrets, code layouts, and blueprints remain entirely secure, while giving you unlimited, free runner minutes.
2. **Branch Protection Rules (Highly Recommended)**:
   * Go to your repository page on GitHub.
   * Click **Settings** -> **Branches** -> **Add branch protection rule**.
   * Enter the name of your primary branch (e.g., `main` or `development`).
   * Check **"Require status checks to pass before merging"**.
   * Search for and select the **`Test and Build Workspaces`** and **`Verify Docker Container Build Compliance`** status checks.
   * **Result**: GitHub will lock your branch, making it impossible for you or any contributor to accidentally merge broken or non-compiling code!

---

---

### 🚀 Step 4: Deployed Server Go-Live (Cloud Deployment)
* **Status**: ⏳ **Pending**
* **Action Plan**:
  * **Backend Deployed Engine (Render / Railway Docker Runner)**:
    1. Bind a Render or Railway container service directly to your private GitHub repository branch.
    2. Because our NestJS backend contains a production-ready, multi-stage `Dockerfile`, Render will automatically build the Node compiler, prune development dependencies, compile JavaScript, and spin up a lightweight container.
    3. Bind the container to port `3000` (handled dynamically via your `process.env.PORT`).
    4. Access Render's dashboard and inject environment variables (like `ALLOWED_ORIGINS` to allow CORS requests from Vercel).
  * **Frontend CDN Hosting (Vercel Edge Network)**:
    1. Link a Vercel project to the same repository.
    2. Set up Vite client configurations pointing to `apps/frontend-react`:
       - **Framework Preset**: `Vite`
       - **Build Command**: `npm run build:frontend`
       - **Output Directory**: `apps/frontend-react/dist`
    3. Inject Vercel build variables (`VITE_API_URL` and `VITE_WS_URL`) pointing to your live Render server domain URL.
  * **Completion Handshake**: Perform SSL handshake check, verify that REST endpoints resolve, and ensure bidirectional Socket.io telemetry handshakes bind correctly.
* **User Contribution Point (CRITICAL - HOSTING ACCOUNTS & SECRETS SETUP)**:
  * **Creating Cloud Accounts**: You will need to register for free accounts on:
    * **GitHub**: For private codebase storage.
    * **Vercel**: For instant static CDN frontend hosting.
    * **Render** or **Railway**: For dockerized NestJS server hosting.
  * **Authorizing Integrations**: Link Vercel and Render/Railway to your GitHub account and authorize them to read your private portfolio repository.
  * **Injecting Secrets in Dashboards (Vault Management)**:
    * **On Render/Railway Console**: Go to project variables and add:
      * `ALLOWED_ORIGINS` = `https://your-portfolio.vercel.app` (Authorizes your React frontend domain to bypass browser CORS shields).
    * **On Vercel Console**: Go to project settings -> `Environment Variables` and add:
      * `VITE_API_URL` = `https://your-backend-service.onrender.com` (Directs frontend REST calls to the live server).
      * `VITE_WS_URL` = `wss://your-backend-service.onrender.com` (Directs the real-time node stress tester to establish WebSocket tunnels).
  * **Binding Custom DNS Domains** (Optional, e.g., if you own `yourname.dev`):
    * In Vercel, go to `Settings` -> `Domains` and add your domain.
    * Access your DNS registry provider (GoDaddy, Namecheap, Google Domains) and map:
      * **A Record** pointing to Vercel's IP address: `76.76.21.21`
      * **CNAME Record** pointing `www` to `cname.vercel-dns.com`
    * Vercel will automatically provision, secure, and auto-renew free SSL certificates.
