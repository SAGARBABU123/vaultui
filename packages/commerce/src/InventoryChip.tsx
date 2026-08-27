import { cn } from "@vaultui/utils";

export type InventoryLevel = "in" | "low" | "out";

export interface InventoryChipProps {
  level: InventoryLevel;
  /** Remaining count (used for the "low" message). */
  count?: number;
  /** Expected restock date, shown when out of stock. */
  restockDate?: string;
  className?: string;
}

const meta: Record<InventoryLevel, { classes: string; dot: string; label: (p: { count?: number; restockDate?: string }) => string }> = {
  in: {
    classes: "bg-success-500/10 text-success-500 border-success-500/30",
    dot: "bg-success-500",
    label: () => "In stock",
  },
  low: {
    classes: "bg-warning-500/10 text-warning-500 border-warning-500/30",
    dot: "bg-warning-500",
    label: ({ count }) => (count !== undefined ? `Only ${count} left` : "Low stock"),
  },
  out: {
    classes: "bg-danger-500/10 text-danger-500 border-danger-500/30",
    dot: "bg-danger-500",
    label: ({ restockDate }) => (restockDate ? `Back in ${restockDate}` : "Out of stock"),
  },
};

/**
 * InventoryChip — stock status at a glance. Subtle enticement when
 * low: "Only 3 left" converts. Fully token-driven.
 */
export function InventoryChip({ level, count, restockDate, className }: InventoryChipProps) {
  const m = meta[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        m.classes,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", m.dot)} />
      {m.label({ count, restockDate })}
    </span>
  );
}