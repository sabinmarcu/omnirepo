import type { Metadata } from 'next';
import { getPathname } from '@/utils/routes.ssr';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { Navigation } from '@/layouts/Navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { SnippetResource } from '@/models/SnippetResource';
import { ShowcaseCard } from '@/components/ShowcaseCard';
import { snippetsPageStyles } from './page.css';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Snippets List',
  };
}

export default async function SnippetsList() {
  const list = await SnippetResource.getList() ?? [];
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
                <ShowcaseCard
                  key={snippet.slug}
                  resource={snippet}
                  pathname={pathname}
                />
              ))}
            </>
          )}
      </PageLayout>
      <PageLayout disableTransition />
    </RootPageLayout>
  );
}
