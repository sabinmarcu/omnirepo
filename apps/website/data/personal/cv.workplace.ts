import { readContentDirectory } from '@/content/readContentDirectory';
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

export const projects = workplaces
  .flatMap(({ data: { project: list }, metadata }) => (
    list?.map((project) => ({
      project,
      metadata,
    })) ?? []
  ));

export const experiences = workplaces
  .flatMap(({ data: { experience: list }, metadata }) => (
    list?.map((experience) => ({
      experience,
      metadata,
    })) ?? []
  ));
