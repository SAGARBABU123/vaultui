
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";

export function Responsive({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Responsive Adaptations
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Don't just shrink complex components—transform them.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Transform, don't just shrink"
        why="A data-dense table or a complex horizontal navigation bar simply cannot fit on a mobile screen. Shrinking the text to 10px or adding an ugly horizontal scrollbar ruins usability."
        doText="Change the structural paradigm. Convert data tables into stacked cards on mobile. Convert horizontal sidebars into hidden drawers or bottom sheets."
        dontText="Do not allow components to overflow the screen width horizontally unless explicitly designed as a swipeable carousel."
        check="Does this component require horizontal scrolling to view primary information on mobile?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Responsive Data Tables"
        badLabel="Shrunk / Scrolling Table"
        goodLabel="Transformed to Cards"
        bad={
          <div className="p-4 w-64 mx-auto border-x border-dashed border-danger-300 bg-white relative overflow-hidden">
            <div className="text-xs text-danger-500 absolute top-0 right-0 bg-danger-100 px-1 rounded-bl">Mobile View</div>
            <div className="w-full overflow-x-auto pb-2">
              <div className="w-96 flex border-b border-surface-200 pb-2 mb-2 text-[10px] font-bold text-surface-500">
                <div className="w-24">Customer</div>
                <div className="w-24">Plan</div>
                <div className="w-24">Status</div>
                <div className="w-24">Amount</div>
              </div>
              <div className="w-96 flex text-[10px]">
                <div className="w-24 font-medium">Acme Corp</div>
                <div className="w-24">Enterprise</div>
                <div className="w-24 text-success-600">Active</div>
                <div className="w-24">$4,000</div>
              </div>
            </div>
          </div>
        }
        good={
          <div className="p-4 w-64 mx-auto border-x border-dashed border-success-300 bg-surface-50 relative">
            <div className="text-xs text-success-600 absolute top-0 right-0 bg-success-100 px-1 rounded-bl">Mobile View</div>
            <div className="bg-white border border-surface-200 p-3 rounded-lg shadow-sm w-full mt-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-sm text-surface-900">Acme Corp</div>
                  <div className="text-xs text-surface-500">Enterprise Plan</div>
                </div>
                <span className="bg-success-100 text-success-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Active</span>
              </div>
              <div className="text-sm font-medium text-surface-900 mt-2">$4,000</div>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Respect touch targets"
        why="Fingers are much less precise than mouse cursors. Small icons or text links stacked closely together will cause frustrating misclicks on mobile."
        doText="Ensure any interactive element (buttons, links, icon buttons, dropdown options) has a minimum tap area of 44x44px on mobile devices."
        dontText="Do not pack tiny pagination links or icon buttons closely together."
        check="If I try to tap this with my thumb, will I accidentally hit the button next to it?"
      />
    </div>
  );
}
