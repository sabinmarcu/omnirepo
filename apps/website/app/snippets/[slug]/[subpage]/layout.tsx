import { PageLayout } from '@/layouts/PageLayout';
import { PageTOCLayout } from '@/layouts/PageTOCLayout';
import { Typography } from '@/components/mdx/Typography';
import { resolveSnippetPage } from './data';

export default async function SnippetLayoutPage(props: LayoutProps<'/snippets/[slug]/[subpage]'>) {
  return resolveSnippetPage(props, {
    onError: () => null,
    onSuccess: (subpage, snippet) => {
      const { children } = props;
      const title = snippet.metadata?.title ?? 'Overview';
      if (subpage.slug === 'overview') {
        return (
          <PageTOCLayout>
            <Typography as="h1">{title}</Typography>
            {children}
          </PageTOCLayout>
        );
      }

      return (
        <PageLayout>
          <Typography as="h1">Source: {subpage.title}</Typography>
          {children}
        </PageLayout>
      );
    },
  });
}
