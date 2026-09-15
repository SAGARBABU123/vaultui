
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { Card } from "../ui/Card";

export function Hierarchy({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Hierarchy is Everything
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Not everything deserves equal visual attention. Establish what matters most.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Size isn't everything"
        why="Relying solely on font size to control hierarchy leads to primary content that's awkwardly large and secondary content that's unreadably small."
        doText="Use font weight and color (contrast) to establish hierarchy while keeping sizes reasonable."
        dontText="Do not try to solve every hierarchy problem by just making the text larger."
        check="Can I reduce the size of this heading but increase its weight to achieve the same emphasis?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Balancing Size, Weight, and Contrast"
        badLabel="Size-only Hierarchy"
        goodLabel="Weight & Contrast Hierarchy"
        bad={
          <div className="space-y-2 p-4">
            <div className="text-2xl font-normal text-black">Amsterdam Tour</div>
            <div className="text-sm font-normal text-black">Explore popular tourist destinations and hidden gems.</div>
            <div className="text-lg font-normal text-black mt-4">$17 per person</div>
          </div>
        }
        good={
          <div className="space-y-2 p-4">
            <div className="text-lg font-bold text-surface-900">Amsterdam Tour</div>
            <div className="text-sm font-normal text-surface-500">Explore popular tourist destinations and hidden gems.</div>
            <div className="text-base font-semibold text-surface-900 mt-4">$17 <span className="font-normal text-sm text-surface-500">per person</span></div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Emphasize by de-emphasizing"
        why="When a primary element isn't standing out, making it louder often creates visual noise. The problem is usually that secondary elements are competing with it."
        doText="Reduce the visual weight (contrast, color, size) of the elements around the primary element."
        dontText="Do not keep adding bold colors and borders to make something 'pop'."
        check="If I make the surrounding elements quieter, does the main element stand out enough?"
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Labels are a last resort"
        why="Naive 'label: value' formats give equal emphasis to every piece of data, making it hard to scan and destroying hierarchy."
        doText="Combine labels and values (e.g. '3 bedrooms'), or let the data format speak for itself (e.g. email addresses)."
        dontText="Do not prefix every single data point with a bold label."
        check="If I remove this label, is the data still understandable from context?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Labels vs Context"
        badLabel="Label Heavy"
        goodLabel="Contextual Presentation"
        bad={
          <Card className="p-4 space-y-3">
            <div>
              <span className="font-bold text-sm text-surface-900">Name: </span>
              <span className="text-sm text-surface-700">Erin Lindford</span>
            </div>
            <div>
              <span className="font-bold text-sm text-surface-900">Job Title: </span>
              <span className="text-sm text-surface-700">Customer Support</span>
            </div>
            <div>
              <span className="font-bold text-sm text-surface-900">Email: </span>
              <span className="text-sm text-surface-700">erin@example.com</span>
            </div>
          </Card>
        }
        good={
          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-200 shrink-0"></div>
            <div>
              <div className="font-semibold text-surface-900">Erin Lindford</div>
              <div className="text-sm text-brand-600 font-medium">Customer Support</div>
              <div className="text-sm text-surface-500">erin@example.com</div>
            </div>
          </Card>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Action hierarchy"
        why="Not all actions are equally important. Giving every button the same solid background color confuses the user about what to do next."
        doText="Have one clear primary action (solid, high contrast). Make secondary actions clear but not prominent (outline or soft background). Tertiary actions should be unobtrusive (text/link)."
        dontText="Do not put two solid, brightly colored buttons next to each other."
        check="Is there one obvious primary action on this screen?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Button Hierarchy"
        badLabel="Competing Actions"
        goodLabel="Clear Hierarchy"
        bad={
          <div className="flex gap-3 p-4">
            <button className="px-4 py-2 bg-surface-800 text-white rounded font-medium text-sm">Cancel</button>
            <button className="px-4 py-2 bg-brand-600 text-white rounded font-medium text-sm">Save Changes</button>
          </div>
        }
        good={
          <div className="flex gap-3 p-4">
            <button className="px-4 py-2 text-surface-600 hover:bg-surface-100 rounded font-medium text-sm transition-colors">Cancel</button>
            <button className="px-4 py-2 bg-brand-600 text-white rounded font-medium text-sm">Save Changes</button>
          </div>
        }
      />

    </div>
  );
}
