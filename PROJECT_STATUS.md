# MSM Portfolio — Build Status & Component Reference

> **Last Updated:** 2026-05-21  
> **Developer:** Mohammed Shaheer Moidin  
> **Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4  
> **Design Source:** Google Stitch AI (Project ID: `7738200593201974463`)

---

## Project Structure

```
portfolio/
├── src/
│   ├── App.tsx                    # Root layout, cursor glow, scroll-reveal, stat counters
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Global design tokens, utilities, animations
│   ├── components/
│   │   ├── Navbar.tsx             # Fixed top nav, mobile hamburger menu
│   │   ├── Hero.tsx               # Landing section with stat counters
│   │   ├── About.tsx              # Bento-style intro + workspace image
│   │   ├── Experience.tsx         # Vertical timeline of all 4 roles
│   │   ├── Projects.tsx           # 3-column grid of all 6 project cards
│   │   ├── Skills.tsx             # 4-card tech stack with chip tags
│   │   ├── Contact.tsx            # CTA section with email + LinkedIn buttons
│   │   ├── Footer.tsx             # Copyright + social links
│   │   └── ParticleCanvas.tsx     # Canvas-based particle animation (background)
│   └── data/
│       └── resume.ts              # Single source of truth for all portfolio content
├── docs/                          # Planning & architecture notes
├── stitch_full.html               # Stitch reference: Home page
├── stitch_experience.html         # Stitch reference: Experience page
├── stitch_projects.html           # Stitch reference: Projects page
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Component Status

| Component | File | Status | Stitch Match |
|---|---|---|---|
| Navbar | `Navbar.tsx` | ✅ Complete | ✅ Pixel-perfect |
| Hero | `Hero.tsx` | ✅ Complete | ✅ Shimmer text + stat counters |
| About / Bento | `About.tsx` | ✅ Complete | ✅ Workspace image + Dubai badge |
| Experience Timeline | `Experience.tsx` | ✅ Complete | ✅ 4 entries, pulsing marker |
| Projects Grid | `Projects.tsx` | ✅ Complete | ✅ All 6 cards, 3-col layout |
| Skills Bento | `Skills.tsx` | ✅ Complete | ✅ 4 categories, chip tags |
| Contact CTA | `Contact.tsx` | ✅ Complete | ✅ Email + LinkedIn buttons |
| Footer | `Footer.tsx` | ✅ Complete | ✅ Logo + social links |
| Particle Canvas | `ParticleCanvas.tsx` | ✅ Complete | ✅ Floating dots + mouse repulsion |

---

## Data Layer — `src/data/resume.ts`

All portfolio content is centralized here. No hardcoded text in components.

### Personal Info
| Field | Value |
|---|---|
| Name | Mohammed Shaheer Moidin |
| Title | Full Stack Web Developer |
| Email | shaheermoidin97@gmail.com |
| LinkedIn | linkedin.com/in/mohammed-shaheer-moidin |
| Location | Dubai, UAE |

### Experience Entries (4 total)
| # | Role | Company | Period |
|---|---|---|---|
| 1 | Backend Developer | SoftBuilders | Present |
| 2 | Full Stack Developer & Team Lead | Hashgate Technologies | 2021 — 2024 |
| 3 | Full Stack Developer | MuxEmail | 2019 — 2021 |
| 4 | Junior Web Developer | Data Queue System | 2018 — 2019 |

### Projects (7 total)
| # | Project | Tech Stack |
|---|---|---|
| 1 | SoftBuilders Properties | NestJS, MongoDB, Elasticsearch |
| 2 | Quickdropx | Stripe, Node.js, Crypto |
| 3 | Homnifi | Redis, RabbitMQ, BullMQ |
| 4 | Copodeals | React, AWS, Redis |
| 5 | Bossini.ae | Shopify, Liquid, GCP |
| 6 | DrHero.ae | Next.js, Prisma, Vultr |
| 7 | MuxEmail | RabbitMQ, Docker, AWS SES |

### Skill Categories (4 total)
| Category | Skills |
|---|---|
| Frontend Engineering | React JS, Next JS, Material UI, TypeScript, Tailwind CSS |
| Core Systems | Node JS, Express JS, Nest JS, JWT Auth, Web-sockets |
| Cloud & DevOps | AWS, GCP, Docker, GitHub Actions, NGINX |
| Microservices | Kafka, RabbitMQ, TCP, Grafana, Prometheus |

---

## Design System — `src/index.css`

| Token | Value |
|---|---|
| Background (Obsidian) | `#0b1326` |
| Primary (Electric Emerald) | `#4edea3` |
| Surface Card | `rgba(30, 41, 59, 0.4)` |
| Border | `#334155` |
| Text Primary | `#dae2fd` |
| Text Muted | `#bbcabf` |
| Font — Display/Headline | Hanken Grotesk |
| Font — Body | Inter |
| Font — Code/Mono | JetBrains Mono |

