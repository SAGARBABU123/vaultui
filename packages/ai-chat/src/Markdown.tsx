import { cn } from "@vaultui/utils";
import { Check, Copy } from "lucide-react";
import { Children, isValidElement, useState, type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ------------------------------- CodeBlock ------------------------------- */

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return extractText(node.props?.children);
  return "";
}

function CodeBlock({ language, code }: { language?: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-surface-800 bg-surface-950 shadow-soft">
      <div className="flex items-center justify-between gap-2 border-b border-surface-800 bg-surface-900 px-3 py-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-surface-400">
          {language ?? "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
          className={cn(
            "inline-flex items-center rounded-md p-1.5 transition-colors",
            copied
              ? "bg-success-500/20 text-success-400"
              : "text-surface-400 hover:bg-surface-800 hover:text-surface-200",
          )}
        >
          {copied ? <Check className="size-3.5" strokeWidth={2.5} /> : <Copy className="size-3.5" strokeWidth={2.5} />}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-sm leading-relaxed text-surface-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ---------------------------- Markdown renderer --------------------------- */

const components = {
  h1: (props: { children?: ReactNode }) => (
    <h1 className="mb-2 mt-4 text-lg font-semibold first:mt-0" {...props} />
  ),
  h2: (props: { children?: ReactNode }) => (
    <h2 className="mb-2 mt-4 text-base font-semibold first:mt-0" {...props} />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className="mb-1 mt-3 text-sm font-semibold first:mt-0" {...props} />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="my-1.5 leading-relaxed first:mt-0 last:mb-0" {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="my-1.5 list-disc space-y-0.5 pl-5" {...props} />
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol className="my-1.5 list-decimal space-y-0.5 pl-5" {...props} />
  ),
  li: (props: { children?: ReactNode }) => <li className="leading-relaxed" {...props} />,
  strong: (props: { children?: ReactNode }) => (
    <strong className="font-semibold" {...props} />
  ),
  a: (props: { children?: ReactNode; href?: string }) => (
    <a
      className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  pre: (preProps: { children?: ReactNode }) => {
    const child = Children.toArray(preProps.children)[0] as
      | ReactElement<{ className?: string; children?: ReactNode }>
      | undefined;
    const className = child?.props?.className ?? "";
    const language = /language-([\w-]+)/.exec(className)?.[1];
    const code = extractText(child?.props?.children);
    return <CodeBlock language={language} code={code} />;
  },
  code: (codeProps: { className?: string; children?: ReactNode }) => {
    const { className, children } = codeProps;
    // Block code is handled by `pre` above — skip it there.
    if (className?.includes("language-")) return <>{children}</>;
    return (
      <code className="rounded-md bg-surface-100 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-700">
        {children}
      </code>
    );
  },
};

export interface MarkdownProps {
  children: string;
  className?: string;
}

/**
 * Markdown renderer for assistant messages — GitHub-flavored markdown
 * with copy-to-clipboard code blocks, styled entirely by tokens.
 */
export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn("text-sm text-surface-800", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

/* --------------------------------- icons --------------------------------- */

