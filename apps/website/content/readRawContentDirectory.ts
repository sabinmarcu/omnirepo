import fs from 'node:fs/promises';
import path from 'node:path';
import moize from 'moize';

import { contentPath } from '@/constants/paths';

async function readRawContentDirectoryRaw(directoryPath: string): Promise<string[]>;

async function readRawContentDirectoryRaw(
  directoryPath: string,
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

  return paths;
}

export const readRawContentDirectory = (
  moize.promise(readRawContentDirectoryRaw) as
  unknown as typeof readRawContentDirectoryRaw
);
