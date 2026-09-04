import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  ShowcaseResource,
  showcaseContentSchema,
} from './ShowcaseResource';
import { SourceResource } from './SourceResource';

vi.mock('./SourceResource', () => ({
  SourceResource: { from: vi.fn() },
}));

describe('showcaseContentSchema', () => {
  const showcase = {
    title: 'showcase.tsx',
    children: null,
  };

  it('accepts showcase content without skills', () => {
    expect(showcaseContentSchema.parse({
      showcase,
      children: null,
    }).skill).toBeUndefined();
  });

  it('parses optional skill annotations', () => {
    expect(showcaseContentSchema.parse({
      showcase,
      skill: [
        {
          title: 'TypeScript',
          children: null,
        },
      ],
      children: null,
    }).skill).toHaveLength(1);
  });
});

describe('ShowcaseResource', () => {
  it('synthesizes overview TOC from non-annotation MDX headings', async () => {
    const resource = ShowcaseResource.from({});
    Object.assign(resource, {
      pathDefinition: Promise.resolve({ dirname: 'snippets' }),
      content: Promise.resolve({
        showcase: {
          title: 'showcase.tsx',
          children: null,
        },
        children: {
          props: { children: 'Overview content' },
        },
      }),
      toc: Promise.resolve([
        {
          depth: 2,
          value: 'Intro',
          attributes: { id: 'intro' },
          children: [],
        },
        {
          depth: 3,
          value: '!!file CSS',
          attributes: { id: 'file-css' },
          children: [],
        },
        {
          depth: 2,
          value: 'Details',
          attributes: { id: 'details' },
          children: [],
        },
      ]),
    });

    await resource.overview;

    expect(SourceResource.from).toHaveBeenCalledWith(
      'Overview content',
      expect.objectContaining({
        prefix: 'snippets',
        toc: [
          expect.objectContaining({ value: 'Intro' }),
          expect.objectContaining({ value: 'Details' }),
        ],
      }),
    );
  });
});
