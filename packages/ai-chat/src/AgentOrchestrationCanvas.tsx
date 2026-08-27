import { Badge } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import type { ReactNode } from "react";

export type AgentStepKind = "input" | "agent" | "tool" | "output";
export type AgentStepStatus = "pending" | "running" | "success" | "error";

export interface AgentStep {
  id: string;
  label: string;
  kind: AgentStepKind;
  status?: AgentStepStatus;
  detail?: string;
  durationMs?: number;
}

export interface AgentGraph {
  id: string;
  name: string;
  model?: string;
  latencyMs?: number;
  costUsd?: number;
  /** Sequential steps; arrays inside are executed in parallel. */
  batches: AgentStep[][];
}

export interface AgentOrchestrationCanvasProps {
  graph: AgentGraph;
  className?: string;
}

const kindMeta: Record<AgentStepKind, { label: string; card: string; icon: ReactNode }> = {
  input: {
    label: "Input",
    card: "border-surface-300 bg-surface-50",
    icon: <InboxIcon className="size-3.5 text-surface-500" />,
  },
  agent: {
    label: "Agent",
    card: "border-brand-300 bg-gradient-to-br from-brand-50 to-brand-100/60",
    icon: <BotIcon className="size-3.5 text-brand-600" />,
  },
  tool: {
    label: "Tool",
    card: "border-surface-200 bg-surface-0",
    icon: <WrenchIcon className="size-3.5 text-surface-500" />,
  },
  output: {
    label: "Output",
    card: "border-success-300 bg-success-500/10",
    icon: <FlagIcon className="size-3.5 text-success-500" />,
  },
};

const statusBadge: Record<AgentStepStatus, { label: string; variant: "info" | "success" | "danger" | "neutral" }> = {
  pending: { label: "Pending", variant: "neutral" },
  running: { label: "Running", variant: "info" },
  success: { label: "Success", variant: "success" },
  error: { label: "Error", variant: "danger" },
};

/**
 * AgentOrchestrationCanvas — a visual flow of an agent run:
 * input → agent → parallel tool batches → output, with connectors.
 * Batches wrap on mobile; the canvas scrolls horizontally if a batch
 * is wider than the viewport.
 */
export function AgentOrchestrationCanvas({ graph, className }: AgentOrchestrationCanvasProps) {
  const allSteps = graph.batches.flat();
  const anyRunning = allSteps.some((s) => s.status === "running");

  return (
    <div
      className={cn(
        "rounded-2xl border-0 bg-surface-100 shadow-inset p-4 shadow-soft sm:p-5",
        className,
      )}
    >
      {/* header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            {anyRunning && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-500 animate-pulse-ring" />
            )}
            <span className="relative inline-flex size-2 rounded-full bg-brand-600" />
          </span>
          <span className="text-sm font-semibold">{graph.name}</span>
          {graph.model && (
            <Badge variant="neutral" size="sm">
              {graph.model}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {graph.latencyMs !== undefined && (
            <Badge variant="info" size="sm">
              {graph.latencyMs}ms
            </Badge>
          )}
          {graph.costUsd !== undefined && (
            <Badge variant="neutral" size="sm">
              ${graph.costUsd.toFixed(4)}
            </Badge>
          )}
        </div>
      </div>

      {/* flow */}
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-min flex-col items-stretch gap-0">
          {graph.batches.map((batch, bi) => (
            <div key={bi} className="flex flex-col items-stretch">
              {/* connector */}
              {bi > 0 && (
                <div className="flex justify-center py-1">
                  <span className="h-4 w-px bg-surface-300" />
                </div>
              )}

              {batch.length === 1 ? (
                <StepCard step={batch[0]!} />
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  {batch.map((step) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <StepCard step={step} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCard({ step }: { step: AgentStep }) {
  const meta = kindMeta[step.kind];
  const status = step.status ?? "pending";
  const sb = statusBadge[status];

  return (
    <div
      className={cn(
        "flex w-56 flex-col gap-1.5 rounded-xl border p-3",
        meta.card,
        status === "running" && "ring-2 ring-brand-500/30",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5">
          {meta.icon}
          <span className="truncate text-xs font-semibold text-surface-800">{step.label}</span>
        </span>
        <Badge variant={sb.variant} size="sm" dot={status === "running"}>
          {sb.label}
        </Badge>
      </div>
      {step.detail && <p className="truncate text-xs text-surface-500">{step.detail}</p>}
      {step.durationMs !== undefined && (
        <span className="text-xs font-mono text-surface-400">{step.durationMs}ms</span>
      )}
    </div>
  );
}

/* --------------------------------- icons --------------------------------- */

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
    </svg>
  );
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V2m0 2.5A4.5 4.5 0 017.5 9h9A4.5 4.5 0 0112 4.5zM4.5 9v7.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 13.5h.008v.008H8.25V13.5zm7.5 0h.008v.008h-.008V13.5z" />
    </svg>
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

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18m0-15h13.5l-2 4 2 4H3" />
    </svg>
  );
}