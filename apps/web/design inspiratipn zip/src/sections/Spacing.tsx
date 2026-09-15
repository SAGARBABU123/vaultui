import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';

export function Spacing({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Layout & Spacing
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Create relationships through proximity and give content room to breathe.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Start with too much whitespace"
        why="When designing for the web, whitespace is almost always added to a design to fix cramped UIs. But this means you stop adding space as soon as it stops looking actively bad, not when it looks great."
        doText="Start by giving everything way too much space, then remove it until you are happy with the result."
        dontText="Do not start cramped and nudge things apart pixel by pixel."
        check="If I doubled the padding on this container, would it feel more premium?"
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Grouping requires clear spacing"
        why="When the space between groups is the same as the space within a group, the UI becomes a solid wall of ambiguous content."
        doText="Ensure the space between distinct groups is noticeably larger than the space within the items of a group."
        dontText="Do not use the same margin-bottom value for every element."
        check="Is the space INSIDE this group smaller than the space BETWEEN this group and the next?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Ambiguous vs Clear Spacing"
        badLabel="Ambiguous Spacing"
        goodLabel="Clear Grouping"
        bad={
          <div className="space-y-4 p-4">
            <div>
              <div className="text-xs font-bold text-neutral-500 uppercase mb-2">Section 1</div>
              <div className="h-8 bg-neutral-200 rounded"></div>
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-500 uppercase mb-2">Section 2</div>
              <div className="h-8 bg-neutral-200 rounded"></div>
            </div>
          </div>
        }
        good={
          <div className="space-y-8 p-4">
            <div>
              <div className="text-xs font-bold text-neutral-500 tracking-wider uppercase mb-2">Section 1</div>
              <div className="h-8 bg-neutral-200 rounded border border-neutral-300"></div>
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-500 tracking-wider uppercase mb-2">Section 2</div>
              <div className="h-8 bg-neutral-200 rounded border border-neutral-300"></div>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="You don't have to fill the whole screen"
        why="Just because you have a 1440px monitor doesn't mean your UI needs to stretch across it. Spreading things out makes interfaces harder to interpret."
        doText="Give components the width they actually need. Use max-width to constrain content. Break narrow forms into columns if you must fill space."
        dontText="Do not stretch a 3-field login form to 100% of the screen width."
        check="Is this container wide because the content requires it, or just because the screen is big?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Constraining Width"
        badLabel="Full Width (Stretched)"
        goodLabel="Constrained (Max-width)"
        bad={
          <div className="w-full space-y-3 p-4">
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-sm font-medium text-neutral-900">Total</span>
              <span className="text-sm text-neutral-600">$429.00</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-sm font-medium text-neutral-900">Taxes</span>
              <span className="text-sm text-neutral-600">$55.77</span>
            </div>
          </div>
        }
        good={
          <div className="w-full flex justify-center p-4">
            <div className="w-48 space-y-3">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-sm font-medium text-neutral-900">Total</span>
                <span className="text-sm text-neutral-600">$429.00</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-sm font-medium text-neutral-900">Taxes</span>
                <span className="text-sm text-neutral-600">$55.77</span>
              </div>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Grids are tools, not laws"
        why="Outsourcing all layout decisions to a 12-column grid does more harm than good. Some elements (like sidebars) need fixed widths, not relative percentages."
        doText="Use grids for main content areas, but allow supporting structure (sidebars, navs) to have fixed or intrinsic widths."
        dontText="Do not force a sidebar to be '3 columns wide' if that makes it too wide on desktop and too narrow on mobile."
        check="Should this element scale relative to the screen, or should it just be exactly 250px wide?"
      />

    </div>
  );
}
