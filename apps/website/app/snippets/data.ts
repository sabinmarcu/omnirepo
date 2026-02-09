import { readContentDirectory } from '@/content/readContentDirectory';
import { tocSlug } from '@/utils/toc';
import z from 'zod';

const metadataSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
});

const snippetsListFiles = await readContentDirectory(
  'snippets',
  {
    metadataSchema,
    schema: z.any(),
  },
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

export const getSnippet = (slug: string) => {
  const snippet = snippetsList.find(
    ({ slug: snippetSlug }) => slug === snippetSlug,
  );
  return snippet;
};
