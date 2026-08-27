import { cn } from "@gudipudimani/utils";
import { useState } from "react";

export interface PresenceUser {
  id: string;
  name: string;
  /** Avatar background token class. */
  color: string;
  status: "online" | "idle" | "offline";
  activity?: string;
}

export interface PresenceListProps {
  users: PresenceUser[];
  /** 'stack' clusters avatars on phones; 'list' shows full rows. */
  mode?: "auto" | "stack" | "list";
  className?: string;
}

const statusDot: Record<PresenceUser["status"], string> = {
  online: "bg-success-500",
  idle: "bg-warning-500",
  offline: "bg-surface-300",
};

const statusLabel: Record<PresenceUser["status"], string> = {
  online: "Online",
  idle: "Idle",
  offline: "Offline",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * PresenceList — who's here, in one glance. Avatar stack with
 * overflow count + idle badge on desktop; switch to full rows
 * (with activity) via `mode="list"`.
 */
export function PresenceList({ users, mode = "auto", className }: PresenceListProps) {
  const [full, setFull] = useState(mode === "list");
  const showStack = !full;
  const visible = users.slice(0, 4);
  const overflow = users.length - visible.length;
  const online = users.filter((u) => u.status === "online").length;

  return (
    <div className={cn("rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-soft", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success-500 animate-pulse-ring" />
            <span className="relative inline-flex size-2 rounded-full bg-success-500" />
          </span>
          <h3 className="text-sm font-semibold">Live now</h3>
          <span className="text-xs text-surface-400">{online} online</span>
        </div>
        <button
          type="button"
          onClick={() => setFull((f) => !f)}
          className="rounded-md px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50 hover:text-brand-700"
        >
          {full ? "Stack view" : "List view"}
        </button>
      </div>

      {/* Stack */}
      {showStack && (
        <div className="mt-3 flex items-center">
          <div className="flex -space-x-2">
            {visible.map((u) => (
              <span
                key={u.id}
                title={`${u.name} · ${statusLabel[u.status]}`}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border-2 border-surface-0 text-xs font-bold text-white",
                  u.color,
                )}
              >
                {initials(u.name)}
              </span>
            ))}
            {overflow > 0 && (
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-surface-0 bg-surface-200 text-xs font-bold text-surface-600">
                +{overflow}
              </span>
            )}
          </div>
          <span className="ml-3 text-xs text-surface-400">{users.length} collaborators</span>
        </div>
      )}

      {/* List */}
      {full && (
        <ul className="mt-3 space-y-1">
          {users.map((u) => (
            <li key={u.id} className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-surface-50">
              <span className="relative">
                <span className={cn("flex size-8 items-center justify-center rounded-full text-[11px] font-bold text-white", u.color)}>
                  {initials(u.name)}
                </span>
                <span className={cn("absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface-0", statusDot[u.status])} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-surface-800">{u.name}</span>
                {u.activity && <span className="block truncate text-xs text-surface-400">{u.activity}</span>}
              </span>
              <span className={cn("text-[11px] font-medium", u.status === "online" ? "text-success-500" : u.status === "idle" ? "text-warning-500" : "text-surface-400")}>
                {statusLabel[u.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}