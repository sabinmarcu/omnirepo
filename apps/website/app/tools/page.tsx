import type { Metadata } from 'next';
import { getPathname } from '@/utils/routes.ssr';
import { toolsList } from '@/data/tools/tools';
import { PageLayout } from '@/layouts/PageLayout';
import { ToolCard } from './components/ToolCard';
import { toolsPageStyles } from './page.css';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Tools List',
  };
}

export default async function ToolsList() {
  const list = toolsList ?? [];
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
                <ToolCard key={tool.slug} {...tool} pathname={pathname} />
              ))}
            </>
          )}
      </PageLayout>
      <PageLayout disableTransition />
    </>
  );
}