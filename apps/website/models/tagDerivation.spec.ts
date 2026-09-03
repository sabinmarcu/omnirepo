import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  deriveCvTags,
  deriveEntryTags,
  deriveSkillTag,
  deriveYearTags,
} from './tagDerivation';
import type { TagRegistry } from './TagRegistry';

describe('deriveEntryTags', () => {
  const registry: TagRegistry = {
    'skills:react': {
      implies: ['lang:typescript', 'topics:frontend'],
    },
  };

  it('keeps authored tags separate from the queryable implication closure', () => {
    expect(deriveEntryTags({
      authoredTags: ['skills:react', 'skills:react'],
    }, registry)).toMatchObject({
      authoredTags: ['skills:react'],
      tags: ['lang:typescript', 'skills:react', 'topics:frontend'],
    });
  });

  it('expands before subtracting exclusions', () => {
    expect(deriveEntryTags({
      authoredTags: ['skills:react'],
      excludedTags: ['lang:typescript'],
    }, registry)).toMatchObject({
      authoredTags: ['skills:react'],
      tags: ['skills:react', 'topics:frontend'],
      deadExclusions: [],
    });
  });

  it('reports exclusions that no longer remove a tag', () => {
    expect(deriveEntryTags({
      authoredTags: ['skills:react'],
      excludedTags: ['lang:javascript'],
    }, registry).deadExclusions).toEqual(['lang:javascript']);
  });

  it('derives canonical CV tags from existing content fields', () => {
    expect(deriveCvTags({
      company: 'R/GA',
      from: 'June 2018',
      to: 'November 2019',
      tag: 'opensource',
      featured: true,
      skills: ['ReactJS', 'Vanilla Extract'],
    })).toEqual([
      'featured',
      'opensource',
      'org:r-ga',
      'skills:react',
      'skills:vanilla-extract',
      'year:2018',
      'year:2019',
    ]);
  });

  it('expands present date ranges through the supplied current year', () => {
    expect(deriveYearTags('2024', 'Present', 2026)).toEqual([
      'year:2024',
      'year:2025',
      'year:2026',
    ]);
  });

  it('keeps unregistered skills usable', () => {
    expect(deriveSkillTag('Some Unheard Of Thing')).toBe('skills:some-unheard-of-thing');
  });

  it('canonicalizes equivalent skill tags before indexing', () => {
    const registry: TagRegistry = {
      'skills:typescript': { canonical: 'lang:typescript' },
      'lang:typescript': { label: 'TypeScript' },
    };

    expect(deriveEntryTags({
      authoredTags: ['skills:typescript'],
    }, registry)).toMatchObject({
      authoredTags: ['lang:typescript'],
      tags: ['lang:typescript'],
    });
  });
});
