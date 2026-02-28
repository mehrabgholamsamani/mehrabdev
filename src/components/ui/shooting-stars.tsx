import React, { useEffect, useRef, useState } from "react";

type ClassValue = string | undefined | null | false;
function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  opacity: number;
  length: number;
}

interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}

const getRandomStartPoint = () => {
  const x = Math.random() * window.innerWidth;
  const y = -80;
  const angle = 50 + Math.random() * 28; // 50–78° for more directional variety
  return { x, y, angle };
};

// Max simultaneous stars per instance
const POOL_SIZE = 2;

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 3,
  maxSpeed = 7,
  minDelay = 4200,
  maxDelay = 9800,
  starColor = "#E9F0FF",
  trailColor = "#7DD3FC",
  starWidth = 120,
  starHeight = 2,
  className,
}) => {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Spawn loop
  useEffect(() => {
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;

    let cancelled = false;

    const addStar = () => {
      if (cancelled) return;
      const { x, y, angle } = getRandomStartPoint();
      // Per-star trail length: 60%–140% of the base starWidth
      const length = starWidth * (0.6 + Math.random() * 0.8);

      setStars(prev => [
        ...prev.slice(-(POOL_SIZE - 1)), // keep at most POOL_SIZE-1 existing stars
        {
          id: Date.now(),
          x,
          y,
          angle,
          speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
          opacity: 1,
          length,
        },
      ]);

      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      timeoutRef.current = window.setTimeout(addStar, delay);
    };

    addStar();

    return () => {
      cancelled = true;
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [minSpeed, maxSpeed, minDelay, maxDelay, starWidth]);

  // Animation loop — re-subscribes only when pool size changes, not every frame
  useEffect(() => {
    if (stars.length === 0) return;

    const tick = () => {
      setStars(prev => {
        if (prev.length === 0) return prev;
        return prev
          .map(s => {
            const rad = (s.angle * Math.PI) / 180;
            return {
              ...s,
              x: s.x + s.speed * Math.cos(rad),
              y: s.y + s.speed * Math.sin(rad),
              opacity: s.opacity - 0.008, // slower fade → ~2.1s lifespan at 60fps
            };
          })
          .filter(
            s =>
              s.opacity > 0 &&
              s.x > -260 &&
              s.x < window.innerWidth + 260 &&
              s.y > -260 &&
              s.y < window.innerHeight + 260
          );
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stars.length]);

  const gradId = useRef(`shooting-grad-${Math.random().toString(36).slice(2)}`);

  return (
    <svg className={cn("shooting-stars-svg", className)} aria-hidden="true">
      {stars.map(s => (
        <rect
          key={s.id}
          x={s.x}
          y={s.y}
          width={s.length}
          height={starHeight}
          fill={`url(#${gradId.current})`}
          opacity={s.opacity}
          transform={`rotate(${s.angle}, ${s.x}, ${s.y})`}
          rx={999}
        />
      ))}

      <defs>
        <linearGradient id={gradId.current} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={trailColor} stopOpacity={0} />
          <stop offset="55%" stopColor={trailColor} stopOpacity={0.40} />
          <stop offset="100%" stopColor={starColor} stopOpacity={1} />
        </linearGradient>
      </defs>
    </svg>
  );
};
