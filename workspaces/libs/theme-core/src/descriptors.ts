import type {
  AssignmentScope,
  Expression,
  GeneratedTokens,
  PropertyRegistration,
  Reference,
  Source,
  SourceCodec,
  SourceReferences,
  SourceTree,
  StaticDescriptor,
  VariableDescriptor,
  Variants,
  VariantSource,
} from './types.js';
import {
  sourceRepresentation,
  standardCodec,
} from './codecs.js';

/** Own structural data while retaining recognized receiver-bound standard codecs. */
export function immutable<Value>(value: Value): Value {
  if (value === null || typeof value !== 'object') return value;
  if (sourceRepresentation(value)) return value;
  if (Array.isArray(value)) return Object.freeze(value.map(immutable)) as Value;
  return Object.freeze(Object.fromEntries(Object.entries(value).map(
    ([key, child]) => [key, immutable(child)],
  ))) as Value;
}

const ownCodec = <Value>(codec: SourceCodec<Value>): SourceCodec<Value> => {
  const representation = sourceRepresentation(codec as SourceCodec<unknown>);
  const owned = Object.freeze({
    encode: codec.encode.bind(codec),
    decode: codec.decode.bind(codec),
    ...(representation ? { representation } : {}),
  });
  return representation ? standardCodec(owned, representation) : owned;
};

export const stringCodec: SourceCodec<string> = standardCodec(Object.freeze({
  encode(value: string) {
    if (typeof value !== 'string' || value.trim() === '') throw new Error('Expected a CSS string');
    return value;
  },
  decode(value: string) { return this.encode(value); },
  representation: Object.freeze({ kind: 'string' as const }),
}), Object.freeze({ kind: 'string' }));

export const numberCodec: SourceCodec<number> = standardCodec(Object.freeze({
  encode(value: number) {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Expected a finite number');
    return String(value);
  },
  decode(value: string) {
    if (!value.trim()) throw new Error('Expected a numeric declaration');
    const number = Number(value);
    this.encode(number);
    return number;
  },
  representation: Object.freeze({ kind: 'number' as const }),
}), Object.freeze({ kind: 'number' }));

export function source<Value>(codec: SourceCodec<Value>): Source<Value, false>;
export function source<Value>(codec: SourceCodec<Value>, defaultValue: Value,
  registration?: PropertyRegistration): Source<Value, true>;
export function source<Value>(
  codec: SourceCodec<Value>,
  ...defaults: [Value?, PropertyRegistration?]
): Source<Value, boolean> {
  const hasDefault = defaults.length > 0;
  const ownedCodec = ownCodec(codec);
  return immutable({
    kind: 'source' as const,
    codec: ownedCodec,
    hasDefault,
    defaultCSS: hasDefault ? ownedCodec.encode(defaults[0]!) : undefined,
    registration: defaults[1],
  });
}

export function variantSource<Value>(codec: SourceCodec<Value>): VariantSource<Value, false>;
export function variantSource<Value>(codec: SourceCodec<Value>,
  defaultValue: Value | Variants<Value>,
  registration?: PropertyRegistration): VariantSource<Value, true>;
export function variantSource<Value>(
  codec: SourceCodec<Value>,
  ...defaults: [(Value | Variants<Value>)?, PropertyRegistration?]
): VariantSource<Value, boolean> {
  const hasDefault = defaults.length > 0;
  const ownedCodec = ownCodec(codec);
  const value = defaults[0];
  const pair = value && typeof value === 'object' && 'light' in value && 'dark' in value
    ? value
    : {
      light: value as Value,
      dark: value as Value,
    };
  return immutable({
    kind: 'variant-source' as const,
    codec: ownedCodec,
    hasDefault,
    defaultCSS: hasDefault
      ? {
        light: ownedCodec.encode(pair.light),
        dark: ownedCodec.encode(pair.dark),
      }
      : undefined,
    registration: defaults[1],
  });
}

export function css(
  strings: TemplateStringsArray,
  ...expressions: (Expression | string | number)[]
): Expression {
  const parts: (string | Expression)[] = [];
  strings.forEach((text, index) => {
    parts.push(text);
    if (index < expressions.length) {
      const expression = expressions[index]!;
      parts.push(typeof expression === 'object' ? expression : String(expression));
    }
  });
  return Object.freeze({
    kind: 'expression',
    parts: Object.freeze(parts),
  });
}

