import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';
import { AlertCircle } from 'lucide-react';

export function FormValidation({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Form Validation & Errors
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Don't just dump unstyled error text on the screen. Guide the user to the fix.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Highlight the problematic field"
        why="When a form fails to submit, writing 'Invalid email' at the bottom of the page forces the user to hunt for the mistake. The error must be contextual to the exact input."
        doText="Outline the failing input in a red/warning color, add an icon for colorblind users, and place the error message directly below the field."
        dontText="Do not use raw, unstyled red text floating in empty space."
        check="If I couldn't read the red text, would I still know which field is broken?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Input Error States"
        badLabel="Unstyled Raw Text"
        goodLabel="Contextual & Styled"
        bad={
          <div className="w-full max-w-sm mx-auto p-4">
            <div className="space-y-1 mb-2">
              <label className="text-sm font-medium text-neutral-900">Email Address</label>
              <input type="text" value="user@example" readOnly className="w-full h-10 border border-neutral-300 rounded px-3 bg-white" />
            </div>
            <div className="text-red-500 text-sm">Invalid email format</div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-900">Email Address</label>
              <div className="relative">
                <input type="text" value="user@example" readOnly className="w-full h-10 border-2 border-red-500 rounded px-3 bg-white text-red-900 focus:outline-none" />
                <div className="absolute right-3 top-2.5 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-red-600 font-medium pt-1">Please enter a valid email address.</p>
            </div>
          </div>
        }
      />
    </div>
  );
}
