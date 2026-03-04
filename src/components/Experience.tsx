import React from "react";

export function Experience() {
  return (
    <>
      <section className="experience-section" id="experience">
        <div className="container">
          <div className="section-head" data-reveal>
            <div className="section-eyebrow">CAREER JOURNEY</div>
            <h2 className="section-title">Experience &amp; Education</h2>
          </div>

          <div className="exp-tabs">
            <button className="tab active" data-tab="work" id="tabWork" type="button">
              Work experience
            </button>
            <button className="tab" data-tab="education" id="tabEducation" type="button">
              Education
            </button>
          </div>

          <div className="exp-card" data-reveal>
            <div className="tab-content active" id="work">
              <div className="entry" data-reveal style={{ "--delay": "0ms" } as React.CSSProperties}>
                <div className="entry-header">
                  <h3>Radin Tavira — Tehran, Iran</h3>
                  <span className="date exp-date" data-duration="1 year 4 months">
                    Jan 2024 – Apr 2025
                  </span>
                </div>
                <div className="role">Full-Stack Developer</div>
                <ul>
                  <li>
                    Owned full-stack feature development using the PERN stack, reducing page load times by 40% through
                    code splitting and lazy loading.
                  </li>
                  <li>
                    Architected core backend API services using Node.js and Express, introducing RESTful standards and a
                    caching strategy that supported future feature development.
                  </li>
                  <li>
                    Led the migration of the frontend architecture from a React SPA to Next.js with server-side rendering
                    (SSR), improving SEO visibility and initial page load speed for content-heavy pages.
                  </li>
                  <li>
                    Refactored React component architecture and state management, eliminating unnecessary renders and
                    reducing component re-renders by 44% on high-traffic pages.
                  </li>
                </ul>
              </div>

              <div className="entry">
                <div className="entry-header">
                  <h3>Mohebi Modelling — Tehran, Iran</h3>
                  <span className="date exp-date" data-duration="9 months">
                    Feb 2023 – Oct 2023
                  </span>
                </div>
                <div className="role">Full-Stack Developer</div>
                <ul>
                  <li>
                    Architected a solo end-to-end portfolio and booking platform using React, TypeScript, and Tailwind
                    CSS, independently scoping and delivering the full application 30% faster than the estimated
                    timeline.
                  </li>
                  <li>
                    Designed a component-based UI architecture from scratch using React, TypeScript, and Zustand for
                    state management, reducing code duplication by 35% and cutting future feature development time by
                    27%.
                  </li>
                  <li>
                    Optimized frontend performance using React memo, useCallback, and Vite's build optimizations,
                    reducing average interaction latency by 120ms and improving overall responsiveness.
                  </li>
                  <li>
                    Owned the full post-launch lifecycle by gathering user feedback and shipping iterative improvements,
                    resolving 15 critical bugs and improving session duration by 22%.
                  </li>
                </ul>
              </div>
            </div>

            <div className="tab-content" id="education">
              <div className="entry">
                <div className="entry-header">
                  <h3>Tampere University of Applied Sciences</h3>
                  <span className="date exp-date" data-duration="Expected">
                    Expected graduation: 2028
                  </span>
                </div>

                <div className="edu-meta">
                  <span>Bachelor of Software Engineering</span>
                  <span className="gpa">GPA: 5.0 / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
