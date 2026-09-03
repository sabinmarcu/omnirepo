import {
  normalizeTagSegment,
  parseTag,
  tagNamespaces,
  type TagId,
  type TagNamespace,
} from './Tag';
import {
  tagRegistryData,
} from './TagRegistry.data';

export { promotedTags } from './TagRegistry.data';

export const tagKinds = [
  'tag',
  'language',
  'skill',
  'topic',
] as const;

export type TagKind = typeof tagKinds[number];

export type TagDefinition = {
  /** Display override. Default is prettify(last segment). Locale-neutral. */
  label?: string,
  /** Search-result category. Namespace definitions supply inherited defaults. */
  kind?: TagKind,
  /** Equivalent tag that owns search and route identity. */
  canonical?: TagId,
  aliases?: string[],
  implies?: TagId[],
};

export type TagRegistry = Partial<Record<TagId, TagDefinition>>;

/** Absence is the normal case, not an error. */
export const tagRegistry: TagRegistry = tagRegistryData;

export function isTagNamespace(id: TagId): id is TagNamespace {
  return tagNamespaces.includes(id as TagNamespace);
}

/** Per-tag override -> namespace default -> generic tag. */
export function tagKind(id: TagId, registry: TagRegistry = tagRegistry): TagKind {
  const { namespace } = parseTag(id);
  return registry[id]?.kind ?? (namespace ? registry[namespace]?.kind : undefined) ?? 'tag';
}

/** Follows canonical equivalents to the tag that owns search and route identity. */
export function canonicalTag(id: TagId, registry: TagRegistry = tagRegistry): TagId {
  const chain = new Set<TagId>();
  let current = id;
  let target = registry[current]?.canonical;
  while (target) {
    if (chain.has(current)) {
      throw new Error(`Tag canonical cycle: ${[...chain, current].join(' -> ')}`);
    }
    chain.add(current);
    current = target;
    target = registry[current]?.canonical;
  }
  return current;
}

function tagId(namespace: TagNamespace | undefined, segment: string): TagId {
  return namespace ? `${namespace}:${segment}` : segment;
}

/**
 * Normalization plus alias resolution. Unknown inputs remain valid,
 * unregistered tags.
 */
export function resolveTag(
  namespace: TagNamespace | undefined,
  raw: string,
  registry: TagRegistry = tagRegistry,
): TagId {
  const normalized = normalizeTagSegment(raw);
  if (!normalized) {
    throw new Error('A tag segment cannot be empty.');
  }

  const directId = tagId(namespace, normalized);
  if (registry[directId]) {
    return directId;
  }

  const aliasTarget = Object.entries(registry).find(([id, definition]) => (
    parseTag(id).namespace === namespace
    && definition?.aliases?.some((alias) => normalizeTagSegment(alias) === normalized)
  ));

  return aliasTarget?.[0] ?? directId;
}

function expandTag(
  id: TagId,
  registry: TagRegistry,
  expanded: Set<TagId>,
  chain: TagId[],
) {
  const cycleStart = chain.indexOf(id);
  if (cycleStart !== -1) {
    throw new Error(`Tag implication cycle: ${[...chain.slice(cycleStart), id].join(' -> ')}`);
  }

  if (expanded.has(id)) {
    return;
  }

  const nextChain = [...chain, id];
  for (const impliedId of registry[id]?.implies ?? []) {
    expandTag(impliedId, registry, expanded, nextChain);
  }
  expanded.add(id);
}

/** Transitive `implies` closure, including the input. Throws on cycles. */
export function expandTags(ids: TagId[], registry: TagRegistry = tagRegistry): TagId[] {
  const expanded = new Set<TagId>();
  for (const id of ids) {
    expandTag(canonicalTag(id, registry), registry, expanded, []);
  }
  return [...expanded].toSorted((left, right) => left.localeCompare(right));
}

function prettify(segment: string): string {
  return segment
    .split('-')
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

/** i18n message override -> registry label -> prettified segment. */
export function tagLabel(id: TagId, translate: (key: string) => string): string {
  const translated = translate(id);
  if (translated !== id) {
    return translated;
  }

  return tagRegistry[id]?.label ?? prettify(parseTag(id).segments.at(-1)!);
}

/** Hard-fail integrity check over the authored registry. */
export function validateRegistry(
  observed: readonly TagId[],
  registry: TagRegistry = tagRegistry,
): void {
  const knownIds = new Set([...Object.keys(registry), ...observed]);
  const claimedAliases = new Map<string, TagId>();

  for (const [id, definition] of Object.entries(registry)) {
    const tag = parseTag(id);
    if (isTagNamespace(id)) {
      if (definition?.aliases || definition?.implies || definition?.label) {
        throw new Error(`Namespace definition cannot include tag metadata: ${id}`);
      }
    } else {
      if (definition?.canonical && !knownIds.has(definition.canonical)) {
        throw new Error(`Unresolvable canonical tag: ${id} -> ${definition.canonical}`);
      }

      for (const impliedId of definition?.implies ?? []) {
        if (!knownIds.has(impliedId)) {
          throw new Error(`Unresolvable implied tag: ${id} -> ${impliedId}`);
        }
      }

      for (const alias of definition?.aliases ?? []) {
        const normalizedAlias = tagId(tag.namespace, normalizeTagSegment(alias));
        const existing = claimedAliases.get(normalizedAlias);
        if (existing && existing !== id) {
          throw new Error(`Alias is claimed by multiple tags: ${normalizedAlias}`);
        }
        claimedAliases.set(normalizedAlias, id);
      }
    }
  }

  for (const id of knownIds) {
    if (isTagNamespace(id) && !registry[id]) {
      throw new Error(`Bare tag collides with namespace: ${id}`);
    }
  }

  expandTags([], registry);
  for (const id of Object.keys(registry)) {
    canonicalTag(id, registry);
    expandTags([id], registry);
  }
}
