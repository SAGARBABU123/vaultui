import type { ReactNode } from "react";
import { cn } from "@vaultui/utils";

export interface AvatarProps {
  /** Display name — initials derive from it when no image. */
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Initials avatar with optional image; size scales text with the box. */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className={cn("vault-avatar", `vault-avatar--${size}`, className)} title={name}>
      {src ? <img src={src} alt={name} /> : initials}
    </span>
  );
}

export interface AvatarGroupProps {
  avatars: Array<{ name: string; src?: string }>;
  size?: AvatarProps["size"];
  /** How many to show before collapsing into a +N tile. Default Infinity. */
  max?: number;
  className?: string;
}

export function AvatarGroup({ avatars, size = "md", max = Infinity, className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;
  return (
    <div className={cn("vault-avatar-group", className)}>
      {visible.map((a) => (
        <Avatar key={a.name} name={a.name} src={a.src} size={size} />
      ))}
      {overflow > 0 && (
        <Avatar name={`+${overflow}`} size={size} className="vault-avatar--more" />
      )}
    </div>
  );
}