import { Badge } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { useState } from "react";

export interface PromptVariant {
  id: string;
  name: string;
  system: string;
  user: string;
  response: string;
  meta?: { tokens?: number; latencyMs?: number; costUsd?: number };
}

export interface PromptPlaygroundProps {
  variants: PromptVariant[];
  /** Height of the scrollable panes. */
  heightClass?: string;
  className?: string;
}

/**
 * PromptPlayground — iterate on prompts with an A/B compare tool.
 * Left: system + user prompts (editable copies of the variants).
 * Right: the response(s), with temperature / max-tokens sliders
 * and per-variant meta. Stacked on mobile, 2–3 columns on desktop.
 */
export function PromptPlayground({
  variants,
  heightClass = "h-[360px] sm:h-[420px]",
  className,
}: PromptPlaygroundProps) {
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [compare, setCompare] = useState(false);
  const [leftId, setLeftId] = useState(variants[0]?.id ?? "");
  const [rightId, setRightId] = useState(variants[1]?.id ?? variants[0]?.id ?? "");
  // Editable copies of the system/user prompts, keyed by variant id
  const [edits, setEdits] = useState<Record<string, { system?: string; user?: string }>>({});

  const applyEdits = (v: PromptVariant): PromptVariant => {
    const e = edits[v.id];
    return e ? { ...v, system: e.system ?? v.system, user: e.user ?? v.user } : v;
  };

  const left = applyEdits(variants.find((v) => v.id === leftId) ?? variants[0]!);
  const right = applyEdits(variants.find((v) => v.id === rightId) ?? variants[0]!);

  const patch = (id: string, key: "system" | "user", text: string) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [key]: text } }));
  };

  return (
    <div className={cn("rounded-2xl border-0 bg-surface-50 shadow-soft", className)}>
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 bg-surface-0 px-4 py-3">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm" dot>
            Playground
          </Badge>
          <VariantTabs variants={variants} activeId={left.id} onChange={setLeftId} />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Slider label="Temp" value={temperature} min={0} max={1} step={0.1} onChange={setTemperature} />
          <Slider label="Max tokens" value={maxTokens} min={256} max={4096} step={256} onChange={setMaxTokens} />
          <button
            type="button"
            onClick={() => setCompare((c) => !c)}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
              compare
                ? "border-brand-400 bg-brand-600 text-white"
                : "border-surface-200 bg-surface-50 text-surface-600 hover:border-brand-300",
            )}
            aria-pressed={compare}
          >
            A/B compare
          </button>
        </div>
      </div>

      <div className={cn("grid gap-4 p-4 sm:p-5", compare ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
        {/* Left: prompts */}
        <div className="flex min-w-0 flex-col gap-3">
          <PromptPane label="System" text={left.system} editable onChange={(t) => patch(leftId, "system", t)} />
          <PromptPane label="User" text={left.user} editable onChange={(t) => patch(leftId, "user", t)} />
        </div>

        {/* Right: responses */}
        {compare ? (
          <>
            <ResponsePane
              variant={left}
              temperature={temperature}
              maxTokens={maxTokens}
              heightClass={heightClass}
              onSelectVariant={setLeftId}
              variants={variants}
            />
            <ResponsePane
              variant={right}
              temperature={temperature}
              maxTokens={maxTokens}
              heightClass={heightClass}
              onSelectVariant={setRightId}
              variants={variants}
            />
          </>
        ) : (
          <ResponsePane
            variant={left}
            temperature={temperature}
            maxTokens={maxTokens}
            heightClass={heightClass}
            onSelectVariant={setLeftId}
            variants={variants}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------- toolbar bits ----------------------------- */

function VariantTabs({
  variants,
  activeId,
  onChange,
}: {
  variants: PromptVariant[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="tablist" aria-label="Prompt variants">
      {variants.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          aria-selected={v.id === activeId}
          onClick={() => onChange(v.id)}
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
            v.id === activeId
              ? "bg-brand-100 text-brand-700"
              : "text-surface-500 hover:bg-surface-100 hover:text-surface-800",
          )}
        >
          {v.name}
        </button>
      ))}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-surface-500">
      <span className="font-medium">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-20 cursor-pointer accent-brand-600"
      />
      <span className="w-10 font-mono text-surface-700">{value}</span>
    </label>
  );
}

/* --------------------------------- panes ---------------------------------- */

function PromptPane({
  label,
  text,
  editable,
  onChange,
}: {
  label: string;
  text: string;
  editable: boolean;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex min-h-0 flex-col rounded-xl border-0 bg-surface-0 shadow-soft">
      <div className="flex items-center justify-between border-b border-surface-200 px-3 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-surface-400">
          {label}
        </span>
        <span className="text-xs text-surface-400">{text.length} chars</span>
      </div>
      <textarea
        readOnly={!editable}
        value={text}
        rows={6}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="h-full min-h-[7rem] w-full resize-none bg-transparent p-3 font-mono text-[13px] leading-relaxed text-surface-700 outline-none read-only:cursor-default"
      />
    </div>
  );
}

function ResponsePane({
  variant,
  temperature,
  maxTokens,
  heightClass,
  variants,
  onSelectVariant,
}: {
  variant: PromptVariant;
  temperature: number;
  maxTokens: number;
  heightClass: string;
  variants: PromptVariant[];
  onSelectVariant: (id: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl border-0 bg-surface-0 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-200 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Response · Variant {variant.name}
          </span>
          {variants.length > 1 && (
            <select
              value={variant.id}
              onChange={(e) => onSelectVariant(e.target.value)}
              className="cursor-pointer rounded-md border-0 bg-surface-100 shadow-inset px-1.5 py-0.5 text-xs font-medium text-surface-600 outline-none"
              aria-label="Response variant"
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <span className="rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-500">
          temp {temperature} · {maxTokens} tok
        </span>
      </div>

      <div className={cn("overflow-y-auto", heightClass)}>
        <pre className="whitespace-pre-wrap break-words p-3 font-sans text-sm leading-relaxed text-surface-800">
          {variant.response}
        </pre>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-surface-200 px-3 py-2">
        {variant.meta?.tokens !== undefined && <Badge variant="neutral" size="sm">{variant.meta.tokens} tok</Badge>}
        {variant.meta?.latencyMs !== undefined && <Badge variant="info" size="sm">{variant.meta.latencyMs}ms</Badge>}
        {variant.meta?.costUsd !== undefined && <Badge variant="neutral" size="sm">${variant.meta.costUsd.toFixed(4)}</Badge>}
      </div>
    </div>
  );
}