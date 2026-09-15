import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';
import { Home, Settings, User } from 'lucide-react';

export function Navigation({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Navigation & Active States
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Never force the user to guess what page they are on. Make active states unmistakable.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Highlight the active location"
        why="If the active state of a navigation item is just a slight font-weight change, users lose their bearing within the app. Active states need clear visual grounding."
        doText="Use a background tint (e.g., bg-primary-50) and a primary text color for the active item. Leave inactive items as un-tinted neutrals."
        dontText="Do not use 'font-bold' as the only indicator of an active page."
        check="If I glanced at this sidebar for half a second, would I know exactly which page I am on?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Sidebar Active States"
        badLabel="Ambiguous State"
        goodLabel="Clear Active State"
        bad={
          <div className="w-48 bg-white border border-neutral-200 p-4 rounded-lg space-y-3 mx-auto">
            <div className="flex items-center gap-3 text-neutral-900 font-bold">
              <Home className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-600">
              <User className="w-4 h-4" />
              <span className="text-sm">Profile</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-600">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </div>
          </div>
        }
        good={
          <div className="w-48 bg-white border border-neutral-200 p-2 rounded-lg space-y-1 mx-auto shadow-sm">
            <div className="flex items-center gap-3 text-primary-700 bg-primary-50 px-3 py-2 rounded-md font-medium">
              <Home className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-600 px-3 py-2 hover:bg-neutral-50 hover:text-neutral-900 rounded-md transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm">Profile</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-600 px-3 py-2 hover:bg-neutral-50 hover:text-neutral-900 rounded-md transition-colors">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </div>
          </div>
        }
      />
    </div>
  );
}
