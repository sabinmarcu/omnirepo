import Link from 'next/link';
import type { Metadata } from 'next';
import {
  extendPathname,
} from '@/utils/routes';
import { getPathname } from '@/utils/routes.ssr';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { Navigation } from '@/layouts/Navigation';
import { snippetsList } from '@/data/snippets/snippets';
import { landingPageWrapper } from '../page.css';

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
    <RootPageLayout>
      <Navigation />
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
    </RootPageLayout>
  );
}
