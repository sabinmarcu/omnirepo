import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { showcaseContentSchema } from './ShowcaseResource';

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
