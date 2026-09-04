export const tagNamespaces = [
  'skills',
  'tool',
  'project',
  'topics',
  'lang',
  'org',
  'year',
] as const;

export type TagNamespace = typeof tagNamespaces[number];

/** Canonical serialized form: `skills:typescript`, or bare `opensource`. */
export type TagId = string;

export type Tag = {
  id: TagId,
  /** Undefined for bare single-segment tags. */
  namespace?: TagNamespace,
  segments: string[],
};

const canonicalSegmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeTagSegment(input: string): string {
  return input
    .normalize('NFKD')
    .replaceAll(/[\u{0300}-\u{036F}]/gu, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');
}

function assertSegments(segments: string[]) {
  if (segments.length === 0 || segments.length > 3) {
    throw new Error('A tag must contain between one and three segments.');
  }

  if (segments.some((segment) => !canonicalSegmentPattern.test(segment))) {
    throw new Error('Tag segments must use lowercase ASCII letters, numbers, and hyphens.');
  }
}

export function parseTag(id: string): Tag {
  const segments = id.split(':');
  assertSegments(segments);

  const namespace = segments.length > 1 && tagNamespaces.includes(segments[0] as TagNamespace)
    ? segments[0] as TagNamespace
    : undefined;

  return {
    id,
    namespace,
    segments,
  };
}

export function serializeTag({ segments }: Tag): TagId {
  assertSegments(segments);
  return segments.join(':');
}

/** `skills:typescript` <-> ['skills', 'typescript'] for the [...tag] catch-all route. */
export function tagToPathSegments(id: TagId): string[] {
  return [...parseTag(id).segments];
}

export function tagFromPathSegments(segments: string[]): TagId {
  const normalizedSegments = segments.map(normalizeTagSegment);
  assertSegments(normalizedSegments);
  return normalizedSegments.join(':');
}

/** True when `candidate` is `prefix` or sits under it. */
export function tagMatchesPrefix(candidate: TagId, prefix: TagId): boolean {
  const candidateSegments = parseTag(candidate).segments;
  const prefixSegments = parseTag(prefix).segments;

  return prefixSegments.every((segment, index) => candidateSegments[index] === segment);
}
