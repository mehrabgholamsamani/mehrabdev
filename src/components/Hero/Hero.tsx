import React, { useEffect, useState } from "react";

const WORDS = [
  "Full-Stack Developer",
  "MERN + Next.js",
  "REST APIs (Node/Express)",
  "Performance & DX",
];

function useTypewriter() {
  const [text, setText] = useState("");

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(WORDS[0]);
      return;
    }

    let w = 0, i = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const current = WORDS[w];
      if (!deleting) {
        i++;
        setText(current.slice(0, i));
        if (i >= current.length) {
          deleting = true;
          timer = setTimeout(tick, 1800);
          return;
        }
        timer = setTimeout(tick, 95);
      } else {
        i--;
        setText(current.slice(0, i));
        if (i <= 0) {
          deleting = false;
          w = (w + 1) % WORDS.length;
          timer = setTimeout(tick, 520);
          return;
        }
        timer = setTimeout(tick, 55);
      }
    };

    tick();
    return () => { alive = false; clearTimeout(timer); };
  }, []);

  return text;
}

type HeroProps = {
  onQuickContact?: () => void;
};

export function Hero({ onQuickContact }: HeroProps) {
  const typewriterText = useTypewriter();

  return (
    <main className="hero-section">
      <div className="container hero">
        <div className="left">
          <div className="hero-availability" aria-label="Open to opportunities">
            <span className="hero-dot" aria-hidden="true" />
            <span>Available for opportunities</span>
          </div>

          <h1>Hi, I'm Mehrab</h1>

          <div className="hero-subtitle">
            <span id="typewriter">{typewriterText}</span>
            <span className="tw-caret" aria-hidden="true" />
          </div>

          <div className="location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
                stroke="#9CA3AF"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="9" r="2.5" stroke="#9CA3AF" strokeWidth="1.5" />
            </svg>
            <span id="heroLocation">Tampere, Finland</span>
          </div>

          <p id="heroSummary">
            Full-Stack Developer building production-ready web apps end-to-end — clean React frontends, scalable
            Node/Express backends, and fast, well-structured REST APIs.
          </p>

          <div className="actions">
            <a
              className="btn btn-cv"
              id="btnCv"
              href="/Mehrab_Gholamsamani_Resume.pdf"
              download="Mehrab_Gholamsamani_Resume.pdf"
            >
              <span className="cv-text" id="cvText">
                Download CV
              </span>
              <span className="cv-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path
                    d="M7 11l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M4 21h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </a>

            <button className="btn btn-contact" id="btnContact" type="button" onClick={onQuickContact}>
              Quick Contact
            </button>
          </div>
        </div>

        <div className="right">
          <canvas id="canvas" />
        </div>
      </div>
    </main>
  );
}
