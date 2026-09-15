import type { ReactNode } from "react";
import { cn } from "@vaultui/utils";
import { Check, X } from 'lucide-react';

interface VisualExampleProps {
  title?: string;
  bad: ReactNode;
  good: ReactNode;
  badLabel?: string;
  goodLabel?: string;
  className?: string;
  agentMode?: boolean;
}

export function VisualExample({
  title,
  bad,
  good,
  badLabel = "Bad",
  goodLabel = "Good",
  className,
  agentMode
}: VisualExampleProps) {
  if (agentMode) {
    return null; // In agent mode, we might want to hide complex visual examples or simplify them. We'll handle this at a higher level, but keeping it here for safety.
  }

  return (
    <div className={cn("my-12", className)}>
      {title && <h4 className="text-lg font-display font-medium mb-6 text-surface-800">{title}</h4>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bad Example */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-danger-600 font-medium text-sm">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-danger-100 text-danger-600">
              <X className="w-3 h-3" strokeWidth={3} />
            </div>
            {badLabel}
          </div>
          <div className="flex-1 rounded-xl border border-surface-200 bg-surface-100 overflow-hidden flex items-center justify-center p-8">
            <div className="w-full max-w-sm">
              {bad}
            </div>
          </div>
        </div>

        {/* Good Example */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-success-600 font-medium text-sm">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success-100 text-success-600">
              <Check className="w-3 h-3" strokeWidth={3} />
            </div>
            {goodLabel}
          </div>
          <div className="flex-1 rounded-xl border border-surface-200 bg-surface-50 overflow-hidden flex items-center justify-center p-8">
            <div className="w-full max-w-sm">
              {good}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
