import React from "react";

export function Footer() {
  return (
    <footer className="site-footer">
      <hr className="footer-divider" />

      <div className="footer-inner">
        <div className="footer-icons" aria-label="Social links">
          <a
            className="footer-icon icon-linkedin"
            href="https://www.linkedin.com/in/mehrab-gholamsamani-853103393/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6.5 9.5V18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M6.5 6.2h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M10.5 9.5v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M10.5 13.3c0-2.1 1.2-3.9 3.6-3.9 2.6 0 3.4 1.7 3.4 4v5.1"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </a>

          <a
            className="footer-icon icon-github"
            href="https://github.com/mehrabgholamsamani"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2.5c-5.2 0-9.5 4.1-9.5 9.2 0 4.1 2.7 7.5 6.5 8.7.5.1.7-.2.7-.5v-1.7c-2.7.6-3.2-1.2-3.2-1.2-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.4-1.1.7-1.4-2.1-.2-4.3-1-4.3-4.6 0-1 .4-1.8 1-2.5-.1-.2-.4-1.2.1-2.4 0 0 .8-.2 2.6 1a8.9 8.9 0 0 1 4.8 0c1.8-1.2 2.6-1 2.6-1 .5 1.2.2 2.2.1 2.4.6.7 1 1.5 1 2.5 0 3.6-2.2 4.4-4.3 4.6.4.3.8 1 .8 2v2.6c0 .3.2.6.7.5 3.8-1.2 6.5-4.6 6.5-8.7 0-5.1-4.3-9.2-9.5-9.2Z"
                fill="currentColor"
              />
            </svg>
          </a>

          <a className="footer-icon icon-email" href="mailto:mehrabgholamsamani@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4.5 7.5h15v10h-15v-10Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 8.5 12 13l6.5-4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="footer-text">
          © <span id="year" /> Mehrab Samani | Crafted with <span className="footer-heart">❤️</span> using TypeScript and React
        </div>
      </div>
    </footer>
  );
}
