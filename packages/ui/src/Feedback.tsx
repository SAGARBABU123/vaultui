import type { ReactNode } from "react";
import { cn } from "@vaultui/utils";

/* ================================ Skeleton ================================ */

export interface SkeletonProps {
  /** Set width/height via className (e.g. "h-20 w-40"). */
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <span aria-hidden="true" className={cn("vault-skeleton", className)} />;
}

/* ================================ Progress ================================ */

export interface ProgressProps {
  /** 0–100. */
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("vault-progress", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="vault-progress__bar" style={{ width: `${clamped}%` }} />
    </div>
  );
}

/* ============================== Empty state ============================== */

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  body?: string;
  /** Action buttons. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, body, action, className }: EmptyStateProps) {
  return (
    <div className={cn("vault-empty", className)}>
      {icon && <span className="vault-empty__icon">{icon}</span>}
      <p className="vault-empty__title">{title}</p>
      {body && <p className="vault-empty__body">{body}</p>}
      {action && <div className="vault-empty__action">{action}</div>}
    </div>
  );
}