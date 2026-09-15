import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';

export function Motion({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Meaningful Motion
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Animation isn't for decoration. It's for helping the user understand state changes.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Soften interaction feedback"
        why="Instantaneous, 0ms changes on hover or focus feel rigid and abrupt. Smoothing these out slightly makes the interface feel highly polished and organic."
        doText="Add short (150ms - 200ms) transitions to background colors, text colors, borders, and shadows on interactive elements. (e.g. Tailwind's 'transition-colors duration-150')."
        dontText="Do not use long, slow transitions (>300ms) for micro-interactions, as this makes the UI feel sluggish."
        check="Does this button snap instantly to its hover state, or does it smoothly transition?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Hover Transitions"
        badLabel="Instant (0ms)"
        goodLabel="Smoothed (150ms)"
        bad={
          <div className="flex justify-center p-8">
            <button className="px-6 py-2 bg-neutral-100 hover:bg-neutral-800 text-neutral-700 hover:text-white font-medium rounded-lg">
              Hover Me
            </button>
          </div>
        }
        good={
          <div className="flex justify-center p-8">
            <button className="px-6 py-2 bg-neutral-100 hover:bg-neutral-800 text-neutral-700 hover:text-white font-medium rounded-lg transition-all duration-150">
              Hover Me
            </button>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Animate elements entering or leaving"
        why="When elements simply pop into existence (like modals, dropdowns, or notifications), it surprises the user. Motion helps explain where the element came from."
        doText="Add subtle fade-in and slide-up effects to modals, dropdowns, and tooltips. Use libraries like Framer Motion or simple CSS animations."
        dontText="Do not bounce, spin, or violently slide elements in from completely off-screen unless it's a specific stylistic choice."
        check="Does this modal just appear, or does it fade in smoothly?"
      />
    </div>
  );
}
