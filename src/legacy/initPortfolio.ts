// @ts-nocheck
export function initPortfolio(): () => void {
  const cleanups: Array<() => void> = [];

  try {
    document.getElementById("year").textContent = new Date().getFullYear();
  } catch (err) {
    console.error('Init script failed (0)', err);
  }

  try {
    (() => {
      const items = document.querySelectorAll("[data-reveal]");
      if (!items.length) return;

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        items.forEach(el => el.classList.add("is-visible"));
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.18,
        rootMargin: "0px 0px -80px 0px"
      });

      items.forEach(el => io.observe(el));
    })();
  } catch (err) {
    console.error('Init script failed (2)', err);
  }

  try {
    (() => {
      const canvas = document.getElementById("canvas");
      if (!canvas) return;

      const PAGE_BG = "#0F0F0F";

      const cvBtn = document.querySelector(".btn-cv");
      const contactBtn = document.querySelector(".btn-contact");
      const contactNav = document.querySelector('a[href="#contact"]');
      const navExperience = document.querySelector('a[href="#experience"]');
      const navTestimonials = document.querySelector('a[href="#testimonial"]');
      const navTechnologies = document.querySelector('a[href="#skills"]');
      const heroName = document.querySelector(".left h1");

      const ctx = canvas.getContext("2d", { alpha: true });

      const FOV = 520;
      let RADIUS = 180;

      const isSmall = matchMedia("(max-width: 1000px)").matches;
      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

      const POINT_COUNT = reduceMotion ? 0 : (isSmall ? 340 : 572);

      const DPR_CAP = 1.5;

      const TARGET_FPS = 30;
      const FRAME_MS = 1000 / TARGET_FPS;

      const ROT_SPEED = 0.006;
      const FLICKER_RATE = 0.0009;

      const MORPH_LERP = 0.095;

      const HEART_SCALE = 1.08;
      const HEART_PULSE_AMPL = 0.018;
      const HEART_PULSE_SPEED = 1.35;

      const HEART_ALIGN_SECONDS = 0.28;
      const HEART_FACE_Y = 0;
      const HEART_FACE_X = 0;

      const HEART_ROT_SPEED = 0.0040;
      const HEART_MOUSE_INFLUENCE = 0.00055;

      const HEART_Y_SHIFT = 0.10;

      const NAME_SCALE_BASE = 1.0;
      const NAME_SCALE_HOVER = 1.085;
      const NAME_SCALE_LERP = 0.085;

      let width = 0, height = 0, dpr = 1;
      let angleY = 0;
      let mouseX = 0, mouseY = 0;

      let targetMode = "sphere";
      let hoverCone = false;
      let hoverHeart = false;
      let hoverTorus = false;
      let hoverDiamond = false;
      let hoverHelix = false;

      let heartPulseT = 0;
      let heartSpin = 0;
      let heartAlignT = 1;
      let heartAlignFromY = 0;
      let heartAlignFromX = 0;

      let nameScaleWanted = NAME_SCALE_BASE;
      let nameScale = NAME_SCALE_BASE;

      const px = new Float32Array(POINT_COUNT);
      const py = new Float32Array(POINT_COUNT);
      const pz = new Float32Array(POINT_COUNT);
      const ch = new Uint8Array(POINT_COUNT);

      const sxp = new Float32Array(POINT_COUNT);
      const syp = new Float32Array(POINT_COUNT);
      const szp = new Float32Array(POINT_COUNT);

      const cxp = new Float32Array(POINT_COUNT);
      const cyp = new Float32Array(POINT_COUNT);
      const czp = new Float32Array(POINT_COUNT);

      const hxp = new Float32Array(POINT_COUNT);
      const hyp = new Float32Array(POINT_COUNT);
      const hzp = new Float32Array(POINT_COUNT);

      const txp = new Float32Array(POINT_COUNT);
      const typ = new Float32Array(POINT_COUNT);
      const tzp = new Float32Array(POINT_COUNT);

      const dxp = new Float32Array(POINT_COUNT);
      const dyp = new Float32Array(POINT_COUNT);
      const dzp = new Float32Array(POINT_COUNT);

      const lxp = new Float32Array(POINT_COUNT);
      const lyp = new Float32Array(POINT_COUNT);
      const lzp = new Float32Array(POINT_COUNT);

      const sprite0 = document.createElement("canvas");
      const sprite1 = document.createElement("canvas");
      const sctx0 = sprite0.getContext("2d");
      const sctx1 = sprite1.getContext("2d");

      const glowSprite = document.createElement("canvas");
      const gctx = glowSprite.getContext("2d");

      function buildSprites() {
        const S = 22;
        sprite0.width = sprite0.height = S;
        sprite1.width = sprite1.height = S;

        [sctx0, sctx1].forEach(s => {
          s.clearRect(0, 0, S, S);
          s.fillStyle = "#fff";
          s.textAlign = "center";
          s.textBaseline = "middle";
          s.font = "16px sans-serif";
        });

        sctx0.fillText("✵", S / 2, S / 2);
        sctx1.fillText("★", S / 2, S / 2);

        const G = 72;
        glowSprite.width = glowSprite.height = G;
        const grad = gctx.createRadialGradient(G / 2, G / 2, 0, G / 2, G / 2, G / 2);
        grad.addColorStop(0, "rgba(255,255,255,0.40)");
        grad.addColorStop(0.35, "rgba(255,255,255,0.14)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        gctx.clearRect(0, 0, G, G);
        gctx.fillStyle = grad;
        gctx.beginPath();
        gctx.arc(G / 2, G / 2, G / 2, 0, Math.PI * 2);
        gctx.fill();
      }
      buildSprites();

      const projX = new Float32Array(POINT_COUNT);
      const projY = new Float32Array(POINT_COUNT);
      const projS = new Float32Array(POINT_COUNT);
      const projA = new Float32Array(POINT_COUNT);
      const projB = new Float32Array(POINT_COUNT);
      const projZ = new Float32Array(POINT_COUNT);
      const order = Array.from({ length: POINT_COUNT }, (_, i) => i);

      const Lx = -0.45, Ly = -0.22, Lz = 0.86;

      function generateSphereTargets() {
        for (let i = 0; i < POINT_COUNT; i++) {
          const u = Math.random();
          const v = Math.random();
          const theta = 2 * Math.PI * u;
          const phi = Math.acos(2 * v - 1);

          sxp[i] = RADIUS * Math.sin(phi) * Math.cos(theta);
          syp[i] = RADIUS * Math.sin(phi) * Math.sin(theta);
          szp[i] = RADIUS * Math.cos(phi);
        }
      }

      function generateConeTargets() {
        const h = RADIUS * 2.15;
        const baseR = RADIUS * 1.55;
        const yTip = -h * 0.55;
        const yBase = yTip + h;

        for (let i = 0; i < POINT_COUNT; i++) {
          const t = Math.random();
          const y = yTip + t * (yBase - yTip);

          const r = baseR * t;
          const a = Math.random() * Math.PI * 2;

          const rr = r * Math.sqrt(Math.random());
          cxp[i] = rr * Math.cos(a);
          cyp[i] = y;
          czp[i] = rr * Math.sin(a);
        }
      }

      function generateHeartTargets() {
        const scale = RADIUS * 0.085;
        const depth = RADIUS * 0.75;

        for (let i = 0; i < POINT_COUNT; i++) {
          const t = Math.random() * Math.PI * 2;

          let x = 16 * Math.pow(Math.sin(t), 3);
          let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
          y = -y;

          const zn = (Math.random() * 2 - 1);
          let z = zn * depth;

          const zAbs01 = Math.min(1, Math.abs(zn));
          const shrink = 1 - zAbs01 * 0.18;

          const inward = 0.78 + 0.22 * Math.random();
          x *= inward;
          y *= inward;

          x = x * scale * shrink;
          y = y * scale * shrink;

          const twist = z * 0.0016;
          const ct = Math.cos(twist), st = Math.sin(twist);
          const x2 = x * ct - z * st;
          const z2 = x * st + z * ct;

          hxp[i] = x2;
          hyp[i] = y - RADIUS * HEART_Y_SHIFT;
          hzp[i] = z2;
        }
      }

      function generateTorusTargets() {
        const R = RADIUS * 0.68;
        const r = RADIUS * 0.42;
        for (let i = 0; i < POINT_COUNT; i++) {
          const u = Math.random() * Math.PI * 2;
          const v = Math.random() * Math.PI * 2;
          txp[i] = (R + r * Math.cos(v)) * Math.cos(u);
          typ[i] = r * Math.sin(v);
          tzp[i] = (R + r * Math.cos(v)) * Math.sin(u);
        }
      }

      function generateDiamondTargets() {
        const rMax = RADIUS * 0.82;
        const hTop = RADIUS * 0.72;
        const hBot = RADIUS * 0.95;
        for (let i = 0; i < POINT_COUNT; i++) {
          const theta = Math.random() * Math.PI * 2;
          const isTop = Math.random() < 0.40;
          const t = Math.sqrt(Math.random());
          const r = rMax * t;
          dxp[i] = r * Math.cos(theta);
          dyp[i] = isTop ? -hTop * (1 - t) : hBot * (1 - t);
          dzp[i] = r * Math.sin(theta);
        }
      }

      function generateHelixTargets() {
        const R = RADIUS * 0.48;
        const turns = 3.2;
        const h = RADIUS * 2.25;
        for (let i = 0; i < POINT_COUNT; i++) {
          const strand = i % 2;
          const t = Math.random();
          const angle = t * turns * Math.PI * 2 + (strand === 0 ? 0 : Math.PI);
          const noise = (Math.random() - 0.5) * RADIUS * 0.10;
          lxp[i] = (R + noise) * Math.cos(angle);
          lyp[i] = t * h - h / 2;
          lzp[i] = (R + noise) * Math.sin(angle);
        }
      }

      function seedCurrentFromSphere() {
        for (let i = 0; i < POINT_COUNT; i++) {
          px[i] = sxp[i];
          py[i] = syp[i];
          pz[i] = szp[i];
          ch[i] = Math.random() > 0.5 ? 1 : 0;
        }
      }

      function resize() {
        const rect = canvas.getBoundingClientRect();
        width = Math.max(1, rect.width | 0);
        height = Math.max(1, rect.height | 0);

        dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
        canvas.width = (width * dpr) | 0;
        canvas.height = (height * dpr) | 0;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const minSide = Math.min(width, height);
        RADIUS = Math.max(140, minSide * 0.42);

        generateSphereTargets();
        generateConeTargets();
        generateHeartTargets();
        generateTorusTargets();
        generateDiamondTargets();
        generateHelixTargets();
        seedCurrentFromSphere();
      }

      let pendingMouse = false;
      canvas.addEventListener("mousemove", (e) => {
        if (pendingMouse) return;
        pendingMouse = true;
        requestAnimationFrame(() => {
          const r = canvas.getBoundingClientRect();
          mouseX = e.clientX - r.left - width / 2;
          mouseY = e.clientY - r.top - height / 2;
          pendingMouse = false;
        });
      }, { passive: true });

      let running = true;
      const io = new IntersectionObserver(([entry]) => {
        running = entry.isIntersecting && !document.hidden;
      }, { threshold: 0.12 });
      io.observe(canvas);

      document.addEventListener("visibilitychange", () => {
        running = !document.hidden;
      });

      window.addEventListener("resize", resize, { passive: true });
      resize();

      if (!POINT_COUNT) {
        ctx.fillStyle = PAGE_BG;
        ctx.fillRect(0, 0, width, height);
        return;
      }

      function resolveMode() {
        if (hoverHeart) return "heart";
        if (hoverHelix) return "helix";
        if (hoverDiamond) return "diamond";
        if (hoverTorus) return "torus";
        if (hoverCone) return "cone";
        return "sphere";
      }

      function startHeartAlign(currentRotY, currentRotX) {
        heartAlignT = 0;
        heartAlignFromY = currentRotY;
        heartAlignFromX = currentRotX;
        heartPulseT = 0;
        heartSpin = 0;
      }

      if (heroName) {
        heroName.addEventListener("mouseenter", () => { nameScaleWanted = NAME_SCALE_HOVER; });
        heroName.addEventListener("mouseleave", () => { nameScaleWanted = NAME_SCALE_BASE; });
      }

      if (cvBtn) {
        cvBtn.addEventListener("mouseenter", () => {
          hoverCone = true;
          targetMode = resolveMode();
        });
        cvBtn.addEventListener("mouseleave", () => {
          hoverCone = false;
          targetMode = resolveMode();
        });
      }

      [contactBtn, contactNav].filter(Boolean).forEach(el => {
        el.addEventListener("mouseenter", () => {
          hoverHeart = true;
          startHeartAlign(angleY, 0);
          targetMode = resolveMode();
        });
        el.addEventListener("mouseleave", () => {
          hoverHeart = false;
          targetMode = resolveMode();
          heartAlignT = 1;
        });
      });

      if (navExperience) {
        navExperience.addEventListener("mouseenter", () => { hoverTorus = true; targetMode = resolveMode(); });
        navExperience.addEventListener("mouseleave", () => { hoverTorus = false; targetMode = resolveMode(); });
      }

      if (navTestimonials) {
        navTestimonials.addEventListener("mouseenter", () => { hoverDiamond = true; targetMode = resolveMode(); });
        navTestimonials.addEventListener("mouseleave", () => { hoverDiamond = false; targetMode = resolveMode(); });
      }

      if (navTechnologies) {
        navTechnologies.addEventListener("mouseenter", () => { hoverHelix = true; targetMode = resolveMode(); });
        navTechnologies.addEventListener("mouseleave", () => { hoverHelix = false; targetMode = resolveMode(); });
      }

      function morphStep() {
        let tx, ty, tz;
        if (targetMode === "cone") {
          tx = cxp; ty = cyp; tz = czp;
        } else if (targetMode === "heart") {
          tx = hxp; ty = hyp; tz = hzp;
        } else if (targetMode === "torus") {
          tx = txp; ty = typ; tz = tzp;
        } else if (targetMode === "diamond") {
          tx = dxp; ty = dyp; tz = dzp;
        } else if (targetMode === "helix") {
          tx = lxp; ty = lyp; tz = lzp;
        } else {
          tx = sxp; ty = syp; tz = szp;
        }

        for (let i = 0; i < POINT_COUNT; i++) {
          px[i] += (tx[i] - px[i]) * MORPH_LERP;
          py[i] += (ty[i] - py[i]) * MORPH_LERP;
          pz[i] += (tz[i] - pz[i]) * MORPH_LERP;
        }
      }

      let lastT = performance.now();
      function loop(t) {
        requestAnimationFrame(loop);
        if (!running) return;

        if (t - lastT < FRAME_MS) return;
        const dt = (t - lastT) / 1000;
        lastT = t;

        angleY += ROT_SPEED;

        nameScale += (nameScaleWanted - nameScale) * NAME_SCALE_LERP;

        if (targetMode === "heart") {
          heartSpin += HEART_ROT_SPEED;
          heartPulseT += dt;

          if (heartAlignT < 1) {
            heartAlignT += dt / HEART_ALIGN_SECONDS;
            if (heartAlignT > 1) heartAlignT = 1;
          }
        }

        morphStep();
        drawFrame();
      }

      function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
      }

      function projectBounds(modeScale, cy, sy, cx, sx, zMin, zRange, padDrift = true) {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (let i = 0; i < POINT_COUNT; i++) {
          const X = px[i] * modeScale;
          const Y = py[i] * modeScale;
          const Z = pz[i] * modeScale;

          const x1 = X * cy - Z * sy;
          const z1 = X * sy + Z * cy;

          const y2 = Y * cx - z1 * sx;
          const z2 = Y * sx + z1 * cx;

          const depth01 = (z2 - zMin) / zRange;
          const persp = FOV / (FOV + z2);

          const drift = padDrift ? (depth01 - 0.5) * 6 : 0;

          const sxp = x1 * persp + drift;
          const syp = y2 * persp;

          if (sxp < minX) minX = sxp;
          if (sxp > maxX) maxX = sxp;
          if (syp < minY) minY = syp;
          if (syp > maxY) maxY = syp;
        }

        return { minX, maxX, minY, maxY };
      }

      function drawFrame() {
        ctx.clearRect(0, 0, width, height);

        const g = ctx.createRadialGradient(
          width / 2, height / 2, 30,
          width / 2, height / 2, Math.min(width, height) * 0.55
        );
        g.addColorStop(0, "rgba(255,255,255,0.055)");
        g.addColorStop(0.55, "rgba(255,255,255,0.018)");
        g.addColorStop(1, "rgba(15,15,15,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);

        let rotY = angleY + mouseX * 0.0014;
        let rotX = mouseY * 0.0014;

        if (targetMode === "heart") {
          const k = easeOutCubic(heartAlignT);

          const heartRotY = HEART_FACE_Y + heartSpin + mouseX * HEART_MOUSE_INFLUENCE;
          const heartRotX = HEART_FACE_X + mouseY * HEART_MOUSE_INFLUENCE;

          rotY = heartAlignFromY * (1 - k) + heartRotY * k;
          rotX = heartAlignFromX * (1 - k) + heartRotX * k;
        }

        const cy = Math.cos(rotY), sy = Math.sin(rotY);
        const cx = Math.cos(rotX), sx = Math.sin(rotX);

        const zMin = -RADIUS;
        const zMax = RADIUS;
        const zRange = zMax - zMin;

        let modeScale = 1;
        if (targetMode === "heart") {
          const s = (Math.sin(heartPulseT * HEART_PULSE_SPEED * Math.PI * 2) + 1) * 0.5;
          const bump = Math.pow(s, 2.6);
          modeScale = HEART_SCALE * (1 + HEART_PULSE_AMPL * bump);
        } else if (targetMode === "cone") {
          modeScale = 1.02;
        }

        modeScale *= nameScale;

        let centerX = width / 2;
        let centerY = height / 2;

        if (targetMode === "heart") {
          const PAD = 18;

          let b = projectBounds(modeScale, cy, sy, cx, sx, zMin, zRange, true);
          const rangeX = b.maxX - b.minX;
          const rangeY = b.maxY - b.minY;

          const fitX = (width - PAD * 2) / Math.max(1, rangeX);
          const fitY = (height - PAD * 2) / Math.max(1, rangeY);
          const fit = Math.min(1, fitX, fitY);
          modeScale *= fit;

          b = projectBounds(modeScale, cy, sy, cx, sx, zMin, zRange, true);
          const midX = (b.minX + b.maxX) / 2;
          const midY = (b.minY + b.maxY) / 2;

          centerX = width / 2 - midX;
          centerY = height / 2 - midY;
        }

        for (let i = 0; i < POINT_COUNT; i++) {
          const X = px[i] * modeScale;
          const Y = py[i] * modeScale;
          const Z = pz[i] * modeScale;

          const x1 = X * cy - Z * sy;
          const z1 = X * sy + Z * cy;

          const y2 = Y * cx - z1 * sx;
          const z2 = Y * sx + z1 * cx;

          const depth01 = (z2 - zMin) / zRange;
          const scale = FOV / (FOV + z2);

          const drift = (depth01 - 0.5) * 6;
          const x = x1 * scale + centerX + drift;
          const y = y2 * scale + centerY;

          const size = Math.max(6, Math.min(19, 15.5 * scale));

          const depthAlpha = 0.12 + depth01 * 0.95;
          const scaleAlpha = Math.min(1, Math.max(0.18, scale));
          let alpha = depthAlpha * scaleAlpha;
          if (alpha > 1) alpha = 1;

          const dx = (x - centerX) / (width * 0.42);
          const dy = (y - centerY) / (height * 0.42);
          const rr = dx * dx + dy * dy;
          const rim = Math.max(0, Math.min(1, (rr - 0.25) * 0.9));
          alpha *= (1 - rim * 0.25);

          const len = Math.sqrt(x1 * x1 + y2 * y2 + z2 * z2) + 1e-6;
          const nx = x1 / len, ny = y2 / len, nz = z2 / len;
          const ndotl = Math.max(0, nx * Lx + ny * Ly + nz * Lz);
          const bright = 0.38 + 0.62 * ndotl;

          projX[i] = x;
          projY[i] = y;
          projS[i] = size;
          projA[i] = alpha;
          projB[i] = bright;
          projZ[i] = z2;

          if (Math.random() < FLICKER_RATE) ch[i] ^= 1;
        }

        order.sort((a, b) => projZ[a] - projZ[b]);

        ctx.globalCompositeOperation = "lighter";
        for (let k = 0; k < order.length; k++) {
          const i = order[k];
          const a = projA[i];
          if (a < 0.06) continue;

          const frontBoost = projZ[i] > 0 ? 1 : 0.55;
          const ga = Math.min(1, a * 0.20 * projB[i] * frontBoost);
          if (ga < 0.02) continue;
          ctx.globalAlpha = ga;
          const gs = projS[i] * 2.0;
          ctx.drawImage(glowSprite, projX[i] - gs / 2, projY[i] - gs / 2, gs, gs);
        }

        ctx.globalCompositeOperation = "source-over";
        for (let k = 0; k < order.length; k++) {
          const i = order[k];
          const a = projA[i];
          if (a < 0.04) continue;
          const lit = 0.62 + 0.38 * projB[i];
          ctx.globalAlpha = Math.min(1, a * lit);
          const sprite = ch[i] ? sprite1 : sprite0;
          const s = projS[i];
          ctx.drawImage(sprite, projX[i] - s / 2, projY[i] - s / 2, s, s);
        }

        const vg = ctx.createRadialGradient(
          width / 2, height / 2, Math.min(width, height) * 0.25,
          width / 2, height / 2, Math.min(width, height) * 0.75
        );
        vg.addColorStop(0, "rgba(15,15,15,0)");
        vg.addColorStop(1, "rgba(15,15,15,0.06)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, width, height);

        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(loop);
    })();
  } catch (err) {
    console.error('Init script failed (3)', err);
  }

  try {
    (() => {
      const section = document.getElementById("skills");
      const btn = document.getElementById("skillsExpandBtn");
      const marqueeWrap = document.getElementById("skillsMarqueeWrap");
      const staticWrap = document.getElementById("skillsStatic");
      const staticGrid = document.getElementById("skillsStaticGrid");

      if (!section || !btn || !marqueeWrap || !staticWrap || !staticGrid) return;

      function buildStaticGridOnce(){
        if (staticGrid.childElementCount) return;

        const chips = marqueeWrap.querySelectorAll(".skills-chip");
        const seen = new Set();

        chips.forEach(chip => {
          const label = (chip.textContent || "").trim().replace(/\s+/g, " ");
          if (!label || seen.has(label)) return;
          seen.add(label);

          const clone = chip.cloneNode(true);
          clone.removeAttribute("aria-hidden");
          staticGrid.appendChild(clone);
        });
      }

      function setExpanded(expanded){
        section.classList.toggle("is-expanded", expanded);
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        btn.textContent = expanded ? "Collapse" : "Expand";

        if (expanded){
          buildStaticGridOnce();
          staticWrap.hidden = false;
        } else {
          staticWrap.hidden = true;
        }
      }

      const onToggle = () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        setExpanded(!expanded);
      };

      btn.addEventListener("click", onToggle);

      cleanups.push(() => {
        try { btn.removeEventListener("click", onToggle); } catch (e) { }
      });

      setExpanded(false);
    })();
  } catch (err) {
    console.error('Init script failed (4)', err);
  }

  try {
    (() => {
      const els = document.querySelectorAll(".reveal-up");
      if (!els.length) return;

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        els.forEach(el => el.classList.add("is-visible"));
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      }, { threshold: 0.25 });

      els.forEach(el => io.observe(el));
    })();
  } catch (err) {
    console.error('Init script failed (5)', err);
  }

  try {

      const tabs = document.querySelectorAll(".tab");
      const contents = document.querySelectorAll(".tab-content");

      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          tabs.forEach(t => t.classList.remove("active"));
          contents.forEach(c => c.classList.remove("active"));
          tab.classList.add("active");
          document.getElementById(tab.dataset.tab).classList.add("active");
        });
      });

      (function () {
        const btn = document.getElementById("copyEmailBtn");
        const toast = document.getElementById("copyToast");
        const emailText = document.getElementById("emailText");

        if (!btn || !toast || !emailText) return;

        btn.addEventListener("click", async () => {
          const email = emailText.textContent.trim();

          try {
            await navigator.clipboard.writeText(email);
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 1400);
          } catch (e) {
            const ta = document.createElement("textarea");
            ta.value = email;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);

            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 1400);
          }
        });
      })();

    (() => {
      const modal = document.getElementById("hcqModal");
      if (!modal) return;

      const heroContactBtn = document.querySelector(".btn-contact");

      const closeEls = modal.querySelectorAll("[data-hcq-close='true']");
      const textarea = document.getElementById("hcqMessage");
      const sendLink = document.getElementById("hcqSendEmail");

      const copyBtn = document.getElementById("hcqCopyBtn");
      const emailEl = document.getElementById("hcqEmailText");
      const toast = document.getElementById("hcqToast");

      const presetBtns = modal.querySelectorAll("[data-hcq-preset]");

      function openModal() {
        modal.classList.add("hcq-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        setTimeout(() => textarea?.focus(), 50);
      }

      function closeModal() {
        modal.classList.remove("hcq-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }

      if (heroContactBtn) {
        heroContactBtn.addEventListener("click", (e) => {
          e.preventDefault();
          openModal();
        });
      }

      closeEls.forEach(el => el.addEventListener("click", closeModal));

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("hcq-open")) closeModal();
      });

      presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const msg = btn.getAttribute("data-hcq-preset") || "";
          if (textarea) textarea.value = msg;
          textarea?.focus();
          updateMailto();
        });
      });

      function updateMailto() {
        if (!sendLink) return;
        const base = "mailto:mehrabgholamsamani@gmail.com";
        const body = (textarea?.value || "").trim();
        const subject = "Portfolio inquiry";
        const href = body
          ? `${base}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
          : base;
        sendLink.setAttribute("href", href);
      }

      textarea?.addEventListener("input", updateMailto);

      copyBtn?.addEventListener("click", async () => {
        const email = (emailEl?.textContent || "").trim();
        if (!email) return;

        try {
          await navigator.clipboard.writeText(email);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = email;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }

        if (toast) {
          toast.classList.add("hcq-show");
          setTimeout(() => toast.classList.remove("hcq-show"), 1100);
        }
      });

      updateMailto();
    })();
  } catch (err) {
    console.error('Init script failed (6)', err);
  }

  try {
    (() => {
      const btn = document.getElementById("scrollTopBtn");
      if (!btn) return;

      window.addEventListener("scroll", () => {
        if (window.scrollY > 420) btn.classList.add("show");
        else btn.classList.remove("show");
      }, { passive: true });

      function smoothScrollToTop() {
        const start = window.scrollY;
        const duration = 780;
        const startTime = performance.now();

        function easeOutCubic(t) {
          return 1 - Math.pow(1 - t, 3);
        }

        function frame(time) {
          const progress = Math.min((time - startTime) / duration, 1);
          const eased = easeOutCubic(progress);
          window.scrollTo(0, start * (1 - eased));
          if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
      }

      btn.addEventListener("click", smoothScrollToTop);
    })();
  } catch (err) {
    console.error('Init script failed (7)', err);
  }

  try {
    (() => {
      const heads = document.querySelectorAll("[data-sec-reveal]");
      if (!heads.length) return;

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        heads.forEach(h => h.classList.add("is-visible"));
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });

      heads.forEach(h => io.observe(h));
    })();
  } catch (err) {
    console.error('Init script failed (8)', err);
  }


  return () => {
    for (const fn of cleanups.splice(0)) {
      try { fn(); } catch (e) { console.error(e); }
    }
  };
}
