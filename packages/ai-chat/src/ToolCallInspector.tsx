import { Badge } from "@gudipudimani/ui";
import { cn } from "@gudipudimani/utils";
import { useState } from "react";
import type { ToolCall } from "./types";

export interface ToolCallInspectorProps extends ToolCall {
  /** Open expanded on mount. */
  defaultOpen?: boolean;
  className?: string;
}

const statusMeta: Record<NonNullable<ToolCall["status"]>, { label: string; variant: "info" | "success" | "danger" }> = {
  running: { label: "Running", variant: "info" },
  success: { label: "Success", variant: "success" },
  error: { label: "Error", variant: "danger" },
};

/**
 * Collapsible JSON inspector for a single agent tool call —
 * name + status in the header, args/result in the body.
 * Body scrolls horizontally on narrow screens (never breaks layout).
 */
export function ToolCallInspector({
  name,
  args,
  result,
  status = "success",
  defaultOpen = false,
  className,
}: ToolCallInspectorProps) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = statusMeta[status];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border-0 bg-surface-0 shadow-soft",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-surface-50"
      >
        <span className="flex min-w-0 items-center gap-2">
          <WrenchIcon className="size-3.5 shrink-0 text-surface-400" />
          <code className="truncate font-mono text-xs font-semibold text-surface-800">{name}</code>
          <Badge variant={meta.variant} size="sm" dot={status === "running"}>
            {meta.label}
          </Badge>
        </span>
        <ChevronIcon
          className={cn("size-4 shrink-0 text-surface-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="border-t border-surface-200 bg-surface-950/95 px-3 py-2.5 font-mono text-xs leading-relaxed text-surface-200">
          {args !== undefined && (
            <JsonBlock label="args" value={args} />
          )}
          {result !== undefined && (
            <JsonBlock
              label="result"
              value={result}
              className={status === "error" ? "text-danger-400" : "text-emerald-300"}
            />
          )}
        </div>
      )}
    </div>
  );
}

function JsonBlock({
  label,
  value,
  className,
}: {
  label: string;
  value: unknown;
  className?: string;
}) {
  return (
    <div className="overflow-x-auto py-0.5">
      <span className="select-none text-surface-500">{label} </span>
      <span className={cn("whitespace-pre", className)}>
        {JSON.stringify(value, null, 2)}
      </span>
    </div>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75a4.5 4.5 0 01-5.62 4.4l-3.38 3.38m0-8.83a4.5 4.5 0 10-6.36 6.36l9.68-9.68zM4.97 16.47L3 18.44V21h2.56l1.97-1.97m4.39-4.39l5.4 5.4a1.5 1.5 0 002.12 0l1.06-1.06a1.5 1.5 0 000-2.12l-5.4-5.4"
      />
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