import { cn } from "@vault/utils";
import type { ModelOption } from "./types";

export interface ModelPickerProps {
  models: ModelOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Styled model switcher — a native <select> underneath a token-styled
 * shell, so it's fully accessible and works on every device
 * (native pickers actually feel better on mobile).
 */
export function ModelPicker({ models, value, onChange, className }: ModelPickerProps) {
  const current = models.find((m) => m.id === value);

  return (
    <div
      className={cn(
        "relative inline-flex h-9 items-center gap-2 rounded-lg border border-surface-200 bg-surface-0 pl-2.5 pr-1.5 text-sm shadow-soft",
        className,
      )}
    >
      <SparkIcon className="size-3.5 shrink-0 text-brand-600" />
      <label className="sr-only" htmlFor="vault-model-picker">
        Model
      </label>
      <select
        id="vault-model-picker"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full cursor-pointer appearance-none bg-transparent pr-6 text-sm font-medium text-surface-700 focus:outline-none"
      >
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
            {m.context ? ` · ${m.context}` : ""}
          </option>
        ))}
      </select>
      <ChevronIcon className="pointer-events-none absolute right-2 size-3.5 text-surface-400" />
      {current?.badge && (
        <span className="hidden rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-medium text-brand-700 sm:inline-block">
          {current.badge}
        </span>
      )}
    </div>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2l1.902 5.598L19.5 9.5l-5.598 1.902L12 17l-1.902-5.598L4.5 9.5l5.598-1.902L12 2z" />
      <path d="M18.5 15l.905 2.595L22 18.5l-2.595.905L18.5 22l-.905-2.595L15 18.5l2.595-.905L18.5 15z" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}