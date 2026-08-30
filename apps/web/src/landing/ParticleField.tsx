import { useEffect, useRef } from "react";
import { cn } from "@vaultui/utils";

/**
 * ParticleField — a cursor-driven indigo "web" for hero backdrops.
 *
 * A permanent grid of fixed nodes spans the whole hero, but stays
 * INVISIBLE. When the cursor enters:
 *  - the nodes surrounding the pointer reveal (softly, by distance)
 *  - a line is drawn from each revealed node to the cursor itself,
 *    forming a spider-web toward the pointer
 * Every other node and line stays hidden.
 *
 * Nodes never move — only which part of the field is visible changes.
 * Coarse-pointer (touch) devices get a quiet web around the hero centre.
 * Honors prefers-reduced-motion (static reveal no breathing) and pauses
 * when scrolled out of view.
 */

interface Node {
  x: number;
  y: number;
  r: number;
  color: string;
  baseAlpha: number;
  phase: number;
}

const DEFAULT_COLORS = ["#a7b2fb", "#8b96f7", "#6f7bf2", "#5b66e8"]; // brand-300 … brand-600 (fallback)

// Dense, short-range web: the cursor only links nodes that sit CLOSE to it,
// so lines stay short and the field reads as a fine mesh of near neighbours.
const WEB_RADIUS = 92; // px — reach of the cursor web (short links only)
const WEB_ALPHA = 0.62; // line alpha at the cursor, fading with distance
const GLOW_ALPHA = 0.08; // soft halo at the cursor
const FALLBACK_SCALE = 1.9; // centred web radius multiplier (touch / before first move)

/** Nodes per square pixel — density target of the auto-scale (high = fine mesh). */
const AREA_PER_NODE = 1400;

/** Read the active theme's brand tones straight from CSS vars (no SSR). */
function readThemeBrandPalette(): string[] {
  const s = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => {
    const v = s.getPropertyValue(name).trim();
    return v && !v.startsWith("--") ? v : fallback;
  };
  return [
    read("--color-brand-300", DEFAULT_COLORS[0]!),
    read("--color-brand-400", DEFAULT_COLORS[1]!),
    read("--color-brand-500", DEFAULT_COLORS[2]!),
    read("--color-brand-600", DEFAULT_COLORS[3]!),
  ];
}

/** Same color as an rgba() string — for the translucent cursor glow. */
function colorToRgba(color: string, alpha: number): string {
  const hex = color.match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (hex) {
    const h =
      hex[1]!.length === 3
        ? hex[1]!
            .split("")
            .map((c) => c + c)
            .join("")
        : hex[1]!;
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }
  const nums = color.match(/(\d+(?:\.\d+)?)/g);
  return nums && nums.length >= 3
    ? `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`
    : `rgba(139, 150, 247, ${alpha})`;
}

export interface ParticleFieldProps {
  className?: string;
  /** Pass your own hex set to pin a palette; default = the active theme's brand. */
  colors?: string[];
  /** Upper bound on nodes (auto-scaled by canvas area regardless). */
  maxParticles?: number;
}

