
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";

export function InputsControls({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Checkboxes, Radios & Switches
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Fix the alignment of your selection controls and ditch the ugly browser defaults.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Top-align controls with multi-line labels"
        why="When a checkbox is vertically centered alongside a paragraph of text, it floats awkwardly in the middle. The user's eye naturally scans the first line of text, so the control should sit exactly next to that first line."
        doText="Use flex, items-start, and a slight top margin on the control to align it perfectly with the cap-height of the first line of text."
        dontText="Do not use items-center if the label can wrap to two or more lines."
        check="Does the checkbox align with the first line of the description?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Checkbox Alignment"
        badLabel="Center Aligned (Floating)"
        goodLabel="Top Aligned (Anchored)"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-200 rounded">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">
                <strong>Subscribe to Newsletter</strong><br/>
                <span className="text-surface-500">Get weekly updates on our latest features and product releases.</span>
              </span>
            </label>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-200 rounded shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 rounded border border-brand-600 bg-brand-600 shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-surface-900 group-hover:text-brand-700 transition-colors">Subscribe to Newsletter</span>
                <span className="text-sm text-surface-500 leading-relaxed">Get weekly updates on our latest features and product releases.</span>
              </div>
            </label>
          </div>
        }
      />
    </div>
  );
}
