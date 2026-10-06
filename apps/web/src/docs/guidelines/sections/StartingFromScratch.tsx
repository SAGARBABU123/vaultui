
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { Card } from "../ui/Card";

export function StartingFromScratch({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Starting from Scratch
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          How to begin a UI design intentionally without getting stuck in the weeds.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Start with a feature, not a layout"
        why="Designing the application shell (navbar, sidebar, container) before the features leads to frustration. The shell exists to support features. If you don't know what the features are, you can't design a good shell."
        doText="Identify the user goal, required information, and required actions. Design the smallest useful version of the feature first. Let the application shell emerge."
        dontText="Do not start by deciding where the logo goes or if the nav should be on the left or top."
        check="Am I designing functionality, or am I just drawing boxes on a screen?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Don't design the shell first"
        badLabel="Designing the shell"
        goodLabel="Designing the feature"
        bad={
          <div className="border border-surface-300 rounded bg-white w-full h-48 flex flex-col opacity-50">
            <div className="h-8 border-b border-surface-300 flex items-center px-4"><div className="w-16 h-2 bg-surface-200 rounded"></div></div>
            <div className="flex-1 flex">
              <div className="w-16 border-r border-surface-300 p-2 space-y-2">
                <div className="h-2 bg-surface-200 rounded"></div>
                <div className="h-2 bg-surface-200 rounded"></div>
                <div className="h-2 bg-surface-200 rounded"></div>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-2">
                <div className="h-4 w-32 bg-surface-200 rounded"></div>
                <div className="h-2 w-full bg-surface-200 rounded mt-4"></div>
                <div className="h-2 w-full bg-surface-200 rounded"></div>
              </div>
            </div>
          </div>
        }
        good={
          <Card className="w-full">
            <div className="p-4 border-b border-surface-100">
              <h5 className="font-semibold text-surface-900">Find the best flight</h5>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="h-8 bg-surface-100 rounded border border-surface-200"></div>
                <div className="h-8 bg-surface-100 rounded border border-surface-200"></div>
              </div>
              <div className="h-8 bg-brand-600 rounded text-white flex items-center justify-center text-xs font-medium">Search Flights</div>
            </div>
          </Card>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Limit your choices"
        why="Designing without constraints is torture because there's always more than one right choice. Having millions of colors and thousands of fonts creates decision fatigue and inconsistencies."
        doText="Define a constrained system of typography, spacing, colors, and radii up front. Pick from your system instead of the color picker."
        dontText="Do not use arbitrary values like 13px, 15px, 17px, or 35 slightly different shades of blue."
        check="Am I pulling this value from a predefined system, or did I just make it up?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Constrained Systems"
        badLabel="Arbitrary Selection"
        goodLabel="Systematic Selection"
        bad={
          <div className="space-y-4">
            <div className="flex gap-2 items-center"><div className="w-4 h-4 bg-[#3381B8] rounded"></div><span className="text-xs text-surface-500">#3381B8</span></div>
            <div className="flex gap-2 items-center"><div className="w-4 h-4 bg-[#2F7DB3] rounded"></div><span className="text-xs text-surface-500">#2F7DB3</span></div>
            <div className="flex gap-2 items-center"><div className="w-4 h-4 bg-[#2D78AD] rounded"></div><span className="text-xs text-surface-500">#2D78AD</span></div>
          </div>
        }
        good={
          <div className="flex gap-1">
            {[100, 300, 500, 700, 900].map((weight) => (
              <div key={weight} className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: "var(--color-brand-" + weight + ")" }}></div>
                <span className="text-xs text-surface-400">{weight}</span>
              </div>
            ))}
          </div>
        }
      />

    </div>
  );
}
