import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function Accordions({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Accordions & Collapsibles
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Provide clear visual indicators of expansion state and make the entire row clickable.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Rotate the chevron and use full-bleed hit areas"
        why="If only the text is clickable, the hit area is too small. If the chevron doesn't rotate, the user has no visual confirmation of the state change."
        doText="Make the entire header row a clickable button. Rotate the chevron icon (rotate-180) when expanded."
        dontText="Do not require the user to precisely click a tiny 16px icon to open an accordion."
        check="Can I click anywhere on the row to expand it? Does the icon animate?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Accordion State"
        badLabel="Static & Small Hit Area"
        goodLabel="Animated & Full-width"
        bad={
          <div className="w-full max-w-sm mx-auto border border-neutral-300 bg-white">
            <div className="p-3 border-b border-neutral-200 flex gap-2">
              <ChevronRight className="w-4 h-4 cursor-pointer" />
              <span className="text-sm font-bold">Billing Details</span>
            </div>
            {/* The expanded content */}
            <div className="p-3 text-sm text-neutral-600">
              Your billing information and invoices appear here.
            </div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto border border-neutral-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <button className="w-full px-4 py-3 bg-white hover:bg-neutral-50 transition-colors flex justify-between items-center group">
              <span className="text-sm font-medium text-neutral-900">Billing Details</span>
              <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200 rotate-180" />
            </button>
            <div className="px-4 pb-4 pt-1 text-sm text-neutral-600 border-t border-neutral-100 bg-neutral-50/50">
              Your billing information, active subscriptions, and past invoices are securely stored here.
            </div>
          </div>
        }
      />
    </div>
  );
}
