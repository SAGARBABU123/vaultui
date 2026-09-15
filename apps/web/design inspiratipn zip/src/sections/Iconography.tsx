import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';
import { Home, Settings, User, Bell, Mail } from 'lucide-react';

export function Iconography({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Iconography
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Icons should feel like they belong to the same family. Alignment is an optical illusion, not just a math equation.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Keep icon styles consistent"
        why="Mixing thick, thin, solid, and outline icons makes a UI look like a ransom note. It breaks trust and feels unprofessional."
        doText="Stick to a single icon library (like Lucide). Use a consistent stroke width (usually 2px) and style (all outline or all solid)."
        dontText="Do not randomly alternate between filled shapes and delicate outlines in a single navigation bar."
        check="If I lined all these icons up in a row, would they look like they were drawn by the same person?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Icon Consistency"
        badLabel="Mixed Weights & Styles"
        goodLabel="Consistent Family"
        bad={
          <div className="p-6 bg-white border border-neutral-200 rounded-lg shadow-sm flex items-center justify-around w-full max-w-sm mx-auto">
            {/* Simulating mixed styles by overriding stroke widths and fills */}
            <div className="flex flex-col items-center gap-2">
              <Home className="w-6 h-6" strokeWidth={3} />
              <span className="text-xs text-neutral-600">Home</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Settings className="w-6 h-6" strokeWidth={1} />
              <span className="text-xs text-neutral-600">Config</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <User className="w-6 h-6 fill-neutral-800" strokeWidth={0} />
              <span className="text-xs text-neutral-600">Profile</span>
            </div>
          </div>
        }
        good={
          <div className="p-6 bg-white border border-neutral-200 rounded-lg shadow-sm flex items-center justify-around w-full max-w-sm mx-auto">
            <div className="flex flex-col items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors">
              <Home className="w-6 h-6" strokeWidth={2} />
              <span className="text-xs font-medium">Home</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors">
              <Settings className="w-6 h-6" strokeWidth={2} />
              <span className="text-xs font-medium">Config</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors">
              <User className="w-6 h-6" strokeWidth={2} />
              <span className="text-xs font-medium">Profile</span>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Align icons optically with text"
        why="Because text has ascenders and descenders, centering an icon exactly to the mathematical center of a text line often makes the icon look like it's floating too high or dropping too low."
        doText="Use flex and items-center to align icons, and adjust margin slightly if needed. Ensure the icon size roughly matches the line-height (not just the font-size) of the text."
        dontText="Do not put a massive 32px icon directly next to a 14px paragraph."
        check="Does the center of the icon match the optical center of the lowercase letters?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Icon Sizing alongside Text"
        badLabel="Unmatched Size"
        goodLabel="Balanced Size & Alignment"
        bad={
          <div className="p-4 bg-white border border-neutral-200 rounded-lg w-full max-w-sm mx-auto flex items-start gap-2">
            <Bell className="w-12 h-12 text-primary-600 shrink-0" />
            <div>
              <div className="font-bold text-sm">Notifications enabled</div>
              <div className="text-xs text-neutral-500">You will receive an alert when a new message arrives.</div>
            </div>
          </div>
        }
        good={
          <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-sm w-full max-w-sm mx-auto flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              <Bell className="w-5 h-5 text-primary-600" strokeWidth={2} />
            </div>
            <div>
              <div className="font-bold text-sm text-neutral-900 mb-0.5">Notifications enabled</div>
              <div className="text-sm text-neutral-600 leading-relaxed">You will receive an alert when a new message arrives.</div>
            </div>
          </div>
        }
      />
    </div>
  );
}
