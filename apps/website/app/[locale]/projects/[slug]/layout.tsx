import { Navigation } from '@/layouts/Navigation';
import { RootPageLayout } from '@/layouts/RootPageLayout';
import { ProjectResource } from '@/models/ProjectResource';
import { locales } from '@/i18n/locales';
import { extendPathname } from '@/utils/routes';
import { normalizeNavigationList } from '@/navigation/utils';

export default async function ProjectLayout({ children, params }: LayoutProps<'/[locale]/projects/[slug]'>) {
  const { locale, slug } = await params;
  const project = await ProjectResource.fromSlug(slug, locale);
  if (!project) {
    return children;
  }

  const [id, projectSlug, subpages] = await Promise.all([
    project.id,
    project.slug,
    project.subpages,
  ]);
  const localeParams = Object.fromEntries(await Promise.all(
    locales.map(async (targetLocale) => {
      const target = await ProjectResource.fromId(id, targetLocale);
      return [targetLocale, { slug: target ? await target.slug : projectSlug }];
    }),
  ));
  const href = extendPathname.bind(undefined, `/projects/${projectSlug}`);
  const navigation = subpages.length === 0
    ? []
    : normalizeNavigationList(await Promise.all([
      Promise.resolve({
        text: 'Summary',
        theme: 'projects' as const,
        href: `/projects/${projectSlug}`,
      }),
      ...subpages.map(async ({ slug: pageSlug }) => ({
        text: (await project.getPage(pageSlug))?.title ?? pageSlug,
        theme: 'projects' as const,
        href: href(pageSlug),
      })),
    ]));

  return (
    <RootPageLayout theme="projects">
      <Navigation localeParams={localeParams}>
        {navigation.length > 0
          ? <Navigation.List list={navigation} strictMatch />
          : null}
      </Navigation>
      {children}
    </RootPageLayout>
  );
}
