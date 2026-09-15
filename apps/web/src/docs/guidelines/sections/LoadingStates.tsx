
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { RefreshCw } from 'lucide-react';

export function LoadingStates({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Loading States & Skeletons
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Prevent layout shifts and avoid blinding the user with massive spinners.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Use localized loading, not full-screen blockers"
        why="Blanking out the entire screen with a giant spinner just because one button was clicked makes the app feel broken, slow, and jarring."
        doText="If a button triggers a network request, replace the button text or icon with a small spinner, and disable the button. Keep the rest of the UI intact."
        dontText="Do not hide the entire page layout while waiting for an API response."
        check="Am I hiding useful information just because one small request is loading?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Button Loading States"
        badLabel="Vague Page Loading"
        goodLabel="Localized Feedback"
        bad={
          <div className="w-full max-w-sm mx-auto h-32 border border-surface-200 rounded flex flex-col items-center justify-center bg-white space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-surface-400" />
            <div className="text-sm text-surface-500">Processing...</div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-6 border border-surface-200 rounded bg-white flex items-center justify-between">
            <div>
              <div className="font-bold text-surface-900">Pro Plan</div>
              <div className="text-sm text-surface-500">$20 / month</div>
            </div>
            <button className="px-4 py-2 bg-brand-600/80 text-white rounded font-medium text-sm flex items-center gap-2 cursor-wait">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Upgrading...
            </button>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Skeleton loaders prevent layout shift"
        why="When content loads instantly from a blank screen, it aggressively pushes surrounding UI down the page. This is jarring and causes misclicks."
        doText="Use 'Skeleton' elements (grey, pulsing rectangles that mimic the shape of the incoming content) to reserve space on the canvas."
        dontText="Do not let text suddenly appear and shove the footer 800 pixels down."
        check="Does the page maintain its structure even before the data arrives?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Content Loading"
        badLabel="Text Spinner (Layout Shift)"
        goodLabel="Skeleton Loader (Stable Layout)"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 border border-surface-200 rounded bg-white">
            <div className="text-sm text-surface-500">Loading profile data...</div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4 border border-surface-200 rounded bg-white flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-surface-200 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              <div className="h-3 bg-surface-100 rounded w-3/4"></div>
            </div>
          </div>
        }
      />
    </div>
  );
}
