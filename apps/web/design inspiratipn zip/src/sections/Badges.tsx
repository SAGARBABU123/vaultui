import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';

export function Badges({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Badges & Tags
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Status indicators are not primary actions. Stop making them look like buttons.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Soften your badges"
        why="When a badge or tag uses a fully saturated, solid background color with white text, it draws massive visual attention and looks exactly like a primary button, confusing the user."
        doText="Use soft, tinted backgrounds (e.g., bg-emerald-50) with dark, high-contrast text (e.g., text-emerald-700) for status indicators."
        dontText="Do not use solid red, green, or yellow blocks for tags."
        check="Does this status pill accidentally look like the most clickable thing on the page?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Status Indicators"
        badLabel="Heavy & Distracting"
        goodLabel="Soft & Contextual"
        bad={
          <div className="p-6 bg-white border border-neutral-200 rounded-lg w-full max-w-md mx-auto space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <span className="font-medium">Invoice #1024</span>
              <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">PAID</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <span className="font-medium">Invoice #1025</span>
              <span className="bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">PENDING</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Invoice #1026</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">FAILED</span>
            </div>
          </div>
        }
        good={
          <div className="p-6 bg-white border border-neutral-200 rounded-lg shadow-sm w-full max-w-md mx-auto space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <span className="font-medium text-neutral-900">Invoice #1024</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">Paid</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <span className="font-medium text-neutral-900">Invoice #1025</span>
              <span className="bg-yellow-50 text-yellow-800 border border-yellow-200/50 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">Pending</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-neutral-900">Invoice #1026</span>
              <span className="bg-red-50 text-red-700 border border-red-200/50 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">Failed</span>
            </div>
          </div>
        }
      />
    </div>
  );
}
