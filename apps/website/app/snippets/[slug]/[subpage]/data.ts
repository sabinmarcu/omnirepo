import { resolveSnippet } from '../data';

export async function resolveSnippetPage(
  props: (
    | LayoutProps<'/snippets/[slug]/[subpage]'>
    | PageProps<'/snippets/[slug]/[subpage]'>
  ),
  options: (
    & Omit<Parameters<typeof resolveSnippet>[1], 'onSuccess'>
    & {
      onSuccess: (
        subpage: Parameters<Parameters<typeof resolveSnippet>[1]['onSuccess']>[0]['pages'][number],
        snippet: Parameters<Parameters<typeof resolveSnippet>[1]['onSuccess']>[0]
      ) => any
    }
  ),
) {
  const { onError, onSuccess } = options;
  return resolveSnippet(
    props as any,
    {
      onError,
      onSuccess: async (snippet) => {
        const { subpage: subpageSlug } = await props.params;
        const subpage = snippet.pages.find(({ slug: pageSlug }) => pageSlug === subpageSlug);

        if (!subpage) {
          return onError();
        }

        return onSuccess(subpage, snippet);
      },
    },
  );
}
