import type {
  CompiledTheme,
  ThemeSchema,
} from './types.js';

export type RebasedSchema<Schema extends ThemeSchema, Path extends readonly string[]> =
  Path extends readonly [
    infer Head extends string, ...infer Rest extends string[],
  ] ? { readonly [Key in Head]: RebasedSchema<Schema, Rest> } : Schema;

/** Move logical input/output paths and symbols together, never rewrite authored CSS strings. */
export function rebaseThemeDefinition<
  const Schema extends ThemeSchema,
  const Path extends readonly string[],
>(definition: CompiledTheme<Schema>, path: Path):
CompiledTheme<RebasedSchema<Schema, Path>> {
  for (const key of path) {
    if (!/^[a-zA-Z][a-zA-Z\d-]*$/.test(key)
      || ['constructor', 'prototype'].includes(key)) throw new Error(`Invalid allocation path: ${key}`);
  }
  const prefix = path.length === 0 ? '' : `${path.join('-')}-`;
  const name = (symbol: string) => `${prefix}${symbol}`;
  let { schema }: { schema: ThemeSchema } = definition;
  for (let index = path.length - 1; index >= 0; index -= 1) {
    schema = Object.freeze({ [path[index]!]: schema });
  }
  return Object.freeze({
    schema: schema as RebasedSchema<Schema, Path>,
    sources: Object.freeze(definition.sources.map((source) => Object.freeze({
      ...source,
      name: name(source.name),
      path: Object.freeze([...path, ...source.path]),
      generatorPath: Object.freeze([...path, ...source.generatorPath]),
    }))),
    tokens: Object.freeze(definition.tokens.map((token) => Object.freeze({
      ...token,
      name: name(token.name),
      path: Object.freeze([...path, ...token.path]),
      generatorPath: Object.freeze([...path, ...token.generatorPath]),
      references: Object.freeze(token.references.map((entry) => Object.freeze({
        reference: entry.reference,
        name: name(entry.name),
      }))),
      dependencies: Object.freeze(token.dependencies.map(name)),
    }))),
  });
}
