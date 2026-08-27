import { Badge, Button } from "@vault/ui";
import { cn } from "@vault/utils";
import { useState } from "react";

export interface SubscriptionInfo {
  name: string;
  /** e.g. "$49". */
  price: string;
  interval: "monthly" | "yearly";
  nextBillingDate: string;
  seats?: number;
}

export interface SubscriptionManagerProps {
  subscription: SubscriptionInfo;
  /** Called with the resulting action + status. */
  onAction?: (action: "change" | "pause" | "resume" | "cancel", status: "active" | "paused" | "cancelled") => void;
  className?: string;
}

type Status = "active" | "paused" | "cancelled";

/**
 * SubscriptionManager — plan card with lifecycle actions
 * (change plan, pause/resume, cancel) and confirm steps.
 */
export function SubscriptionManager({ subscription, onAction, className }: SubscriptionManagerProps) {
  const [status, setStatus] = useState<Status>("active");
  const [confirming, setConfirming] = useState<null | "pause" | "cancel">(null);
  const [plan, setPlan] = useState(subscription.name);

  const fire = (action: "change" | "pause" | "resume" | "cancel", next: Status) => {
    setStatus(next);
    setConfirming(null);
    onAction?.(action, next);
  };

  const badge: Record<Status, { label: string; variant: "success" | "warning" | "danger" }> = {
    active: { label: "Active", variant: "success" },
    paused: { label: "Paused", variant: "warning" },
    cancelled: { label: "Cancelled", variant: "danger" },
  };

  return (
    <div className={cn("rounded-2xl border border-surface-200 bg-surface-0 p-5 shadow-soft", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{plan}</h3>
            <Badge variant={badge[status].variant} size="sm" dot>
              {badge[status].label}
            </Badge>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight">{subscription.price}</span>
            <span className="text-sm text-surface-400">
              / {subscription.interval === "monthly" ? "month" : "year"}
            </span>
          </div>
          <p className="mt-1 text-xs text-surface-400">
            {status === "active"
              ? `Next billing ${subscription.nextBillingDate}`
              : status === "paused"
                ? `Resumes ${subscription.nextBillingDate}`
                : "Access ends at the end of the billing cycle"}
          </p>
        </div>
        <Badge variant="neutral" size="sm">
          {subscription.seats ?? 1} seat{(subscription.seats ?? 1) > 1 ? "s" : ""}
        </Badge>
      </div>

      {/* usage meter (decorative) */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-surface-400">
          <span>Seats used</span>
          <span>2 / {subscription.seats ?? 5}</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-100">
          <div className="h-full rounded-full bg-brand-500" style={{ width: "40%" }} />
        </div>
      </div>

      {/* status banner */}
      {status === "cancelled" && (
        <div className="mt-4 rounded-xl border border-danger-200 bg-danger-500/5 p-3 text-sm text-danger-600">
          Your plan is cancelled. You can restore access up to 30 days after the cycle ends.
        </div>
      )}
      {status === "paused" && (
        <div className="mt-4 rounded-xl border border-warning-200 bg-warning-500/5 p-3 text-sm text-warning-500">
          Paused — you won't be charged while paused.
        </div>
      )}

      {/* actions */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-surface-500">Plan</span>
          <select
            value={plan}
            onChange={(e) => {
              setPlan(e.target.value);
              if (status === "active") fire("change", "active");
            }}
            className="h-9 cursor-pointer rounded-lg border border-surface-200 bg-surface-50 px-2 text-sm outline-none focus:border-brand-400"
          >
            {["Starter", "Pro", "Team"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>

        {status === "active" ? (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setConfirming("pause")}>
              Pause
            </Button>
            <Button variant="ghost" size="sm" className="text-danger-600" onClick={() => setConfirming("cancel")}>
              Cancel plan
            </Button>
          </div>
        ) : status === "paused" ? (
          <Button size="sm" onClick={() => fire("resume", "active")}>
            Resume
          </Button>
        ) : (
          <Button size="sm" onClick={() => fire("change", "active")}>
            Restart plan
          </Button>
        )}
      </div>

      {/* confirm step */}
      {confirming && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-surface-200 bg-surface-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-surface-600">
            {confirming === "pause" ? "Pause billing — you'll keep access until the cycle ends." : "Cancel the plan and lose access at cycle end?"}
          </p>
          <div className="flex shrink-0 gap-2">
            <Button variant="ghost" size="sm" onClick={() => setConfirming(null)}>
              Keep
            </Button>
            <Button
              variant={confirming === "cancel" ? "danger" : "secondary"}
              size="sm"
              onClick={() => fire(confirming, confirming === "pause" ? "paused" : "cancelled")}
            >
              Confirm
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}