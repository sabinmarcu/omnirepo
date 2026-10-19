import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DeckRead } from '@/components/slides/DeckRead';
import { deckReadTagsStyle } from '@/components/slides/DeckRead.css';
import { TagPill } from '@/components/TagPill';
import { TranslationFallbackNotice } from '@/i18n/TranslationFallbackNotice';
import { isLocale } from '@/i18n/locales';
import { canonicalMetadata } from '@/i18n/metadata';
import { Navigation } from '@/layouts/Navigation';
import { TOCLayout } from '@/layouts/TOCLayout';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { formatContentDate } from '@/models/ContentResource';
import { SlideDeckResource } from '@/models/SlideDeckResource';
import { tagLabel } from '@/models/TagRegistry';
import { redirect404 } from '@/utils/routes.ssr';

export async function generateMetadata(
  { params }: PageProps<'/[locale]/slides/[slug]'>,
): Promise<Metadata> {
  const { locale, slug } = await params;
  const deck = await SlideDeckResource.fromSlug(slug, locale);
  if (!deck) return {};
  const localizedPathnames = Object.fromEntries(await Promise.all(
    (await deck.variants).map(async (variant) => [
      await variant.locale,
      `/slides/${await variant.slug}`,
    ]),
  ));
  return {
    title: await deck.title,
    description: await deck.description,
    ...await canonicalMetadata(locale, `/slides/${await deck.slug}`, localizedPathnames),
  };
}

export default async function SlideDeckPage({ params }: PageProps<'/[locale]/slides/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return redirect404();
  const deck = await SlideDeckResource.fromSlug(slug, locale);
  if (!deck) return redirect404();

  const [
    translate,
    translateMetadata,
    title,
    description,
    createdAt,
    modifiedAt,
    tags,
    slides,
    toc,
    variants,
  ] = await Promise.all([
    getTranslations('slides'),
    getTranslations('projects'),
    deck.title,
    deck.description,
    deck.createdAt,
    deck.modifiedAt,
    deck.tags,
    deck.slides,
    deck.readerToc,
    deck.variants,
  ]);
  const localeParams = Object.fromEntries(await Promise.all(
    variants.map(async (variant) => [
      await variant.locale,
      { slug: await variant.slug },
    ]),
  ));
  const readHref = `/slides/${await deck.slug}`;

  return (
    <RootPageLayout theme="slides">
      <Navigation localeParams={localeParams} />
      <TOCLayout toc={toc}>
        <TranslationFallbackNotice locale={locale} resource={deck} />
        <DeckRead
          description={description}
          dates={translateMetadata('createdAndLastUpdated', {
            createdAt: formatContentDate(createdAt, locale),
            modifiedAt: formatContentDate(modifiedAt, locale),
          })}
          metadata={(
            <div className={deckReadTagsStyle}>
              {tags.map((tag) => (
                <TagPill key={tag} id={tag} label={tagLabel(tag, (id) => id)} />
              ))}
            </div>
          )}
          modeLabels={{
            present: translate('present'),
            print: translate('print'),
          }}
          modeLinks={{
            present: `${readHref}/present`,
            print: `${readHref}/print`,
          }}
          slideCount={translate('slideCount', { count: slides.length })}
          slides={slides}
          title={title}
        />
      </TOCLayout>
    </RootPageLayout>
  );
}
