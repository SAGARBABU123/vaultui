
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";

export function CardsAnatomy({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Cards Anatomy
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          A card is more than just a box with a border. Give it internal structure.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Define Header, Body, and Footer"
        why="When everything is thrown into a single padding container, the content lacks structure. Actions blend into descriptions, and titles blend into bodies."
        doText="Use subtle borders (border-b) to separate the Header. Use an off-white background (bg-surface-50) for the Footer to separate actions from content. Use overflow-hidden to let header images bleed to the edge."
        dontText="Do not put 'Cancel' and 'Save' buttons floating randomly next to body text."
        check="Are the primary actions visually separated from the content description?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Card Structure"
        badLabel="Unstructured Box"
        goodLabel="Structured Sections"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 border border-surface-300 bg-white">
            <h3 className="font-bold text-lg">Project Settings</h3>
            <p className="text-sm mt-2 mb-4">Update your repository settings and privacy rules here.</p>
            <button className="bg-surface-200 px-3 py-1 text-sm rounded mr-2">Cancel</button>
            <button className="bg-blue-500 text-white px-3 py-1 text-sm rounded">Save</button>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto bg-white border border-surface-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-surface-100">
              <h3 className="font-bold text-surface-900">Project Settings</h3>
              <p className="text-sm text-surface-500 mt-0.5">Manage repository privacy and access.</p>
            </div>
            <div className="p-5 flex-1 bg-white">
              {/* Simulated form content */}
              <div className="h-8 bg-surface-100 rounded w-full border border-surface-200"></div>
            </div>
            <div className="px-5 py-3 bg-surface-50 border-t border-surface-100 flex justify-end gap-3">
              <button className="px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-200 rounded-lg transition-colors">Cancel</button>
              <button className="px-4 py-2 text-sm font-medium bg-surface-900 hover:bg-surface-800 text-white rounded-lg transition-colors">Save Changes</button>
            </div>
          </div>
        }
      />
    </div>
  );
}
