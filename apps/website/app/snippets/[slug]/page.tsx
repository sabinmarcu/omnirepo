import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import { readContent } from '@/content/readContent';
import z from 'zod';
import {
  getSnippet,
  snippetSlugs,
} from '../data';

export async function generateStaticParams() {
  return snippetSlugs;
}

export async function generateMetadata({ params }: PageProps<'/snippets/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const snippet = getSnippet(slug) ?? { title: 'Unknown Page' };
  return {
    title: snippet.title,
  };
}

export default async function SnippetPage(
  { params }: PageProps<'/snippets/[slug]'>,
) {
  const { slug } = await params;
  const snippet = getSnippet(slug);

  if (!snippet) {
    return redirect404();
  }

  const { path } = snippet;
  const { data } = await readContent(path, {
    schema: z.object({
      props: z.object({
        children: z.any(),
      }).optional(),
      children: z.any().optional(),
    }),
  });

  const children = data.children ?? data.props?.children;

  return children;
}
