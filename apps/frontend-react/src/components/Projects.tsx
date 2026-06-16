import { useState, useEffect, useCallback } from 'react';
import { RESUME_DATA } from '../data/resume';
import { useRole } from '../utils/RoleContext';
import { logEvent } from './FloatingConsole';
import { io, Socket } from 'socket.io-client';
import { 
  BarChart2, Cpu, HardDrive, Network, 
  Activity, Sliders, RefreshCw, Calendar, 
  DollarSign, Zap, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import type { ScopeCalculateDto, ScopeCalculateResult, TelemetryMetrics } from 'shared-types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// Dynamic protocol resolver mapping secure https edge connections to wss tunnels
const getWsUrl = (url: string) => {
  if (url.startsWith('https://')) return url.replace('https://', 'wss://');
  if (url.startsWith('http://')) return url.replace('http://', 'ws://');
  return 'ws://localhost:3000';
};
const WS_URL = import.meta.env.VITE_WS_URL || getWsUrl(API_URL);

// =========================================================================
// Component 1: Isolated Scope & ROI Calculator (CEO View)
// =========================================================================
function ScopeCalculator() {
  const [complexity, setComplexity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [timeline, setTimeline] = useState<number>(4);
  const [scale, setScale] = useState<'Small' | 'Medium' | 'High'>('Medium');
  const [calcLoading, setCalcLoading] = useState<boolean>(false);
  const [calcResult, setCalcResult] = useState<ScopeCalculateResult | null>(null);

  const calculateScope = useCallback(async () => {
    setCalcLoading(true);
    setCalcResult(null);
    const apiPath = '/api/portfolio/calculate-scope';
    logEvent('API', `POST ${apiPath} - Calculating project roadmap...`);

    const payload: ScopeCalculateDto = {
      complexity,
      timelineMonths: timeline,
      requiredScale: scale
    };

    try {
      const response = await fetch(`${API_URL}${apiPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Calculation failed');
      const data = await response.json();
      
      setCalcResult(data);
      logEvent('API', `POST ${apiPath} - 200 OK (Calculated project cost: ${data.totalCostEstimate})`);
    } catch (err) {
      console.warn('Backend offline, running local scope generator:', err);
      logEvent('LIFECYCLE', 'Backend offline. Running offline ROI calculator fallback...');
      
      // Local fallback simulation
      setTimeout(() => {
        let baseCost = 8000;
        let speedScore = 90;
        if (complexity === 'High') { baseCost += 8000; speedScore -= 15; }
        else if (complexity === 'Medium') { baseCost += 4000; speedScore -= 5; }
        if (scale === 'High') { baseCost += 5000; speedScore -= 10; }
        else if (scale === 'Medium') { baseCost += 2000; speedScore -= 3; }
        if (timeline < 3) { baseCost += 3000; speedScore += 5; }

        const localResult: ScopeCalculateResult = {
          roadmap: [
            { phase: 'Phase 1: Architecture Blueprinting', duration: '1 Month', details: 'Setup NestJS modules, outline PostgreSQL migrations and cache limits.', status: 'completed' },
            { phase: 'Phase 2: Fullstack Feature Development', duration: '2 Months', details: `Build frontend assets, establish WS socket tunnels at ${scale} Scale.`, status: 'active' },
            { phase: 'Phase 3: Integration & Stress Testing', duration: '1 Month', details: 'Spin up cluster nodes and conduct heavy performance load audits.', status: 'pending' }
          ],
          roiSummary: 'Hiring Mohammed provides pre-built fullstack templates and robust cloud-native architecture experience, slashing infrastructure cost up to 35%.',
          totalCostEstimate: `$${baseCost.toLocaleString()}`,
          speedToMarketScore: speedScore
        };

        setCalcResult(localResult);
        logEvent('API', `POST ${apiPath} - 200 OK (Local Fallback - Computed cost: ${localResult.totalCostEstimate})`);
      }, 500);
    } finally {
      setCalcLoading(false);
    }
  }, [complexity, timeline, scale]);

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateScope();
    }, 0);
    return () => clearTimeout(timer);
  }, [calculateScope]);

  return (
    <div className="glass-card p-6 border border-primary/30 rounded-xl mb-12 shadow-xl bg-surface-container-lowest/50 relative overflow-hidden">
      <h3 className="font-bold text-xs uppercase tracking-wider text-primary mb-6 flex items-center gap-2 border-b border-outline-variant pb-3">
        <Sliders size={14} /> Dynamic Scope & ROI Calculator
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Sliders Input */}
        <div className="lg:col-span-1 flex flex-col gap-5 bg-black/35 p-5 border border-outline-variant/60 rounded-lg">
          
          {/* Timeline */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-on-surface-variant">
              <span>LAUNCH TIMELINE:</span>
              <span className="text-primary">{timeline} Months</span>
            </div>
            <input
              type="range" min="1" max="12" value={timeline}
              onChange={(e) => setTimeline(parseInt(e.target.value))}
              className="accent-primary w-full h-1 bg-surface-container-high rounded-lg cursor-pointer"
            />
          </div>

          {/* Complexity */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant">ARCHITECTURAL COMPLEXITY:</label>
            <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setComplexity(c as 'Low' | 'Medium' | 'High')}
                  className={`py-1.5 text-[10px] font-bold rounded uppercase transition-colors ${complexity === c ? 'bg-primary text-background' : 'bg-surface-container-high text-on-surface'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Required Scale */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant">TRAFFIC SCALE REQUIREMENTS:</label>
            <div className="grid grid-cols-3 gap-2">
              {['Small', 'Medium', 'High'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScale(s as 'Small' | 'Medium' | 'High')}
                  className={`py-1.5 text-[10px] font-bold rounded uppercase transition-colors ${scale === s ? 'bg-primary text-background' : 'bg-surface-container-high text-on-surface'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Outputs Summary & Gantt Roadmap */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {calcLoading ? (
            <div className="flex items-center justify-center py-20 gap-2 font-mono text-xs text-on-surface-variant">
              <RefreshCw className="animate-spin text-primary" size={16} />
              Calculating target ROI roadmaps...
            </div>
          ) : calcResult ? (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                
                <div className="bg-black/40 border border-primary/20 p-4 rounded-xl flex flex-col items-center">
                  <DollarSign size={16} className="text-primary mb-1" />
                  <span className="text-lg font-bold text-primary">{calcResult.totalCostEstimate}</span>
                  <span className="text-[9px] font-label-caps text-on-surface-variant mt-1">Cost Projection</span>
                </div>

                <div className="bg-black/40 border border-primary/20 p-4 rounded-xl flex flex-col items-center">
                  <Zap size={16} className="text-primary mb-1" />
                  <span className="text-lg font-bold text-primary">{calcResult.speedToMarketScore}%</span>
                  <span className="text-[9px] font-label-caps text-on-surface-variant mt-1">Market Velocity</span>
                </div>

                <div className="bg-black/40 border border-primary/20 p-4 rounded-xl flex flex-col items-center">
                  <ShieldCheck size={16} className="text-emerald-400 mb-1" />
                  <span className="text-lg font-bold text-emerald-400">OPTIMIZED</span>
                  <span className="text-[9px] font-label-caps text-on-surface-variant mt-1">Resource Grade</span>
                </div>

              </div>

              {/* Gantt List */}
              <div className="flex flex-col bg-black/40 border border-outline-variant/60 rounded-xl overflow-hidden">
                <div className="bg-surface-container-high px-4 py-2 border-b border-outline-variant/40 font-mono text-[9px] uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  <Calendar size={11} /> Accelerated Lifecycle Gantt Roadmap
                </div>
                <div className="p-4 flex flex-col gap-4">
                  {calcResult.roadmap.map((phase, idx) => (
                    <div key={idx} className="flex items-start gap-4 text-xs">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${phase.status === 'completed' ? 'bg-primary' : phase.status === 'active' ? 'bg-sky-400 animate-pulse' : 'bg-surface-container-high'}`} />
                      <div className="flex-grow">
                        <div className="flex justify-between font-semibold">
                          <span className="text-on-surface">{phase.phase}</span>
                          <span className="text-primary shrink-0">{phase.duration}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant mt-1">{phase.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant italic leading-relaxed border-l-2 border-primary/40 pl-3">
                {calcResult.roiSummary}
              </p>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}

// =========================================================================
// Component 2: Isolated Telemetry & System Stress-Tester (CTO View)
// =========================================================================
function SystemStressTester() {
  const [traffic, setTraffic] = useState<number>(100);
  const [redisEnabled, setRedisEnabled] = useState<boolean>(false);
  const [workerNodes, setWorkerNodes] = useState<number>(1);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<TelemetryMetrics>({
    cpuUsage: 12,
    memoryUsage: 25,
    apiLatencyMs: 8,
    activeConnections: 1
  });
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    logEvent('WS', `Connecting to Telemetry WebSocket Gateway at ${WS_URL}...`);
    const newSocket = io(API_URL, {
      reconnectionAttempts: 3,
      timeout: 5000,
    });

    newSocket.on('connect', () => {
      setWsConnected(true);
      logEvent('WS', `Connected to telemetry gateway: ${WS_URL}`);
    });

    newSocket.on('connect_error', () => {
      setWsConnected(false);
      logEvent('WS', 'WS connection failed. Falling back to local telemetry simulation.');
    });

    newSocket.on('infraState', (state: { redisEnabled: boolean; workerNodes: number; traffic: number }) => {
      setRedisEnabled(state.redisEnabled);
      setWorkerNodes(state.workerNodes);
      setTraffic(state.traffic);
    });

    newSocket.on('telemetryMetrics', (data: TelemetryMetrics) => {
      setMetrics(data);
      logEvent('WS', `Frame received: CPU ${data.cpuUsage}% | Latency ${data.apiLatencyMs}ms`);
    });

    newSocket.on('disconnect', () => {
      setWsConnected(false);
      logEvent('WS', `Disconnected from ${WS_URL}.`);
    });

    setTimeout(() => {
      setSocket(newSocket);
    }, 0);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle local simulation when WS is offline (isolated loop protects main thread re-renders)
  useEffect(() => {
    if (wsConnected) return;

    // Run local metric simulation loop (1000ms rate)
    const interval = setInterval(() => {
      const trafficPercent = traffic / 50000;
      const baseCpu = 8 + (trafficPercent * 85);
      const cpuUsage = Math.min(99, Math.round((baseCpu / workerNodes) + (Math.random() * 4 - 2)));
      const memoryUsage = Math.min(95, Math.round(18 + (workerNodes * 6) + (trafficPercent * 15)));
      
      let baseLat = 12 + Math.pow(trafficPercent, 2) * 450;
      if (redisEnabled) baseLat *= 0.08;
      const apiLatencyMs = Math.max(1, Math.round(baseLat + (Math.random() * 6 - 3)));

      setMetrics({
        cpuUsage,
        memoryUsage,
        apiLatencyMs,
        activeConnections: 1
      });
      logEvent('WS', `Frame simulated: CPU ${cpuUsage}% | Latency ${apiLatencyMs}ms (Sandboxed Fallback)`);
    }, 1000);

    return () => clearInterval(interval);
  }, [wsConnected, traffic, redisEnabled, workerNodes]);

  const adjustTrafficLocal = (val: number) => {
    setTraffic(val);
    if (socket && wsConnected) {
      socket.emit('adjustTraffic', { traffic: val });
    }
  };

  const toggleRedisLocal = () => {
    const nextVal = !redisEnabled;
    setRedisEnabled(nextVal);
    if (socket && wsConnected) {
      socket.emit('toggleRedis');
    }
  };

  const provisionNodeLocal = () => {
    const nextNode = workerNodes < 8 ? workerNodes + 1 : 1;
    setWorkerNodes(nextNode);
    if (socket && wsConnected) {
      socket.emit('provisionNode');
    }
  };

  const resetTrafficLocal = () => {
    setTraffic(100);
    logEvent('LIFECYCLE', 'Restored ingress traffic baseline: 100 req/s');
    if (socket && wsConnected) {
      socket.emit('adjustTraffic', { traffic: 100 });
    }
  };

  const resetNodesLocal = () => {
    setWorkerNodes(1);
    logEvent('LIFECYCLE', 'Restored node cluster baseline: 1 Active Node');
    if (socket && wsConnected) {
      socket.emit('resetNodes');
    }
  };

  return (
    <div className="glass-card p-6 border border-sky-500/30 rounded-xl mb-12 shadow-xl bg-surface-container-lowest/50 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-outline-variant/40 pb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-sky-400 animate-pulse" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-sky-400">System Architecture Stress-Tester & Telemetry Panel</h3>
        </div>
        <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${wsConnected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
          {wsConnected ? '🟢 Live Socket Stream' : '🟡 Simulated Telemetry'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left Pane: Sliders and Toggles */}
        <div className="lg:col-span-1 flex flex-col gap-6 bg-black/45 p-5 border border-outline-variant/60 rounded-xl justify-between">
          
          {/* Traffic Volume Slider */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant font-mono">
              <span className="flex items-center gap-1.5 select-none">
                INGRESS TRAFFIC:
                <button
                  type="button"
                  onClick={resetTrafficLocal}
                  title="Reset Ingress Traffic to 100 req/s"
                  className="text-on-surface-variant/40 hover:text-sky-400 hover:scale-110 active:scale-95 transition-all p-0.5 rounded cursor-pointer flex items-center justify-center"
                >
                  <RefreshCw size={11} />
                </button>
              </span>
              <span className="text-sky-400">{traffic.toLocaleString()} req/s</span>
            </div>
            <input
              type="range" min="10" max="50000" step="50" value={traffic}
              onChange={(e) => adjustTrafficLocal(parseInt(e.target.value))}
              className="accent-sky-400 w-full h-1 bg-surface-container-high rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-on-surface-variant/40 font-mono">
              <span>10 req/s</span>
              <span>50k req/s</span>
            </div>
          </div>

          {/* DevOps Operations Buttons */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-on-surface-variant/60 font-mono uppercase tracking-wider">DevOps Operations</span>
            
            {/* Redis Toggle */}
            <button
              type="button"
              onClick={toggleRedisLocal}
              className={`w-full py-2.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                redisEnabled 
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-md shadow-emerald-500/10' 
                  : 'bg-surface-container-high border-outline-variant text-on-surface hover:bg-surface-container-high/80'
              }`}
            >
              {redisEnabled ? '⚡ Disable Redis Caching' : '🔌 Enable Redis Caching'}
            </button>

            {/* Provision Worker Node */}
            <button
              type="button"
              onClick={provisionNodeLocal}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-mono text-[10px] font-bold uppercase tracking-wider rounded transition-all duration-200 border border-sky-400"
            >
              🌐 Spin Up Cluster Node ({workerNodes} Active)
            </button>

            {/* Reset Nodes Button */}
            <button
              type="button"
              onClick={resetNodesLocal}
              className="w-full py-2 bg-transparent hover:bg-white/10 text-on-surface-variant hover:text-on-surface font-mono text-[10px] font-bold uppercase tracking-wider rounded transition-all duration-200 border border-outline-variant/60"
            >
              🔄 Reset Cluster Nodes
            </button>
          </div>

        </div>

        {/* Right Pane: SVG Node Graph and Real-Time Dashboard */}
        <div className="lg:col-span-2 flex flex-col gap-6 justify-between bg-black/25 p-5 border border-outline-variant/60 rounded-xl">
          
          {/* SVG Topology Nodes Map */}
          <div className="flex justify-between items-center gap-2 p-3 bg-black/40 border border-outline-variant/40 rounded-lg overflow-x-auto">
            
            <div className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline text-on-surface">
                <Zap size={16} />
              </div>
              <span className="font-mono text-[9px] text-on-surface-variant">Vite Client</span>
            </div>

            <span className="text-on-surface-variant/30 text-xs shrink-0 animate-pulse">➔</span>

            <div className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline text-on-surface relative">
                <Network size={16} />
              </div>
              <span className="font-mono text-[9px] text-on-surface-variant">NGINX Proxy</span>
            </div>

            <span className="text-on-surface-variant/30 text-xs shrink-0 animate-pulse">➔</span>

            {/* NestJS Node Clusters */}
            <div className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className="w-10 h-10 rounded-lg bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400 relative">
                <Cpu size={16} />
                <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-black text-[8px] font-bold px-1 rounded-full shrink-0">{workerNodes}</span>
              </div>
              <span className="font-mono text-[9px] text-sky-400 font-bold">NestJS app</span>
            </div>

            <span className="text-on-surface-variant/30 text-xs shrink-0 animate-pulse">➔</span>

            {/* Redis Cache */}
            <div className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${redisEnabled ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400' : 'bg-surface-container-high border border-outline text-on-surface/40'}`}>
                <HardDrive size={16} />
              </div>
              <span className={`font-mono text-[9px] ${redisEnabled ? 'text-emerald-400 font-bold' : 'text-on-surface-variant'}`}>Redis Cache</span>
            </div>

            <span className="text-on-surface-variant/30 text-xs shrink-0 animate-pulse">➔</span>

            {/* PostgreSQL Database */}
            <div className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${metrics.cpuUsage > 85 ? 'bg-rose-950 border-rose-500 text-rose-400 animate-bounce' : 'bg-surface-container-high border-outline text-on-surface'}`}>
                <BarChart2 size={16} />
              </div>
              <span className={`font-mono text-[9px] ${metrics.cpuUsage > 85 ? 'text-rose-400 font-bold animate-pulse' : 'text-on-surface-variant'}`}>PostgreSQL</span>
            </div>

          </div>

          {/* Dashboard Metrics progress bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            
            {/* CPU Usage */}
            <div className="flex flex-col bg-black/40 border border-outline-variant/40 p-4 rounded-lg">
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">CPU Load</span>
              <span className={`text-xl font-bold font-mono mt-1 ${metrics.cpuUsage > 85 ? 'text-rose-400 animate-pulse' : 'text-sky-400'}`}>{metrics.cpuUsage}%</span>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-2">
                <div className={`h-full rounded-full transition-all duration-500 ${metrics.cpuUsage > 85 ? 'bg-rose-500' : 'bg-sky-400'}`} style={{ width: `${metrics.cpuUsage}%` }} />
              </div>
            </div>

            {/* Memory Usage */}
            <div className="flex flex-col bg-black/40 border border-outline-variant/40 p-4 rounded-lg">
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">Memory Allocation</span>
              <span className="text-xl font-bold font-mono text-sky-400 mt-1">{metrics.memoryUsage}%</span>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-2">
                <div className="h-full rounded-full bg-sky-400 transition-all duration-500" style={{ width: `${metrics.memoryUsage}%` }} />
              </div>
            </div>

            {/* Latency */}
            <div className="flex flex-col bg-black/40 border border-outline-variant/40 p-4 rounded-lg">
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">API Latency</span>
              <span className={`text-xl font-bold font-mono mt-1 ${metrics.apiLatencyMs > 250 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>{metrics.apiLatencyMs}ms</span>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-2">
                <div className={`h-full rounded-full transition-all duration-500 ${metrics.apiLatencyMs > 250 ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ width: `${Math.min(100, (metrics.apiLatencyMs / 500) * 100)}%` }} />
              </div>
            </div>

          </div>

          {/* System alerts warning */}
          {metrics.cpuUsage > 85 && (
            <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-800/40 px-3 py-2 rounded-lg text-rose-400 text-xs font-semibold animate-pulse">
              <AlertTriangle size={14} />
              <span>PostgreSQL bottleneck! Scale NestJS workers or toggle Redis cache immediately to drop database strain.</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// =========================================================================
// Main Component: Projects Grid & Switcher Layer
// =========================================================================
export function Projects() {
  const { role } = useRole();
  const [highlightedProjectIds, setHighlightedProjectIds] = useState<string[]>([]);

  // ── Keyword Matcher Event Listener ──────────────────────────────────────
  useEffect(() => {
    const handleHighlightEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      setHighlightedProjectIds(customEvent.detail || []);
    };
    window.addEventListener('highlight-projects', handleHighlightEvent);
    return () => window.removeEventListener('highlight-projects', handleHighlightEvent);
  }, []);

  return (
    <section className="py-section-gap bg-surface-container-lowest/30 relative reveal" id="projects">
      
      {/* Expose endpoints in CTO mode */}
      {role === 'CTO' && (
        <div className="max-w-container-max mx-auto px-gutter mb-4">
          <div className="flex items-center gap-2 font-mono text-[10px] text-sky-400 bg-sky-950/40 border border-sky-800/40 px-3 py-1 rounded-md max-w-fit">
            <Network size={12} className="animate-pulse" />
            <span>CONNECTED TO TELEMETRY MATRIX: {WS_URL} | POST /api/portfolio/calculate-scope</span>
          </div>
        </div>
      )}

      <div className="max-w-container-max mx-auto px-gutter">

        {/* ── Header ── */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-[1px] w-12 bg-primary" />
            <span className="text-primary font-label-caps uppercase tracking-widest text-[12px]">
              {role === 'CEO' ? 'Business Case Studies' : 'Case Studies'}
            </span>
          </div>
          
          <h1 className="font-headline-lg text-[36px] md:text-[48px] font-bold mb-6 leading-tight text-on-surface">
            {role === 'CEO' 
              ? <>High-ROI <span className="text-primary">Software Product</span> Delivery.</>
              : <>Featured <span className="text-primary">Engineering</span> Projects.</>}
          </h1>
          <p className="font-body-lg text-[16px] md:text-[18px] text-on-surface-variant max-w-2xl">
            {role === 'CEO'
              ? 'Evaluating technical execution from a business lens: showing product lifecycle speed, resource optimizations, and direct financial scaling benefits.'
              : 'A selection of high-performance web applications, microservices architectures, and enterprise-grade ecommerce solutions architected for scalability.'}
          </p>
        </header>

        {/* 🚀 CEO PERSPECTIVE: Isolated Project Scope & ROI Calculator */}
        {role === 'CEO' && <ScopeCalculator />}

        {/* 💻 CTO PERSPECTIVE: Isolated System Architecture Stress-Tester */}
        {role === 'CTO' && <SystemStressTester />}

        {/* ── 3-column bento grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RESUME_DATA.projects.map((project) => {
            // Evaluates highlights based on Keyword Matcher
            const isHighlighted = highlightedProjectIds.includes(project.id);
            const matcherActive = highlightedProjectIds.length > 0;
            
            const borderClass = isHighlighted 
              ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02] border-l-4 border-l-primary' 
              : 'border-outline-variant';
              
            const opacityClass = matcherActive && !isHighlighted 
              ? 'opacity-30 blur-[0.5px] scale-[0.98]' 
              : 'opacity-100 scale-100';

            return (
              <div
                key={project.id}
                className={`glass-card p-gutter flex flex-col group relative overflow-hidden transition-all duration-500 ${borderClass} ${opacityClass}`}
              >
                {/* Dynamic tag overlay in inspect/CTO mode */}
                {role === 'CTO' && (
                  <div className="absolute top-3 right-3 z-10 bg-black/60 border border-sky-500/30 px-2 py-0.5 rounded font-mono text-[9px] text-sky-400">
                    ID: {project.id}
                  </div>
                )}

                {/* Image */}
                <div className="mb-6 overflow-hidden aspect-video bg-surface-container-high border border-outline-variant relative">
                  {project.imageUrl && (
                    <img
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={project.imageUrl}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="flex-grow">
                  {/* Tech chips — uppercase, primary colour */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-surface-container-high border border-outline-variant px-2 py-1 font-code-md text-xs text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-headline-sm text-[24px] font-semibold mb-3 text-on-surface">
                    {project.title}
                  </h3>
                  <p className="text-on-surface-variant mb-6 font-body-md text-[15px] leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