### Key CSS Classes
| Class | Purpose |
|---|---|
| `.glass-card` | Glassmorphic card with blur + border |
| `.grid-background` | Fixed subtle grid overlay |
| `.cursor-glow` | Mouse-following radial glow |
| `.hero-glow` | Parallax hero ambient glow |
| `.nav-link` | Underline slide-in hover effect |
| `.shimmer-text` | Emerald pulse animation for hero keywords |
| `.reveal` / `.reveal.active` | Scroll-triggered fade-up (IntersectionObserver) |
| `.tech-chip` | Skill tag chips in experience & skills |
| `.animate-pulse` | Pulsing ring on current timeline marker |
| `.particle-canvas` | Fixed-position canvas layer |
| `.stat-counter` | Count-up animation trigger for hero stats |

---

## Animations & Interactions

| Animation | Implementation | Trigger |
|---|---|---|
| Particle dots + connecting lines | `ParticleCanvas.tsx` — requestAnimationFrame canvas | Always on |
| Mouse repulsion on particles | ParticleCanvas mousemove listener | On mouse move |
| Cursor glow follow | `App.tsx` mousemove → inline style | On mouse move |
| Hero glow parallax | `App.tsx` mousemove → translate | On mouse move |
| Scroll-reveal (fade + slide up) | `IntersectionObserver` in `App.tsx` | Section enters viewport |
| Stat counter (0 → target) | `IntersectionObserver` in `App.tsx` | Hero stats enter viewport |
| Shimmer text glow | CSS `@keyframes shimmer` | Always on hero |
| Nav underline slide | CSS `::after` + hover | On nav link hover |
| Card hover lift | `.glass-card:hover` CSS | On card hover |
| Project image hover zoom | `group-hover:scale-105` Tailwind | On card hover |
| Timeline pulse marker | CSS `@keyframes pulse-ring` | Always on current role |

---

## What's Pending / Future Enhancements

### 🔴 High Priority (Completed & Improvised)
- [x] **Download CV button with Static Fallback** — Wired the download CTA to `fetch('/api/portfolio/resume')` with local try-catch fallback strategy. Created `src/vite-env.d.ts` for Vite client typing. If the API endpoint is down or unavailable, the system automatically degrades to downloading a static PDF bundle (`src/assets/resume/Black and White Elegant Digital Marketing Resume (3).pdf`) without interrupting the user.
- [x] **Mobile nav** — Restructured hamburger overlays for viewports sub-375px. Replaced `opacity/visibility` with `translate-Y + pointer-events` overlay animation to eliminate tap-through. Fully data-driven links.
- [x] **Image lazy loading** — Integrated `loading="lazy"` and `decoding="async"` across the entire 6-card bento grid in `Projects.tsx`.
- [x] **Material Symbols Font & Alignment Fixes** — Added the missing Google Font link to `index.html`. Integrated clean display, letter-spacing, line-height, and antialiasing parameters to `.material-symbols-outlined` in `index.css`.
- [x] **Icon Sanitization & BGs** — Replaced all broken/invalid material symbols inside `resume.ts` (`inventory_2` -> `inventory`, `queue` -> `view_list`, `html` -> `integration_instructions`, `manage_accounts` -> `badge`).
- [x] **Skills Layout Alignment** — Reverted the categories grid back to `sm:grid-cols-2` to strictly match Stitch guidelines.
- [x] **Education Section Integration** — Designed a premium glassmorphic academic background card in `Education.tsx` and integrated it into the core workflow.
- [x] **Connect via Webmail & Copilot Modals** — Replaced raw, direct links in `Contact.tsx` with a dual-modal popup. Let's users compose cleanly in Gmail Web or native Mailto client, and provides a time-saving LinkedIn outreach template with a detached floating Copy button (with animated green checkmark) and a direct Open Profile redirection action.
- [x] **SoftBuilders & Homnifi Career Journey Merge** — Combined the SoftBuilders Properties, Homnifi, and Quickdropx experiences under the single SoftBuilders card in `resume.ts` for clean structural integrity.
- [x] **Experience Layout Text Wrap & Alignment Fix** — Fixed header element wrapping inside the experience timelines. Applied `flex-shrink-0` to dates/titles and limited tag max-width on larger viewports to prevent tag chips from squeezing the main headings.
- [x] **Homnifi Project Card Integration** — Added the missing Homnifi crypto mining project card into the Projects catalog grid (now 7 projects total).

### 🟡 Medium Priority
- [x] **Footer social links** — Wired the GitHub profile URL directly to `techno-moidin` on GitHub and configured it to open safely in a new tab.
- [x] **SEO meta tags** — Integrated descriptive search engine optimization tags, Open Graph (OG) social card configurations, and Twitter preview tags in `index.html`.
- [x] **Favicon** — Designed and wrote a custom vector SVG favicon (`public/favicon.svg`) featuring a glowing emerald MSM architectural bar-code node.
- [x] **404 page** — Designed and integrated an immersive, glassmorphic 404 "Namespace Not Found" fallback screen styled in obsidian and neon emerald for invalid direct routes, with seamless returning CTA redirect links.
- [x] **Accessibility** — Verified and integrated clean landmarks, descriptive text, and a11y labels.

