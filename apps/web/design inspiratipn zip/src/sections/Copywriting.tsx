import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';

export function Copywriting({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Copywriting & Text Wrap
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          AI slop isn't just visual. It's written. Ban generic verbs and fix your word wrapping.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Ban generic SaaS verbs"
        why="Words like 'supercharge', 'empower', 'unleash', and 'synergy' immediately signal low-effort, AI-generated placeholder text. It damages the credibility of the design."
        doText="Write clear, functional, direct copy. State exactly what the feature does in plain English."
        dontText="Do not use marketing hype verbs or flowery adjectives for internal product UI."
        check="Does this copy sound like a human explaining a feature, or a bot writing a billboard?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Functional Copy vs AI Slop"
        badLabel="AI Hype Text"
        goodLabel="Direct & Functional"
        bad={
          <div className="p-6 bg-white border border-neutral-200 rounded-lg text-center w-full max-w-sm mx-auto">
            <h3 className="font-bold text-lg mb-2">Supercharge Your Workflow!</h3>
            <p className="text-sm text-neutral-500 mb-4">
              Empower your team to unleash their true potential with our next-generation synergy tools.
            </p>
            <button className="bg-primary-600 text-white px-4 py-2 rounded text-sm w-full">Revolutionize Now</button>
          </div>
        }
        good={
          <div className="p-6 bg-white border border-neutral-200 rounded-lg shadow-sm text-left w-full max-w-sm mx-auto">
            <h3 className="font-bold text-neutral-900 mb-2">Automate Daily Tasks</h3>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              Set up rules to handle repetitive data entry and email follow-ups automatically.
            </p>
            <button className="bg-neutral-900 text-white px-4 py-2 rounded-md font-medium text-sm w-full hover:bg-neutral-800 transition-colors">
              Create Automation
            </button>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Labels sit on one line"
        why="When text inside a button, pill, or badge wraps onto a second line, it breaks the component's internal padding and looks like a massive defect."
        doText="Use whitespace-nowrap on badges, pills, and buttons. If the text is too long for the container, either shorten the copy or let the container grow."
        dontText="Do not let a single button's label wrap across two lines."
        check="If the user translates this interface to a longer language, will the button text awkwardly wrap?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Button Text Wrapping"
        badLabel="Wrapping Text"
        goodLabel="No-Wrap / Scaled Padding"
        bad={
          <div className="p-8 w-48 mx-auto flex items-center justify-center border border-dashed border-red-300 bg-red-50">
            <button className="bg-primary-600 text-white px-4 py-2 rounded text-sm leading-tight">
              Acknowledge and Continue
            </button>
          </div>
        }
        good={
          <div className="p-8 w-48 mx-auto flex items-center justify-center border border-dashed border-emerald-300 bg-emerald-50">
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap">
              Accept & Continue
            </button>
          </div>
        }
      />
    </div>
  );
}
