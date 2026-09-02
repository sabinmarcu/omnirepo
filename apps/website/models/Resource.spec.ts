import {
  describe,
  expect,
  it,
} from 'vitest';
import { Resource } from './Resource';

describe('Resource locale selection', () => {
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

  const ResourceWithFixtures = {
    getList: async () => resources,
  };

  it('selects the requested locale and retains English-only entries', async () => {
    const list = await Resource.getLocalizedList.call(ResourceWithFixtures as any, 'ro');

    await expect(Promise.all(list.map((resource: any) => resource.slug))).resolves.toEqual([
      'partajat',
      'english-only',
    ]);
  });

  it('selects a localized variant by stable ID', async () => {
    const resource = await Resource.fromId.call(
      ResourceWithFixtures as any,
      'shared',
      'ro',
    );

    await expect(resource?.slug).resolves.toBe('partajat');
  });

  it('returns only locale variants that genuinely exist', async () => {
    const variants = await Resource.getVariants.call(
      ResourceWithFixtures as any,
      'shared',
    );

    await expect(Promise.all(variants.map((resource: any) => resource.locale))).resolves.toEqual([
      'en',
      'ro',
    ]);
  });
});
