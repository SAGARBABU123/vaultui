
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";

export function Borders({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Borders & Polish
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Polish comes after hierarchy. Don't use decoration to compensate for bad structure.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Use fewer borders"
        why="While borders are a great way to distinguish two elements, using too many of them makes a design feel busy, boxed-in, and cluttered."
        doText="Create separation using spacing, background colors, or subtle box-shadows first."
        dontText="Do not put a border around every card, section, and input if it's not strictly necessary."
        check="If I remove this border, does the UI become unclear?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Alternatives to Borders"
        badLabel="Border Overload"
        goodLabel="Using Backgrounds & Spacing"
        bad={
          <div className="p-4 space-y-2 w-full max-w-sm mx-auto">
            <div className="border border-surface-300 p-3 rounded">
              <div className="text-sm font-medium">Item 1</div>
            </div>
            <div className="border border-surface-300 p-3 rounded bg-surface-50">
              <div className="text-sm font-medium">Item 2</div>
            </div>
            <div className="border border-surface-300 p-3 rounded">
              <div className="text-sm font-medium">Item 3</div>
            </div>
          </div>
        }
        good={
          <div className="p-4 w-full max-w-sm mx-auto bg-white border border-surface-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-3 border-b border-surface-100">
              <div className="text-sm font-medium">Item 1</div>
            </div>
            <div className="p-3 bg-surface-50 border-b border-surface-100">
              <div className="text-sm font-medium">Item 2 (Active)</div>
            </div>
            <div className="p-3">
              <div className="text-sm font-medium">Item 3</div>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Add color with accent borders"
        why="A design can feel plain even with good typography and spacing. You don't need beautiful illustrations to add flair."
        doText="Add a colorful 2px-4px accent border to the top or side of a card, an active navigation item, or an alert message."
        dontText="Do not overdo it. Accents should be accents."
        check="Does this plain card feel more premium if I add a top border in the brand color?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Accent Borders"
        badLabel="Plain Card"
        goodLabel="Accent Card"
        bad={
          <div className="w-64 p-6 bg-white border border-surface-200 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">Freelancer</h3>
            <div className="text-3xl font-display font-bold mb-4">$12</div>
            <p className="text-sm text-surface-500">Per month, billed annually.</p>
          </div>
        }
        good={
          <div className="w-64 p-6 bg-white border border-surface-200 rounded-lg shadow-sm border-t-4 border-t-brand-500">
            <h3 className="font-bold text-lg mb-2">Freelancer</h3>
            <div className="text-3xl font-display font-bold mb-4">$12</div>
            <p className="text-sm text-surface-500">Per month, billed annually.</p>
          </div>
        }
      />

    </div>
  );
}
