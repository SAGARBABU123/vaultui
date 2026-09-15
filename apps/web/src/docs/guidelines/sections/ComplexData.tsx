
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { MoreHorizontal } from 'lucide-react';

export function ComplexData({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Complex Data Display
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Timelines, boards, and pagination require distinct structural paradigms to remain legible.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Connect timelines with continuous vertical tracking"
        why="An activity feed without a connecting line just looks like a scattered list of paragraphs. The vertical line visually unifies the events into a single chronological narrative."
        doText="Use relative/absolute positioning to draw a continuous vertical border connecting circular nodes for each activity item."
        dontText="Do not just stack text blocks and call it a 'timeline'."
        check="Does the eye naturally follow a straight path from the oldest event to the newest?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Activity Timelines"
        badLabel="Disconnected List"
        goodLabel="Tracked Timeline"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-200 rounded space-y-4">
            <div>
              <div className="text-sm font-bold">Project Created</div>
              <div className="text-xs text-surface-500">2 hours ago by Alice</div>
            </div>
            <div>
              <div className="text-sm font-bold">Files Uploaded</div>
              <div className="text-xs text-surface-500">1 hour ago by Bob</div>
            </div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-6 bg-white border border-surface-200 rounded-lg shadow-sm">
            <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-200 before:to-transparent">
              <div className="relative">
                <div className="absolute left-[-24px] w-3 h-3 bg-white border-2 border-brand-500 rounded-full mt-1.5" />
                <div className="text-sm font-semibold text-surface-900">Project Created</div>
                <div className="text-xs text-surface-500">2 hours ago by Alice</div>
              </div>
              <div className="relative">
                <div className="absolute left-[-24px] w-3 h-3 bg-white border-2 border-surface-300 rounded-full mt-1.5" />
                <div className="text-sm font-semibold text-surface-900">Files Uploaded</div>
                <div className="text-xs text-surface-500">1 hour ago by Bob</div>
              </div>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Give pagination generous tap targets"
        why="Tiny page numbers packed tightly together are impossible to click accurately on mobile and frustrating on desktop."
        doText="Give each page number button at least 36x36px of space. Use ellipses (...) for skipped page ranges to prevent the UI from stretching endlessly."
        dontText="Do not render 100 individual page links side-by-side."
        check="Can I tap page '4' without accidentally hitting '3' or '5'?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Pagination Sizing"
        badLabel="Cramped & Tiny"
        goodLabel="Spacious & Truncated"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-200 rounded flex justify-center gap-1">
            <span className="text-xs text-blue-600 underline cursor-pointer">1</span>
            <span className="text-xs text-blue-600 underline cursor-pointer">2</span>
            <span className="text-xs text-blue-600 underline cursor-pointer">3</span>
            <span className="text-xs text-blue-600 underline cursor-pointer">4</span>
            <span className="text-xs text-blue-600 underline cursor-pointer">5</span>
            <span className="text-xs text-blue-600 underline cursor-pointer">6</span>
            <span className="text-xs text-blue-600 underline cursor-pointer">7</span>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-200 rounded-lg flex items-center justify-center gap-1 shadow-sm">
            <button className="px-3 py-1 text-sm font-medium text-surface-500 hover:text-surface-900 hover:bg-surface-100 rounded-md transition-colors">Previous</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium bg-brand-50 text-brand-700 rounded-md">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-md transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-md transition-colors">3</button>
            <div className="w-8 h-8 flex items-center justify-center text-surface-400"><MoreHorizontal className="w-4 h-4" /></div>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-md transition-colors">12</button>
            <button className="px-3 py-1 text-sm font-medium text-surface-500 hover:text-surface-900 hover:bg-surface-100 rounded-md transition-colors">Next</button>
          </div>
        }
      />
    </div>
  );
}
