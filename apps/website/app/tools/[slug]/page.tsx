import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import {
  toolSlugs,
} from '@/data/tools/tools';
import { ShowcaseLayout } from '@/layouts/ShowcaseLayout';
import { resolveTool } from './data';

export async function generateStaticParams() {
  return toolSlugs;
}

export async function generateMetadata(props: PageProps<'/tools/[slug]'>): Promise<Metadata> {
  return resolveTool(
    props,
    {
      onError: () => {},
      onSuccess: (tool) => ({
        title: tool.metadata?.title ?? 'Unknown Tool',
      }),

    },
  );
}

export default async function ToolPage(
  props: PageProps<'/tools/[slug]'>,
) {
  return resolveTool(
    props,
    {
      onError: () => redirect404(),
      onSuccess: async (tool) => {
        const { showcase: ShowcasePage } = tool;

        return (
          <ShowcaseLayout>
            <ShowcasePage />
          </ShowcaseLayout>
        );
      },
    },
  );
}
