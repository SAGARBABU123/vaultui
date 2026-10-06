import { useState, type ReactNode } from "react";
import { cn } from "@vaultui/utils";
import { Button, Input } from "@vaultui/ui";

/* ============================== OrderTracking ============================= */

export interface TrackStep {
  label: ReactNode;
  date?: ReactNode;
  done?: boolean;
}

export interface OrderTrackingProps {
  steps: TrackStep[];
  className?: string;
}

/** Vertical order-progress timeline. */
export function OrderTracking({ steps, className }: OrderTrackingProps) {
  return (
    <ol className={cn("space-y-0", className)}>
      {steps.map((s, i) => {
        const done = s.done ?? i < steps.length - 1;
        const last = i === steps.length - 1;
        return (
          <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && <span className="absolute left-2.5 top-6 h-full w-px bg-surface-200" />}
            <span
              className={cn(
                "relative z-10 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                done ? "bg-success-500 text-white" : "bg-surface-200 text-surface-500",
              )}
            >
              {done ? <CheckIcon className="size-3" /> : <DotIcon />}
            </span>
            <div className="min-w-0">
              <p className={cn("text-sm font-semibold", done ? "text-surface-900" : "text-surface-400")}>{s.label}</p>
              {s.date && <p className="text-xs text-surface-400">{s.date}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ================================= Invoice ================================ */

export interface InvoiceLine {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface InvoiceProps {
  number: string;
  issued: string;
  due?: string;
  client?: ReactNode;
  lines: InvoiceLine[];
  currency?: string;
  className?: string;
}

/** Minimal B2B invoice document. */
export function Invoice({ number, issued, due, client, lines, currency = "$", className }: InvoiceProps) {
  const total = lines.reduce((n, l) => n + l.qty * l.unitPrice, 0);
  return (
    <div className={cn("rounded-xl border border-surface-200 bg-surface-0 p-5 shadow-soft", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-surface-100 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-surface-400">Invoice</p>
          <p className="mt-1 text-lg font-bold text-surface-900">#{number}</p>
        </div>
        <div className="text-right text-sm text-surface-500">
          <p>Issued {issued}</p>
          {due && <p>Due {due}</p>}
          {client}
        </div>
      </div>
      <div className="divide-y divide-surface-100">
        {lines.map((l, i) => (
          <div key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <span className="min-w-0 flex-1 truncate text-surface-700">{l.description}</span>
            <span className="font-mono text-xs text-surface-400">{l.qty} × {l.unitPrice}</span>
            <span className="w-16 text-right font-semibold text-surface-800">
              {currency}{(l.qty * l.unitPrice).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-surface-200 pt-3">
        <span className="text-sm font-semibold text-surface-800">Total</span>
        <span className="text-lg font-bold text-surface-900">{currency}{total.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* =============================== ReviewRating ============================ */

export interface ReviewRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: number;
  className?: string;
}

export function ReviewRating({ value, onChange, max = 5, size = 20, className }: ReviewRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;
  return (
    <div className={cn("flex items-center gap-0.5", className)} role="radiogroup" aria-label="Rating">
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = shown >= n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value >= n}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => onChange && setHover(n)}
            onMouseLeave={() => onChange && setHover(null)}
            style={{ width: size, height: size }}
            className="inline-flex items-center justify-center bg-transparent p-0 transition-transform hover:scale-110"
          >
            <StarIcon filled={filled} />
          </button>
        );
      })}
      {onChange && <span className="ml-2 font-mono text-xs text-surface-400">{shown}/{max}</span>}
    </div>
  );
}

/* ============================== WishlistButton ============================ */

export interface WishlistButtonProps {
  active?: boolean;
  onToggle?: (active: boolean) => void;
  label?: string;
  className?: string;
}

export function WishlistButton({ active = false, onToggle, label = "Wishlist", className }: WishlistButtonProps) {
  const [state, setState] = useState(active);
  const isActive = active !== undefined ? active : state;
  return (
    <button
      type="button"
      onClick={() => (onToggle ? onToggle(!isActive) : setState(!isActive))}
      aria-pressed={isActive}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "border-danger-500/30 bg-danger-500/10 text-danger-500"
          : "border-surface-200 bg-surface-0 text-surface-600 hover:text-surface-900",
        className,
      )}
    >
      <HeartIcon filled={isActive} />
      {label}
    </button>
  );
}

/* ============================== CouponPicker ============================== */

export interface Coupon {
  code: string;
  label: string;
  discount: string;
}

export interface CouponPickerProps {
  coupons: Coupon[];
  onApplied?: (coupon: Coupon) => void;
  className?: string;
}

export function CouponPicker({ coupons, onApplied, className }: CouponPickerProps) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<Coupon | null>(null);
  const [error, setError] = useState(false);

  const apply = () => {
    const found = coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
    if (found) {
      setApplied(found);
      setError(false);
      onApplied?.(found);
    } else {
      setError(true);
      setApplied(null);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="VAULT20" aria-invalid={error} />
        <Button className="vault-btn-secondary" onClick={apply}>Apply</Button>
      </div>
      {error && <p className="text-xs font-medium text-danger-500">That code isn't valid.</p>}
      {applied && (
        <p className="flex items-center gap-2 rounded-lg bg-success-500/10 px-3 py-2 text-xs font-medium text-success-600">
          <CheckIcon className="size-3.5" /> {applied.code} — {applied.discount} applied
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {coupons.map((c) => (
          <button key={c.code} type="button" onClick={() => { setCode(c.code); onApplied?.(c); }} className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 font-mono text-xs text-brand-700 hover:bg-brand-100">
            {c.code} · {c.discount}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- icons ----------------------------------- */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function DotIcon() {
  return <span className="block size-1.5 rounded-full bg-current" />;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-full" aria-hidden="true">
      <path
        d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.88l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0016.5 3c-1.8 0-3.4 1-4.5 2.5C10.9 4 9.3 3 7.5 3A5.5 5.5 0 002 8.5c0 2.2 1.5 4 3 5.5l7 7 7-7z" fill={filled ? "currentColor" : "none"} />
    </svg>
  );
}