import { useMemo } from "react";
import { cn } from "@vaultui/utils";
import { CopyButton } from "./Controls";

export interface CodeBlockProps {
  code: string;
  /** Language hint for the header label. */
  language?: string;
  title?: string;
  /** Show the copy action. Default true. */
  copyable?: boolean;
  className?: string;
}

const KEYWORDS =
  /\b(import|from|export|const|let|var|function|return|if|else|for|while|new|type|interface|as|default|extends|async|await|class|true|false|null|undefined)\b/g;
const TYPES = /\b(string|number|boolean|ReactNode|void|Record|Map|Set|Promise|Array|Date)\b/g;
const STRINGS = /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)/g;
const COMMENTS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
const NUMBERS = /\b\d+(?:\.\d+)?\b/g;

/** Lightweight JS/TS/TSX/JSON highlighter — keyword/string/comment/number spans, no deps. */
function highlight(code: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let rest = code;
  let key = 0;

  while (rest.length > 0) {
    COMMENTS.lastIndex = 0;
    STRINGS.lastIndex = 0;
    const comment = COMMENTS.exec(rest);
    const str = STRINGS.exec(rest);

    let pick: RegExpExecArray | null = null;
    let kind: "com" | "str" | null = null;
    if (comment && str) pick = comment.index <= str.index ? comment : str;
    else pick = comment ?? str;
    if (pick) kind = pick === comment ? "com" : "str";

    if (pick) {
      if (pick.index > 0) nodes.push(rest.slice(0, pick.index));
      nodes.push(
        <span key={key++} className={kind === "com" ? "tok-com" : "tok-str"}>
          {pick[0]}
        </span>,
      );
      rest = rest.slice(pick.index + pick[0].length);
      continue;
    }

    const word = /^[\w$]+/.exec(rest);
    if (word) {
      const w = word[0];
      if (KEYWORDS.test(w)) nodes.push(<span key={key++} className="tok-kw">{w}</span>);
      else if (TYPES.test(w)) nodes.push(<span key={key++} className="tok-attr">{w}</span>);
      else nodes.push(w);
      KEYWORDS.lastIndex = 0;
      TYPES.lastIndex = 0;
      rest = rest.slice(w.length);
      continue;
    }

    const num = NUMBERS.exec(rest);
    if (num && num.index === 0) {
      nodes.push(<span key={key++} className="tok-num">{num[0]}</span>);
      rest = rest.slice(num[0].length);
      continue;
    }

    const ch = rest[0]!;
    nodes.push(
      <span key={key++} className={/[<>/{}()[\]=:;,.!?&|+\-*]/.test(ch) ? "tok-punc" : undefined}>
        {ch}
      </span>,
    );
    rest = rest.slice(1);
  }

  return nodes;
}

export function CodeBlock({ code, language, title, copyable = true, className }: CodeBlockProps) {
  const nodes = useMemo(() => highlight(code), [code]);

  return (
    <div className={cn("vault-code", className)}>
      <div className="vault-code__head">
        <span className="truncate">{title ?? (language ? `code.${language}` : "code")}</span>
        {copyable && <CopyButton value={code} label="Copy code" />}
      </div>
      <pre>
        <code>{nodes}</code>
      </pre>
    </div>
  );
}