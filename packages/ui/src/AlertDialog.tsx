import type { ReactNode } from "react";
import { Modal } from "./Modal";

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Danger styling for destructive confirmations. Default true. */
  danger?: boolean;
  icon?: ReactNode;
}

/** Confirmation dialog built on Modal with a danger affordance. */
export function AlertDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  icon,
}: AlertDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button type="button" onClick={onClose} className="vault-btn vault-btn-ghost vault-btn-sm">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cnVariant(danger)}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <span className="vault-alert__icon" aria-hidden="true">
        {icon ?? <AlertIcon />}
      </span>
      {description && <p>{description}</p>}
    </Modal>
  );
}

function cnVariant(danger: boolean) {
  return `vault-btn vault-btn-sm ${danger ? "vault-btn-danger" : "vault-btn-primary"}`;
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}