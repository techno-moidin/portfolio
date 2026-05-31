import { RESUME_DATA } from '../data/resume';
import { useRole } from '../utils/RoleContext';

/**
 * Footer.tsx — matches stitch_full.html / stitch_projects.html footer
 *
 * Stitch spec:
 *  - bg-surface-dim border-t border-outline-variant py-stack-lg
 *  - flex flex-col md:flex-row justify-between items-center
 *  - Social links: gap-8 (not gap-stack-md), hover:translate-y-[-2px] transition-all
 *  - Copyright: text-center on mobile, font-body-md text-on-surface-variant
 */
export function Footer() {
  const { linkedin, email, github } = RESUME_DATA;
  const { role, switchRole } = useRole();

  return (
    <footer className="bg-surface-dim border-t border-outline-variant w-full py-stack-lg">
      <div className="flex flex-col gap-6 max-w-container-max mx-auto px-gutter">
        <div className="flex flex-col md:flex-row justify-between items-center gap-stack-md">
          {/* Logo */}
          <div className="flex items-center gap-2.5 select-none" aria-label="MSM Labs Logo">
            <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="10" fill="#0b1326" />
              <rect x="2" y="2" width="44" height="44" rx="8" stroke="#4edea3" stroke-width="2" stroke-opacity="0.8" />
              <rect x="10" y="14" width="4" height="20" rx="1.5" fill="#4edea3" />
              <path d="M14 14 L24 24 L34 14" stroke="#4edea3" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
              <rect x="34" y="14" width="4" height="20" rx="1.5" fill="#4edea3" />
              <circle cx="18" cy="30" r="2.5" fill="#10b981" />
              <circle cx="24" cy="30" r="2.5" fill="#4edea3" />
              <circle cx="30" cy="30" r="2.5" fill="#10b981" />
            </svg>
            <span className="font-code-md text-[13px] font-extrabold uppercase tracking-widest text-primary">
              MSM Labs
            </span>
          </div>

          {/* Copyright */}
          <p className="font-body-md text-[14px] text-on-surface-variant text-center">
            © 2026 MSM Studio. Built for performance.
          </p>

          {/* Social links */}
          <div className="flex gap-8">
            <a
              className="text-on-surface-variant font-body-md hover:text-primary hover:-translate-y-0.5 transition-all duration-200"
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="text-on-surface-variant font-body-md hover:text-primary hover:-translate-y-0.5 transition-all duration-200"
              href={github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="text-on-surface-variant font-body-md hover:text-primary hover:-translate-y-0.5 transition-all duration-200"
              href={`mailto:${email}`}
            >
              Email
            </a>
          </div>
        </div>

        {/* Change View micro-UI link switcher */}
        <div className="pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row justify-center items-center gap-4 text-center">
          <span className="font-code-md text-[10px] uppercase tracking-widest text-on-surface-variant/60">
            Change View:
          </span>
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold font-body-md">
            <button
              onClick={() => switchRole('HR')}
              className={`pb-1 cursor-pointer transition-colors duration-200 ${
                role === 'HR'
                  ? 'text-primary border-b border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Software Engineer
            </button>
            <span className="text-outline-variant/65 text-[10px]">|</span>
            <button
              onClick={() => switchRole('CEO')}
              className={`pb-1 cursor-pointer transition-colors duration-200 ${
                role === 'CEO'
                  ? 'text-primary border-b border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Product Manager
            </button>
            <span className="text-outline-variant/65 text-[10px]">|</span>
            <button
              onClick={() => switchRole('CTO')}
              className={`pb-1 cursor-pointer transition-colors duration-200 ${
                role === 'CTO'
                  ? 'text-primary border-b border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Technical Lead
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
