import { readContentDirectory } from '@/content/readContentDirectory';
import fs from 'node:fs/promises';
import { tocSlug } from '@/utils/toc';
import { readContent } from '@/content/readContent';
import { contentPath } from '@/constants/paths';
import path from 'node:path';
import type {
  ReactElement,
  ReactNode,
} from 'react';
import { readRawContent } from '@/content/readRawContent';
import {
  snippetsPageMetadataSchema,
  snippetsPageSchema,
} from './snippets.schema';
import { parseRawCode } from './snippets.parser';

const readContentOptions = {
  metadataSchema: snippetsPageMetadataSchema,
  schema: snippetsPageSchema,
} as const;

const snippetsListFiles = await readContentDirectory(
  'snippets',
  readContentOptions,
);

export const snippetsList = (
  snippetsListFiles
    .map(({ metadata, path: filePath }) => ({
      ...metadata,
      path: filePath,
    }))
    .filter(Boolean) as unknown as Exclude<typeof snippetsListFiles[number]['metadata'] & { path: string }, undefined>[]
)
  .map(({
    title,
    slug,
    path: filePath,
  }) => ({
    title,
    slug: slug ?? tocSlug(title),
    path: filePath,
  } as const));

export const snippetSlugs = snippetsList.map(
  ({ slug }) => ({ slug }),
);

export const getSnippet = async (slug: string) => {
  const snippet = snippetsList.find(
    ({ slug: snippetSlug }) => slug === snippetSlug,
  );

  if (!snippet) {
    return undefined;
  }

  const loadedSnippet = await readContent(
    snippet.path,
    readContentOptions,
  );

  if (!loadedSnippet) {
    return undefined;
  }

  const resolveFile = (file: string) => {
    const resolvedFile = (
      path.join(
        path.dirname(snippet.path),
        file,
      )
    );
    return resolvedFile;
  };

  const previewContents = await readRawContent(
    resolveFile(loadedSnippet.data.preview),
  );

  const pages: (
    & { title: string, slug: string }
    & (
      | { content: ReactNode }
      | { content: (
        Omit<ReturnType<typeof parseRawCode>[number], 'content'>
        & {
          content: {
            value: ReturnType<typeof parseRawCode>[number]['content'],
            lang: string,
            meta: string,
          }
        }
      )[] }
      | { content: ReactElement }
    )
  )[] = [
    {
      title: 'Preview',
      slug: '',
      content: previewContents.default,
    },
    loadedSnippet.data.children
      ? {
        title: 'Overview',
        slug: 'overview',
        content: loadedSnippet.data.children,
      }
      : undefined,
    ...await Promise.all(
      loadedSnippet.data.file.map(async ({
        title,
        slug: fileSlug,
        lang,
        source,
      }) => {
        const contentGroups = parseRawCode(await fs.readFile(
          path.resolve(
            contentPath,
            resolveFile(source),
          ),
          'utf8',
        ));
        const partial = {
          lang: lang ?? source.split('.').at(-1),
          meta: fileSlug,
        };
        return {
          title,
          slug: fileSlug,
          content: contentGroups.map((content) => ({
            title: content.title,
            variant: content.variant,
            comment: content.comment,
            content: {
              ...partial,
              value: content.content,
            },
          })),
        };
      }),
    ),
  ].filter(Boolean) as any;

  return {
    ...loadedSnippet,
    pages,
  };
};
