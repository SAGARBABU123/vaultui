import { useState, type ReactNode } from "react";

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
}

/** Pill-style tabs; styled via primitives.css (scan-independent). */
export function Tabs({ tabs, defaultValue, value, onValueChange, className }: TabsProps) {
  const [internal, setInternal] = useState<string | undefined>(defaultValue ?? tabs[0]?.id);
  const active = value ?? internal;
  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className={className}>
      <div className="vault-tabs__list" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === active}
            disabled={t.disabled}
            onClick={() => select(t.id)}
            className="vault-tabs__trigger"
          >
            {t.label}
          </button>
        ))}
      </div>
      {activeTab && (
        <div role="tabpanel" className="vault-tabs__panel">
          {activeTab.content}
        </div>
      )}
    </div>
  );
}