import { Navigation } from '@/layouts/Navigation';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { extendPathname } from '@/utils/routes';
import { normalizeNavigationList } from '@/navigation/utils';
import { locales } from '@/i18n/locales';
import { SnippetResource } from '@/models/SnippetResource';

// export const dynamicParams = false;
// export const dynamic = 'force-static';
//
// export async function generateStaticParams() {
//   return SnippetResource.slugs;
// }

export default async function SnippetLayoutPage({ params, children }: LayoutProps<'/[locale]/snippets/[slug]'>) {
  const { slug, locale } = await params;
  const snippet = await SnippetResource.fromSlug(slug, locale);
  if (!snippet) {
    return null;
  }
  const [id, snippetSlug] = await Promise.all([
    snippet.id,
    snippet.slug,
  ]);
  const localeParams = Object.fromEntries(
    await Promise.all(locales.map(async (targetLocale) => {
      const target = await SnippetResource.fromId(id, targetLocale);
      return [targetLocale, {
        slug: target ? await target.slug : snippetSlug,
      }];
    })),
  );
  const getSlug = extendPathname.bind(undefined, `/snippets/${snippetSlug}`);
  const files = await snippet.files;

  const sublist = normalizeNavigationList(
    await Promise.all(
      files.map(async ({
        title,
        slug: pageSlug,
      }) => ({
        text: await title,
        theme: 'snippets',
        href: getSlug(await pageSlug),
      })),
    ),
  );

  return (
    <RootPageLayout theme="snippets">
      <Navigation localeParams={localeParams}>
        <Navigation.List list={sublist} strictMatch />
      </Navigation>
      {children}
    </RootPageLayout>
  );
}
