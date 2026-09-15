
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { CalendarDays } from 'lucide-react';

export function HoverCards({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Hover Cards
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Rich previews require structure. Don't shove them into plain tooltips.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Separate Tooltips from Hover Cards"
        why="Tooltips (black background, white text) are strictly for transient UI hints. If you try to put avatars, paragraphs, and icons inside a standard tooltip, it becomes unreadable."
        doText="For rich previews (like a user profile preview on hover), use a Hover Card. This is a white card with a drop shadow, borders, and a proper layout hierarchy."
        dontText="Do not use inverted contrast (dark background) for rich, multi-line content previews."
        check="Does the hover state look like a miniature card rather than a simple label?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Profile Preview (Hover)"
        badLabel="Overloaded Tooltip"
        goodLabel="Structured Hover Card"
        bad={
          <div className="w-full h-48 bg-white border border-surface-200 flex flex-col items-center pt-8 relative">
            <span className="text-sm font-medium text-blue-600 underline">@alexdesign</span>
            {/* Bad tooltip style for rich content */}
            <div className="absolute top-14 bg-surface-900 text-white p-3 rounded text-xs w-48 shadow-lg text-center">
              <div className="w-8 h-8 bg-surface-500 rounded-full mx-auto mb-2"></div>
              <div className="font-bold">Alex Johnson</div>
              <div>Product Designer</div>
              <div className="mt-2 text-surface-400">Joined Dec 2021</div>
            </div>
          </div>
        }
        good={
          <div className="w-full h-48 bg-surface-50 border border-surface-200 rounded flex flex-col items-center pt-8 relative">
            <span className="text-sm font-semibold text-surface-900 hover:underline cursor-pointer">@alexdesign</span>
            {/* Good hover card */}
            <div className="absolute top-14 bg-white border border-surface-200 rounded-lg shadow-xl w-64 p-4 z-10 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">AJ</div>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-bold text-surface-900">Alex Johnson</h4>
                <p className="text-xs text-surface-500 mt-1">Lead Product Designer focused on accessibility and design systems.</p>
                <div className="flex items-center text-xs text-surface-400 mt-3 pt-3 border-t border-surface-100">
                  <CalendarDays className="w-3.5 h-3.5 mr-1" />
                  Joined December 2021
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
