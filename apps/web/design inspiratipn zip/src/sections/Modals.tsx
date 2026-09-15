import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';
import { X } from 'lucide-react';

export function Modals({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Modals, Dialogs, & Overlays
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Modals are meant to capture focus. Don't let them bleed into the background.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Anatomy of a perfect modal"
        why="A modal that stretches across the screen or lacks a dark backdrop fails to isolate the user's attention. If there is no clear cancellation path, the user feels trapped."
        doText="Always include: 1. A darkened/blurred backdrop. 2. A max-width constraint (e.g., max-w-md). 3. A large drop shadow. 4. A clear 'Cancel' button or 'X' icon."
        dontText="Do not render a white box over a white background with no borders or shadows."
        check="Is it instantly obvious what sits on the modal layer versus what sits on the background layer?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Modal Contrast & Structure"
        badLabel="Unconstrained, No Backdrop"
        goodLabel="Constrained, Clear Backdrop"
        bad={
          <div className="w-full h-64 border border-neutral-200 rounded bg-white flex flex-col p-6 relative">
            {/* Bad modal just floating in the space without a backdrop or constraint */}
            <div className="w-full bg-white border border-neutral-300 p-4">
              <h3 className="font-bold mb-2">Delete Account</h3>
              <p className="text-sm text-neutral-600 mb-4">Are you sure you want to delete your account?</p>
              <button className="bg-red-500 text-white px-4 py-2 rounded text-sm w-full">Delete</button>
            </div>
            {/* Fake background content blending in */}
            <div className="mt-8 text-neutral-300 text-sm">Background page content here...</div>
          </div>
        }
        good={
          <div className="w-full h-64 border border-neutral-200 rounded flex flex-col items-center justify-center relative overflow-hidden">
            {/* Fake background content */}
            <div className="absolute inset-0 p-4 text-neutral-400 text-sm bg-neutral-50">Background page content here...</div>
            
            {/* Backdrop */}
            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm z-10"></div>
            
            {/* Modal */}
            <div className="relative z-20 w-[90%] max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-neutral-100 flex justify-between items-center">
                <h3 className="font-bold text-neutral-900">Delete Account</h3>
                <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <p className="text-sm text-neutral-600">Are you sure you want to delete your account? This action cannot be undone.</p>
              </div>
              <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
                <button className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors">Cancel</button>
                <button className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
