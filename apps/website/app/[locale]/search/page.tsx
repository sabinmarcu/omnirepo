import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SearchPageClient } from '@/components/search/SearchPageClient';
import { isLocale } from '@/i18n/locales';
import {
  getPathname,
} from '@/i18n/navigation';
import { canonicalMetadata } from '@/i18n/metadata';
import { Navigation } from '@/layouts/Navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { redirect404 } from '@/utils/routes.ssr';
import { searchPageStyle } from './page.css';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/search'>): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Search',
    ...await canonicalMetadata(locale, '/search'),
  };
}

export default async function SearchPage({
  params,
}: PageProps<'/[locale]/search'>) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return redirect404();
  }
  const translate = await getTranslations('search');
  const corpusUrl = getPathname({
    locale,
    href: '/search-index',
  });

  return (
    <>
      <Navigation />
      <PageLayout>
        <main className={searchPageStyle}>
          <h1>{translate('title')}</h1>
          <SearchPageClient corpusUrl={corpusUrl} />
        </main>
      </PageLayout>
    </>
  );
}
