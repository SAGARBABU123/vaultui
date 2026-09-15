
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";

export function ComponentStates({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Component States
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          The "happy path" is only one part of a component. Don't forget how it feels when interacted with.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Design every interactive state"
        why="A UI feels broken or unresponsive if buttons and inputs don't react to the user. A missing focus state makes an app completely inaccessible to keyboard users."
        doText="Explicitly define styling for Default, Hover, Focus-Visible, Active (pressed), Disabled, and Loading states."
        dontText="Do not rely on browser default focus rings if they clash, and never remove outline: none without replacing it with a custom focus ring."
        check="If I tab through this interface with my keyboard, can I clearly see where I am?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Button State Matrix"
        badLabel="Incomplete States"
        goodLabel="Comprehensive States"
        bad={
          <div className="p-6 flex flex-col gap-4">
            <button className="px-4 py-2 bg-brand-600 text-white rounded font-medium text-sm w-32">Default</button>
            <button className="px-4 py-2 bg-brand-600 text-white rounded font-medium text-sm w-32 outline-none">Hover (None)</button>
            <button className="px-4 py-2 bg-brand-600 text-white rounded font-medium text-sm w-32 opacity-50 cursor-not-allowed">Disabled</button>
          </div>
        }
        good={
          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-surface-500 font-medium uppercase tracking-wider">Default</span>
              <button className="block px-4 py-2 bg-brand-600 text-white rounded-md font-medium text-sm w-full transition-colors">Submit</button>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-surface-500 font-medium uppercase tracking-wider">Hover</span>
              <button className="block px-4 py-2 bg-brand-700 text-white rounded-md font-medium text-sm w-full transition-colors">Submit</button>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-surface-500 font-medium uppercase tracking-wider">Focus</span>
              <button className="block px-4 py-2 bg-brand-600 text-white rounded-md font-medium text-sm w-full ring-2 ring-brand-500 ring-offset-2 outline-none">Submit</button>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-surface-500 font-medium uppercase tracking-wider">Disabled</span>
              <button className="block px-4 py-2 bg-surface-100 text-surface-400 rounded-md font-medium text-sm w-full cursor-not-allowed border border-surface-200">Submit</button>
            </div>
          </div>
        }
      />
    </div>
  );
}
