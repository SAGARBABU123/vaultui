import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';
import { User } from 'lucide-react';

export function Avatars({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Avatars & Profile Stacks
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Make profile pictures consistent and gracefully handle overlapping lists of users.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Stack avatars with negative margin and borders"
        why="When showing a list of participants or a team, laying out avatars side-by-side with gaps wastes space. But overlapping them without borders makes them blend into an illegible blob."
        doText="Use negative margin (e.g., -ml-2) to overlap avatars, and apply a thick white border (ring-2 ring-white) to cut out the avatar underneath, creating depth."
        dontText="Do not overlap avatars of the same color without a stroke/border separating them."
        check="Can you clearly see the circular boundary of every avatar in the stack?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Avatar Stacks"
        badLabel="Stacked (No Borders)"
        goodLabel="Stacked (White Stroke)"
        bad={
          <div className="w-full max-w-sm mx-auto p-8 bg-white border border-neutral-200 flex items-center justify-center">
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-neutral-400 flex items-center justify-center text-white font-bold">A</div>
              <div className="w-10 h-10 rounded-full bg-neutral-500 flex items-center justify-center text-white font-bold -ml-2">B</div>
              <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center text-white font-bold -ml-2">C</div>
            </div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-8 bg-white border border-neutral-200 rounded-lg shadow-sm flex items-center justify-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 ring-2 ring-white flex items-center justify-center font-bold text-sm z-10">AK</div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 ring-2 ring-white flex items-center justify-center font-bold text-sm -ml-3 z-20">MJ</div>
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 ring-2 ring-white flex items-center justify-center font-bold text-sm -ml-3 z-30">
                <User className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 ring-2 ring-white flex items-center justify-center font-medium text-xs -ml-3 z-40">+4</div>
            </div>
          </div>
        }
      />
    </div>
  );
}
