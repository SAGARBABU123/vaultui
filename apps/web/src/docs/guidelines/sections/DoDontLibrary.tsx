
import { Card } from "../ui/Card";
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from "@vaultui/utils";

export function DoDontLibrary({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-5xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          DO / DON'T Library
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          The wall of shame and the wall of fame.
        </p>
      </div>

      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-danger-600 flex items-center gap-3 border-b border-danger-100 pb-4">
          <AlertTriangle className="w-6 h-6" />
          DON'T BUILD THIS (Anti-Patterns)
        </h3>
        <p className="text-surface-600">
          Recognize and avoid these classic "AI Slop" anti-patterns.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AntiPatternCard 
            title="Border Overload"
            description="Putting a border around every section, card, list item, and input. This creates visual noise and boxes the user in."
            fix="Use spacing or background color contrast to separate groups."
            agentMode={agentMode}
          />
          <AntiPatternCard 
            title="The Generic SaaS Hero"
            description="A massive H1 centered at the top, a tiny grey subheadline, and two solid buttons side-by-side, occupying the entire screen."
            fix="Constraint the width. Give the buttons clear primary/secondary hierarchy. Add a realistic feature preview instead of empty space."
            agentMode={agentMode}
          />
          <AntiPatternCard 
            title="Size-Only Hierarchy"
            description="Using massive font sizes for headings while keeping the weight normal, resulting in a UI that feels both loud and weak."
            fix="Reduce the font size, increase the font weight, and use color to establish importance."
            agentMode={agentMode}
          />
          <AntiPatternCard 
            title="Color Soup"
            description="Using 5 different bright, fully saturated colors on a single dashboard to categorize items."
            fix="Use a single primary color and rely on contrast, icons, or text labels to differentiate items. Use semantic colors (red/green) sparingly."
            agentMode={agentMode}
          />
          <AntiPatternCard 
            title="Stretched Forms"
            description="A login form with 3 fields that stretches across 1200px of a desktop monitor."
            fix="Wrap the form in a max-w-md container and center it, or split the layout into columns."
            agentMode={agentMode}
          />
          <AntiPatternCard 
            title="The Forgotten Empty State"
            description="A table or list that simply renders nothing, or a single '0 items' string when the user has no data."
            fix="Add an illustration, explain the value, and provide a clear call to action to create the first item."
            agentMode={agentMode}
          />
        </div>
      </div>

      <div className="space-y-8 pt-12">
        <h3 className="text-2xl font-bold text-success-600 flex items-center gap-3 border-b border-success-100 pb-4">
          <CheckCircle className="w-6 h-6" />
          BUILD THIS
        </h3>
        <p className="text-surface-600">
          Characteristics of highly polished, professional interfaces.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoodPatternCard 
            title="Restrained Color Palette"
            description="A UI that is 90% tinted neutrals, 9% a single primary brand color, and 1% semantic accents."
            agentMode={agentMode}
          />
          <GoodPatternCard 
            title="Generous Spacing"
            description="Ample whitespace between distinct sections, and tighter spacing within related groups, creating obvious relationships."
            agentMode={agentMode}
          />
          <GoodPatternCard 
            title="Purposeful Elevation"
            description="A flat background, with cards raised via subtle borders or very soft shadows, and modals raised high with large, diffuse shadows."
            agentMode={agentMode}
          />
          <GoodPatternCard 
            title="Scannable Data"
            description="Data presented contextually without repetitive labels, right-aligned numbers in tables, and clear status indicators."
            agentMode={agentMode}
          />
        </div>
      </div>
    </div>
  );
}

function AntiPatternCard({ title, description, fix, agentMode }: any) {
  return (
    <Card className={cn("border-danger-200 bg-danger-50/30 overflow-hidden", agentMode ? "p-4" : "p-6")}>
      <h4 className="font-bold text-danger-900 mb-2">{title}</h4>
      <p className="text-danger-800/80 text-sm mb-4 leading-relaxed">{description}</p>
      <div className="bg-white border border-danger-100 rounded p-3">
        <span className="text-xs font-bold text-success-700 uppercase tracking-wider block mb-1">How to fix it</span>
        <span className="text-sm text-surface-700">{fix}</span>
      </div>
    </Card>
  );
}

function GoodPatternCard({ title, description, agentMode }: any) {
  return (
    <Card className={cn("border-success-200 bg-success-50/30", agentMode ? "p-4" : "p-6")}>
      <h4 className="font-bold text-success-900 mb-2">{title}</h4>
      <p className="text-success-800/80 text-sm leading-relaxed">{description}</p>
    </Card>
  );
}
