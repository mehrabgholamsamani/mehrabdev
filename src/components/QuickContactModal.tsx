import React from "react";

type Props = {
  email: string;
};

export function QuickContactModal({ email }: Props) {
  return (
    <div className="hcq-modal" id="hcqModal" aria-hidden="true">
      <div className="hcq-backdrop" data-hcq-close="true" />

      <div className="hcq-panel" role="dialog" aria-modal="true" aria-labelledby="hcqTitle">
        <div className="hcq-topbar">
          <div className="hcq-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="hcq-title" id="hcqTitle">
            How Can I Help You
          </div>

          <button className="hcq-x" type="button" aria-label="Close" data-hcq-close="true">
            ×
          </button>
        </div>

        <div className="hcq-body">
          <div className="hcq-left">
            <div className="hcq-terminal">
              <div className="hcq-line">
                <span className="hcq-prompt">mehrab@portfolio</span>
                <span className="hcq-sep">:</span>
                <span className="hcq-path">~/contact</span>
                <span className="hcq-sep">$</span>
                <span className="hcq-cmd">compose</span>
              </div>

              <label className="hcq-label" htmlFor="hcqMessage">
                Message
              </label>
              <textarea
                id="hcqMessage"
                className="hcq-textarea"
                rows={5}
                placeholder="Write a quick message… (optional)"
              />

              <div className="hcq-presets" aria-label="Message presets">
                <button
                  className="hcq-chip"
                  type="button"
                  data-hcq-preset="Hey Mehrab — I saw your portfolio and I’d love to talk about a full-stack role. Are you free this week?"
                >
                  Job opportunity
                </button>
                <button
                  className="hcq-chip"
                  type="button"
                  data-hcq-preset="Hey! I have a small project and I’d love your help polishing the UI. Can I share details?"
                >
                  Project
                </button>
                <button
                  className="hcq-chip"
                  type="button"
                  data-hcq-preset="Quick feedback: your hero interaction is insane — I wanted to reach out and say hi."
                >
                  Feedback
                </button>
              </div>

              <div className="hcq-sendrow">
                <a className="hcq-send" id="hcqSendEmail" href={`mailto:${email}`}>
                  Send via email →
                </a>
                <span className="hcq-hint">Adds your message automatically.</span>
              </div>
            </div>
          </div>

          <div className="hcq-right">
            <div className="hcq-channel">
              <div className="hcq-channel-head">
                <span className="hcq-kicker">Primary</span>
                <span className="hcq-badge">fastest</span>
              </div>

              <button className="hcq-copy" id="hcqCopyBtn" type="button">
                <span className="hcq-email" id="hcqEmailText">
                  {email}
                </span>
                <span className="hcq-copyhint">Click to copy</span>
              </button>
            </div>

            <div className="hcq-grid">
              <a
                className="hcq-card"
                href="https://www.linkedin.com/in/mehrab-gholamsamani-853103393/"
                target="_blank"
                rel="noreferrer"
              >
                <div className="hcq-card-title">LinkedIn</div>
                <div className="hcq-card-sub">Let’s connect</div>
              </a>

              <a className="hcq-card" href="https://github.com/mehrabgholamsamani" target="_blank" rel="noreferrer">
                <div className="hcq-card-title">GitHub</div>
                <div className="hcq-card-sub">Code &amp; repos</div>
              </a>
            </div>

            <div className="hcq-note">I’m open to opportunities and collaborations.</div>
          </div>

          <div className="hcq-toast" id="hcqToast" aria-live="polite">
            Copied ✅
          </div>
        </div>
      </div>
    </div>
  );
}
