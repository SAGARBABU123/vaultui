
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";

export function Depth({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Depth & Elevation
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Establish a light source and use shadows to communicate distance, not just to decorate.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Light comes from above"
        why="In the real world, light comes from above (the sun, ceiling lights). Our brains are wired to interpret shadows and highlights based on this assumption."
        doText="For raised elements, highlight the top edge and shadow the bottom. For inset elements (wells), shadow the top edge and highlight the bottom."
        dontText="Do not cast shadows upward or use 0-offset blurs if you want a natural look."
        check="Does this shadow imply a light source directly above the screen?"
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Use shadows to convey elevation"
        why="Shadows position elements on a virtual z-axis. They should communicate how close an element is to the user."
        doText="Define an elevation system (e.g. sm, md, lg, xl). Use small, tight shadows for clickable items (buttons, cards), medium for dropdowns, and large, diffuse shadows for modals to capture focus."
        dontText="Do not throw a huge, blurry shadow on a simple card that sits flush with the page."
        check="Is this shadow size proportional to how 'high' off the page the element should be?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Appropriate Shadow Sizing"
        badLabel="Exaggerated Shadow"
        goodLabel="Subtle Elevation"
        bad={
          <div className="p-8">
            <button className="px-6 py-3 bg-white border border-surface-200 text-surface-900 font-medium rounded-lg shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">
              Submit Form
            </button>
          </div>
        }
        good={
          <div className="p-8">
            <button className="px-6 py-3 bg-white border border-surface-200 text-surface-900 font-medium rounded-lg shadow-sm hover:shadow transition-shadow">
              Submit Form
            </button>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Shadows have two parts"
        why="A realistic shadow consists of ambient shadow (tight, dark, underneath) and direct light shadow (diffuse, softer, offset)."
        doText="Combine multiple box-shadows in CSS to create smooth, natural depth (e.g. Tailwind's default shadow utilities do this well)."
        dontText="Do not use a single, harsh, heavily opaque black shadow."
        check="Does this shadow look like a natural gradient, or a harsh dark outline?"
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Overlap elements to create layers"
        why="Shadows aren't the only way to convey depth. Overlapping elements over different backgrounds strongly communicates that they sit on a different layer."
        doText="Pull cards up so they overlap a hero section's background, or make an active element taller than its container."
        dontText="Do not confine everything strictly within the bounds of its parent container if breaking out would improve the layout."
        check="If I pull this card up to overlap the header by -64px, does it feel more integrated?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Creating Layers via Overlap"
        badLabel="Strict Containment"
        goodLabel="Overlapping Layers"
        bad={
          <div className="w-full rounded overflow-hidden border border-surface-200">
            <div className="bg-brand-900 h-24 p-4 text-white">Header</div>
            <div className="bg-surface-100 h-32 p-4 pt-4">
              <div className="bg-white p-4 rounded shadow-sm">Card Content</div>
            </div>
          </div>
        }
        good={
          <div className="w-full rounded overflow-hidden border border-surface-200 relative">
            <div className="bg-brand-900 h-32 p-4 text-white pb-12">Header</div>
            <div className="bg-surface-100 h-24 p-4"></div>
            {/* Overlapping element */}
            <div className="absolute top-16 left-4 right-4 bg-white p-4 rounded shadow-md border border-surface-100">
              Card Content
            </div>
          </div>
        }
      />

    </div>
  );
}
