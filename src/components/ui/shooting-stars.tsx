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
  const angle = 62 + Math.random() * 18;
  return { x, y, angle };
};

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
  const [star, setStar] = useState<ShootingStar | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;

    let cancelled = false;

    const createStar = () => {
      if (cancelled) return;
      const { x, y, angle } = getRandomStartPoint();

      setStar({
        id: Date.now(),
        x,
        y,
        angle,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        opacity: 1,
      });

      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      timeoutRef.current = window.setTimeout(createStar, randomDelay);
    };

    createStar();

    return () => {
      cancelled = true;
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [minSpeed, maxSpeed, minDelay, maxDelay]);

  useEffect(() => {
    if (!star) return;

    const moveStar = () => {
      setStar((prev) => {
        if (!prev) return null;

        const rad = (prev.angle * Math.PI) / 180;
        const nx = prev.x + prev.speed * Math.cos(rad);
        const ny = prev.y + prev.speed * Math.sin(rad);
        const no = prev.opacity - 0.010;

        if (
          no <= 0 ||
          nx < -260 ||
          nx > window.innerWidth + 260 ||
          ny < -260 ||
          ny > window.innerHeight + 260
        ) {
          return null;
        }

        return { ...prev, x: nx, y: ny, opacity: no };
      });

      rafRef.current = requestAnimationFrame(moveStar);
    };

    rafRef.current = requestAnimationFrame(moveStar);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [star]);

  const gradId = useRef(`shooting-grad-${Math.random().toString(36).slice(2)}`);

  return (
    <svg className={cn("shooting-stars-svg", className)} aria-hidden="true">
      {star && (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth}
          height={starHeight}
          fill={`url(#${gradId.current})`}
          opacity={star.opacity}
          transform={`rotate(${star.angle}, ${star.x}, ${star.y})`}
          rx={999}
        />
      )}

      <defs>
        <linearGradient id={gradId.current} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={trailColor} stopOpacity={0} />
          <stop offset="55%" stopColor={trailColor} stopOpacity={0.22} />
          <stop offset="100%" stopColor={starColor} stopOpacity={1} />
        </linearGradient>
      </defs>
    </svg>
  );
};
