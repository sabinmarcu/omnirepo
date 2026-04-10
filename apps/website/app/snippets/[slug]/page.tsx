import type {
  Metadata,
} from 'next';
import { redirect404 } from '@/utils/routes.ssr';
import { ShowcaseLayout } from '@/layouts/ShowcaseLayout';
import { SnippetResource } from '@/models/SnippetResource';

export async function generateMetadata({ params }: PageProps<'/snippets/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const snippet = await SnippetResource.fromSlug(slug);
  if (!snippet) {
    return {};
  }
  return {
    title: snippet.title,
  };
}

export default async function SnippetPage(
  { params }: PageProps<'/snippets/[slug]'>,
) {
  const { slug } = await params;
  const snippet = await SnippetResource.fromSlug(slug);
  if (!snippet) {
    return redirect404();
  }
  const { showcase: { Component: ShowcasePage } } = snippet;

  return (
    <ShowcaseLayout>
      <ShowcasePage />
    </ShowcaseLayout>
  );
}
