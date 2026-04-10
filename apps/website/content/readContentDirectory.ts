import moize from 'moize';

import type {
  ZodAny,
  ZodType,
} from 'zod';
import { readContent } from './readContent';
import { readRawContentDirectory } from './readRawContentDirectory';

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
  const paths = await readRawContentDirectory(directoryPath);

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
