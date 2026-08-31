import { useMemo, useState } from "react";
import { cn } from "@vaultui/utils";

export interface CalendarProps {
  value?: Date;
  onSelect?: (date: Date) => void;
  /** First day of the week. Default 0 (Sunday). */
  weekStart?: number;
  className?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Month-grid calendar with prev/next navigation and selection. */
export function Calendar({ value, onSelect, weekStart = 0, className }: CalendarProps) {
  const today = startOfDay(new Date());
  const [view, setView] = useState(() => (value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1)));

  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const offset = (first.getDay() - weekStart + 7) % 7;
    const start = new Date(view.getFullYear(), view.getMonth(), 1 - offset);
    return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }, [view, weekStart]);

  const shift = (delta: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));

  return (
    <div className={cn("vault-cal", className)}>
      <div className="vault-cal__head">
        <button type="button" className="vault-cal__nav" onClick={() => shift(-1)} aria-label="Previous month">
          <Chevron dir="left" />
        </button>
        <span className="vault-cal__title">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button type="button" className="vault-cal__nav" onClick={() => shift(1)} aria-label="Next month">
          <Chevron dir="right" />
        </button>
      </div>

      <div className="vault-cal__grid">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="vault-cal__dow">
            {WEEKDAYS[(i + weekStart) % 7]}
          </span>
        ))}
        {days.map((d, i) => {
          const inMonth = d.getMonth() === view.getMonth();
          const selected = value ? isSameDay(d, startOfDay(value)) : false;
          const isToday = isSameDay(d, today);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect?.(d)}
              className={cn(
                "vault-cal__day",
                !inMonth && "vault-cal__day--muted",
                isToday && "vault-cal__day--today",
                selected && "vault-cal__day--selected",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
      {dir === "left" ? (
        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
      ) : (
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
      )}
    </svg>
  );
}