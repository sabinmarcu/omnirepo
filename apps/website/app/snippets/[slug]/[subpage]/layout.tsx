import { PageLayout } from '@/layouts/PageLayout';
import { PageTOCLayout } from '@/layouts/PageTOCLayout';
import { Typography } from '@/components/mdx/Typography';
import { SnippetResource } from '@/models/SnippetResource';
import { snippetLayoutPageStyles } from './layout.css';

export const dynamic = 'force-dynamic';

export default async function SnippetLayoutPage(props: LayoutProps<'/snippets/[slug]/[subpage]'>) {
  const { params, children } = props;
  const { slug, subpage } = await params;

  const snippet = await SnippetResource.fromSlug(slug);
  if (!snippet) {
    return null;
  }

  const page = snippet.getPage(subpage);
  if (!page) {
    return null;
  }

  const { title } = snippet;
  if (page.slug === 'overview') {
    return (
      <PageTOCLayout className={snippetLayoutPageStyles}>
        <Typography as="h1">{title}</Typography>
        {children}
      </PageTOCLayout>
    );
  }
  const { content } = page;

  const Layout = (Array.isArray(content) && content.length > 1)
    ? PageTOCLayout
    : PageLayout;
  return (
    <Layout className={snippetLayoutPageStyles}>
      <Typography as="h1">Source: {page.title}</Typography>
      {children}
    </Layout>
  );
}
