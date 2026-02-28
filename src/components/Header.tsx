import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import profileImg from "../assets/profile.jpg";

type HeaderProps = {
  onQuickContact?: () => void;
};

export function Header({ onQuickContact }: HeaderProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | null>(null);

  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);

  const tags = useMemo(
    () => ["React", "Node.js", "TypeScript", "REST APIs", "MongoDB"],
    []
  );

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const requestClose = () => {
    if (pinned) return;
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  // Popover keyboard / outside-click handling
  useEffect(() => {
    if (!open) return;

    const onDocPointerDown = (e: PointerEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (triggerRef.current?.contains(t)) return;
      if (popoverRef.current?.contains(t)) return;
      setPinned(false);
      setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPinned(false);
        setOpen(false);
        setMobileMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Photo lightbox: scroll-lock + Escape to close
  useEffect(() => {
    if (!photoOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhotoOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [photoOpen]);

  const handleTogglePinned = () => {
    clearCloseTimer();
    setOpen(true);
    setPinned((v) => !v);
  };

  return (
    <>
      <header className="site-header">
        <div className="nav-container">
          <div className="nav-inner">
            <div className="profile-root">
              <button
                ref={triggerRef}
                type="button"
                className="logo profile-trigger"
                aria-haspopup="dialog"
                aria-expanded={open}
                onMouseEnter={() => {
                  clearCloseTimer();
                  setOpen(true);
                }}
                onMouseLeave={requestClose}
                onFocus={() => {
                  clearCloseTimer();
                  setOpen(true);
                }}
                onBlur={(e) => {
                  const next = e.relatedTarget as Node | null;
                  if (next && popoverRef.current?.contains(next)) return;
                  requestClose();
                }}
                onClick={handleTogglePinned}
              >
                <img
                  className="profile-avatar"
                  src={profileImg}
                  alt="Mehrab Samani"
                  loading="eager"
                  decoding="async"
                />
                <span className="profile-name">Mehrab Samani</span>
              </button>

              {open && (
                <div
                  ref={popoverRef}
                  className="profile-popover profile-popover--open"
                  role="dialog"
                  aria-label="About Mehrab Samani"
                  tabIndex={-1}
                  onMouseEnter={() => {
                    clearCloseTimer();
                    setOpen(true);
                  }}
                  onMouseLeave={requestClose}
                >
                  <div className="profile-popover__row">
                    {/* Clickable avatar — opens the photo lightbox */}
                    <button
                      type="button"
                      className="profile-popover__img-btn"
                      onClick={() => setPhotoOpen(true)}
                      aria-label="View full photo of Mehrab Samani"
                    >
                      <img
                        className="profile-popover__img"
                        src={profileImg}
                        alt=""
                        aria-hidden="true"
                      />
                    </button>

                    <div className="profile-popover__meta">
                      <div className="profile-popover__title">Mehrab Samani</div>
                      <div className="profile-popover__subtitle">
                        Full‑Stack Developer <span className="profile-popover__dot" aria-hidden="true">•</span> Finland
                      </div>
                    </div>
                    <div className="profile-popover__available" aria-label="Available for work">
                      <span className="profile-popover__avail-dot" aria-hidden="true" />
                      Available
                    </div>
                  </div>

                  <p className="profile-popover__bio">
                    I build <strong>end-to-end</strong> web apps — React + TypeScript on the front, Node.js &amp; Express APIs on the back. Focused on <strong>clean architecture</strong>, performance, and shipping production-ready products.
                  </p>

                  <div className="profile-popover__actions" aria-label="Quick links">
                    <a className="profile-action profile-action--primary" href="mailto:mehrabgholamsamani@gmail.com" aria-label="Email Mehrab">
                      Email
                    </a>
                    <a
                      className="profile-action"
                      href="https://github.com/mehrabgholamsamani"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Mehrab on GitHub"
                    >
                      GitHub
                    </a>
                    <a
                      className="profile-action"
                      href="https://www.linkedin.com/in/mehrab-gholamsamani-853103393/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Mehrab on LinkedIn"
                    >
                      LinkedIn
                    </a>
                  </div>

                  <div className="profile-popover__tags" aria-label="Skills">
                    {tags.map((t) => (
                      <span key={t} className="profile-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <nav className="nav-links">
              <a href="#experience" id="navExperience">
                Work Experience
              </a>
              <a href="#testimonial" id="navTestimonials">
                Recommendations
              </a>
              <a href="#skills" id="navTechnologies">
                Technologies
              </a>
              <a href="#contact" id="navContact">
                Contact Me
              </a>
            </nav>

            <div className="nav-right">
              <div className="nav-social" aria-label="Social links">
                <a
                  className="nav-icon"
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

                <a
                  className="nav-icon"
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
                  className="nav-icon"
                  href="mailto:mehrabgholamsamani@gmail.com"
                  aria-label="Email"
                >
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

              <button
                type="button"
                onClick={onQuickContact}
                style={{ display: "none" }}
                aria-hidden="true"
                tabIndex={-1}
              />

              <button
                type="button"
                className={`nav-hamburger${mobileMenuOpen ? " is-open" : ""}`}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Work Experience</a>
            <a href="#testimonial" onClick={() => setMobileMenuOpen(false)}>Recommendations</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Technologies</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact Me</a>
          </nav>
        )}
      </header>

      {/* Photo lightbox — rendered via portal at document.body to escape header stacking context */}
      {photoOpen && createPortal(
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Mehrab Samani profile photo"
          onClick={() => setPhotoOpen(false)}
        >
          <div
            className="photo-lightbox__card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Full-bleed portrait photo */}
            <div className="photo-lightbox__photo-wrap">
              <img
                className="photo-lightbox__img"
                src={profileImg}
                alt="Mehrab Samani"
              />
            </div>

            {/* Info section below photo */}
            <div className="photo-lightbox__info">
              <div className="photo-lightbox__name">Mehrab Samani</div>
              <div className="photo-lightbox__role">
                Full‑Stack Developer <span className="photo-lightbox__dot" aria-hidden="true">·</span> Finland
              </div>
              <div className="photo-lightbox__badge" aria-label="Available for opportunities">
                <span className="profile-popover__avail-dot" aria-hidden="true" />
                Available for opportunities
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              className="photo-lightbox__close"
              onClick={() => setPhotoOpen(false)}
              aria-label="Close photo"
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
