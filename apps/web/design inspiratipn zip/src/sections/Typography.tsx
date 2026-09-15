import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';

export function Typography({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Typography System
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Establish a system and stop tweaking text pixel by pixel.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Establish a type scale"
        why="Choosing font sizes without a system leads to inconsistencies and slows down your workflow. You don't need a mathematical modular scale, a handcrafted scale works better for UI."
        doText="Use a constrained set of font sizes (e.g. 12, 14, 16, 18, 20, 24, 30, 36, 48, 60)."
        dontText="Do not use arbitrary values or define headline sizes using 'em' units relative to body text."
        check="Is this font size part of my predefined scale?"
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Line-height is proportional"
        why="Line-height shouldn't be a blanket 1.5 across your entire app. Narrow content needs less height, wide content needs more. Small text needs more height, large text needs less."
        doText="Use taller line-height (1.5 - 1.7) for body text and shorter line-height (1.0 - 1.2) for large headings."
        dontText="Do not use a 1.5 line-height on a 48px heading—it will look disconnected."
        check="Does this heading feel like a single block, or are the lines floating apart?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Heading Line-Height"
        badLabel="1.5 Line-height (Disconnected)"
        goodLabel="1.1 Line-height (Cohesive)"
        bad={
          <div className="p-4 w-64">
            <h1 className="text-3xl font-display font-bold leading-relaxed text-neutral-900">
              Team communication optimized for deep work.
            </h1>
          </div>
        }
        good={
          <div className="p-4 w-64">
            <h1 className="text-3xl font-display font-bold leading-tight text-neutral-900">
              Team communication optimized for deep work.
            </h1>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Keep your line length in check"
        why="Text that spans the entire width of a wide screen is exhausting to read because the eye has trouble tracking back to the start of the next line."
        doText="Constrain paragraph widths to 45-75 characters per line (approx 20-35em, or max-w-prose / max-w-2xl in Tailwind)."
        dontText="Do not let text blocks stretch to 100% of their container if the container is wide."
        check="Is this paragraph wider than 75 characters?"
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Align with readability in mind"
        why="Centered text is hard to read if it's more than a few lines long because the starting edge of each line changes."
        doText="Left-align paragraphs and lists. Only center short, independent blocks of text like headlines or single-sentence subheadings."
        dontText="Do not center-align paragraphs of text."
        check="Is this centered text longer than 3 lines?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Centering Long Text"
        badLabel="Centered Paragraph"
        goodLabel="Left-Aligned Paragraph"
        bad={
          <div className="p-4 text-center">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Beautiful templates</h3>
            <p className="text-sm text-neutral-600">
              Our templates are all you need to stand out from the rest of the competition. 
              We provide you with all the tools and insights to grow your online business.
            </p>
          </div>
        }
        good={
          <div className="p-4 text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded bg-primary-100"></div>
              <h3 className="text-lg font-bold text-neutral-900">Beautiful templates</h3>
            </div>
            <p className="text-sm text-neutral-600">
              Our templates are all you need to stand out from the rest of the competition. 
              We provide you with all the tools and insights to grow your online business.
            </p>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Baseline, not center"
        why="When mixing different font sizes on the same line, vertically centering them looks awkward because our eyes align text by the baseline (the invisible line letters rest on)."
        doText="Align mixed font sizes by their baseline."
        dontText="Do not use align-items: center for text of vastly different sizes on the same line."
        check="Are the bottoms of the letters sitting on the same invisible line?"
      />

    </div>
  );
}
