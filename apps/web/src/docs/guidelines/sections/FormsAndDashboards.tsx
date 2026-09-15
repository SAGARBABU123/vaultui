
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { Card } from "../ui/Card";

export function FormsAndDashboards({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Forms & Dashboards
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          How to handle data-dense interfaces and complex inputs without creating a mess.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Design dashboards deliberately"
        why="When everything is equally important, nothing is. Generic dashboards put everything in identical cards with identical contrast, creating massive cognitive load."
        doText="Establish clear hierarchy. Use restrained colors. Make primary metrics obvious and de-emphasize supporting information. Use whitespace instead of heavy borders."
        dontText="Do not wrap every single number in a bordered card or use a rainbow of chart colors."
        check="Is it obvious what the most important metric on this dashboard is?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Dashboard Density & Hierarchy"
        badLabel="Generic Box Dashboard"
        goodLabel="Intentional Dashboard"
        bad={
          <div className="p-4 grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
            <div className="border border-surface-300 rounded p-3 bg-white">
              <div className="text-xs text-surface-500 mb-1">Monthly Rev</div>
              <div className="text-lg font-bold text-surface-900">$103K</div>
              <div className="text-xs text-success-600 mt-1">+1.4%</div>
            </div>
            <div className="border border-surface-300 rounded p-3 bg-white">
              <div className="text-xs text-surface-500 mb-1">Net Rev</div>
              <div className="text-lg font-bold text-surface-900">$103K</div>
              <div className="text-xs text-danger-600 mt-1">-11.1%</div>
            </div>
          </div>
        }
        good={
          <div className="p-4 w-full max-w-md mx-auto">
            <div className="flex justify-between items-end border-b border-surface-200 pb-4 mb-4">
              <div>
                <div className="text-sm font-medium text-surface-500 mb-1">Monthly Revenue</div>
                <div className="text-3xl font-display font-bold text-surface-900">$103K</div>
              </div>
              <div className="bg-success-100 text-success-800 text-xs font-bold px-2 py-1 rounded">
                +1.4%
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-surface-500">Net Revenue</span>
              <span className="font-medium text-surface-900">$89K <span className="text-danger-600 text-xs ml-2">-11.1%</span></span>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Group forms logically"
        why="Forms become overwhelming when inputs are stacked infinitely with ambiguous spacing or stretched across a massive desktop screen."
        doText="Group related fields. Increase the margin between distinct groups. Use narrow, single-column layouts for simple forms, or split descriptions into a left column for complex settings."
        dontText="Do not stretch a text input to 1200px wide. Do not use the same margin below a label as you do below the input itself."
        check="Can I clearly tell which input belongs to which label, and which groups are related?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Form Grouping & Widths"
        badLabel="Full-width, ambiguous spacing"
        goodLabel="Constrained, clear grouping"
        bad={
          <div className="w-full space-y-4 p-4">
            <div className="w-full">
              <div className="text-sm font-medium mb-2">First Name</div>
              <div className="w-full h-10 border border-surface-300 rounded bg-white"></div>
            </div>
            <div className="w-full">
              <div className="text-sm font-medium mb-2">Last Name</div>
              <div className="w-full h-10 border border-surface-300 rounded bg-white"></div>
            </div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-surface-700 mb-1">First Name</div>
                <div className="w-full h-10 border border-surface-300 rounded-md shadow-sm bg-white"></div>
              </div>
              <div>
                <div className="text-sm font-medium text-surface-700 mb-1">Last Name</div>
                <div className="w-full h-10 border border-surface-300 rounded-md shadow-sm bg-white"></div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
