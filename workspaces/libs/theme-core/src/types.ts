export type AssignmentScope = 'shared' | 'contextual';
export type CSSVariable<Prefix extends string = string, Name extends string = string> = `var(--${Prefix}-${Name})`;
export type Variants<Value> = { readonly light: Value; readonly dark: Value };
export type JsonValue = null | boolean | number | string
  | readonly JsonValue[] | { readonly [key: string]: JsonValue };
export type SourceRepresentation =
  | { readonly kind: 'number'; readonly unit?: string }
  | { readonly kind: 'string' }
  | { readonly kind: 'color' }
  | { readonly kind: 'json' };

export type SourceCodec<Value> = {
  encode(value: Value): string;
  decode(value: string): Value;
  /** Declarative metadata for standard codecs; unknown user codecs are intentionally omitted. */
  readonly representation?: SourceRepresentation;
};

export type PropertyRegistration = {
  readonly syntax: string;
  readonly inherits: boolean;
  readonly initialValue: string;
};

export type Source<Value = unknown, Defaulted extends boolean = boolean> = {
  readonly kind: 'source';
  readonly codec: SourceCodec<Value>;
  readonly hasDefault: Defaulted;
  readonly defaultCSS?: string;
  readonly registration?: PropertyRegistration;
};

export type VariantSource<Value = unknown, Defaulted extends boolean = boolean> = {
  readonly kind: 'variant-source';
  readonly codec: SourceCodec<Value>;
  readonly hasDefault: Defaulted;
  readonly defaultCSS?: Variants<string>;
  readonly registration?: PropertyRegistration;
};

export type SourceTree = Source | VariantSource | { readonly [key: string]: SourceTree };

export type Reference = {
  readonly kind: 'reference';
  readonly role: 'source' | 'token' | 'private';
  readonly owner: object;
  readonly path: readonly string[];
};

export type Expression = Reference | {
  readonly kind: 'property-name';
  readonly reference: Reference;
} | {
  readonly kind: 'expression';
  readonly parts: readonly (string | Expression)[];
} | {
  readonly kind: 'registered';
  readonly expression: Expression;
  readonly registration: PropertyRegistration;
};

export type TokenTree = Expression | { readonly [key: string]: TokenTree };
export type SourceReferences<Sources> = Sources extends Source | VariantSource
  ? Sources extends VariantSource ? Variants<Reference> : Reference
  : { readonly [Key in keyof Sources]: SourceReferences<Sources[Key]> };

export type GeneratedTokens = {
  readonly tokens: TokenTree;
  readonly privateTokens?: TokenTree;
};

export type VariableDescriptor<
  Sources extends SourceTree = SourceTree,
  Tokens extends TokenTree = TokenTree,
  Scope extends AssignmentScope = AssignmentScope,
> = {
  readonly kind: 'variable';
  readonly scope: Scope;
  readonly sources: Sources;
  readonly tokens: Tokens;
  readonly privateTokens?: TokenTree;
  readonly owner: object;
};

export type StaticDescriptor<Output = unknown> = {
  readonly kind: 'static';
  readonly output: Output;
};

export type ThemeSchema = {
  readonly [key: string]: VariableDescriptor | StaticDescriptor | ThemeSchema;
};

type ThemeDescriptor = VariableDescriptor | StaticDescriptor;
type CommonKeys<Left, Right> = Extract<keyof Left, keyof Right>;

/** Paths where an extension tries to replace an existing descriptor. */
export type OverlappingThemePaths<Base, Additions> = Base extends ThemeSchema
  ? Additions extends ThemeSchema ? {
    [Key in CommonKeys<Base, Additions>]: Base[Key] extends ThemeDescriptor ? Key
      : Additions[Key] extends ThemeDescriptor ? Key
        : OverlappingThemePaths<Base[Key], Additions[Key]> extends never ? never : Key;
  }[CommonKeys<Base, Additions>] : never : never;

