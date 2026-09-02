import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { canonicalMetadata } from '@/i18n/metadata';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { Navigation } from '@/layouts/Navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { SnippetResource } from '@/models/SnippetResource';
import { ShowcaseCard } from '@/components/ShowcaseCard';
import { snippetsPageStyles } from './page.css';

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
  const list = await SnippetResource.getLocalizedList(locale);
  const cards = await Promise.all(
    list.map(async (snippet) => (
      <ShowcaseCard
        key={await snippet.id}
        resource={snippet}
        pathname="/snippets"
      />
    )),
  );
  return (
    <RootPageLayout theme="snippets">
      <Navigation />
      <PageLayout>
        <div className={snippetsPageStyles}>
          {cards.length === 0
            ? <p>{translate('noSnippets')}</p>
            : (
              <>
                {cards}
              </>
            )}
        </div>
      </PageLayout>
    </RootPageLayout>
  );
}
