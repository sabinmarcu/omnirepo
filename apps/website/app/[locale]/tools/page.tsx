import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { canonicalMetadata } from '@/i18n/metadata';
import { Navigation } from '@/layouts/Navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { ToolResource } from '@/models/ToolResource';
import { ShowcaseCard } from '@/components/ShowcaseCard';
import { toolsPageStyles } from './page.css';

export async function generateMetadata(
  { params }: PageProps<'/[locale]/tools'>,
): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Tools List',
    ...await canonicalMetadata(locale, '/tools'),
  };
}

export default async function ToolsList({
  params,
}: PageProps<'/[locale]/tools'>) {
  const translate = await getTranslations('lists');
  const { locale } = await params;
  const list = await ToolResource.getLocalizedList(locale);
  const cards = await Promise.all(
    list.map(async (tool) => (
      <ShowcaseCard
        key={await tool.id}
        resource={tool}
        pathname="/tools"
      />
    )),
  );
  return (
    <>
      <Navigation />
      <PageLayout>
        <div className={toolsPageStyles}>
          {cards.length === 0
            ? <p>{translate('noTools')}</p>
            : (
              <>
                {cards}
              </>
            )}
        </div>
      </PageLayout>
    </>
  );
}
