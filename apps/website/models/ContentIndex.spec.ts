import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  ContentIndex,
  type IndexEntryInput,
} from './ContentIndex';
import type { TagRegistry } from './TagRegistry';

vi.mock('./CVResource', () => ({
  CVResource: { fromDefault: vi.fn() },
  getExperienceAnchor: vi.fn(),
  getProjectAnchor: vi.fn(),
}));
vi.mock('./SnippetResource', () => ({
  SnippetResource: { getLocalizedList: vi.fn() },
}));
vi.mock('./ProjectResource', () => ({
  ProjectResource: { getLocalizedList: vi.fn() },
}));
vi.mock('./ToolResource', () => ({
  ToolResource: { getLocalizedList: vi.fn() },
}));

describe('ContentIndex', () => {
  const registry: TagRegistry = {
    'skills:react': { implies: ['topics:frontend', 'lang:typescript'] },
  };
  const entries: IndexEntryInput[] = [
    {
      id: 'project:older',
      type: 'cv-project',
      title: 'Older React project',
      location: { pathname: '/personal/cv' },
      locale: 'en',
      from: '2020',
      authoredTags: ['skills:react'],
    },
    {
      id: 'project:newer',
      type: 'cv-project',
      title: 'Newer React project',
      location: { pathname: '/personal/cv' },
      locale: 'en',
      from: '2024',
      authoredTags: ['skills:react', 'skills:react'],
    },
  ];

  it('keeps authored tags separate from the expanded queryable set', () => {
    const index = new ContentIndex(entries, registry);
    const [entry] = index.byTag('skills:react');

    expect(entry.authoredTags).toEqual(['skills:react']);
    expect(entry.tags).toEqual(['lang:typescript', 'skills:react', 'topics:frontend']);
  });

  it('deduplicates prefix matches and sorts them chronologically', () => {
    const index = new ContentIndex(entries, registry);

    expect(index.has('topics')).toBe(true);
    expect(index.byTagPrefix('topics:frontend').map(({ id }) => id)).toEqual([
      'project:newer',
      'project:older',
    ]);
  });

  it('applies exclusions after implication expansion', () => {
    const index = new ContentIndex([
      {
        ...entries[0],
        excludedTags: ['lang:typescript'],
      },
    ], registry);

    expect(index.byTag('lang:typescript')).toEqual([]);
    expect(index.byTag('topics:frontend')).toHaveLength(1);
  });

  it('does not treat partial tag segments as prefixes', () => {
    const index = new ContentIndex(entries, registry);

    expect(index.byTagPrefix('skills:rea')).toEqual([]);
  });

  it('ranks related entries by shared tags', () => {
    const index = new ContentIndex([
      ...entries,
      {
        id: 'project:typescript',
        type: 'cv-project',
        title: 'TypeScript project',
        location: { pathname: '/personal/cv' },
        locale: 'en',
        authoredTags: ['lang:typescript'],
      },
    ], registry);

    expect(index.related('project:newer').map(({ id }) => id)).toEqual([
      'project:older',
      'project:typescript',
    ]);
  });
});
