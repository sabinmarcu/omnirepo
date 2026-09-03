import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import { canonicalMetadata } from '@/i18n/metadata';
import { ShowcaseLayout } from '@/layouts/ShowcaseLayout';
import { SnippetResource } from '@/models/SnippetResource';
import { RelatedContent } from '@/components/RelatedContent';
import { isLocale } from '@/i18n/locales';

export async function generateMetadata({ params }: PageProps<'/[locale]/snippets/[slug]'>): Promise<Metadata> {
  const { slug, locale } = await params;
  const snippet = await SnippetResource.fromSlug(slug, locale);
  if (!snippet) {
    return {};
  }
  const localizedPathnames = Object.fromEntries(
    await Promise.all((await snippet.variants).map(async (variant) => [
      await variant.locale,
      `/snippets/${await variant.slug}`,
    ])),
  );
  return {
    title: await snippet.title,
    ...await canonicalMetadata(
      locale,
      `/snippets/${await snippet.slug}`,
      localizedPathnames,
    ),
  };
}

export default async function SnippetPage(
  { params }: PageProps<'/[locale]/snippets/[slug]'>,
) {
  const { slug, locale } = await params;
  const snippet = await SnippetResource.fromSlug(slug, locale);
  if (!snippet) {
    return redirect404();
  }
  if (!isLocale(locale)) {
    return redirect404();
  }
  const showcase = await snippet.showcase;
  const ShowcasePage = await showcase.Component;
  const id = await snippet.id;

  return (
    <ShowcaseLayout>
      <ShowcasePage />
      <RelatedContent locale={locale} entryIds={[`snippet:${id}`]} />
    </ShowcaseLayout>
  );
}
