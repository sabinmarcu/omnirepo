import moize from 'moize';
import { readContentDirectory } from '@/content/readContentDirectory';
import { tocSlug } from '@/utils/toc';
import { readContent } from '@/content/readContent';
import {
  snippetsPageMetadataSchema,
  snippetsPageSchema,
} from './snippets.schema';

const snippetsReadOptions = {
  metadataSchema: snippetsPageMetadataSchema,
  schema: snippetsPageSchema,
} as const;

const snippetsListFiles = await readContentDirectory(
  'snippets',
  snippetsReadOptions,
);

export const snippetsList = (
  snippetsListFiles
    .map(({ metadata, path }) => ({
      ...metadata,
      path,
    }))
    .filter(Boolean) as unknown as Exclude<typeof snippetsListFiles[number]['metadata'] & { path: string }, undefined>[]
)
  .map(({
    title, slug, path,
  }) => ({
    title,
    slug: slug ?? tocSlug(title),
    path,
  } as const));

export const snippetSlugs = snippetsList.map(
  ({ slug }) => ({ slug }),
);

export const getSnippet = moize.promise((slug: string) => {
  const snippet = snippetsList.find(
    ({ slug: snippetSlug }) => slug === snippetSlug,
  );

  if (!snippet) {
    return undefined;
  }

  return readContent(snippet.path, snippetsReadOptions);
});
