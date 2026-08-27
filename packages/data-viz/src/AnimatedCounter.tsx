import { useEffect, useRef, useState } from "react";

export interface AnimatedCounterProps {
  value: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Formatter for the displayed value. */
  format?: (value: number) => string;
  className?: string;
}

/**
 * AnimatedCounter — tweens from the previous value to the new one
 * with cubic ease-out using requestAnimationFrame. Respects reduced
 * motion by skipping the animation.
 */
export function AnimatedCounter({
  value,
  duration = 800,
  format = (n) => Math.round(n).toLocaleString(),
  className,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      prevRef.current = value;
      return;
    }

    const start = prevRef.current;
    const target = value;
    if (start === target) return;

    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (target - start) * eased);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevRef.current = target;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{format(display)}</span>;
}