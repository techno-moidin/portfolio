import { RESUME_DATA } from '../data/resume';
import { useRole } from '../utils/RoleContext';

export function Hero() {
  const { name, about } = RESUME_DATA;
  const { role } = useRole();

  // ── Dynamic Content Matrix ──────────────────────────────────────────────────
  
  let eyebrow: string;
  let headline: React.ReactNode;
  let subheading: string;
  let stats: React.ReactNode;

  if (role === 'HR') {
    eyebrow = `${name} | Software Engineer`;
    headline = (
      <>
        Building{' '}
        <span className="text-primary italic shimmer-text inline-block">
          low-latency
        </span>{' '}
        architectures and{' '}
        <span className="text-primary italic shimmer-text inline-block">
          highly intuitive
        </span>{' '}
        interfaces.
      </>
    );
    subheading = 'Focused on software engineering fundamentals, rapid feature delivery, and clean, easily maintainable modern system integrations.';
    stats = (
      <>
        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <div className="flex items-baseline">
            <span className="font-headline-md text-[32px] font-semibold text-primary stat-counter" data-target="7">
              0
            </span>
            <span className="text-primary font-headline-md text-[32px] font-semibold">+</span>
          </div>
          <span className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
            Years Experience
          </span>
        </div>

        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <div className="flex items-baseline">
            <span className="font-headline-md text-[32px] font-semibold text-primary stat-counter" data-target="95">
              0
            </span>
            <span className="text-primary font-headline-md text-[32px] font-semibold">%</span>
          </div>
          <span className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
            Match score
          </span>
        </div>

        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <span className="font-headline-md text-[32px] font-semibold text-primary">
            Full-Stack
          </span>
          <span className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
            Engineering Scope
          </span>
        </div>
      </>
    );
  } else if (role === 'CEO') {
    eyebrow = 'Product-Focused Full-Stack Engineer';
    headline = (
      <>
        Translating business{' '}
        <span className="text-primary italic shimmer-text inline-block">
          product scope
        </span>{' '}
        into high-performance{' '}
        <span className="text-primary italic shimmer-text inline-block">
          web assets
        </span>.
      </>
    );
    subheading = 'Engineering production-grade systems from product requirements to cloud deployment, optimized for speed-to-market and low infrastructure overhead.';
    stats = (
      <>
        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <div className="flex items-baseline">
            <span className="font-headline-md text-[32px] font-semibold text-primary stat-counter" data-target="7">
              0
            </span>
            <span className="text-primary font-headline-md text-[32px] font-semibold">+</span>
          </div>
          <span className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
            Years Experience
          </span>
        </div>

        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <div className="flex items-baseline">
            <span className="font-headline-md text-[32px] font-semibold text-primary stat-counter" data-target="35">
              0
            </span>
            <span className="text-primary font-headline-md text-[32px] font-semibold">%</span>
          </div>
          <span className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
            Cloud Opt Savings
          </span>
        </div>

        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <div className="flex items-baseline">
            <span className="font-headline-md text-[32px] font-semibold text-primary stat-counter" data-target="88">
              0
            </span>
            <span className="text-primary font-headline-md text-[32px] font-semibold">%</span>
          </div>
          <span className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
            Speed-To-Market Score
          </span>
        </div>
      </>
    );
  } else {
    // CTO view
    eyebrow = name;
    headline = (
      <>
        Full Stack Web Developer crafting{' '}
        <span className="text-primary italic shimmer-text inline-block">
          high-performance
        </span>
        ,{' '}
        <span className="text-primary italic shimmer-text inline-block">
          scalable
        </span>{' '}
        applications.
      </>
    );
    subheading = about;
    stats = (
      <>
        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <div className="flex items-baseline">
            <span className="font-headline-md text-[32px] font-semibold text-primary stat-counter" data-target="7">
              0
            </span>
            <span className="text-primary font-headline-md text-[32px] font-semibold">+</span>
          </div>
          <span className="font-label-caps text-on-surface-variant text-xs uppercase tracking-widest">
            Years Experience
          </span>
        </div>

        <div className="glass-card px-8 py-4 rounded-xl flex flex-col border-l-4 border-l-primary">
          <div className="flex items-baseline">
            <span className="font-headline-md text-[32px] font-semibold text-primary stat-counter" data-target="85">
              0
            </span>
            <span className="text-primary font-headline-md text-[32px] font-semibold">M+</span>
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
      </>
    );
  }

  return (
    <section className="relative min-h-[100vh] md:min-h-[921px] flex flex-col justify-center items-start max-w-container-max mx-auto px-gutter overflow-hidden py-20">
      <div className="hero-glow" />

      {/* Eyebrow — role dynamic name */}
      <div className="mb-stack-md flex items-center gap-2">
        <span className="w-12 h-[1px] bg-primary" />
        <span className="font-label-caps text-[12px] font-bold text-primary tracking-widest uppercase">
          {eyebrow}
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-display-lg text-[40px] md:text-[64px] font-extrabold text-on-surface max-w-4xl mb-stack-md leading-tight">
        {headline}
      </h1>

      {/* Subtext */}
      <p className="font-body-lg text-[16px] md:text-[18px] text-on-surface-variant max-w-2xl mb-stack-lg leading-relaxed">
        {subheading}
      </p>

      {/* Stats row — exact Stitch layout */}
      <div className="flex flex-wrap gap-stack-md items-center">
        {stats}
      </div>
    </section>
  );
}
