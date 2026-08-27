import { cn } from "@vault/utils";
import { useState } from "react";

export interface FeatureFlag {
  id: string;
  description: string;
  /** Rollout percentage 0–100. */
  rollout: number;
  environments: { dev: boolean; staging: boolean; prod: boolean };
}

export interface FeatureFlagBoardProps {
  flags: FeatureFlag[];
  onChange?: (flags: FeatureFlag[]) => void;
  className?: string;
}

function rolloutTone(rollout: number) {
  if (rollout >= 100) return { text: "text-success-500", bar: "bg-success-500" };
  if (rollout <= 0) return { text: "text-surface-400", bar: "bg-surface-400" };
  return { text: "text-warning-500", bar: "bg-warning-500" };
}

function envState(f: FeatureFlag) {
  const on = Object.values(f.environments).filter(Boolean).length;
  if (on === 3) return { label: "All environments", variant: "success" as const };
  if (on === 0) return { label: "Off", variant: "neutral" as const };
  return { label: `${on}/3 envs`, variant: "warning" as const };
}

/**
 * FeatureFlagBoard — rollout management table with per-environment
 * switches and a rollout slider. Fully controlled (call `onChange`
 * to persist), or manage internally via the returned copy.
 */
export function FeatureFlagBoard({ flags: initial, onChange, className }: FeatureFlagBoardProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>(initial);

  const commit = (next: FeatureFlag[]) => {
    setFlags(next);
    onChange?.(next);
  };

  const setFlag = (id: string, patch: Partial<FeatureFlag>) =>
    commit(flags.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  return (
    <div className={cn("overflow-hidden rounded-2xl border-0 bg-surface-0 shadow-soft", className)}>
      <div className="flex flex-col gap-1 overflow-x-auto">
        {flags.map((f) => {
          const tone = rolloutTone(f.rollout);
          const es = envState(f);
          return (
            <div
              key={f.id}
              className="flex flex-col gap-3 border-b border-surface-100 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 sm:w-52">
                <code className="font-mono text-[13px] font-semibold text-surface-800">{f.id}</code>
                <p className="truncate text-xs text-surface-400">{f.description}</p>
              </div>

              {/* Rollout */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={f.rollout}
                  onChange={(e) => setFlag(f.id, { rollout: Number(e.target.value) })}
                  aria-label={`${f.id} rollout`}
                  className="h-1.5 w-full cursor-pointer accent-brand-600"
                />
                <span className={cn("w-20 shrink-0 text-right font-mono text-xs font-bold", tone.text)}>
                  {f.rollout}%
                </span>
              </div>

              {/* Environments */}
              <div className="flex shrink-0 items-center gap-3">
                {(["dev", "staging", "prod"] as const).map((env) => (
                  <label key={env} className="flex cursor-pointer items-center gap-1.5">
                    <Switch
                      on={f.environments[env]}
                      onToggle={() =>
                        setFlag(f.id, { environments: { ...f.environments, [env]: !f.environments[env] } })
                      }
                      label={`${env} ${f.environments[env] ? "on" : "off"}`}
                    />
                    <span className="text-xs font-medium text-surface-500">{env}</span>
                  </label>
                ))}
                <span
                  className={cn(
                    "hidden rounded-full px-2 py-0.5 text-xs font-semibold xl:inline-block",
                    es.variant === "success" && "bg-success-500/10 text-success-500",
                    es.variant === "warning" && "bg-warning-500/10 text-warning-500",
                    es.variant === "neutral" && "bg-surface-100 text-surface-500",
                  )}
                >
                  {es.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        on ? "bg-brand-600" : "bg-surface-300",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-4 rounded-full bg-white shadow-soft transition-transform",
          on ? "translate-x-[18px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}