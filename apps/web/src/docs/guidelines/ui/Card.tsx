import type { ReactNode } from "react";
import { cn } from "@vaultui/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white border border-surface-200 rounded-xl overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 py-5 border-b border-surface-100", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4 bg-surface-50 border-t border-surface-100", className)}>{children}</div>;
}
