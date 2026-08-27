import { cn } from "@vault/utils";
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
        <span className="text-[11px] font-medium uppercase tracking-wide text-surface-400">
          {language ?? "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
            copied
              ? "bg-success-500/20 text-success-400"
              : "text-surface-400 hover:bg-surface-800 hover:text-surface-200",
          )}
        >
          {copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed text-surface-200">
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

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h9.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H8.5A1.5 1.5 0 017 17.5v-9A1.5 1.5 0 018.5 7H7zm0 0V4.5A1.5 1.5 0 018.5 3H16a1.5 1.5 0 011.5 1.5V16" transform="translate(-1 -1)" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}