import type {
  AssignmentScope,
  CompiledTheme,
  ThemeSchema,
} from '@sabinmarcu/theme-core';
import type { ScopeSchema } from './types.js';

const partitionSchema = (schema: ThemeSchema, scope: AssignmentScope): ThemeSchema => {
  const result: Record<string, ThemeSchema[keyof ThemeSchema]> = {};
  for (const [key, node] of Object.entries(schema)) {
    if (node.kind === 'variable') {
      if (node.scope === scope) result[key] = node;
    } else if (node.kind !== 'static') {
      const child = partitionSchema(node as ThemeSchema, scope);
      if (Object.keys(child).length > 0) result[key] = child;
    }
  }
  return Object.freeze(result);
};

/** Filter immutable compiled entries by intrinsic scope, with no generator execution. */
export function partitionThemeDefinition<
  const Schema extends ThemeSchema,
  const Scope extends AssignmentScope,
>(definition: CompiledTheme<Schema>, scope: Scope): CompiledTheme<ScopeSchema<Schema, Scope>> {
  return Object.freeze({
    schema: partitionSchema(definition.schema, scope) as ScopeSchema<Schema, Scope>,
    sources: Object.freeze(definition.sources.filter((source) => source.scope === scope)),
    tokens: Object.freeze(definition.tokens.filter((token) => token.scope === scope)),
  });
}