/** Merges theme groups while retaining each original descriptor type. */
export type ExtendThemeSchema<Base extends ThemeSchema, Additions extends ThemeSchema> = {
  readonly [Key in keyof Base | keyof Additions]: Key extends keyof Base
    ? Key extends keyof Additions
      ? Base[Key] extends ThemeDescriptor ? Base[Key]
        : Additions[Key] extends ThemeDescriptor ? Additions[Key]
          : ExtendThemeSchema<Extract<Base[Key], ThemeSchema>, Extract<Additions[Key], ThemeSchema>>
      : Base[Key]
    : Key extends keyof Additions ? Additions[Key] : never;
};

export type ValidThemeExtension<Base extends ThemeSchema, Additions extends ThemeSchema> =
  ValidSchema<Additions> & (OverlappingThemePaths<Base, Additions> extends never ? unknown : never)
  & (Collisions<SchemaEntries<Base> | SchemaEntries<Additions>> extends never ? unknown : never);

type Join<Path extends string, Key extends string> = Path extends '' ? Key : `${Path}-${Key}`;
type TokenView<Tokens, Prefix extends string, Path extends string> = Tokens extends Expression
  ? CSSVariable<Prefix, Path>
  : { readonly [Key in keyof Tokens]: TokenView<Tokens[Key], Prefix, Join<Path, Key & string>> };

export type ThemeContract<Schema, Prefix extends string = 'theme', Path extends string = ''> =
  string extends keyof Schema ? Readonly<Record<string, unknown>> : {
    readonly [Key in keyof Schema]: Schema[Key] extends StaticDescriptor<infer Output>
      ? Output
      : Schema[Key] extends VariableDescriptor<SourceTree, infer Tokens>
        ? TokenView<Tokens, Prefix, Join<Path, Key & string>>
        : ThemeContract<Schema[Key], Prefix, Join<Path, Key & string>>;
  };

type VariableTree = { readonly [key: string]: CSSVariable | VariableTree };

export type VariableContract<Schema, Prefix extends string = 'theme', Path extends string = ''> =
  string extends keyof Schema ? VariableTree : {
    readonly [Key in keyof Schema as Schema[Key] extends StaticDescriptor ? never :
      Schema[Key] extends VariableDescriptor ? Key
        : keyof VariableContract<Schema[Key]> extends never
          ? never : Key]: Schema[Key] extends VariableDescriptor<SourceTree, infer Tokens>
      ? TokenView<Tokens, Prefix, Join<Path, Key & string>>
      : VariableContract<Schema[Key], Prefix, Join<Path, Key & string>>;
  };

type ValueOf<Descriptor> = Descriptor extends { readonly codec: SourceCodec<infer Value> }
  ? Value : never;
type InputLeaf<Descriptor, Patch extends boolean> = Descriptor extends { kind: 'variant-source' }
  ? Patch extends true ? ValueOf<Descriptor> | Partial<Variants<ValueOf<Descriptor>>>
    : Descriptor extends { hasDefault: true }
      ? ValueOf<Descriptor> | Partial<Variants<ValueOf<Descriptor>>>
      : ValueOf<Descriptor> | Variants<ValueOf<Descriptor>>
  : ValueOf<Descriptor>;

type OptionalSourceKeys<Tree> = {
  [Key in keyof Tree]: Tree[Key] extends { kind: 'source' | 'variant-source' }
    ? Tree[Key] extends { hasDefault: true } ? Key : never
    : Exclude<keyof Tree[Key], OptionalSourceKeys<Tree[Key]>> extends never ? Key : never;
}[keyof Tree];

