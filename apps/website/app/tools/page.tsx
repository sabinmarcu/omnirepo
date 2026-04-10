import type { Metadata } from 'next';
import { getPathname } from '@/utils/routes.ssr';
import { PageLayout } from '@/layouts/PageLayout';
import { ToolResource } from '@/models/ToolResource';
import { ShowcaseCard } from '@/components/ShowcaseCard';
import { toolsPageStyles } from './page.css';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Tools List',
  };
}

export default async function ToolsList() {
  const list = await ToolResource.getList() ?? [];
  const pathname = await getPathname();
  return (
    <>
      <PageLayout
        className={toolsPageStyles}
        disableFooter
      >
        {list.length === 0
          ? <p>No Tools</p>
          : (
            <>
              {list.map((tool) => (
                <ShowcaseCard
                  key={tool.slug}
                  resource={tool}
                  pathname={pathname}
                />
              ))}
            </>
          )}
      </PageLayout>
      <PageLayout disableTransition />
    </>
  );
}
