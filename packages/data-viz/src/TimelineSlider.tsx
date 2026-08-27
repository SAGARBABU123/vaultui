import { cn } from "@vaultui/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export interface TimelinePoint {
  time: string;
  value: number;
}

export interface TimelineSliderProps {
  points: TimelinePoint[];
  /** ms per step while playing. */
  intervalMs?: number;
  format?: (n: number) => string;
  className?: string;
}

/**
 * TimelineSlider — scrub through series data with a playhead,
 * play/pause, click-to-seek and readable value chip.
 */
export function TimelineSlider({
  points,
  intervalMs = 900,
  format = (n) => String(Math.round(n)),
  className,
}: TimelineSliderProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => (i >= points.length - 1 ? 0 : i + 1));
    }, intervalMs);
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [playing, intervalMs, points.length]);

  const seek = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el || points.length === 0) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      setIndex(Math.round(ratio * (points.length - 1)));
    },
    [points.length],
  );

  if (points.length === 0) return <div className={cn("text-sm text-surface-400", className)}>No data</div>;

  const current = points[index]!;
  const pct = (index / (points.length - 1)) * 100;

  return (
    <div className={cn("rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <IconBtn label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
            {playing ? <PauseGlyph /> : <PlayGlyph />}
          </IconBtn>
          <IconBtn label="Reset" onClick={() => { setPlaying(false); setIndex(0); }}>
            <ResetGlyph />
          </IconBtn>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-brand-600">{format(current.value)}</span>
          <span className="text-xs text-surface-400">{current.time}</span>
        </div>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={points.length - 1}
        aria-valuenow={index}
        aria-label="Timeline position"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setIndex((i) => Math.min(points.length - 1, i + 1));
          if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
        }}
        onClick={(e) => seek(e.clientX)}
        className="group relative mt-4 h-6 cursor-pointer touch-none"
      >
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-surface-100" />
        {/* step dots */}
        {points.map((p, i) => (
          <span
            key={i}
            className={cn(
              "absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors",
              i <= index ? "bg-brand-500" : "bg-surface-300",
            )}
            style={{ left: `${(i / (points.length - 1)) * 100}%` }}
          />
        ))}
        <span
          className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-brand-600 shadow-soft"
          style={{ left: `${pct}%` }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[11px] text-surface-400">
        <span>{points[0]!.time}</span>
        <span className="font-mono">
          {index + 1} / {points.length}
        </span>
        <span>{points[points.length - 1]!.time}</span>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-lg border-0 bg-surface-100 shadow-inset text-surface-600 transition-colors hover:bg-surface-100"
    >
      {children}
    </button>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3" aria-hidden="true">
      <path d="M4 2.5v11a.5.5 0 00.76.43l9-5.5a.5.5 0 000-.86l-9-5.5A.5.5 0 004 2.5z" />
    </svg>
  );
}
function PauseGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3" aria-hidden="true">
      <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
    </svg>
  );
}
function ResetGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-3.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 2v3h3M12 14v-3H9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 5a5.5 5.5 0 00-10 2M2.5 11a5.5 5.5 0 0010-2" />
    </svg>
  );
}