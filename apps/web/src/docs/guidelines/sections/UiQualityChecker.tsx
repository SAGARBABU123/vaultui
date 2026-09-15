import type { ReactNode } from "react";
import * as React from "react";

import { Card } from "../ui/Card";

export function UiQualityChecker({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8 pb-32">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          UI Quality Checker
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Use this checklist to evaluate an interface before finalizing it.
        </p>
      </div>

      <div className="space-y-8">
        <ChecklistSection title="Hierarchy">
          <CheckItem text="Is the primary action obvious?" />
          <CheckItem text="Are secondary elements appropriately de-emphasized?" />
          <CheckItem text="Is anything competing unnecessarily for attention?" />
          <CheckItem text="Can I identify the most important element within 2 seconds?" />
        </ChecklistSection>

        <ChecklistSection title="Spacing">
          <CheckItem text="Is spacing consistent and pulled from a defined scale?" />
          <CheckItem text="Are groups clearly separated?" />
          <CheckItem text="Is the space INSIDE a group smaller than the space BETWEEN groups?" />
          <CheckItem text="Is there enough whitespace overall?" />
        </ChecklistSection>

        <ChecklistSection title="Typography">
          <CheckItem text="Is the type scale consistent?" />
          <CheckItem text="Are body sizes readable (min 16px usually)?" />
          <CheckItem text="Are headings appropriately sized and weighted?" />
          <CheckItem text="Is line-height proportional (tighter for large text, looser for small)?" />
          <CheckItem text="Are line lengths constrained to 45-75 characters?" />
        </ChecklistSection>

        <ChecklistSection title="Color">
          <CheckItem text="Is color intentional and used sparingly?" />
          <CheckItem text="Is contrast sufficient (WCAG AA)?" />
          <CheckItem text="Are greys subtly tinted to match the temperature of the design?" />
          <CheckItem text="Is color being used as the ONLY signal for state? (If so, fix it)" />
        </ChecklistSection>

        <ChecklistSection title="Layout">
          <CheckItem text="Is content unnecessarily stretched across a wide screen?" />
          <CheckItem text="Are max-widths used appropriately?" />
          <CheckItem text="Is the grid helping rather than constraining?" />
        </ChecklistSection>

        <ChecklistSection title="Components">
          <CheckItem text="Are components consistent?" />
          <CheckItem text="Are interaction states covered (hover, focus, disabled)?" />
          <CheckItem text="Are empty states handled with care and guidance?" />
          <CheckItem text="Do components reflect their purpose, or are they generic HTML elements?" />
        </ChecklistSection>

        <ChecklistSection title="Polish">
          <CheckItem text="Are borders necessary, or could spacing do the job?" />
          <CheckItem text="Are shadows meaningful (conveying elevation)?" />
          <CheckItem text="Are decorative elements supporting the content rather than distracting from it?" />
        </ChecklistSection>
      </div>

      <div className="mt-16 p-8 bg-surface-900 text-white rounded-xl text-center space-y-4">
        <h3 className="text-2xl font-display font-bold">Final Verdict</h3>
        <p className="text-surface-400 max-w-lg mx-auto">
          If you answered "No" to any of the fundamental questions above, the UI needs refinement. Good UI is not the UI with the most decoration; it is the UI where the right things are obvious.
        </p>
      </div>
    </div>
  );
}

function ChecklistSection({ title, children }: { title: string, children: ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-surface-50 px-6 py-4 border-b border-surface-200">
        <h3 className="font-bold text-surface-900 text-lg">{title}</h3>
      </div>
      <div className="p-2">
        {children}
      </div>
    </Card>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <label className="flex items-start gap-3 p-4 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors">
      <input type="checkbox" className="mt-1 w-5 h-5 rounded border-surface-300 text-brand-600 focus:ring-brand-500 shrink-0" />
      <span className="text-surface-700 leading-snug">{text}</span>
    </label>
  );
}
