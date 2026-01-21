import Link from 'next/link';
import path from 'node:path';
import fs from 'node:fs';
import type { Metadata } from 'next';
import {
  extendPathname,
} from '@/utils/routes';
import { getPathname } from '@/utils/routes.ssr';
import { contentPath } from '@/constants/paths';
import { landingPageWrapper } from '../page.css';
import { getTitle } from '../utils/getTitle';

export const metadata: Metadata = {
  title: getTitle('Snippets'),
};

const snippetsPath = path.resolve(contentPath, 'snippets');

async function getSnippetsList() {
  const files = await Promise.all(fs.readdirSync(
    snippetsPath,
  ).map(
    async (filename) => {
      const { frontmatter } = await import(`content/snippets/${filename}`);
      return {
        title: frontmatter?.title ?? filename,
        slug: frontmatter?.slug ?? filename.slice(
          (Math.max(filename.indexOf('/'), 0)),
          filename.lastIndexOf('.'),
        ),
      } as const;
    },
  ));

  return files;
}

export default async function SnippetsList() {
  const list = await getSnippetsList() ?? [];
  const pathname = await getPathname();
  const getSlug = extendPathname.bind(undefined, pathname);
  return (
    <main className={ landingPageWrapper }>
      {list.length === 0
        ? <p>No Snippets</p>
        : (
          <ul>
            {list.map(({ slug, title }) => (
              <li key={slug}><Link href={getSlug(slug) as any}>{title}</Link></li>
            ))}
          </ul>
        )}
    </main>
  );
}
