import { useState, useEffect, useRef } from 'react';
import { useRole } from '../utils/RoleContext';
import { Terminal, ChevronDown, Trash2, RefreshCw } from 'lucide-react';
import type { TrafficStats } from 'shared-types';
import { logEvent, type LogEntry } from '../utils/logger';

export function FloatingConsole() {
  const { role } = useRole();
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: new Date().toLocaleTimeString(), type: 'INFO', message: 'MSM System Diagnostics Monitor Initialized.' },
    { timestamp: new Date().toLocaleTimeString(), type: 'LIFECYCLE', message: 'Mounted App Layout Workspace.' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<'console' | 'traffic'>('console');
  const [trafficData, setTrafficData] = useState<TrafficStats | null>(null);
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);
  const [trafficError, setTrafficError] = useState<string | null>(null);

  // Administrative Passcode Lock State
  const [adminToken, setAdminToken] = useState<string | null>(() => sessionStorage.getItem('msm_admin_token'));
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [adminMode, setAdminMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('gateway') || sessionStorage.getItem('msm_admin_mode') === 'true';
  });

  // Watch for gateway URL parameter to reveal Traffic tab (does not automatically login)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gateway = params.get('gateway');
    
    if (gateway) {
      const attemptVerifyGateway = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const response = await fetch(`${apiUrl}/api/traffic/verify-gateway`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: gateway }),
          });
          
          if (response.ok) {
            sessionStorage.setItem('msm_admin_mode', 'true');
            setAdminMode(true);
            logEvent('LIFECYCLE', '🔓 Traffic Analytics tab revealed via URL gateway key.');
            
            // Clean up query param from browser address bar
            const url = new URL(window.location.href);
            url.searchParams.delete('gateway');
            window.history.replaceState({}, '', url.pathname + url.search);
          } else {
            // Invalid gateway key, do not set admin mode
            sessionStorage.removeItem('msm_admin_mode');
            setAdminMode(false);
          }
        } catch {
          // Offline fallback
          if (gateway === 'msm-gateway' || gateway === 'msmlabs26') {
            sessionStorage.setItem('msm_admin_mode', 'true');
            setAdminMode(true);
            logEvent('LIFECYCLE', 'Traffic Analytics tab revealed offline via URL gateway.');
            
            const url = new URL(window.location.href);
            url.searchParams.delete('gateway');
            window.history.replaceState({}, '', url.pathname + url.search);
          }
        }
      };
      attemptVerifyGateway();
    }
  }, []);

  useEffect(() => {
    if (role !== 'CTO') return;

    const handleLogEvent = (e: Event) => {
      const customEvent = e as CustomEvent<LogEntry>;
      setLogs((prev) => [...prev.slice(-49), customEvent.detail]); // cap at last 50 logs
    };

    window.addEventListener('app-dev-log', handleLogEvent);
    
    // Log websocket and routing logs
    logEvent('INFO', 'Inspect Stack Mode Activated. Telemetry lines loaded.');

    return () => {
      window.removeEventListener('app-dev-log', handleLogEvent);
    };
  }, [role]);

  // Scroll to bottom when logs append
  useEffect(() => {
    if (isOpen && activeTab === 'console' && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen, activeTab]);

  const fetchTraffic = async (tokenOverride?: string) => {
    const activeToken = tokenOverride || adminToken;
    if (!activeToken) return;

    setIsLoadingTraffic(true);
    setTrafficError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/traffic/stats`, {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTrafficData(data);
      } else if (response.status === 401) {
        // Token expired/unauthorized
        setAdminToken(null);
        sessionStorage.removeItem('msm_admin_token');
        setTrafficError('Session expired. Please authenticate again.');
      } else {
        setTrafficError('Failed to load traffic data.');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setTrafficError(null);
      // Fallback for offline mode
      setTrafficData({
        totalViews: logs.filter(l => l.type === 'API').length + 1,
        uniqueViewers: 1,
        returningViewers: logs.filter(l => l.type === 'API').length > 0 ? 1 : 0,
        visitors: [
          {
            deviceId: localStorage.getItem('msm_device_id') || 'local-device',
            ip: '127.0.0.1',
            userAgent: navigator.userAgent,
            country: 'Local Network',
            region: 'Dubai',
            city: 'UAE',
            isp: 'Localhost Loopback',
            visitCount: logs.filter(l => l.type === 'API').length + 1,
            firstVisit: new Date().toLocaleDateString(),
            lastVisit: new Date().toLocaleDateString(),
          }
        ]
      });
      logEvent('LIFECYCLE', `Traffic stats fallback to local resolver: ${errMsg}`);
    } finally {
      setIsLoadingTraffic(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/traffic/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode }),
      });

      if (response.ok) {
        const data = await response.json();
        setAdminToken(data.token);
        sessionStorage.setItem('msm_admin_token', data.token);
        setPasscode('');
        // Trigger stats load on successful auth
        fetchTraffic(data.token);
      } else {
        const data = await response.json();
        setAuthError(data.message || 'Authentication failed.');
      }
    } catch {
      setAuthError(null);
      // Local fallback for offline testing
      if (passcode === 'msmlabs26') {
        const token = 'msm-mock-admin-token';
        setAdminToken(token);
        sessionStorage.setItem('msm_admin_token', token);
        setPasscode('');
        fetchTraffic(token);
        logEvent('LIFECYCLE', 'Unlocked traffic insights offline via fallback mock-auth.');
      } else {
        setAuthError('Invalid local passcode (Try: msmlabs26)');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (role !== 'CTO') return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Open System Diagnostics Console"
        aria-label="Open Developer Console"
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-surface-container-high/90 hover:bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md animate-pulse"
        style={{
          boxShadow: '0 0 15px rgba(78, 222, 163, 0.25)',
        }}
      >
        <Terminal size={16} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col font-mono text-[11px] leading-relaxed max-w-[calc(100vw-3rem)] sm:max-w-[420px] w-full bg-background/95 border border-primary/40 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden animate-scale-up">
      
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(false)}
        className="flex justify-between items-center px-4 py-2.5 bg-surface-container-high border-b border-primary/20 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 text-primary">
          <Terminal size={14} className="animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[10px]">
            {adminMode ? 'Admin Console' : 'Developer Console'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant">
          {activeTab === 'console' ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLogs([]);
              }}
              title="Clear logs"
              className="hover:text-primary transition-colors duration-200 cursor-pointer p-1"
            >
              <Trash2 size={12} />
            </button>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (adminToken) fetchTraffic();
              }}
              title="Refresh traffic"
              className={`hover:text-primary transition-colors duration-200 cursor-pointer p-1 ${isLoadingTraffic ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={12} />
            </button>
          )}
          <ChevronDown size={14} className="cursor-pointer" />
        </div>
      </div>

      {/* Tabs Selector */}
      {adminMode && (
        <div className="flex border-b border-primary/20 bg-surface-container-low font-bold text-[10px]">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex-1 py-2 text-center transition-colors duration-200 cursor-pointer border-r border-primary/10 ${
              activeTab === 'console'
                ? 'text-primary border-b border-primary bg-black/25'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-black/10'
            }`}
          >
            CONSOLE LOGS
          </button>
          <button
            onClick={() => {
              setActiveTab('traffic');
              if (adminToken) {
                fetchTraffic();
              }
            }}
            className={`flex-1 py-2 text-center transition-colors duration-200 cursor-pointer ${
              activeTab === 'traffic'
                ? 'text-primary border-b border-primary bg-black/25'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-black/10'
            }`}
          >
            TRAFFIC INSIGHTS
          </button>
        </div>
      )}

      {/* Console Tab */}
      {activeTab === 'console' && (
        <div className="h-[220px] p-3 overflow-y-auto bg-black/60 flex flex-col gap-1 text-on-surface scrollbar-thin scrollbar-thumb-primary/25 scrollbar-track-transparent">
          {logs.length === 0 ? (
            <div className="text-on-surface-variant italic text-center py-8">No terminal actions logged. Try clicking buttons or testing forms!</div>
          ) : (
            logs.map((log, idx) => {
              let color = 'text-primary'; // default INFO is emerald
              if (log.type === 'API') color = 'text-sky-400';
              if (log.type === 'WS') color = 'text-purple-400';
              if (log.type === 'LIFECYCLE') color = 'text-amber-400';

              return (
                <div key={idx} className="flex items-start gap-1.5 break-all">
                  <span className="text-on-surface-variant shrink-0">{log.timestamp}</span>
                  <span className={`${color} shrink-0 font-bold`}>[{log.type}]</span>
                  <span className="text-on-surface-variant">{log.message}</span>
                </div>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>
      )}

      {/* Traffic Insights Passcode Lock Form */}
      {activeTab === 'traffic' && !adminToken && (
        <form onSubmit={handleAuth} className="h-[220px] bg-black/60 p-4 flex flex-col justify-center items-center gap-3 text-on-surface border-t border-primary/5">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[10px] animate-pulse">
            <span>■ MSM Secure Admin Gateway</span>
          </div>
          <span className="text-on-surface-variant text-[9px] text-center max-w-[280px]">
            Administrative access level required. Please authenticate to view visitor traffic analytics.
          </span>
          <div className="flex flex-col gap-1 w-full max-w-[240px]">
            <input
              type="password"
              placeholder="Enter Admin Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="bg-background/80 border border-primary/30 rounded px-2.5 py-1 text-center text-primary tracking-widest placeholder:tracking-normal placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary w-full text-[10px]"
            />
            {authError && <span className="text-rose-400 text-[8px] text-center mt-0.5">{authError}</span>}
          </div>
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full max-w-[240px] py-1 bg-primary/20 border border-primary hover:bg-primary/35 active:scale-[0.98] text-primary rounded font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-all duration-200"
          >
            {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
      )}

      {/* Traffic Insights Tab Content */}
      {activeTab === 'traffic' && adminToken && (
        <div className="h-[220px] overflow-y-auto bg-black/60 text-on-surface scrollbar-thin scrollbar-thumb-primary/25 scrollbar-track-transparent p-3 flex flex-col gap-3">
          {isLoadingTraffic && !trafficData ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <RefreshCw size={20} className="animate-spin text-primary" />
              <span className="text-on-surface-variant text-[10px]">Retrieving live metrics...</span>
            </div>
          ) : trafficError ? (
            <div className="text-rose-400 text-center py-10">{trafficError}</div>
          ) : trafficData ? (
            <>
              {/* Traffic Metrics Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-surface-container-high/40 p-2 rounded-lg border border-primary/10 flex flex-col items-center">
                  <span className="text-on-surface-variant text-[9px] uppercase font-bold tracking-wider">Total Hits</span>
                  <span className="text-primary text-sm font-bold mt-0.5">{trafficData.totalViews}</span>
                </div>
                <div className="bg-surface-container-high/40 p-2 rounded-lg border border-primary/10 flex flex-col items-center">
                  <span className="text-on-surface-variant text-[9px] uppercase font-bold tracking-wider">Devices</span>
                  <span className="text-sky-400 text-sm font-bold mt-0.5">{trafficData.uniqueViewers}</span>
                </div>
                <div className="bg-surface-container-high/40 p-2 rounded-lg border border-primary/10 flex flex-col items-center">
                  <span className="text-on-surface-variant text-[9px] uppercase font-bold tracking-wider">Returning</span>
                  <span className="text-purple-400 text-sm font-bold mt-0.5">{trafficData.returningViewers}</span>
                </div>
              </div>

              {/* Visitor List */}
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="text-primary font-bold text-[10px] border-b border-primary/20 pb-1 flex justify-between">
                  <span>RECENT VISITORS</span>
                  <span className="text-on-surface-variant">ACTIVE CHANNELS</span>
                </div>
                {trafficData.visitors.length === 0 ? (
                  <div className="text-on-surface-variant italic text-center py-4">No visitor logs found.</div>
                ) : (
                  trafficData.visitors.slice(0, 10).map((v, i) => (
                    <div key={i} className="border-b border-primary/5 pb-2 last:border-0 flex flex-col gap-0.5">
                      <div className="flex justify-between font-bold text-[10px]">
                        <span className="text-sky-400">{v.ip}</span>
                        <span className="text-on-surface-variant text-[9px]">{v.visitCount} views</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant text-[9px]">
                        <span className="truncate max-w-[190px]">📍 {v.city}, {v.region}, {v.country}</span>
                        <span className="text-purple-400 truncate max-w-[150px] font-semibold">{v.isp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

