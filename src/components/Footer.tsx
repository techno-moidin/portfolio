import { RESUME_DATA } from '../data/resume';

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

  return (
    <footer className="bg-surface-dim border-t border-outline-variant w-full py-stack-lg">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto px-gutter gap-stack-md">

        {/* Logo */}
        <div className="font-code-md text-[14px] font-bold text-primary">
          MSM_PORTFOLIO
        </div>

        {/* Copyright */}
        <p className="font-body-md text-[14px] text-on-surface-variant text-center">
          © 2025 Mohammed Shaheer Moidin. Built for performance.
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
    </footer>
  );
}
