import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';
import { Upload, X, Calendar } from 'lucide-react';

export function AdvancedInputs({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Advanced Inputs
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Go beyond standard text boxes. Design intuitive inputs for complex data types.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Use Dropzones for File Uploads"
        why="Native browser file inputs (<input type='file'>) are notoriously ugly, cannot be styled consistently across browsers, and lack drag-and-drop affordance."
        doText="Create a spacious dropzone with a dashed border, a clear upload icon, and supporting text that states accepted file types."
        dontText="Do not rely on the default browser 'Choose File' button."
        check="Is there a large, obvious target for users to drag and drop their files into?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="File Uploads"
        badLabel="Native Browser Default"
        goodLabel="Custom Dropzone"
        bad={
          <div className="w-full max-w-sm mx-auto p-6 bg-white border border-neutral-200 rounded">
            <input type="file" className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200" />
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-6 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-center hover:bg-neutral-100 hover:border-primary-400 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-neutral-500 group-hover:text-primary-600" />
            </div>
            <p className="text-sm font-medium text-neutral-900">Click to upload or drag and drop</p>
            <p className="text-xs text-neutral-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Convert Multi-Selects into Removable Pills"
        why="Standard multi-select dropdowns require holding CMD/CTRL to select multiple items, which is hostile to non-power-users and impossible on mobile. It also hides the selected values once the dropdown closes."
        doText="Display selected items as 'pills' or 'tags' inside or directly below the input field, each with a clear 'X' to remove it."
        dontText="Do not use <select multiple>."
        check="Can the user easily see all their selected options at a glance and remove them individually?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Multi-Select (Tags)"
        badLabel="Hidden Native Select"
        goodLabel="Pill-based Input"
        bad={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-neutral-200 rounded">
            <label className="text-sm font-medium block mb-2">Select Categories (Hold CMD)</label>
            <select multiple defaultValue={['design', 'engineering']} className="w-full border border-neutral-300 rounded p-2 text-sm bg-white h-24">
              <option value="design">Design</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
            </select>
          </div>
        }
        good={
          <div className="w-full max-w-sm mx-auto p-4 bg-white border border-neutral-200 rounded-lg shadow-sm">
            <label className="text-sm font-medium text-neutral-900 block mb-2">Categories</label>
            <div className="w-full border border-neutral-300 rounded-md p-1.5 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 bg-white">
              <span className="flex items-center gap-1 bg-neutral-100 text-neutral-800 text-xs font-medium px-2 py-1 rounded-md">
                Design <X className="w-3 h-3 text-neutral-500 cursor-pointer hover:text-neutral-900" />
              </span>
              <span className="flex items-center gap-1 bg-neutral-100 text-neutral-800 text-xs font-medium px-2 py-1 rounded-md">
                Engineering <X className="w-3 h-3 text-neutral-500 cursor-pointer hover:text-neutral-900" />
              </span>
              <input type="text" placeholder="Add category..." className="flex-1 min-w-[120px] outline-none text-sm px-1 bg-transparent" />
            </div>
          </div>
        }
      />
    </div>
  );
}
