import { useEffect, useRef, useState } from 'react';
import { RESUME_DATA } from '../data/resume';

/**
 * Experience.tsx — "Experience with Timeline Motion"
 *
 * Timeline hover animation:
 *  - The vertical sidebar line has TWO layers stacked in the same column:
 *      1. Base layer  — dim (#334155), full height, always visible
 *      2. Fill layer  — primary (#10b981), same height, clipped via scaleY(0→1)
 *         The fill layer's scaleY is driven by `hoveredIndex` state:
 *         scaleY = (hoveredIndex + 1) / total
 *         transform-origin: top → it grows downward, stopping at the hovered card.
 *  - Timeline marker dots light up (bg-primary + ring) when their card is hovered.
 *  - Scroll-reveal: each .glass-card is observed individually and cascades in.
 */
export function Experience() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = RESUME_DATA.experience.length;
  const lastIndex = total - 1;

  /* ── Per-card scroll-reveal (staggered) ── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = [
        `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 120}ms`,
        `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 120}ms`,
      ].join(', ');

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).style.cssText = [
                'opacity: 1',
                'transform: translateY(0)',
                `transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 120}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 120}ms`,
              ].join('; ');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );

      obs.observe(card);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  /* ── Fill progress: 0 → 1 based on hovered card index ── */
  const fillScale =
    hoveredIndex !== null ? (hoveredIndex + 1) / total : 0;

  return (
    <section
      className="py-section-gap max-w-container-max mx-auto px-gutter reveal"
      id="experience"
    >
      {/* Section heading */}
      <div className="mb-20">
        <h1 className="font-headline-lg text-[36px] md:text-[48px] font-bold mb-4 text-on-surface">
          Professional Journey
        </h1>
        <p className="font-body-lg text-[16px] md:text-[18px] text-on-surface-variant max-w-2xl">
          A track record of engineering scalable backend architectures,
          high-performance web applications, and robust cloud deployments.
        </p>
      </div>

      {/* ── Timeline grid ── */}
      <div className="relative grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8">

        {/* ── Desktop timeline line column ── */}
        <div className="hidden md:flex flex-col items-center">
          {/*
            Two layers, same absolute position, both full-height.
            Layer 1 (base):  always visible, muted colour
            Layer 2 (fill):  primary colour, grows downward via scaleY on hover
          */}
          <div className="relative w-1 h-full">
            {/* Base — dim, always visible */}
            <div className="absolute inset-0 timeline-line rounded-full opacity-20" />

            {/* Fill — lit, scales down from top on hover */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(to bottom, #4edea3, #10b981)',
                transformOrigin: 'top',
                transform: `scaleY(${fillScale})`,
                transition: hoveredIndex !== null
                  ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: hoveredIndex !== null
                  ? '0 0 12px rgba(78, 222, 163, 0.5)'
                  : 'none',
              }}
            />
          </div>
        </div>

        {/* ── Experience entries ── */}
        <div className="space-y-stack-lg">
          {RESUME_DATA.experience.map((exp, index) => {
            const isActive   = index === 0;
            const isLast     = index === lastIndex;
            const isHovered  = hoveredIndex === index;
            // Marker is "lit" if it's the current role OR its card is hovered
            const markerLit  = isActive || isHovered;

            return (
              <div
                key={exp.id}
                className="relative group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* ── Desktop timeline marker dot ── */}
                <div
                  className={[
                    'hidden md:block absolute -left-[45px] top-4 w-4 h-4 rounded-full z-10',
                    'transition-all duration-300',
                    markerLit
                      ? 'bg-primary ring-4 ring-primary/30 scale-125'
                      : 'bg-outline-variant scale-100',
                    isActive ? 'animate-pulse' : '',
                  ].join(' ')}
                />

                {/* ── Glass card (ref for scroll-reveal) ── */}
                <div
                  ref={(el) => { cardRefs.current[index] = el; }}
                  className={[
                    'glass-card p-stack-lg rounded-xl',
                    isLast ? 'border-dashed' : '',
                  ].join(' ')}
                >
                  {/* Header: company info + period */}
                  <div className="mb-4">
                    <span
                      className={`font-label-caps mb-2 block uppercase tracking-widest text-[11px] ${
                        isActive ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {exp.period}
                    </span>
                    <h2 className="font-headline-md text-[22px] md:text-[24px] font-bold text-on-surface leading-tight mb-1">
                      {exp.company}
                    </h2>
                    <p className="font-code-md text-code-md text-primary font-bold">
                      {exp.role}
                    </p>
                  </div>

                  {/* Technologies Chips aligned horizontally beneath header */}
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="tech-chip px-2.5 py-1 rounded font-code-md text-[10px] md:text-[11px] tracking-wide"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description bullets */}
                  <div className="space-y-4 mt-stack-md">
                    <ul className="space-y-3 font-body-md text-on-surface-variant list-none pl-0 m-0">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex gap-3">
                          <span
                            className="material-symbols-outlined text-primary text-[18px] shrink-0 leading-[1.6]"
                            aria-hidden="true"
                          >
                            {exp.icons?.[i] ?? 'terminal'}
                          </span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
