import { useState } from 'react';
import { useRole, type UserRole } from '../utils/RoleContext';

export function OnboardingGateway() {
  const { switchRole, setOnboardingCompleted } = useRole();
  const [isExiting, setIsExiting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsExiting(true);

    // Wait 400ms for smooth exit transition to finish before unmounting
    setTimeout(() => {
      switchRole(role);
      setOnboardingCompleted(true);
    }, 400);
  };

  const cards = [
    {
      role: 'HR' as UserRole,
      icon: 'person_search',
      outcome: 'I am looking to recruit full-stack software talent.',
      description: 'Audit core engineering stack, download resume, and review academic backgrounds.',
      details: 'Timeline, full resume PDF, & skill matrices',
      borderClass: 'border-secondary-fixed-dim/20 hover:border-primary hover:shadow-[0_0_25px_rgba(78,222,163,0.15)]',
      accentColor: 'text-secondary-fixed-dim',
    },
    {
      role: 'CEO' as UserRole,
      icon: 'insights',
      outcome: 'I want to evaluate product timelines and project ROI.',
      description: 'Use the interactive scoping slider, audit product roadmaps, and review commercial scaling details.',
      details: 'Active ROI sliders, budget plans, & direct mailers',
      borderClass: 'border-tertiary-fixed-dim/20 hover:border-primary hover:shadow-[0_0_25px_rgba(78,222,163,0.15)]',
      accentColor: 'text-tertiary-fixed-dim',
    },
    {
      role: 'CTO' as UserRole,
      icon: 'terminal',
      outcome: 'I want to audit system architectures and run live sandboxes.',
      description: 'Audit live system architectures, run real-time server traffic stress-testers, and solve code debuggers.',
      details: 'WebSocket system maps, bugs sandbox, & telemetry',
      borderClass: 'border-primary/20 hover:border-primary hover:shadow-[0_0_25px_rgba(78,222,163,0.2)]',
      accentColor: 'text-primary',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[100] overflow-y-auto bg-background/25 backdrop-blur-[6px] transition-all duration-400 ease-in-out ${
        isExiting ? 'opacity-0 blur-md' : 'opacity-100 blur-0 animate-fade-in'
      }`}
    >
      <div className="min-h-full w-full flex justify-center items-start sm:items-center p-4">
        <div
          className={`w-full max-w-5xl rounded-3xl p-5 sm:p-7 md:p-8 glass-card border border-outline-variant/60 flex flex-col items-center gap-5 sm:gap-7 transition-all duration-400 bg-surface-container-lowest/80 ${
            isExiting ? 'scale-95 opacity-0' : 'animate-scale-up'
          }`}
          style={{
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Header Block */}
          <div className="text-center flex flex-col items-center gap-1.5 max-w-2xl">
            <h1 className="font-headline-lg text-lg sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wider sm:tracking-widest text-on-surface leading-tight">
              Mohammed Shaheer Moidin
            </h1>
            <p className="font-code-md text-[9px] sm:text-xs uppercase tracking-wider text-primary">
              Full Stack Tech Lead & Solutions Architect
            </p>
            <h2 className="font-body-lg text-xs sm:text-sm md:text-base text-on-surface-variant font-medium leading-relaxed px-2 mt-1">
              Welcome. How would you like to explore Mohammed's engineering catalog today?
            </h2>
          </div>

          {/* Outcome Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full">
            {cards.map((card, idx) => (
              <button
                key={card.role}
                onClick={() => handleSelect(card.role)}
                className={`flex flex-col text-left p-4 sm:p-5 rounded-2xl bg-surface-container/60 border backdrop-blur-md transition-all duration-300 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  card.borderClass
                } ${selectedRole === card.role ? 'bg-primary/10 border-primary scale-102 shadow-[0_0_30px_rgba(78,222,163,0.25)]' : ''}`}
                style={{
                  animationDelay: `${idx * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                {/* Icon badge */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-container-high/80 border border-outline-variant flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-background ${card.accentColor}`}>
                  <span className="material-symbols-outlined text-lg sm:text-xl font-light select-none">
                    {card.icon}
                  </span>
                </div>

                {/* Title Outcome */}
                <h3 className="font-headline-md text-xs sm:text-sm md:text-md font-bold text-on-surface leading-snug mb-1.5 transition-colors duration-200 group-hover:text-primary">
                  "{card.outcome}"
                </h3>

                {/* Sub-description */}
                <p className="font-body-md text-[11px] sm:text-xs text-on-surface-variant leading-relaxed mb-3 flex-grow">
                  {card.description}
                </p>

                {/* Dynamic Specs details inline */}
                <div className="mt-auto pt-2 border-t border-outline-variant/30 flex items-center justify-between w-full">
                  <span className="font-code-md text-[9px] uppercase tracking-wider text-primary font-bold group-hover:underline">
                    {card.details}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
