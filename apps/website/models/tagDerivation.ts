import {
  expandTags,
  resolveTag,
  type TagRegistry,
} from './TagRegistry';
import type { TagId } from './Tag';

export type EntryTagDerivation = {
  /** Canonical tags declared directly by the resource. */
  authoredTags: TagId[],
  /** Tags to remove after the full implication closure is expanded. */
  excludedTags?: TagId[],
};

export type DerivedEntryTags = {
  authoredTags: TagId[],
  tags: TagId[],
  deadExclusions: TagId[],
};

function uniqueSorted(tags: readonly TagId[]): TagId[] {
  return [...new Set(tags)].toSorted((left, right) => left.localeCompare(right));
}

function yearFromDate(value: string): number | undefined {
  const year = /\b(?:19|20)\d{2}\b/.exec(value)?.[0];
  return year ? Number(year) : undefined;
}

export function deriveYearTags(
  from: string,
  to: string,
  currentYear = new Date().getFullYear(),
): TagId[] {
  const fromYear = yearFromDate(from);
  if (!fromYear) {
    return [];
  }

  const toYear = yearFromDate(to) ?? currentYear;
  if (toYear < fromYear) {
    return [];
  }

  return Array.from(
    { length: toYear - fromYear + 1 },
    (_, index) => `year:${fromYear + index}`,
  );
}

export function deriveSkillTag(skill: string): TagId {
  return resolveTag('skills', skill);
}

export function deriveCvTags({
  company,
  from,
  to,
  tag,
  featured = false,
  skills = [],
}: {
  company: string,
  from: string,
  to: string,
  tag?: string,
  featured?: boolean,
  skills?: string[],
}): TagId[] {
  return uniqueSorted([
    ...skills.map(deriveSkillTag),
    ...(tag && tag !== 'unknown' ? [resolveTag(undefined, tag)] : []),
    ...(featured ? [resolveTag(undefined, 'featured')] : []),
    ...(company.trim() ? [resolveTag('org', company)] : []),
    ...deriveYearTags(from, to),
  ]);
}

/**
 * Keeps display tags faithful to authored content while producing the complete
 * queryable set. Exclusions deliberately run after implication expansion.
 */
export function deriveEntryTags(
  { authoredTags, excludedTags = [] }: EntryTagDerivation,
  registry?: TagRegistry,
): DerivedEntryTags {
  const normalizedAuthoredTags = uniqueSorted(authoredTags);
  const expandedTags = expandTags(normalizedAuthoredTags, registry);
  const exclusions = new Set(excludedTags);

  return {
    authoredTags: normalizedAuthoredTags,
    tags: expandedTags.filter((tag) => !exclusions.has(tag)),
    deadExclusions: uniqueSorted(excludedTags.filter((tag) => !expandedTags.includes(tag))),
  };
}
