# Mehrab Samani — Full Stack Developer Portfolio

This repository contains the source code for my personal portfolio website.

The goal of this project is **not just visual presentation**, but to demonstrate **engineering decisions, architectural thinking, performance awareness, and production-ready frontend practices** in a real-world context.

---

## ✨ Overview

This portfolio is designed as an **interactive yet restrained** experience:

- Visually distinctive (galaxy / space theme)
- Performance-conscious
- Engineering-first, not animation-first
- Focused on clarity, credibility, and real-world skills

Every visual or interactive element exists **for a reason** — not decoration.

---

## 🧠 Engineering Philosophy

### 1. Performance First
- No unnecessary heavy libraries
- No autoplay videos
- No excessive DOM nodes
- Animations are **GPU-friendly** and throttled
- Canvas-based rendering is used where it makes sense

The site maintains smooth performance even on mid-range devices.

---

### 2. Intentional Animations
Animations are used to:
- Communicate depth and hierarchy
- Guide attention
- Reinforce the theme

They are **not** used for:
- Flashiness
- Infinite loops that distract
- Artificial “wow” effects

If an animation does not improve understanding or feel, it is removed.

---

### 3. Engineering Over Templates
well, this is **not** a UI kit or theme slapped together :)

Key systems were built manually:
- Custom canvas-based galaxy sphere
- Depth-aware particle rendering
- Shooting star system designed to feel ambient, not noisy
- Tilt interactions tuned for subtlety

The result is a site that feels *crafted*, not assembled.

---

## 🌌 Galaxy Sphere (Canvas)

The hero sphere is rendered using **HTML Canvas**, not WebGL or Three.js, because i felt like challanging myself, beside that you may ask

### Why Canvas?
- Lower overhead
- Full control over rendering
- No large dependencies
- Easier performance tuning

### Design Decisions
- Each point is rendered as a **cached glowing star sprite**
- Depth controls:
  - Size
  - Brightness
  - Opacity
- Additive blending (`lighter`) creates a natural glow effect
- No per-frame gradient creation (performance optimization)

This creates a 3D illusion while staying lightweight.

---

## 🌠 Shooting Stars

The shooting star system is:
- SVG-based
- Spawned sparingly
- Slow and cinematic

Design rules:
- Stars spawn from the top only (natural motion)
- Fade out instead of scaling unnaturally
- Limited concurrency (ambient, not distracting)

The effect supports `prefers-reduced-motion`.

---

## 🧩 Project Section Design

The projects section is intentionally designed for **scanability and exploration**:

- Entire cards are clickable
- Hover reveals **real project screenshots**
- Tilt effect is subtle and bounded
- No duplicate titles or descriptions in thumbnails

Each project is treated as a **product**, not a card.

---

## 🛠 Tech Stack

**Frontend**
- React
- TypeScript
- Tailwind CSS
- Canvas API
- SVG

**Full Stack / Backend Experience**
- Node.js
- Express
- REST APIs
- MongoDB
- Supabase
- Next.js (SSR)

**Tooling**
- Git / GitHub
- Vite
- ESLint
- Modern build tooling

---

## ♿ Accessibility & UX

- Clickable areas are large and intuitive
- Keyboard-friendly interactions
- Motion kept subtle
- Clear visual hierarchy
- Content-first layout

---

## 🚀 What This Portfolio Represents

This portfolio is meant to show that I:
- Think like an engineer, not just a designer
- Care about performance and maintainability
- Can build interactive experiences responsibly
- Understand real-world tradeoffs in frontend and full-stack development

---

## 📬 Contact

If you’re interested in collaboration or opportunities:

- GitHub: https://github.com/mehrabgholamsamani
- LinkedIn: https://linkedin.com/in/your-profile
- Email: your-email@example.com

---

## 📝 License

This project is for personal and professional showcase purposes.

Feel free to explore the code for learning or inspiration.
