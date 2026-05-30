import React from 'react';

export function NotFound() {
  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/';
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative z-10">
      <div className="glass-card max-w-lg w-full p-8 md:p-12 rounded-2xl text-center relative overflow-hidden group border border-outline-variant/30 transition-all duration-500 hover:border-primary/30">
        
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>

        {/* Decorative Grid Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/5 border border-primary/20 mb-6 relative">
          <span className="material-symbols-outlined text-[40px] text-primary animate-pulse">
            error
          </span>
          <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-20"></div>
        </div>

        {/* 404 Header */}
        <h1 className="font-headline-lg text-[64px] md:text-[80px] font-bold text-on-surface leading-none tracking-tighter mb-4">
          4<span className="text-primary shimmer-text">0</span>4
        </h1>

        {/* Subtitle */}
        <h2 className="font-headline-md text-[20px] md:text-[22px] font-semibold text-on-surface mb-4">
          NAMESPACE NOT FOUND
        </h2>

        {/* Technical Description */}
        <p className="font-code-md text-sm text-on-surface-variant mb-8 max-w-sm mx-auto leading-relaxed">
          The requested route <code className="text-primary px-1.5 py-0.5 rounded bg-surface/40 border border-outline-variant/30 font-bold">{window.location.pathname}</code> does not exist in this microservices cluster. It has either been garbage collected or moved to a different node.
        </p>

        {/* Action Button */}
        <a
          href="/"
          onClick={handleReturn}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-on-primary font-bold tracking-wide hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 shadow-[0_4px_20px_rgba(78,222,163,0.2)] group-hover:shadow-[0_4px_30px_rgba(78,222,163,0.35)]"
        >
          <span className="material-symbols-outlined text-base">
            terminal
          </span>
          RETURN TO MAIN TERMINAL
        </a>
      </div>
    </div>
  );
}
