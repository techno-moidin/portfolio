import { useState, useEffect, useRef } from 'react';
import { useRole } from '../utils/RoleContext';
import { Terminal, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'API' | 'WS' | 'LIFECYCLE';
  message: string;
}

// Global logger helper that triggers custom events
export function logEvent(type: LogEntry['type'], message: string) {
  const event = new CustomEvent('app-dev-log', {
    detail: {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    },
  });
  window.dispatchEvent(event);
}

export function FloatingConsole() {
  const { role } = useRole();
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: new Date().toLocaleTimeString(), type: 'INFO', message: 'MSM System Diagnostics Monitor Initialized.' },
    { timestamp: new Date().toLocaleTimeString(), type: 'LIFECYCLE', message: 'Mounted App Layout Workspace.' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

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
    if (isOpen && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  if (role !== 'CTO') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col font-mono text-[11px] leading-relaxed max-w-[420px] w-full bg-background/95 border border-primary/40 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden">
      
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center px-4 py-2.5 bg-surface-container-high border-b border-primary/20 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 text-primary">
          <Terminal size={14} className="animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[10px]">Developer Console</span>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setLogs([]);
            }}
            title="Clear logs"
            className="hover:text-primary transition-colors duration-200"
          >
            <Trash2 size={12} />
          </button>
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {/* Terminal View body */}
      {isOpen && (
        <div className="h-[200px] p-3 overflow-y-auto bg-black/60 flex flex-col gap-1 text-on-surface scrollbar-thin scrollbar-thumb-primary/25 scrollbar-track-transparent">
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
    </div>
  );
}
