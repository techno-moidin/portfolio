import { useState } from 'react';
import { useRole, type UserRole } from '../utils/RoleContext';

export function OnboardingGateway() {
  const { switchRole, setOnboardingCompleted } = useRole();
  const [isExiting, setIsExiting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);

  const handleBoot = (role: UserRole) => {
    setIsExiting(true);

    // Wait 450ms for smooth exit transition to finish before unmounting
    setTimeout(() => {
      switchRole(role);
      setOnboardingCompleted(true);
    }, 450);
  };

  const handleCardClick = (role: UserRole) => {
    if (selectedRole === role) {
      // Second click on an already selected card boots it immediately
      handleBoot(role);
    } else {
      setSelectedRole(role);
    }
  };

  const cards = [
    {
      role: 'HR' as UserRole,
      icon: 'person_search',
      title: 'Recruiter',
      subtitle: 'HR & Talent Portal',
      consoleText: 'Unlocks my downloadable PDF CV, full employment history timeline, and core technical skill matrices to evaluate candidate fit.',
      colorClass: 'text-secondary',
      borderColor: 'border-secondary/20',
      activeBorderClass: 'border-secondary/80 bg-secondary/5 shadow-[0_0_30px_rgba(137,206,255,0.25)]',
      hoverBorderClass: 'hover:border-secondary/60 hover:shadow-[0_0_20px_rgba(137,206,255,0.15)]',
      glowStyle: { boxShadow: '0 0 40px rgba(137, 206, 255, 0.1) inset' },
      accentColor: '#89ceff',
    },
    {
      role: 'CEO' as UserRole,
      icon: 'insights',
      title: 'Founder',
      subtitle: 'Executive & ROI Portal',
      consoleText: 'Unlocks commercial project roadmaps, client case studies, and interactive project scoping sliders to evaluate product timeline & ROI.',
      colorClass: 'text-tertiary',
      borderColor: 'border-tertiary/20',
      activeBorderClass: 'border-tertiary/80 bg-tertiary/5 shadow-[0_0_30px_rgba(208,188,255,0.25)]',
      hoverBorderClass: 'hover:border-tertiary/60 hover:shadow-[0_0_20px_rgba(208,188,255,0.15)]',
      glowStyle: { boxShadow: '0 0 40px rgba(208, 188, 255, 0.1) inset' },
      accentColor: '#d0bcff',
    },
    {
      role: 'CTO' as UserRole,
      icon: 'terminal',
      title: 'Technical Lead',
      subtitle: 'CTO & Engineering Portal',
      consoleText: 'Unlocks live system telemetry maps, interactive debugging sandboxes, and WebSocket diagnostics to audit my system architectures.',
      colorClass: 'text-primary',
      borderColor: 'border-primary/20',
      activeBorderClass: 'border-primary/80 bg-primary/5 shadow-[0_0_30px_rgba(78,222,163,0.3)]',
      hoverBorderClass: 'hover:border-primary/60 hover:shadow-[0_0_20px_rgba(78,222,163,0.15)]',
      glowStyle: { boxShadow: '0 0 40px rgba(78, 222, 163, 0.15) inset' },
      accentColor: '#4edea3',
    },
  ];

  const activeDisplayRole = hoveredRole || selectedRole;
  const activeCard = cards.find(c => c.role === activeDisplayRole);
  
  const consoleHeader = activeCard 
    ? `[SYSTEM MODE: ${activeCard.title.toUpperCase()}]`
    : '[SYSTEM LOG: AWAITING PERSPECTIVE INITIALIZATION]';

  const consoleMessage = activeCard 
    ? activeCard.consoleText
    : 'Select or hover over an access card above to configure the portfolio environment...';

  const activeColorClass = activeCard ? activeCard.colorClass : 'text-on-surface-variant';
  const selectedAccentColor = cards.find(c => c.role === selectedRole)?.accentColor;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[100] overflow-y-auto bg-background/30 backdrop-blur-[8px] transition-all duration-400 ease-in-out ${
        isExiting ? 'opacity-0 blur-md' : 'opacity-100 blur-0 animate-fade-in'
      }`}
    >
      <div className="min-h-full w-full flex justify-center items-start sm:items-center p-3 py-6 sm:p-6 md:p-8">
        <div
          className={`w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl rounded-3xl p-4 sm:p-6 md:p-8 glass-card border border-outline-variant/60 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 transition-all duration-400 bg-surface-container-lowest/90 ${
            isExiting ? 'scale-95 opacity-0' : 'animate-scale-up'
          }`}
          style={{
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Header Block */}
          <div className="text-center flex flex-col items-center gap-1.5 sm:gap-2 max-w-2xl">
            <h1 className="font-headline-lg text-lg sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wider sm:tracking-widest text-on-surface leading-tight">
              Mohammed Shaheer Moidin
            </h1>
            <p className="font-code-md text-[9px] sm:text-xs uppercase tracking-wider text-primary font-bold">
              Full Stack Tech Lead & Solutions Architect
            </p>
            <p className="font-body-md text-[11px] sm:text-xs md:text-sm text-on-surface-variant font-medium leading-relaxed px-2 sm:px-4 mt-0.5 sm:mt-1">
              Welcome to my interactive portfolio. To help you explore my experience and background efficiently, select a perspective below to tailor the interface layout, metrics, and highlights to your focus.
            </p>
          </div>

          {/* simplified perspective Cards */}
          <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-4 w-full">
            {cards.map((card) => {
              const isSelected = selectedRole === card.role;
              return (
                <button
                  key={card.role}
                  onClick={() => handleCardClick(card.role)}
                  onMouseEnter={() => setHoveredRole(card.role)}
                  onMouseLeave={() => setHoveredRole(null)}
                  className={`w-full flex flex-row md:flex-col items-center justify-between md:justify-center text-left md:text-center p-3 md:p-6 rounded-xl md:rounded-2xl bg-surface-container/30 border backdrop-blur-md transition-all duration-300 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected ? card.activeBorderClass : `${card.borderColor} ${card.hoverBorderClass}`
                  }`}
                  style={isSelected ? card.glowStyle : undefined}
                >
                  {/* Left part (Mobile) / Top part (Desktop) containing Icon and Texts */}
                  <div className="flex flex-row md:flex-col items-center gap-3 md:gap-0 md:mb-4 w-full">
                    {/* Icon badge */}
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-surface-container-high/60 border border-outline-variant flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-background shrink-0 ${card.colorClass}`}>
                      <span className="material-symbols-outlined text-xl md:text-2xl font-light select-none">
                        {card.icon}
                      </span>
                    </div>

                    {/* Titles */}
                    <div className="flex flex-col md:items-center text-left md:text-center">
                      <h3 className="font-headline-md text-xs sm:text-sm md:text-base font-bold text-on-surface leading-tight transition-colors duration-200 group-hover:text-primary">
                        {card.title}
                      </h3>
                      <span className="font-code-md text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider text-on-surface-variant/70 leading-normal mt-0.5">
                        {card.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Far right indicator (Mobile only) */}
                  <span className={`material-symbols-outlined text-base md:hidden transition-all duration-300 shrink-0 ${isSelected ? card.colorClass : 'text-on-surface-variant/40'}`}>
                    {isSelected ? 'check_circle' : 'chevron_right'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Console Log Output */}
          <div className="w-full bg-surface-container-lowest/90 border border-outline-variant/50 rounded-2xl p-3 sm:p-4 md:p-6 font-code-md text-[10px] sm:text-xs md:text-sm flex flex-col gap-1.5 sm:gap-2 relative overflow-hidden">
            {/* Top header tabs decoration to feel like real console */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2 mb-1">
              <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant/60 font-bold flex items-center gap-1 sm:gap-1.5">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500/80"></span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500/80"></span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500/80"></span>
                <span className="ml-1">Telemetry Diagnostics</span>
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-xs text-on-surface-variant/40">v4.3.0_RELEASE</span>
            </div>

            {/* Live streaming/updating output text */}
            <div className="min-h-[44px] sm:min-h-[50px] flex flex-col gap-0.5 sm:gap-1">
              <div className="text-[8px] sm:text-[10px] md:text-xs text-on-surface-variant/60 uppercase font-bold tracking-wider">
                {consoleHeader}
              </div>
              <div className={`leading-relaxed transition-colors duration-300 ${activeColorClass}`}>
                {consoleMessage}
                <span className="ml-1 inline-block w-1 h-2.5 sm:w-1.5 sm:h-3 bg-current align-middle animate-blink"></span>
              </div>
            </div>
          </div>

          {/* Action trigger (fades in only when a role is selected) */}
          <div className="h-10 sm:h-12 w-full flex items-center justify-center">
            {selectedRole && (
              <button
                onClick={() => handleBoot(selectedRole)}
                className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl uppercase tracking-wider font-code-md text-[10px] sm:text-xs md:text-sm font-bold bg-surface-container/60 hover:bg-background border transition-all duration-300 cursor-pointer shadow-lg animate-fade-in animate-pulse-ring"
                style={{
                  borderColor: selectedAccentColor,
                  color: selectedAccentColor,
                  boxShadow: `0 0 20px ${selectedAccentColor}30`,
                }}
              >
                Explore as {cards.find(c => c.role === selectedRole)?.title}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
