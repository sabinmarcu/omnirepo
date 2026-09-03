import type { TagId } from '@/models/Tag';

export const ignoredTagPatterns = [
  'skills:*',
] as const;

export function isIgnoredTag(id: TagId): boolean {
  const segments = id.split(':');
  return ignoredTagPatterns.some((pattern) => {
    const patternSegments = pattern.split(':');
    return (
      patternSegments.length === segments.length
      && patternSegments.every((segment, index) => (
        segment === '*' || segment === segments[index]
      ))
    );
  });
}
