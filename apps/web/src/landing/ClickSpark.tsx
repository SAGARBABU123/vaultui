import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * ClickSpark — adapted from ReactBits (reactbits.dev/animations/click-spark).
 *
 * On every click inside the wrapper, a burst of short spark lines radiates
 * from the cursor, shrinks and fades (~420ms). Rendered on an invisible
 * canvas above the content (pointer-events: none), so buttons and links
 * keep working — sparks are pure decoration.
 *
 * `sparkColor` accepts a CSS var (e.g. "var(--color-brand-500)") — the
 * canvas resolves it at click time so the burst follows the active theme.
 * Used on the landing page only.
 */

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export interface ClickSparkProps {
  children?: ReactNode;
  /** Canvas stroke color; "var(--color-*)" resolves from the live theme. */
  sparkColor?: string;
  /** Segment length in px. */
  sparkSize?: number;
  /** How far each spark travels in px. */
  sparkRadius?: number;
  /** Number of sparks per burst. */
  sparkCount?: number;
  /** Burst lifetime in ms. */
  duration?: number;
  easing?: "ease-out" | "ease-in" | "ease-in-out" | "linear";
  extraScale?: number;
}

export function ClickSpark({
  children,
  sparkColor = "var(--color-brand-400)",
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 10,
  duration = 420,
  easing = "ease-out",
  extraScale = 1,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const colorRef = useRef("#ffffff");
  const reducedRef = useRef(false);

  /* Honour prefers-reduced-motion: no spark bursts for users who opt out. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Keep the canvas sized to the wrapper (round on resize). */
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    let timeout: number | undefined;
    const queue = () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(resize, 100);
    };
    const ro = new ResizeObserver(queue);
    ro.observe(parent);
    resize();
    return () => {
      ro.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);

  const ease = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t); // ease-out quad
      }
    },
    [easing],
  );

  /* Animation loop: move + shrink + fade each spark, drop finished ones. */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    const frame = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = colorRef.current;
      sparksRef.current = sparksRef.current.filter((s) => {
        const t = (time - s.startTime) / duration;
        if (t >= 1) return false;
        const eased = ease(t);
        const dist = eased * sparkRadius * extraScale;
        const size = sparkSize * (1 - t);
        const cos = Math.cos(s.angle);
        const sin = Math.sin(s.angle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x + dist * cos, s.y + dist * sin);
        ctx.lineTo(s.x + (dist + size) * cos, s.y + (dist + size) * sin);
        ctx.stroke();
        return true;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [sparkSize, sparkRadius, duration, easing, extraScale, ease]);

  const spawn = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedRef.current) return; // reduced-motion: no sparks
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Resolve the live theme color (canvas can't read var() by itself).
    colorRef.current = sparkColor.startsWith("var(")
      ? (getComputedStyle(canvas).getPropertyValue(sparkColor.slice(4, -1).trim()).trim() || "#ffffff")
      : sparkColor;

    const startTime = performance.now();
    sparksRef.current.push(
      ...Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount + Math.random() * 0.18 - 0.09,
        startTime,
      })),
    );
  };

  return (
    <div className="relative w-full" onClick={spawn}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      />
      {children}
    </div>
  );
}