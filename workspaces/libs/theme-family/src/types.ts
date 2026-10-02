import type {
  AssignmentScope,
  CSSVariable,
  Expression,
  ResolvedThemeInput,
  StaticDescriptor,
  Theme,
  ThemeContract,
  ThemeInput,
  ThemePatch,
  ThemeManifest,
  ThemeSchema,
  ThemeSetup,
} from '@sabinmarcu/theme-core';

type ContainsScope<Node, Scope extends AssignmentScope> = Node extends {
  readonly kind: 'variable'; readonly scope: Scope;
} ? true : Node extends { readonly kind: 'variable' | 'static' } ? false
    : string extends keyof Node ? boolean
      : true extends { [Key in keyof Node]: ContainsScope<Node[Key], Scope> }[keyof Node]
        ? true : false;

/**
 * Removes static descriptors and variables belonging to the other scope, retaining the
 * original variable descriptor types and only the non-empty groups that contain them.
 */
export type ScopeSchema<Schema, Scope extends AssignmentScope> = string extends keyof Schema
  ? ThemeSchema
  : { readonly [Key in keyof Schema as ContainsScope<Schema[Key], Scope> extends false
    ? never : Key]: Schema[Key] extends { readonly kind: 'variable' } ? Schema[Key]
      : ScopeSchema<Schema[Key], Scope> };

type ScopeInput<Schema, Scope extends AssignmentScope> = ThemeInput<ScopeSchema<Schema, Scope>>;
type ScopePatch<Schema, Scope extends AssignmentScope> = ThemePatch<ScopeSchema<Schema, Scope>>;
type ScopeResolvedInput<Schema, Scope extends AssignmentScope> = ResolvedThemeInput<
  ScopeSchema<Schema, Scope>
>;

type RequiredSource<Tree> = Tree extends { kind: 'source' | 'variant-source'; hasDefault: infer Flag }
  ? Flag extends true ? false : true
  : string extends keyof Tree ? boolean
    : true extends { [Key in keyof Tree]: RequiredSource<Tree[Key]> }[keyof Tree] ? true : false;
type RequiredScope<Node, Scope extends AssignmentScope> = Node extends {
  kind: 'variable'; scope: Scope; sources: infer Sources;
} ? RequiredSource<Sources> : Node extends { kind: 'variable' | 'static' } ? false
    : string extends keyof Node ? boolean
      : true extends { [Key in keyof Node]: RequiredScope<Node[Key], Scope> }[keyof Node]
        ? true : false;
type RequiredField<Key extends string, Value, Required> = Required extends true
  ? { readonly [Name in Key]: Value } : { readonly [Name in Key]?: Value };
type FamilyMemberInputs<Schema, Member extends string> = RequiredScope<Schema, 'contextual'> extends true
  ? { readonly [Name in Member]: ScopeInput<Schema, 'contextual'> }
  : { readonly [Name in Member]?: ScopeInput<Schema, 'contextual'> };

/** The complete initial input, partitioned into shared and per-member allocations. */
export type FamilyInput<Schema, Member extends string> = RequiredField<
  'shared', ScopeInput<Schema, 'shared'>, RequiredScope<Schema, 'shared'>
> & RequiredField<'families', FamilyMemberInputs<Schema, Member>, RequiredScope<Schema, 'contextual'>>;

/** A partial update; source leaves retain the patch semantics supplied by theme-core. */
export type FamilyPatch<Schema, Member extends string> = {
  readonly shared?: ScopePatch<Schema, 'shared'>;
  readonly families?: {
    readonly [Name in Member]?: ScopePatch<Schema, 'contextual'>;
  };
};

/** The complete resolved state for every member, including descriptor defaults. */
export type ResolvedFamilyInput<Schema, Member extends string> = {
  readonly shared: ScopeResolvedInput<Schema, 'shared'>;
  readonly families: {
    readonly [Name in Member]: ScopeResolvedInput<Schema, 'contextual'>;
  };
};

type LowercaseLetter =
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
  | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type KebabTail<Value extends string> = Value extends '' ? true
  : Value extends `${LowercaseLetter | Digit}${infer Rest}` ? KebabTail<Rest>
    : Value extends `-${infer Rest}`
      ? Rest extends `${LowercaseLetter | Digit}${infer Following}` ? KebabTail<Following> : false
      : false;
type ValidKebab<Value extends string> = string extends Value ? Value
  : Value extends `${LowercaseLetter}${infer Rest}`
    ? KebabTail<Rest> extends true ? Value : never
    : never;
