import React, { useEffect, useRef, useState, memo } from "react";

/* ---- Types ---- */
interface SkillNode {
  id: string;
  name: string;
  category: string;
  description: string;
  experience: string;
  proficiency: number;
  keySkills: string[];
  usedIn: string[];
  color: string;
  orbitIndex: number;
  startAngle: number;
}

/* ---- Skill data ---- */
const SKILLS: SkillNode[] = [
  // Orbit 0 — inner (0.38 rad/s, r=115)
  {
    id: "react",
    name: "React",
    category: "Frontend Framework",
    description: "Build UIs with component-based architecture and reactive state management.",
    experience: "3+ years",
    proficiency: 90,
    keySkills: ["Hooks", "Context", "Performance", "Custom Hooks", "Suspense"],
    usedIn: ["Crypto analytics dashboard", "Real-time collaborative whiteboard"],
    color: "#61DAFB",
    orbitIndex: 0,
    startAngle: 0,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Type-Safe JavaScript",
    description: "Strongly-typed JavaScript for scalable applications with better IDE tooling.",
    experience: "2+ years",
    proficiency: 85,
    keySkills: ["Generics", "Type Guards", "Utility Types", "Decorators", "Declaration Files"],
    usedIn: ["This portfolio", "Full-stack SaaS platform"],
    color: "#3178C6",
    orbitIndex: 0,
    startAngle: Math.PI,
  },
  // Orbit 1 — mid (0.22 rad/s, r=185)
  {
    id: "nextjs",
    name: "Next.js",
    category: "React Framework",
    description: "Full-stack React framework with SSR, SSG, App Router, and built-in optimizations.",
    experience: "2+ years",
    proficiency: 88,
    keySkills: ["App Router", "SSR/SSG", "API Routes", "Image Optimization", "Middleware"],
    usedIn: ["E-commerce storefront", "Marketing landing pages"],
    color: "#ffffff",
    orbitIndex: 1,
    startAngle: 0,
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend Runtime",
    description: "Server-side JavaScript runtime for building scalable and fast network applications.",
    experience: "2+ years",
    proficiency: 82,
    keySkills: ["Express", "REST APIs", "WebSockets", "Streams", "EventEmitter"],
    usedIn: ["Real-time chat backend", "REST API services"],
    color: "#539E43",
    orbitIndex: 1,
    startAngle: Math.PI / 2,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Relational Database",
    description: "Advanced open-source relational database with powerful querying capabilities.",
    experience: "2+ years",
    proficiency: 78,
    keySkills: ["SQL", "Joins", "Indexing", "Transactions", "Views"],
    usedIn: ["User management system", "Analytics platform"],
    color: "#336791",
    orbitIndex: 1,
    startAngle: Math.PI,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "NoSQL Database",
    description: "Document-oriented NoSQL database for flexible, schema-free data storage at scale.",
    experience: "1.5+ years",
    proficiency: 75,
    keySkills: ["Aggregation", "Indexing", "Mongoose", "Atlas", "GridFS"],
    usedIn: ["Content management system", "Product catalog API"],
    color: "#47A248",
    orbitIndex: 1,
    startAngle: (3 * Math.PI) / 2,
  },
  // Orbit 2 — outer (0.14 rad/s, r=250)
  {
    id: "tailwind",
    name: "Tailwind",
    category: "CSS Framework",
    description: "Utility-first CSS framework for building custom designs rapidly without leaving HTML.",
    experience: "2+ years",
    proficiency: 92,
    keySkills: ["Utility Classes", "Responsive Design", "Dark Mode", "Custom Config", "Plugins"],
    usedIn: ["Multiple client projects", "Design system"],
    color: "#06B6D4",
    orbitIndex: 2,
    startAngle: 0,
  },
  {
    id: "git",
    name: "Git",
    category: "Version Control",
    description: "Distributed version control system for tracking code changes and team collaboration.",
    experience: "3+ years",
    proficiency: 88,
    keySkills: ["Branching", "Rebasing", "Cherry-pick", "Hooks", "Submodules"],
    usedIn: ["All projects", "Team collaboration"],
    color: "#F05032",
    orbitIndex: 2,
    startAngle: Math.PI / 2,
  },
  {
    id: "docker",
    name: "Docker",
    category: "Containerization",
    description: "Platform for developing, shipping, and running applications in lightweight containers.",
    experience: "1.5+ years",
    proficiency: 72,
    keySkills: ["Dockerfile", "Compose", "Volumes", "Networks", "Registry"],
    usedIn: ["Microservices deployment", "CI/CD pipeline"],
    color: "#2496ED",
    orbitIndex: 2,
    startAngle: Math.PI,
  },
  {
    id: "gitlab",
    name: "GitLab",
    category: "DevOps Platform",
    description: "Complete DevOps platform for source control, CI/CD pipelines, and team collaboration.",
    experience: "2+ years",
    proficiency: 80,
    keySkills: ["CI/CD Pipelines", "Merge Requests", "Issue Tracking", "Runners", "Registry"],
    usedIn: ["Team projects", "Automated deployments"],
    color: "#FC6D26",
    orbitIndex: 2,
    startAngle: (3 * Math.PI) / 2,
  },
];

