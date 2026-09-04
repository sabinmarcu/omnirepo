import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { canonicalMetadata } from '@/i18n/metadata';
import { Navigation } from '@/layouts/Navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { sortByModifiedAt } from '@/models/ContentResource';
import { ToolResource } from '@/models/ToolResource';
import { ShowcaseList } from '@/components/ShowcaseList';

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
  const list = await sortByModifiedAt(await ToolResource.getLocalizedList(locale));
  return (
    <>
      <Navigation />
      <PageLayout>
        {list.length === 0
          ? <p>{translate('noTools')}</p>
          : <ShowcaseList resources={list} pathname="/tools" />}
      </PageLayout>
    </>
  );
}
