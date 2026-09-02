import type { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { canonicalMetadata } from '@/i18n/metadata';
import { siblingContentLocales } from '@/i18n/contentVariants';
import { LocaleSuggestionBanner } from '@/i18n/LocaleSuggestionBanner';
import { experimentEnabled } from '@/experiments/utils';
import BioPageEnglish, { title as englishTitle } from './content.mdx';
import BioPageRomanian, { title as romanianTitle } from './content.ro.mdx';
import { bioPageStyles } from './page.css';

const availableLocales = siblingContentLocales('app/[locale]/personal/content.mdx');

export async function generateMetadata(
  { params }: PageProps<'/[locale]/personal'>,
): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ro' ? romanianTitle : englishTitle;
  return {
    title,
    ...await canonicalMetadata(
      locale,
      '/personal',
      Object.fromEntries(availableLocales.map((variantLocale) => [variantLocale, '/personal'])),
    ),
  };
}

export default async function PersonalHomepage({
  params,
}: PageProps<'/[locale]/personal'>) {
  const { locale } = await params;
  const showLanguageSuggestionBanner = await experimentEnabled('languageSuggestionBanner');
  const BioPage = locale === 'ro' ? BioPageRomanian : BioPageEnglish;
  return (
    <PageLayout>
      <div className={bioPageStyles}>
        {showLanguageSuggestionBanner
          ? <LocaleSuggestionBanner pathname="/personal" availableLocales={availableLocales} />
          : null}
        <BioPage />
      </div>
    </PageLayout>
  );
}
