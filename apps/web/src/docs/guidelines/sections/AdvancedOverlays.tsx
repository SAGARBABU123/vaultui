
import { AgentRule } from "../ui/AgentRule";
import { VisualExample } from "../ui/VisualExample";
import { Search, Command, X } from 'lucide-react';

export function AdvancedOverlays({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-surface-900 mb-4">
          Advanced Overlays & Navigation
        </h2>
        <p className="text-xl text-surface-600 leading-relaxed">
          Go beyond basic center-screen modals. Drawers and Command Palettes solve complex spatial problems.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Use Drawers for complex forms and details"
        why="Center-screen modals are great for quick confirmations. But if you are embedding a massive form or detailed view, a modal feels claustrophobic. A drawer (side sheet) anchored to the edge of the screen feels natural and spacious."
        doText="Anchor drawers to the right edge. Make them span 100% of the screen height. Use a dark backdrop to separate them from the main canvas."
        dontText="Do not force a complex multi-column form into a tiny center-screen modal."
        check="Does this overlay contain more than 3 inputs? If yes, use a drawer."
      />

      <VisualExample 
        agentMode={agentMode}
        title="Drawers vs Modals"
        badLabel="Overcrowded Modal"
        goodLabel="Spacious Side Drawer"
        bad={
          <div className="w-full h-64 border border-surface-200 rounded flex items-center justify-center bg-surface-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-surface-900/40"></div>
            <div className="relative z-10 w-64 bg-white p-4 rounded shadow-lg">
              <h3 className="font-bold text-sm mb-2">Edit Full Profile</h3>
              <div className="space-y-2 mb-2">
                <div className="h-6 bg-surface-100 rounded w-full"></div>
                <div className="h-6 bg-surface-100 rounded w-full"></div>
                <div className="h-6 bg-surface-100 rounded w-full"></div>
                <div className="h-6 bg-surface-100 rounded w-full"></div>
              </div>
              <button className="w-full bg-brand-600 text-white text-xs py-1 rounded">Save</button>
            </div>
          </div>
        }
        good={
          <div className="w-full h-64 border border-surface-200 rounded flex justify-end bg-surface-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-surface-900/40"></div>
            <div className="relative z-10 w-64 bg-white h-full shadow-2xl flex flex-col border-l border-surface-200">
              <div className="px-4 py-3 border-b border-surface-100 flex justify-between items-center">
                <h3 className="font-bold text-sm text-surface-900">Edit Profile</h3>
                <X className="w-4 h-4 text-surface-400" />
              </div>
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <div className="h-8 bg-surface-50 border border-surface-200 rounded w-full"></div>
                <div className="h-8 bg-surface-50 border border-surface-200 rounded w-full"></div>
                <div className="h-8 bg-surface-50 border border-surface-200 rounded w-full"></div>
                <div className="h-8 bg-surface-50 border border-surface-200 rounded w-full"></div>
                <div className="h-8 bg-surface-50 border border-surface-200 rounded w-full"></div>
              </div>
              <div className="p-3 border-t border-surface-100 bg-surface-50 flex justify-end gap-2">
                <button className="px-3 py-1.5 text-xs font-medium text-surface-700 bg-white border border-surface-300 rounded shadow-sm">Cancel</button>
                <button className="px-3 py-1.5 text-xs font-medium text-white bg-brand-600 rounded shadow-sm">Save</button>
              </div>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Structure Command Palettes clearly"
        why="A search bar that just lists raw text results is hard to scan. Command palettes (Cmd+K menus) must categorize results and highlight the active selection to be usable with a keyboard."
        doText="Group results by type (e.g., 'Pages', 'Actions', 'Contacts'). Highlight the currently focused item with a background tint, and include small shortcut icons."
        dontText="Do not present search results as a continuous, un-grouped list of raw text."
        check="Can the user distinguish between navigating to a page versus triggering an action from the search results?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Command Palettes (Cmd+K)"
        badLabel="Unstructured Search"
        goodLabel="Categorized Palette"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-surface-300 rounded shadow-lg">
            <input type="text" value="sett" readOnly className="w-full border-b border-surface-300 pb-2 mb-2 text-sm outline-none" />
            <div className="text-sm space-y-2">
              <div>Settings</div>
              <div>Account Settings</div>
              <div>Billing Settings</div>
            </div>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto bg-white border border-surface-200 rounded-xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/5">
            <div className="flex items-center px-4 py-3 border-b border-surface-100">
              <Search className="w-4 h-4 text-surface-400 mr-2" />
              <input type="text" value="sett" readOnly className="flex-1 text-sm outline-none text-surface-900 placeholder-surface-400 bg-transparent" />
            </div>
            <div className="p-2 space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-surface-400 px-2 mb-1">Navigation</div>
                <div className="px-2 py-1.5 bg-brand-50 text-brand-700 rounded-md text-sm font-medium flex items-center justify-between">
                  General Settings
                  <span className="text-xs bg-white border border-brand-200 px-1 rounded shadow-sm">↵</span>
                </div>
                <div className="px-2 py-1.5 text-surface-600 rounded-md text-sm hover:bg-surface-50 flex items-center justify-between">
                  Billing Settings
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
