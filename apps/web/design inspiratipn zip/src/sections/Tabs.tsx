import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';

export function Tabs({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Tabs & Segmented Controls
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Don't just use a row of buttons. Clearly separate the active section from the inactive options.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Define clear active and inactive states"
        why="If tabs look like regular buttons, users might think clicking them submits an action rather than changing the view. The active tab needs to visually connect to the content below it."
        doText="Use an underline for standard tabs (anchored to a bottom border) or a nested 'pill' background for segmented controls. Inactive tabs should have muted text colors."
        dontText="Do not use primary-colored filled buttons for standard navigation tabs."
        check="Does the active tab visually anchor to the content area?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Underline Tabs"
        badLabel="Ambiguous Buttons"
        goodLabel="Anchored Underline"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-neutral-200 rounded">
            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1.5 bg-neutral-200 font-bold rounded text-sm">Account</button>
              <button className="px-3 py-1.5 bg-neutral-100 rounded text-sm">Security</button>
              <button className="px-3 py-1.5 bg-neutral-100 rounded text-sm">Billing</button>
            </div>
            <div className="text-sm text-neutral-500">Account settings content...</div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-neutral-200 rounded shadow-sm">
            <div className="flex gap-6 border-b border-neutral-200 mb-4">
              <button className="pb-2 border-b-2 border-primary-600 text-primary-700 font-medium text-sm">Account</button>
              <button className="pb-2 border-b-2 border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 font-medium text-sm transition-colors">Security</button>
              <button className="pb-2 border-b-2 border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 font-medium text-sm transition-colors">Billing</button>
            </div>
            <div className="text-sm text-neutral-600">Account settings content...</div>
          </div>
        }
      />
    </div>
  );
}
