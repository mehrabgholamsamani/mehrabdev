import React, { useMemo, useRef } from "react";

import cryptodashShot from "../assets/project-screens/cryptodash.webp";
import boardlyShot from "../assets/project-screens/boardly.webp";
import lumiereShot from "../assets/project-screens/lumiere.webp";
import habitlyShot from "../assets/project-screens/habitly.webp";

type Project = {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  github: string;
  live: string;
  accent: "cyan" | "violet" | "amber" | "emerald";
  art: "ecommerce" | "charts" | "whiteboard" | "meditation";
  screenshot: string;
};

const GITHUB_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.5-.7 1.5-.7.2-.8.6-1.2 1-1.5-2.3-.3-4.8-1.1-4.8-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.5 4.7-4.8 5 .6.5 1.1 1.4 1.1 2.9v2.5c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
  </svg>
);

const projects: Project[] = [
  {
    name: "Lumiere",
    tagline: "Full-stack e-commerce",
    description:
      "Production-ready full-stack e-commerce app using React + TypeScript + Supabase with authentication, database persistence, RLS security, and responsive UI architecture.",
    tags: ["React", "TypeScript", "Supabase", "Auth", "RLS"],
    github: "https://github.com/mehrabgholamsamani/Lumiere",
    live: "https://lumiere-one-theta.vercel.app",
    accent: "violet",
    art: "ecommerce",
    screenshot: lumiereShot,
  },
  {
    name: "CryptoDash",
    tagline: "Analytics dashboard",
    description:
      "A modern crypto market dashboard with charts, indicators, watchlists, and theme customization — built with React, Vite, and Chart.js.",
    tags: ["React", "TypeScript", "Vite", "Chart.js", "UI"],
    github: "https://github.com/mehrabgholamsamani/CryptoDash",
    live: "https://crypto-dash-ten-eta.vercel.app",
    accent: "cyan",
    art: "charts",
    screenshot: cryptodashShot,
  },
  {
    name: "Boardly",
    tagline: "Interactive whiteboard",
    description: "A modern interactive whiteboard built with React + TypeScript.",
    tags: ["React", "TypeScript", "Canvas", "UX"],
    github: "https://github.com/mehrabgholamsamani/boardly",
    live: "https://boardly-fawn-sigma.vercel.app",
    accent: "amber",
    art: "whiteboard",
    screenshot: boardlyShot,
  },
  {
    name: "Habitly",
    tagline: "Meditation & focus (RN)",
    description:
      "A production-ready meditation and focus application built with Expo and React Native, emphasizing calm UX, local-first data storage, and sustainable habit formation.",
    tags: ["React Native", "Expo", "Local-first", "UX", "Habits"],
    github: "https://github.com/mehrabgholamsamani/Habitly",
    live: "https://habitly-theta-ruby.vercel.app",
    accent: "emerald",
    art: "meditation",
    screenshot: habitlyShot,
  },
];