type ReservedFamilyName = 'base' | 'constructor' | 'prototype' | '__proto__';
type ValidMemberName<Value extends string> = Value extends ReservedFamilyName ? never
  : ValidKebab<Value>;
type Contains<Values extends readonly string[], Value extends string> = Value extends Values[number]
  ? true : false;
type ValidMemberNames<Names extends readonly string[]> = number extends Names['length'] ? Names
  : Names extends readonly [
    infer Head extends string,
    ...infer Tail extends readonly string[],
  ]
    ? ValidMemberName<Head> extends never ? never
      : Contains<Tail, Head> extends true ? never
        : ValidMemberNames<Tail> extends never ? never : Names
    : Names;

/** Construction options that can be checked before runtime validation for literal inputs. */
export type FamilyOptions<Names extends readonly string[], Id extends string> = {
  readonly id: Id & ValidKebab<Id>;
  readonly families: Names & ValidMemberNames<Names>;
  readonly nonce?: string;
  readonly debugId?: string;
  readonly selector?: string;
  readonly layer?: string;
  readonly mappingLayer?: string;
  readonly variantLayer?: string;
};

type Join<Path extends string, Key extends string> = Path extends '' ? Key : `${Path}-${Key}`;
type TokenView<Tokens, Prefix extends string, Path extends string> = Tokens extends Expression
  ? CSSVariable<Prefix, Path>
  : { readonly [Key in keyof Tokens]: TokenView<Tokens[Key], Prefix, Join<Path, Key & string>> };
type FamilyViewNode<
  Node,
  Prefix extends string,
  Id extends string,
  Member extends string,
  Path extends string,
> = Node extends StaticDescriptor<infer Output> ? Output
  : Node extends { readonly kind: 'variable'; readonly tokens: infer Tokens; readonly scope: infer Scope }
    ? Scope extends 'shared'
      ? TokenView<Tokens, Prefix, Path>
      : TokenView<Tokens, `${Prefix}-family-${Id}`, `families-${Member}-${Path}`>
    : FamilyView<Node, Prefix, Id, Member, Path>;

/** A member's mixed view: original shared/static outputs and that member's private outputs. */
export type FamilyView<
  Schema,
  Prefix extends string,
  Id extends string,
  Member extends string,
  Path extends string = '',
> = string extends keyof Schema ? Readonly<Record<string, unknown>> : {
  readonly [Key in keyof Schema]: FamilyViewNode<
    Schema[Key],
    Prefix,
    Id,
    Member,
    Join<Path, Key & string>
  >;
};

/** JSON-safe source allocation metadata. Descriptor and codec objects are deliberately absent. */
export type FamilyBinding<Member extends string = string> = {
  readonly name: string;
  readonly inputPath: readonly string[];
  readonly scope: AssignmentScope;
  readonly member?: Member;
  readonly variant?: 'light' | 'dark';
  readonly generatorPath: readonly string[];
};

type FamilyMember<Names extends readonly string[]> = 'base' | Names[number];
type FamilySelectors<Member extends string> = {
  readonly [Name in Member]: `[data-theme-family="${Name}"]`;
};

/** Callable family harness backed by the same public contract as its input theme. */
export type ThemeFamily<
  Schema extends ThemeSchema,
  Prefix extends string,
  Names extends readonly string[],
  Id extends string,
> = {
  (input: FamilyInput<Schema, FamilyMember<Names>>): ThemeContract<Schema, Prefix>;
  update(patch: FamilyPatch<Schema, FamilyMember<Names>>): ThemeContract<Schema, Prefix>;
  read(): ResolvedFamilyInput<Schema, FamilyMember<Names>>;
  manifest(): ThemeManifest;
  pick(member: FamilyMember<Names>, selector?: string): ThemeContract<Schema, Prefix>;
  mount(root: Document | ShadowRoot): ThemeFamily<Schema, Prefix, Names, Id>;
  readonly contract: Theme<Schema, Prefix>['contract'];
  readonly families: readonly ['base', ...Names];
  readonly selectors: FamilySelectors<FamilyMember<Names>>;
  readonly themes: {
    readonly [Member in FamilyMember<Names>]: FamilyView<Schema, Prefix, Id, Member>;
  };
  readonly bindings: readonly FamilyBinding<FamilyMember<Names>>[];
  readonly stylesheet: ThemeSetup<ThemeSchema, string>['stylesheet'];
  readonly selector: string;
};
