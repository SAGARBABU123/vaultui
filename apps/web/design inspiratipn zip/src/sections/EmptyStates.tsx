import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';
import { FileQuestion, FolderOpen } from 'lucide-react';

export function EmptyStates({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Empty States
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          The empty state is often a user's first interaction with your product. Design it like it matters.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Don't overlook empty states"
        why="You spend hours crafting realistic sample data, but when an excited user logs in, they see a blank screen with a tiny string that says 'Nothing here.' This kills the excitement and fails to guide them."
        doText="Incorporate an image or illustration to grab attention, explain what the feature does, and emphasize the call-to-action to take the next step."
        dontText="Do not output '0 items found' as the entire UI."
        check="If a user sees this screen, do they immediately know what they should do next to fill it?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="First Impressions"
        badLabel="An Afterthought"
        goodLabel="A Guided Experience"
        bad={
          <div className="w-full h-48 border border-neutral-200 rounded flex items-center justify-center bg-white">
            <span className="text-sm text-neutral-500">No contacts found.</span>
          </div>
        }
        good={
          <div className="w-full h-full border border-neutral-200 rounded flex flex-col items-center justify-center bg-white p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-1">No contacts yet</h4>
            <p className="text-sm text-neutral-500 mb-6 max-w-xs">
              Add your first contact to start messaging and sharing files.
            </p>
            <button className="px-4 py-2 bg-primary-600 text-white font-medium text-sm rounded-md shadow-sm">
              + Add Contact
            </button>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Hide irrelevant UI"
        why="There is no point in presenting a bunch of tabs, search bars, and filter dropdowns that don't do anything because there is no content."
        doText="Hide tabs, filters, and complex actions until there is actual content to act upon. Center the empty state in the main canvas."
        dontText="Do not show a search bar that says 'Search 0 contacts'."
        check="Are there controls on this screen that are currently useless?"
      />

    </div>
  );
}
