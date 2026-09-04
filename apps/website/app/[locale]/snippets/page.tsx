import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { canonicalMetadata } from '@/i18n/metadata';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { Navigation } from '@/layouts/Navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { sortByModifiedAt } from '@/models/ContentResource';
import { SnippetResource } from '@/models/SnippetResource';
import { ShowcaseList } from '@/components/ShowcaseList';

export async function generateMetadata(
  { params }: PageProps<'/[locale]/snippets'>,
): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Snippets List',
    ...await canonicalMetadata(locale, '/snippets'),
  };
}

export default async function SnippetsList({
  params,
}: PageProps<'/[locale]/snippets'>) {
  const translate = await getTranslations('lists');
  const { locale } = await params;
  const list = await sortByModifiedAt(await SnippetResource.getLocalizedList(locale));
  return (
    <RootPageLayout theme="snippets">
      <Navigation />
      <PageLayout>
        {list.length === 0
          ? <p>{translate('noSnippets')}</p>
          : <ShowcaseList resources={list} pathname="/snippets" />}
      </PageLayout>
    </RootPageLayout>
  );
}
