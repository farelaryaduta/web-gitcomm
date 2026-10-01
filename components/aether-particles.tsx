"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  tone: number;
  degree: number;
};

type Palette = {
  dot: string;
  line: string;
  lineAlpha: number;
  dotAlpha: number;
};

const CELL = 190;
const MAX_PARTICLES = 95;
const MOBILE_PARTICLES = 42;
const MOBILE_BREAKPOINT = 768;
const POINTER_REACH = 150;
const LINK_GLOW_REACH = 170;
/** Area per particle. Larger means sparser, so the network reads as structure. */
const AREA_PER_PARTICLE = 11500;

/** Bounded PRNG, so the field is deterministic across renders. */
function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function AetherParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const host = canvas.parentElement;
    if (!host) return;

    // The overlay is pointer-events-none so it never blocks hero content, so the
    // interactive surface has to be the section that actually receives events.
    const surface = canvas.closest("section") ?? host;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const random = createRandom(0x9e3779b9);
    const pointer = { x: -9999, y: -9999, active: false };

    const start = performance.now();

    let particles: Particle[] = [];
    let frame = 0;
    let disposed = false;
    let onScreen = true;
    let pageVisible = true;
    let dpr = 1;
    let cssWidth = 1;
    let cssHeight = 1;
    let palette: Palette = {
      dot: "#a5a59d",
      line: "#c2c2bc",
      lineAlpha: 0.16,
      dotAlpha: 0.4,
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;

    const readPalette = () => {
      const styles = getComputedStyle(host);
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      const pick = (name: string, fallback: string) =>
        styles.getPropertyValue(name).trim() || fallback;

      palette = {
        dot: pick("--dot", dark ? "#55555e" : "#9a9a92"),
        line: pick("--line-strong", dark ? "#3b3b41" : "#b0b0a8"),
        lineAlpha: dark ? 0.62 : 0.55,
        dotAlpha: dark ? 0.72 : 0.68,
      };
    };

    const seed = () => {
      const target =
        cssWidth < MOBILE_BREAKPOINT
          ? MOBILE_PARTICLES
          : Math.min(MAX_PARTICLES, Math.round((cssWidth * cssHeight) / AREA_PER_PARTICLE));

      particles = Array.from({ length: target }, () => ({
        x: random() * cssWidth,
        y: random() * cssHeight,
        vx: (random() - 0.5) * 0.24,
        vy: (random() - 0.5) * 0.24,
        size: random() * 1.5 + 1,
        tone: random(),
        degree: 0,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      cssWidth = Math.max(1, rect.width);
      cssHeight = Math.max(1, rect.height);
      dpr = nextDpr;

      const width = Math.round(cssWidth * nextDpr);
      const height = Math.round(cssHeight * nextDpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      seed();
    };

    /**
     * Uniform grid: each particle is only tested against its own cell and the
     * three forward neighbours, so pairing stays linear instead of O(n^2).
     */
    const buildCells = (list: Particle[]) => {
      const columns = Math.max(1, Math.ceil(cssWidth / CELL));
      const rows = Math.max(1, Math.ceil(cssHeight / CELL));
      const cells: Particle[][] = Array.from(
        { length: columns * rows },
        () => []
      );

      for (const particle of list) {
        const col = Math.min(columns - 1, Math.max(0, Math.floor(particle.x / CELL)));
        const row = Math.min(rows - 1, Math.max(0, Math.floor(particle.y / CELL)));
        cells[row * columns + col].push(particle);
      }
      return { columns, rows, cells };
    };

    const drawLinks = (columns: number, rows: number, cells: Particle[][]) => {
      const limit = Math.min(165, Math.max(118, cssWidth / 8));
      const limitSq = limit * limit;

      ctx.lineWidth = 0.85;
      ctx.strokeStyle = palette.line;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const bucket = cells[row * columns + col];

          for (let i = 0; i < bucket.length; i++) {
            const a = bucket[i];

            // Same cell: pair upward once.
            for (let j = i + 1; j < bucket.length; j++) {
              drawLink(a, bucket[j], limitSq);
            }

            // Right and below-diagonal, so every pair is visited once.
            if (col + 1 < columns) {
              const right = cells[row * columns + col + 1];
              for (let j = 0; j < right.length; j++) drawLink(a, right[j], limitSq);
            }
            if (row + 1 < rows) {
              const below = cells[(row + 1) * columns + col];
              for (let j = 0; j < below.length; j++) drawLink(a, below[j], limitSq);
              if (col + 1 < columns) {
                const diag = cells[(row + 1) * columns + col + 1];
                for (let j = 0; j < diag.length; j++) drawLink(a, diag[j], limitSq);
              }
            }
          }
        }
      }
    };

    const drawLink = (a: Particle, b: Particle, limitSq: number) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distanceSq = dx * dx + dy * dy;
      if (distanceSq > limitSq) return;

      a.degree += 1;
      b.degree += 1;

      const distance = Math.sqrt(distanceSq);
      const falloff = 1 - distance / Math.sqrt(limitSq);

      // Tone varies per pair, so the mesh has depth instead of reading as a
      // uniform sheet of hatching.
      const variation = 0.72 + ((a.tone * 7 + b.tone * 13) % 1) * 0.56;
      let alpha = Math.pow(falloff, 1.6) * palette.lineAlpha * variation;

      if (pointer.active) {
        const px = (a.x + b.x) / 2 - pointer.x;
        const py = (a.y + b.y) / 2 - pointer.y;
        const near = Math.sqrt(px * px + py * py);
        if (near < LINK_GLOW_REACH) {
          alpha += (1 - near / LINK_GLOW_REACH) * 0.24;
        }
      }

      if (alpha <= 0.004) return;
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    const drawDots = (time: number) => {
      const drift = time * 0.00006;

      ctx.fillStyle = palette.dot;
      for (const particle of particles) {
        const x = particle.x + Math.sin(drift + particle.tone * 6.283) * 4;
        const y = particle.y + Math.cos(drift * 1.3 + particle.tone * 6.283) * 4;

        // Well-connected nodes read as hubs, which gives the mesh structure.
        const hubBoost = particle.degree >= 3 ? 0.22 : particle.degree === 2 ? 0.1 : 0;

        let alpha = palette.dotAlpha + hubBoost;
        if (pointer.active) {
          const px = x - pointer.x;
          const py = y - pointer.y;
          const near = Math.sqrt(px * px + py * py);
          if (near < POINTER_REACH) {
            alpha += (1 - near / POINTER_REACH) * 0.32;
          }
        }

        const radius = particle.size + (particle.degree >= 3 ? 0.5 : 0);
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.globalCompositeOperation = "source-over";

      for (const particle of particles) particle.degree = 0;

      const { columns, rows, cells } = buildCells(particles);
      drawLinks(columns, rows, cells);
      drawDots(time);

      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const step = (time: number) => {
      const elapsed = (time - start) / 1000;

      for (const particle of particles) {
        if (pointer.active) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distance = Math.hypot(dx, dy);
          const reach = POINTER_REACH + particle.size;
          if (distance > 0 && distance < reach) {
            const force = (reach - distance) / reach;
            particle.x -= (dx / distance) * force * 2.4;
            particle.y -= (dy / distance) * force * 2.4;
          }
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -12) particle.x = cssWidth + 12;
        else if (particle.x > cssWidth + 12) particle.x = -12;
        if (particle.y < -12) particle.y = cssHeight + 12;
        else if (particle.y > cssHeight + 12) particle.y = -12;
      }

      draw(elapsed);
    };

    const tick = (time: number) => {
      if (disposed) return;
      step(time);
      if (pageVisible && onScreen) {
        frame = requestAnimationFrame(tick);
      }
    };

    const startLoop = () => {
      cancelAnimationFrame(frame);
      if (!reduceMotion && pageVisible && onScreen) {
        frame = requestAnimationFrame(tick);
      }
    };

    const renderStatic = () => {
      step(start + 4200);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.active = false;
    };

    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible) startLoop();
      else cancelAnimationFrame(frame);
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      if (reduceMotion) {
        cancelAnimationFrame(frame);
        renderStatic();
      } else {
        startLoop();
      }
    };

    const onDprChange = () => {
      resize();
      if (reduceMotion) renderStatic();
    };

    const resizeObserver = new ResizeObserver(onDprChange);
    resizeObserver.observe(host);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) startLoop();
        else cancelAnimationFrame(frame);
      },
      { threshold: 0 }
    );
    intersection.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      readPalette();
      if (reduceMotion) renderStatic();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);

    // Tracking happens on the section, since the canvas itself is inert.
    surface.addEventListener("pointermove", onPointerMove);
    surface.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);
    dprQuery.addEventListener("change", onDprChange);

    readPalette();
    resize();

    if (reduceMotion) renderStatic();
    else startLoop();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      dprQuery.removeEventListener("change", onDprChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}