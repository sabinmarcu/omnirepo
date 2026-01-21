import type { Metadata } from 'next';
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
  const cards = await Promise.all(
    list.map(async (tool) => (
      <ShowcaseCard
        key={await tool.slug}
        resource={tool}
        pathname={'/tools'}
      />
    )),
  );
  return (
    <>
      <PageLayout
        className={toolsPageStyles}
        disableFooter
      >
        {cards.length === 0
          ? <p>No Tools</p>
          : (
            <>
              {cards}
            </>
          )}
      </PageLayout>
      <PageLayout disableTransition />
    </>
  );
}
