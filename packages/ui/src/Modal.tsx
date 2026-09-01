import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@vaultui/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** Body content. */
  children?: ReactNode;
  /** Footer actions (buttons). */
  footer?: ReactNode;
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Centered dialog with dimmed backdrop; ESC + backdrop close, scroll lock,
 * initial focus, a Tab focus trap, and focus restore to the trigger on close.
 */
export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        const focusable = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Land keyboard users inside the trap on open (first focusable, else the dialog).
    const focusable = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    (focusable ?? dialogRef.current)?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="vault-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={title ? titleId : undefined}
        className={cn("vault-modal__dialog", className)}
      >
        {title && (
          <div className="vault-modal__head">
            <div id={titleId} className="vault-modal__title">{title}</div>
            <button type="button" className="vault-modal__close" aria-label="Close dialog" onClick={onClose}>
              <XIcon />
            </button>
          </div>
        )}
        <div className="vault-modal__body">{children}</div>
        {footer && <div className="vault-modal__footer">{footer}</div>}
      </div>
    </>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}