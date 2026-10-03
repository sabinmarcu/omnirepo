import { isSource } from './descriptors.js';
import type {
  ResolvedThemeInput,
  Source,
  SourceTree,
  Theme,
  ThemeInput,
  ThemePatch,
  ThemeSchema,
  VariableDescriptor,
  VariantSource,
} from './types.js';

const isRecord = (value: unknown): value is Record<string, unknown> => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
);
const groupInput = (value: unknown, keys: readonly string[], path: readonly string[]) => {
  if (value === undefined) return {};
  if (!isRecord(value)) throw new Error(`Expected an input group at ${path.join('.')}`);
  for (const key of Object.keys(value)) {
    if (!keys.includes(key)) throw new Error(`Unknown theme input: ${[...path, key].join('.')}`);
  }
  return value;
};
const variantInput = (value: unknown) => isRecord(value)
  && ('light' in value || 'dark' in value);

const resolveSource = (
  descriptor: Source | VariantSource,
  value: unknown,
  path: readonly string[],
): unknown => {
  const resolve = (provided: unknown, fallback?: string) => {
    if (provided === undefined) {
      if (fallback === undefined) throw new Error(`Missing theme source: ${path.join('.')}`);
      return descriptor.codec.decode(fallback);
    }
    return descriptor.codec.decode(descriptor.codec.encode(provided));
  };
  if (descriptor.kind === 'source') return resolve(value, descriptor.defaultCSS);
  if (value !== undefined && !variantInput(value)) {
    const scalar = resolve(value);
    return {
      light: scalar,
      dark: resolve(value),
    };
  }
  const pair = groupInput(value, ['light', 'dark'], path);
  return {
    light: resolve(pair.light, descriptor.defaultCSS?.light),
    dark: resolve(pair.dark, descriptor.defaultCSS?.dark),
  };
};
const resolveTree = (tree: SourceTree, value: unknown, path: readonly string[]): unknown => {
  if (isSource(tree)) return resolveSource(tree, value, path);
  const input = groupInput(value, Object.keys(tree), path);
  return Object.fromEntries(Object.entries(tree).map(
    ([key, child]) => [key, resolveTree(child, input[key], [...path, key])],
  ));
};
const hasVariables = (node: ThemeSchema[keyof ThemeSchema]): boolean => node.kind === 'variable'
  || (node.kind !== 'static' && Object.values(node).some(hasVariables));

export function resolveThemeInputs<const Schema extends ThemeSchema>(
  theme: { readonly definition: { readonly schema: Schema } },
  input: NoInfer<ThemeInput<Schema>>,
): ResolvedThemeInput<Schema>;
export function resolveThemeInputs(
  theme: { readonly definition: { readonly schema: ThemeSchema } },
  input: unknown,
): unknown {
  const resolve = (group: ThemeSchema, provided: unknown, path: readonly string[]): unknown => {
    const entries = Object.entries(group).filter(([, node]) => hasVariables(node));
    const value = groupInput(provided, entries.map(([key]) => key), path);
    return Object.fromEntries(entries.map(([key, node]) => [key, node.kind === 'variable'
      ? resolveTree((node as VariableDescriptor).sources, value[key], [...path, key])
      : resolve(node as ThemeSchema, value[key], [...path, key])]));
  };
  return resolve(theme.definition.schema, input, []);
}

/** Encode only supplied source paths. The renderer supplies current omitted allocations. */
export function encodeThemePatch<Schema extends ThemeSchema, Prefix extends string>(
  theme: Pick<Theme<Schema, Prefix>, 'definition' | 'sources' | 'prefix'>,
  input: NoInfer<ThemePatch<Schema>>,
): Readonly<Record<`--${Prefix}-${string}`, string>>;
export function encodeThemePatch(
  theme: Pick<Theme, 'definition' | 'sources' | 'prefix'>,
  input: unknown,
): Readonly<Record<string, string>> {
  const declarations: Record<string, string> = {};
  const encodeSource = (
    descriptor: Source | VariantSource,
    value: unknown,
    path: readonly string[],
  ) => {
    const put = (provided: unknown, variant?: 'light' | 'dark') => {
      if (provided === undefined) return;
      const binding = theme.sources.find((source) => source.variant === variant
        && source.path.length === path.length
        && source.path.every((part, index) => part === path[index]));
      if (!binding) throw new Error(`Unknown source allocation: ${path.join('.')}`);
      declarations[binding.name] = descriptor.codec.encode(provided);
    };
    if (descriptor.kind === 'source') put(value);
    else if (!variantInput(value)) { put(value, 'light'); put(value, 'dark'); } else {
      const pair = groupInput(value, ['light', 'dark'], path);
      put(pair.light, 'light');
      put(pair.dark, 'dark');
    }
  };
  const visitSources = (tree: SourceTree, value: unknown, path: readonly string[]) => {
    if (value === undefined) return;
    if (isSource(tree)) encodeSource(tree, value, path);
    else {
      const inputGroup = groupInput(value, Object.keys(tree), path);
      for (const [key, child] of Object.entries(tree)) {
        visitSources(child, inputGroup[key], [...path, key]);
      }
    }
  };
  const visit = (group: ThemeSchema, value: unknown, path: readonly string[]) => {
    const entries = Object.entries(group).filter(([, node]) => hasVariables(node));
    const inputGroup = groupInput(value, entries.map(([key]) => key), path);
    for (const [key, node] of entries) {
      if (inputGroup[key] !== undefined) {
        if (node.kind === 'variable') {
          visitSources(
            (node as VariableDescriptor).sources,
            inputGroup[key],
            [...path, key],
          );
        } else visit(node as ThemeSchema, inputGroup[key], [...path, key]);
      }
    }
  };
  visit(theme.definition.schema, input, []);
  return Object.freeze(declarations);
}
