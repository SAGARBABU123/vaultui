import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@vaultui/utils";

type ToastVariant = "default" | "success" | "error" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Auto-dismiss ms. Default 4000. */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

/**
 * Toast provider + viewport. Wrap once near the app root; call useToast().toast
 * from anywhere to push a notification. Styled via primitives.css.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer !== undefined) window.clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { ...options, id }].slice(-5));
      const timer = window.setTimeout(() => dismiss(id), options.duration ?? 4000);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div className="vault-toast-viewport" aria-live="polite">
          {toasts.map((t) => (
            <ToastCard key={t.id} item={t} onClose={() => dismiss(t.id)} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used within <ToastProvider>");
  return value;
}

/* -------------------------------- card ---------------------------------- */

function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const variant = item.variant ?? "default";
  return (
    <div className={cn("vault-toast", `vault-toast--${variant}`)}>
      <span className="vault-toast__icon" aria-hidden="true">
        {variant === "success" ? <CheckIcon /> : variant === "error" ? <ErrorIcon /> : variant === "info" ? <InfoIcon /> : <BellIcon />}
      </span>
      <div className="min-w-0">
        <p className="vault-toast__title">{item.title}</p>
        {item.description && <p className="vault-toast__desc">{item.description}</p>}
      </div>
      <button type="button" className="vault-toast__close" aria-label="Dismiss notification" onClick={onClose}>
        <XIcon />
      </button>
    </div>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-3.5" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 8v5M12 17h.01" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 8h.01M12 11v5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}