export const registered = (
  expression: Expression,
  registration: PropertyRegistration,
): Expression => (
  Object.freeze({
    kind: 'registered',
    expression,
    registration: immutable(registration),
  })
);

/** CSS style queries address a custom-property name, not its var() value. */
export const propertyName = (input: Reference): Expression => Object.freeze({
  kind: 'property-name',
  reference: input,
});

export const isSource = (value: SourceTree): value is Source | VariantSource => (
  value.kind === 'source' || value.kind === 'variant-source'
);
export const isExpression = (value: unknown): value is Expression => (
  value !== null && typeof value === 'object' && 'kind' in value
    && ['reference', 'expression', 'registered', 'property-name'].includes(String(value.kind))
);

const reference = (owner: object, role: Reference['role'], path: readonly string[]): Reference => (
  Object.freeze({
    kind: 'reference',
    role,
    owner,
    path: Object.freeze([...path]),
  })
);

export function variableGenerator<
  const Sources extends SourceTree,
  const Result extends GeneratedTokens,
  const Scope extends AssignmentScope,
>(options: {
  readonly scope: Scope;
  readonly sources: Sources;
  readonly build: (sources: SourceReferences<Sources>, references: {
    token(...path: string[]): Reference;
    privateToken(...path: string[]): Reference;
  }) => Result;
}): VariableDescriptor<Sources, Result['tokens'], Scope> {
  const { scope } = options;
  if (scope !== 'shared' && scope !== 'contextual') throw new Error('Invalid generator scope');
  const owner = Object.freeze({});
  const sources = immutable(options.sources);
  const buildReferences = (tree: SourceTree, path: readonly string[]): unknown => {
    if (isSource(tree)) {
      return tree.kind === 'source'
        ? reference(owner, 'source', path)
        : Object.freeze({
          light: reference(owner, 'source', [...path, 'light']),
          dark: reference(owner, 'source', [...path, 'dark']),
        });
    }
    return Object.freeze(Object.fromEntries(Object.entries(tree).map(
      ([key, child]) => [key, buildReferences(child, [...path, key])],
    )));
  };
  const result = options.build(buildReferences(sources, []) as SourceReferences<Sources>, {
    token: (...path) => reference(owner, 'token', path),
    privateToken: (...path) => reference(owner, 'private', path),
  });
  const ownExpression = (expression: Expression): Expression => {
    if (expression.kind === 'reference') { return reference(expression.owner, expression.role, expression.path); }
    if (expression.kind === 'registered') { return registered(ownExpression(expression.expression), expression.registration); }
    if (expression.kind === 'property-name') {
      return propertyName(
        reference(expression.reference.owner, expression.reference.role, expression.reference.path),
      );
    }
    return Object.freeze({
      kind: 'expression',
      parts: Object.freeze(expression.parts.map(
        (part) => (typeof part === 'string' ? part : ownExpression(part)),
      )),
    });
  };
  const ownTokens = <Value>(tree: Value): Value => {
    if (isExpression(tree)) return ownExpression(tree) as Value;
    return Object.freeze(Object.fromEntries(Object.entries(tree as object).map(
      ([key, child]) => [key, ownTokens(child)],
    ))) as Value;
  };
  return Object.freeze({
    kind: 'variable',
    scope,
    sources,
    tokens: ownTokens(result.tokens),
    privateTokens: result.privateTokens ? ownTokens(result.privateTokens) : undefined,
    owner,
  });
}

/** Author a factory's intrinsically static output, not a reclassification wrapper. */
export function staticGenerator<const Output>(
  output: Output & (Output extends VariableDescriptor | StaticDescriptor | Source | VariantSource
    ? never : unknown),
): StaticDescriptor<Output> {
  if (output !== null && typeof output === 'object' && 'kind' in output
    && ['variable', 'static', 'source', 'variant-source'].includes(String(output.kind))) {
    throw new Error('A descriptor cannot be reclassified as static output');
  }
  return Object.freeze({
    kind: 'static',
    output: immutable(output),
  });
}
