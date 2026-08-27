import { Button } from "@vault/ui";
import { cn } from "@vault/utils";
import { useState } from "react";

export type RefundReason = "wrong-item" | "not-working" | "changed-mind" | "other";

export interface RefundWizardProps {
  orderId?: string;
  amount?: number;
  currency?: string;
  onComplete?: (reason: RefundReason, method: "original" | "credit") => void;
  className?: string;
}

const REASONS: { id: RefundReason; label: string; desc: string; emoji: string }[] = [
  { id: "wrong-item", label: "Wrong item", desc: "Received something I didn't order", emoji: "📦" },
  { id: "not-working", label: "Not working", desc: "Defective or broken on arrival", emoji: "🔧" },
  { id: "changed-mind", label: "Changed my mind", desc: "No longer needed", emoji: "🤷" },
  { id: "other", label: "Other", desc: "Something else", emoji: "💬" },
];

const METHOD_STEPS = ["original", "credit"] as const;

/**
 * RefundWizard — multi-step refund flow (reason → method → review)
 * with a progress rail, back/continue actions and a completion state.
 * Fully responsive and keyboard-friendly (radio groups).
 */
export function RefundWizard({
  orderId = "#VLT-1042",
  amount = 129,
  currency = "$",
  onComplete,
  className,
}: RefundWizardProps) {
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState<RefundReason | null>(null);
  const [method, setMethod] = useState<(typeof METHOD_STEPS)[number]>("original");
  const [done, setDone] = useState(false);

  const finish = () => {
    if (reason) onComplete?.(reason, method);
    setDone(true);
  };

  if (done) {
    return (
      <div className={cn("flex flex-col items-center gap-3 rounded-2xl border border-success-200 bg-success-500/5 p-8 text-center", className)}>
        <span className="flex size-12 items-center justify-center rounded-full bg-success-500/15 text-2xl">✓</span>
        <h3 className="text-base font-semibold text-surface-800">Refund submitted</h3>
        <p className="max-w-xs text-sm text-surface-500">
          {currency}
          {amount.toFixed(2)} will be returned to your {method === "original" ? "original payment method" : "store credit"} within 5–7 business days.
        </p>
        <Button variant="secondary" size="sm" onClick={() => { setDone(false); setStep(0); setReason(null); }}>
          Start another refund
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft", className)}>
      {/* Progress rail */}
      <div className="mb-5 flex items-center gap-2">
        {["Reason", "Method", "Review"].map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                i < step
                  ? "bg-brand-600 text-white"
                  : i === step
                    ? "bg-brand-100 text-brand-700 ring-2 ring-brand-500/40"
                    : "bg-surface-100 text-surface-400",
              )}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span className={cn("hidden text-xs font-medium sm:inline", i === step ? "text-surface-800" : "text-surface-400")}>
              {s}
            </span>
            {i < 2 && <span className={cn("h-px flex-1", i < step ? "bg-brand-400" : "bg-surface-200")} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <fieldset>
          <legend className="text-sm font-semibold text-surface-800">What's the reason for the refund?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {REASONS.map((r) => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={reason === r.id}
                onClick={() => setReason(r.id)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                  reason === r.id
                    ? "border-brand-400 bg-brand-50 ring-2 ring-brand-500/30"
                    : "border-surface-200 bg-surface-0 hover:border-brand-300 hover:bg-surface-50",
                )}
              >
                <span className="text-xl">{r.emoji}</span>
                <span>
                  <span className="block text-sm font-medium text-surface-800">{r.label}</span>
                  <span className="block text-xs text-surface-500">{r.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset>
          <legend className="text-sm font-semibold text-surface-800">How should we return it?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {METHOD_STEPS.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={method === m}
                onClick={() => setMethod(m)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                  method === m
                    ? "border-brand-400 bg-brand-50 ring-2 ring-brand-500/30"
                    : "border-surface-200 bg-surface-0 hover:border-brand-300 hover:bg-surface-50",
                )}
              >
                <span className="text-xl">{m === "original" ? "💳" : "🎟️"}</span>
                <span>
                  <span className="block text-sm font-medium text-surface-800">
                    {m === "original" ? "Original payment" : "Store credit"}
                  </span>
                  <span className="block text-xs text-surface-500">
                    {m === "original" ? `Back to your card in 5–7 days` : "Instant, +5% bonus credit"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <div className="rounded-xl border border-surface-200 bg-surface-50 p-4 text-sm">
          <h3 className="font-semibold text-surface-800">Review your refund</h3>
          <dl className="mt-3 space-y-2">
            <Row label="Order" value={orderId} />
            <Row label="Reason" value={REASONS.find((r) => r.id === reason)?.label ?? "—"} />
            <Row label="Method" value={method === "original" ? "Original payment" : "Store credit"} />
            <Row label="Amount" value={`${currency}${amount.toFixed(2)}`} strong />
          </dl>
        </div>
      )}

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Back
        </Button>
        {step < 2 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={step === 0 && !reason} fullWidth className="sm:w-auto">
            Continue
          </Button>
        ) : (
          <Button variant="danger" onClick={finish} fullWidth className="sm:w-auto">
            Confirm refund
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-surface-500">{label}</dt>
      <dd className={cn("font-medium", strong ? "text-lg text-surface-900" : "text-surface-800")}>{value}</dd>
    </div>
  );
}