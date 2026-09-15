import React from 'react';
import { cn } from '../../lib/utils';
import { Search, TerminalSquare, LayoutTemplate, Menu } from 'lucide-react';

interface HeaderProps {
  agentMode: boolean;
  onToggleAgentMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar?: () => void;
  className?: string;
}

export function Header({ agentMode, onToggleAgentMode, searchQuery, onSearchChange, onToggleSidebar, className }: HeaderProps) {
  return (
    <header className={cn("h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-10", className)}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-md hover:bg-neutral-100 md:hidden text-neutral-600"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 max-w-md relative hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search principles..."
            className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg leading-5 bg-neutral-50 placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6">
        <button
          onClick={onToggleAgentMode}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            agentMode 
              ? "bg-primary-100 text-primary-800 ring-2 ring-primary-500 ring-offset-2" 
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
          )}
        >
          {agentMode ? <TerminalSquare className="w-4 h-4" /> : <LayoutTemplate className="w-4 h-4" />}
          <span className="hidden sm:inline">{agentMode ? 'Agent Mode Active' : 'Agent Mode'}</span>
        </button>
      </div>
    </header>
  );
}
