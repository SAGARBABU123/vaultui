
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";

export function Tooltips({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Tooltips
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Provide contextual hints that stand out instantly by using inverted contrast.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Invert tooltip contrast"
        why="If a tooltip is white with a light border on a white background, it gets lost among other UI elements. Tooltips are transient and need to be immediately identifiable."
        doText="Use a dark background (e.g., bg-surface-900) with white text. Keep padding tight (px-2 py-1) and text small (text-xs). Add a small directional arrow."
        dontText="Do not design tooltips that look identical to your standard cards or dropdowns."
        check="Does this tooltip instantly pop against the background?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Tooltip Contrast"
        badLabel="Blends In"
        goodLabel="High Contrast"
        bad={
          <div className="w-full max-w-sm mx-auto h-32 flex items-center justify-center bg-white border border-surface-200 rounded relative">
            <button className="px-4 py-2 border border-surface-300 rounded text-sm bg-surface-50">Hover me</button>
            {/* Bad tooltip */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white border border-surface-300 p-2 text-sm rounded shadow-sm">
              More info here
            </div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto h-32 flex items-center justify-center bg-white border border-surface-200 rounded shadow-inner relative">
            <button className="px-4 py-2 border border-surface-200 rounded-md text-sm font-medium hover:bg-surface-50 transition-colors">Hover me</button>
            {/* Good tooltip */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="bg-surface-900 text-white text-xs px-2.5 py-1 rounded shadow-md whitespace-nowrap font-medium">
                Additional information
              </div>
              {/* Tooltip arrow */}
              <div className="w-2 h-2 bg-surface-900 rotate-45 -mt-1"></div>
            </div>
          </div>
        }
      />
    </div>
  );
}
