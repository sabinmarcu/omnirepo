import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import {
  snippetSlugs,
} from '@/data/snippets/snippets';
import { Code } from '@/components/Code';
import { resolveSnippetPage } from './data';

export async function generateStaticParams() {
  return snippetSlugs;
}

export async function generateMetadata(props: PageProps<'/snippets/[slug]/[subpage]'>): Promise<Metadata> {
  return resolveSnippetPage(props, {
    onError: () => ({}),
    onSuccess: (subpage) => ({
      title: subpage.title,
    }),
  });
}

export default async function SnippetPageSubpage(
  props: PageProps<'/snippets/[slug]/[subpage]'>,
) {
  return resolveSnippetPage(props, {
    onError: () => redirect404(),
    onSuccess: async (subpage) => {
      if (subpage.content
        && typeof subpage.content === 'object'
        && 'value' in subpage.content
      ) {
        return (
          <Code code={subpage.content} />
        );
      }

      return subpage.content;
    },
  });
}
