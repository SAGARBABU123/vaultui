
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { Info } from 'lucide-react';

export function FeedbackIndicators({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Feedback & Inline Alerts
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Provide contextual information directly within the layout without hijacking the entire screen.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Round and animate Progress Bars"
        why="A square, static block of color looks like an accidental layout div, not a progress indicator. It must feel fluid."
        doText="Round the edges of both the track background (bg-surface-100) and the fill bar (bg-brand-600). Add a transition to the width property so it animates smoothly."
        dontText="Do not use completely sharp corners for thin progress bars, and do not let them jump instantaneously without a CSS transition."
        check="Does the bar feel like it is smoothly filling up?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Progress Bars"
        badLabel="Static & Sharp"
        goodLabel="Rounded & Fluid"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-200 rounded space-y-2">
            <div className="text-sm font-medium">Uploading (45%)</div>
            <div className="w-full h-2 bg-surface-200">
              <div className="h-full bg-blue-500 w-[45%]"></div>
            </div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-200 rounded-lg shadow-sm space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-surface-900">Uploading assets...</span>
              <span className="text-surface-500 font-medium tabular-nums">45%</span>
            </div>
            <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full w-[45%] transition-all duration-500 ease-out"></div>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Use Inline Banners for persistent page context"
        why="Floating toasts disappear automatically. But if an account is expired, the user needs a permanent, contextual warning anchored into the page layout."
        doText="Use soft tinted backgrounds with darker text and a semantic icon. Place inline banners at the top of a page or directly above the related content section."
        dontText="Do not use a floating auto-dismissing toast for critical, persistent account states."
        check="If the user refreshes the page, will they still immediately know their account needs attention?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Inline Banners"
        badLabel="Harsh & Overwhelming"
        goodLabel="Soft & Contextual"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 bg-danger-600 text-white font-bold text-center border-4 border-danger-800">
            WARNING: YOUR SUBSCRIPTION HAS EXPIRED. PLEASE RENEW IMMEDIATELY.
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4 bg-warning-50 border border-warning-200 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-warning-900">Subscription expiring soon</h4>
              <p className="text-sm text-warning-700 mt-1">Your trial ends in 3 days. Upgrade to Pro to keep access to all features.</p>
              <button className="mt-3 px-3 py-1.5 bg-warning-100 text-warning-800 hover:bg-warning-200 rounded-md text-xs font-bold transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}
