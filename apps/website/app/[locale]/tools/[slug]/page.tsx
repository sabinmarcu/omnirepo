import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import { canonicalMetadata } from '@/i18n/metadata';
import { ShowcaseLayout } from '@/layouts/ShowcaseLayout';
import { ToolResource } from '@/models/ToolResource';

// No generateStaticParams here: the root layout reads `headers()` for host-based
// canonical/robots metadata, so this route can never be prerendered.

export async function generateMetadata(props: PageProps<'/[locale]/tools/[slug]'>): Promise<Metadata> {
  const { slug, locale } = await props.params;
  const tool = await ToolResource.fromSlug(slug, locale);
  if (tool) {
    const localizedPathnames = Object.fromEntries(
      await Promise.all((await tool.variants).map(async (variant) => [
        await variant.locale,
        `/tools/${await variant.slug}`,
      ])),
    );
    return {
      title: await tool.title,
      ...await canonicalMetadata(
        locale,
        `/tools/${await tool.slug}`,
        localizedPathnames,
      ),
    };
  }
  return {};
}

export default async function ToolPage(
  props: PageProps<'/[locale]/tools/[slug]'>,
) {
  const { slug, locale } = await props.params;
  const tool = await ToolResource.fromSlug(slug, locale);
  if (!tool) {
    return redirect404();
  }
  const showcase = await tool.showcase;
  const ShowcasePage = await showcase.Component;
  return (
    <ShowcaseLayout>
      <ShowcasePage />
    </ShowcaseLayout>
  );
}
