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
                  <h3>Radin Taviira — Tehran, Iran</h3>
                  <span className="date exp-date" data-duration="1 year 6 months">
                    Jan 2024 – Jun 2025
                  </span>
                </div>
                <div className="role">Full-Stack Developer</div>
                <ul>
                  <li>
                    Built full stack web applications using the MERN stack, reducing page load times by 40% and
                    improving user retention.
                  </li>
                  <li>
                    Designed and integrated RESTful APIs with Node.js and Express, cutting data fetch times by 31% across
                    production applications.
                  </li>
                  <li>
                    Migrated frontend architecture to Next.js with SSR, resulting in noticeably faster load times and
                    improved SEO rankings.
                  </li>
                  <li>
                    Optimized React state management and component architecture, reducing unnecessary re-renders by 44%
                    on high-traffic pages.
                  </li>
                </ul>
              </div>

              <div className="entry">
                <div className="entry-header">
                  <h3>Ali Mohebi Modelling — Tehran, Iran</h3>
                  <span className="date exp-date" data-duration="10 months">
                    Feb 2023 – Nov 2023
                  </span>
                </div>
                <div className="role">Full-Stack Developer</div>
                <ul>
                  <li>
                    Built and delivered a client-facing web application using React and JavaScript, contributing to the
                    client securing two professional modeling contracts.
                  </li>
                  <li>
                    Implemented component-based UI architecture with React, improving code maintainability and making
                    future updates significantly easier.
                  </li>
                  <li>
                    Maintained and iterated on the application post-launch, resolving bugs and improving performance
                    based on real user feedback.
                  </li>
                  <li>
                    Optimized frontend performance by reducing unnecessary DOM updates and event listeners, resulting in
                    a noticeably smoother user experience.
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
