import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import {
  snippetSlugs,
} from '@/data/snippets/snippets';
import { ShowcaseLayout } from '@/layouts/ShowcaseLayout';
import { resolveSnippet } from './data';

export async function generateStaticParams() {
  return snippetSlugs;
}

export async function generateMetadata(props: PageProps<'/snippets/[slug]'>): Promise<Metadata> {
  return resolveSnippet(
    props,
    {
      onError: () => {},
      onSuccess: (snippet) => ({
        title: snippet.metadata?.title ?? 'Unknown Snippet',
      }),

    },
  );
}

export default async function SnippetPage(
  props: PageProps<'/snippets/[slug]'>,
) {
  return resolveSnippet(
    props,
    {
      onError: () => redirect404(),
      onSuccess: async (snippet) => {
        const { content: PreviewPage } = snippet.pages.find(({ slug: pageSlug }) => pageSlug === '') as any;

        return (
          <ShowcaseLayout>
            <PreviewPage />
          </ShowcaseLayout>
        );
      },
    },
  );
}
