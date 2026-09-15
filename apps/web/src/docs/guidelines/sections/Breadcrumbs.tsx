
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { ChevronRight, MoreHorizontal } from 'lucide-react';

export function Breadcrumbs({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Breadcrumbs
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Provide wayfinding without cluttering the screen.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Style separators and truncate long paths"
        why="Using raw text like 'Home > Settings > Profile' looks unfinished. Long paths will wrap on mobile and ruin the layout."
        doText="Use subtle icons (like Chevrons or Slashes) for separators. Mute the colors of previous steps, and use an ellipsis (...) to collapse middle steps on deep paths."
        dontText="Do not use unstyled text brackets (>) or allow breadcrumbs to span multiple lines."
        check="Is the current page highlighted while previous pages recede visually?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Breadcrumb Wayfinding"
        badLabel="Raw Text String"
        goodLabel="Styled & Truncated"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-200 rounded">
            <div className="text-sm font-medium">
              Home {'>'} Dashboard {'>'} Settings {'>'} Security {'>'} 2FA
            </div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-200 rounded-lg shadow-sm">
            <nav className="flex items-center space-x-1.5 text-sm">
              <a href="#" className="text-surface-500 hover:text-surface-900 transition-colors font-medium">Home</a>
              <ChevronRight className="w-4 h-4 text-surface-400" />
              <button className="w-6 h-6 flex items-center justify-center text-surface-500 hover:bg-surface-100 rounded transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <ChevronRight className="w-4 h-4 text-surface-400" />
              <a href="#" className="text-surface-500 hover:text-surface-900 transition-colors font-medium">Settings</a>
              <ChevronRight className="w-4 h-4 text-surface-400" />
              <span className="text-surface-900 font-medium">Security</span>
            </nav>
          </div>
        }
      />
    </div>
  );
}
