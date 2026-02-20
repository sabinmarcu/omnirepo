import { getSnippet } from '@/data/snippets/snippets';

export async function resolveSnippet(
  { params }: (
    | LayoutProps<'/snippets/[slug]'>
    | PageProps<'/snippets/[slug]'>
  ),
  options: {
    onError: () => any,
    onSuccess: (snippet: Exclude<
      Awaited<ReturnType<typeof getSnippet>>,
      undefined
    >) => any
  },
) {
  const { onError, onSuccess } = options;

  const { slug } = await params;
  const snippet = await getSnippet(slug);

  if (!snippet) {
    return onError();
  }

  return onSuccess(snippet);
}
