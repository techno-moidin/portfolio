import { RESUME_DATA } from '../data/resume';

/**
 * About.tsx — "Precision Engineered Backend Solutions" bento
 *
 * Stitch spec (stitch_full.html):
 *  - 12-col grid: text col md:col-span-8, image col md:col-span-4
 *  - H2: font-headline-lg, left-aligned
 *  - Body: font-body-lg text-on-surface-variant
 *  - Terminal line: flex gap-4 items-center, material-symbols-outlined + font-code-md
 *  - Image: h-[400px], group-hover:scale-110, gradient overlay
 *  - Dubai badge: absolute bottom-4 left-4
 */
export function About() {
  const { about, location } = RESUME_DATA;

  return (
    <section className="py-section-gap max-w-container-max mx-auto px-gutter reveal">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md">

        {/* ── Text column ── */}
        <div className="md:col-span-8 flex flex-col justify-center">
          <h2 className="font-headline-lg text-[36px] md:text-[48px] font-bold mb-stack-md text-on-surface leading-tight">
            Precision Engineered <span className="text-primary">Backend</span> Solutions.
          </h2>
          <p className="font-body-lg text-[16px] md:text-[18px] text-on-surface-variant mb-stack-md">
            {about}
          </p>
          <p className="font-body-md text-[15px] text-on-surface-variant mb-stack-md">
            I bridge the gap between complex infrastructure and seamless user experiences.
            My approach is rooted in the &ldquo;code editor&rdquo; aesthetic: clean, structured,
            and focused on operational excellence.
          </p>
          <div className="flex gap-4 items-center">
            <span className="material-symbols-outlined text-primary text-[22px]" aria-hidden="true">
              terminal
            </span>
            <span className="font-code-md text-[14px] text-primary">
              Focused on NestJS, React, and Cloud Native architecture.
            </span>
          </div>
        </div>

        {/* ── Image column ── */}
        <div className="md:col-span-4 relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden group border border-outline-variant mt-8 md:mt-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
          <img
            alt="Developer Workspace"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaWekTJA4Euy7afn0beB55ZZ5ObjAgtk0rx9nKNHTKDZwmIutArEGMbjkk-SfBPEQJzmA3PO3uhBEHwKS4FGYzvva-OshHvoDDN06KIkiyztGckQXGd1UkaXfBTyhq8TZvGthXTwNSFgXbdhtB0IGxNbgcWTWMdUmpsuApAM5FeOmHCWa1vODc9wT421TWOJqYjCvGIN_MM3oY7bv3vf_XIfTdsJkK4G-u52OXQk5cmNmkS3iMvAc9Q4UJbz-Q-tQROBq1g3xicpY"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute bottom-4 left-4 z-20">
            <span className="bg-primary/20 backdrop-blur-md text-primary px-3 py-1 rounded font-code-md text-xs border border-primary/30">
              CURRENT: {location.toUpperCase()}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
