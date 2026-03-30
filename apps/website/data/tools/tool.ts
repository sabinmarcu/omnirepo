import moize from 'moize';
import { readContentDirectory } from '@/content/readContentDirectory';
import { tocSlug } from '@/utils/toc';
import { readContent } from '@/content/readContent';
import {
  toolsPageMetadataSchema,
  toolsPageSchema,
} from './tools.schema';

const toolsReadOptions = {
  metadataSchema: toolsPageMetadataSchema,
  schema: toolsPageSchema,
} as const;

const toolsListFiles = await readContentDirectory(
  'tools',
  toolsReadOptions,
);

export const toolsList = (
  toolsListFiles
    .map(({ metadata, path }) => ({
      ...metadata,
      path,
    }))
    .filter(Boolean) as unknown as Exclude<typeof toolsListFiles[number]['metadata'] & { path: string }, undefined>[]
)
  .map(({
    title, slug, path,
  }) => ({
    title,
    slug: slug ?? tocSlug(title),
    path,
  } as const));

export const toolSlugs = toolsList.map(
  ({ slug }) => ({ slug }),
);

export const getTool = moize.promise((slug: string) => {
  const tool = toolsList.find(
    ({ slug: toolSlug }) => slug === toolSlug,
  );

  if (!tool) {
    return undefined;
  }

  return readContent(tool.path, toolsReadOptions);
});