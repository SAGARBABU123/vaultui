import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { SectionId } from '../../types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentSection: SectionId;
  onSelect: (id: SectionId) => void;
  className?: string;
  agentMode?: boolean;
  isOpen?: boolean;
  searchQuery?: string;
}

export interface NavGroup {
  title: string;
  items: { id: SectionId; label: string }[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Introduction',
    items: [
      { id: 'overview', label: 'Overview & Purpose' },
      { id: 'starting', label: 'Starting from Scratch' },
      { id: 'design-tokens', label: 'Design Tokens' },
    ]
  },
  {
    title: 'Layout & Hierarchy',
    items: [
      { id: 'hierarchy', label: 'Hierarchy is Everything' },
      { id: 'spacing', label: 'Layout & Spacing' },
      { id: 'responsive', label: 'Responsive Adaptations' },
    ]
  },
  {
    title: 'Typography',
    items: [
      { id: 'typography', label: 'Typography System' },
      { id: 'copywriting', label: 'Copywriting & Text Wrap' },
    ]
  },
  {
    title: 'Color & Depth',
    items: [
      { id: 'color', label: 'Color System' },
      { id: 'dark-mode', label: 'Dark Mode Architecture' },
      { id: 'depth', label: 'Depth & Elevation' },
    ]
  },
  {
    title: 'Components',
    items: [
      { id: 'components', label: 'Component Design' },
      { id: 'cards-anatomy', label: 'Cards Anatomy' },
      { id: 'component-states', label: 'Component States' },
      { id: 'forms-dashboards', label: 'Forms & Dashboards' },
      { id: 'form-validation', label: 'Form Validation' },
      { id: 'inputs-controls', label: 'Radios & Checkboxes' },
      { id: 'data-tables', label: 'Data Tables' },
      { id: 'navigation', label: 'Navigation Active States' },
      { id: 'tabs', label: 'Tabs & Segmented' },
      { id: 'dropdowns', label: 'Dropdowns & Popovers' },
      { id: 'modals', label: 'Modals & Overlays' },
      { id: 'accordions', label: 'Accordions' },
      { id: 'toasts', label: 'Toasts & Snackbars' },
      { id: 'tooltips', label: 'Tooltips' },
      { id: 'badges', label: 'Badges & Tags' },
    ]
  },
  {
    title: 'Advanced Components',
    items: [
      { id: 'advanced-inputs', label: 'Advanced Inputs (Uploads, Tags)' },
      { id: 'complex-data', label: 'Complex Data (Timelines, Kanban)' },
      { id: 'advanced-overlays', label: 'Overlays (Drawers, Cmd+K)' },
      { id: 'feedback-indicators', label: 'Feedback & Inline Alerts' },
    ]
  },
  {
    title: 'Specialized Patterns',
    items: [
      { id: 'breadcrumbs', label: 'Breadcrumbs' },
      { id: 'otp-inputs', label: 'OTP & PIN Inputs' },
      { id: 'hover-cards', label: 'Hover Cards (Previews)' },
      { id: 'sliders', label: 'Sliders (Range Selectors)' },
      { id: 'carousels', label: 'Carousels' },
    ]
  },
  {
    title: 'Polish & Feedback',
    items: [
      { id: 'images', label: 'Working with Images' },
      { id: 'iconography', label: 'Iconography' },
      { id: 'borders', label: 'Borders & Polish' },
      { id: 'motion', label: 'Meaningful Motion' },
      { id: 'empty-states', label: 'Empty States' },
      { id: 'loading-states', label: 'Loading & Skeletons' },
    ]
  },
  {
    title: 'Review & Tools',
    items: [
      { id: 'do-dont', label: 'DO / DON\'T Library' },
      { id: 'checklist', label: 'UI Quality Checker' },
    ]
  }
];

export function Sidebar({ currentSection, onSelect, className, agentMode, isOpen = true, searchQuery = '' }: SidebarProps) {
  // Accordion state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Auto-expand the group that contains the current section when currentSection changes
  useEffect(() => {
    const activeGroup = NAV_GROUPS.find(group => 
      group.items.some(item => item.id === currentSection)
    );
    if (activeGroup) {
      setExpanded(prev => ({ ...prev, [activeGroup.title]: true }));
    }
  }, [currentSection]);

  const toggleGroup = (title: string) => {
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }));
  };

  // Filter groups based on search query
  const filteredGroups = NAV_GROUPS.map(group => {
    if (!searchQuery) return group;
    const lowerQuery = searchQuery.toLowerCase();
    const filteredItems = group.items.filter(item => 
      item.label.toLowerCase().includes(lowerQuery) || 
      item.id.toLowerCase().includes(lowerQuery)
    );
    return { ...group, items: filteredItems };
  }).filter(group => group.items.length > 0);

  return (
    <aside className={cn(
      "flex-shrink-0 flex flex-col h-full border-r border-neutral-200 bg-neutral-50/50 transition-all duration-300 overflow-hidden",
      isOpen ? "w-64" : "w-0 border-r-0 md:w-64 md:border-r",
      className
    )}>
      <div className="p-6 w-64 shrink-0">
        <h1 className="font-display text-xl font-semibold tracking-tight text-neutral-900">
          AI UI Reference
        </h1>
        {agentMode && (
          <div className="mt-2 text-xs font-mono text-primary-600 bg-primary-50 inline-block px-2 py-1 rounded">
            AGENT_MODE_ACTIVE
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-8 w-64 shrink-0">
        {filteredGroups.length === 0 && (
          <div className="text-sm text-neutral-500 px-2 py-4">No sections found for "{searchQuery}"</div>
        )}
        {filteredGroups.map((group, idx) => {
          // If searching, we auto-expand all matched groups. Otherwise use accordion state.
          const isGroupExpanded = searchQuery ? true : expanded[group.title];

          return (
            <div key={idx} className="mb-2">
              <button 
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-2 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <span>{group.title}</span>
                {isGroupExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              
              {isGroupExpanded && (
                <ul className="space-y-0.5 mt-1 ml-2 border-l border-neutral-200 pl-2">
                  {group.items.map(item => {
                    const isActive = currentSection === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => onSelect(item.id)}
                          className={cn(
                            "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors duration-150",
                            isActive 
                              ? "bg-primary-50 text-primary-700 font-medium" 
                              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                          )}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
