import React from "react";

type Props = {
  email: string;
  onQuickContact?: () => void;
};

export function Contact({ email }: Props) {
  return (
    <section className="contact2-section" id="contact">
      <div className="container">
        <div className="section-head reveal-up">
          <div className="section-eyebrow">LET’S CONNECT</div>
          <h2 className="section-title">Get in Touch</h2>
        </div>

        <div className="contact2-card">
          <div className="contact2-glow" />

          <div className="contact2-left">
            <div className="contact2-eyebrow">
              Available for work
              <span className="contact2-status" aria-label="Open to work" />
            </div>
            <h3 className="contact2-heading">How Can I Help You?</h3>
            <p className="contact2-sub">
              Whether it’s a portfolio, landing page, or a React UI that needs polish, send a message and I’ll get back to
              you.
            </p>

            <div className="contact2-chips">
              <span className="contact2-chip">web Design</span>
              <span className="contact2-chip">UI polish</span>
              <span className="contact2-chip">Optimization</span>
              <span className="contact2-chip">Debugging</span>
              <span className="contact2-chip">User Experience</span>
            </div>
          </div>

          <div className="contact2-right">
            <div className="contact2-box">
              <div className="contact2-label">Email</div>
              <button className="contact2-email" id="copyEmailBtn" type="button">
                <span id="emailText">{email}</span>
                <span className="contact2-copyhint">Click to copy</span>
              </button>

              <div className="contact2-actions">
                <a className="contact2-btn primary" href={`mailto:${email}`}>
                  Send email
                </a>
                <a
                  className="contact2-btn secondary"
                  href="https://www.linkedin.com/in/mehrab-gholamsamani-853103393/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className="contact2-btn secondary"
                  href="https://github.com/mehrabgholamsamani"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>

            <div className="contact2-note">Have an idea or something that needs fixing? Send it over.</div>
          </div>

          <div className="contact2-toast" id="copyToast" aria-live="polite">
            Copied to clipboard ✅
          </div>
        </div>
      </div>
    </section>
  );
}
