import fs from 'node:fs/promises';
import path from 'node:path';
import moize from 'moize';

import type {
  ZodAny,
  ZodType,
} from 'zod';
import { contentPath } from '@/constants/paths';
import { readContent } from './readContent';

async function readContentDirectoryRaw(directoryPath: string): Promise<string[]>;

async function readContentDirectoryRaw<
  Schema extends ZodType,
  MetadataSchema extends ZodType = ZodAny,
>(
  directoryPath: string,
  options?: readContent.Options<Schema, MetadataSchema>,
): Promise<
  Exclude<
    Awaited<ReturnType<typeof readContent<Schema, MetadataSchema>>>,
    undefined
  >[]
>;

async function readContentDirectoryRaw(
  directoryPath: string,
  options?: any,
) {
  const resolvedPath = path.resolve(contentPath, directoryPath);
  const files = await fs.readdir(resolvedPath);
  const paths = files
    .map((file) => path.resolve(resolvedPath, file))
    .map((absolutePath) => path.relative(
      contentPath,
      absolutePath,
    ))
    .filter(Boolean);

  if (options === undefined) {
    return paths;
  }

  const contents = await Promise.all(
    paths.map((filePath) => readContent(filePath, options)),
  );

  return contents.filter(Boolean);
}

export const readContentDirectory = (
  moize.promise(readContentDirectoryRaw) as
  unknown as typeof readContentDirectoryRaw
);
