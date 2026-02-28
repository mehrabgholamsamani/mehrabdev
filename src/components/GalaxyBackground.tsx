import React, { useEffect, useRef } from "react";
import { ShootingStars } from "./ui/shooting-stars";

export function GalaxyBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = bgRef.current;
    if (!container) return;

    const STAR_COUNT = 120;
    const BIG_STAR_RATIO = 0.15;
    const TINT_RATIO = 0.2;

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement("span");
      star.className = "galaxy-star";

      if (Math.random() < BIG_STAR_RATIO) star.classList.add("big");
      if (Math.random() < TINT_RATIO) star.classList.add("tint");

      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";

      const duration = 2.5 + Math.random() * 4;
      const delay = Math.random() * 5;
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay = `${delay}s`;

      container.appendChild(star);
    }

    return () => {
      container.querySelectorAll(".galaxy-star").forEach(n => n.remove());
    };
  }, []);

  return (
    <div className="galaxy-bg" ref={bgRef} aria-hidden="true">

      <ShootingStars
        className="galaxy-shooting-layer"
        starColor="#E9F0FF"
        trailColor="#7DD3FC"
        minSpeed={3}
        maxSpeed={7}
        minDelay={1400}
        maxDelay={4000}
        starWidth={120}
        starHeight={2}
      />
      <ShootingStars
        className="galaxy-shooting-layer"
        starColor="#C7B3FF"
        trailColor="#67E8F9"
        minSpeed={2.5}
        maxSpeed={6}
        minDelay={2000}
        maxDelay={5500}
        starWidth={140}
        starHeight={2}
      />
    </div>
  );
}
