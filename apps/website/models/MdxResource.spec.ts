import {
  describe,
  expect,
  it,
} from 'vitest';
import { MdxResource } from './MdxResource';

describe('MdxResource locale selection', () => {
  const resources = [
    {
      id: Promise.resolve('shared'),
      locale: Promise.resolve('en'),
      slug: Promise.resolve('shared'),
    },
    {
      id: Promise.resolve('shared'),
      locale: Promise.resolve('ro'),
      slug: Promise.resolve('partajat'),
    },
    {
      id: Promise.resolve('english-only'),
      locale: Promise.resolve('en'),
      slug: Promise.resolve('english-only'),
    },
  ];

  const Resource = {
    getList: async () => resources,
  };

  it('falls back to English when a requested slug has no localized variant', async () => {
    const resource = await MdxResource.fromSlug.call(
      Resource as any,
      'english-only',
      'ro',
    );

    await expect(resource?.locale).resolves.toBe('en');
  });

  it('uses a matching stable ID to select a variant with a translated slug', async () => {
    const resource = await MdxResource.fromSlug.call(
      Resource as any,
      'shared',
      'ro',
    );

    await expect(resource?.slug).resolves.toBe('partajat');
  });
});
