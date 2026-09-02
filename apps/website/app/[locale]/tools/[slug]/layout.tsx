import { Navigation } from '@/layouts/Navigation';
import { locales } from '@/i18n/locales';
import { ToolResource } from '@/models/ToolResource';

export default async function ToolsPageLayout({
  children,
  params,
}: LayoutProps<'/[locale]/tools/[slug]'>) {
  const { slug, locale } = await params;
  const tool = await ToolResource.fromSlug(slug, locale);
  if (!tool) {
    return children;
  }

  const id = await tool.id;
  const localeParams = Object.fromEntries(
    await Promise.all(locales.map(async (targetLocale) => {
      const target = await ToolResource.fromId(id, targetLocale);
      return [targetLocale, {
        slug: target ? await target.slug : slug,
      }];
    })),
  );

  return (
    <>
      <Navigation localeParams={localeParams} />
      {children}
    </>
  );
}
