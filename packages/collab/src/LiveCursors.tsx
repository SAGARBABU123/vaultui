import { cn } from "@gudipudimani/utils";
import { useEffect, useRef, useState } from "react";

export interface LiveCursor {
  id: string;
  name: string;
  color: string;
  /** 0–100 viewport coordinates. */
  x: number;
  y: number;
}

export interface LiveCursorsProps {
  cursors: LiveCursor[];
  /** When true, cursors drift on their own (demo mode). */
  autoPilot?: boolean;
  className?: string;
  heightClass?: string;
}

/**
 * LiveCursors — collaborative cursor overlay with name tags.
 * Feed positions as 0–100 % of the container; `autoPilot` makes
 * them drift for demos.
 */
export function LiveCursors({
  cursors,
  autoPilot = false,
  heightClass = "h-56",
  className,
}: LiveCursorsProps) {
  const [positions, setPositions] = useState(cursors);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPilot) return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.012;
      setPositions((prev) =>
        prev.map((c, i) => {
          const phase = i * 1.7;
          return {
            ...c,
            x: 12 + 76 * (0.5 + 0.5 * Math.sin(t * 0.9 + phase)),
            y: 14 + 70 * (0.5 + 0.5 * Math.sin(t * 1.3 + phase * 1.6)),
          };
        }),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoPilot, cursors.length]);

  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current); }, []);

  return (
    <div id="live-cursors" className={cn("relative overflow-hidden rounded-2xl border-0 bg-surface-50 shadow-soft", heightClass, className)}>
      {/* fake "document" */}
      <div className="absolute inset-0 p-4">
        {[48, 34, 40, 26, 30].map((w, i) => (
          <div key={i} className="mb-2.5 h-2.5 rounded-full bg-surface-200/80" style={{ width: `${w}%` }} />
        ))}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-14 rounded-lg bg-surface-200/60" />
          <div className="h-14 rounded-lg bg-surface-200/60" />
        </div>
      </div>

      {positions.map((c) => (
        <div
          key={c.id}
          className="pointer-events-none absolute z-10"
          style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-4px, -4px)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87a.5.5 0 00.35-.85L6.35 2.86a.5.5 0 00-.85.35z" fill={c.color} stroke="white" strokeWidth="1.5" />
          </svg>
          <span
            className="absolute left-4 top-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-white shadow-soft"
            style={{ backgroundColor: c.color }}
          >
            {c.name}
          </span>
        </div>
      ))}

      {autoPilot && (
        <span className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-surface-0/90 border border-surface-200 px-2.5 py-1 text-[11px] text-surface-500 shadow-soft">
          <span className="size-1.5 rounded-full bg-brand-500 animate-pulse-ring" />
          Real-time demo
        </span>
      )}
    </div>
  );
}