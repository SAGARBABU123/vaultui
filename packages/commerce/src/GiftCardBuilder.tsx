import { Badge, Button } from "@vaultui/ui";
import { cn } from "@vaultui/utils";
import { useState } from "react";

export interface GiftCardConfig {
  amount: number;
  theme: string;
  message: string;
  recipient?: string;
  from?: string;
}

export interface GiftCardBuilderProps {
  onAddToCart?: (config: GiftCardConfig) => void;
  currency?: string;
  className?: string;
}

const AMOUNTS = [25, 50, 100, 200];

const THEMES = [
  { id: "brand", label: "Vault", preview: "from-brand-500 to-brand-700" },
  { id: "sunset", label: "Sunset", preview: "from-orange-400 to-pink-600" },
  { id: "forest", label: "Forest", preview: "from-emerald-400 to-teal-700" },
  { id: "midnight", label: "Midnight", preview: "from-slate-800 to-surface-950" },
] as const;

/**
 * GiftCardBuilder — live-updating gift card editor: amount, theme,
 * message, recipient. Zero backend: returns the config via onAddToCart.
 */
export function GiftCardBuilder({ onAddToCart, currency = "$", className }: GiftCardBuilderProps) {
  const [amount, setAmount] = useState(50);
  const [theme, setTheme] = useState<(typeof THEMES)[number]["id"]>("brand");
  const [message, setMessage] = useState("Happy building! Here's a treat for your next project. 🚀");
  const [recipient, setRecipient] = useState("");
  const [added, setAdded] = useState(false);

  const activeTheme = THEMES.find((t) => t.id === theme) ?? THEMES[0]!;

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1fr_1fr]", className)}>
      {/* Editor */}
      <div className="space-y-4">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Amount</legend>
          <div className="grid grid-cols-4 gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={amount === a}
                onClick={() => setAmount(a)}
                className={cn(
                  "rounded-lg border py-2 text-sm font-semibold transition-colors",
                  amount === a
                    ? "border-brand-400 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20"
                    : "border-surface-200 bg-surface-0 text-surface-600 hover:border-brand-300",
                )}
              >
                {currency}
                {a}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Theme</legend>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={theme === t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                  theme === t.id
                    ? "border-brand-400 bg-brand-50 ring-2 ring-brand-500/20"
                    : "border-surface-200 bg-surface-0 hover:border-brand-300",
                )}
              >
                <span className={cn("size-4 rounded-full bg-gradient-to-br", t.preview)} />
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={160}
            className="w-full resize-none rounded-lg border border-surface-200 bg-surface-0 p-3 text-sm outline-none focus:border-brand-400"
          />
          <span className="mt-1 block text-right text-xs text-surface-400">{message.length}/160</span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Recipient email</span>
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="friend@example.com"
            className="h-10 w-full rounded-xl border-0 bg-surface-100 shadow-inset px-3 text-sm outline-none placeholder:text-surface-400 focus:border-brand-400"
          />
        </label>

        <Button
          fullWidth
          size="lg"
          onClick={() => {
            onAddToCart?.({ amount, theme, message, recipient });
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1600);
          }}
        >
          {added ? "Added ✓" : `Add ${currency}${amount} gift card to cart`}
        </Button>
      </div>

      {/* Preview */}
      <div className="flex flex-col items-center justify-center rounded-2xl border-0 bg-surface-100 shadow-inset p-4">
        <div
          className={cn(
            "relative aspect-[16/10] w-full max-w-72 overflow-hidden rounded-xl bg-gradient-to-br p-5 text-white shadow-raised",
            activeTheme.preview,
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold tracking-wide">VAULT UI</span>
            <Badge variant="neutral" size="sm" className="bg-white/20 font-semibold text-white">
              Gift card
            </Badge>
          </div>
          <div className="absolute inset-x-5 bottom-5">
            <p className="text-3xl font-bold tracking-tight">
              {currency}
              {amount}
            </p>
            <p className="mt-2 line-clamp-2 text-xs opacity-90">{message}</p>
            <p className="mt-2 text-xs opacity-70">
              {recipient ? `To: ${recipient}` : "To: a smart teammate"} · from Vault UI
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-surface-400">Preview updates as you edit.</p>
      </div>
    </div>
  );
}