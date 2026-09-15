import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';

export function OtpInputs({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          OTP / PIN Inputs
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Security codes should feel tactile, not like a generic text field.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Split security codes into individual character boxes"
        why="A single text input for a 6-digit code makes it hard for users to track how many characters they've typed. It feels unpolished."
        doText="Render an individual, perfectly square input box for each digit. Group them visually (e.g., 3 and 3) if the code is long. Use strong focus rings."
        dontText="Do not use a standard full-width input with placeholder='123456'."
        check="Does it feel like a security keypad rather than a comment box?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="OTP Input Design"
        badLabel="Standard Text Input"
        goodLabel="Segmented Boxes"
        bad={
          <div className="w-full max-w-sm mx-auto p-6 bg-white border border-neutral-200 rounded space-y-2">
            <label className="text-sm font-medium">Enter 6-digit code</label>
            <input type="text" placeholder="123456" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-6 bg-white border border-neutral-200 rounded-lg shadow-sm space-y-3 flex flex-col items-center">
            <label className="text-sm font-medium text-neutral-900">Enter your security code</label>
            <div className="flex items-center gap-2">
              {/* Box 1-3 */}
              <div className="flex gap-2">
                <div className="w-10 h-12 rounded-md border border-neutral-300 flex items-center justify-center text-lg font-bold">4</div>
                <div className="w-10 h-12 rounded-md border-2 border-primary-500 ring-4 ring-primary-500/20 flex items-center justify-center text-lg font-bold"></div>
                <div className="w-10 h-12 rounded-md border border-neutral-300 flex items-center justify-center text-lg font-bold text-neutral-300"></div>
              </div>
              <div className="w-2 h-[2px] bg-neutral-300 mx-1"></div>
              {/* Box 4-6 */}
              <div className="flex gap-2">
                <div className="w-10 h-12 rounded-md border border-neutral-300 flex items-center justify-center text-lg font-bold text-neutral-300"></div>
                <div className="w-10 h-12 rounded-md border border-neutral-300 flex items-center justify-center text-lg font-bold text-neutral-300"></div>
                <div className="w-10 h-12 rounded-md border border-neutral-300 flex items-center justify-center text-lg font-bold text-neutral-300"></div>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-2">Check your authenticator app</p>
          </div>
        }
      />
    </div>
  );
}
