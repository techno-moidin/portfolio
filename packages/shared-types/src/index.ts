// Shared Type Contracts for Full-Stack Monorepo

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

export interface ScopeCalculateDto {
  complexity: 'Low' | 'Medium' | 'High';
  timelineMonths: number;
  requiredScale: 'Small' | 'Medium' | 'High';
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  details: string;
  status: 'pending' | 'active' | 'completed';
}

export interface ScopeCalculateResult {
  roadmap: RoadmapPhase[];
  roiSummary: string;
  totalCostEstimate: string;
  speedToMarketScore: number;
}

export interface VerifyBugDto {
  bugId: string;
  selectedLineNumbers: number[];
}

export interface VerifyBugResult {
  success: boolean;
  message: string;
  diffText?: string;
  optimizedCode?: string;
}

// ── Traffic Analytics Types ─────────────────────────────────────────────────

export interface TrackPayload {
  deviceId: string;
  userAgent: string;
  referrer?: string;
}

export interface VisitorRecord {
  deviceId: string;
  ip: string;
  userAgent: string;
  country: string;
  region: string;
  city: string;
  isp: string; // Network Name
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
}

export interface TrafficStats {
  totalViews: number;
  uniqueViewers: number;
  returningViewers: number;
  visitors: VisitorRecord[];
}

