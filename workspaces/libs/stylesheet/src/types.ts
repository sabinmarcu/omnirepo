export type StylesheetDeclaration = string | number | null | {
  readonly value: string;
  readonly priority?: 'important';
};

export type StylesheetRuleSet<Selector extends string = string> = {
  readonly selector: Selector;
  readonly layer?: string;
  readonly rules?: Readonly<Record<string, StylesheetDeclaration>>;
};

export type StylesheetOptions = {
  /** Ownership key, unique within the attachment Document or ShadowRoot. */
  readonly id: string;
  /** Optional observable label for existing data-stylesheet consumers. */
  readonly debugId?: string;
  readonly nonce?: string;
  readonly rules?: readonly StylesheetRuleSet[];
};

export type StylesheetSnapshot = {
  readonly css: string;
  readonly html: string;
};

export type StylesheetChange = {
  readonly rules: readonly {
    readonly selector: string;
    readonly layer?: string;
    readonly properties: readonly string[];
  }[];
};

export type StylesheetState = {
  readonly id: string;
  readonly css: string;
  readonly raw: string;
  readonly debugId: string;
  readonly nonce: string | undefined;
  read(selector: string, property: string, layer?: string): string | undefined;
  readMany(
    selector: string,
    properties: readonly string[],
    layer?: string,
  ): Readonly<Record<string, string | undefined>>;
  update(rules: readonly StylesheetRuleSet[]): void;
  snapshot(nonce?: string): StylesheetSnapshot;
  /** Called once after a commit; read current state from the supplied owner. */
  subscribe(listener: (stylesheet: StylesheetState, change: StylesheetChange) => void): () => void;
};

export type BrowserStylesheet = StylesheetState & {
  readonly element: HTMLStyleElement;
};

export type Stylesheet = StylesheetState & {
  /** Adopt current SSR contents, or create an independently mutable allocation. */
  mount(root?: Document | ShadowRoot): BrowserStylesheet;
};
