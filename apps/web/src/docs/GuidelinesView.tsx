import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GUIDELINE_GROUPS, GUIDELINE_NAV, GUIDELINE_VIEWS, type GuidelineItem } from "./guidelines";
import { GuidelineToc } from "./GuidelineToc";

/**
 * A single guidelines page: the section content (Rule → Why → Do / Don't →
 * Agent Check + visual comparisons) plus a prev/next spine in the reference's
 * "PageNavigation" style — uppercase tracking-widest labels, branded title.
 */
export function GuidelinesView({
  item,
  onNavigate,
}: {
  item: GuidelineItem;
  onNavigate: (id: string) => void;
}) {
  const articleRef = useRef<HTMLElement>(null);

  const View = GUIDELINE_VIEWS[item.id];
  if (!View) return null;

  const idx = GUIDELINE_NAV.findIndex((i) => i.id === item.id);
  const prev = idx > 0 ? GUIDELINE_NAV[idx - 1] : null;
  const next = idx >= 0 && idx < GUIDELINE_NAV.length - 1 ? GUIDELINE_NAV[idx + 1] : null;

  const activeGroup = GUIDELINE_GROUPS.find((g) => g.items.some((i) => i.id === item.id));

  return (
    <div className="mx-auto grid w-full max-w-6xl xl:grid-cols-[minmax(0,1fr)_236px] xl:gap-10">
      <article ref={articleRef} key={item.id} className="min-w-0 animate-rise">
      {/* Eyebrow — which part of the guide this is */}
      <div className="mx-auto mb-2 max-w-4xl pt-2">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
          <span aria-hidden="true" className="h-px w-6 bg-brand-300" />
          UI Guidelines{activeGroup ? ` · ${activeGroup.title}` : ""}
        </p>
      </div>

      <View agentMode={false} />

      {/* Prev / next spine */}
      <div className="mx-auto mt-4 flex max-w-4xl items-center justify-between gap-3 border-t border-surface-200 pb-16 pt-8">
        {prev ? (
          <button
            type="button"
            onClick={() => onNavigate(prev.id)}
            className="group flex max-w-[45%] flex-col items-start rounded-xl border border-transparent px-4 py-3 text-left transition-colors hover:border-surface-200 hover:bg-surface-100/70"
          >
            <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-surface-400">
              <ChevronLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              Previous
            </span>
            <span className="truncate font-medium text-brand-700">{prev.label}</span>
          </button>
        ) : (
          <span />
        )}

        {next ? (
          <button
            type="button"
            onClick={() => onNavigate(next.id)}
            className="group flex max-w-[45%] flex-col items-end rounded-xl border border-transparent px-4 py-3 text-right transition-colors hover:border-surface-200 hover:bg-surface-100/70"
          >
            <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-surface-400">
              Next
              <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="truncate font-medium text-brand-700">{next.label}</span>
          </button>
        ) : (
          <span />
        )}
      </div>
      </article>

      {/* Right rail — uses the gutter, never stretches the article */}
      <GuidelineToc containerRef={articleRef} />
    </div>
  );
}