
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";

export function Sliders({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Sliders
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Custom range selectors provide a polished, unified experience across all browsers.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Style the track and the thumb"
        why="Native HTML range inputs look completely different on Chrome, Firefox, and Safari. They often look dated and clash with modern design systems."
        doText="Build a custom track with a distinct 'fill' color on the left. The draggable 'thumb' should be a white circle with a border and drop shadow to indicate it can be grabbed."
        dontText="Do not leave <input type='range'> unstyled."
        check="Does the left side of the track show the 'filled' progress clearly?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Range Sliders"
        badLabel="Native Browser Slider"
        goodLabel="Custom Component"
        bad={
          <div className="w-full max-w-sm mx-auto p-6 bg-white border border-surface-200 rounded">
            <label className="text-sm font-medium mb-4 block">Volume</label>
            <input type="range" className="w-full" />
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-6 bg-white border border-surface-200 rounded-lg shadow-sm">
            <div className="flex justify-between mb-4">
              <label className="text-sm font-medium text-surface-900">Volume</label>
              <span className="text-sm text-surface-500 font-medium">65%</span>
            </div>
            {/* Simulated custom slider */}
            <div className="relative w-full h-2 bg-surface-200 rounded-full cursor-pointer flex items-center group">
              {/* Fill Track */}
              <div className="absolute h-full bg-brand-600 rounded-full w-[65%]"></div>
              {/* Thumb */}
              <div className="absolute left-[65%] -ml-2.5 w-5 h-5 bg-white border-2 border-brand-600 rounded-full shadow hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-brand-500/30"></div>
            </div>
          </div>
        }
      />
    </div>
  );
}
