import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@vaultui/utils";

/* ================================== Kbd =================================== */

export interface KbdProps {
  children: ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return <kbd className={cn("vault-kbd", className)}>{children}</kbd>;
}

/* ================================ Slider ================================== */

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

/** Styled range slider with a token-driven fill. */
export function Slider({ min = 0, max = 100, step = 1, value, onChange, disabled, label, className }: SliderProps) {
  const fill = ((Math.min(max, Math.max(min, value)) - min) / Math.max(1, max - min)) * 100;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label && <span className="text-sm font-medium text-surface-700">{label}</span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="vault-slider flex-1"
        style={{ "--vault-slider-fill": `${fill}%` } as React.CSSProperties}
      />
      <span className="w-10 shrink-0 text-right font-mono text-xs text-surface-500">{value}</span>
    </div>
  );
}

/* ================================ CopyButton ============================== */

export interface CopyButtonProps {
  value: string;
  /** Accessible label. */
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CopyButton({ value, label = "Copy to clipboard", size = "sm", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "vault-btn vault-btn-secondary",
        size === "sm" && "vault-btn-xs",
        size === "md" && "vault-btn-sm",
        size === "lg" && "vault-btn-md",
        className,
      )}
    >
      {copied ? <CheckIcon className="vault-copy-check" /> : <CopyIcon className="vault-copy-copy" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

/* ================================ Combobox ================================ */

export interface ComboOption {
  label: string;
  value: string;
  keywords?: string[];
}

export interface ComboboxProps {
  options: ComboOption[];
  value?: string;
  onValueChange: (value: string | undefined) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
}

/** Searchable select — type to filter, arrows + enter to pick. */
export function Combobox({ options, value, onValueChange, placeholder = "Search…", emptyText = "No matches", disabled, className }: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.keywords ?? []).some((k) => k.toLowerCase().includes(q)),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setFocused(0), [query, open]);

  const pick = (o: ComboOption | undefined) => {
    onValueChange(o?.value);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className={cn("vault-combobox", className)}>
      <input
        type="text"
        value={open ? query : (selected?.label ?? query)}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocused((f) => Math.min(f + 1, Math.max(0, filtered.length - 1)));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocused((f) => Math.max(f - 1, 0));
          } else if (e.key === "Enter" && open && filtered[focused]) {
            e.preventDefault();
            pick(filtered[focused]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className="vault-input"
        aria-expanded={open}
        role="combobox"
        aria-autocomplete="list"
      />
      {open && !disabled && (
        <div className="vault-combobox__pop" role="listbox">
          {filtered.length === 0 ? (
            <p className="vault-combobox__empty">{emptyText}</p>
          ) : (
            filtered.map((o, i) => (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={o.value === value}
                data-focused={i === focused}
                onMouseEnter={() => setFocused(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(o);
                }}
                onClick={() => pick(o)}
                className="vault-combobox__option"
              >
                <span className="truncate">{o.label}</span>
                {o.value === value && <CheckIcon className="size-3.5 text-brand-600" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ============================== DropdownMenu ============================== */

export interface MenuItem {
  label: ReactNode;
  icon?: ReactNode;
  onSelect?: () => void;
  danger?: boolean;
}

export interface MenuSeparator {
  separator: true;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: Array<MenuItem | MenuSeparator>;
  /** Align the panel. Default "end". */
  align?: "start" | "end";
  className?: string;
}

export function DropdownMenu({ trigger, items, align = "end", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const actionable = items.filter((i): i is MenuItem => !("separator" in i));

  const select = (item: MenuItem) => {
    setOpen(false);
    item.onSelect?.();
  };

  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="contents"
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn("vault-menu", align === "end" ? "left-auto right-0" : "left-0 right-auto", "top-full mt-1")}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setFocused((f) => Math.min(f + 1, Math.max(0, actionable.length - 1)));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setFocused((f) => Math.max(f - 1, 0));
            } else if (e.key === "Enter" && actionable[focused]) {
              e.preventDefault();
              select(actionable[focused]!);
            }
          }}
        >
          {items.map((item, i) =>
            "separator" in item ? (
              <div key={i} className="vault-menu__sep" />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                data-focused={i === focused}
                onMouseEnter={() => setFocused(i)}
                onClick={() => select(item)}
                className={cn("vault-menu__item", item.danger && "vault-menu__item--danger")}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

/* ================================ Stepper ================================= */

export interface StepperStep {
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Index of the active step (0-based). */
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <div className={cn("vault-stepper", className)}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className={cn("vault-stepper__step", active && "vault-stepper__step--active", done && "vault-stepper__step--done")}>
            <span className="vault-stepper__node">{done ? <CheckIcon className="size-3.5" /> : i + 1}</span>
            <span className="vault-stepper__label">{s.label}</span>
            {s.description && <span className="vault-stepper__desc">{s.description}</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------- icons ----------------------------------- */

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "size-3.5"} aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "size-3.5"} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}