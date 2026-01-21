import fsp from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { personalPagesPath } from '@/constants/paths';

const filenameOfContent = 'content.mdx';

export async function getPersonalPagesList() {
  const maybeDirectories = await fsp.readdir(personalPagesPath);
  const directories = maybeDirectories
    .map((maybeDirectory) => path.resolve(personalPagesPath, maybeDirectory))
    .filter(
      (maybeDirectory) => fs.statSync(maybeDirectory).isDirectory(),
    );
  const directoriesToSearch = [
    personalPagesPath,
    ...directories,
  ];
  const entries: { title: string, slug: string }[] = [];
  for (const directory of directoriesToSearch) {
    const contentPath = path.resolve(directory, filenameOfContent);
    if (fs.existsSync(contentPath)) {
      const target = path.relative(personalPagesPath, contentPath);
      const { title } = await import(`./${target}`);
      const pathSegments = target.split('/');
      const slug = pathSegments.length <= 1
        ? ''
        : pathSegments.at(0)!;

      entries.push({
        title: title ?? pathSegments.at(-1),
        slug,
      });
    }
  }
  return entries;
}

