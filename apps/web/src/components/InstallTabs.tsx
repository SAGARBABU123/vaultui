import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@vaultui/utils";

/**
 * Industry-standard install switch — one package on npm, shown for all four
 * package managers (npm / yarn / pnpm / bun). Mirrors daisyUI/shadcn-style
 * install tabs: same registry, four commands, per-manager copy.
 */
export const INSTALL_MANAGERS = ["npm", "yarn", "pnpm", "bun"] as const;
export type InstallManager = (typeof INSTALL_MANAGERS)[number];

const VERB: Record<InstallManager, string> = {
  npm: "i",
  yarn: "add",
  pnpm: "add",
  bun: "add",
};

interface InstallTabsProps {
  /** Package names (no install keyword), e.g. ["@vaultui/ui", "@vaultui/tokens"] */
  packages: string[];
  /** dark = terminal chrome (landing), light = inline card (docs) */
  variant?: "light" | "dark";
  compact?: boolean;
  /** render a "$" shell prompt before the command */
  prompt?: boolean;
  defaultManager?: InstallManager;
  className?: string;
}

export function InstallTabs({
  packages,
  variant = "light",
  compact = false,
  prompt = false,
  defaultManager = "npm",
  className,
}: InstallTabsProps) {
  const [manager, setManager] = useState<InstallManager>(defaultManager);
  const [copied, setCopied] = useState(false);
  const dark = variant === "dark";

  const command = `${VERB[manager]} ${packages.join(" ")}`;

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      <div
        role="tablist"
        aria-label="Package manager"
        className={cn(
          "flex w-fit items-center gap-0.5 rounded-lg p-0.5 font-mono",
          dark ? "bg-surface-800/70" : "bg-surface-200/60",
          compact ? "text-xs" : "text-xs",
        )}
      >
        {INSTALL_MANAGERS.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={manager === m}
            onClick={() => setManager(m)}
            className={cn(
              "rounded-md px-2 py-0.5 transition-colors",
              manager === m
                ? dark
                  ? "bg-surface-700 text-surface-100"
                  : "bg-surface-0 text-surface-900 shadow-sm"
                : dark
                  ? "text-surface-500 hover:text-surface-300"
                  : "text-surface-500 hover:text-surface-800",
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "flex items-center gap-2 font-mono",
          dark
            ? "rounded-xl bg-surface-950 px-3 py-2 text-surface-100 shadow-raised ring-1 ring-brand-500/20"
            : "rounded-lg bg-surface-100 text-surface-600 shadow-inset",
          compact ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-sm",
        )}
      >
        {prompt && <span aria-hidden className={cn("shrink-0", dark ? "text-success-500" : "text-surface-400")}>$</span>}
        <code className="flex-1 whitespace-nowrap">
          <span className={dark ? "text-brand-400" : "text-brand-600"}>{manager} </span>
          <span className={dark ? "text-surface-100" : "text-surface-600"}>{command}</span>
        </code>
        <button
          type="button"
          onClick={copyCommand}
          aria-label="Copy install command"
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors",
            copied
              ? "text-success-500"
              : dark
                ? "text-surface-400 hover:bg-surface-800 hover:text-surface-200"
                : "text-surface-400 hover:bg-surface-200 hover:text-surface-700",
          )}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          <span className={compact ? "hidden sm:inline" : ""}>{copied ? "copied" : "copy"}</span>
        </button>
      </div>
    </div>
  );
}