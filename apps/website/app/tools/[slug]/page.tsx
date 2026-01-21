import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import { ShowcaseLayout } from '@/layouts/ShowcaseLayout';
import { ToolResource } from '@/models/ToolResource';

// export const dynamicParams = false;
// export const dynamic = 'force-static';

export async function generateStaticParams() {
  return ToolResource.slugs;
}

export async function generateMetadata(props: PageProps<'/tools/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const tool = await ToolResource.fromSlug(slug);
  if (tool) {
    return { title: await tool.title };
  }
  return {};
}

export default async function ToolPage(
  props: PageProps<'/tools/[slug]'>,
) {
  const { slug } = await props.params;
  const tool = await ToolResource.fromSlug(slug);
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
