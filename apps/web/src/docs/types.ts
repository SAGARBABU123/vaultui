import type { ReactNode } from "react";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentEntry {
  id: string;
  name: string;
  /** npm package the component lives in. */
  package: string;
  tier: "free" | "paid";
  description: string;
  /** exported symbol(s) to import. */
  importName: string;
  /** JSX usage snippet. */
  usage: string;
  props: PropDef[];
  demo: ReactNode;
}

export interface ComponentGroup {
  group: string;
  items: ComponentEntry[];
}