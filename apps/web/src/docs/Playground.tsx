import { useState, type ReactNode } from "react";
import { cn } from "@vaultui/utils";
import { Avatar, AvatarGroup, Badge, Button, Progress, Switch, Input } from "@vaultui/ui";
import { Check, Copy } from "lucide-react";

/**
 * Prop playground — interactive controls that live-update a demo and generate
 * the exact JSX for it. Industry-standard (Storybook-style) but inside the
 * docs, with copy-once code output.
 */

type ControlValue = string | number | boolean;

export interface ControlDef {
  key: string;
  label: string;
  type: "select" | "toggle" | "text" | "number";
  options?: string[];
  min?: number;
  max?: number;
  default: ControlValue;
}

export interface PlaygroundBuilder {
  controls: ControlDef[];
  /** Build the live demo from the current values. */
  demo: (v: Record<string, ControlValue>) => ReactNode;
  /** Build the copy-ready JSX from the current values. */
  code: (v: Record<string, ControlValue>) => string;
}

export function Playground({ def }: { def: PlaygroundBuilder }) {
  const initial = Object.fromEntries(def.controls.map((c) => [c.key, c.default])) as Record<string, ControlValue>;
  const [values, setValues] = useState(initial);
  const [copied, setCopied] = useState(false);

  const setValue = (key: string, value: ControlValue) => setValues((prev) => ({ ...prev, [key]: value }));
  const code = def.code(values);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Controls */}
      <div className="space-y-4 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-soft lg:col-span-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">Playground</p>
        <div className="space-y-4">
          {def.controls.map((c) => (
            <ControlRow key={c.key} control={c} value={values[c.key] ?? c.default} onChange={(v) => setValue(c.key, v)} />
          ))}
        </div>
      </div>

      {/* Live + code */}
      <div className="space-y-4 lg:col-span-3">
        <div className="min-h-36 rounded-2xl border border-surface-200 bg-surface-100 p-5 shadow-inset">
          {def.demo(values)}
        </div>
        <div className="overflow-hidden rounded-2xl border border-surface-800 bg-surface-950 shadow-soft">
          <div className="flex items-center justify-between border-b border-surface-800 bg-surface-900 px-3 py-2">
            <span className="font-mono text-[11px] text-surface-400">generated jsx</span>
            <button
              type="button"
              onClick={copy}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                copied ? "bg-success-500/20 text-success-400" : "text-surface-400 hover:bg-surface-800 hover:text-surface-200",
              )}
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-surface-200">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function ControlRow({
  control,
  value,
  onChange,
}: {
  control: ControlDef;
  value: ControlValue;
  onChange: (v: ControlValue) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] font-medium text-surface-700">{control.label}</span>
      {control.type === "toggle" ? (
        <Switch checked={Boolean(value)} onCheckedChange={(v) => onChange(v)} size="sm" />
      ) : control.type === "select" ? (
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 cursor-pointer rounded-lg border border-surface-200 bg-surface-0 px-2 text-[13px] text-surface-700 shadow-inset outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          {(control.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : control.type === "number" ? (
        <input
          type="range"
          min={control.min ?? 0}
          max={control.max ?? 100}
          value={Number(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-28 accent-brand-600"
        />
      ) : (
        <input
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-36 rounded-lg border border-surface-200 bg-surface-0 px-2 text-[13px] text-surface-700 shadow-inset outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      )}
    </div>
  );
}

/* ------------------------- per-component configs ------------------------- */

const q = (v: string) => `"${v}"`;

export const PLAYGROUNDS: Record<string, PlaygroundBuilder> = {
  button: {
    controls: [
      { key: "variant", label: "Variant", type: "select", options: ["primary", "secondary", "ghost", "danger"], default: "primary" },
      { key: "size", label: "Size", type: "select", options: ["xs", "sm", "md", "lg", "xl"], default: "md" },
      { key: "disabled", label: "Disabled", type: "toggle", default: false },
      { key: "loading", label: "Loading", type: "toggle", default: false },
      { key: "label", label: "Label", type: "text", default: "Build something" },
    ],
    demo: (v) => (
      <div className="flex min-h-28 items-center justify-center">
        <Button
          variant={v.variant as never}
          size={v.size as never}
          disabled={Boolean(v.disabled)}
          loading={Boolean(v.loading)}
        >
          {String(v.label)}
        </Button>
      </div>
    ),
    code: (v) =>
      [
        "<Button",
        `  variant="${v.variant}"`,
        `  size="${v.size}"`,
        Boolean(v.disabled) ? '  disabled\n' : "",
        Boolean(v.loading) ? "  loading\n" : "",
        `  >${v.label}</Button>`,
      ]
        .filter(Boolean)
        .join("\n"),
  },

  badge: {
    controls: [
      { key: "variant", label: "Variant", type: "select", options: ["neutral", "brand", "success", "warning", "danger", "info"], default: "brand" },
      { key: "dot", label: "Status dot", type: "toggle", default: true },
      { key: "label", label: "Label", type: "text", default: "Live" },
    ],
    demo: (v) => (
      <div className="flex min-h-28 items-center justify-center">
        <Badge variant={v.variant as never} dot={Boolean(v.dot)} size="md">
          {String(v.label)}
        </Badge>
      </div>
    ),
    code: (v) =>
      `<Badge variant="${v.variant}"${v.dot ? " dot" : ""}>{${q(String(v.label))}}</Badge>`,
  },

  switch: {
    controls: [
      { key: "size", label: "Size", type: "select", options: ["sm", "md"], default: "md" },
      { key: "checked", label: "Checked", type: "toggle", default: true },
      { key: "disabled", label: "Disabled", type: "toggle", default: false },
    ],
    demo: (v) => (
      <div className="flex min-h-28 items-center justify-center">
        <Switch checked={Boolean(v.checked)} size={v.size as never} disabled={Boolean(v.disabled)} />
      </div>
    ),
    code: (v) =>
      `<Switch${v.size === "md" ? "" : ` size="${v.size}"`}${v.disabled ? " disabled" : ""} checked={${Boolean(v.checked)}} />`,
  },

  progress: {
    controls: [
      { key: "value", label: "Value", type: "number", min: 0, max: 100, default: 62 },
      { key: "width", label: "Width", type: "select", options: ["w-full", "w-1/2", "w-64"], default: "w-full" },
    ],
    demo: (v) => (
      <div className={cn("flex min-h-28 items-center", v.width as string)}>
        <Progress value={Number(v.value)} className="w-full" />
      </div>
    ),
    code: (v) => `<Progress value={${v.value}} className="${v.width}" />`,
  },

  avatar: {
    controls: [
      { key: "size", label: "Size", type: "select", options: ["sm", "md", "lg"], default: "lg" },
      { key: "name", label: "Name", type: "text", default: "Sagar Babu" },
      { key: "group", label: "Show group", type: "toggle", default: true },
    ],
    demo: (v) => (
      <div className="flex min-h-28 items-center justify-center gap-6">
        {Boolean(v.group) ? (
          <AvatarGroup
            size={v.size as never}
            max={4}
            avatars={[
              { name: String(v.name), src: "https://i.pravatar.cc/80?img=5" },
              { name: "Priya R", src: "https://i.pravatar.cc/80?img=47" },
              { name: "Dev K", src: "https://i.pravatar.cc/80?img=12" },
              { name: "Leo T", src: "https://i.pravatar.cc/80?img=32" },
              { name: "+2" },
            ]}
          />
        ) : (
          <Avatar name={String(v.name)} size={v.size as never} src="https://i.pravatar.cc/80?img=5" />
        )}
      </div>
    ),
    code: (v) =>
      v.group
        ? `<AvatarGroup size="${v.size}" max={4} avatars={[{ name: ${q(String(v.name))} }, …]} />`
        : `<Avatar name={${q(String(v.name))}} size="${v.size}" />`,
  },

  input: {
    controls: [
      { key: "size", label: "Size", type: "select", options: ["sm", "md", "lg"], default: "md" },
      { key: "disabled", label: "Disabled", type: "toggle", default: false },
      { key: "placeholder", label: "Placeholder", type: "text", default: "you@company.com" },
    ],
    demo: (v) => (
      <div className="flex min-h-28 items-center justify-center px-4">
        <Input
          size={v.size as never}
          disabled={Boolean(v.disabled)}
          placeholder={String(v.placeholder)}
          className="max-w-xs"
        />
      </div>
    ),
    code: (v) =>
      `<Input${v.size === "md" ? "" : ` size="${v.size}"`} placeholder={${q(String(v.placeholder))}}${v.disabled ? " disabled" : ""} />`,
  },
};