import React from "react";

export function Skills() {
  return (
    <section className="skills-section" id="skills">
      <div className="container">
        <div className="section-head reveal-up">
          <div className="section-eyebrow">TECH STACKS</div>

          <div className="skills-head-row">
            <h2 className="section-title">Skills &amp; Tools</h2>
            <button className="skills-expand-btn" id="skillsExpandBtn" type="button" aria-expanded="false">
              Expand
            </button>
          </div>
        </div>

        <div className="skills-marquee-wrap" id="skillsMarqueeWrap">
          <div className="skills-marquee" style={{ "--duration": "55s", "--direction": "normal" } as React.CSSProperties}>
            <div className="skills-track">
              <div className="skills-list">
                <div className="skills-chip"><span className="skills-icon" data-icon="html" /><span>HTML5</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="css" /><span>CSS3</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="js" /><span>JavaScript (ES6+)</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="react" /><span>React.js</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="api" /><span>RESTful APIs</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="plug" /><span>API Integration</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="git" /><span>Git</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="github" /><span>GitHub</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="npm" /><span>npm</span></div>
              </div>

              <div className="skills-list" aria-hidden="true">
                <div className="skills-chip"><span className="skills-icon" data-icon="html" /><span>HTML5</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="css" /><span>CSS3</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="js" /><span>JavaScript (ES6+)</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="react" /><span>React.js</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="api" /><span>RESTful APIs</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="plug" /><span>API Integration</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="git" /><span>Git</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="github" /><span>GitHub</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="npm" /><span>npm</span></div>
              </div>
            </div>
          </div>

          <div className="skills-marquee" style={{ "--duration": "75s", "--direction": "reverse" } as React.CSSProperties}>
            <div className="skills-track">
              <div className="skills-list">
                <div className="skills-chip"><span className="skills-icon" data-icon="tailwind" /><span>Tailwind CSS</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="bootstrap" /><span>Bootstrap</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="sass" /><span>Sass</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="semantic" /><span>Semantic HTML</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="ux" /><span>UI/UX Principles</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="agile" /><span>Agile</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="scrum" /><span>Scrum Collaboration</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="figma" /><span>Figma</span></div>
              </div>

              <div className="skills-list" aria-hidden="true">
                <div className="skills-chip"><span className="skills-icon" data-icon="tailwind" /><span>Tailwind CSS</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="bootstrap" /><span>Bootstrap</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="sass" /><span>Sass</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="semantic" /><span>Semantic HTML</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="ux" /><span>UI/UX Principles</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="agile" /><span>Agile</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="scrum" /><span>Scrum Collaboration</span></div>
                <div className="skills-chip"><span className="skills-icon" data-icon="figma" /><span>Figma</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="skills-static" id="skillsStatic" hidden>
          <div className="skills-static-grid" id="skillsStaticGrid" />
        </div>
      </div>
    </section>
  );
}