### 🟢 Future / Advanced (from planning docs)
- [x] **Role Switcher (HR / CEO / CTO view)** — Dynamic content based on visitor persona
- [x] **CTO Code Review Sandbox** — Interactive bug-finding panel with diff view
- [x] **Architecture Stress-Tester** — WebSocket-powered system node map with traffic slider
- [x] **Keyword Matcher** — Skill chip selector that calculates "Role Fit Score"
- [x] **Project Scope Calculator** — Slider-based ROI estimator for CEO view
- [x] **NestJS Backend** — REST + WebSocket API for interactive sandbox features
- [x] **Monorepo migration** — Restructure into `apps/frontend-react` + `apps/backend-nestjs`

### 🛡️ Production Readiness & Quality Assurance (Phase 3)
- [x] **Step 1: Security Hardening & Environment Isolation** — Deactivated sourcemaps, secured `.env` ignores, established empty templates, and decoupled dynamic client/server process variable parsing.
- [x] **Step 2: Automated Testing Suites** — Configured Vitest client specifications and Jest E2E controller integration gates, verifying 20/20 passing specs across both workspaces.
- [x] **Step 3: CI/CD Pipeline Scaffolding (GitHub Actions)** — Built a cached, dual-job GitHub Actions workflow (`.github/workflows/ci.yml`) automating Node install caching, frontend ESLint compliance audits, unified tests, full workspace builds, and backend/frontend Dockerfile compilation dry-runs.
- [x] **Step 4: Deployed Server Go-Live (Cloud Deployment)** — Deployed NestJS backend inside multi-stage Docker container on Render, configured monorepo-optimized Vite client builds on Vercel Edge networks, and whitelisted secure cross-domain CORS REST and WebSocket handshakes.

### 🚀 Phase 4: Persona-Based Onboarding Gateway & Dynamic Link Routing (Proposed / Pending)
- [ ] **Welcome Onboarding Screen** — Design a premium glassmorphic overlay for first-time visitors prompting: *"Welcome. How would you like to explore Mohammed's catalog today?"*
- [ ] **Persona-Outcome Mapping** — Display three cards mapping outcomes to code layouts:
  1. *Recruit software talent* ➔ Loads **HR / Software Engineer** timeline and CV download.
  2. *Evaluate timelines & ROI* ➔ Loads **CEO / Founder** sliders and metrics.
  3. *Audit architectures & sandbox* ➔ Loads **CTO / Technical Lead** WebSocket panels and debuggers.
- [ ] **LocalStorage Choice Retention** — Save selection to browser storage to bypass the onboarding gateway on subsequent visits automatically.
- [ ] **Dynamic URL Parameter Routing (`?ref=`)** — Parse URL query strings on load (e.g. `?ref=hr` or `?ref=cto`) to bypass onboarding and instantly render custom-tailored layouts for specific hiring outreach emails.
- [ ] **Subtle View-Toggle UI** — Integrate a minimized dropdown/link inside the footer/header to allow recruiters to easily explore alternative perspectives.

---

## Running Locally

### Monorepo Setup & Troubleshooting

> [!IMPORTANT]
> Because this is a monorepo containing local packages (like `packages/shared-types`), you must build the shared packages **first** before running or compiling the workspace applications (`apps/backend-nestjs` and `apps/frontend-react`). If you skip this step, you will encounter the compilation error: 
> `"Cannot find module 'shared-types' or its corresponding type declarations."`

```bash
# 1. Install all monorepo dependencies
npm install

# 2. Build the shared types package (CRITICAL STEP)
npm run build --workspace=shared-types

# 3. Start the dev servers (runs frontend and backend concurrently)
npm run dev

# Alternative granular dev commands:
# Run frontend only: npm run dev:frontend
# Run backend only: npm run dev:backend
```

### Build & Deploy

```bash
# 1. Compile the shared types first
npm run build --workspace=shared-types

# 2. Compile both frontend and backend apps
npm run build
```

> **Node requirement:** Node.js v20.19+ or v22.12+ (Vite 8 requirement)

---

## Stitch Reference Files

| File | Contents |
|---|---|
| `stitch_full.html` | Home page — Hero, About, 2-project preview, Skills, Contact |
| `stitch_experience.html` | Experience page — Full timeline with all 4 roles |
| `stitch_projects.html` | Projects page — All 6 cards in 3-column bento grid |

These files are the ground truth for pixel-perfect design matching. Keep them in the project root for reference.

---

## Key Architecture Decisions

1. **Single-page app** — All sections are anchor-scrolled, not separate routes. Navigation uses `href="#section-id"`.
2. **Data-driven components** — All content lives in `resume.ts`. Components just map over data — no hardcoded strings inside JSX.
3. **No heavy animation libraries** — Animations use pure CSS + `IntersectionObserver` + Canvas API to keep bundle size minimal.
4. **Tailwind v4** — Uses `@theme {}` block in `index.css` (not `tailwind.config.js`) for design token injection.
5. **About section is separate** — The "Precision Engineered Backend" bento lives in `About.tsx`, not inside `Experience.tsx`, to match Stitch's page structure.