function ProjectArt({ name, accent, kind }: { name: string; accent: Project["accent"]; kind: Project["art"] }) {
  const gid = `grad-${name.replace(/\s+/g, "-").toLowerCase()}`;

  const accentStops: Record<Project["accent"], [string, string]> = {
    cyan: ["rgba(34,211,238,0.55)", "rgba(34,211,238,0.08)"],
    violet: ["rgba(167,139,250,0.55)", "rgba(167,139,250,0.08)"],
    amber: ["rgba(251,191,36,0.45)", "rgba(251,191,36,0.08)"],
    emerald: ["rgba(16,185,129,0.45)", "rgba(16,185,129,0.08)"],
  };

  const [a0, a1] = accentStops[accent];

  const Icon = () => {
    switch (kind) {
      case "ecommerce":
        return (
          <g opacity="0.95">
            <path
              d="M96 74h128l-12 78H108L96 74Z"
              fill="none"
              stroke="rgba(255,255,255,0.80)"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M118 74c4-24 16-38 42-38s38 14 42 38"
              fill="none"
              stroke="rgba(255,255,255,0.65)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="128" cy="166" r="6" fill="rgba(255,255,255,0.75)" />
            <circle cx="196" cy="166" r="6" fill="rgba(255,255,255,0.75)" />
          </g>
        );
      case "charts":
        return (
          <g opacity="0.95">
            <path d="M92 176H236" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
            <path
              d="M104 164l36-44 30 22 36-52 26 18"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle cx="140" cy="120" r="5" fill="rgba(255,255,255,0.80)" />
            <circle cx="170" cy="142" r="5" fill="rgba(255,255,255,0.80)" />
            <circle cx="206" cy="90" r="5" fill="rgba(255,255,255,0.80)" />
          </g>
        );
      case "whiteboard":
        return (
          <g opacity="0.95">
            <rect x="94" y="74" width="132" height="92" rx="10" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="3" />
            <path d="M112 98h52" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
            <path d="M112 118h80" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
            <path d="M112 138h64" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
            <path d="M140 182l24-16" stroke="rgba(255,255,255,0.70)" strokeWidth="3" strokeLinecap="round" />
            <path d="M164 166l10 16" stroke="rgba(255,255,255,0.70)" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case "meditation":
      default:
        return (
          <g opacity="0.95">
            <path
              d="M160 84c0 16-13 28-28 28s-28-12-28-28 13-28 28-28 28 12 28 28Z"
              fill="none"
              stroke="rgba(255,255,255,0.80)"
              strokeWidth="3"
            />
            <path
              d="M98 178c10-22 26-34 50-34s40 12 50 34"
              fill="none"
              stroke="rgba(255,255,255,0.70)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path d="M120 156l-18 22" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
            <path d="M200 156l18 22" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <svg className="project-thumb-art" viewBox="0 0 320 220" role="presentation" aria-hidden="true">
      <defs>
        <radialGradient id={gid} cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor={a0} />
          <stop offset="45%" stopColor={a1} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id={`${gid}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="320" height="220" fill="rgba(0,0,0,0.28)" />
      <rect x="0" y="0" width="320" height="220" fill={`url(#${gid})`} />
      <rect x="0" y="0" width="320" height="220" fill={`url(#${gid}-sheen)`} />

      <g opacity="0.65">
        <circle cx="42" cy="46" r="1" fill="rgba(255,255,255,0.65)" />
        <circle cx="78" cy="84" r="1.2" fill="rgba(255,255,255,0.55)" />
        <circle cx="260" cy="62" r="1" fill="rgba(255,255,255,0.55)" />
        <circle cx="242" cy="140" r="1.1" fill="rgba(255,255,255,0.50)" />
        <circle cx="192" cy="48" r="0.9" fill="rgba(255,255,255,0.45)" />
        <circle cx="116" cy="168" r="1" fill="rgba(255,255,255,0.40)" />
        <circle cx="286" cy="178" r="0.9" fill="rgba(255,255,255,0.38)" />
        <circle cx="24" cy="170" r="0.8" fill="rgba(255,255,255,0.35)" />
      </g>

      <g opacity="0.55">
        <ellipse cx="170" cy="118" rx="120" ry="72" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
        <ellipse cx="160" cy="110" rx="92" ry="54" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
      </g>

      <Icon />
    </svg>
  );
}

export function Projects() {
  const cards = useRef<Map<string, HTMLElement>>(new Map());

  const handlers = useMemo(() => {
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

    const setTilt = (el: HTMLElement, rx: number, ry: number) => {
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    };

    return {
      onMove: (key: string) => (e: React.MouseEvent<HTMLElement>) => {
        const el = cards.current.get(key);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = clamp((px - 0.5) * 10, -8, 8);
        const rx = clamp((0.5 - py) * 10, -8, 8);
        setTilt(el, rx, ry);
      },
      onLeave: (key: string) => () => {
        const el = cards.current.get(key);
        if (!el) return;
        setTilt(el, 0, 0);
      },
      onKey: (live: string) => (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(live, "_blank", "noopener,noreferrer");
        }
      },
      onOpen: (live: string) => () => {
        window.open(live, "_blank", "noopener,noreferrer");
      },
      stop: (e: React.SyntheticEvent) => {
        e.stopPropagation();
      },
    };
  }, []);

  return (
    <>
      <section className="projects-section" id="projects">
        <div className="container">
          <div className="section-head" data-reveal>
            <div className="section-eyebrow">FEATURED WORK</div>
            <h2 className="section-title">Projects</h2>
          </div>

          <div className="projects-grid" data-reveal>
            {projects.map((p) => (
              <article
                key={p.name}
                className={`project-card project-accent-${p.accent}`}
                ref={(node) => {
                  if (node) cards.current.set(p.name, node);
                  else cards.current.delete(p.name);
                }}
                onMouseMove={handlers.onMove(p.name)}
                onMouseLeave={handlers.onLeave(p.name)}
                onClick={handlers.onOpen(p.live)}
                role="link"
                tabIndex={0}
                onKeyDown={handlers.onKey(p.live)}
                aria-label={`${p.name} — open live demo`}
              >
                <div className="project-thumb" aria-hidden="true">
                  <div className="project-thumb-inner">
                    <div className="project-thumb-screenshot" style={{ backgroundImage: `url(${p.screenshot})` }} />
                    <ProjectArt name={p.name} accent={p.accent} kind={p.art} />
                    <div className="project-badge">Featured</div>
                  </div>
                </div>

                <div className="project-content">
                  <h3>{p.name}</h3>
                  <div className="project-tagline">{p.tagline}</div>
                  <p>{p.description}</p>

                  <div className="project-tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a href={p.github} target="_blank" rel="noreferrer" className="project-link" onClick={handlers.stop}>
                      {GITHUB_ICON}
                      GitHub
                    </a>
                    <a href={p.live} target="_blank" rel="noreferrer" className="project-link project-link-live" onClick={handlers.stop}>
                      🔗 Live Demo
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
