/** A citation a chat answer references back to a source document. */
export interface SourceCitationItem {
  id: string;
  /** 1-based footnote number shown on the chip. */
  index: number;
  title: string;
  domain?: string;
}

/** A single tool/function call an agent made. */
export interface ToolCall {
  id?: string;
  name: string;
  args?: unknown;
  result?: unknown;
  status?: "running" | "success" | "error";
}

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  /** Markdown text (assistant) or plain text (user/system). */
  content?: string;
  /** Tool calls attached to an assistant message — rendered as collapsible inspectors. */
  toolCalls?: ToolCall[];
  /** RAG citations rendered as clickable chips under the message. */
  sources?: SourceCitationItem[];
  /** When true, `content` is revealed token-by-token via TokenStreamer. */
  streaming?: boolean;
  /** Renders the message in an error state. */
  error?: boolean;
}

export interface ModelOption {
  id: string;
  label: string;
  /** e.g. "128k context" — shown as secondary text. */
  context?: string;
  /** Optional highlight, e.g. "Fast" | "Best". */
  badge?: string;
}