#!/usr/bin/env node

import { createHash } from 'node:crypto';
import {
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

const contentDirectory = path.resolve('apps/website/content');
const writeHashes = process.argv.includes('--write');
const sourceHashPattern = /^export const sourceHash = '([a-f0-9]+)'\n/m;
const languageNeutralDirectories = new Set(['snippets']);

const hash = (content) => createHash('sha256').update(content).digest('hex');
const relativePath = (file) => path.relative(process.cwd(), file);

async function getFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? getFiles(entryPath)
      : [entryPath];
  }));

  return nestedFiles.flat();
}

const files = await getFiles(contentDirectory);
const sourceFiles = files.filter((file) => (
  file.endsWith('.mdx')
  && !file.endsWith('.ro.mdx')
  && !languageNeutralDirectories.has(path.relative(contentDirectory, file).split(path.sep)[0])
));
const missing = [];
const untracked = [];
const stale = [];

for (const sourceFile of sourceFiles) {
  const translationFile = sourceFile.replace(/\.mdx$/, '.ro.mdx');
  const sourceContent = await readFile(sourceFile, 'utf8');
  const sourceHash = hash(sourceContent);

  try {
    const translationContent = await readFile(translationFile, 'utf8');
    const storedHash = sourceHashPattern.exec(translationContent)?.[1];

    if (writeHashes) {
      const nextContent = sourceHashPattern.test(translationContent)
        ? translationContent.replace(sourceHashPattern, `export const sourceHash = '${sourceHash}'\n\n`)
        : `export const sourceHash = '${sourceHash}'\n\n${translationContent}`;
      await writeFile(translationFile, nextContent);
    } else if (!storedHash) {
      untracked.push(sourceFile);
    } else if (storedHash !== sourceHash) {
      stale.push(sourceFile);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      missing.push(sourceFile);
      continue;
    }
    throw error;
  }
}

if (writeHashes) {
  process.stdout.write(`Updated source hashes for ${sourceFiles.length - missing.length} Romanian translations.\n`);
} else {
  for (const file of missing) {
    process.stdout.write(`missing: ${relativePath(file)}\n`);
  }
  for (const file of untracked) {
    process.stdout.write(`untracked: ${relativePath(file)}\n`);
  }
  for (const file of stale) {
    process.stdout.write(`stale: ${relativePath(file)}\n`);
  }

  if (missing.length + untracked.length + stale.length === 0) {
    process.stdout.write('Translation status: current.\n');
  }
}
