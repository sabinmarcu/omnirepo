import type { Metadata } from 'next';
import { getPathname } from '@/utils/routes.ssr';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { Navigation } from '@/layouts/Navigation';
import { snippetsList } from '@/data/snippets/snippets';
import { PageLayout } from '@/layouts/PageLayout';
import { SnippetCard } from './components/SnippetCard';
import { snippetsPageStyles } from './page.css';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Snippets List',
  };
}

export default async function SnippetsList() {
  const list = snippetsList ?? [];
  const pathname = await getPathname();
  return (
    <RootPageLayout>
      <Navigation />
      <PageLayout
        className={snippetsPageStyles}
        disableFooter
      >
        {list.length === 0
          ? <p>No Snippets</p>
          : (
            <>
              {list.map((snippet) => (
                <SnippetCard {...snippet} pathname={pathname} />
              ))}
            </>
          )}
      </PageLayout>
      <PageLayout disableTransition />
    </RootPageLayout>
  );
}
