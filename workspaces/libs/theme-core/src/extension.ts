import {
  bindTheme,
  compileThemeExtension,
} from './compiler.js';
import type {
  BoundSource,
  BoundToken,
  CompiledTheme,
  ExtendThemeSchema,
  Theme,
  ThemeSchema,
  ValidThemeExtension,
} from './types.js';

const isDescriptor = (value: unknown): value is { readonly kind: 'variable' | 'static' } => (
  value !== null && typeof value === 'object' && 'kind' in value
  && ((value as { readonly kind?: unknown }).kind === 'variable'
    || (value as { readonly kind?: unknown }).kind === 'static')
);

const hasVariable = (schema: ThemeSchema): boolean => Object.values(schema).some((node) => (
  isDescriptor(node) ? node.kind === 'variable' : hasVariable(node as ThemeSchema)
));

/** Merge only group nodes; descriptors are immutable leaves that cannot be replaced. */
const mergeSchema = <Base extends ThemeSchema, Additions extends ThemeSchema>(
  base: Base,
  additions: Additions,
): ExtendThemeSchema<Base, Additions> => {
  const result: Record<string, unknown> = { ...base };
  for (const [key, addition] of Object.entries(additions)) {
    const existing = base[key];
    if (existing === undefined) {
      result[key] = addition;
    } else if (isDescriptor(existing) || isDescriptor(addition)) {
      throw new Error(`Theme extension overlaps existing descriptor: ${key}`);
    } else {
      result[key] = mergeSchema(existing as ThemeSchema, addition as ThemeSchema);
    }
  }
  return Object.freeze(result) as ExtendThemeSchema<Base, Additions>;
};

const mergeView = (
  baseSchema: ThemeSchema,
  additionSchema: ThemeSchema,
  base: Record<string, unknown>,
  additions: Record<string, unknown>,
  variablesOnly: boolean,
): Record<string, unknown> => {
  if (variablesOnly && !hasVariable(additionSchema)) return base;
  const result: Record<string, unknown> = { ...base };
  for (const [key, addition] of Object.entries(additionSchema)) {
    const existingSchema = baseSchema[key];
    if (existingSchema === undefined) {
      if (!variablesOnly || hasVariable({ [key]: addition })) result[key] = additions[key];
    } else if (!isDescriptor(existingSchema) && !isDescriptor(addition)) {
      const merged = mergeView(
        existingSchema as ThemeSchema,
        addition as ThemeSchema,
        base[key] as Record<string, unknown>,
        additions[key] as Record<string, unknown>,
        variablesOnly,
      );
      if (!variablesOnly || Object.keys(merged).length > 0) result[key] = merged;
    }
  }
  return Object.freeze(result);
};

const assertDistinctAllocations = (base: CompiledTheme, additions: CompiledTheme) => {
  const allocated = new Set([
    ...base.sources.map(({ name }) => name),
    ...base.tokens.map(({ name }) => name),
  ]);
  for (const { name } of [...additions.sources, ...additions.tokens]) {
    if (allocated.has(name)) throw new Error(`Theme allocation name collision: ${name}`);
    allocated.add(name);
  }
};

/**
 * Add descriptors to an existing bound theme without recompiling or rebinding its graph.
 * Existing leaves, declarations, and contract subtrees keep their original identity.
 */
export function extendTheme<
  const Base extends ThemeSchema,
  const Prefix extends string,
  const Additions extends ThemeSchema,
>(
  base: Theme<Base, Prefix>,
  additions: Additions & ValidThemeExtension<Base, Additions>,
): Theme<ExtendThemeSchema<Base, Additions>, Prefix> {
  const additionDefinition = compileThemeExtension<Additions>(additions);
  assertDistinctAllocations(base.definition, additionDefinition);
  const extensionPrefix: never = base.prefix as never;
  const addition = bindTheme(additionDefinition, { prefix: extensionPrefix });
  const schema = mergeSchema(base.definition.schema, additionDefinition.schema);
  const definition = Object.freeze({
    schema,
    sources: Object.freeze([...base.definition.sources, ...additionDefinition.sources]),
    tokens: Object.freeze([...base.definition.tokens, ...additionDefinition.tokens]),
  });
  const contract = mergeView(
    base.definition.schema,
    additionDefinition.schema,
    base.contract as Record<string, unknown>,
    addition.contract as Record<string, unknown>,
    false,
  );
  const variables = mergeView(
    base.definition.schema,
    additionDefinition.schema,
    base.variables as Record<string, unknown>,
    addition.variables as Record<string, unknown>,
    true,
  );
  const extended = Object.freeze({
    prefix: base.prefix,
    definition,
    contract,
    variables,
    sources: Object.freeze([...base.sources, ...addition.sources]) as
      readonly BoundSource<Prefix>[],
    tokens: Object.freeze([...base.tokens, ...addition.tokens]) as readonly BoundToken<Prefix>[],
  });
  return extended as unknown as Theme<ExtendThemeSchema<Base, Additions>, Prefix>;
}
