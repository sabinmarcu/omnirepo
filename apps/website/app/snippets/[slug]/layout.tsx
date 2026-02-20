import { Navigation } from '@/layouts/Navigation';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { getPathname } from '@/utils/routes.ssr';
import { extendPathname } from '@/utils/routes';
import { normalizeNavigationList } from '@/navigation/utils';
import { resolveSnippet } from './data';

export default async function SnippetLayoutPage(params: LayoutProps<'/snippets/[slug]'>) {
  return resolveSnippet(
    params,
    {
      onError: async () => null,
      onSuccess: async (snippet) => {
        const pathname = await getPathname();
        const rootPathname = pathname.match(
          /(\/?snippets\/[^/]+)/,
        )![0];
        const getSlug = extendPathname.bind(undefined, rootPathname);

        const sublist = normalizeNavigationList(
          snippet.pages.map(({
            title,
            slug: pageSlug,
          }) => ({
            text: title,
            theme: 'snippets',
            href: getSlug(pageSlug),
          })),
        );

        const { children } = params;

        return (
          <RootPageLayout>
            <Navigation>
              <Navigation.List list={sublist} strictMatch />
            </Navigation>
            {children}
          </RootPageLayout>
        );
      },
    },
  );
}
