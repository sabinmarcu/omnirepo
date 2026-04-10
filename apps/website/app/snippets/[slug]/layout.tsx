import { Navigation } from '@/layouts/Navigation';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { extendPathname } from '@/utils/routes';
import { normalizeNavigationList } from '@/navigation/utils';
import { SnippetResource } from '@/models/SnippetResource';

export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  return SnippetResource.slugs;
}

export default async function SnippetLayoutPage({ params, children }: LayoutProps<'/snippets/[slug]'>) {
  const { slug } = await params;
  const snippet = await SnippetResource.fromSlug(slug);
  if (!snippet) {
    return null;
  }
  const getSlug = extendPathname.bind(undefined, `/snippets/${slug}`);

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
    <RootPageLayout theme="snippets">
      <Navigation>
        <Navigation.List list={sublist} strictMatch />
      </Navigation>
      {children}
    </RootPageLayout>
  );
}
