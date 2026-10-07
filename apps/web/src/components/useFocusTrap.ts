import { useEffect, useRef } from "react";

/**
 * Trap keyboard focus inside a dialog-ish container while `active`, then
 * restore focus to whatever was focused before. Adds Escape-to-close and
 * cycles Tab / Shift+Tab within the container. Used by the ⌘K palette and
 * the mobile nav drawer.
 *
 * `autoFocus: false` skips the initial “focus first element” pass — useful
 * when the dialog already autofocuses a specific control (e.g. the search
 * input).
 *
 * `onClose` is held in a ref so an inline callback (the common case) does
 * NOT re-run the trap effect on every render — which would otherwise bounce
 * focus back to the opener on each keystroke.
 */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function useFocusTrap<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  active: boolean,
  onClose?: () => void,
  options: { autoFocus?: boolean } = {},
) {
  const { autoFocus = true } = options;

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      const els = node?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (els && els.length > 0) els[0]!.focus();
      else node?.focus();
    };
    const raf = autoFocus ? requestAnimationFrame(focusFirst) : 0;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !node) return;

      const focusables = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const current = document.activeElement;

      if (e.shiftKey && (current === first || !node.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [active, ref, autoFocus]);
}