export function ParticleField({ className, colors, maxParticles = 900 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const pointer = { x: 0, y: 0, active: false, inside: false };

    let palette = colors && colors.length ? colors : readThemeBrandPalette();
    let accent = palette[1] ?? palette[0] ?? DEFAULT_COLORS[1]!; // brand-400 — stroke + glow
    let glowColor = colorToRgba(accent, GLOW_ALPHA);
    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let resizeQueued = false;
    let seed = 0;

    /** Fixed jittered-grid spawn — even coverage, permanent positions. */
    const spawnGrid = (count: number) => {
      const cols = Math.max(1, Math.round(Math.sqrt((count * width) / Math.max(1, height))));
      const rows = Math.max(1, Math.ceil(count / cols));
      const cellW = width / cols;
      const cellH = height / rows;
      const list: Node[] = [];
      for (let i = 0; i < count; i++) {
        const s = seed++;
        list.push({
          x: (i % cols) * cellW + cellW * (0.2 + Math.random() * 0.6),
          y: Math.floor((i % (cols * rows)) / cols) * cellH + cellH * (0.2 + Math.random() * 0.6),
          r: 1.2 + Math.random() * 1.4,
          color: palette[Math.floor(Math.random() * palette.length)] ?? DEFAULT_COLORS[0]!,
          baseAlpha: 0.55 + Math.random() * 0.4,
          phase: (s % 628) / 100, // deterministic breathing phase
        });
      }
      return list;
    };

    const resize = () => {
      // Re-skin on theme flips: re-read tokens, rebuild the palette + glow.
      palette = colors && colors.length ? colors : readThemeBrandPalette();
      accent = palette[1] ?? palette[0] ?? DEFAULT_COLORS[1]!;
      glowColor = colorToRgba(accent, GLOW_ALPHA);

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(40, Math.min(maxParticles, Math.floor((width * height) / AREA_PER_NODE)));
      nodes = spawnGrid(count);

      draw(0);
      if (!reduced && running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(step);
      }
    };

    const queueResize = () => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(() => {
        resizeQueued = false;
        resize();
      });
    };

    /** Web origin: the cursor when inside; a centred welcome-web otherwise. */
    const readOrigin = (): { cx: number; cy: number; radius: number } | null => {
      if (coarse || !pointer.active) {
        return { cx: width * 0.5, cy: height * 0.45, radius: WEB_RADIUS * FALLBACK_SCALE };
      }
      if (!pointer.inside) return null; // cursor outside the hero → everything hidden
      return { cx: pointer.x, cy: pointer.y, radius: WEB_RADIUS };
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      const origin = readOrigin();
      if (!origin) return;

      const { cx, cy, radius } = origin;
      const soft = radius * 0.55; // full alpha inside this, fades outward
      const breathe = reduced ? 1 : 0.72 + 0.28 * Math.sin(t * 0.0015);

      // 1 · faint halo at the web's focus
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      glow.addColorStop(0, glowColor);
      glow.addColorStop(1, colorToRgba(accent, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // 2 · lines — from each surrounding node to the cursor
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = accent;
      const linkAlphas: number[] = [];
      const radius2 = radius * radius;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        const dx = n.x - cx;
        const dy = n.y - cy;
        const d2 = dx * dx + dy * dy;
        if (d2 >= radius2) {
          linkAlphas.push(0);
          continue;
        }
        const d = Math.sqrt(d2);
        const reveal = d <= soft ? 1 : (radius - d) / (radius - soft);
        linkAlphas.push(reveal);
        if (reveal <= 0) continue;
        ctx.globalAlpha = WEB_ALPHA * reveal;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      }

      // 3 · nodes — only the surrounding ones, softly revealed
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        const reveal = linkAlphas[i] ?? 0;
        if (reveal <= 0) continue;
        ctx.globalAlpha = n.baseAlpha * reveal * breathe;
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const step = (t: number) => {
      draw(t);
      if (!reduced && running) {
        raf = requestAnimationFrame(step);
      }
    };

    /* --------------------------- pointer & lifecycle --------------------------- */

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      pointer.inside = pointer.x >= 0 && pointer.x <= rect.width && pointer.y >= 0 && pointer.y <= rect.height;
    };
    const onDeactivate = () => {
      pointer.active = false;
      pointer.inside = false;
    };
    const onVisibility = () => {
      if (document.hidden) onDeactivate();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onDeactivate);
    document.addEventListener("visibilitychange", onVisibility);

    // Watch the theme switcher: when data-theme flips, re-skin the web.
    const themeObserver = new MutationObserver(() => resize());
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const io = new IntersectionObserver(([entry]) => {
      running = entry?.isIntersecting ?? true;
      if (!running) cancelAnimationFrame(raf);
      else if (!reduced) raf = requestAnimationFrame(step);
    });
    io.observe(canvas);

    const ro = new ResizeObserver(queueResize);
    ro.observe(canvas.parentElement ?? canvas);

    resize();

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onDeactivate);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [colors, maxParticles]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}