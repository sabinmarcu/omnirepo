import {
  describe,
  expect,
  it,
} from 'vitest';
import { TagResource } from './TagResource';

describe('TagResource', () => {
  it('maps flat dotted filenames to canonical tag IDs', async () => {
    const resource = new TagResource('tags/skills.typescript.ro.mdx');

    await expect(resource.id).resolves.toBe('skills.typescript');
    await expect(resource.locale).resolves.toBe('ro');
    await expect(resource.tagId).resolves.toBe('skills:typescript');
  });

  it('accepts title-less metadata', async () => {
    const resource = TagResource.from(Promise.resolve({
      default: null,
      toc: [],
    }));

    await expect(resource.metadata).resolves.toEqual({
      toc: [],
    });
  });
});
