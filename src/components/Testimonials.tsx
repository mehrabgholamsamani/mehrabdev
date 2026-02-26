import React, { useCallback, useEffect, useMemo, useState } from "react";

type Testimonial = {
  text: string;
  name: string;
  role: string;
};

export function Testimonials() {
  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        text:
          "Working with Mehrab was absolutely fantastic. He created my modeling website quickly, exactly according to what I wanted, and even added some of his own suggestions that significantly improved the final result. Communication was smooth, everything was clear and well-organized. It's clear that he has experience and takes his work seriously.",
        name: "Ali Mohebi",
        role: "Owner, Mohebi Modelling Agency",
      },
      {
        text:
          "Before working together, our website was very basic and lacked optimization. It didn’t properly represent the quality or professionalism of our work. After the improvements, the website looks far more professional, well-structured, and credible. The overall presentation is clearer and makes a much stronger impression on potential customers. We’re very satisfied with the outcome and would confidently recommend his work to any business looking to upgrade their online presence.",
        name: "Alireza Teimouri",
        role: "Owner, Radin Taviira",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (testimonials.length <= 1) return;
      setFade(true);
      window.setTimeout(() => {
        setIndex((prev) => {
          const next = (prev + dir + testimonials.length) % testimonials.length;
          return next;
        });
        setFade(false);
      }, 180);
    },
    [testimonials.length]
  );

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev]);

  const t = testimonials[index];

  return (
    <section className="testimonials-section" id="testimonial">
      <div className="testi-head" data-reveal>
        <div className="testi-eyebrow">WHAT PEOPLE SAY</div>
        <h2 className="testi-title">Recommendation</h2>
      </div>

      <div className="testimonial-wrapper" data-reveal>
        <button className="nav-btn left" type="button" onClick={prev} aria-label="Previous recommendation">
          &#8249;
        </button>
        <button className="nav-btn right" type="button" onClick={next} aria-label="Next recommendation">
          &#8250;
        </button>

        <div className="quote-bg">”</div>

        <div className="testimonial-content">
          <p id="testimonial-text" style={{ opacity: fade ? 0 : 1, transition: "opacity 180ms ease" }}>
            {t.text}
            <span className="translated">(translated from Persian)</span>
          </p>

          <div className="testimonial-author">
            <div id="testimonial-name">{t.name}</div>
            <div id="testimonial-role">{t.role}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
