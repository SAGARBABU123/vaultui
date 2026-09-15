import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionId } from '../../types';

interface PageNavigationProps {
  prevSection?: { id: SectionId; label: string };
  nextSection?: { id: SectionId; label: string };
  onSelect: (id: SectionId) => void;
}

export function PageNavigation({ prevSection, nextSection, onSelect }: PageNavigationProps) {
  if (!prevSection && !nextSection) return null;

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16 flex items-center justify-between border-t border-neutral-200 mt-16">
      {prevSection ? (
        <button
          onClick={() => onSelect(prevSection.id)}
          className="flex flex-col items-start hover:bg-neutral-50 px-4 py-3 rounded-lg transition-colors border border-transparent hover:border-neutral-200"
        >
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </span>
          <span className="text-primary-700 font-medium">{prevSection.label}</span>
        </button>
      ) : (
        <div />
      )}

      {nextSection ? (
        <button
          onClick={() => onSelect(nextSection.id)}
          className="flex flex-col items-end text-right hover:bg-neutral-50 px-4 py-3 rounded-lg transition-colors border border-transparent hover:border-neutral-200"
        >
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </span>
          <span className="text-primary-700 font-medium">{nextSection.label}</span>
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
