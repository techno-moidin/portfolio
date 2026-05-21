import { RESUME_DATA } from '../data/resume';

/**
 * Hero.tsx — matches stitch_full.html hero section
 *
 * Stitch spec alignment:
 *  - Section: items-start (left-aligned), min-h-[921px]
 *  - Name eyebrow: font-label-caps text-primary tracking-widest uppercase
 *  - H1: font-display-lg, left aligned, max-w-4xl
 *  - Subtext: font-body-lg text-on-surface-variant max-w-2xl
 *  - Stats row: flex-wrap gap-stack-md, each card border-l-4 border-l-primary
 *  - Stat number: font-headline-md text-primary (no conflicting text-[32px] override)
 *  - Stat label: font-label-caps text-on-surface-variant text-xs
 */
export function Hero() {
  const { name, about } = RESUME_DATA;

  return (
    <section className="relative min-h-[100vh] md:min-h-[921px] flex flex-col justify-center items-start max-w-container-max mx-auto px-gutter overflow-hidden py-20">
      <div className="hero-glow" />

      {/* Eyebrow — name */}
      <div className="mb-stack-md flex items-center gap-2">
        <span className="w-12 h-[1px] bg-primary" />
        <span className="font-label-caps text-[12px] font-bold text-primary tracking-widest uppercase">
          {name}
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-display-lg text-[40px] md:text-[64px] font-extrabold text-on-surface max-w-4xl mb-stack-md leading-tight">
        Full Stack Web Developer crafting{' '}
        <span className="text-primary italic shimmer-text inline-block">
          high-performance
        </span>
        ,{' '}
        <span className="text-primary italic shimmer-text inline-block">
          scalable
        </span>{' '}
        applications.
      </h1>

      {/* Subtext */}
      <p className="font-body-lg text-[16px] md:text-[18px] text-on-surface-variant max-w-2xl mb-stack-lg">
        {about}
      </p>

      {/* Stats row — exact Stitch layout */}
      <div className="flex flex-wrap gap-stack-md items-center">
        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <div className="flex items-baseline">
            <span
              className="font-headline-md text-[32px] font-semibold text-primary stat-counter"
              data-target="7"
            >
              0
            </span>
            <span className="text-primary font-headline-md text-[32px] font-semibold">
              +
            </span>
          </div>
          <span className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
            Years Experience
          </span>
        </div>

        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <div className="flex items-baseline">
            <span
              className="font-headline-md text-[32px] font-semibold text-primary stat-counter"
              data-target="85"
            >
              0
            </span>
            <span className="text-primary font-headline-md text-[32px] font-semibold">
              M+
            </span>
          </div>
          <span className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
            Records Migrated
          </span>
        </div>

        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <span className="font-headline-md text-[32px] font-semibold text-primary">
            AWS/GCP
          </span>
          <span className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
            Cloud Expertise
          </span>
        </div>
      </div>
    </section>
  );
}
