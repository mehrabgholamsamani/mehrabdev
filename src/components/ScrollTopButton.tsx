import React from "react";

export function ScrollTopButton() {
  return (
    <button className="scrolltop-btn" id="scrollTopBtn" aria-label="Scroll to top" type="button">
      <svg className="scrolltop-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
        <path
          d="M8.2 13.2 12 9.4l3.8 3.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