// Speeds follow Kepler's third law: ω ∝ r^(-3/2)
// With r₀=145 as reference at ω₀=0.38:
//   ω₁ = 0.38 × (145/232)^1.5 ≈ 0.19
//   ω₂ = 0.38 × (145/318)^1.5 ≈ 0.12
const ORBIT_CONFIG = [
  { speed: 0.38, radius: 145 },
  { speed: 0.19, radius: 232 },
  { speed: 0.12, radius: 318 },
];

const BASE_STAGE_W = 860;
const BASE_STAGE_H = 650;
const CX = 430;
const CY = 325;

type OrbitGeometry = {
  radiusScale: number;
  tiltScale: number;
  zoomMin: number;
  zoomMax: number;
  ringOpacity: number;
  ringStroke: number;
  ringAlpha: number;
};

function getOrbitGeometry(stageWidth: number): OrbitGeometry {
  if (stageWidth <= 460) {
    return {
      radiusScale: 1.3,
      tiltScale: 0.88,
      zoomMin: 0.9,
      zoomMax: 1.05,
      ringOpacity: 0.96,
      ringStroke: 1.35,
      ringAlpha: 0.2,
    };
  }
  if (stageWidth <= 820) {
    return {
      radiusScale: 1.24,
      tiltScale: 0.94,
      zoomMin: 0.82,
      zoomMax: 1.16,
      ringOpacity: 0.92,
      ringStroke: 1.2,
      ringAlpha: 0.16,
    };
  }
  return {
    radiusScale: 1,
    tiltScale: 1,
    zoomMin: 0.72,
    zoomMax: 1.38,
    ringOpacity: 1,
    ringStroke: 1.05,
    ringAlpha: 0.1,
  };
}

