import { useState, type ReactNode } from "react";
import { cn } from "@vaultui/utils";

export interface AccordionItem {
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple items open at once. Default false (single open). */
  multiple?: boolean;
  className?: string;
}

/** Single/multi-open accordion; styled via primitives.css. */
export function Accordion({ items, multiple = false, className }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(multiple ? [items[0]?.title?.toString() ?? ""] : []);

  const toggle = (key: string) => {
    setOpen((prev) =>
      multiple
        ? prev.includes(key)
          ? prev.filter((k) => k !== key)
          : [...prev, key]
        : prev.includes(key)
          ? []
          : [key],
    );
  };

  return (
    <div className={cn("vault-acc-list", className)}>
      {items.map((item, i) => {
        const key = `${i}-${item.title?.toString()}`;
        const isOpen = open.includes(key);
        return (
          <div key={key} className="vault-acc" data-open={isOpen}>
            <button type="button" className="vault-acc__trigger" aria-expanded={isOpen} onClick={() => toggle(key)}>
              <span>{item.title}</span>
              <ChevronDown className="vault-acc__icon" />
            </button>
            <div className="vault-acc__panel" aria-hidden={!isOpen}>
              <div className="vault-acc__panel-inner">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}