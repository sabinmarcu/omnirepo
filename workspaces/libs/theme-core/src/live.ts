import type { StylesheetState } from '@sabinmarcu/stylesheet';
import { isSource } from './descriptors.js';
import type {
  ResolvedThemeInput,
  SourceTree,
  VariableDescriptor,
  Theme,
  ThemeSchema,
} from './types.js';

/** Decode only declared source allocations; derived values never become editable inputs. */
export function readThemeSources<const Schema extends ThemeSchema>(
  theme: Pick<Theme<Schema>, 'sources' | 'definition'>,
  stylesheet: StylesheetState,
  selector?: string,
  layer?: string,
): ResolvedThemeInput<Schema>;
export function readThemeSources(
  theme: Pick<Theme, 'sources' | 'definition'>,
  stylesheet: StylesheetState,
  selector = ':root',
  layer?: string,
): unknown {
  const sourceGroups = (tree: SourceTree): Record<string, unknown> | undefined => (
    isSource(tree)
      ? undefined
      : Object.fromEntries(Object.entries(tree).flatMap(([key, child]) => {
        const nested = sourceGroups(child);
        return nested === undefined ? [] : [[key, nested]];
      }))
  );
  const schemaGroups = (group: ThemeSchema): Record<string, unknown> => Object.fromEntries(
    Object.entries(group).flatMap(([key, node]) => {
      if (node.kind === 'static') return [];
      if (node.kind === 'variable') {
        const groups = sourceGroups((node as VariableDescriptor).sources);
        return groups === undefined ? [] : [[key, groups]];
      }
      const nested = schemaGroups(node as ThemeSchema);
      return Object.keys(nested).length === 0 ? [] : [[key, nested]];
    }),
  );
  const result = schemaGroups(theme.definition.schema);
  const declarations = stylesheet.readMany(
    selector,
    theme.sources.map((source) => source.name),
    layer,
  );
  for (const source of theme.sources) {
    const css = declarations[source.name];
    if (css === undefined) throw new Error(`Missing source allocation: ${source.name}`);
    const value = source.descriptor.codec.decode(css);
    const path = source.variant ? [...source.path, source.variant] : source.path;
    let parent = result;
    for (const key of path.slice(0, -1)) {
      if (!Object.hasOwn(parent, key)) parent[key] = {};
      parent = parent[key] as Record<string, unknown>;
    }
    parent[path.at(-1)!] = value;
  }
  return result;
}