/* ---- SVG Icons ---- */
function getIcon(id: string): React.ReactNode {
  switch (id) {
    case "react":
      return (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="2.4" fill="currentColor" />
          <ellipse cx="14" cy="14" rx="11.5" ry="4.2" stroke="currentColor" strokeWidth="1.4" />
          <ellipse cx="14" cy="14" rx="11.5" ry="4.2" stroke="currentColor" strokeWidth="1.4" transform="rotate(60 14 14)" />
          <ellipse cx="14" cy="14" rx="11.5" ry="4.2" stroke="currentColor" strokeWidth="1.4" transform="rotate(120 14 14)" />
        </svg>
      );
    case "typescript":
      return (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="3.5" y="3.5" width="21" height="21" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.4" />
          <text x="5.5" y="20.5" fontFamily="monospace" fontSize="11.5" fontWeight="800" fill="currentColor">TS</text>
        </svg>
      );
    case "nextjs":
      return (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="10.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 19V10.5L20.5 22.5H18L10.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "nodejs":
      return (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M14 3.5L23.5 8.75v10.5L14 24.5 4.5 19.25V8.75z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M14 9.5v5 M18 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 14.5l4 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "postgresql":
      return (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <ellipse cx="14" cy="9.5" rx="7.5" ry="3.2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M6.5 9.5v9c0 1.77 3.36 3.2 7.5 3.2s7.5-1.43 7.5-3.2v-9" stroke="currentColor" strokeWidth="1.4" />
          <path d="M6.5 14.5c0 1.77 3.36 3.2 7.5 3.2s7.5-1.43 7.5-3.2" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "mongodb":
      return (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M14 4.5c-3.5 3.5-3.5 9-3.5 11 0 2.3 1.6 3.8 3.5 4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 4.5c3.5 3.5 3.5 9 3.5 11 0 2.3-1.6 3.8-3.5 4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="20.3" x2="14" y2="23.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "tailwind":
      return (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M7 12c1-4 3.5-5 6-4.5s3.5 2.5 3 5c-1 4-3.5 5-6 4.5S6 15 7 12z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M16 16c1-4 3.5-5 6-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "git":
      return (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="2.2" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="20" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8" cy="20" r="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M14 11.8V8M8 10v3.5a2.5 2.5 0 002.5 2.5H12M20 10v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "docker":
      return (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="3.5" y="12" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9.5" y="12" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" />
          <rect x="15.5" y="12" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9.5" y="6.5" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.4" />
          <path d="M24 14.5c.5-1.5-.5-3-2.2-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M3.5 19.5C5.2 22 10 22 14 21c2.5-.5 4-2 4-3.5H3.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    case "gitlab":
      return (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M14 22.5L4.5 13l2.2-7 2.5 6.5h9.6l2.5-6.5 2.2 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---- StarField — static, memo so it never re-renders ---- */
const StarField = memo(function StarField() {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        x: (i * 137.508) % BASE_STAGE_W,
        y: (i * 97.3) % BASE_STAGE_H,
        r: 0.5 + (i % 3) * 0.4,
        op: 0.08 + (i % 5) * 0.055,
      })),
    []
  );
  return (
    <svg
      className="orbit-starfield"
      width={BASE_STAGE_W}
      height={BASE_STAGE_H}
      viewBox={`0 0 ${BASE_STAGE_W} ${BASE_STAGE_H}`}
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.op} />
      ))}
    </svg>
  );
});

/* ---- OrbitPopup ---- */
function OrbitPopup({ skill, onClose }: { skill: SkillNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="orbit-popup"
      role="dialog"
      aria-modal="true"
      aria-label={`${skill.name} details`}
    >
      <div className="orbit-popup-header">
        <div
          className="orbit-popup-icon"
          style={{ "--icon-color": skill.color } as React.CSSProperties}
        >
          {getIcon(skill.id)}
        </div>
        <div className="orbit-popup-titles">
          <div className="orbit-popup-name">{skill.name}</div>
          <div className="orbit-popup-cat">{skill.category}</div>
        </div>
        <button
          className="orbit-popup-x"
          type="button"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
      </div>

      <p className="orbit-popup-desc">{skill.description}</p>

      <div className="orbit-popup-meta">
        <div>
          <div className="orbit-popup-meta-lbl">EXPERIENCE</div>
          <div className="orbit-popup-meta-val">{skill.experience}</div>
        </div>
        <div>
          <div className="orbit-popup-meta-lbl">PROFICIENCY</div>
          <div className="orbit-popup-bar-row">
            <div className="orbit-popup-bar">
              <div
                className="orbit-popup-bar-fill"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
            <span className="orbit-popup-bar-pct">{skill.proficiency}%</span>
          </div>
        </div>
      </div>

      <div className="orbit-popup-group">
        <div className="orbit-popup-lbl">KEY SKILLS</div>
        <div className="orbit-popup-chips">
          {skill.keySkills.map((k) => (
            <span key={k} className="orbit-popup-chip">
              {k}
            </span>
          ))}
        </div>
      </div>

      <div className="orbit-popup-group">
        <div className="orbit-popup-lbl">USED IN</div>
        <ul className="orbit-popup-uses">
          {skill.usedIn.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---- Static fallback (reduced-motion) ---- */
function OrbitStatic({ onSelect }: { onSelect: (s: SkillNode) => void }) {
  return (
    <div className="orbit-static">
      {SKILLS.map((skill) => (
        <button
          key={skill.id}
          className="orbit-static-item"
          style={{ "--icon-color": skill.color } as React.CSSProperties}
          type="button"
          onClick={() => onSelect(skill)}
          aria-label={`${skill.name}: ${skill.category}`}
        >
          <div className="orbit-static-icon">{getIcon(skill.id)}</div>
          <span className="orbit-static-label">{skill.name}</span>
        </button>
      ))}
    </div>
  );
}

/* ---- Main Component ---- */
export function TechOrbit() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 820px)").matches;
    return prefersReduced && !isMobile;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 820px)");
    const sync = () => setReducedMotion(rm.matches && !mobile.matches);
    sync();
    rm.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    return () => {
      rm.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
    };
  }, []);

  // All mutable animation state — never triggers React re-renders
  const anim = useRef({
    angles: SKILLS.map((s) => s.startAngle),
    rotOffset: 0,
    tiltFactor: 0.42,
    zoomScale: 1,
    paused: false,
    lastTime: 0,
    dragging: false,
    dragX: 0,
    dragY: 0,
    tapX: 0,
    tapY: 0,
    tapT: 0,
    hoveredId: null as string | null,
    selectedId: null as string | null,
  });

  const iconEls = useRef<(HTMLDivElement | null)[]>([]);
  const ringEls = useRef<(SVGEllipseElement | null)[]>([]);

  /* ---- RAF animation loop ---- */
  useEffect(() => {
    if (reducedMotion) return;
    let raf: number;
    const a = anim.current;

    function tick(ts: number) {
      const dt = Math.min((ts - (a.lastTime || ts)) / 1000, 0.05);
      a.lastTime = ts;

      if (!a.paused) {
        for (let i = 0; i < SKILLS.length; i++) {
          a.angles[i] += ORBIT_CONFIG[SKILLS[i].orbitIndex].speed * dt;
        }
      }

      const stage = stageRef.current;
      const stageW = stage?.clientWidth || BASE_STAGE_W;
      const stageH = stage?.clientHeight || BASE_STAGE_H;
      const scaleX = stageW / BASE_STAGE_W;
      const scaleY = stageH / BASE_STAGE_H;
      const geometry = getOrbitGeometry(stageW);
      const orbitScale = geometry.radiusScale * a.zoomScale;
      const effectiveTilt = a.tiltFactor * geometry.tiltScale;

      for (let i = 0; i < SKILLS.length; i++) {
        const el = iconEls.current[i];
        if (!el) continue;
        const radius = ORBIT_CONFIG[SKILLS[i].orbitIndex].radius * orbitScale;
        const angle = a.angles[i] + a.rotOffset;
        const iconHalf = (el.offsetWidth || 40) / 2;
        const x = CX * scaleX + radius * scaleX * Math.cos(angle) - iconHalf;
        const y = CY * scaleY + radius * scaleY * Math.sin(angle) * effectiveTilt - iconHalf;
        const z = Math.sin(angle);
        const s = 0.72 + 0.28 * ((z + 1) / 2);
        el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(${s.toFixed(4)})`;
        el.style.zIndex = z > 0 ? "15" : "5";
        const activeId = a.hoveredId ?? a.selectedId;
        el.style.opacity = activeId && activeId !== SKILLS[i].id ? "0.22" : "1";
      }

      for (let i = 0; i < 3; i++) {
        const el = ringEls.current[i];
        if (!el) continue;
        const radius = ORBIT_CONFIG[i].radius * orbitScale;
        el.setAttribute("rx", radius.toFixed(1));
        el.setAttribute("ry", (radius * effectiveTilt).toFixed(2));
        el.style.stroke = `rgba(255,255,255,${geometry.ringAlpha})`;
        el.style.opacity = geometry.ringOpacity.toFixed(2);
        el.style.strokeWidth = `${geometry.ringStroke}px`;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  /* ---- Drag + Wheel handlers ---- */
  useEffect(() => {
    if (reducedMotion) return;
    const stage = stageRef.current;
    if (!stage) return;
    const a = anim.current;

    const onPD = (e: PointerEvent) => {
      // Do NOT call setPointerCapture here — it would steal pointerup from icon elements
      a.dragging = false;
      a.dragX = e.clientX;
      a.dragY = e.clientY;
      a.tapX = e.clientX;
      a.tapY = e.clientY;
      a.tapT = Date.now();
    };
    const onPM = (e: PointerEvent) => {
      const dx = e.clientX - a.dragX;
      const dy = e.clientY - a.dragY;
      if (!a.dragging) {
        // Start drag only after moving >4px to keep taps clean
        if (Math.hypot(e.clientX - a.tapX, e.clientY - a.tapY) < 4) return;
        a.dragging = true;
      }
      a.rotOffset += dx * 0.0012;
      a.tiltFactor = Math.max(
        0.18,
        Math.min(0.72, a.tiltFactor + dy * 0.0005)
      );
      a.dragX = e.clientX;
      a.dragY = e.clientY;
    };
    const onPU = () => {
      a.dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const geometry = getOrbitGeometry(stage.clientWidth || BASE_STAGE_W);
      a.zoomScale = Math.max(
        geometry.zoomMin,
        Math.min(geometry.zoomMax, a.zoomScale - e.deltaY * 0.0003)
      );
    };

    stage.addEventListener("pointerdown", onPD);
    stage.addEventListener("pointermove", onPM);
    stage.addEventListener("pointerup", onPU);
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("pointerdown", onPD);
      stage.removeEventListener("pointermove", onPM);
      stage.removeEventListener("pointerup", onPU);
      stage.removeEventListener("wheel", onWheel);
    };
  }, [reducedMotion]);

  function onIconPD(e: React.PointerEvent) {
    e.stopPropagation();
    anim.current.tapX = e.clientX;
    anim.current.tapY = e.clientY;
    anim.current.tapT = Date.now();
  }

  function onIconPU(e: React.PointerEvent, skill: SkillNode) {
    e.stopPropagation();
    const a = anim.current;
    const d = Math.hypot(e.clientX - a.tapX, e.clientY - a.tapY);
    if (d < 6 && Date.now() - a.tapT < 300) {
      anim.current.selectedId = skill.id;
      setSelectedSkill(skill);
    }
  }

  function onIconEnter(skill: SkillNode) {
    anim.current.paused = true;
    anim.current.hoveredId = skill.id;
  }

  function onIconLeave() {
    anim.current.paused = false;
    anim.current.hoveredId = null;
  }

  function onClose() {
    anim.current.paused = false;
    anim.current.hoveredId = null;
    anim.current.selectedId = null;
    setSelectedSkill(null);
  }

  return (
    <section className="orbit-section" id="tech-orbit">
      <div className="container">
        {reducedMotion ? (
          <OrbitStatic onSelect={setSelectedSkill} />
        ) : (
          <div
            className="orbit-stage"
            ref={stageRef}
            role="img"
            aria-label="Technology orbit visualization — drag to rotate, scroll to zoom, click icons for details"
          >
            <StarField />

            {/* Orbit ring ellipses */}
            <svg
              className="orbit-rings-svg"
              width={BASE_STAGE_W}
              height={BASE_STAGE_H}
              viewBox={`0 0 ${BASE_STAGE_W} ${BASE_STAGE_H}`}
              aria-hidden="true"
            >
              {[0, 1, 2].map((i) => (
                <ellipse
                  key={i}
                  ref={(el) => {
                    ringEls.current[i] = el;
                  }}
                  cx={CX}
                  cy={CY}
                  rx={ORBIT_CONFIG[i].radius}
                  ry={ORBIT_CONFIG[i].radius * 0.42}
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
              ))}
            </svg>

            {/* Center moon */}
            <div className="orbit-center" aria-hidden="true">
              <div className="orbit-planetary-ring orbit-planetary-ring--back" />
              <div className="orbit-center-core">
                <svg className="orbit-moon-craters" viewBox="0 0 80 80" aria-hidden="true">
                  <g opacity="0.92">
                    <circle cx="26" cy="30" r="8.8" fill="rgba(0,0,0,0.14)" />
                    <circle cx="24.4" cy="28.6" r="5.6" fill="rgba(255,255,255,0.11)" />
                    <circle cx="27.6" cy="31.5" r="5.2" fill="rgba(0,0,0,0.19)" />
                  </g>
                  <g opacity="0.88">
                    <circle cx="52" cy="22" r="6.1" fill="rgba(0,0,0,0.13)" />
                    <circle cx="50.9" cy="21.1" r="3.9" fill="rgba(255,255,255,0.10)" />
                    <circle cx="53.2" cy="23.1" r="3.7" fill="rgba(0,0,0,0.17)" />
                  </g>
                  <g opacity="0.9">
                    <circle cx="44" cy="50" r="6.8" fill="rgba(0,0,0,0.12)" />
                    <circle cx="42.7" cy="48.8" r="4.3" fill="rgba(255,255,255,0.09)" />
                    <circle cx="45.1" cy="51.2" r="4.2" fill="rgba(0,0,0,0.16)" />
                  </g>
                  <g opacity="0.85">
                    <circle cx="20" cy="54" r="4.3" fill="rgba(0,0,0,0.11)" />
                    <circle cx="19.2" cy="53.2" r="2.7" fill="rgba(255,255,255,0.08)" />
                    <circle cx="20.8" cy="54.9" r="2.6" fill="rgba(0,0,0,0.14)" />
                  </g>
                  <g opacity="0.85">
                    <circle cx="60" cy="44" r="3.9" fill="rgba(0,0,0,0.11)" />
                    <circle cx="59.3" cy="43.3" r="2.4" fill="rgba(255,255,255,0.08)" />
                    <circle cx="60.7" cy="44.8" r="2.3" fill="rgba(0,0,0,0.14)" />
                  </g>
                </svg>
                <div className="orbit-ring-shadow" />
              </div>
              <div className="orbit-planetary-ring orbit-planetary-ring--front" />
            </div>

            {/* Orbiting icons */}
            {SKILLS.map((skill, i) => (
              <div
                key={skill.id}
                ref={(el) => {
                  iconEls.current[i] = el;
                }}
                className="orbit-icon"
                style={
                  { "--icon-color": skill.color } as React.CSSProperties
                }
                onPointerDown={onIconPD}
                onPointerUp={(e) => onIconPU(e, skill)}
                onMouseEnter={() => onIconEnter(skill)}
                onMouseLeave={onIconLeave}
                role="button"
                tabIndex={0}
                aria-label={`${skill.name}: ${skill.category}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    anim.current.selectedId = skill.id;
                    setSelectedSkill(skill);
                  }
                }}
              >
                <div className="orbit-icon-halo" />
                <div className="orbit-icon-inner">{getIcon(skill.id)}</div>
                <div className="orbit-icon-label">{skill.name}</div>
              </div>
            ))}

            {/* Detail popup */}
            {selectedSkill && (
              <OrbitPopup skill={selectedSkill} onClose={onClose} />
            )}
          </div>
        )}

        {/* Popup for reduced-motion mode */}
        {reducedMotion && selectedSkill && (
          <OrbitPopup skill={selectedSkill} onClose={onClose} />
        )}

        <p className="orbit-hint" aria-hidden="true">
          Drag to rotate · Scroll to zoom · Click for details
        </p>
      </div>
    </section>
  );
}

