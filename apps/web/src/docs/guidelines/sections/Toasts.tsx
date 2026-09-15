
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { CheckCircle2, X } from 'lucide-react';

export function Toasts({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Toasts & Notifications
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Snackbars and toasts should inform the user without blocking their workflow.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Float notifications elegantly"
        why="Notifications that appear inline push page content down (layout shift). Notifications that are giant and centered block the user from continuing their work."
        doText="Use absolute or fixed positioning (bottom-right or top-center). Keep them compact, use icons to convey semantic meaning (success/error), and always provide a close button."
        dontText="Do not use a full-width red banner stretching across the entire screen for a simple save confirmation."
        check="Can the user ignore this notification and keep working without it getting in their way?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Toast Anatomy"
        badLabel="Inline & Blocking"
        goodLabel="Floating & Actionable"
        bad={
          <div className="w-full max-w-md mx-auto h-48 bg-white border border-surface-200 p-4">
            {/* Bad inline toast pushing content */}
            <div className="w-full bg-success-500 text-white p-2 text-center text-sm font-bold mb-4">
              SUCCESS: Profile Saved!
            </div>
            <div className="text-sm text-surface-500">Rest of the page content here...</div>
          </div>
        }
        good={
          <div className="w-full max-w-md mx-auto h-48 bg-surface-50 border border-surface-200 rounded relative overflow-hidden flex flex-col justify-end p-4">
            <div className="text-sm text-surface-400 absolute top-4 left-4">Rest of the page content...</div>
            
            {/* Good floating toast */}
            <div className="w-full max-w-sm ml-auto bg-white rounded-lg shadow-lg shadow-surface-200/50 border border-surface-100 p-3 flex items-start gap-3 transform transition-all translate-y-0">
              <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-surface-900">Profile saved</h4>
                <p className="text-xs text-surface-500 mt-0.5">Your changes have been published.</p>
              </div>
              <button className="text-surface-400 hover:text-surface-600 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}
