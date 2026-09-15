
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { ChevronDown, Check } from 'lucide-react';

export function Dropdowns({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Dropdowns & Popovers
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Elevate your menus so they float above the interface, and give items breathing room.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Float above the canvas"
        why="Dropdown menus that lack a shadow or border blend right into the page content below them, creating a confusing, muddy interface."
        doText="Use a large drop shadow (shadow-lg), a subtle border (ring-1 ring-black/5), and a solid opaque background (bg-white)."
        dontText="Do not expand dropdowns inline by pushing the content below them down, unless it's a mobile accordion."
        check="Does the dropdown clearly sit on a higher Z-axis layer than the page content?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Dropdown Elevation & Padding"
        badLabel="Flat and Cramped"
        goodLabel="Elevated and Spacious"
        bad={
          <div className="w-full max-w-sm mx-auto h-48 bg-surface-50 p-4 border border-surface-200">
            <button className="border border-surface-300 px-3 py-1 bg-white text-sm flex items-center gap-2">
              Options <ChevronDown className="w-4 h-4" />
            </button>
            {/* Bad dropdown */}
            <div className="mt-1 bg-white border border-surface-300">
              <div className="text-sm bg-surface-200">Edit</div>
              <div className="text-sm">Duplicate</div>
              <div className="text-sm">Delete</div>
            </div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto h-48 bg-surface-50 p-4 border border-surface-200 rounded relative">
            <button className="border border-surface-300 px-3 py-1.5 bg-white rounded-md text-sm font-medium hover:bg-surface-50 transition-colors flex items-center gap-2 shadow-sm">
              Options <ChevronDown className="w-4 h-4 text-surface-400" />
            </button>
            {/* Good dropdown */}
            <div className="absolute top-14 left-4 w-48 bg-white rounded-lg shadow-lg border border-surface-100 py-1 z-10">
              <button className="w-full text-left px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center justify-between">
                Edit <Check className="w-4 h-4 text-brand-600" />
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-surface-700 hover:bg-surface-50">Duplicate</button>
              <div className="h-px bg-surface-100 my-1"></div>
              <button className="w-full text-left px-3 py-2 text-sm text-danger-600 hover:bg-danger-50">Delete</button>
            </div>
          </div>
        }
      />
    </div>
  );
}
