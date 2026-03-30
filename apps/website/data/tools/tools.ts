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
  toolsPageMetadataSchema,
  toolsPageSchema,
} from './tools.schema';

const readContentOptions = {
  metadataSchema: toolsPageMetadataSchema,
  schema: toolsPageSchema,
} as const;

const toolsListFiles = await readContentDirectory(
  'tools',
  readContentOptions,
);

export const toolsList = (
  toolsListFiles
    .map(({ metadata, path: filePath }) => ({
      ...metadata,
      path: filePath,
    }))
    .filter(Boolean) as unknown as Exclude<typeof toolsListFiles[number]['metadata'] & { path: string }, undefined>[]
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

export const toolSlugs = toolsList.map(
  ({ slug }) => ({ slug }),
);

export const getTool = async (slug: string) => {
  const snippet = toolsList.find(
    ({ slug: toolslug }) => slug === toolslug,
  );

  if (!snippet) {
    return undefined;
  }

  const loadedTool = await readContent(
    snippet.path,
    readContentOptions,
  );

  if (!loadedTool) {
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

  const showcaseContents = await readRawContent(
    resolveFile(loadedTool.data.showcase),
  );

  const previewContents = loadedTool.data.preview
    ? await readRawContent(
      resolveFile(loadedTool.data.preview),
    )
    : showcaseContents;

  return {
    ...loadedTool,
    showcase: showcaseContents.default,
    preview: previewContents.default,
  };
};