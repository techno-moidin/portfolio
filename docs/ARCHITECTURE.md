# Portfolio Architecture Master Plan

## 1. Directory & Stack Strategy
This is a Full-Stack Monorepo using npm/yarn workspaces.
- Root: Shared configuration, blueprints, and orchestrations.
- `apps/frontend-react`: ReactJS Vite application (UI, State, Animations from Stitch).
- `apps/backend-nestjs`: NestJS service (API, Socket.io server, processing sandbox).
- `packages/shared-types`: Unified TypeScript interfaces to ensure strict type safety between React and NestJS.

## 2. Shared Data Structure (`packages/shared-types/index.ts`)
```typescript
export type UserRole = 'HR' | 'CEO' | 'CTO';

export interface RoleContent {
  headline: string;
  subheading: string;
  focusMetrics: string[];
  activeFeatures: string[];
}

export interface TelemetryMetrics {
  cpuUsage: number;
  memoryUsage: number;
  apiLatencyMs: number;
  activeConnections: number;
}