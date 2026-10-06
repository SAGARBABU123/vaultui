import { useId } from "react";

/**
 * Vault UI — brand mark.
 *
 * A soft token-tile (squircle) with a rounded "V" carved in white — the
 * vault door + the token engine + the product name in one restrained mark.
 * Gradient matches the brand tokens (brand-500 → brand-700, 135°); `mono`
 * renders a single-colour variant (inherits text colour) for docs/badges.
 */

export interface VaultLogoProps {
  /** Mark size in px. Default 32. */
  size?: number;
  /** Single-colour mark (no gradient) — inherits currentColor. */
  mono?: boolean;
  /** Wordmark text beside the mark. */
  wordmark?: boolean;
  className?: string;
}

export function VaultLogo({ size = 32, mono = false, wordmark = false, className = "" }: VaultLogoProps) {
  const uid = useId().replace(/[:]/g, "");
  const gradId = `vault-logo-grad-${uid}`;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="Vault UI"
        className="shrink-0"
        {...(mono ? { fill: "currentColor" } : {})}
      >
        {!mono && (
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6f7bf2" />
              <stop offset="55%" stopColor="#5b66e8" />
              <stop offset="100%" stopColor="#4a53c9" />
            </linearGradient>
          </defs>
        )}
        {/* Token tile */}
        <rect x="4" y="4" width="56" height="56" rx="16" fill={mono ? "currentColor" : `url(#${gradId})`} />
        {/* Rounded V */}
        <path
          d="M 23 24 L 32 41 L 41 24"
          fill="none"
          stroke={mono ? "var(--color-surface-0, #f3f6fb)" : "#ffffff"}
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {wordmark && (
        <span className="whitespace-nowrap text-base font-semibold leading-none tracking-tight text-surface-900">
          Vault&nbsp;UI
        </span>
      )}
    </span>
  );
}