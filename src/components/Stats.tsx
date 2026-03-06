import React, { useEffect, useRef, useState } from "react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 2,  suffix: "+", label: "Years Experience" },
  { value: 30, suffix: "+", label: "Projects Completed" },
  { value: 20, suffix: "+", label: "Technologies Mastered" },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
  }, [active, target, duration]);

  return count;
}

function StatCard({ item, index, visible }: { item: StatItem; index: number; visible: boolean }) {
  const count = useCountUp(item.value, 1400, visible);
  const delay = index * 120;

  return (
    <div
      className="stat-card"
      data-reveal
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      <div className="stat-card-inner">
        <div className="stat-number">
          <span className="stat-count">{count}</span>
          <span className="stat-suffix">{item.suffix}</span>
        </div>
        <div className="stat-label">{item.label}</div>
      </div>
    </div>
  );
}

export function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats-wrapper" ref={sectionRef}>
      <div className="stats-grid">
        {stats.map((item, i) => (
          <StatCard key={item.label} item={item} index={i} visible={visible} />
        ))}
      </div>
    </div>
  );
}
