import fs from 'node:fs/promises';
import path from 'node:path';

import type {
  ZodAny,
  ZodType,
} from 'zod';
import { contentPath } from '@/constants/paths';
import { readContent } from './readContent';

export async function readContentDirectory(directoryPath: string): Promise<string[]>;

export async function readContentDirectory<
  Schema extends ZodType,
  MetadataSchema extends ZodType = ZodAny,
>(
  directoryPath: string,
  options?: readContent.Options<Schema, MetadataSchema>,
): Promise<Awaited<ReturnType<typeof readContent<Schema, MetadataSchema>>>[]>;

export async function readContentDirectory(
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
    ));

  if (options === undefined) {
    return paths;
  }

  return Promise.all(
    paths.map((filePath) => readContent(filePath, options)),
  );
}

