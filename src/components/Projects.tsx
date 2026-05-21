import { RESUME_DATA } from '../data/resume';

/**
 * Projects.tsx — pixel-perfect match to stitch_projects.html
 *
 * Layout spec (from Stitch):
 *  - Header: flex items-center gap-4 line + "Case Studies" label above h1
 *  - Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
 *  - Card: glass-card p-gutter flex flex-col group relative overflow-hidden (no rounded-xl in Stitch — uses default radius)
 *  - Image: aspect-video, gradient hover overlay
 *  - Tech chips: bg-surface-container-high border border-outline-variant text-primary
 *  - Title: font-headline-sm text-headline-sm
 *  - Link: inline-flex items-center gap-2 text-primary font-label-caps + arrow icon
 */
export function Projects() {
  return (
    <section
      className="py-section-gap bg-surface-container-lowest/30 relative reveal"
      id="projects"
    >
      <div className="max-w-container-max mx-auto px-gutter">

        {/* ── Header ── */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-[1px] w-12 bg-primary" />
            <span className="text-primary font-label-caps uppercase tracking-widest text-[12px]">
              Case Studies
            </span>
          </div>
          <h1 className="font-headline-lg text-[36px] md:text-[48px] font-bold mb-6 leading-tight text-on-surface">
            Featured <span className="text-primary">Engineering</span> Projects.
          </h1>
          <p className="font-body-lg text-[16px] md:text-[18px] text-on-surface-variant max-w-2xl">
            A selection of high-performance web applications, microservices
            architectures, and enterprise-grade ecommerce solutions architected
            for scalability.
          </p>
        </header>

        {/* ── 3-column bento grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RESUME_DATA.projects.map((project) => (
            <div
              key={project.id}
              className="glass-card p-gutter flex flex-col group relative overflow-hidden"
            >
              {/* Image */}
              <div className="mb-6 overflow-hidden aspect-video bg-surface-container-high border border-outline-variant relative">
                {project.imageUrl && (
                  <img
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={project.imageUrl}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="flex-grow">
                {/* Tech chips — uppercase, primary colour, matching Stitch exactly */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-surface-container-high border border-outline-variant px-2 py-1 font-code-md text-xs text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className="font-headline-sm text-[24px] font-semibold mb-3 text-on-surface">
                  {project.title}
                </h3>
                <p className="text-on-surface-variant mb-6 font-body-md text-[15px] leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* View repo link */}
              <a
                className="inline-flex items-center gap-2 text-primary font-label-caps text-[12px] group/link"
                href={project.link || '#'}
              >
                VIEW REPOSITORY
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover/link:translate-x-1">
                  arrow_right_alt
                </span>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
