import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DeckPrint } from '@/components/slides/DeckPrint';
import { isLocale } from '@/i18n/locales';
import { canonicalMetadata } from '@/i18n/metadata';
import { Navigation } from '@/layouts/Navigation';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { SlideDeckResource } from '@/models/SlideDeckResource';
import { redirect404 } from '@/utils/routes.ssr';

export async function generateMetadata(
  { params }: PageProps<'/[locale]/slides/[slug]/print'>,
): Promise<Metadata> {
  const { locale, slug } = await params;
  const deck = await SlideDeckResource.fromSlug(slug, locale);
  if (!deck) return {};
  const translate = await getTranslations('slides');
  const localizedPathnames = Object.fromEntries(await Promise.all(
    (await deck.variants).map(async (variant) => [
      await variant.locale,
      `/slides/${await variant.slug}`,
    ]),
  ));
  return {
    title: `${await deck.title} — ${translate('print')}`,
    robots: {
      index: false,
      follow: true,
    },
    ...await canonicalMetadata(locale, `/slides/${await deck.slug}`, localizedPathnames),
  };
}

export default async function SlideDeckPrintPage(
  { params }: PageProps<'/[locale]/slides/[slug]/print'>,
) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return redirect404();
  const deck = await SlideDeckResource.fromSlug(slug, locale);
  if (!deck) return redirect404();

  const [translate, title, printSlides, variants] = await Promise.all([
    getTranslations('slides'),
    deck.title,
    deck.printSlides,
    deck.variants,
  ]);
  const localeParams = Object.fromEntries(await Promise.all(
    variants.map(async (variant) => [
      await variant.locale,
      { slug: await variant.slug },
    ]),
  ));

  return (
    <RootPageLayout theme="slides">
      <Navigation empty localeParams={localeParams} />
      <DeckPrint
        instructions={translate('printInstructions')}
        slides={printSlides}
        title={title}
      />
    </RootPageLayout>
  );
}
