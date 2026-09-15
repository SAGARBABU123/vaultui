
import { Card } from "../ui/Card";
import { BookOpen, Target, Sparkles } from 'lucide-react';

export function Overview({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Overview & Purpose
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Welcome to the AI UI Design Constitution. A visual, interactive handbook built specifically for AI agents and developers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-t-4 border-t-brand-500">
          <BookOpen className="w-8 h-8 text-brand-600 mb-4" />
          <h3 className="text-lg font-bold text-surface-900 mb-2">What is this?</h3>
          <p className="text-sm text-surface-600 leading-relaxed">
            This is a comprehensive UI reference guide inspired by modern design systems and the principles of Refactoring UI. It translates abstract design concepts into concrete, logical rules.
          </p>
        </Card>

        <Card className="p-6 border-t-4 border-t-success-500">
          <Target className="w-8 h-8 text-success-600 mb-4" />
          <h3 className="text-lg font-bold text-surface-900 mb-2">Why is it useful?</h3>
          <p className="text-sm text-surface-600 leading-relaxed">
            AI agents often default to generic, unpolished interfaces or "AI slop". This guide provides strict constraints—from typography scales to component states—preventing those common pitfalls.
          </p>
        </Card>

        <Card className="p-6 border-t-4 border-t-warning-500">
          <Sparkles className="w-8 h-8 text-warning-600 mb-4" />
          <h3 className="text-lg font-bold text-surface-900 mb-2">How to use it</h3>
          <p className="text-sm text-surface-600 leading-relaxed">
            Navigate through the course sections in the sidebar. Start with the foundations of layout and hierarchy, move into specific components, and finish with the UI Quality Checklist before shipping.
          </p>
        </Card>
      </div>

      {!agentMode && (
        <div className="bg-surface-900 text-white rounded-xl p-8 mt-8">
          <h3 className="text-2xl font-display font-semibold mb-4">The Core Philosophy</h3>
          <ul className="space-y-4 text-surface-300">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              <p><strong>Design intentionally.</strong> Don't just place elements on the screen to fill space.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              <p><strong>Reduce noise.</strong> Borders, shadows, and loud colors should be used sparingly. De-emphasize secondary content.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              <p><strong>Establish hierarchy.</strong> The user should instantly know what the primary action or information is.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              <p><strong>Use systems.</strong> Stop guessing values for padding, font sizes, and colors. Use the predefined scales.</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
