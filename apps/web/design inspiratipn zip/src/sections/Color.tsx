import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';

export function Color({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Color System
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Color should support hierarchy and convey information, not just decorate.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="You need more colors than you think"
        why="You can't build a complex UI with just 5 hex codes from a color palette generator. You need multiple shades of greys, primary colors, and semantic accents (success, warning, danger)."
        doText="Define a comprehensive palette (e.g. 50-900 scale) for your primary color, neutrals, and semantic colors up front."
        dontText="Do not use 35 slightly different, randomly picked blues throughout your CSS."
        check="Am I using a shade from my predefined 50-900 palette?"
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Greys don't have to be grey"
        why="Pure grey (0% saturation) feels cold and unnatural. Adding a slight tint of color makes greys feel much more cohesive with your design."
        doText="Saturate your neutrals with a tiny bit of blue for a cool, technical feel, or a tiny bit of yellow/orange for a warm, organic feel."
        dontText="Do not use pure #000000 or #888888 if you want a premium look."
        check="Do my greys have a subtle hue that matches my brand?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Tinted Neutrals"
        badLabel="Pure Grey (Cold/Harsh)"
        goodLabel="Tinted Grey (Warm/Cohesive)"
        bad={
          <div className="w-full h-full bg-[#f0f0f0] p-6 rounded border border-[#cccccc]">
            <div className="text-[#333333] font-medium mb-2">Invoice #001</div>
            <div className="text-[#777777] text-sm">Due in 5 days</div>
          </div>
        }
        good={
          <div className="w-full h-full bg-neutral-100 p-6 rounded border border-neutral-200">
            <div className="text-neutral-900 font-medium mb-2">Invoice #001</div>
            <div className="text-neutral-600 text-sm">Due in 5 days</div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Don't use grey text on colored backgrounds"
        why="Making text light grey on a white background works because it reduces contrast. Doing the same on a colored background often results in text that looks dull, washed out, and fails accessibility."
        doText="To de-emphasize text on a colored background, pick a color with the SAME HUE as the background, but adjust the lightness/saturation."
        dontText="Do not lower the opacity of white text too much, or use grey hex codes over brand colors."
        check="Is this 'grey' text actually a desaturated version of the background color?"
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Accessible doesn't have to mean ugly"
        why="You can maintain WCAG accessibility ratios without sacrificing aesthetics if you know how to adjust colors correctly."
        doText="When putting text on a colored background, if white text fails contrast, try flipping the contrast entirely by using a very dark version of that hue instead."
        dontText="Do not just barely darken white text until it passes, leaving it muddy."
        check="Is the contrast ratio at least 4.5:1 for normal text?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Flipping Contrast for Accessibility"
        badLabel="White Text (Fails Contrast)"
        goodLabel="Dark Tint (Passes Contrast)"
        bad={
          <div className="w-full flex justify-center p-4">
            <span className="bg-emerald-400 text-white px-3 py-1 rounded-full text-sm font-medium">
              Approved
            </span>
          </div>
        }
        good={
          <div className="w-full flex justify-center p-4">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold">
              Approved
            </span>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Don't rely on color alone"
        why="Using only color to convey meaning completely breaks the UI for colorblind users."
        doText="Always use color to support something that your design is already saying via icons, text labels, or contrast."
        dontText="Do not use only a red dot and a green dot to indicate status."
        check="If I turned this screen grayscale, would the user still know what's happening?"
      />

    </div>
  );
}
