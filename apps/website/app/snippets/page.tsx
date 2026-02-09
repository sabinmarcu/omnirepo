import Link from 'next/link';
import type { Metadata } from 'next';
import {
  extendPathname,
} from '@/utils/routes';
import { getPathname } from '@/utils/routes.ssr';
import { landingPageWrapper } from '../page.css';
import { snippetsList } from './data';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Snippets List',
  };
}

export default async function SnippetsList() {
  const list = snippetsList ?? [];
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
