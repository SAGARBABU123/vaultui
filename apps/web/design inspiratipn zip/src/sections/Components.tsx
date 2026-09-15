import React from 'react';
import { AgentRule } from '../components/ui/AgentRule';
import { VisualExample } from '../components/ui/VisualExample';

export function Components({ agentMode }: { agentMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <div>
        <h2 className="text-4xl font-display font-semibold tracking-tight text-neutral-900 mb-4">
          Component Design
        </h2>
        <p className="text-xl text-neutral-600 leading-relaxed">
          Think outside the box. Don't let your existing beliefs hold back your designs.
        </p>
      </div>

      <AgentRule 
        agentMode={agentMode}
        rule="Don't make generic components"
        why="Preconceived notions about how a component is 'supposed' to look often leads to boring, suboptimal UI. If a conventional component is hurting usability, rethink it."
        doText="Design components that reflect their specific purpose. Use selectable cards instead of boring radio buttons when the choice deserves context."
        dontText="Do not force a complex choice into a standard HTML radio input."
        check="Does this component look like a generic HTML element, or a piece of software built for this specific task?"
      />

      <VisualExample 
        agentMode={agentMode}
        title="Selectable Cards vs Radio Buttons"
        badLabel="Standard Radio Buttons"
        goodLabel="Selectable Cards"
        bad={
          <div className="p-6 space-y-3 w-full max-w-xs mx-auto">
            <div className="flex items-center gap-2">
              <input type="radio" id="b1" name="plan" className="w-4 h-4 text-primary-600" />
              <label htmlFor="b1" className="text-sm font-medium">Hobby (1 GB)</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" id="b2" name="plan" defaultChecked className="w-4 h-4 text-primary-600" />
              <label htmlFor="b2" className="text-sm font-medium text-neutral-900">Growth (5 GB)</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" id="b3" name="plan" className="w-4 h-4 text-primary-600" />
              <label htmlFor="b3" className="text-sm font-medium">Business (10 GB)</label>
            </div>
          </div>
        }
        good={
          <div className="p-4 grid grid-cols-3 gap-3 w-full">
            <div className="border border-neutral-200 rounded-lg p-3 cursor-pointer hover:border-neutral-300">
              <div className="text-xs font-bold text-neutral-400 mb-1">HOBBY</div>
              <div className="text-lg font-bold">1 <span className="text-sm font-medium">GB</span></div>
            </div>
            <div className="border-2 border-primary-500 bg-primary-50 rounded-lg p-3 cursor-pointer relative">
              <div className="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <div className="text-xs font-bold text-primary-600 mb-1">GROWTH</div>
              <div className="text-lg font-bold text-primary-900">5 <span className="text-sm font-medium">GB</span></div>
            </div>
            <div className="border border-neutral-200 rounded-lg p-3 cursor-pointer hover:border-neutral-300">
              <div className="text-xs font-bold text-neutral-400 mb-1">BUSINESS</div>
              <div className="text-lg font-bold">10 <span className="text-sm font-medium">GB</span></div>
            </div>
          </div>
        }
      />

      <AgentRule 
        agentMode={agentMode}
        rule="Break preconceived component patterns"
        why="Dropdowns don't have to be a boring list of links. Tables don't have to be a rigid grid of text strings."
        doText="Break dropdowns into sections, use multiple columns, and add supporting text. Combine related table columns and introduce hierarchy into table rows."
        dontText="Do not design a table where every column contains exactly one unstyled string of text."
        check="If I made this dropdown wider, could I provide helpful descriptions for the actions?"
      />

    </div>
  );
}