export type SourceInput<Tree, Patch extends boolean = false> = Tree extends {
  kind: 'source' | 'variant-source';
}
  ? InputLeaf<Tree, Patch>
  : string extends keyof Tree ? Readonly<Record<string, unknown>>
    : keyof Tree extends never ? Readonly<Record<string, never>>
      : { [Key in Exclude<keyof Tree, Patch extends true ? keyof Tree : OptionalSourceKeys<Tree>>]:
        SourceInput<Tree[Key], Patch> }
    & { [Key in Patch extends true ? keyof Tree : OptionalSourceKeys<Tree>]?:
      SourceInput<Tree[Key], Patch> };

export type ResolvedSources<Tree> = Tree extends {
  readonly kind: 'variant-source'; readonly codec: SourceCodec<infer Value>;
} ? Variants<Value> : Tree extends {
    readonly kind: 'source'; readonly codec: SourceCodec<infer Value>;
  } ? Value : string extends keyof Tree ? Readonly<Record<string, unknown>>
      : { [Key in keyof Tree]: ResolvedSources<Tree[Key]> };

type HasVariable<Node> = Node extends { readonly kind: 'variable' } ? true
  : Node extends { readonly kind: 'static' } ? false
    : string extends keyof Node ? boolean
      : true extends { [Key in keyof Node]: HasVariable<Node[Key]> }[keyof Node] ? true : false;

type DefaultedSource<Tree> = Tree extends { kind: 'source' | 'variant-source'; hasDefault: infer Flag }
  ? Flag : string extends keyof Tree ? boolean
    : false extends { [Key in keyof Tree]: DefaultedSource<Tree[Key]> }[keyof Tree] ? false : true;
type DefaultedNode<Node> = Node extends { kind: 'variable'; sources: infer Sources }
  ? DefaultedSource<Sources> : Node extends { kind: 'static' } ? true
    : string extends keyof Node ? boolean
      : false extends { [Key in keyof Node]: DefaultedNode<Node[Key]> }[keyof Node] ? false : true;
type InputNode<Node, Patch extends boolean> = Node extends { kind: 'variable'; sources: infer Sources }
  ? SourceInput<Sources, Patch> : ThemeInputTree<Node, Patch>;
type ThemeInputTree<Schema, Patch extends boolean> = string extends keyof Schema
  ? Readonly<Record<string, unknown>> : HasVariable<Schema> extends false
    ? Readonly<Record<string, never>>
    : { [Key in keyof Schema as HasVariable<Schema[Key]> extends false ? never
      : Patch extends true ? never : DefaultedNode<Schema[Key]> extends true ? never : Key]:
      InputNode<Schema[Key], Patch> }
      & { [Key in keyof Schema as HasVariable<Schema[Key]> extends false ? never
        : Patch extends true ? Key : DefaultedNode<Schema[Key]> extends true ? Key : never]?:
        InputNode<Schema[Key], Patch> };
export type ThemeInput<Schema> = ThemeInputTree<Schema, false>;
export type ThemePatch<Schema> = ThemeInputTree<Schema, true>;
export type ResolvedThemeInput<Schema> = string extends keyof Schema
  ? Readonly<Record<string, unknown>> : {
    [Key in keyof Schema as HasVariable<Schema[Key]> extends false ? never : Key]:
    Schema[Key] extends { kind: 'variable'; sources: infer Sources }
      ? ResolvedSources<Sources> : ResolvedThemeInput<Schema[Key]>;
  };

export type CompiledSource = {
  readonly role: 'source';
  readonly scope: AssignmentScope;
  readonly generatorPath: readonly string[];
  readonly path: readonly string[];
  readonly name: string;
  readonly descriptor: Source | VariantSource;
  readonly variant?: 'light' | 'dark';
};
export type CompiledToken = {
  readonly role: 'derived';
  readonly scope: AssignmentScope;
  readonly generatorPath: readonly string[];
  readonly visibility: 'public' | 'private';
  readonly path: readonly string[];
  readonly name: string;
  readonly expression: Expression;
  readonly references: readonly { readonly reference: Reference; readonly name: string }[];
  readonly dependencies: readonly string[];
  readonly registration?: PropertyRegistration;
};

