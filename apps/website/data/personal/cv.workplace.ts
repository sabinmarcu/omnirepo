import { readContentDirectory } from '@/content/readContentDirectory';
import type { Simplify } from '@sabinmarcu/types';
import {
  workplaceMasterMetadataSchema,
  workplaceSchema,
} from './cv.schema';

export const workplaces = await readContentDirectory(
  'personal/cv/workplace',
  {
    schema: workplaceSchema,
    metadataSchema: workplaceMasterMetadataSchema,
  },
);

export const normalizeCollection = <T extends keyof typeof workplaces[number]['data']>(
  key: T,
): Simplify<(
  & (typeof workplaces[number]['data'][T] extends (infer Result)[] | undefined
    ? { [Key in T]: Result }
    : []
  )
  & { metadata: typeof workplaces[number]['metadata'] }
  )>[] => (workplaces
    .flatMap(({ data, metadata }) => {
      const list = data[key];
      return list?.map((element) => ({
        [key]: element,
        metadata,
      })) ?? [];
    }) as any
  );

export const projects = normalizeCollection('project');

export const experiences = normalizeCollection('experience');

export const degrees = normalizeCollection('degree');

export const publications = normalizeCollection('publication')
  .map((data) => {
    const { publication: { year, ...rest }, metadata } = data;
    return {
      publication: {
        from: year,
        to: year,
        ...rest,
      },
      metadata,
    } as const;
  });