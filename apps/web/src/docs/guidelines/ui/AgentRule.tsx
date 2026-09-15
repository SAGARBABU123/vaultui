
import { cn } from "@vaultui/utils";
import { TerminalSquare } from 'lucide-react';

interface AgentRuleProps {
  rule: string;
  why: string;
  doText: string;
  dontText: string;
  check: string;
  className?: string;
  agentMode?: boolean;
}

export function AgentRule({
  rule,
  why,
  doText,
  dontText,
  check,
  className,
  agentMode
}: AgentRuleProps) {
  if (agentMode) {
    return (
      <div className={cn("p-4 border border-brand-200 bg-brand-50 rounded-lg mb-4 font-mono text-sm", className)}>
        <div className="font-bold text-brand-900 mb-2">RULE: {rule}</div>
        <div className="mb-1"><span className="font-bold text-surface-700">WHY:</span> {why}</div>
        <div className="mb-1"><span className="font-bold text-success-700">DO:</span> {doText}</div>
        <div className="mb-1"><span className="font-bold text-danger-700">DON'T:</span> {dontText}</div>
        <div className="mt-3 p-2 bg-brand-100 rounded text-brand-900 font-medium flex gap-2 items-start">
          <TerminalSquare className="w-4 h-4 mt-0.5 shrink-0" />
          <span>CHECK: {check}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("my-8 overflow-hidden rounded-xl border border-surface-200 bg-white", className)}>
      <div className="p-6 border-b border-surface-100 bg-surface-50/50">
        <h4 className="text-xl font-display font-medium text-surface-900 mb-2">{rule}</h4>
        <p className="text-surface-600 leading-relaxed">{why}</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
        <div>
          <h5 className="text-success-700 font-bold text-sm tracking-widest uppercase mb-2">Do</h5>
          <p className="text-surface-700">{doText}</p>
        </div>
        <div>
          <h5 className="text-danger-700 font-bold text-sm tracking-widest uppercase mb-2">Don't</h5>
          <p className="text-surface-700">{dontText}</p>
        </div>
      </div>
      <div className="p-4 bg-brand-50 border-t border-brand-100 flex gap-3 items-start">
        <div className="w-6 h-6 rounded bg-brand-100 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
          <TerminalSquare className="w-4 h-4" />
        </div>
        <div>
          <h5 className="text-brand-900 font-semibold text-sm mb-1">Agent Check</h5>
          <p className="text-brand-800 text-sm italic">"{check}"</p>
        </div>
      </div>
    </div>
  );
}