export type CompiledTheme<Schema extends ThemeSchema = ThemeSchema> = {
  readonly schema: Schema;
  readonly sources: readonly CompiledSource[];
  readonly tokens: readonly CompiledToken[];
};

export type BoundSource<Prefix extends string = string> = Omit<CompiledSource, 'name'> & {
  readonly name: `--${Prefix}-${string}`;
};
export type BoundToken<Prefix extends string = string> = {
  readonly role: 'derived';
  readonly scope: AssignmentScope;
  readonly generatorPath: readonly string[];
  readonly visibility: 'public' | 'private';
  readonly name: `--${Prefix}-${string}`;
  readonly path: readonly string[];
  readonly value: string;
  readonly dependencies: readonly `--${Prefix}-${string}`[];
  readonly registration?: PropertyRegistration;
};

export type Theme<Schema extends ThemeSchema = ThemeSchema, Prefix extends string = string> = {
  readonly prefix: Prefix;
  readonly definition: CompiledTheme<Schema>;
  readonly contract: ThemeContract<Schema, Prefix>;
  readonly variables: VariableContract<Schema, Prefix>;
  readonly sources: readonly BoundSource<Prefix>[];
  readonly tokens: readonly BoundToken<Prefix>[];
};

export type ThemeInputs<Bound extends { readonly definition: CompiledTheme }> =
  ThemeInput<Bound['definition']['schema']>;
export type ThemePatches<Bound extends { readonly definition: CompiledTheme }> =
  ThemePatch<Bound['definition']['schema']>;

// Track both allocated names and their original paths so flattening cannot hide collisions.
type Entry<Name extends string, Path extends string> = { name: Name; path: Path };
type LeafEntries<Tree, Name extends string, Path extends string> = Tree extends Expression
  ? Entry<Name, Path>
  : Tree extends Source ? Entry<Name, Path>
    : Tree extends VariantSource ? Entry<`${Name}-light`, `${Path}.light`> | Entry<`${Name}-dark`, `${Path}.dark`>
      : { [Key in keyof Tree]: LeafEntries<Tree[Key], Join<Name, Key & string>, `${Path}.${Key & string}`> }[keyof Tree];
type SchemaEntries<Schema, Name extends string = '', Path extends string = ''> =
  string extends keyof Schema ? never : {
    [Key in keyof Schema]: Schema[Key] extends StaticDescriptor ? never
      : Schema[Key] extends VariableDescriptor<infer Sources, infer Tokens>
        ? LeafEntries<Tokens, Join<Name, Key & string>, `${Path}.${Key & string}.tokens`>
        | LeafEntries<Sources, `source-${Join<Name, Key & string>}`, `${Path}.${Key & string}.sources`>
        : SchemaEntries<Schema[Key], Join<Name, Key & string>, `${Path}.${Key & string}`>;
  }[keyof Schema];
type IsUnion<Value, Whole = Value> = Value extends Whole
  ? [Whole] extends [Value] ? false : true : never;
type Collisions<Entries, Whole = Entries> = Entries extends { name: infer Name extends string }
  ? IsUnion<Whole extends { name: Name; path: infer Path } ? Path : never> extends true
    ? Name : never : never;
type InvalidKeys<Tree> = Tree extends Source | VariantSource | Expression | StaticDescriptor
  ? never : Tree extends VariableDescriptor<infer Sources, infer Tokens>
    ? InvalidKeys<Sources> | InvalidKeys<Tokens>
    : { [Key in keyof Tree]: Key extends '' | 'constructor' | 'prototype' | '__proto__'
      | `${string}.${string}` | `${string} ${string}` | `${string}_${string}` ? Key
      : InvalidKeys<Tree[Key]> }[keyof Tree];
export type ValidSchema<Schema> = string extends keyof Schema ? unknown
  : InvalidKeys<Schema> extends never
    ? Collisions<SchemaEntries<Schema>> extends never ? unknown : never
    : never;
