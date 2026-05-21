import { RESUME_DATA } from '../data/resume';

/**
 * Education.tsx
 *
 * Renders the Education section sourced entirely from resume.ts.
 * Styled to match the dark glass-card aesthetic of the rest of the portfolio.
 * Placed between Skills and Contact in the page flow.
 */
export function Education() {
  const { education } = RESUME_DATA;

  return (
    <section
      className="py-section-gap max-w-container-max mx-auto px-gutter reveal"
      id="education"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-12">

        {/* Left — label + heading */}
        <div className="md:w-1/3">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-[1px] w-12 bg-primary" />
            <span className="text-primary font-label-caps uppercase tracking-widest text-[12px]">
              Academic Background
            </span>
          </div>
          <h2 className="font-headline-lg text-[32px] md:text-[40px] font-bold text-on-surface leading-tight">
            Education &amp; <span className="text-primary">Foundation</span>
          </h2>
        </div>

        {/* Right — degree card */}
        <div className="md:w-2/3">
          <div className="glass-card rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start group">

            {/* Icon badge */}
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[28px]" aria-hidden="true">
                school
              </span>
            </div>

            {/* Details */}
            <div className="flex-1">
              <span className="font-label-caps text-primary uppercase tracking-widest text-[11px] mb-2 block">
                {education.year}
              </span>
              <h3 className="font-headline-md text-[22px] md:text-[24px] font-bold text-on-surface mb-1">
                {education.degree}
              </h3>
              <p className="font-code-md text-primary font-bold text-[14px] mb-3">
                {education.field}
              </p>
              <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-[15px]">
                <span className="material-symbols-outlined text-[16px] text-outline" aria-hidden="true">
                  location_on
                </span>
                {education.institution} — {education.location}
              </div>
            </div>

            {/* Graduated badge */}
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary font-label-caps text-[11px] px-3 py-1.5 rounded-full uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">verified</span>
                Graduated
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
