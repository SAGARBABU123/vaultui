
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function Carousels({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Carousels
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Horizontal scrolling shouldn't feel like a broken webpage. Hide the scrollbar and use snap points.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Hide scrollbars and use CSS Scroll Snap"
        why="A native horizontal scrollbar at the bottom of a card row looks terrible. Without snap points, the user can easily leave the scroll halfway between two cards, looking messy."
        doText="Use CSS classes to hide the scrollbar (e.g., scrollbar-width: none). Apply 'snap-x mandatory' to the container, and 'snap-center' or 'snap-start' to the children. Add external arrow controls."
        dontText="Do not leave the native horizontal scrollbar visible on desktop."
        check="When I let go of the scroll/swipe, does it magnetically snap perfectly into place?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Horizontal Scrolling"
        badLabel="Native Scrollbar (No Snap)"
        goodLabel="Snapping Carousel"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-200 rounded">
            {/* Bad: Visible scrollbar, free scrolling */}
            <div className="flex gap-4 overflow-x-auto pb-4 w-full">
              <div className="min-w-[150px] h-24 bg-surface-200 shrink-0 flex items-center justify-center text-sm">Card 1</div>
              <div className="min-w-[150px] h-24 bg-surface-200 shrink-0 flex items-center justify-center text-sm">Card 2</div>
              <div className="min-w-[150px] h-24 bg-surface-200 shrink-0 flex items-center justify-center text-sm">Card 3</div>
            </div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4 bg-surface-50 border border-surface-200 rounded-lg relative group">
            {/* Controls */}
            <button className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-surface-200 rounded-full shadow-md flex items-center justify-center z-10 hover:bg-surface-50 transition-colors">
              <ArrowLeft className="w-4 h-4 text-surface-600" />
            </button>
            <button className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-surface-200 rounded-full shadow-md flex items-center justify-center z-10 hover:bg-surface-50 transition-colors">
              <ArrowRight className="w-4 h-4 text-surface-600" />
            </button>
            
            {/* Good: Snapping, no visible scrollbar */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="min-w-[200px] h-32 bg-white border border-surface-200 shadow-sm rounded-lg shrink-0 snap-center flex items-center justify-center font-bold text-surface-900">Card 1</div>
              <div className="min-w-[200px] h-32 bg-white border border-surface-200 shadow-sm rounded-lg shrink-0 snap-center flex items-center justify-center font-bold text-surface-400">Card 2</div>
              <div className="min-w-[200px] h-32 bg-white border border-surface-200 shadow-sm rounded-lg shrink-0 snap-center flex items-center justify-center font-bold text-surface-400">Card 3</div>
            </div>
          </div>
        }
      />
    </div>
  );
}
