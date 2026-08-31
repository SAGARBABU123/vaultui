import { useEffect, type ReactNode } from "react";
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

/** Centered dialog with dimmed backdrop; ESC + backdrop close, scroll lock. */
export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="vault-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        className={cn("vault-modal__dialog", className)}
      >
        {(title || true) && (
          <div className="vault-modal__head">
            <div className="vault-modal__title">{title}</div>
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