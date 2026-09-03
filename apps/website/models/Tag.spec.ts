import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  normalizeTagSegment,
  parseTag,
  serializeTag,
  tagFromPathSegments,
  tagMatchesPrefix,
  tagToPathSegments,
} from './Tag';

describe('Tag', () => {
  it('normalizes display names into stable segments', () => {
    expect(normalizeTagSegment('Vanilla Extract')).toBe('vanilla-extract');
    expect(normalizeTagSegment('Caf\u{00E9}')).toBe('cafe');
    expect(normalizeTagSegment('Vanilla Extract')).toBe(normalizeTagSegment('vanilla-extract'));
  });

  it('round-trips canonical tag IDs and route segments', () => {
    const tag = parseTag('skills:typescript');

    expect(tag).toMatchObject({
      namespace: 'skills',
      segments: ['skills', 'typescript'],
    });
    expect(serializeTag(tag)).toBe('skills:typescript');
    expect(tagToPathSegments(tag.id)).toEqual(['skills', 'typescript']);
    expect(tagFromPathSegments(['Skills', 'TypeScript'])).toBe('skills:typescript');
  });

  it('supports bare tags and rejects paths deeper than three segments', () => {
    expect(parseTag('opensource')).toMatchObject({
      namespace: undefined,
      segments: ['opensource'],
    });
    expect(() => parseTag('one:two:three:four')).toThrow('between one and three');
  });

  it('matches prefixes by segments instead of raw string prefixes', () => {
    expect(tagMatchesPrefix('skills:typescript', 'skills')).toBe(true);
    expect(tagMatchesPrefix('skills:typescript', 'skills:type')).toBe(false);
  });
});
