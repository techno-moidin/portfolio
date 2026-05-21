import { RESUME_DATA } from '../data/resume';

/**
 * Skills.tsx — matches stitch_full.html Technical Expertise section
 *
 * Stitch spec:
 *  - Outer: grid grid-cols-1 md:grid-cols-4 gap-stack-lg
 *  - Left col: md:col-span-1, sticky label
 *  - Right col: md:col-span-3, grid grid-cols-1 sm:grid-cols-2 gap-stack-md
 *  - Card: glass-card p-stack-md border border-outline-variant rounded-xl
 *  - Icon + title in flex items-center gap-3 text-primary
 *  - Skills as tech-chip tags (wrapped chips, NOT plain text string)
 */
export function Skills() {
  return (
    <section
      className="py-section-gap max-w-container-max mx-auto px-gutter reveal"
      id="skills"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-lg">

        {/* ── Sticky label column ── */}
        <div className="md:col-span-1">
          <h2 className="font-headline-md text-[28px] md:text-[32px] font-semibold text-on-surface md:sticky md:top-32">
            Technical <span className="text-primary">Stack</span>
          </h2>
          <p className="mt-2 md:mt-4 text-[14px] md:text-[16px] text-on-surface-variant">
            A specialized toolkit for enterprise scale.
          </p>
        </div>

        {/* ── Skills cards — 2-col on sm, matching Stitch ── */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
          {RESUME_DATA.skills.map((category) => (
            <div
              key={category.title}
              className="glass-card p-stack-md border border-outline-variant rounded-xl group transition-all"
            >
              {/* Icon + category title */}
              <div className="flex items-center gap-3 mb-stack-sm text-primary">
                <span
                  className="material-symbols-outlined text-[22px]"
                  aria-hidden="true"
                >
                  {category.icon}
                </span>
                <h4 className="font-label-caps font-bold text-[12px]">
                  {category.title}
                </h4>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="tech-chip px-3 py-1 rounded font-code-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
