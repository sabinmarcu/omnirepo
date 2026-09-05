import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  contentMetadataSchema,
  formatContentDate,
  sortByModifiedAt,
} from './ContentResource';

describe('contentMetadataSchema', () => {
  it('accepts canonical tags and DD.MM.YYYY calendar dates', () => {
    expect(contentMetadataSchema.parse({
      title: 'Example',
      tags: ['lang:typescript', 'tool:react'],
      createdAt: '04.09.2026',
      modifiedAt: '04.09.2026',
      toc: [],
    })).toMatchObject({
      tags: ['lang:typescript', 'tool:react'],
    });
  });

  it('rejects non-canonical tags and invalid dates', () => {
    expect(() => contentMetadataSchema.parse({
      title: 'Example',
      tags: ['TypeScript'],
      createdAt: '2026-09-04',
      modifiedAt: 'September 4, 2026',
      toc: [],
    })).toThrow();
  });

  it('sorts content by latest modification, creation date, then title', async () => {
    const resources = await sortByModifiedAt([
      {
        createdAt: Promise.resolve('02.09.2026'),
        modifiedAt: Promise.resolve('02.09.2026'),
        title: Promise.resolve('Zulu'),
      },
      {
        createdAt: Promise.resolve('03.09.2026'),
        modifiedAt: Promise.resolve('04.09.2026'),
        title: Promise.resolve('Bravo'),
      },
      {
        createdAt: Promise.resolve('04.09.2026'),
        modifiedAt: Promise.resolve('04.09.2026'),
        title: Promise.resolve('Alpha'),
      },
      {
        createdAt: Promise.resolve('04.09.2026'),
        modifiedAt: Promise.resolve('04.09.2026'),
        title: Promise.resolve('Able'),
      },
    ]);

    await expect(Promise.all(resources.map(async ({ title }) => title))).resolves.toEqual([
      'Able',
      'Alpha',
      'Bravo',
      'Zulu',
    ]);
  });

  it('formats authored dates with the requested locale', () => {
    expect(formatContentDate('04.09.2026', 'en')).toBe('September 4, 2026');
    expect(formatContentDate('04.09.2026', 'ro')).toBe('4 septembrie 2026');
  });
});
