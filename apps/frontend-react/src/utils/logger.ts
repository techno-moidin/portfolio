export interface LogEntry {
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
