import { cn } from "@vaultui/utils";
import { MessageSquare, PencilLine, PlusCircle, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export type ActivityType = "create" | "edit" | "comment" | "delete";

export interface ActivityEvent {
  id: string;
  actor: string;
  actorColor?: string;
  type: ActivityType;
  /** "{actor} {verb} {target}" — rendered after the actor name. */
  action: string;
  target: string;
  time: string;
  unread?: boolean;
}

export interface ActivityFeedProps {
  events: ActivityEvent[];
  className?: string;
}

const typeMeta: Record<ActivityType, { icon: React.ReactNode; color: string; label: string }> = {
  create: { icon: <PlusCircle className="size-3.5" />, color: "bg-success-500/10 text-success-500", label: "created" },
  edit: { icon: <PencilLine className="size-3.5" />, color: "bg-info-500/10 text-info-500", label: "edited" },
  comment: { icon: <MessageSquare className="size-3.5" />, color: "bg-brand-100 text-brand-700", label: "commented on" },
  delete: { icon: <Trash2 className="size-3.5" />, color: "bg-danger-500/10 text-danger-500", label: "deleted" },
};

const FILTERS: (ActivityType | "all")[] = ["all", "create", "edit", "comment", "delete"];

/**
 * ActivityFeed — chronological collaboration feed with type icons,
 * unread state, filter chips and mark-all-read.
 */
export function ActivityFeed({ events: initial, className }: ActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>(initial);
  const [filter, setFilter] = useState<ActivityType | "all">("all");

  const unread = useMemo(() => events.filter((e) => e.unread).length, [events]);
  const shown = filter === "all" ? events : events.filter((e) => e.type === filter);

  const markAllRead = () => setEvents((ev) => ev.map((e) => ({ ...e, unread: false })));

  return (
    <div className={cn("rounded-2xl border-0 bg-surface-0 shadow-soft", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Activity</h3>
          {unread > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button type="button" onClick={markAllRead} className="text-xs font-medium text-brand-600 hover:text-brand-700">
            Mark all read
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1 border-b border-surface-100 px-4 py-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors",
              filter === f ? "bg-brand-600 text-white" : "bg-surface-100 text-surface-500 hover:bg-surface-200",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="max-h-80 divide-y divide-surface-100 overflow-y-auto px-2 py-1">
        {shown.length === 0 && <li className="px-4 py-8 text-center text-sm text-surface-400">No {filter} activity.</li>}
        {shown.map((e) => {
          const meta = typeMeta[e.type];
          return (
            <li key={e.id} className={cn("flex items-start gap-3 px-2 py-2.5", e.unread && "bg-brand-50/40")}>
              <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full", meta.color)}>
                {meta.icon}
              </span>
              <span className="min-w-0 flex-1 text-sm leading-relaxed text-surface-600">
                <span className="font-semibold text-surface-800">{e.actor}</span> {meta.label}{" "}
                <span className="font-medium text-surface-700">{e.target}</span>{" "}
                <span className="text-xs text-surface-400">{e.time}</span>
              </span>
              {e.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}