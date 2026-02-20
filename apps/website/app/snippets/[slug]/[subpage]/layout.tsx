import { PageLayout } from '@/layouts/PageLayout';
import { PageTOCLayout } from '@/layouts/PageTOCLayout';
import { Typography } from '@/components/mdx/Typography';
import { resolveSnippetPage } from './data';
import { snippetLayoutPageStyles } from './layout.css';

export default async function SnippetLayoutPage(props: LayoutProps<'/snippets/[slug]/[subpage]'>) {
  return resolveSnippetPage(props, {
    onError: () => null,
    onSuccess: (subpage, snippet) => {
      const { children } = props;
      const title = snippet.metadata?.title ?? 'Overview';
      if (subpage.slug === 'overview') {
        return (
          <PageTOCLayout className={snippetLayoutPageStyles}>
            <Typography as="h1">{title}</Typography>
            {children}
          </PageTOCLayout>
        );
      }

      const Layout = (Array.isArray(subpage.content) && subpage.content.length > 1)
        ? PageTOCLayout
        : PageLayout;
      return (
        <Layout className={snippetLayoutPageStyles}>
          <Typography as="h1">Source: {subpage.title}</Typography>
          {children}
        </Layout>
      );
    },
  });
}
