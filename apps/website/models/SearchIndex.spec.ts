import {
  describe,
  expect,
  it,
} from 'vitest';
import type { SearchDocument } from './SearchDocument';
import { SearchIndex } from './SearchIndex';

const documents: SearchDocument[] = [
  {
    id: 'project:compiler',
    title: 'TypeScript compiler project',
    text: 'A project about compiler tooling',
    type: 'project',
    location: { pathname: '/personal/cv' },
    tags: ['skills:typescript'],
  },
  {
    id: 'tool:typescript',
    title: 'Toolbox',
    text: 'TypeScript utilities',
    type: 'tool',
    location: {
      pathname: '/tools/[slug]',
      params: { slug: 'typescript' },
    },
    tags: ['skills:typescript'],
  },
];

describe('SearchIndex', () => {
  const index = new SearchIndex(documents);

  it('boosts title matches above body and tag matches', () => {
    expect(index.search('typescript').map(({ id }) => id)).toEqual([
      'project:compiler',
      'tool:typescript',
    ]);
  });

  it('supports fuzzy prefixes and content-type filtering', () => {
    expect(index.search('typescr', 'tool').map(({ id }) => id)).toEqual([
      'tool:typescript',
    ]);
    expect(index.search('typescr', 'snippet')).toEqual([]);
  });

  it('does not return an unfiltered corpus for an empty query', () => {
    expect(index.search(' '.repeat(3))).toEqual([]);
  });
});
