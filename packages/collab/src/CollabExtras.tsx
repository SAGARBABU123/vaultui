import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@vaultui/utils";

/* ============================== CommentsThread ============================ */

export interface ThreadComment {
  author: string;
  body: string;
  time?: string;
  src?: string;
}

export interface CommentsThreadProps {
  comments: ThreadComment[];
  placeholder?: string;
  onPost?: (body: string) => void;
  className?: string;
}

// Theme-aware avatar palette — reads the active theme's CSS variables so
// avatars re-skin across all four themes instead of hardcoding hex.
const AVATAR_COLORS = [
  "var(--color-brand-600, #5b66e8)",
  "var(--color-success-500, #2fbf7f)",
  "var(--color-warning-500, #e8a93d)",
  "var(--color-info-500, #5aa7e2)",
  "var(--color-danger-500, #e56b7a)",
];

function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export function CommentsThread({ comments, placeholder = "Add a comment…", onPost, className }: CommentsThreadProps) {
  const [draft, setDraft] = useState("");
  const [list, setList] = useState(comments);
  const post = () => {
    const body = draft.trim();
    if (!body) return;
    setList((prev) => [{ author: "You", body, time: "just now" }, ...prev]);
    setDraft("");
    onPost?.(body);
  };
  return (
    <div className={cn("space-y-3", className)}>
      <ul className="space-y-3">
        {list.map((c, i) => (
          <li key={i} className="flex gap-2.5">
            {c.src ? (
              <img src={c.src} alt="" className="size-7 shrink-0 rounded-full object-cover" />
            ) : (
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
              >
                {initials(c.author)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm text-surface-700">
                <span className="font-semibold text-surface-900">{c.author}</span>
                {c.time && <span className="ml-2 text-xs text-surface-400">{c.time}</span>}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-surface-500">{c.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && post()}
          placeholder={placeholder}
          className="vault-input"
        />
        <button type="button" className="vault-btn vault-btn-primary vault-btn-sm" onClick={post}>Post</button>
      </div>
    </div>
  );
}

/* ============================== ReactionPicker ============================ */

export interface Reaction {
  emoji: string;
  label: string;
  count: number;
}

export interface ReactionPickerProps {
  reactions: Reaction[];
  onReact?: (label: string) => void;
  className?: string;
}

const REACTION_COLORS = [
  "var(--color-warning-500, #e8a93d)",
  "var(--color-info-500, #5aa7e2)",
  "var(--color-danger-500, #e56b7a)",
  "var(--color-success-500, #2fbf7f)",
  "var(--color-brand-400, #8b96f7)",
];

export function ReactionPicker({ reactions, onReact, className }: ReactionPickerProps) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {reactions.map((r, i) => {
        const active = picked === r.label;
        return (
          <button
            key={r.label}
            type="button"
            aria-pressed={active}
            onClick={() => {
              const next = active ? null : r.label;
              setPicked(next);
              onReact?.(r.label);
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
              active ? "border-brand-300 bg-brand-50" : "border-surface-200 bg-surface-0 hover:bg-surface-100",
            )}
            style={active ? { boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${REACTION_COLORS[i % REACTION_COLORS.length]} 20%, transparent)` } : undefined}
          >
            <span className="text-base">{r.emoji}</span>
            <span className="font-semibold" style={{ color: active ? REACTION_COLORS[i % REACTION_COLORS.length] : undefined }}>
              {r.count + (active ? 1 : 0)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ================================= Mentions =============================== */

export interface MentionOption {
  id: string;
  name: string;
}

export interface MentionsProps {
  people: MentionOption[];
  placeholder?: string;
  className?: string;
}

/** @-mention input — type @, filter the list, Enter to insert. */
export function Mentions({ people, placeholder = "At-mention a teammate…", className }: MentionsProps) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);

  const matches = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return people;
    return people.filter((p) => p.name.toLowerCase().includes(q));
  }, [people, query]);

  const insert = (p: MentionOption) => {
    // Replace the trailing "@query" token with @Name
    const at = text.lastIndexOf("@");
    setText(at >= 0 ? `${text.slice(0, at)}@${p.name} ` : `${text} @${p.name} `);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <input
        value={text}
        onChange={(e) => {
          const v = e.target.value;
          setText(v);
          const at = v.lastIndexOf("@");
          setOpen(at >= 0);
          setQuery(at >= 0 ? v.slice(at + 1) : "");
          setIdx(0);
        }}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setIdx((i) => Math.min(i + 1, Math.max(0, matches.length - 1)));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setIdx((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && matches[idx]) {
            e.preventDefault();
            insert(matches[idx]!);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder={placeholder}
        className="vault-input"
      />
      {open && (
        <div className="vault-combobox__pop">
          {matches.length === 0 ? (
            <p className="vault-combobox__empty">No one matches “{query}”.</p>
          ) : (
            matches.map((p, i) => (
              <button key={p.id} type="button" data-focused={i === idx} onMouseEnter={() => setIdx(i)} onClick={() => insert(p)} className="vault-combobox__option">
                <span className="flex size-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{initials(p.name)}</span>
                <span className="text-sm">{p.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}