import { Navigation } from '@/layouts/Navigation';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { getPathname } from '@/utils/routes.ssr';
import { extendPathname } from '@/utils/routes';
import { normalizeNavigationList } from '@/navigation/utils';
import { SnippetResource } from '@/models/SnippetResource';

export default async function SnippetLayoutPage({ params, children }: LayoutProps<'/snippets/[slug]'>) {
  const { slug } = await params;
  const snippet = await SnippetResource.fromSlug(slug);
  if (!snippet) {
    return null;
  }
  const pathname = await getPathname();
  const rootPathname = pathname.match(
    /(\/?snippets\/[^/]+)/,
  )![0];
  const getSlug = extendPathname.bind(undefined, rootPathname);

  const sublist = normalizeNavigationList(
    snippet.files.map(({
      title,
      slug: pageSlug,
    }) => ({
      text: title,
      theme: 'snippets',
      href: getSlug(pageSlug),
    })),
  );

  return (
    <RootPageLayout>
      <Navigation>
        <Navigation.List list={sublist} strictMatch />
      </Navigation>
      {children}
    </RootPageLayout>
  );
}
