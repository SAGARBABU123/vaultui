
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";

export function DarkMode({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Dark Mode Architecture
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Dark mode isn't just an inverted color palette. It requires a completely different approach to elevation and saturation.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Communicate elevation with lightness, not shadows"
        why="In light mode, we use drop shadows to indicate an element is raised. In dark mode, shadows are invisible against dark backgrounds. Elements higher up on the z-axis should simply be lighter in color to simulate being closer to a light source."
        doText="Use a base dark color (e.g. surface-950) for the background, and progressively lighter greys (surface-900, surface-800) for cards, dropdowns, and modals."
        dontText="Do not use heavy black box-shadows to separate dark grey cards from a dark grey background."
        check="Are elevated components lighter in color than the background beneath them?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Elevation in Dark Mode"
        badLabel="Using Shadows (Invisible)"
        goodLabel="Using Lightness"
        bad={
          <div className="p-8 bg-surface-900 w-full flex items-center justify-center rounded">
            {/* The shadow here is effectively useless against the dark background */}
            <div className="w-full max-w-[200px] p-4 bg-surface-900 shadow-[0_10px_20px_rgba(0,0,0,0.8)] border border-surface-800 rounded">
              <div className="h-4 w-24 bg-surface-700 rounded mb-2"></div>
              <div className="h-3 w-32 bg-surface-800 rounded"></div>
            </div>
          </div>
        }
        good={
          <div className="p-8 bg-surface-950 w-full flex items-center justify-center rounded">
            {/* Elevation achieved by a lighter surface color */}
            <div className="w-full max-w-[200px] p-4 bg-surface-800 border border-surface-700/50 rounded shadow-lg">
              <div className="h-4 w-24 bg-surface-300 rounded mb-2"></div>
              <div className="h-3 w-32 bg-surface-500 rounded"></div>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Desaturate accent colors"
        why="Fully saturated, bright colors (like a vivid primary blue or warning red) that look great on white will visually vibrate and cause eye strain against dark backgrounds."
        doText="Use desaturated, pastel-like versions of your primary and semantic colors for dark mode text and borders."
        dontText="Do not use your vibrant light-mode brand colors directly on dark mode surfaces."
        check="Does this colored text hurt my eyes to look at against the dark background?"
      />
    </div>
  );
}
