import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (id: string) => void;
  className?: string;
  /** Accessible name for the tab list. */
  ariaLabel?: string;
}

/** Pill-style tabs; styled via primitives.css (scan-independent).
 *  WAI-ARIA tabs pattern: roving tabindex, Left/Right/Home/End navigation,
 *  and tab ↔ panel id wiring. */
export function Tabs({ tabs, defaultValue, value, onValueChange, className, ariaLabel }: TabsProps) {
  const [internal, setInternal] = useState<string | undefined>(defaultValue ?? tabs[0]?.id);
  const active = value ?? internal;
  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const focusTab = (id: string) => {
    select(id);
    // Keep keyboard focus on the newly selected tab (roving tabindex).
    listRef.current?.querySelector<HTMLElement>(`[data-tab-id="${id}"]`)?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir =
      e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : -1;
    if (dir === 0 && to === -1) return;
    e.preventDefault();
    if (to !== -1) {
      const target = tabs[to];
      if (target && !target.disabled) focusTab(target.id);
      return;
    }
    const i = tabs.findIndex((t) => t.id === active);
    if (i === -1) return;
    // Wrap around, skipping disabled tabs.
    for (let step = 1; step <= tabs.length; step++) {
      const t = tabs[(i + dir * step + tabs.length) % tabs.length]!;
      if (!t.disabled) {
        focusTab(t.id);
        return;
      }
    }
  };

  return (
    <div className={className}>
      <div ref={listRef} role="tablist" aria-label={ariaLabel} className="vault-tabs__list">
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              data-tab-id={t.id}
              id={`${baseId}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={t.disabled}
              onClick={() => select(t.id)}
              onKeyDown={onKeyDown}
              className="vault-tabs__trigger"
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {activeTab && (
        <div
          id={`${baseId}-panel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeTab.id}`}
          tabIndex={0}
          className="vault-tabs__panel"
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}