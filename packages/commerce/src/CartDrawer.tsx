import { Badge, Button } from "@vault/ui";
import { cn } from "@vault/utils";
import { useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  emoji?: string;
}

export interface UpsellItem {
  id: string;
  name: string;
  price: number;
  emoji?: string;
}

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  /** Optional "complete your order" upsell banner. */
  upsell?: UpsellItem;
  onAddUpsell?: (item: UpsellItem) => void;
  currency?: string;
  className?: string;
}

/**
 * CartDrawer — slide-in cart with quantity steppers, removal,
 * a cross-sell upsell banner and subtotal. Mobile-first:
 * panel is full-width up to 384px, backdrops clicks / Escape close it,
 * and the page scroll is locked while open.
 */
export function CartDrawer({
  open,
  onClose,
  items,
  onQtyChange,
  onRemove,
  onCheckout,
  upsell,
  onAddUpsell,
  currency = "$",
  className,
}: CartDrawerProps) {
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  // Scroll lock + Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-50", className)} role="dialog" aria-modal="true" aria-label="Shopping cart">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 w-full bg-surface-950/40 backdrop-blur-[2px]"
      />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-0 shadow-popover animate-rise">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Your cart</h2>
            <Badge variant="brand" size="sm">
              {count} {count === 1 ? "item" : "items"}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" leadingIcon={<CloseIcon />} onClick={onClose} aria-label="Close cart">
            Close
          </Button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="text-4xl">🛒</span>
            <p className="text-sm text-surface-500">Your cart is empty.</p>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <ul className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 rounded-xl border border-surface-200 p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-100 text-xl">
                  {item.emoji ?? "🛍️"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-surface-400">
                    {currency}
                    {item.price.toFixed(2)} each
                  </p>
                  <div className="mt-1.5 inline-flex items-center rounded-lg border border-surface-200">
                    <QtyButton label="Decrease quantity" onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))}>
                      −
                    </QtyButton>
                    <span className="w-8 text-center text-sm font-semibold" aria-label="Quantity">
                      {item.qty}
                    </span>
                    <QtyButton label="Increase quantity" onClick={() => onQtyChange(item.id, item.qty + 1)}>
                      +
                    </QtyButton>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-semibold">
                    {currency}
                    {(item.price * item.qty).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="text-xs font-medium text-surface-400 underline-offset-2 hover:text-danger-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}

            {/* Upsell */}
            {upsell && (
              <li className="rounded-xl border border-brand-300 bg-brand-50 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-0 text-xl shadow-soft">
                    {upsell.emoji ?? "🎁"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Badge variant="brand" size="sm" dot>
                      Frequently bought
                    </Badge>
                    <p className="mt-1 truncate text-sm font-medium">{upsell.name}</p>
                    <p className="text-xs text-surface-500">
                      Add for {currency}
                      {upsell.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAddUpsell?.(upsell)}
                    aria-label={`Add ${upsell.name} to cart`}
                  >
                    Add
                  </Button>
                </div>
              </li>
            )}
          </ul>
        )}

        {/* Footer */}
        <div className="space-y-3 border-t border-surface-200 px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-500">Subtotal</span>
            <span className="text-base font-bold">
              {currency}
              {subtotal.toFixed(2)}
            </span>
          </div>
          <Button fullWidth size="lg" onClick={onCheckout} disabled={items.length === 0}>
            Checkout · {currency}
            {subtotal.toFixed(2)}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-xs font-medium text-surface-400 hover:text-surface-600"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}

function QtyButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center text-sm text-surface-600 transition-colors hover:bg-surface-100"
    >
      {children}
    </button>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5" aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}