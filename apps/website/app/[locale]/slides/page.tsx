import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DeckList } from '@/components/slides/DeckList';
import { canonicalMetadata } from '@/i18n/metadata';
import { Navigation } from '@/layouts/Navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { sortByModifiedAt } from '@/models/ContentResource';
import { SlideDeckResource } from '@/models/SlideDeckResource';

export async function generateMetadata(
  { params }: PageProps<'/[locale]/slides'>,
): Promise<Metadata> {
  const { locale } = await params;
  const translate = await getTranslations('slides');
  return {
    title: translate('title'),
    description: translate('description'),
    ...await canonicalMetadata(locale, '/slides'),
  };
}

export default async function SlidesPage({ params }: PageProps<'/[locale]/slides'>) {
  const { locale } = await params;
  const [translate, decks] = await Promise.all([
    getTranslations('slides'),
    sortByModifiedAt(await SlideDeckResource.getLocalizedList(locale)),
  ]);

  return (
    <RootPageLayout theme="slides">
      <Navigation />
      <PageLayout>
        <DeckList
          empty={translate('empty')}
          locale={locale}
          resources={decks}
        />
      </PageLayout>
    </RootPageLayout>
  );
}
